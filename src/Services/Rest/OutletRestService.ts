import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import APP_CONSTANT from '../../Config/Constant';

export class OutletRestService {
  httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/restaurant/outlets');

  getAllOutlet() {
      return this.httpRequest.get<any>();
  }

  getOutlet(outletID: string) {
      return this.httpRequest.get<any>(outletID);
  }

  toggleStatus(outletID: string, newStatus: boolean) {
      return this.httpRequest.post<boolean>(outletID + '/online-status', {status: newStatus});
  }

  getOutletStatus(outletID: string) {
    return this.httpRequest.get<any>(outletID + '/online-status');
  }

}
