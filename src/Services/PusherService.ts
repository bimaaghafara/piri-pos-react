import * as Pusher from 'pusher-js/react-native';
import APP_CONSTANT from '../Config/Constant';
import { Observable } from 'rxjs/Observable';
import { AsyncStorage } from 'react-native';


export class PusherService {
    async connectPusher() {
        const socket = new Pusher(APP_CONSTANT.PUSHER_KEY, {
            cluster: APP_CONSTANT.PUSHER_CLUSTER,
        });
        const merchant = JSON.parse(await AsyncStorage.getItem(APP_CONSTANT.STORAGE_KEY.SELECTED_MERCHANT));
        const outletID = await AsyncStorage.getItem(APP_CONSTANT.STORAGE_KEY.SELECTED_OUTLET);
        const channelName = 'm-' + merchant.companyId + '-o-' + outletID;
        const channel = socket.subscribe(channelName);
        return channel;
    }

    bindChannelEvent(eventName: string) {
        return Observable.create((observer) => {
            this.connectPusher().then(channel => {
                channel.bind(eventName, (data) => {
                    observer.next(data);
                });
            })
        });
    }
}