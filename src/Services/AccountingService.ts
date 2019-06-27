import * as AccountingJS from 'accounting';

export class AccountingService {
  ac: any = AccountingJS;

  constructor() {
    this.ac.settings.currency.symbol = 'IDR ';
    this.ac.settings.currency.decimal = '.';
    this.ac.settings.currency.thousand = ',';

    this.ac.settings.number.decimal = '.';
    this.ac.settings.number.thousand = ',';
  }

  formatRp(numb){
    this.ac.settings.currency.symbol = 'Rp ';
    this.ac.settings.currency.decimal = ',';
    this.ac.settings.currency.thousand = '.';
    return this.ac.formatMoney(numb).slice(0, -3);
  }
}
