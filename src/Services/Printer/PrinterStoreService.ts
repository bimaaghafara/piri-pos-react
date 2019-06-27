import { AsyncStorage } from 'react-native';
import * as _ from 'lodash';
const printer_store_key = 'PRINTER_STORE_KEY';

export class PrinterStoreService {

    get() {
         return AsyncStorage.getItem(printer_store_key);
    }

    async add(Printer: {type: string, id: string, ip: string, port: string, name: string}) {
        const recentPrinters = JSON.parse(await AsyncStorage.getItem(printer_store_key));
        if (!_.isNull(recentPrinters)) {
            _.remove(recentPrinters, {id: Printer.id})
            await recentPrinters.push(Printer);
            await AsyncStorage.setItem(printer_store_key, JSON.stringify(recentPrinters));
        } else {
            const Printers = [];
            await Printers.push(Printer);
            await AsyncStorage.setItem(printer_store_key, JSON.stringify(Printers));
        }
    }
}