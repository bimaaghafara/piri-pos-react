import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';

import APP_CONSTANT from '../../Config/Constant';

export class ChooseMerchantRestService {
  httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_AUTH_API_URL + '/merchants/users/me/companies');

  getMerchant() {
    return this.httpRequest.get<any>();
  }

}
