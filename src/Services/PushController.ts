import * as PushNotification from 'react-native-push-notification';
import * as React from 'react';

export class PushController extends React.Component{
  componentDidMount() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
      popInitialNotification: true,
      requestPermissions: true,
      permissions: {
            alert: true,
            badge: true,
            sound: true
        },
    });
  }

  render() {
    return null;
  }
}