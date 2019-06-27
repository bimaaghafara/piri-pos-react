import * as React from 'react';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Actions } from 'react-native-router-flux';
import { Alert, PermissionsAndroid } from 'react-native';
import { authenticationService, authenticationHttpInterceptorService, authenticationStorageService } from '../Core/Services';
// import { SignInComponent } from './SignIn/SignInModule';
import Spinner from 'react-native-loading-spinner-overlay';

export class BootComponent extends React.Component< any,any > {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedMerchant: null,
            selectedOutlet: null,
        }
    }

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

    doLogin(credentialInfo) {
        console.log(credentialInfo)
        const merchant = this.state.selectedMerchant;
        const outlet = this.state.selectedOutlet;
        authenticationService.login(credentialInfo, merchant['companyId']).subscribe(() => {
            authenticationHttpInterceptorService.whoAmI().subscribe(user => {
                authenticationStorageService.setUser(user);
                this.setState({ loading: false }, () => {
                    Actions.chooseMerchantPage()
                    // if (!_.isNull(merchant) && !_.isNull(outlet)) {
                    //     this.setState({loading: false});
                    //     Actions.ordersPage();
                    // } else if (!_.isNull(merchant) && _.isNull(outlet)) {
                    //     this.setState({loading: false})
                    //     Actions.chooseOutletPage();
                    // } else if (_.isNull(merchant) && _.isNull(outlet)) {
                    //     this.setState({loading: false});
                    //     Actions.chooseMerchantPage();
                    // }
                });
            });
        }, error => {
            this.setState({ loading: false }, () => {
                Alert.alert(
                    'Sorry, something wrong',
                    _.get(error.response.data, 'error_description') || 'Unknown Errors On Login',
                )
                Actions.signinPage();
            });
        });
    }

    componentWillMount() {
        this.setState({loading: true}, () => {
            Observable.combineLatest(authenticationStorageService.credentialInfo,
                authenticationStorageService.selectedMerchant,
                authenticationStorageService.selectedOutlet)
            .subscribe(([credentialInfo, merchant, outlet]) => {
                // console.error(!_.isNull(credentialInfo) && !_.isNull(merchant) && !_.isNull(outlet))
                this.setState({selectedMerchant: merchant, selectedOutlet: outlet})
                if (!_.isNull(credentialInfo) && !_.isNull(merchant)) {
                    this.doLogin(credentialInfo);
                } else {
                    this.setState({loading: false});
                    authenticationStorageService.rememberedUsers.subscribe((res) => {
                        // console.log(res);
                        if (res) {
                            Actions.easyLoginPage();
                        } else {
                            Actions.signinPage();
                        }
                    });
                }
            }, err => this.setState({loading: false}, () => console.log(err)));
        });
    }

    render() {
        return (
            <Spinner  visible={_.get(this.state, 'loading')} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        );
    }
}