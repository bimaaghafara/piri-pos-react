import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Row, Col, Text, Content, View, Card, CardItem, Body, Item, Input, Button, Spinner as LoadMoreSpinner, Badge } from 'native-base';
import { themeService } from '../../../Services';
import DatePicker from 'react-native-datepicker';
import IconFa from 'react-native-vector-icons/FontAwesome';
import { historyRestService } from '../../../Services/Rest'
import { FlatList, TouchableOpacity } from 'react-native';
import { statusModifierService, accountingService } from '../../../Services';
import Spinner from 'react-native-loading-spinner-overlay';
import { authenticationStorageService } from '../../../Core/Services';
import { Observable } from 'rxjs/Observable';
import { Actions } from 'react-native-router-flux';

export class OrderHistoryComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      outletID: null,
      startDate: '',
      endDate: '',
      customerName: '',
      orderNumber: '',
      order: [],
      loading: false,
      loadMore: false,
      countLastResult: null
    }
  }

  styles = themeService.bind(this, 'orderHistoryPage');

  componentWillMount() {
    Observable.from(authenticationStorageService.selectedOutlet).subscribe(outletID => {
      if (outletID) {
        this.setState({ outletID: outletID }, () => {
          this.loadData();
        })
      } else {
        Actions.settingsPage();
      }
    }, err => console.log(err))
  }

  loadData(isLoadMore: boolean = false, reset: boolean = false) {
    let filterValues = [];
    this.state.customerName != '' && historyRestService.addSimpleFilter(filterValues, 'customer.fullName', this.state.customerName);
    this.state.orderNumber != '' && historyRestService.addSimpleFilter(filterValues, 'orderNumber', this.state.orderNumber);
    const option = {
      take: 20,
      skip: !reset ? this.state.order.length : 0,
      filter: filterValues.length > 0 ? filterValues : [],
      includeLines: true
    }
    this.setState({ loading: !isLoadMore, loadMore: isLoadMore }, () => {
      historyRestService.getOrderHistory(option, this.state.outletID.toString(), this.state.startDate, this.state.endDate)
        .subscribe(res => this.setState({ loading: false, loadMore: false, order: reset ? res.data : this.state.order.concat(res.data), countLastResult: res.data.length }),
          err => this.setState({ loading: false, loadMore: false }, () => console.log(err)));
    });
  }

  _renderFilter() {
    return (
      <Card style={{ marginBottom: 25 }}>
        <CardItem>
          <Body>
            <Row>
              <Col>
                <Text style={this.styles.get('label')}> Start Date Order </Text>
                <DatePicker
                  style={{ width: '100%', marginBottom: 12 }}
                  date={this.state.startDate}
                  mode='date'
                  placeholder='YYYY-MM-DD'
                  format='YYYY-MM-DD'
                  confirmBtnText='Confirm'
                  cancelBtnText='Cancel'
                  iconComponent={<View style={{ right: 28 }}><IconFa name='calendar' size={20} /></View>}
                  customStyles={{
                    dateInput: {
                      marginLeft: 2, height: 35, borderWidth: 0.5, paddingLeft: 8, alignItems: 'flex-start'
                    }
                  }}
                  onDateChange={(date) => { this.setState({ startDate: date }) }}
                />

              </Col>
              <Col>
                <Text style={this.styles.get('label')}> End Date Order </Text>
                <DatePicker
                  style={{ width: '100%', marginBottom: 12 }}
                  date={this.state.endDate}
                  mode='date'
                  placeholder='YYYY-MM-DD'
                  format='YYYY-MM-DD'
                  confirmBtnText='Confirm'
                  cancelBtnText='Cancel'
                  iconComponent={<View style={{ right: 28 }}><IconFa name='calendar' size={20} /></View>}
                  customStyles={{
                    dateInput: {
                      marginLeft: 2, height: 35, borderWidth: 0.5, paddingLeft: 8, alignItems: 'flex-start',
                    }
                  }}
                  onDateChange={(date) => { this.setState({ endDate: date }) }}
                />
              </Col>
            </Row>

            <Text style={this.styles.get('label')}> Customer Name </Text>
            <Item regular style={this.styles.get('input')}>
              <Input
                value={this.state.customerName}
                onChangeText={(text) => this.setState({ customerName: text })}
                placeholder={'Search Customer Name'} />
            </Item>
            <Text style={this.styles.get('label')}> Order Number </Text>
            <Item regular style={this.styles.get('input')}>
              <Input
                value={this.state.orderNumber}
                onChangeText={(text) => this.setState({ orderNumber: text })}
                placeholder={'Search Order Number'} />
            </Item>
            <Item style={{ borderBottomWidth: 0 }}>
              <View padder style={{ flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Button light small
                  onPress={() => this.setState({ startDate: '', endDate: '', customerName: '', orderNumber: '' })}
                  style={{ margin: 10 }}>
                  <Text>Reset</Text>
                </Button>
                <Button success small
                  onPress={() => this.loadData(false, true)}
                  style={{ margin: 10 }}>
                  <Text>Apply</Text>
                </Button>
              </View>
            </Item>
          </Body>
        </CardItem>
      </Card>
    );
  }

  _renderOrderList = () => {
    const { order } = this.state;
    if (order.length > 0) {
      return (
        <FlatList
          data={order}
          keyExtractor={item => item.id}
          renderItem={this._renderOrderItem}
          ListFooterComponent={this.state.loadMore ? <LoadMoreSpinner /> : this._renderLoadMore()}
        />
      );
    } else {
      return null;
    }
  }


  _renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => Actions.push('historyOrderDetailPage', {orderID: item.id})}
        >
      <Card 
        style={{ alignItems: 'center', borderRadius: 10, }}>
        <CardItem style={{ borderRadius: 10 }}>
          <Body>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={this.styles.get('label')}> Order Number </Text>
                <Text style={this.styles.get('value')}> {_.get(item, 'orderNumber')} </Text>
              </Col>
              <Col>
                <Text style={this.styles.get('label')}> Order Date </Text>
                <Text style={this.styles.get('value')}> 
                  {moment(_.get(item, 'orderDate'), 'YYYY-MM-DD').format("DD MMM YYYY")}
                </Text>
              </Col>
            </Row>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={this.styles.get('label')}> Customer Name </Text>
                <Text style={this.styles.get('value')}> {_.get(item, 'customer.fullName')} </Text>
              </Col>
            </Row>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={this.styles.get('label')}> Total Sales </Text>
                <Text style={this.styles.get('value')}> {accountingService.ac.formatMoney(_.get(item, 'total'))} </Text>
              </Col>
              <Col>
                <Text style={this.styles.get('label')}> Status </Text>
                <Badge
                  style={{
                     backgroundColor: statusModifierService.getColor(_.get(item, 'status')),
                     flex: 1,
                     justifyContent: 'center',
                      }}>
                  <Text> {statusModifierService.getText(_.get(item, 'status'))} </Text>
                </Badge>
              </Col>
            </Row>
          </Body>
        </CardItem>
      </Card>
    </TouchableOpacity>
    )
  }



  _renderLoadMore() {
    return (
      this.state.countLastResult >= 20 &&
      <TouchableOpacity
        onPress={() => this.loadData(true)}>
        <Card style={{ marginBottom: 10 }}>
          <CardItem>
            <Body style={{ flex: 1, alignItems: 'center' }}>
              <Text>Load More</Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Content>
        <View style={{ paddingHorizontal: 10 }}>
          <View>
            {this._renderFilter()}
          </View>
          {this._renderOrderList()}

        </View>
        <Spinner visible={_.get(this.state, 'loading')} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
      </Content>
    )
  }
}
