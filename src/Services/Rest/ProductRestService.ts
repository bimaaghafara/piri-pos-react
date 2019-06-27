import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import { MProductVariant } from '../../Models/ProductModel';
import APP_CONSTANT from '../../Config/Constant';

export class ProductRestService {
  httpRequestResto = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/restaurant');
  httpRequestPos = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/fnb/pos');


  _addSimpleFilter(filterBefore: any[], field: string, value: string) {
      filterBefore.push({
        filterValues: [{
          field: field,
          operator: 'contains',
          value: value,
          ignoreCase: true  
        }]
      });
  }

  getProductEntryRelatedData() {
    return this.httpRequestResto.get<any>('products/entry-related-data');
  }


  getAllProduct(qOptions: any, outletID: number) {
      return this.httpRequestResto.post<any>(`outlets/${outletID}/product-variants/q`, qOptions);
  }

  getPrinterAreas(qOptions: any, outletID: number) {
      return this.httpRequestPos.post<any>(`outlets/${outletID}/print-areas/q`, qOptions);
  }

  setSoldOut(productVariant: MProductVariant, soldOut: boolean, outletID: number) {
    const payload = {
      outletId: outletID,
      products: [{
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        soldOut,
      }]
    };
    return this.httpRequestResto.put<boolean>(`products/sold-out-statuses`, payload);
  }

  setPrintArea(productVariant: MProductVariant, printArea: string, outletID: number) {
    const payload = {
      outletId: outletID,
      products: [{
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        soldOut: productVariant.soldOut,
        printArea,
      }]
    };
    return this.httpRequestPos.put<boolean>(`outlets/${payload.outletId}/product-setting`, payload);
  }

  
  
}
