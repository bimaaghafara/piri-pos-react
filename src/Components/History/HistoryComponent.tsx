import * as React from 'react';
import { Container, Text, Button, View, Content } from 'native-base';

import {OrderHistoryComponent} from './OrderHistory/OrderHistoryModule';
import {TopupHistoryComponent} from './TopupHistory/TopupHistoryModule';

export class HistoryComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 1,
      activeStyle: {fontWeight: '600'},
      inactiveStyle: {color: '#bbb', fontWeight: '600'},
    };
  }

  activateTab(index) {
    this.setState({activeTab: index});
  }

  render() {
    return (
      <Container>
        {/* Tab Button */}
        <View padder style={{flexDirection: 'row'}}>
          <Button active small transparent dark onPress={() => this.activateTab(1)}>
            <Text style={this.state.activeTab === 1 ? this.state.activeStyle : this.state.inactiveStyle}>Order History</Text>
          </Button>
          <Button small transparent dark onPress={() => this.activateTab(2)}>
            <Text style={this.state.activeTab === 2 ? this.state.activeStyle : this.state.inactiveStyle}>Topup History</Text>
          </Button>
        </View>

        {/* Tab Content */}
        <Content>
          {(this.state.activeTab === 1) &&
            <OrderHistoryComponent />
          }
          {(this.state.activeTab === 2) &&
            <TopupHistoryComponent />
          }
        </Content>
      </Container>
    );
  }

}
