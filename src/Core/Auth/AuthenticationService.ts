import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { authenticationHttpService, authenticationStorageService, eventService } from '../Services';
import { LocalAuthCredentials } from './AuthModel';
import EVENTS from '../../Config/Events';

export class AuthenticationService {
  login(credentials: LocalAuthCredentials,
        selectedMerchant: string): Observable<any> {
    return authenticationHttpService
      .login(credentials, selectedMerchant)
      .switchMap(user => {
        return Observable.combineLatest(
          authenticationStorageService.setAccessToken(user.access_token),
          authenticationStorageService.setRefreshToken(user.refresh_token),
          authenticationStorageService.setCredential(credentials),
        ).switchMap(() => Observable.of(authenticationStorageService.user));
      })
      .do(user => {
        eventService.emit(EVENTS.LOGIN_SUCCESS, user);
      });
  }

  refreshToken(selectedMerchant: string): Observable<any> {
    return authenticationHttpService.refreshToken(selectedMerchant)
          .catch(async errorRefreshToken => {
            authenticationStorageService.reset();
            // go to login page
            return Observable.throw(errorRefreshToken);
          })
          .map(user => {
            Observable.combineLatest(
              authenticationStorageService.setAccessToken(_.get(user, 'access_token')),
              authenticationStorageService.setRefreshToken(_.get(user, 'refresh_token')),
            ).switchMap(() => Observable.of(authenticationStorageService.user));
          });
  }

  logout() {
    authenticationStorageService.reset();
    eventService.emit(EVENTS.LOGOUT_SUCCESS);
    console.log('logout')
  }

  // redirectAfterLogin() {
  //   if (_.get(authenticationStorageService.user, 'phoneNumberConfirmed')) {
  //     Actions.reset('landingPage');
  //   } else {
  //     Actions.verifyPage();
  //   }
  // }
}
