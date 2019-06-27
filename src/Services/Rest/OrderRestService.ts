import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import APP_CONSTANT from '../../Config/Constant';

export class OrderRestService {
  httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/fnb/pos/outlets');

  getOrders(outletId: string) {
    return this.httpRequest.get<any>(outletId + '/orders');
  }

  getActiveOrders(outletId: string) {
    return this.httpRequest.get<any>(outletId + '/active-orders');
  }

  markConfirmed(outletId: string, orderId: string) {
    return this.httpRequest.post<any>(outletId + '/orders/' + orderId + '/mark-confirmed');
  }

  markReady(outletId: string, orderId: string) {
    return this.httpRequest.post<any>(outletId + '/orders/' + orderId + '/mark-ready');
  }

  markClosed(outletId: string, orderId: string) {
    return this.httpRequest.post<any>(outletId + '/orders/' + orderId + '/mark-closed');
  }

  markCancel(outletId: string, orderId: string, cancellationReason: string) {
    return this.httpRequest.post<any>(outletId + '/orders/' + orderId + '/cancel', {cancellationReason: cancellationReason});
  }

  notifyReady(outletId: string, orderId: string) {
    return this.httpRequest.post<any>(outletId + '/orders/' + orderId + '/notify-ready');
  }

  updateOrder(outletId: string, orderId: string, orderLines: any) {
    const data = {lines: orderLines}
    return this.httpRequest.put<any>(outletId + '/orders/' + orderId + '/update', data);
  }

}