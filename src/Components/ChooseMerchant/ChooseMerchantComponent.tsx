import * as React from 'react';
import * as _ from 'lodash';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Text, Content, View, Card, CardItem, Body, Item, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown'
import IconFa from 'react-native-vector-icons/FontAwesome';
import { chooseMerchantRestService } from '../../Services/Rest';
import Spinner from 'react-native-loading-spinner-overlay';
import { authenticationHttpInterceptorService, authenticationService, authenticationStorageService} from '../../Core/Services';

export class ChooseMerchantComponent extends React.Component<any,any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      merchants: [],
      selectedMerchant: null,
      userName: '',
      email: '',
    }
  }

  updateRememberedUsers() {
    const newData = {
      username: this.state.userName,
      email: this.state.email,
      merchant: this.state.selectedMerchant,
    }
    authenticationStorageService.updateRememberedUsers(newData);
  }

  onSubmit() {
    authenticationStorageService.setSelectedMerchant(this.state.selectedMerchant);
    // refresh token to get into merchant so later process
    // will need to select respective outlet and ready to go
    authenticationService.refreshToken(this.state.selectedMerchant).subscribe(() => {
      authenticationHttpInterceptorService.whoAmI().subscribe(user => {
        authenticationStorageService.setUser(user);
        this.setState({loading: false}, () => {
          this.updateRememberedUsers();
          // go to choose outlet page
          Actions.chooseOutletPage();
        });
      });
    }, error => {
      this.setState({ loading: false }, () => {
      Alert.alert(
        'Sorry, something wrong',
        _.get(error.response.data, 'error_description') || 'Unknown Errors (2)',
      )
      });
    });
  }

  componentWillMount() {
    this.setState({loading: true}, () => {
      chooseMerchantRestService.getMerchant()
        .subscribe(res => {
          let data = res.map((x) => {
            return {label: x.companyName, value: x }
          });
          // console.log(data);

          authenticationStorageService.rememberedUsers.subscribe((rememberedUsers) => {
            console.log(rememberedUsers);

            if (rememberedUsers) {
              // get userName & email from local storage
              const userName = authenticationStorageService.user.userName;
              const email = authenticationStorageService.user.email;

              // get merchant from local storage
              let selectedMerchant;
              if (rememberedUsers.length > 0) {
                selectedMerchant = rememberedUsers.find( user =>
                  user.username === userName
                ).merchant;
              }

              // init state
              this.setState({
                userName: userName,
                email: email,
                selectedMerchant: selectedMerchant,
                merchants: data,
                loading: false,
              });
            } else {
              this.setState({loading: false});
            }

            console.log(authenticationStorageService.user);
          });
        }, err => {
          console.log(err);
          this.setState({loading: false});
        }
    )});
  }

  render() {
    const {merchants} = this.state;
    // console.log(this.state.merchants)
    // console.log(merchants)
    return (
      <Container>
        <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
          <View padder>

            <Card>
              <CardItem bordered>
                <Text style={{fontSize: 28}}> Pilih Merchant </Text>
              </CardItem>
              <CardItem>
                <Body>
                  {merchants.length > 0 && <Item regular style={{paddingHorizontal: 10, marginBottom: 12}}>
                    <Dropdown
                      label='Pilih Merchant'
                      data={merchants}
                      dropdownOffset={{top: 4, left: 0}}
                      containerStyle={{flexGrow: 1, height: 35}}
                      fontSize={18}
                      rippleOpacity={0}
                      itemCount={6}
                      value={this.state.selectedMerchant ?this.state.selectedMerchant.companyName : undefined}
                      onChangeText={(value) => this.setState({selectedMerchant: value})}
                    />
                  </Item>}
                  {/* <View style={{height: 20}}/> */}
                  <Button info
                    disabled={!this.state.selectedMerchant}
                    style={{marginBottom: 10, alignSelf: 'flex-end'}}
                    onPress={() => {
                      this.setState({loading: true}, () => {
                        this.onSubmit();
                      });
                    }}>
                    <Text style={{paddingRight: 0}}> <IconFa name='save'/> </Text>
                    <Text style={{paddingLeft: 0}}>  Ok </Text>
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
