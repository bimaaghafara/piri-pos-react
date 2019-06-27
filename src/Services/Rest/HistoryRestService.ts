import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import APP_CONSTANT from '../../Config/Constant';

export class HistoryRestService {
  httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/fnb/pos');
  httpRequestTopup = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/topups');

  addSimpleFilter(filterBefore: any[], field: string, value: string) {
      filterBefore.push({
        filterValues: [{
          field: field,
          operator: 'contains',
          value: value,
          ignoreCase: true  
        }]
      });
  }
  
  getOrderHistory(data: any, outletID: string, startDate: string = null, endDate: string = null) {
    const config = {
        params: {
            fromDate: startDate ? startDate : '',
            toDate: endDate ? endDate : ''
        }
    }
    return this.httpRequest.post<any>('outlets/' + outletID + '/orders/q', data, config);
  }

  getOrder(outletID: string, orderID: string) {
    const config = {
      params: {
        includeLines: true
      }
    }
    return this.httpRequest.get<any>('outlets/' + outletID + '/orders/' + orderID, config);
  }

  getTopupHistory(data: any, outletID: string, startDate: string = null, endDate: string = null) {
    const config = {
        params: {
            fromDate: startDate ? startDate : '',
            toDate: endDate ? endDate : ''
        }
    }
    return this.httpRequestTopup.post<any>('outlets/' + outletID + '/history/q', data, config);
  }

}
