import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Picker,
    AsyncStorage,
    TextInput
} from 'react-native';
import ConfirmOrderView from './ConfirmOrderView'
import NavBar from '../common/NavBar'
import HttpRequest from '../common/HttpRequest/HttpRequest'
var Global = require('../common/globals');
var width = 600;
import EventEmitter from 'events';
export default class AddressView extends Component {
    constructor(props) {
        super(props)
        var emitter = new EventEmitter;
        if (!Global.wxUserInfo) {
            Global.wxUserInfo = new Object();
            Global.user_address = new Object();
        }
        this.state = {
            name: Global.wxUserInfo.nickname,
            mobile: null,
            address: null,
            emitter:emitter,
        }

    }


    back() {
        // Global.user_address = null;
        this.props.navigator.pop()
    }

    componentDidMount() {
        if (Global.user_address) {
            this.setState({
                name: Global.wxUserInfo.nickname,
                address: Global.agent.address,
                mobile: Global.user_address.phone_num
            })
            // HttpRequest.get('/user_address', {}, this.onGetAddressSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //     })
        }
        else {
            // HttpRequest.get('/user_address', {}, this.onGetAddressSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //     })
        }
        console.log('Global.agent:'+JSON.stringify(Global.agent))

    }

    onGetAddressSuccess(response) {
        Global.user_address = response.data.user_address
        this.setState({
            name: Global.wxUserInfo.nickname,
            address: Global.agent.address,
            mobile: response.data.user_address.phone_num
        })
    }


    save() {

        let param = {}
        if (Global.agent.address ==''){
            param = {

                phone_num: this.state.mobile,
                address:Global.agent.city
            }
            console.log('param1:'+JSON.stringify(param))
            HttpRequest.post('/user_address', param, this.onSaveAddressSuccess.bind(this),
                (e) => {

                    console.log(' user_address error:' + e)
                })
        }else if (this.state.mobile == ''){
            console.log('param2:'+JSON.stringify(param))
           alert('联系电话不能为空')
        }else {
            param = {

                phone_num: this.state.mobile,
                address:this.state.address
            }
            console.log('param3:'+JSON.stringify(param))
            HttpRequest.post('/user_address', param, this.onSaveAddressSuccess.bind(this),
                (e) => {

                    console.log(' user_address error:' + e)
                })
        }




    };

    onSaveAddressSuccess(response)
    {
        console.log('onSaveAddressSuccess'+JSON.stringify(response))
        if (response.message == 'Success'){
            HttpRequest.get('/user_address', {}, this.onGetNewAddressSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)

                })
        }


         //this.state.emitter.emit('address_refresh');
        //  if (this.props.buycarView) {
        //      this.props.buycarView(true)
        //  }
        //
        // this.props.navigator.pop()


    }
    onGetNewAddressSuccess(response) {
        console.log('onGetAddressSuccess11'+JSON.stringify(response))
        if (response.message == 'The user has no address'){
            Global.user_address = ''
        }else {
            Global.user_address = response.data.user_address
            this.props.navigator.resetTo({
                component: ConfirmOrderView,

                props: {
                    isMoreBuy: this.props.isMoreBuy,
                }

            })
        }



    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="收货地址"
                    rightTitle='保存'
                    rightPress={this.save.bind(this)}
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        团长名:
                        </Text>
                    <Text style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                        editable={true}
                        onChangeText={(text) => this.setState({ name: text })}
                    >{this.state.name}</Text>

                </View>
                <View style={{height:0.5, backgroundColor:'rgb(212,212,212)',marginLeft:20,marginRight:20}}></View>
                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        联系电话:
                        </Text>
                    <TextInput style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                               keyboardType={'numeric'}
                        editable={true}
                        onChangeText={(text) => this.setState({ mobile: text })}
                        value= {this.state.mobile}
                    ></TextInput>

                </View>
                <View style={{height:0.5, backgroundColor:'rgb(212,212,212)',marginLeft:20,marginRight:20}}></View>
                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        提货点:
                        </Text>
                    <Text style={[styles.iconSize, { width: 200, marginRight: 10, color: '#1b1b1b', fontSize: 14,textAlign: 'right', }]}>
                        团长家：{Global.agent.address}
                    </Text>
                    {/*<TextInput style={{*/}
                        {/*marginLeft: 0, fontSize: 14, flex: 20,*/}
                        {/*textAlign: 'left', color: '#1c1c1c',*/}
                    {/*}}*/}
                        {/*editable={true}*/}
                        {/*onChangeText={(text) => this.setState({ address: text })}*/}
                        {/*value= {this.state.address}*/}
                    {/*></TextInput>*/}

                </View>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
        width: width - 20,
        backgroundColor: '#d40000',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 18,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    defaultText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemView:
    {
        alignSelf: 'stretch',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: width,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
