import * as React from 'react';
import * as _ from 'lodash';
import {
          Container, Text, Content,
          View, Card, CardItem, Body,
          Item, Input, Button, CheckBox,
          Spinner as LoadMoreSpinner, Toast } from 'native-base';
import { themeService, accountingService } from '../../Services';
import { Dropdown } from 'react-native-material-dropdown';
import { productRestService } from '../../Services/Rest'
import { authenticationStorageService } from '../../Core/Services';
import { Observable } from 'rxjs/Observable';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableOpacity } from 'react-native';

export class ProductsComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      loadMore: false,
      countLastResult: null,
      sku: '',
      name: '',
      category: '',
      products: [],
      printerAreas: [],
      categories: [],
      outletID: null,
    }
  }

  styles = themeService.bind(this, 'productsPage');

  componentWillMount() {
    Observable.from(authenticationStorageService.selectedOutlet)
      .subscribe(outletID => this.setState({ outletID: outletID }, () => {
        this.loadData();
      }), err => {
        console.log(err)
      }
      )
  }

  loadData(isLoadMore: boolean = false, reset: boolean = false) {
    const filterValues = [];
    this.state.sku != '' && productRestService._addSimpleFilter(filterValues, 'sku', this.state.sku);
    this.state.name != '' && productRestService._addSimpleFilter(filterValues, 'name', this.state.name);
    this.state.category != '' && productRestService._addSimpleFilter(filterValues, 'product.category.name', this.state.category);
    const qOption = {
      take: 40,
      skip: !reset ? this.state.products.length : 0,
      filter: filterValues.length > 0 ? filterValues : []
    };
    this.setState({ loading: !isLoadMore, loadMore: isLoadMore }, () => {
      Observable.combineLatest(
        productRestService.getAllProduct(qOption, this.state.outletID),
        productRestService.getPrinterAreas({}, this.state.outletID),
        productRestService.getProductEntryRelatedData()
      ).subscribe(([products, printerAreas, categories]) => {
        this.setState({
          loading: false, loadMore: false,
          countLastResult: products.data.length,
          products: reset ? products.data : this.state.products.concat(products.data),
          categories: _.map(categories.categories, (c) => {
            return {
              value: c.name
            }
          }),
          printerAreas: _.map(printerAreas.data, (o) => {
            return {
              label: o.name,
              value: o.id
            }
          }),
        });
      }, err => {
        this.setState({ loading: false, loadMore: false });
        console.log(err)
      });
    });
  }

  _renderFilter() {
    const { categories } = this.state;
    return (
      <Card style={{ marginBottom: 25 }}>
        <CardItem>
          <Body>
            <Text style={[this.styles.get('label'), { marginTop: 10 }]}> SKU </Text>
            <Item regular style={this.styles.get('input')}>
              <Input
                onChangeText={(text) => this.setState({ sku: text })}
                value={this.state.sku}
                placeholder={'Search SKU'} />
            </Item>
            <Text style={this.styles.get('label')}> Product Name </Text>
            <Item regular style={this.styles.get('input')}>
              <Input
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder={'Search Product Name'} />
            </Item>
            <Text style={this.styles.get('label')}> Category </Text>
            <Item regular style={{ paddingHorizontal: 10 }}>
              <Dropdown
                label='Choose Category'
                data={categories}
                value={this.state.category}
                dropdownOffset={{ top: 4, left: 0 }}
                containerStyle={{ flexGrow: 1, height: 35 }}
                fontSize={18}
                rippleOpacity={0}
                onChangeText={(value) => this.setState({ category: value })}
              />
            </Item>
            <Item style={{ borderBottomWidth: 0 }}>
              <View padder style={{ flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Button light small
                  onPress={() => this.setState({ sku: '', name: '', category: '' })}
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

  setPrintArea(productVariant, printArea) {
    productRestService.setPrintArea(productVariant, printArea, this.state.outletID)
      .subscribe(res => {}, err => {
        Toast.show({
          text: 'Error when change print area',
          buttonText: 'Okay',
          textStyle: { color: 'red' },
        })
      })
  }

  toggleSoldOut(productVariant, id, name, soldOut) {
    productRestService.setSoldOut(productVariant, soldOut, this.state.outletID)
    .subscribe(res => {
        let arr = this.state.products;
        const index = arr?_.findIndex(arr, {id: id}):0;
        console.log(index);
        productVariant.soldOut = soldOut;
        arr.splice(index, 1, productVariant);
        this.setState({products: arr})
        Toast.show({
          text: soldOut ? name + ' sold out' : name + ' ready',
          buttonText: 'Okay',
          textStyle: { color: soldOut ? 'yellow' : 'green' },
        })
      }, err => {
        console.log(err)
        Toast.show({
          text: err,
          buttonText: 'Okay'
        })
      })
  }

  _renderProductItem(item) {
    const printers = [{label:'No Print',value:null}].concat(this.state.printerAreas);
    //console.log(printers);
    return (
      <Card style={{ marginBottom: 10 }} key={item.sku}>
        <CardItem>
          <Body>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> SKU </Text>
              <Text style={this.styles.get('label')}>
                {_.get(item, 'sku')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Product Name </Text>
              <Text style={[this.styles.get('label'), this.styles.get('value')]}>
                {_.get(item, 'name')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Price </Text>
              <Text style={this.styles.get('label')}>
                {accountingService.ac.formatMoney(_.get(item, 'unitPrice'))}
              </Text>
            </View>
            <Text style={this.styles.get('label')}> Print To </Text>
            <Item regular style={{ paddingHorizontal: 10, marginBottom: 10 }}>
              <Dropdown
                label='Choose Printer'
                data={printers}
                value={_.get(item, 'printArea') || undefined}
                dropdownOffset={{ top: 4, left: 0 }}
                containerStyle={{ flexGrow: 1, height: 35 }}
                fontSize={18}
                rippleOpacity={0}
                onChangeText={(value) => this.setPrintArea(item, value)}
              />
            </Item>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[this.styles.get('label'), { width: 125 }]}> Sold Out </Text>
              <CheckBox
                style={{ left: 5 }}
                color={'#f00'}
                onPress={() =>  this.toggleSoldOut(item, _.get(item, 'id'), _.get(item, 'name'), !_.get(item, 'soldOut'))}
                checked={_.get(item, 'soldOut')} />
            </View>
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
      <Container>
        <Content>
          <View padder>
            <View>
              {this._renderFilter()}
            </View>
            {this.state.products.map(p => this._renderProductItem(p))}
            {this.state.loadMore ? <LoadMoreSpinner /> : this._renderLoadMore()}
          </View>
        </Content>
        <Spinner visible={_.get(this.state, 'loading')} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
      </Container>
    );
  }

}
