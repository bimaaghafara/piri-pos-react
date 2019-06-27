import * as React from 'react';
import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Observable } from 'rxjs/Observable';
import { authenticationStorageService } from '../../Core/Services';
import { Toast, View, Text, Item, Input, Button, Content, Container, Card, Spinner as SpinnerLoadUser } from 'native-base';
import { themeService, accountingService } from '../../Services';
import * as IMEI from 'react-native-imei';
import { piriPayRestService } from '../../Services/Rest';
import Spinner from 'react-native-loading-spinner-overlay';


import {ModalPiriPayComponent} from './ModalPiriPay/ModalPiriPayModule';

export class PiriPayComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      outletID: null,
      loadUser: false,
      imei: null,
      query: '',
      user: null,
      amount: '',
      walletBalance: 0,
      customerName: '',
      pin: '',
      valid: null,
      loading: false,
      modalConfirmShow: false,
      modalSuccessShow: false,
      modalFailedShow: false,
      enableCustomTopup: false,
    }
  }
  styles = themeService.bind(this, 'piriPayPage');

  componentWillMount() {
    Observable.from(authenticationStorageService.selectedOutlet).subscribe(outletID => {
      if (outletID) {
        this.setState({ outletID: outletID, imei: IMEI.getImei() }, () => {

        })
      } else {
        Actions.settingsPage();
      }
    }, err => console.log(err));
  }

  onSearch() {
    this.setState({ user:null, loadUser: true }, () => {
      piriPayRestService.getUser(this.state.query)
        .subscribe(res =>
          this.setState({
            user: res,
            loadUser: false,
            walletBalance: res.walletBalance,
            customerName: res.fullName,
          }),
        err => {
          Toast.show({
            text: 'User not found',
          });
          this.setState({ loadUser: false });
        });
    });
  }

  lessThanMinimum() {
    return (this.state.amount === '' || parseInt(this.state.amount) < 10000);
  }

  moreThanMaximum() {
    return (parseInt(this.state.amount) + parseInt(this.state.walletBalance) > 1000000);
  }

  incorrectMultiplierValue() {
    //topup value must be multiply of IDR 10.000,-
    return (parseInt(this.state.amount) % 10000 !== 0);
  }

  emptySearchString() {
    return (this.state.query === '');
  }

  emptyPin() {
    return (this.state.pin === '');
  }

  onSubmit() {
    const data = {
      userId: _.get(this.state.user, 'id'),
      imei: this.state.imei,
      pinNumber: this.state.pin,
      amount: parseInt(this.state.amount)
    };
    this.closeModal();
    this.setState({ loading: true }, () => {
      piriPayRestService.topupWallet(this.state.outletID, data)
        .subscribe(res => {
          this.setState({ loading: false });
          console.log(res);
          this.openModalSuccess();
        }, err => {
          const errResponse = err.response.data;
          this.setState({ loading: false });
          console.log(errResponse);
          this.openModalFailed();
        });
    });
  }

  //#region modal
  openModalConfirm() {
    this.setState({
      modalConfirmShow: true,
      pin: '',
    });
  }
  openModalSuccess() {
    this.setState({
      modalSuccessShow: true,
    });
  }
  openModalFailed() {
    this.setState({
      modalFailedShow: true,
    });
  }
  closeModal() {
    this.setState({
      modalConfirmShow: false,
      modalSuccessShow: false,
      modalFailedShow: false,
    });
  }
  //#endregion modal

  //#region customRender
  renderUser(user) {
    return (
      <View>
        <View style={this.styles.get('space')} />
        <View style={this.styles.get('space')}>
          <Text style={this.styles.get('label')}>Customer Name</Text>
          <Item regular style={this.styles.get('input')}>
            <Input disabled value={_.get(user, 'fullName')} />
          </Item>
        </View>
        <View style={this.styles.get('space')}>
          <Text style={this.styles.get('label')}>Phone</Text>
          <Item regular style={this.styles.get('input')}>
            <Input disabled value={_.get(user, 'phoneNumber')} />
          </Item>
        </View>
        <View style={this.styles.get('space')}>
          <Text style={this.styles.get('label')}>Email</Text>
          <Item regular style={this.styles.get('input')}>
            <Input disabled value={_.get(user, 'email')} />
          </Item>
        </View>
        <View style={this.styles.get('space')}>
          <Text style={this.styles.get('label')}>Current Balance</Text>
          <Item regular style={this.styles.get('input')}>
            <Input disabled
              value={user && accountingService.ac.formatMoney(_.get(user, 'walletBalance'))} />
          </Item>
        </View>

      </View>
    )
  }

  renderCustomTopUpSpace(){
    return(
      <View style={this.styles.get('space')}>
        <Item regular style={this.styles.get('input')}>
          <Input 
            keyboardType='numeric'
            value={this.state.amount}
            onChangeText={(text) => this.setState({ amount: text })}
          />
        </Item>
        <Text style={this.styles.get('labelTermsAndConditions')}>*Nilai topup per-kelipatan 10.000,-</Text>
        <Text style={this.styles.get('labelTermsAndConditions')}>**Minimum topup adalah IDR 10.000,-</Text>
        <Text style={this.styles.get('labelTermsAndConditions')}>***Maksimum saldo adalah IDR 1.000.000,-</Text>
      </View>
    )
  }

  renderTopUpValue(user) {
    const { enableCustomTopup } = this.state;
    return (
      <View>
        <View style={this.styles.get('space')} />
        <View>
          <Text style={this.styles.get('label')}>Select a topup value (IDR) </Text>
        </View>
        <View style={[this.styles.get('rowForm'), { paddingLeft: 2 }]}>
          <Button full dark bordered={this.state.amount !== '50000'} info={this.state.amount === '50000'}
            onPress={() => this.setState({ amount: '50000', enableCustomTopup: false })}
            style={{ flexGrow: 1 }} >
            <Text> 50.000 </Text>
          </Button>
          <Button full dark bordered={this.state.amount !== '100000'} info={this.state.amount === '100000'}
            onPress={() => this.setState({ amount: '100000', enableCustomTopup: false })}
            style={{ flexGrow: 1, marginHorizontal: 8 }} >
            <Text> 100.000 </Text>
          </Button>
          <Button full dark bordered={this.state.amount !== '200000'} info={this.state.amount === '200000'}
            onPress={() => this.setState({ amount: '200000', enableCustomTopup: false })}
            style={{ flexGrow: 1 }} >
            <Text> 200.000 </Text>
          </Button>
        </View>
        <View style={[this.styles.get('rowForm'), { paddingLeft: 2 }]}>
          <Button full dark bordered={this.state.amount !== '250000'} info={this.state.amount === '250000'}
            onPress={() => this.setState({ amount: '250000', enableCustomTopup: false })}
            style={{ flexGrow: 1 }} >
            <Text> 250.000 </Text>
          </Button>
          <Button full dark bordered={this.state.amount !== '350000'} info={this.state.amount === '350000'}
            onPress={() => this.setState({ amount: '350000', enableCustomTopup: false })}
            style={{ flexGrow: 1, marginHorizontal: 8 }} >
            <Text> 350.000 </Text>
          </Button>
          <Button full dark bordered={this.state.amount !== '500000'} info={this.state.amount === '500000'}
            onPress={() => this.setState({ amount: '500000', enableCustomTopup: false })}
            style={{ flexGrow: 1 }} >
            <Text> 500.000 </Text>
          </Button>
        </View>
        <View style={[this.styles.get('rowForm'), { paddingLeft: 2 }]}>
          <Button full dark 
            bordered={this.state.enableCustomTopup === false} 
            danger={this.state.enableCustomTopup === true}
            onPress={() => this.setState({ amount: '', enableCustomTopup: true })}
            style={{ flexGrow: 1 }} >
            <Text> Custom Value </Text>
          </Button>
        </View>
        {enableCustomTopup && this.renderCustomTopUpSpace()}
        
        <View style={this.styles.get('space')} />
          <Button block info
            onPress={() => this.openModalConfirm()}
            disabled={this.lessThanMinimum() || this.moreThanMaximum() || this.incorrectMultiplierValue()}>
            <Text> Topup Piri Pay </Text>
          </Button>
        <View style={this.styles.get('space')} />
      </View>
    )
  }
  //#endregion customRender

  render() {
    const { user } = this.state;
    return (
      <Container>
        <Content>
          <View padder>
            <Card>
              <View padder>
                <View style={this.styles.get('space')} />
                <View>
                  <Text style={this.styles.get('label')}> Customer Phone Number or Email: </Text>
                </View>
                <View style={this.styles.get('rowForm')}>
                  <Item regular style={this.styles.get('searchInput')}>
                    <Input
                      onChangeText={(text) => this.setState({ query: text })}
                    />
                  </Item>
                  <Button small info
                    onPress={() => this.onSearch()}
                    style={this.styles.get('searchButton')}
                    disabled={this.emptySearchString()}>
                    <Text> Search </Text>
                  </Button>
                </View>

                {user && this.renderUser(user)}
                {this.state.loadUser && <SpinnerLoadUser />}
                {user && this.renderTopUpValue(user)}
              </View>
            </Card>
          </View>
          <Spinner visible={_.get(this.state, 'loading')} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />

          {/* modal content */}
          <ModalPiriPayComponent
            type={'confirm'}
            visible={this.state.modalConfirmShow}
            disabledOnsubmit={this.emptyPin()}
            onSubmit={() => this.onSubmit()}
            onChangeText={(text) => { this.setState({pin: text}); }}
            onCancel={() => this.closeModal()}
            customerName={this.state.customerName}
            prevBalance={this.state.walletBalance}
            topupBalance={this.state.amount}
            nextBalance={Number(this.state.walletBalance) + Number(this.state.amount)}
          />
          <ModalPiriPayComponent
            type={'success'}
            visible={this.state.modalSuccessShow}
            submitLabel={'Ok'}
            onSubmit={() => Actions.ordersPage()}
            onCancel={() => this.closeModal()}
            customerName={this.state.customerName}
            topupBalance={this.state.amount}
          />
          <ModalPiriPayComponent
            type={'failed'}
            visible={this.state.modalFailedShow}
            cancelLabel={'Close'}
            onCancel={() => this.closeModal()}
            customerName={this.state.customerName}
            topupBalance={this.state.amount}
          />
        </Content>
      </Container>
    )
  }

}
