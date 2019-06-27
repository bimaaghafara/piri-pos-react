import Axios from 'axios';

import { HttpRequestAxiosService } from './HttpRequestAxiosService';

export class HttpRequestService extends HttpRequestAxiosService {
  constructor(baseURL: string) {
    super(Axios.create());
    this.axios.defaults.baseURL = baseURL;
  }
}
