import { HttpRequestInterceptedService } from '../Core/Http/HttpRequestInterceptedService';
import APP_CONSTANT from '../Config/Constant';
import { AsyncStorage } from 'react-native';
import * as BackgroundJob from 'react-native-background-job';
import * as _ from 'lodash';
BackgroundJob.register({
    jobKey: 'backgroundPing',
    job: async () => {
        const accessToken = await AsyncStorage.getItem(APP_CONSTANT.STORAGE_KEY.ACCESS_TOKEN)
        const outletID = await AsyncStorage.getItem(APP_CONSTANT.STORAGE_KEY.SELECTED_OUTLET)
        const httpRequest = new HttpRequestInterceptedService(APP_CONSTANT.BASE_POS_API_URL + '/fnb/pos');
        if (!_.isNull(accessToken)) {
            httpRequest.get<boolean>('outlets/' + outletID + '/ping').subscribe(res => {}, err => console.log('accessToken was change'));
        }
    }
});

export class PingService {

    doPing() {
        BackgroundJob.schedule({
            jobKey: 'backgroundPing',
            period: 3000, // <= in milisecond
            exact: true,
            allowExecutionInForeground: true
        });

    }

    stopPing() {
        BackgroundJob.cancelAll()
    }


}
