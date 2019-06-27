import * as React from 'react';
import { Modal, Image } from 'react-native';

import { Container, Text, Button, View, Content, Item, Input } from 'native-base';
import { themeService, accountingService } from '../../../Services';

import Images from '../../../Assets/Images';

interface props {
  type: 'confirm' | 'success' | 'failed';
  icon?: JSX.Element;
  visible: boolean;
  disabledOnsubmit?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel: () => void;
  onChangeText?: (text: any) => void;
  customerName: string;
  prevBalance?: number | string;
  topupBalance: number | string;
  nextBalance?: number | string;
}

export class ModalPiriPayComponent extends React.Component<props, any> {

  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    submitLabel: 'Confirm', cancelLabel: 'Cancel', disabledOnsubmit: false,
  };

  styles = themeService.bind(this, 'modalPiriPayComponent');

  render() {
    const {
      visible, onCancel, submitLabel, onSubmit, cancelLabel, onChangeText, disabledOnsubmit, prevBalance, topupBalance, nextBalance, customerName, type,
    } = this.props;

    const { get } = this.styles;

    let tittle;
    if (type === 'confirm') {
      //tittle = 'Konfirmasi Topup';
      tittle = '';
    } else if (type === 'success') {
      tittle = 'Topup Berhasil';
    } else {
      tittle = 'Topup Gagal';
    }

    return (
      <Modal
        visible={visible}
        animationType={'fade'}
        onRequestClose={onCancel}
        transparent
      >
        <Container style={get('modalContainer')}>
        <Content contentContainerStyle={get('modalContent')}>
          <View style={get('modalWrapper')}>
            {/* modal body */}
            <View padder>
              <Image source={type === 'failed'? Images.topupFailed : Images.topupConfirm} style={get('icon')}/>
              {type !== 'failed' && 
                <Text style={get('tittle')}>Topup {accountingService.formatRp(topupBalance)}</Text>
              }
              {type === 'failed' && 
                <Text style={get('tittle')}>Topup Gagal</Text>
              }

              <View >
                {type !== 'confirm' &&
                  <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <Text style={[{width: 125}, get('label')]}>
                      Nama Customer
                    </Text>
                    <Text style={get('label')}>
                      {customerName}  
                    </Text>
                  </View>
                }

                {type === 'confirm' &&
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[{width: 125}, get('label')]}>
                        Nama Customer
                      </Text>
                      <Text style={get('label')}>
                        {customerName}  
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[{width: 125}, get('label')]}>
                        Saldo Awal
                      </Text>
                      <Text style={get('label')}>
                        {accountingService.formatRp(prevBalance)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[{width: 125}, get('label')]}>
                        Saldo Akhir
                      </Text>
                      <Text style={get('label')}>
                        {accountingService.formatRp(nextBalance)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[{width: 125}, get('label')]}>PIN </Text>
                      <View style={{width: 135}}>
                        <Item regular style={get('input')}>
                          <Input
                            secureTextEntry={true}
                            onChangeText={onChangeText}
                          />
                        </Item>
                      </View>
                    </View>
                    <View>
                      <Text style={get('warning')}>*Periksa kembali semua informasi diatas. Dana Topup yang telah terkonfirmasi tidak dapat dikembalikan/dibatalkan.</Text>
                    </View>
                  </View>
                }
                {type === 'failed' &&
                  <View style={{alignSelf: 'center', marginTop: 15}}>
                    <Text style={get('error')}> Error: Invalid PIN </Text>
                  </View>
                }
              </View>
            </View>
            {/* modal footer */}
            <View padder style={get('buttonContainer')}>
            {type !== 'failed' &&
              <Button info style={get('button')} disabled={disabledOnsubmit} onPress={onSubmit}>
                <Text>{submitLabel}</Text>
              </Button>
            }
            {type !== 'success' &&
              <Button light style={get('button')} onPress={onCancel}>
                <Text>{cancelLabel}</Text>
              </Button>
            }
            </View>
          </View>
        </Content>
        </Container>
      </Modal>
    )
  }

}