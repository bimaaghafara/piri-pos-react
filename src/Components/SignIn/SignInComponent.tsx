import * as React from 'react';
import { Actions } from 'react-native-router-flux';
import * as _ from 'lodash';
import { Alert, BackHandler, PermissionsAndroid } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, View, Item, Input, CheckBox, ListItem, Button } from 'native-base';
import IconEv from 'react-native-vector-icons/EvilIcons';
import { themeService } from '../../Services';
// import { Col, Grid } from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';
import { authenticationHttpInterceptorService, authenticationService, authenticationStorageService} from '../../Core/Services';

export class SignInComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rememberMe: true,
      loading: false,
      user: null,
      rememberUsers: null,
    };
  }

  private backHandler;

  styles = themeService.bind(this, 'signinPage');

  async requestReadPhoneStatePermission() {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            'title': 'READ_PHONE_STATE Permission',
            'message': 'Piri App needs access to your READ_PHONE_STATE ' +
                       'so you can use awesome features.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the READ_PHONE_STATE")
        } else {
          console.log("READ_PHONE_STATE permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
}

  toggleRememeberMe() {
    this.setState({rememberMe: !this.state.rememberMe});
  }

  handleSubmit() {
    const credentialInfo = {
      username: this.state.username,
      password: this.state.password
    };
    authenticationService.login(credentialInfo, undefined).subscribe(() => {
      authenticationHttpInterceptorService.whoAmI().subscribe(user => {
        if (this.state.rememberMe) {
          authenticationStorageService.pushRemberedUsers(user.email, user.userName);
        }
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
      )
      });
    });
  }

  handleEasyLogin() {
    Actions.easyLoginPage();
  }

  disableSubmit() {
    return (this.state.username === '') || (this.state.password === '');
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
    });
    authenticationStorageService.rememberedUsers.subscribe((res) => {
      if (res) {
        this.setState({rememberedUsers: res});
      }
    });
    this.requestReadPhoneStatePermission();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <View padder>
            <Card style={{alignItems: 'center', borderRadius: 10,}}>
              <CardItem style={{paddingBottom: 0}} >
                <Text style={this.styles.get('headerText')}>Masuk ke Aplikasi</Text>
              </CardItem>
              <CardItem style={{paddingTop: 0}}>
                <Body>
                  <View style={this.styles.get('emailContainer')}>
                    <Text style={this.styles.get('labelText')}> Username or Email </Text>
                  </View>
                  <Item>
                    <IconEv name='envelope' size={27}/>
                    <Input
                      onChangeText={(text => this.setState({username: text}))}
                      style={this.styles.get('input')}
                    />
                  </Item>
                  <View style={this.styles.get('passwordContainer')}>
                    <Text style={this.styles.get('labelText')}> Password </Text>
                  </View>
                  <Item>
                    <IconEv name='lock' size={29}/>
                    <Input
                      onChangeText={(text => this.setState({password: text}))}
                      style={this.styles.get('input')}
                      secureTextEntry={true}/>
                  </Item>
                  {/* <Grid style={this.styles.get('chekboxContainer')}>
                    <Col>
                      <ListItem noBorder>
                        <CheckBox color={'#bdbdbd'} onPress={() => this.toggleRememeberMe()} checked={this.state.rememberMe} />
                        <Body>
                          <Text style={this.styles.get('labelText')}>Remember me?</Text>
                        </Body>
                      </ListItem>
                    </Col>
                  </Grid> */}
                </Body>
              </CardItem>
              <Button full large
                style={{
                  backgroundColor: this.disableSubmit() ? '#bdbdbd' : 'green',
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                disabled={this.disableSubmit()}
                onPress={() => {
                  this.setState({loading: true}, () => this.handleSubmit())
                }}>
                <Text  style={this.styles.get('loginText')}>Login</Text>
              </Button>
          </Card>
          {this.state.rememberedUsers &&
              <Button full large
                    style={{
                      marginTop: 10,
                      backgroundColor: 'blue',
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      this.handleEasyLogin()
                    }}>
                    <Text  style={this.styles.get('loginText')}>Easy Login</Text>
              </Button>
          }
         </View>
        </Content>
        <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{color: '#FFF'}} />
      </Container>
    );
  }
}