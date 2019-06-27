import * as React from 'react';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import {
    Container, Content,
    Card, CardItem, Body,
    Header, Left, Button,
    Icon, Row, Col, Badge,
} from 'native-base';
import {
    Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { statusModifierService, accountingService, themeService } from '../../../../Services';
import { authenticationStorageService } from '../../../../Core/Services';
import { historyRestService } from '../../../../Services/Rest';
import Spinner from 'react-native-loading-spinner-overlay';

export class OrderHistoryDetailComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            outletID: null,
            detail: null
        }
    }

    styles = themeService.bind(this, 'orderHistoryPage');

    componentDidMount() {
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

    loadData() {
        const { outletID } = this.state;
        const { orderID } = this.props;
        this.setState({ loading: true }, () => {
            historyRestService.getOrder(outletID, orderID)
                .subscribe(data => this.setState({ loading: false, detail: data }))
        })
    }

    renderDetail() {
        const item = this.state.detail;
        const lines = _.get(item, 'lines');
        return (
            item && <Card
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
                            <Col>
                                <Text style={this.styles.get('label')}> Status </Text>
                                <Badge
                                    style={{
                                        backgroundColor: statusModifierService.getColor(_.get(item, 'status')),
                                        flex: 1,
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{color: '#fff'}}> {statusModifierService.getText(_.get(item, 'status'))} </Text>
                                </Badge>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Email </Text>
                                <Text style={this.styles.get('value')}> {_.get(item, 'customer.email')} </Text>
                            </Col>
                        </Row>
                        <Row style={[this.styles.get('separator'), {marginTop: 20}]}>
                            <Col>
                                <Text style={this.styles.get('label')}> Subtotal </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}>
                                <Text style={this.styles.get('value')}> {accountingService.ac.formatMoney(_.get(item, 'subTotal'))} </Text>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Promo </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}>
                                <Text style={this.styles.get('value')}> - {accountingService.ac.formatMoney(_.get(item, 'promoDiscountAmount'))} </Text>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Service Charge </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}> 
                                <Text style={this.styles.get('value')}> {accountingService.ac.formatMoney(_.get(item, 'serviceChargeAmount'))} </Text>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Tax </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}> 
                                <Text style={this.styles.get('value')}> {accountingService.ac.formatMoney(_.get(item, 'taxAmount'))} </Text>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Voucher </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}>
                                <Text style={this.styles.get('value')}> - {accountingService.ac.formatMoney(_.get(item, 'voucherAmount'))} </Text>
                            </Col>
                        </Row>
                        <Row style={this.styles.get('separator')}>
                            <Col>
                                <Text style={this.styles.get('label')}> Total Sales </Text>
                            </Col>
                            <Col style={{alignItems: 'flex-end'}}>
                                <Text style={this.styles.get('value')}> {accountingService.ac.formatMoney(_.get(item, 'total'))} </Text>
                            </Col>
                        </Row>
                    </Body>
                </CardItem>
                <CardItem style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <Body>
                        {lines.length > 0 && lines.map(i => <Row key={i.id}>
                            <Col size={50}>
                                <Text>{i.productVariant.name}</Text>
                            </Col>
                            <Col size={10}>
                                <Text>{i.qty}</Text>
                            </Col>
                            <Col size={40} style={{alignItems: 'flex-end'}}>
                                <Text>{accountingService.ac.formatMoney(i.total)}</Text>
                            </Col>
                        </Row>)}
                    </Body>
                </CardItem>
            </Card>
        )
    }



    render() {

        return (
            <Container>
                <Header
                    style={{ backgroundColor: '#fff' }}>
                    <Left>
                        <Button transparent onPress={() => Actions.push('historyPage')}>
                            <Icon
                                style={{ fontSize: 30, color: 'black' }}
                                name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{fontSize: 20}}>Order Detail</Text>
                    </Body>
                </Header>
                <Content padder>
                    {this.renderDetail()}
                </Content>
                <Spinner visible={_.get(this.state, 'loading')} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
            </Container>
        )
    }
}