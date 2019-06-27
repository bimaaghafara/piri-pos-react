import * as moment from 'moment';
import * as _ from 'lodash';

export class PrintContent58Service {

  formatMoney(angka: number) {
    let rupiah = '';
    let angkarev = angka.toString().split('').reverse().join('');
    for (let i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return rupiah.split('', rupiah.length - 1).reverse().join('');
  }

  getOrderContent(order: any, orderLines: any, type: 'area' | 'cashier') {
    const printLines: any[] = [];

    const orderId = order.orderNumber;
    const { tableNumber } = order;
    const customerName = `${order.customer.fullName}`;
    const timestamp = [
      'Date: ' + moment([
        order.orderDate,
        order.orderTime.split('.')[0]
      ].join(' '), 'YYYY-MM-DD HH:mm:ss')
        .format('LL'),
      '\x0A',
      'Time: ' + moment([
        order.orderDate,
        order.orderTime.split('.')[0]
      ].join(' '), 'YYYY-MM-DD HH:mm:ss')
        .format('LTS')
    ].join('');

    printLines.push(timestamp || new Date());
    printLines.push('================================');
    printLines.push(`Order ID: #${orderId}`);
    printLines.push(`Customer Name: ${customerName}`);
    if (tableNumber) {
      printLines.push(`Table Number: ${tableNumber}`);
    }
    printLines.push('================================');
    switch (type) {
      case 'area':
        printLines.push(this.orderLinesArea(orderLines));
        break;

      case 'cashier':
        printLines.push(this.orderLinesCashier(orderLines));
        break;
    }
    printLines.push('--------------------------------');
    type === 'cashier' && printLines.push(this.orderSummary(order));
    printLines.push('\n');
    printLines.push('\n');
    printLines.push('\n');

    return printLines;
  }

  orderLinesArea(lines: any) {
    let lineIndex = 0;
    let arrayDesc2;
    let desc2;
    const leftSpacesCount = 2;
    const leftSpacesMaxLength = `${lines.slice().sort((a, b) => b.qty - a.qty)[0].qty}`.length + leftSpacesCount;
    return _.map(lines, (o) => {
      lineIndex++;
      const firstLeftSpaces = _.range(0, leftSpacesMaxLength - o.qty.toString().length).map(() => ' ').join('');
      const lineLeftSpaces = _.range(0, leftSpacesMaxLength + 1).map(() => ' ').join('');
      if (o.description2) {
        arrayDesc2 = o.description2.split('\n');
        for (let i = 0; i < arrayDesc2.length; i++) {
          arrayDesc2[i] = `\x0A${lineLeftSpaces}` + arrayDesc2[i];
        }
        desc2 = arrayDesc2.join();
      }
      return `${lineIndex > 1 ? `\x0A` : ''}` +
        `x${o.qty}${firstLeftSpaces}${o.description}` +
        `${o.description2 ? `${desc2}` : ''}` +
        `${o.customerNote ? `\x0A${lineLeftSpaces}${o.customerNote}` : ''}`;
    }).join('\x0A');
  }

  orderLinesCashier(lines: any) {
    let lineIndex = 0;
    let arrayDesc2;
    let desc2;
    const leftSpacesCount = 2;
    const leftSpacesMaxLength = `${lines.slice().sort((a, b) => b.qty - a.qty)[0].qty}`.length + leftSpacesCount;
    // const secondLeftSpaceMaxLength = `${lines.slice().sort((a, b) =>  b.description.toString().length - a.description.toString().length)[0].description.toString()}`.length + leftSpacesCount;
    const secondLeftSpaceMaxLength = 19 + leftSpacesCount;
    const spaceTotalMaxLengt = `${lines.slice().sort((a, b) => b.total - a.total)[0].total}`.length;
    return _.map(lines, (o) => {
      lineIndex++;
      const desc = o.description;
      const descLength = desc.toString().length > 19 ? 19 : o.description.toString().length
      const firstLeftSpaces = _.range(0, leftSpacesMaxLength - o.qty.toString().length).map(() => ' ').join('');
      const secondLeftSpaces = _.range(0, secondLeftSpaceMaxLength - descLength).map(() => ' ').join('');
      const lineLeftSpaces = _.range(0, leftSpacesMaxLength + 1).map(() => ' ').join('');
      if (o.description2) {
        arrayDesc2 = o.description2.split('\n');
        for (let i = 0; i < arrayDesc2.length; i++) {
          arrayDesc2[i] = `\x0A${lineLeftSpaces}` + arrayDesc2[i];
        }
        desc2 = arrayDesc2.join();
      }
      let descSlice1;
      let descSlice2;
      if (desc.toString().length > 19) {
        descSlice1 = desc.slice(0, 18) + '-';
        descSlice2 = `\x0A${lineLeftSpaces}` + desc.slice(18)
      }
      const ltotal = _.range(0, spaceTotalMaxLengt - o.total.toString().length).map(() => ' ').join('');
      return `${lineIndex > 1 ? `\x0A` : ''}` +
        `x${o.qty}${firstLeftSpaces}${desc.toString().length > 19 ? descSlice1 : o.description}${secondLeftSpaces}${ltotal}${this.formatMoney(o.total)}` +
        `${desc.toString().length > 19 ? descSlice2 : ''}` +
        `${o.description2 ? `${desc2}` : ''}`;
    }).join('\x0A');
  }


  orderSummary(order) {
    const obj = [
      {
        label: 'Subtotal',
        value: order.subTotal,
      },
      {
        label: 'Promo',
        value: order.promoDiscountAmount,
      },
      {
        label: `Tax (${order.taxRate}%)`,
        value: order.taxAmount,
      },
      {
        label: 'Service Charge',
        value: order.serviceChargeAmount,
      },
      {
        label: 'Voucher',
        value: order.voucherAmount,
      },
      {
        label: 'Total',
        value: order.total,
      }
    ];
    const maxValueSpace = `${obj.slice().sort((a, b) => b.value - a.value)[0].value}`.length + 2;
    return _.map(obj, o => {
      const itself = `${o.label}`.length
      const space = `${_.range(0, 28 - itself - maxValueSpace).map(o => { return ' ' }).join('')}`
      const selfspace = `${_.range(0, maxValueSpace - o.value.toString().length).map(o => { return ' ' }).join('')}`;
      return `${o.label}:${space} ${selfspace}${this.formatMoney(o.value)}\x0A`;
    }).join('');
  }

}