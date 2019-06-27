import * as React from 'react';
import { Actions } from 'react-native-router-flux';

import { Container, Text, List, ListItem } from 'native-base';
import { authenticationService } from '../../Core/Services';
import { pingService } from '../../Services'

export class NavigationComponent extends React.Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  doLogout() {
    authenticationService.logout();
    pingService.stopPing();
  }

  render() {
    return (
      <Container>
        <List>
            <ListItem itemDivider style={{height: 70}}>
              <Text style={{fontSize: 28}}> Menu </Text>
            </ListItem>
            <ListItem onPressOut={Actions.ordersPage}>
              <Text> Orders </Text>
            </ListItem>
            <ListItem onPressOut={Actions.piriPayPage}>
              <Text> Piri Pay Topup </Text>
            </ListItem>
            <ListItem onPressOut={Actions.historyPage}>
              <Text> Histories </Text>
            </ListItem>
            <ListItem onPressOut={Actions.productsPage}>
              <Text> Products </Text>
            </ListItem>
            <ListItem onPressOut={Actions.settingsPage}>
              <Text> Settings </Text>
            </ListItem>
            <ListItem onPressOut={() => this.doLogout()}>
              <Text> Logout </Text>
            </ListItem>
        </List>
      </Container>
    );
  }

}
