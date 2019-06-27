import * as React from 'react';
import * as _ from 'lodash';
import { FlatList, TouchableOpacity } from 'react-native';
import { Row, Col, Text, Content, View, Card, CardItem, Body, Item, Input, Button, Spinner as LoadMoreSpinner } from 'native-base';
import { themeService } from '../../../Services';
import Moment from 'react-moment';
import { accountingService } from '../../../Services';
import DatePicker from 'react-native-datepicker';
import IconFa from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { historyRestService } from '../../../Services/Rest';
import { authenticationStorageService } from '../../../Core/Services';
import { Observable } from 'rxjs/Observable';
import { Actions } from 'react-native-router-flux';

export class TopupHistoryComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      customerName: '',
      topup: [],
      countLastResult: null,
    }
  }

  styles = themeService.bind(this, 'topupHistoryPage');

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
    this.state.customerName != '' && historyRestService.addSimpleFilter(filterValues, 'userName', this.state.customerName);
    const option = {
      take: 20,
      skip: !reset ? this.state.topup.length : 0,
      filter: filterValues.length > 0 ? filterValues : [],
    }
    this.setState({ loading: !isLoadMore, loadMore: isLoadMore }, () => {
      historyRestService.getTopupHistory(option, this.state.outletID.toString(), this.state.startDate, this.state.endDate)
        .subscribe(res => this.setState({ loading: false, loadMore: false, topup: reset ? res.data : this.state.topup.concat(res.data), countLastResult: res.data.length }),
          err => this.setState({ loading: false, loadMore: false }, () => console.log(err)));
    });
  }


  _renderFilter() {
    const outlets = [{
      value: 'Oh My Cat!',
    }, {
      value: 'Oh My Pork!',
    }, {
      value: 'Piri Cafe',
    }];

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
                onChangeText={(text) => this.setState({ customerName: text })}
                value={this.state.customerName}
                placeholder={'Search Customer Name'} />
            </Item>
            {/* <Text style={this.styles.get('label')}> Outlet </Text>
            <Item regular style={{ paddingHorizontal: 10, marginBottom: 12 }}>
              <Dropdown
                label='Choose Outlets'
                data={outlets}
                dropdownOffset={{ top: 4, left: 0 }}
                containerStyle={{ flexGrow: 1, height: 35 }}
                fontSize={18}
                rippleOpacity={0}
              // onChangeText={(value) => console.error(value)}
              />
            </Item> */}
            <Item style={{ borderBottomWidth: 0 }}>
              <View padder style={{ flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Button light small
                  onPress={() => this.setState({ startDate: '', endDate: '', customerName: '' })}
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
    )
  }

  _renderTopupList = () => {
    const { topup } = this.state;
    if (topup.length > 0) {
      return (
        <FlatList
          data={topup}
          keyExtractor={item => item.id}
          renderItem={this._renderTopupItem}
          ListFooterComponent={this.state.loadMore ? <LoadMoreSpinner /> : this._renderLoadMore()}
        />
      );
    } else {
      return null;
    }
  }

  _renderTopupItem = ({ item }) => {
    return (
      <Card style={{ marginBottom: 10, borderRadius: 10, }}>
        <CardItem style={{ borderRadius: 10 }}>
          <Body>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={[this.styles.get('label'), { width: 125 }]}>Topup Date </Text>
                <Moment format='DD MMM YYYY' element={Text} style={this.styles.get('value')}>
                  {_.get(item, 'transactionDateUtc')}
                </Moment>
              </Col>
              <Col>
                <Text style={[this.styles.get('label'), { width: 125 }]}>Outlet </Text>
                <Text style={this.styles.get('value')}>
                  {_.get(item, 'outletName')}
                </Text>
              </Col>
            </Row>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={[this.styles.get('label'), { width: 125 }]}>Customer Name </Text>
                <Text style={this.styles.get('value')}>
                  {_.get(item, 'userName')}
                </Text>
              </Col>
            </Row>
            <Row style={this.styles.get('separator')}>
              <Col>
                <Text style={[this.styles.get('label'), { width: 125 }]}>Topup Amount </Text>
                <Text style={this.styles.get('value')}>
                  {accountingService.ac.formatMoney(_.get(item, 'amount'))}
                </Text>
              </Col>
              {/* <Col></Col> */}
            </Row>
            {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Topup Date </Text>
              <Moment format='DD MMM YYYY' element={Text} style={this.styles.get('value')}>
                {_.get(item, 'transactionDateUtc')}
              </Moment>
            </View> */}
            {/* <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Customer Name </Text>
              <Text style={this.styles.get('value')}>
                {_.get(item, 'userName')}
              </Text>
            </View> */}
            {/* <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Outlet </Text>
              <Text style={this.styles.get('value')}>
                {_.get(item, 'outletName')}
              </Text>
            </View> */}
            {/* <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Topup Amount </Text>
              <Text style={this.styles.get('value')}>
                {accountingService.ac.formatMoney(_.get(item, 'amount'))}
              </Text>
            </View> */}
          </Body>
        </CardItem>
      </Card>
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
          {this._renderTopupList()}
        </View>
        <Spinner visible={_.get(this.state, 'loading')} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
      </Content>
    )
  }
}
