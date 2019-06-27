import * as React from 'react';
import { Modal } from 'react-native';

import { themeService, fontService, accountingService } from '../../../Services';

import { Container, Text, View, Content, Card, CardItem, Body, Left, Right} from 'native-base';
import IconEn from 'react-native-vector-icons/Entypo';
import IconFa from 'react-native-vector-icons/FontAwesome';
import { TouchableWithoutFeedback } from 'react-native';
import {ModalAlertComponent} from '../../Shared/ModalAlert/ModalAlertModule';
import {ModalEditComponent} from '../../Shared/ModalEdit/ModalEditModule';


// interface order {
//   item: string; amount: number; price: string | number;
// }
interface props {
  status: string;
  customerName: string;
  customerPhone?: string | number;
  orderNumber: string | number;
  orderDate: string;
  orderTime: string;
  orderList: Array<any>;
  totalQuantity: number;
  totalPrice: number | string;
  onConfirm?: () => void;
  onReady?: () => void;
  onFinish?: () => void;
  onCall?: () => void;
  onPrint?: () => void;
  onNotif?: () => void;
  onEditInit?: () => void;
  onEdit?: [{
    plus: () => void,
    min: () => void,
    setZero: () => void,
  }];
  onEditCancelOrder?: () => void;
  onEditSave?: () => void;
  onEditUndo?: () => void;
  onChangeText?: (text: any) => any;
}


