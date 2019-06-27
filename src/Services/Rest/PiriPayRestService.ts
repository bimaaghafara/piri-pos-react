import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import APP_CONSTANT from '../../Config/Constant';
import { MCustomer } from '../../Models/CustomerModel';

export class PiriPayRestService {
    httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/topups');

    getUser(query: string) {
        return this.httpRequest.get<MCustomer>('/topup-user-search', {
            params: {
                emailOrPhone: query
            }
        });
    }

    topupWallet(outletId: string, body: any) {
        return this.httpRequest.post<any>(`/outlets/${outletId}/wallet-topup`, body);
      }

}
