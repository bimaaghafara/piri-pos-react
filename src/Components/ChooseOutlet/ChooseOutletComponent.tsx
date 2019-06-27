import * as React from 'react';
import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Container, Text, Content, View, Card, CardItem, Body, Item, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown'
import IconFa from 'react-native-vector-icons/FontAwesome';
import { outletRestService } from '../../Services/Rest'
import { authenticationStorageService } from '../../Core/Services';
import Spinner from 'react-native-loading-spinner-overlay';

export class ChooseOutletComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      outlets: [],
      selectedOutlet: null,
      selectedOutletName: null,
      loading: false,
      userName: '',
      email: '',
    }
  }

  updateRememberedUsers() {
    const outlet = {
      id: this.state.selectedOutlet,
      name: this.state.selectedOutletName
    }
    const newData = {
      username: authenticationStorageService.user.userName,
      email: authenticationStorageService.user.email,
      outlet: outlet,
    }
    authenticationStorageService.updateRememberedUsers(newData);
  }

  onSubmit() {
    this.setState({loading: false}, () => {
      authenticationStorageService.setSelectedOutlet(this.state.selectedOutlet).subscribe(() => {
        authenticationStorageService.setSelectedOutletName(this.state.selectedOutletName).subscribe(() => {
          this.updateRememberedUsers();
          Actions.ordersPage();
        });
      });
    });
  }

  onChangeOutletDropdown(value) {
    this.setState({
      selectedOutlet: value,
      selectedOutletName: this.state.outlets.find(o => o.value === value).label,
    });
  }

  componentWillMount() {
      this.setState({loading: true}, () => {
          outletRestService.getAllOutlet().subscribe(res => {
            const data = res.data.map(x => {
              return {label: x.name, value: x.id}
            });

            authenticationStorageService.rememberedUsers.subscribe((rememberedUsers) => {
              // get userName & email from local storage
              const userName = authenticationStorageService.user.userName;
              const email = authenticationStorageService.user.email;

              // get outlet from local storage
              const selectedOutlet = rememberedUsers.find( user =>
                user.username === userName
              ).outlet;

              if (selectedOutlet) {
                // check index selectedOutlet (localStorage) in data (response from server)
                const i = data.findIndex( outlet =>
                  outlet.value === selectedOutlet.id
                );

                // i = -1  --> selectedMerchant was changed
                if (i >= 0) {
                  this.setState({
                    selectedOutlet: selectedOutlet.id,
                    selectedOutletName: selectedOutlet.name,
                  });
                }
              }

              this.setState({loading: false, outlets: data});
            });
          }, err => {
            this.setState({loading: false});
            console.log(err);
          });
      });
  }

  render() {
    // initialize local variable
    const { outlets, selectedOutlet } = this.state;
    let defaultOutletDropdown;
    selectedOutlet
      ? defaultOutletDropdown = selectedOutlet 
      : defaultOutletDropdown = '';

    return (
      <Container>
        <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <View padder>
            <Card>
              <CardItem bordered>
                <Text style={{fontSize: 28}}> Pilih Outlet </Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Item regular style={{paddingHorizontal: 10, marginBottom: 12}}>
                    <Dropdown
                      label='Pilih Outlet'
                      data={outlets}
                      value={defaultOutletDropdown}
                      dropdownOffset={{top: 4, left: 0}}
                      containerStyle={{flexGrow: 1, height: 35}}
                      fontSize={18}
                      rippleOpacity={0}
                      onChangeText={(value) => this.onChangeOutletDropdown(value)}
                    />
                  </Item>
                  {/* <View style={{height: 20}}/> */}
                  <Button info
                    disabled={!this.state.selectedOutlet}
                    style={{marginBottom: 10, alignSelf: 'flex-end'}}
                    onPress={() => {
                      this.setState({loading: true}, () => {
                        this.onSubmit();
                      });
                    }}>
                    <Text style={{paddingRight: 0}}> <IconFa name='save'/> </Text>
                    <Text style={{paddingLeft: 0}}>  OK </Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </View>
        </Content>
        <Spinner  visible={_.get(this.state, 'loading')} textContent={'Loading...'} textStyle={{color: '#FFF'}} />
      </Container>
    )
  }
}
