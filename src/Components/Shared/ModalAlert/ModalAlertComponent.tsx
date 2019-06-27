import * as React from 'react';

import { Text, Button, View, Item, Input } from 'native-base';
import { themeService } from '../../../Services';
import IconFe from 'react-native-vector-icons/Feather';

interface props {
  type: 'phone' | 'print' | 'call' | 'notif' | 'confirm' | 'ready' | 'finish' | 'cancel';
  content: string | number;
  submitLabel?: string;
  onSubmit: () => any;
  onCancel: () => any;
  onChangeText?: (text: any) => any;
}

export class ModalAlertComponent extends React.Component<props, any> {

  constructor(props: any) {
    super(props);
    this.state = {

    };
  }

  static defaultProps = {
    submitLabel: 'Submit',
  };

  styles = themeService.bind(this, 'modalAlertComponent');

  render() {
    const {
      type, content, onSubmit, onCancel, submitLabel, onChangeText
    } = this.props;

    const { get } = this.styles;

    let icon, middleText, bottomText;
    if (type === 'phone') {
      icon = <IconFe name='phone-call' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}> Hubungi Pelanggan?</Text>;
      bottomText = <Text style={get('bottomText')}> Apa anda ingin menghubungi pelanggan {content}? </Text>;
    } else if (type === 'confirm') {
      icon = <IconFe name='alert-circle' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Approve #{content}?</Text>;
      bottomText = <Text style={get('bottomText')}>Ubah status pesanan menjadi: Confirmed </Text>;
    } else if (type === 'ready') {
      icon = <IconFe name='check-circle' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Ubah status #{content}?</Text>;
      bottomText = <Text style={get('bottomText')}>Ubah status pesanan menjadi: Ready </Text>;
    } else if (type === 'finish') {
      icon = <IconFe name='check-square' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Pick Up {content}?</Text>;
      bottomText = <Text style={get('bottomText')}>Ubah status pesanan menjadi: Closed</Text>;
    } else if (type === 'print') {
      icon = <IconFe name='printer' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Print Order #{content}?</Text>;
      bottomText = <Text style={get('bottomText')}>Apakah anda ingin mencetak bukti pesanan #{content}</Text>;
    } else if (type === 'notif') {
      icon = <IconFe name='bell' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Notifikasi pelanggan?</Text>;
      bottomText = <Text style={get('bottomText')}>Apakah anda ingin mengirimkan notifikasi untuk pelanggan #{content}</Text>;
    } else if (type === 'cancel') {
      icon = <IconFe name='x-circle' color={'#ddd'} size={81} />;
      middleText = <Text style={get('middleText')}>Batalkan #{content}?</Text>;
      bottomText = <Text style={get('bottomText')}>Peasanan yang telah dibatalkan tidak dapat dikembalikan. Silahkan berikan alasan pembatalan (jika ada).</Text>;
    }

    return (
      <View padder>
        <View style={get('container')}>
          <View padder>
            {icon}
          </View>
          {middleText}
          {bottomText}
        </View>
        {type === 'cancel' &&
          <View style={{flexGrow: 1, paddingHorizontal: 10, paddingTop: 20}}>
            <Item regular style={get('input')}>
              <Input
                onChangeText={onChangeText}
              />
            </Item>
          </View>
        }
        <View padder style={get('buttonContainer')}>
          <Button style={get('button')} onPress={onSubmit}>
            <Text>{submitLabel}</Text>
          </Button>
          <Button light style={get('button')} onPress={onCancel}>
            {type !== 'cancel' &&
              <Text>Cancel</Text>
            }
            {type === 'cancel' &&
              <Text>Back</Text>
            }
          </Button>
        </View>
      </View>
    );
  }

}