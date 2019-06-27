import { HistoryRestService } from './HistoryRestService';
import { ChooseMerchantRestService } from './ChooseMerchantRestService';
import { OutletRestService } from './OutletRestService';
import { ProductRestService } from './ProductRestService';
import { PiriPayRestService } from './PiriPayRestService';
import { OrderRestService } from './OrderRestService';

export const historyRestService = new HistoryRestService;
export const chooseMerchantRestService = new ChooseMerchantRestService;
export const outletRestService = new OutletRestService;
export const productRestService = new ProductRestService;
export const piriPayRestService = new PiriPayRestService;
export const orderRestService = new OrderRestService;
