import * as React from 'react';
import { Alert, Modal, RefreshControl, BackHandler } from 'react-native';

import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import * as IMEI from 'react-native-imei';

import { Container, Text, Content, View, Button } from 'native-base';
import SwitchSelector from 'react-native-switch-selector';
import { Observable } from 'rxjs/Observable';
import IconMi from 'react-native-vector-icons/MaterialIcons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { OrderCardComponent } from './OrderCard/OrderCardModule';
import { ModalAlertComponent } from '../Shared/ModalAlert/ModalAlertModule';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

import { printerRestService } from '../../Services/Printer';
import { themeService, pingService, pusherService } from '../../Services';
import { authenticationStorageService } from '../../Core/Services';
import { orderRestService } from '../../Services/Rest';
import { outletRestService } from '../../Services/Rest';
import RNNode from 'react-native-node';
import { PushController } from '../../Services/PushController';
import * as PushNotification from 'react-native-push-notification';

export class OrdersComponent extends React.Component<any, any> {

  defaultOrders: Array<any>;
  private backHandler;

  constructor(props: any) {
    super(props);
    this.state = {
      refreshing: false,
      outletName: '',
      outletId: '',
      ordersQueueShow: true,
      ordersReadyShow: false,
      modalPickUpAllShow: false,
      modalCancelOrderShow: false,
      modalConfirmOrderShow: false,
      editedOrderNumber: '',
      editedOrderId: null,
      editedOrderLines: [],
      imei: null,
      orders: [{ null: null }],
      loader: false,
      cancellationReason: '',
      outletOnline: false,
    };
    pusherService.bindChannelEvent('fnb.takeaway_order.new')
      .subscribe((data) => {
        this.onRefreshByPusher().then(() => {
          this.sendNotif('Pesanan baru telah tiba', `Order #${data.orderNumber}`, 'alert.wav')
        })
      });
    pusherService.bindChannelEvent('fnb.takeaway_order.cancel_by_user')
      .subscribe((data) => {
        this.onRefreshByPusher().then(() => {
          this.sendNotif('Pesanan telah dibatalkan', `Order #${data.orderNumber}`)
        });
      });
    pusherService.bindChannelEvent('fnb.takeaway_order.status_delivered')
      .subscribe((data) => {
        this.onRefreshByPusher().then(() => {
          this.sendNotif('Pesanan telah sampai ditujuan', `Order #${data.orderNumber}`)
        });
      });
  };

