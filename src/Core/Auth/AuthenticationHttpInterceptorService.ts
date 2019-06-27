import Axios, { AxiosInstance, AxiosPromise, AxiosStatic } from 'axios';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { authenticationHttpService, authenticationStorageService } from '../Services';

import APP_CONSTANT from '../../Config/Constant';

export class AuthenticationHttpInterceptorService {
  timeout: number = 10000;

  setInterceptors(axios: AxiosInstance | AxiosStatic) {
    axios.interceptors.request.use(request => {
      if (authenticationStorageService.accessToken) {
        request.headers.common.Authorization = `Bearer ${authenticationStorageService.accessToken}`;
      }
      return request;
    });

    axios.interceptors.response.use(response => {
      return response;
    }, error => {
      const response = error.response;
      if (response && response.status === 401 && response.config && response.config.headers && response.config.headers.Authorization) {
        return authenticationHttpService.refreshToken(undefined)
          .catch(async errorRefreshToken => {
            authenticationStorageService.reset();
            // go to login page
            return Observable.throw(errorRefreshToken);
          })
          .switchMap(user => {
            Observable.combineLatest(
              authenticationStorageService.setAccessToken(_.get(user, 'access_token')),
              authenticationStorageService.setRefreshToken(_.get(user, 'refresh_token')),
            ).switchMap(() => Observable.of(authenticationStorageService.user));
            response.config.headers.Authorization = `Bearer ${_.get(user, 'access_token')}`;
            return axios.request(response.config);
          }).toPromise();
      }
      throw error;
    });
  }

  whoAmI(): any {
    const axios = Axios.create({
      baseURL: `${APP_CONSTANT.BASE_AUTH_API_URL}/users/me`,
      timeout: this.timeout,
    });

    this.setInterceptors(axios);

    return Observable.fromPromise(
      <AxiosPromise>axios.get('').then(response => response.data),
    );
  }
}