export class OrderCardComponent extends React.Component<props, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      detail: true,
      modalPhoneShow: false,
      modalEditShow: false,
      modalPrintShow: false,
      modalConfirmShow: false,
      modalReadyShow: false,
      modalFinishShow: false,
      modalNotifShow: false,
      borderTopColor: 'red',
    };
  }

  styles = themeService.bind(this, 'orderCardPage');

  componentWillMount() {
    if (this.props.status === 'unconfirmed') {
      this.setState({borderTopColor: 'red'});
    } else if (this.props.status === 'confirmed') {
      this.setState({borderTopColor: 'blue'});
    } else {
      this.setState({borderTopColor: 'green'});
    }
  }

  toggleDetail() {
    this.setState({detail: !this.state.detail});
  }

  // Modal
  openModalPhone() {
    this.setState({modalPhoneShow: true});
  }
  openModalEdit() {
    this.props.onEditInit();
    this.setState({modalEditShow: true});
  }
  openModalConfirm() {
    this.setState({modalConfirmShow: true});
  }
  openModalReady() {
    this.setState({modalReadyShow: true});
  }
  openModalFinish() {
    this.setState({modalFinishShow: true});
  }
  openModalPrint() {
    this.setState({modalPrintShow: true});
  }
  openModalNotif() {
    this.setState({modalNotifShow: true});
  }
  closeModal() {
    this.setState({
      modalPhoneShow: false,
      modalEditShow: false,
      modalPrintShow: false,
      modalConfirmShow: false,
      modalReadyShow: false,
      modalFinishShow: false,
      modalNotifShow: false,
    });
  }

  onCall() {
    this.props.onCall();
    this.closeModal();
  }
  onConfirm() {
    this.props.onConfirm();
    this.closeModal();
  }
  onReady() {
    this.props.onReady();
    this.closeModal();
  }
  onPrint() {
    this.props.onPrint();
    this.closeModal();
  }
  onFinish() {
    this.props.onFinish();
    this.closeModal();
  }
  onNotif() {
    this.props.onNotif();
    this.closeModal();
  }

  _ModalAlertContent (type, content, submitLabel, onSubmit, onCancel) {
    return (
      <ModalAlertComponent
        type={type}
        content={content}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  _ModalContent (visible) {
    const {
      customerName, customerPhone, orderNumber, orderDate, orderTime,orderList, totalQuantity, totalPrice, status, onConfirm, onEdit, onEditCancelOrder, onEditSave, onEditUndo, onChangeText
    } = this.props;
    return (
      <Modal
        visible={visible}
        animationType={'fade'}
        onRequestClose={() => this.closeModal()}
        transparent
      >
      <Container style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <View style={{margin: 20, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2}}>
              {(this.state.modalPhoneShow) &&
                this._ModalAlertContent('phone', customerPhone, 'Call', () => this.onCall(), () => this.closeModal())
              }{(this.state.modalEditShow) &&
                <View>
                  <ModalEditComponent
                    orderList={orderList}
                    onEdit = {onEdit}
                    onCancel = {() => {
                      this.closeModal();
                      onEditUndo();
                    }}
                    onCancelOrder = {() => {
                      onEditCancelOrder();
                      this.closeModal();
                    }}
                    onEditSave = {() => {
                      this.closeModal();
                      onEditSave();
                      // this.onConfirm();
                    }}
                    orderNumber={orderNumber}
                    onChangeText={onChangeText}
                  />
                </View>
              }{(this.state.modalConfirmShow) &&
                this._ModalAlertContent('confirm', orderNumber, 'Confirm', () => this.onConfirm(), () => this.closeModal())
              }{(this.state.modalReadyShow) &&
                this._ModalAlertContent('ready', orderNumber, 'Confirm', () => this.onReady(), () => this.closeModal())
              }{(this.state.modalFinishShow) &&
                this._ModalAlertContent('finish', orderNumber, 'Ok', () => this.onFinish(), () => this.closeModal())
              }{(this.state.modalPrintShow) &&
                this._ModalAlertContent('print', orderNumber, 'Print', () => this.onPrint(), () => this.closeModal())
              }{(this.state.modalNotifShow) &&
                this._ModalAlertContent('notif', customerName, 'Notify', () => this.onNotif(), () => this.closeModal())
              }
          </View>
        </Content>
      </Container>
      </Modal>
    );
  }

  _buttonIcon (iconName, iconColor, func) {
    return (
      <View style={{margin: 8}}>
        <TouchableWithoutFeedback onPress={func}>
          <IconFa name={iconName} color={iconColor} size={fontService.xl}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const {
      customerName, customerPhone, orderNumber, orderDate, orderTime,orderList, totalQuantity, totalPrice, status, onConfirm, onEdit, onEditCancelOrder, onEditSave, onEditUndo,
    } = this.props;

    const { get } = this.styles;

    const buttonCall = this._buttonIcon('phone', 'blue', () => this.openModalPhone());
    const buttonEdit = this._buttonIcon('pencil', 'red', () => this.openModalEdit());
    const buttonConfirm = this._buttonIcon('check-circle', 'green', () => this.openModalConfirm());
    const buttonReady = this._buttonIcon('check-circle', 'green', () => this.openModalReady());
    const buttonFinish = this._buttonIcon('check-circle', 'green', () => this.openModalFinish());
    const buttonPrint = this._buttonIcon('print', 'red', () => this.openModalPrint());
    const buttonNotif = this._buttonIcon('bell-o', 'red', () => this.openModalNotif())

    return (
      <View>
        {/* Modal Content */}
        {this._ModalContent(this.state.modalPhoneShow)}
        {this._ModalContent(this.state.modalEditShow)}
        {this._ModalContent(this.state.modalConfirmShow)}
        {this._ModalContent(this.state.modalReadyShow)}
        {this._ModalContent(this.state.modalFinishShow)}
        {this._ModalContent(this.state.modalPrintShow)}
        {this._ModalContent(this.state.modalNotifShow)}

        <Card style={{borderTopWidth: 4, borderTopColor: this.state.borderTopColor}}>
          <CardItem style={get('borderBottom')}>
            <Left style={get('left')}>
              <TouchableWithoutFeedback onPress={() => this.toggleDetail()}>
                <View>
                {this.state.detail ? (
                  <IconEn name='chevron-down' size={fontService.xl}/>
                ) : (
                  <IconEn name='chevron-up' size={fontService.xl}/>
                )}
                </View>
              </TouchableWithoutFeedback>
            </Left>
            <Body style={{}}>
              <Text style={get('name')}>{customerName}</Text>
              <Text style={get('number')}>{orderNumber}</Text>
              <Text style={get('number')}>{orderDate} | {orderTime}</Text>
            </Body>
            <Right style={get('right')}>
              {buttonCall}
              {status === 'unconfirmed' &&
                <View style={{flexDirection: 'row'}}>
                  {buttonEdit}
                  {buttonConfirm}
                </View>
              }{status === 'confirmed' &&
                <View style={{flexDirection: 'row'}}>
                  {buttonPrint}
                  {buttonReady}
                </View>
              }{status === 'ready' &&
              <View style={{flexDirection: 'row'}}>
                {buttonNotif}
                {buttonFinish}
              </View>
            }
            </Right>
          </CardItem>
          {(this.state.detail) &&
            orderList.map((order) => (
              <CardItem style={get('borderBottom')}>
                <Left style={get('left')}>
                  <Text>{order.qty}</Text>
                </Left>
                <Body style={{paddingHorizontal: 12}}>
                  <Text>{order.description}</Text>
                  {order.description2 &&
                    <Text style={get('description2')}>{order.description2}</Text>
                  }
                </Body>
                <Right style={get('right')}>
                  <Text>{accountingService.formatRp(order.total)}</Text>
                </Right>
              </CardItem>
            ))
          }
          {(this.state.detail) &&
            <CardItem style={[get('borderBottom'), {backgroundColor: '#eee'}]}>
              <Left style={get('left')}>
                <Text style={get('totalPrice')}>TOTAL</Text>
              </Left>
              <Body style={{alignItems: 'flex-end'}}>
                <View style={get('totalQuantity')}>
                <Text style={{color: 'blue'}}> {totalQuantity} </Text>
                </View>
              </Body>
              <Right style={get('right')}>
                <Text style={get('totalPrice')}> {accountingService.formatRp(totalPrice)} </Text>
              </Right>
            </CardItem>
          }
        </Card>
      </View>
    );
  }

}