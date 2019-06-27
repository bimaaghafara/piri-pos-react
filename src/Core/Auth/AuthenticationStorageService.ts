import * as RNLS from 'react-native-local-storage';
import { Observable } from 'rxjs';
import { eventService } from '../Services';
import EVENTS from '../../Config/Events';
import APP_CONSTANT from '../../Config/Constant';
import { Actions } from 'react-native-router-flux';

export class AuthenticationStorageService {
  private _user: any;
  private _accessToken: string;
  private _refreshToken: string;

  storageKeyAccessToken: string = APP_CONSTANT.STORAGE_KEY.ACCESS_TOKEN;
  storageKeyRefreshToken: string = APP_CONSTANT.STORAGE_KEY.REFRESH_TOKEN;
  storageKeyCredential: string = APP_CONSTANT.STORAGE_KEY.CREDENTIAL_INFO;

  // Merchant and Outlet
  storageKeySelectedMerchant: string = APP_CONSTANT.STORAGE_KEY.SELECTED_MERCHANT;
  storageKeySelectedOutlet: string = APP_CONSTANT.STORAGE_KEY.SELECTED_OUTLET;
  storageKeySelectedOutletName: string = APP_CONSTANT.STORAGE_KEY.SELECTED_OUTLET_NAME;
  storageKeyRememberedUsers: string = APP_CONSTANT.STORAGE_KEY.REMEMBERED_USERS;

  init() {
    return Observable.combineLatest(
      RNLS.get(this.storageKeyAccessToken),
      RNLS.get(this.storageKeyRefreshToken),
      (accessToken, refreshToken) => {
        this._accessToken = accessToken as any;
        this._refreshToken = refreshToken as any;
      },
    );
  }

  get user() {
    return this._user;
  }

  setUser(user) {
    const previousUser = this.user;

    if (user && (!user.roles || !user.roles.length)) {
      user.roles = ['admin'];
    }

    this._user = user;

    if (previousUser) {
      eventService.emit(EVENTS.USER_CHANGED);
    } else {
      eventService.emit(EVENTS.USER_SET);
    }
  }

  get rememberedUsers(): Observable<any> {
    return Observable.fromPromise(RNLS.get(this.storageKeyRememberedUsers));
  }

  pushRemberedUsers(email, username){
    this.rememberedUsers.subscribe((res) => {
      let rememberedUsers = res;
      if (res === null) {
        // console.log('belum ada rememberedUsers');
        RNLS.save(this.storageKeyRememberedUsers, []).then(() => {
          this.rememberedUsers.subscribe((res2) => {
            // console.log(res2);
            rememberedUsers = res2;
            this.saveRememberedUsers(
              rememberedUsers,
              {email: email, username: username}
            );
          });
        });
      } else {
        // console.log('sudah ada rememberedUsers');
        this.saveRememberedUsers(
          rememberedUsers,
          {email: email, username: username}
        );
      }
    });
  }

  saveRememberedUsers(prevDatas, newData) {
    const i = prevDatas ? prevDatas.findIndex( prevData =>
      prevData.username.toLowerCase() === newData.username.toLowerCase()
    ) : 0;
    if ( i < 0) {
      // save/push to local storage when newData doesn't exist
      prevDatas.push(newData);
      RNLS.save(this.storageKeyRememberedUsers, prevDatas);
    } else {
      console.log(`email / username : ${newData.email} / ${newData.username} sudah tersimpan`);
    }
  }

  saveRememberedUser(newDatas): Observable<any>{
    return Observable.fromPromise(RNLS.save(this.storageKeyRememberedUsers, newDatas));
  }

  updateRememberedUsers(newData) {
    this.rememberedUsers.subscribe((res) => {
      let prevDatas = res;
      const i = prevDatas ? prevDatas.findIndex(prevData =>
        prevData.username.toLowerCase() === newData.username.toLowerCase()
      ) : 0;
      if(i === -1){
        prevDatas = [newData];
      }else{
        prevDatas[i] = Object.assign(prevDatas[i], newData);
      }
      RNLS.save(this.storageKeyRememberedUsers, prevDatas);
    });
  }

  removeRememberedUsers(): Observable<any> {
    return Observable.fromPromise(RNLS.remove(this.storageKeyRememberedUsers));
  }

  get accessToken() {
    return this._accessToken;
  }

  setAccessToken(accessToken: string): Observable<any> {
    this._accessToken = accessToken;
    return Observable.fromPromise(RNLS.save(this.storageKeyAccessToken, accessToken));
  }

  removeAccessToken(): Observable<any> {
    this._accessToken = undefined;
    return Observable.fromPromise(RNLS.remove(this.storageKeyAccessToken));
  }

  get refreshToken() {
    return this._refreshToken;
  }

  setRefreshToken(refreshToken: string): Observable<any> {
    this._refreshToken = refreshToken;
    return Observable.fromPromise(RNLS.save(this.storageKeyRefreshToken, refreshToken));
  }

  removeRefreshToken(): Observable<any> {
    this._refreshToken = undefined;
    return Observable.fromPromise(RNLS.remove(this.storageKeyRefreshToken));
  }

  get credentialInfo(): Observable<any> {
    return Observable.fromPromise(RNLS.get(this.storageKeyCredential));
  }

  setCredential(credential: any): Observable<any> {
    return Observable.fromPromise(RNLS.save(this.storageKeyCredential, credential));
  }

  removeCredential(): Observable<any> {
    return Observable.fromPromise(RNLS.remove(this.storageKeyCredential));
  }

  get selectedMerchant(): Observable<any> {
    return Observable.fromPromise(RNLS.get(this.storageKeySelectedMerchant));
  }

  setSelectedMerchant(merchant: any): Observable<any> {
    return Observable.fromPromise(RNLS.save(this.storageKeySelectedMerchant, merchant));
  }

  removeSelectedMerchant(): Observable<any> {
    return Observable.fromPromise(RNLS.remove(this.storageKeySelectedMerchant));
  }

  get selectedOutlet(): Observable<any> {
    return Observable.fromPromise(RNLS.get(this.storageKeySelectedOutlet));
  }

  setSelectedOutlet(outlet: any): Observable<any> {
    return Observable.fromPromise(RNLS.save(this.storageKeySelectedOutlet, outlet));
  }

  removeSelectedOutlet(): Observable<any> {
    return Observable.fromPromise(RNLS.remove(this.storageKeySelectedOutlet));
  }

  get selectedOutletName(): Observable<any> {
    return Observable.fromPromise(RNLS.get(this.storageKeySelectedOutletName));
  }

  setSelectedOutletName(outlet: any): Observable<any> {
    return Observable.fromPromise(RNLS.save(this.storageKeySelectedOutletName, outlet));
  }

  removeSelectedOutletName(): Observable<any> {
    return Observable.fromPromise(RNLS.remove(this.storageKeySelectedOutletName));
  }

  reset() {
    return Promise.all([
      this.removeAccessToken(),
      this.removeRefreshToken(),
      this.removeCredential(),
      this.removeSelectedMerchant(),
      this.removeSelectedOutlet(),
      this.removeSelectedOutletName()
    ]).then(() => {
      this.setUser(undefined);
      eventService.emit(EVENTS.USER_RESET);
      Actions.replace('signinPage');
    });
  }
}