  sendNotif(title: string, message: string, soundName: string = 'default') {
    PushNotification.localNotification({ title, message, soundName });
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      orderRestService.getActiveOrders(this.state.outletId)
        .subscribe(res => {
          this.setState({
            refreshing: false,
            orders: res,
          });
          this.defaultOrders = res;
          console.log(this.state.orders);
        })
    }
    );
    authenticationStorageService.rememberedUsers.subscribe((res) => {
      console.log('rememberedUsers:');
      console.log(res);
    });
  }

  // component
  componentWillMount() {
    RNNode.start();
    this.setState({ loader: true }, () => {

      Observable.combineLatest(
        authenticationStorageService.selectedOutletName,
        authenticationStorageService.selectedOutlet,
      )
        .subscribe(([selectedOutletName, outletID]) => {
          this.setState({ outletName: selectedOutletName })
        }, err => this.setState({ loader: false }, () => console.log(err)));

      Observable.from(authenticationStorageService.selectedOutlet).subscribe(outletId => {
        if (outletId) {
          this.setState({ outletId: outletId, imei: IMEI.getImei() }, () => {
            console.log('outletId : ' + outletId);
          });
          this.loadData();
        } else {
          Actions.settingsPage();
        }
      }, err => console.log(err));

    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidMount() {
    pingService.doPing();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  loadData() {
    this.getOutletStatus();
    this.loadActiveOrders();
  }

  onRefreshByPusher() {
    return new Promise((resolve) => {
      this.getOutletStatus().then(() => {
        this.loadActiveOrders().then(() => {
          resolve(true)
        })
      })
    })
  }

  getOutletStatus() {
    return new Promise((resolve, reject) => {
      outletRestService.getOutletStatus(this.state.outletId).subscribe(res => {
        this.setState({
          outletOnline: res,
        }, () => resolve(true));
      });
    })
  }

  toggleOutletStatus(status) {
    outletRestService.toggleStatus(this.state.outletId, status);
  }

  loadActiveOrders() {
    return new Promise((resolve, reject) => {
      this.setState({ loader: true }, () => {
        orderRestService.getActiveOrders(this.state.outletId)
          .subscribe(res => {
            this.setState({
              loader: false,
              orders: res,
            }, () => resolve(true));
            this.defaultOrders = res;
            console.log(this.state.orders);
          });
      });
    })

  }

  filterArray(items, key, value) {
    return items.filter(item =>
      item[key] === value,
    );
  }

  toggleOrdersShow() {
    this.setState({
      ordersQueueShow: !this.state.ordersQueueShow,
      ordersReadyShow: !this.state.ordersReadyShow,
    });
  }

  changeOrderStatus(orderId, status) {
    const changedOrders = this.state.orders.map(order => (
      order.id === orderId ? { ...order, status: status } : order
    ));
    this.setState({ orders: changedOrders });
  }

  onCancelOrder(orderId) {
    this.changeOrderStatus(orderId, 'cancelled');
    orderRestService.markCancel(this.state.outletId, orderId, this.state.cancellationReason);
  }

  onEditSetZero(orderId, orderListIndex) {
    const editedOrders = _.cloneDeep(this.state.orders);
    const orderIndex = editedOrders?editedOrders.findIndex(order =>
      order.id === orderId,
    ):0;
    // qty set to 0
    editedOrders[orderIndex].lines[orderListIndex].qty = 0;
    this.setState({ orders: editedOrders });
  }

  onEditQuantity(orderId, orderListIndex, add) {
    const editedOrders = _.cloneDeep(this.state.orders);
    const orderIndex = editedOrders?editedOrders.findIndex(order =>
      order.id === orderId,
    ):0;
    // qty add +1 or -1
    editedOrders[orderIndex].lines[orderListIndex].qty += add;

    const editedQty = editedOrders[orderIndex].lines[orderListIndex].qty;
    const defaultQty = this.defaultOrders[orderIndex].lines[orderListIndex].qty;

    // if (editedQty < 0) {
    //   console.error('Quantity tidak boleh < 0 !!!');
    // } else if (editedQty <= defaultQty) {
    //   // console.log(editedOrders);
    //   this.setState({ orders: editedOrders });
    // } else {
    //   console.error('Quantity tidak boleh > Quantity Sebelumnya !!!');
    // }
    this.setState({ orders: editedOrders });
  }

  onEditUndo() {
    this.setState({ orders: this.defaultOrders });
  }

  onEditSave(orderId) {
    const editedOrders = _.cloneDeep(this.state.orders);
    const orderIndex = editedOrders?editedOrders.findIndex(order =>
      order.id === orderId,
    ):0;
    editedOrders[orderIndex].lines = editedOrders[orderIndex].lines.filter(orderLine =>
      orderLine.qty !== 0,
    );
    if (editedOrders[orderIndex].lines.length > 0) {
      // open modal confirm
      this.toggleModalConfirmOrder();
      this.setState({
        editedOrderLines: editedOrders[orderIndex].lines,
      }, () => {
        // console.log(this.state.editedOrderLines);
      });
    } else {
      // open modal cancel order
      this.toggleModalCancelOrder();
    }
  }

  onConfirmOrder(orderId) {
    this.changeOrderStatus(orderId, 'confirmed');
    orderRestService.markConfirmed(this.state.outletId, orderId).subscribe(() => {
      this.loadActiveOrders();
    });
  }

  onReadyOrder(orderId) {
    this.changeOrderStatus(orderId, 'ready');
    orderRestService.markReady(this.state.outletId, orderId)
  }

  onFinishOrder(orderId) {
    this.changeOrderStatus(orderId, 'closed');
    orderRestService.markClosed(this.state.outletId, orderId);
  }

  finishAllOrder() {
    const readyOrders = _.cloneDeep(this.filterArray(this.state.orders, 'status', 'ready'));
    readyOrders.forEach((order) => {
      this.onFinishOrder(order.id);
    });
  }

  onNotif(orderId) {
    orderRestService.notifyReady(this.state.outletId, orderId);
  }

  onCall(phoneNumber: string) {
    RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
  }

  toggleModalPickUpAll() {
    this.setState({
      modalPickUpAllShow: !this.state.modalPickUpAllShow
    });
  }

  toggleModalCancelOrder() {
    this.setState({
      modalCancelOrderShow: !this.state.modalCancelOrderShow
    });
  }

  toggleModalConfirmOrder() {
    this.setState({
      modalConfirmOrderShow: !this.state.modalConfirmOrderShow
    });
  }

  styles = themeService.bind(this, 'ordersPage');

  _SwitchSelector(initial) {
    return (
      <SwitchSelector
        style={{ borderWidth: 5 }}
        initial={initial}
        onPress={value => this.toggleOutletStatus(value)}
        textColor={'white'}
        selectedColor={'white'}
        backgroundColor={'#eee'}
        borderColor={'transparent'}
        height={27}
        animationDuration={150}
        options={[
          { label: 'Offline', value: false, activeColor: 'grey' },
          { label: 'Online', value: true, activeColor: '#3F51B5' },
        ]} />
    )
  }

  renderOrders(orders) {
    return (
      orders.map((order) => {
        return (
          <View padder>
            <OrderCardComponent
              status={order.status}
              customerName={order.customer.fullName}
              orderNumber={order.orderNumber}
              orderDate={order.orderDate}
              orderTime={order.orderTime.substring(0, 8)}
              customerPhone={'+' + order.customer.phoneNumber}
              orderList={order.lines}
              totalQuantity={order.totalLineQty}
              totalPrice={order.totalLineTaxableAmount}
              onConfirm={() => this.onConfirmOrder(order.id)}
              onReady={() => this.onReadyOrder(order.id)}
              onFinish={() => this.onFinishOrder(order.id)}
              onNotif={() => this.onNotif(order.id)}
              onCall={() => this.onCall(order.customer.phoneNumber)}
              onEditCancelOrder={() => this.onCancelOrder(order.id)}
              onChangeText={(text) => { this.setState({ cancellationReason: text }); }}
              onEditInit={() =>
                this.setState({
                  editedOrderNumber: order.orderNumber,
                  editedOrderId: order.id,
                })
              }
              onEdit={order.lines.map((oL, index) => {
                return {
                  plus: () => this.onEditQuantity(order.id, index, 1),
                  min: () => this.onEditQuantity(order.id, index, -1),
                  setZero: () => this.onEditSetZero(order.id, index),
                };
              })}
              onEditSave={() => this.onEditSave(order.id)}
              onEditUndo={() => this.onEditUndo()}
              onPrint={() => printerRestService.doPrint(order)}
            />
          </View>
        );
      })
    );
  }

  _ModalAfterEdit(visible, modalContent) {
    return (
      <Modal
        visible={visible}
        animationType={'fade'}
        onRequestClose={() => this.toggleModalPickUpAll()}
        transparent
      >
        <Container style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <Content contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2 }}>
              {modalContent}
            </View>
          </Content>
        </Container>
      </Modal>
    )
  }

  render() {
    const unconfirmedOrders = this.filterArray(this.state.orders, 'status', 'unconfirmed');
    const confirmedOrders = this.filterArray(this.state.orders, 'status', 'confirmed');
    const readyOrders = this.filterArray(this.state.orders, 'status', 'ready');
    const { get } = this.styles;

    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._onRefresh()}
            />
          }
        >

          {/* loader */}
          <Spinner visible={_.get(this.state, 'loader')} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />

          <View style={get('topContainer')}>
            <View style={get('merchantContainer')}>
              <Text><IconMi name='store' size={36} /></Text>
              <Text> {this.state.outletName} </Text>
            </View>
          </View>

          <View style={get('topMenuContainer')}>
            <View style={{ flexDirection: 'row' }}>
              <View style={get('switchOnline')}>
                {this.state.outletOnline &&
                  this._SwitchSelector(1)
                }
                {!this.state.outletOnline &&
                  this._SwitchSelector(0)
                }
              </View>
              <Button small onPress={() =>
                this.loadData()
              }>
                <View style={get('buttonRefresh')}>
                  <Text style={{ color: '#fff' }}><IconMi name='refresh' size={20} /></Text>
                  <Text style={{ color: '#fff' }}>Refresh </Text>
                </View>
              </Button>
            </View>
          </View>

          {/* exchange button unconfirmed/confirmed <=> ready */}
          <View padder>
            {this.state.ordersQueueShow &&
              <Button block onPress={() => this.toggleOrdersShow()}>
                <Text style={{ color: '#fff' }}>Order Queue ({unconfirmedOrders.length + confirmedOrders.length}) </Text>
                <IconFa name='exchange' size={20} color='#fff' />
              </Button>
            }
            {this.state.ordersReadyShow &&
              <Button block success onPress={() => this.toggleOrdersShow()}>
                <Text style={{ color: '#fff' }}>Order Ready ({readyOrders.length}) </Text>
                <IconFa name='exchange' size={20} color='#fff' />
              </Button>
            }
          </View>

          {/* unconfirmedOrders */}
          {this.state.ordersQueueShow &&
            <View>
              {unconfirmedOrders.length > 0 &&
                <View>
                  <Text style={[get('status'), get('red')]}>Waiting Confirmation</Text>
                  {this.renderOrders(unconfirmedOrders)}
                </View>
              }
            </View>
          }

          {/* confirmedOrders */}
          {this.state.ordersQueueShow &&
            <View>
              {confirmedOrders.length > 0 &&
                <View>
                  <Text style={[get('status'), get('blue')]}>Cooking</Text>
                  {this.renderOrders(confirmedOrders)}
                </View>
              }
            </View>
          }

          {/* readyOrders */}
          {this.state.ordersReadyShow &&
            <View>
              {readyOrders.length > 0 &&
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={[get('status'), get('green')]}>Ready</Text>
                    </View>
                    <View>
                      <Button success small style={{ marginTop: 20, marginRight: 12 }} onPress={() => this.toggleModalPickUpAll()}>
                        <Text> Clear All </Text>
                      </Button>
                    </View>
                  </View>
                  {this.renderOrders(readyOrders)}
                </View>
              }
            </View>
          }

          {/*
            Modal Pick Up All / finish all
            Modal Cancel Order after edit
            Modal Confirm Order after edit
          */}
          {this._ModalAfterEdit(
            this.state.modalPickUpAllShow,
            <ModalAlertComponent
              type={'finish'}
              content={'All Order'}
              submitLabel={'Ok'}
              onSubmit={() =>
                setTimeout(() => {
                  this.finishAllOrder();
                  setTimeout(() => {
                    this.toggleModalPickUpAll();
                    setTimeout(() => {
                      this.loadActiveOrders();
                    }, 250);
                  }, 250);
                }, 250)}
              onCancel={() => this.toggleModalPickUpAll()}
            />,
          )}
          {this._ModalAfterEdit(
            this.state.modalCancelOrderShow,
            <ModalAlertComponent
              type={'cancel'}
              content={this.state.editedOrderNumber}
              submitLabel={'Confirm'}
              onSubmit={() => {
                this.toggleModalCancelOrder();
                this.onCancelOrder(this.state.editedOrderId);
              }}
              onCancel={() => {
                this.toggleModalCancelOrder();
                this.onEditUndo();
              }}
              onChangeText={(text) => { this.setState({ cancellationReason: text }); }}
            />,
          )}
          {this._ModalAfterEdit(
            this.state.modalConfirmOrderShow,
            <ModalAlertComponent
              type={'confirm'}
              content={this.state.editedOrderNumber}
              submitLabel={'Confirm'}
              onSubmit={() => {
                this.toggleModalConfirmOrder();
                this.setState({ loader: true }, () => {
                  orderRestService.updateOrder(
                    this.state.outletId,
                    this.state.editedOrderId,
                    this.state.editedOrderLines,
                  ).subscribe(() => {
                    console.log('success save');
                    this.onConfirmOrder(this.state.editedOrderId);
                    this.setState({ loader: false });
                  }, error => {
                    // console.log(error.response.data[0].errorMessage);
                    Alert.alert(
                      'Edit Order #'+ this.state.editedOrderNumber +' failed!',
                      error.response.data[0].errorMessage
                    );
                    this.loadActiveOrders();
                    this.setState({ loader: false });
                  });
                });
              }}
              onCancel={() => {
                this.toggleModalConfirmOrder();
                this.onEditUndo();
              }}
            />,
          )}
        </Content>
        <PushController />
      </Container>
    );
  }

}
