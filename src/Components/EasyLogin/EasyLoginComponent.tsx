import * as React from 'react';
import { Actions } from 'react-native-router-flux';
import * as _ from 'lodash';
import { Modal, Alert, BackHandler } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, View, List, ListItem, Right, Left, Button, Icon, Item, Input } from 'native-base';
import { themeService } from '../../Services';
import Spinner from 'react-native-loading-spinner-overlay';
import { authenticationHttpInterceptorService, authenticationService, authenticationStorageService} from '../../Core/Services';

export class EasyLoginComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      loading: false,
      users: null,
      isModalLoginShow: false,
      isModalForgetShow: false,
    };
  }

  private backHandler;
  styles = themeService.bind(this, 'easyLoginPage');

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    authenticationStorageService.rememberedUsers.subscribe((res) => {
      console.log(res)
      if (res) {
        // console.log('sudah ada rememberedUsers');
        this.setState({users: res});
      } else {
        // console.log('belum ada rememberedUsers');
        Actions.signinPage();
      }
    });
  }

  selectUser(username, email, i) {
    this.setState({
      username: username,
      email: email,
      selectedIndex: i,
    });
  }

  toggleModalLogin() {
    this.setState({
      isModalLoginShow: !this.state.isModalLoginShow,
      password: '',
    });
  }

  toggleModalForget() {
    this.setState({
      isModalForgetShow: !this.state.isModalForgetShow,
    });
  }

  disableSubmit() {
    return this.state.password === '';
  }

  login() {
    const credentialInfo = {
      username: this.state.username,
      password: this.state.password,
    };
    authenticationService.login(credentialInfo, undefined).subscribe(() => {
      authenticationHttpInterceptorService.whoAmI().subscribe(user => {
        authenticationStorageService.setUser(user);
        this.setState({loading: false}, () => {
          Actions.chooseMerchantPage();
        });
      });
    }, error => {
      this.setState({ loading: false }, () => {
        Alert.alert(
          'Sorry, something wrong',
          _.get(error.response.data, 'error_description') || 'Unknown Errors (1)',
        );
      });
    });
  }

  removeRememberedUser(){
    authenticationStorageService.rememberedUsers.subscribe((res) => {
      const rememberedUsers = res;
      const newDatas = rememberedUsers.filter(user =>
        user.username !== this.state.username
      );
      if (newDatas.length > 0) {
        authenticationStorageService.saveRememberedUser(newDatas).subscribe(() => this.loadData());
      } else {
        authenticationStorageService.removeRememberedUsers().subscribe(() => this.loadData());
      }
    });
  }

  renderModalForget() {
    const { get } = this.styles;

    return (
      <Modal
        visible={this.state.isModalForgetShow}
        animationType={'fade'}
        onRequestClose={() => this.toggleModalForget()}
        transparent
      >
        <Container style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <Content contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ margin: 30, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2 }}>
              <View style={{alignItems: 'center', marginTop: 20, paddingVertical: 10}}>
                <Text style={{fontSize: 24, lineHeight: 48, textAlign: 'center'}}>Forget account {this.state.email}?</Text>
              </View>
              {/* <View padder>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>{this.state.email}</Text>
                  <Text> will no longer be used on this device. Sign in when you are ready to use your account again.</Text>
                </Text>
              </View> */}
              <View padder style={get('modalButtonContainer')} >
                <Button light style={get('modalButton')}
                  onPress={() => {
                    this.toggleModalForget();
                  }}
                >
                  <Text>cancel</Text>
                </Button>
                <Button danger style={get('modalButton')}
                  onPress={() => {
                    this.toggleModalForget();
                    this.removeRememberedUser();
                  }}
                >
                  <Text>forget</Text>
                </Button>
              </View>
            </View>
          </Content>
        </Container>
      </Modal>
    )
  }

  renderModalLogin() {
    const { get } = this.styles;

    return (
      <Modal
        visible={this.state.isModalLoginShow}
        animationType={'fade'}
        onRequestClose={() => this.toggleModalLogin()}
        transparent
      >
        <Container style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <Content contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ margin: 30, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2 }}>
              <View padder style={{alignItems: 'center'}}>
                <Text style={get('headerText')}>Login as <Text style={get('username')}>{this.state.username}</Text>?</Text>
              </View>
              <View style={get('passwordContainer')}>
                <Text style={get('label')}>Enter Password</Text>
                <Item>
                  {/* <Icon type={'EvilIcons'} name='lock' fontSize={29}/> */}
                  <Input
                    onChangeText={(text => this.setState({password: text}))}
                    style={this.styles.get('input')}
                    secureTextEntry={true}/>
                </Item>
              </View>
              <View padder style={get('modalButtonContainer')} >
                <Button light style={get('modalButton')}
                  onPress={() => {
                    this.toggleModalLogin();
                  }}
                >
                  <Text>cancel</Text>
                </Button>
                <Button
                  style={[
                    get('modalButton'),
                    {backgroundColor: this.disableSubmit() ? '#bdbdbd' : 'green'}
                  ]}
                  disabled={this.disableSubmit()}
                  onPress={() => {
                    this.setState({loading: true}, () => {
                      this.login();
                      this.toggleModalLogin();
                    });
                  }
                }>
                  <Text>login</Text>
                </Button>
              </View>
            </View>
          </Content>
        </Container>
      </Modal>
    )
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <View padder>
            {!this.state.users &&
              <View style={{alignItems: 'center'}}>
                <Text>Loading . . .</Text>
              </View>
            }

            {this.state.users &&
            <View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 28}}>Choose an account</Text>
              </View>
              <List>
                {this.state.users.map((user, i) => {
                  return (
                    <ListItem
                      avatar
                      key = {`list${i}`}
                      onPress={() => {
                        this.selectUser(user.username, user.email, i);
                        this.toggleModalLogin();
                      }}
                      style={{borderBottomColor: '#999', borderBottomWidth: 0.5, marginRight: 20}}
                      noBorder
                    >
                      <Left>
                        <View>
                          <Icon type={'FontAwesome'} name={'user'} fontSize={28}/>
                        </View>
                      </Left>
                      <Body>
                        <Text>{user.username}</Text>
                        <Text note>{user.email}</Text>
                      </Body>
                      <Right style={{paddingRight: 0, flexDirection: 'row'}}>
                        <Button transparent onPress={() => {
                          this.selectUser(user.username, user.email, i);
                          this.toggleModalForget();
                        }}>
                          <Icon type={'MaterialCommunityIcons'} name='delete-forever' 
                          // style={{marginLeft: 5, marginRight: 5}}
                          />
                        </Button>
                      </Right>
                    </ListItem>
                )})}
                <View padder style={{marginTop: 50}}>
                  <Button full onPress={() => Actions.signinPage()}>
                    <Text style={{fontSize: 20}} uppercase={false}>Use another account</Text>
                  </Button>
                </View>
              </List>
            </View>
            }

            {/* <View padder style={{marginTop: 50}}>
              <Button warning full onPress={() => 
                authenticationStorageService.rememberedUsers.subscribe((res) => {
                  console.log('rememberedUsers:');
                  console.log(res);
              })}>
                <Text style={{fontSize: 20}} uppercase={false}>Console log rememberedUsers</Text>
              </Button>
            </View> */}

            {/* <View padder style={{marginTop: 50}}>
              <Button danger full onPress={() => 
                authenticationStorageService.removeRememberedUsers().subscribe(() => {
                  console.log('Clear rememberedUsers')
              })}>
                <Text style={{fontSize: 20}} uppercase={false}>Clear rememberedUsers</Text>
              </Button>
            </View> */}

          </View>
        </Content>
        {this.renderModalForget()}
        {this.renderModalLogin()}
        <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{color: '#FFF'}} />
      </Container>
    );
  }
}