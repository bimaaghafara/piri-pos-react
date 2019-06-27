import { Observable } from 'rxjs';

import { authenticationStorageService } from '../Services';
import { HttpRequestService } from '../Http/HttpRequestService';

import { LocalAuthCredentials } from './AuthModel';

import APP_CONSTANT from '../../Config/Constant';

export class AuthenticationHttpService {
  clientId = 'm-pos';
  clientSecret = 'vCR5dmyV';
  
  refreshTokenRunning: boolean = false;
  refreshTokenObservable: Observable<string>;

  httpRequestService = new HttpRequestService(APP_CONSTANT.BASE_AUTH_API_URL);
  
  /**
   * Refresh current token if current token isn't available anymore for authentication.
   */
  refreshToken(selectedMerchant: string): Observable<string> {
    let companyId = undefined;
    if(selectedMerchant !== undefined && selectedMerchant !== null){
      companyId = selectedMerchant['companyId'];
    }
    const{ data } = this.buildRefreshInfo(authenticationStorageService.refreshToken, companyId);
    return this.httpRequestService.post<any>('token', data, {});
    
    // if (this.refreshTokenRunning) {
    //   return this.refreshTokenObservable;
    // }

    // this.refreshTokenRunning = true;

    // .do(() => this.refreshTokenRunning = false, () => this.refreshTokenRunning = false)
    //   .switchMap(response => {
    //     const accessToken = response.access_token;
    //     authenticationStorageService.user = response;

    //     return authenticationStorageService.setAccessToken(accessToken)
    //       .switchMap(() => {
    //         return Observable.of(accessToken);
    //       });
    //   });

    // return this.refreshTokenObservable;
  }

  login(credentials: LocalAuthCredentials, selectedMerchant: string) {
    const { data } = this.buildLoginInfo(credentials, selectedMerchant);
    return this.httpRequestService.post<any>('token', data, {});
  }

  /**
   * Build login x-www-form-urlencoded body values.
   */
  private buildLoginInfo(credentials: LocalAuthCredentials, companyId: string) {
    var data = 'grant_type=' + 'password' +
      '&username=' + credentials.username +
      '&password=' + credentials.password +
      '&client_id=' + this.clientId +
      '&client_secret=' + this.clientSecret;
    
    if(companyId !== null && companyId !== undefined){
      data = data + '&company_id=' + companyId;
    }

    return { data };
  }

  /**
   * Build refresh token x-www-form-urlencoded body values.
   */
  private buildRefreshInfo(refreshToken: string, companyId: string) {
    var data = 'grant_type=' + 'refresh_token' +
      '&refresh_token=' + refreshToken +
      '&client_id=' + this.clientId +
      '&client_secret=' + this.clientSecret;
    
    if(companyId !== undefined){
      data = data + '&company_id=' + companyId;
    }  

    return { data };
  }
}