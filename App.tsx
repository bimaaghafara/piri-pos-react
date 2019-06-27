// To Allow network debugger
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

import * as React from 'react';
import { Router, Scene, Actions, Drawer } from 'react-native-router-flux';

import { NavigationComponent } from './src/Components/Navigation/NavigationModule';
import { BootComponent } from './src/Components/BootComponent';
import { SignInComponent } from './src/Components/SignIn/SignInModule';
import { EasyLoginComponent } from './src/Components/EasyLogin/EasyLoginModule';
import { SettingsComponent } from './src/Components/Settings/SettingsModule';
import { ProductsComponent } from './src/Components/Products/ProductsModule';
import { OrdersComponent } from './src/Components/Orders/OrdersModule';
import { OrderHistoryDetailComponent } from './src/Components/History/OrderHistory/OrderHistoryModule';
import { HistoryComponent } from './src/Components/History/HistoryModule';
import { ChooseMerchantComponent } from './src/Components/ChooseMerchant/ChooseMerchantModule';
import { ChooseOutletComponent } from './src/Components/ChooseOutlet/ChooseOutletModule';
import { PiriPayComponent } from './src/Components/PiriPay/PiriPayModule';

import { Container, Text, Button, Root } from 'native-base';
import IconEv from 'react-native-vector-icons/EvilIcons';

interface MyState { isModalVisible: boolean; };
export default class App extends React.Component<{}, MyState>{
  constructor(props: any) {
    super(props);
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <Root>
        <Container>
          {/* Routing */}
          <Router>
            <Scene
              key='root'
              drawer={false}
              navigationBarStyle={{ height: 65 }}
              titleStyle={{ fontWeight: '400', fontSize: 24 }}
              renderRightButton={() =>
                <Button bordered dark small style={{ alignSelf: 'center', marginRight: 15 }} onPress={Actions.piriPayPage}>
                  <Text>Piri Pay Topup</Text>
                </Button>
              }
            >
              {/* Boot Page */}
              <Scene key='boot' component={BootComponent} hideNavBar initial />

              {/* Auth Page */}
              <Scene key='signinPage' component={SignInComponent} hideNavBar />
              <Scene key='easyLoginPage' component={EasyLoginComponent} hideNavBar />
              <Scene key='chooseMerchantPage' component={ChooseMerchantComponent} hideNavBar />
              <Scene key='chooseOutletPage' component={ChooseOutletComponent} hideNavBar />

              {/* Main Page (page that needs drawer) */}
              <Drawer
                hideNavBar
                contentComponent={NavigationComponent}
                key='drawerMenu'
                drawerIcon={() => <IconEv name='navicon' size={36} />}
                drawerWidth={250}
                >
                
                {/* Main Page */}
                <Scene key='ordersPage' component={OrdersComponent} title={'Orders'} />
                <Scene key='historyPage' component={HistoryComponent} title={'History'} />
                <Scene key='productsPage' component={ProductsComponent} title={'Products'} />
                <Scene key='settingsPage' component={SettingsComponent} title={'Pengaturan'} />
                <Scene key='piriPayPage' component={PiriPayComponent} title={'Piri Pay'} />
              </Drawer>
              
              {/* Detail Page */}
              <Scene 
                  key='historyOrderDetailPage'
                  component={OrderHistoryDetailComponent}
                  hideNavBar/>
            </Scene>
          </Router>
        </Container>
      </Root>
    );
  }
}
