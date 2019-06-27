import * as React from 'react';
import * as _ from 'lodash';
import { Modal, AsyncStorage } from 'react-native';
import { Observable } from 'rxjs/Observable';
import { Container, Text, Content, View, Card, CardItem, Body, Item, Input, Button, Col, Row, ListItem, Radio, List } from 'native-base';
import { themeService } from '../../Services';
import { printerRestService, printerStoreService } from '../../Services/Printer';
import { Dropdown } from 'react-native-material-dropdown';
import { productRestService } from '../../Services/Rest'
import { authenticationStorageService } from '../../Core/Services';
import * as SunmiInnerPrinter from 'react-native-sunmi-inner-printer';
import * as PushNotification from 'react-native-push-notification';

export class SettingsComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      printAreas: [],
      selectedOutlet: null,
      selectedOutletName: null,
      loading: false,

      //PrinterStore
      printerStore: [],

      // Modal State
      hasSunmiPrinter: false,
      printerList: [],
      showModalSelect: false,
      modalOpenId: '',
      ipPortNP: '',
      ipLP: '',
      selectedLP: null,
      printerType: 'none',
      paperSize: 80,
      pageOne: true,
    }
  }

  styles = themeService.bind(this, 'settingsHistoryPage');

  componentWillMount() {
    AsyncStorage.getItem('IP_LISTENER', (err, res) => {
      this.setState({ ipLP: res, hasSunmiPrinter: SunmiInnerPrinter.hasPrinter });
    });
    this.getPrinterStore();
    Observable.combineLatest(
      authenticationStorageService.selectedOutlet,
      authenticationStorageService.selectedOutletName
    )
      .subscribe(([outlet, outletName]) => {
        console.log(outlet);
        this.setState({ selectedOutlet: outlet, selectedOutletName: outletName, loading: true }, () => {
          productRestService.getPrinterAreas({}, outlet)
            .subscribe(res => {
              console.log(res)
              this.setState({ loading: false, printAreas: res.data })
            }, err => {
              this.setState({ loading: false })
            })
        });
      }, err => console.log(err));
  }

  sendNotif(title: string, message: string, soundName: string = 'default') {
    PushNotification.localNotification({ title, message, soundName });
  }

  renderPrintArea(p) {
    return (
      <View style={{ flex: 1, width: '100%' }} key={p.id}>
        {p.id !== 'main' && <View style={{ height: 10 }} />}
        <Text style={this.styles.get('label')}> {p.name} </Text>
        <Row>
          <Col size={100}>
            <Item regular style={this.styles.get('input')}>
              <Input disabled
                value={_.get(_.find(this.state.printerStore, {id: p.id}), 'name')} />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col size={35}>
            <Button
              block
              style={{paddingLeft: 5, height: 35 }}
              onPress={() => this.setState({ showModalSelect: true, modalOpenId: p.id })}>
              <Text>Select</Text>
            </Button>
          </Col>
          <Col size={5} />
          <Col size={60}>
            <Button block light
              style={{ paddingLeft: 5, height: 35 }}
              disabled={!_.find(this.state.printerStore, {id : p.id})|| _.find(this.state.printerStore, {id : p.id})['name'] == ''}          
              onPress={() => printerRestService.testPrint(_.find(this.state.printerStore, {id: p.id}))}>
              <Text> Test Print </Text>
            </Button>
          </Col>
        </Row>
      </View>
    )
  }

