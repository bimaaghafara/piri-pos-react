import { AsyncStorage } from 'react-native';
import { HttpRequestInterceptedService } from '../../Core/Http/HttpRequestInterceptedService';
import * as SunmiInnerPrinter from 'react-native-sunmi-inner-printer';
import * as _ from 'lodash';
import { printContent80Service, printContent58Service, printerStoreService } from './index';
import { Toast } from 'native-base';
import DUMMY_ORDER from './DummyOrder';


export class PrinterRestService {
    // Get Printer List from Listener
    async getPrinterList() {
        const ipListener = await AsyncStorage.getItem('IP_LISTENER');
        const httpRequest = new HttpRequestInterceptedService(`http://${ipListener}:1902/printers`);
        return httpRequest.get<any>();
    }

    // Print via Listener
    async printToListener(printerName: string, printLines: any[]) {
        const ipListener = await AsyncStorage.getItem('IP_LISTENER');
        const httpRequest = new HttpRequestInterceptedService(`http://${ipListener}:1902/cashier`);
        const body = { printerName: printerName, printLines: printLines }
        return httpRequest.post<any>('', body);
    }

    // Print to Manual IP Printer
    printToManual(ip: string, port: string, printLines: any[]) {
        const body = {
            ip: ip,
            port: port,
            orderLinesContent: printLines
        };
        const httpRequest = new HttpRequestInterceptedService(`http://localhost:5000/print-to-ip`);
        return httpRequest.post<any>('', body);
    }

    // Print to Sunmi Printer
    async printToSunmi(printLines: any[]) {
        try {
            await SunmiInnerPrinter.printOriginalText(printLines.join('\n'));
        } catch (error) {
            Toast.show({ type: 'danger', text: error });
        }
    }

    // Print function to decide how to print
    print(Printer: { type: string, id: string, ip: string, port: string, name: string }, printLines: any[]) {
        switch (Printer.type) {
            case 'listener':
                return this.printToListener(Printer.name, printLines);
                break;
            case 'manual':
                return this.printToManual(Printer.ip, Printer.port, printLines);
                break;
            case 'sunmi':
                return this.printToSunmi(printLines);
                break;
        }
    }

    getContent(order, lines, type: 'cashier' | 'area', paperSize) {
        switch (paperSize) {
            case 80:
                return printContent80Service.getOrderContent(order, lines, type);
                break;
            case 58:
                return printContent58Service.getOrderContent(order, lines, type);
                break;
        }
    }

    // Print to every saved Printer Area
   async doPrint(order) {
        // console.log(order)
        printerStoreService.get().then(res => {
            const printerStore = JSON.parse(res);
            _.forEach(printerStore, (p) => {
                if (p.id === 'main') {
                    const content = this.getContent(order, order.lines, 'cashier', p.paperSize)
                    this.print(p, content);
                } else {
                    const lines = order.lines.filter(l => l.printerAreaId === p.id);
                    if (lines.length > 0) {
                        const content = this.getContent(order, lines, 'area', p.paperSize);
                        this.print(p, content);
                    }
                }
            });

        })
    }

    testPrint(printer) {
        const order = DUMMY_ORDER;
        const content = this.getContent(order, order.lines, 'cashier', printer.paperSize)
        this.print(printer, content);
    }

}