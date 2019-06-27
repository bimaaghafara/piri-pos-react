import Axios from 'axios';

import { authenticationHttpInterceptorService } from '../Services';
import { HttpRequestAxiosService } from './HttpRequestAxiosService';

export class HttpRequestInterceptedService extends HttpRequestAxiosService {
  constructor(baseURL: string) {
    super(Axios.create());
    this.axios.defaults.baseURL = baseURL;
    this.axios.defaults.timeout = 10000;
    authenticationHttpInterceptorService.setInterceptors(this.axios);
  }
}