getPrinterStore() {
  printerStoreService.get().then(res => {
    this.setState({printerStore: JSON.parse(res)});
  })
}

  doSavePrinter() {
    const { printerType } = this.state;
    const ipPortNP = this.state.ipPortNP.split(':');
    const ipNP = ipPortNP[0];
    const portNP = ipPortNP[1];
    const isListener = printerType === 'listener';
    const isManual = printerType === 'manual';
    const isNone = printerType === 'none';
    
    
    const printer = {
      type: printerType,
      ip: isListener ? this.state.ipLP : isManual ? ipNP : null,
      port: isListener ? '1902' : isManual ? portNP : null,
      name: isListener ? this.state.selectedLP : (isManual ? this.state.ipPortNP : (isNone ? '' : 'Sunmi Printer')),
      id: this.state.modalOpenId,
      paperSize: this.state.paperSize,
    }
    
    printerStoreService.add(printer).then(
      () => {
        this.getPrinterStore();
        this.closeModal();
      }
    )
  }

  onShowModal() {
    printerRestService.getPrinterList().then(res => {
      res.subscribe(json => {
        const printers = json.map((p) => {
          return { label: p.name, value: p.name }
        });
        this.setState({ printerList: printers });
        // console.log(printers)
      }, err => {
        // Toast.show({
        //   text: err.message,
        //   type: 'danger'
        // })
      })
    });
  }

  closeModal() {
    this.setState({
      showModalSelect: false,
      modalOpenId: '',
      ipPortNP: '',
      selectedLP: null,
      printerType: 'listener',
      paperSize: 80,
      pageOne: true,
    })
  }

  render() {
    const { printerList, selectedOutletName, printAreas } = this.state;
    // console.log(printerStoreService.get())

    return (
      <Container>
        <Content>
          <View padder>
            <Card style={{ marginBottom: 20 }}>
              <CardItem bordered>
                <Text>Pengaturan Umum</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={this.styles.get('label')}>Outlet Saat Ini: </Text>
                  <Text style={this.styles.get('value')}>{selectedOutletName}</Text>
                  <Button full light style={{ marginBottom: 10, marginTop: 10 }} onPress={() =>
                      this.sendNotif('Test Sound', 'Akan berbunyi saat ada order baru', 'alert.wav')
                  }>
                    <Text> Test Sound </Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>

            <Card style={{ marginBottom: 20 }}>
              <CardItem bordered>
                <Text>IP Listener</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Item regular style={this.styles.get('input')}>
                    <Input
                      placeholder={'Example: 192.168.1.87'}
                      placeholderTextColor={'#cecece'}
                      value={this.state.ipLP}
                      onChangeText={(text) => {
                        this.setState({ ipLP: text });
                        AsyncStorage.setItem('IP_LISTENER', text);
                      }}
                    />
                  </Item>
                </Body>
              </CardItem>
            </Card>

            <Card style={{ marginBottom: 20 }}>
              <CardItem bordered>
                <Text>Print Area</Text>
              </CardItem>
              <CardItem>
                <Body>

                  {this.renderPrintArea({id: 'main', name: 'Main Printer'})}
                  {printAreas.length > 0 && printAreas.map(a => this.renderPrintArea(a))}

                </Body>
              </CardItem>
            </Card>
          </View>

          <Modal
            // animationType='slide'
            onShow={() => this.onShowModal()}
            transparent={true}
            visible={this.state.showModalSelect}
            onRequestClose={() => this.closeModal()}>
            <Container style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Content contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2 }}>
                  <View padder>
                    {/* Page One */}
                    {this.state.pageOne &&
                      <Body style={{ width: '100%' }}>
                      <List style={{ width: '100%' }}>
                      <ListItem> {/*none*/}
                          <Col size={10} style={{ flexDirection: 'column', alignContent: 'flex-start' }}>
                            <Radio selected={this.state.printerType === 'none'}
                              onPress={() => { this.setState({printerType: 'none', selectedLP: null}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text>None </Text>
                            </View>
                          </Col>
                        </ListItem>
                        <ListItem> {/*listener*/}
                          <Col size={10} style={{ flexDirection: 'column', alignContent: 'flex-start' }}>
                            <Radio selected={this.state.printerType === 'listener'}
                              onPress={() => { this.setState({printerType: 'listener'}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text>From Listener </Text>
                              {printerList.length > 0 ?
                                <Item regular style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                                  <Dropdown
                                    label='Choose Printer'
                                    data={printerList}
                                    dropdownOffset={{ top: 4, left: 0 }}
                                    containerStyle={{ flexGrow: 1, height: 35 }}
                                    fontSize={18}
                                    rippleOpacity={0}
                                    onChangeText={(value) => this.setState({selectedLP: value})}
                                  />
                                </Item>
                                : <Text style={{color: '#7a7371', fontStyle: 'italic'}}>No Printer or Listener is Inactive</Text>}
                            </View>
                          </Col>
                        </ListItem>
                        <ListItem> {/*ip wireless*/}
                          <Col size={10}>
                            <Radio selected={this.state.printerType === 'manual'}
                              onPress={() => { this.setState({printerType: 'manual'}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text>Network Printer </Text>
                              <Item regular style={this.styles.get('input')}>
                                <Input placeholder={'Ex: 192.168.1.87:9100'}
                                  onChangeText={(text) => this.setState({ ipPortNP: text })}
                                  placeholderTextColor={'#cecece'} />
                              </Item>
                            </View>
                          </Col>
                        </ListItem>
                        {this.state.hasSunmiPrinter &&
                          <ListItem>
                          <Col size={10}>
                            <Radio selected={this.state.printerType === 'sunmi'}
                              onPress={() => { this.setState({printerType: 'sunmi'}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text> Sunmi Printer </Text>
                            </View>
                          </Col>
                        </ListItem>
                        }
                      </List>
                      <View style={{ flexDirection: 'row' }}>
                        <Button small light style={{ margin: 10 }} onPress={() => this.closeModal()}>
                          <Text>Cancel</Text>
                        </Button>
                        <Button 
                          small success
                          disabled={(this.state.printerType==='listener' && this.state.selectedLP===null) || (this.state.printerType==='manual' && this.state.ipPortNP==='')}
                          onPress={() => {if(this.state.printerType === 'none'){
                            this.doSavePrinter()
                          }
                          else{this.setState({pageOne: false})}}}
                          style={{ margin: 10 }}>
                          <Text>Select</Text>
                        </Button>
                      </View>
                    </Body>
                    }
                    {/* PAGE TWO */}
                    {!this.state.pageOne &&
                    <Body style={{ width: '100%' }}>
                      <View style={{flex: 1, flexDirection: 'row', alignContent: 'center'}}>
                        <Text>Paper Size</Text>
                      </View>
                      <List style={{ width: '100%' }}>
                        <ListItem>
                          <Col size={10}>
                            <Radio selected={this.state.paperSize === 80}
                              onPress={() => { this.setState({paperSize: 80}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text> 80mm </Text>
                            </View>
                          </Col>
                        </ListItem>
                        <ListItem>
                          <Col size={10}>
                            <Radio selected={this.state.paperSize === 58}
                              onPress={() => { this.setState({paperSize: 58}) }}
                            />
                          </Col>
                          <Col size={90} style={{ marginLeft: 10, flexDirection: 'row', alignContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'column', width: '100%', alignContent: 'flex-start' }}>
                              <Text> 58mm </Text>
                            </View>
                          </Col>
                        </ListItem>
                      </List>
                      <View style={{ flexDirection: 'row' }}>
                        <Button small light style={{ margin: 10 }} onPress={() => this.closeModal()}>
                          <Text>Cancel</Text>
                        </Button>
                        <Button 
                          small success
                          disabled={(this.state.printerType==='listener' && this.state.selectedLP===null) || (this.state.printerType==='manual' && this.state.ipPortNP==='')}
                          onPress={() => this.doSavePrinter()}
                          style={{ margin: 10 }}>
                          <Text>Select</Text>
                        </Button>
                      </View>
                    </Body>}
                  </View>
                </View>
              </Content>
            </Container>
          </Modal>


        </Content>
      </Container>
    );
  }

}
