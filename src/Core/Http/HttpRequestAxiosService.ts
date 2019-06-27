import Axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenStatic } from 'axios';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

export class HttpRequestAxiosService {
  cancelToken: CancelTokenStatic = Axios.CancelToken;

  constructor(
    public axios: AxiosInstance,
  ) {
    ['delete', 'get', 'head', 'options'].forEach(method => {
      axios[method] = (url: string, config: any = {}) => {
        const cancelSource = this.cancelToken.source();
        config.cancelToken = cancelSource.token;

        if (method === 'delete') {
          _.set(config, 'headers["Content-Type"]', 'application/json');
        }

        return axios.request(Object.assign({}, config, {
          method,
          url,
        }));
      };
    });

    ['post', 'put', 'patch'].forEach(method => {
      axios[method] = (url: string, data: any, config: any = {}) => {
        const cancelSource = this.cancelToken.source();
        config.cancelToken = cancelSource.token;

        return axios.request(Object.assign({}, config, {
          method,
          url,
          data,
        }));
      };
    });
  }

  post<T>(url: string = '', data: any = undefined, config: AxiosRequestConfig = {}): Observable<T> {
    return Observable.fromPromise(
      (<AxiosPromise>this.axios.post(url, data, config)).then(response => response.data),
    );
  }

  put<T>(url: string = '', data: any = undefined, config: AxiosRequestConfig = {}): Observable<T> {
    return Observable.fromPromise(
      (<AxiosPromise>this.axios.put(url, data, config)).then(response => response.data),
    );
  }

  get<T>(url: string = '', config: AxiosRequestConfig = {}): Observable<T> {
    return Observable.fromPromise(
      (<AxiosPromise>this.axios.get(url, config)).then(response => response.data),
    );
  }

  delete<T>(url: string = '', config: AxiosRequestConfig = {}): Observable<T> {
    return Observable.fromPromise(
      (<AxiosPromise>this.axios.delete(url, config)).then(response => response.data),
    );
  }
}