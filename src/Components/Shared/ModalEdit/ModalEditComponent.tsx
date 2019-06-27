import * as React from 'react';
import { Modal } from 'react-native';

import { Container, Text, Button, View, Content, CardItem, Body, Left, Right} from 'native-base';
import { themeService } from '../../../Services';
import IconFa from 'react-native-vector-icons/FontAwesome';
import {ModalAlertComponent} from '../ModalAlert/ModalAlertModule';

interface props {
  orderList: Array<any>;
  onEdit?: [{
    plus: () => void,
    min: () => void,
    setZero: () => void,
  }];
  onCancel?: () => void;
  onCancelOrder?: () => void;
  onEditSave?: () => void;
  orderNumber?: string | number;
  onChangeText?: (text: any) => any;
}

export class ModalEditComponent extends React.Component<props, any> {
  styles = themeService.bind(this, 'modalEditComponent');

  constructor(props: any) {
    super(props);
    this.state = {
      modalCancelOrderShow: false,
    }
  }

  toggleModalCancelOrder() {
    this.setState({
      modalCancelOrderShow: !this.state.modalCancelOrderShow
    });
  }

  render() {
    const { get } = this.styles;
    const {
      orderList, onEdit, onCancel, onCancelOrder, onEditSave, orderNumber, onChangeText,
    } = this.props;

    return (
      <View>
        <View style={get('modalHeader')}>
          <Text>Edit / Cancel Order</Text>
        </View>
        {orderList.map((order, index) => (
          <CardItem style={get('borderBottom')}>
            <Left style={get('left')}>
              <Button small transparent full style={{paddingRight: 0}}
                onPress={onEdit[index].setZero}
              >
                <Text style={{paddingLeft: 0, paddingRight: 0}}>
                  <IconFa name={'times-circle'} size={32}/>
                </Text>
              </Button>
            </Left>
            <Body style={{paddingHorizontal: 12}}>
              <Text>{order.description}</Text>
              {order.description2 &&
                <Text style={get('description2')}>{order.description2}</Text>
              }
            </Body>
            <Right style={get('right')}>
              <Button small bordered dark
                onPress={onEdit[index].min}
              >
                <Text style={get('textButton')}><IconFa name={'minus'} size={16}/></Text>
              </Button>
              <Button disabled small bordered dark >
                <Text style={get('textButton')}>{order.qty}</Text>
              </Button>
              <Button small bordered dark
                onPress={onEdit[index].plus}
              >
                <Text style={get('textButton')}><IconFa name={'plus'} size={16}/></Text>
              </Button>
            </Right>
            </CardItem>
        ))}
        <View style={get('modalFooter')}>
          <Button danger onPress={() => this.toggleModalCancelOrder()}>
            <Text>Cancel Order</Text>
          </Button>
          <View style={{flexDirection: 'row'}}>
            <Button light style={get('buttonFooter')} onPress={onCancel}>
              <Text>Cancel</Text>
            </Button>
            <Button style={get('buttonFooter')} onPress={onEditSave}>
              <Text>Save</Text>
            </Button>
          </View>
        </View>
        {/* Modal Cancel Order */}
        <Modal
          visible={this.state.modalCancelOrderShow}
          animationType={'fade'}
          onRequestClose={() => this.toggleModalCancelOrder()}
          transparent
        >
          <Container style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
              <Content contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                <View style={{margin: 20, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2}}>
                  <ModalAlertComponent
                    type={'cancel'}
                    content={orderNumber}
                    submitLabel={'Confirm'}
                    onSubmit={onCancelOrder}
                    onCancel={() => this.toggleModalCancelOrder()}
                    onChangeText={onChangeText}
                  />
                </View>
              </Content>
            </Container>
        </Modal>
      </View>
    )
  }
}