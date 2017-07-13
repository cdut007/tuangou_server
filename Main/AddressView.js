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

import NavBar from '../common/NavBar'
import HttpRequest from '../common/HttpRequest/HttpRequest'
var Global = require('../common/globals');
var width = 600;

export default class AddressView extends Component {
    constructor(props) {
        super(props)
        if (!Global.wxUserInfo) {
            Global.wxUserInfo = new Object();
            Global.user_address = new Object();
        }
        this.state = {
            name: Global.wxUserInfo.nickname,
            mobile: null,
            address: null,
        }

    }


    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        if (Global.user_address) {
            this.setState({
                name: Global.wxUserInfo.nickname,
                address: Global.user_address.address,
                mobile: Global.user_address.phone_num
            })
        }
        else {
            HttpRequest.get('/user_address', {}, this.onGetAddressSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                })
        }

    }

    onGetAddressSuccess(response) {
        Global.user_address = response.data.user_address
        this.setState({
            address: response.data.user_address.address,
            mobile: response.data.user_address.phone_num
        })
    }


    save() {

        if (!this.state.mobile) {
            alert('输入联系方式')
            return
        }
        if (!this.state.address) {
            alert('输入收货地址')
            return
        }
        let param = {
            address: this.state.address,
            phone_num: this.state.mobile
        }
        HttpRequest.post('/user_address', param, this.onSaveAddressSuccess.bind(this),
                (e) => {
                    alert('保存地址失败，请稍后再试。')
                    console.log(' error:' + e)
                })


    };

    onSaveAddressSuccess(response)
    {
        Global.user_address = {
            address: this.state.address,
            phone_num: this.state.mobile
        }

        this.props.navigator.pop()
    }


    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="收货地址"
                    rightTitle='确认'
                    rightPress={this.save.bind(this)}
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        团长名
                        </Text>
                    <Text style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                        editable={true}
                        onChangeText={(text) => this.setState({ name: text })}
                    >{this.state.name}</Text>

                </View>

                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        联系电话
                        </Text>
                    <TextInput style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                        editable={true}
                        onChangeText={(text) => this.setState({ mobile: text })}
                        value= {this.state.mobile}
                    ></TextInput>

                </View>

                <View style={{ alignSelf:'stretch',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        收货地址
                        </Text>
                    <TextInput style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                        editable={true}
                        onChangeText={(text) => this.setState({ address: text })}
                        value= {this.state.address}
                    ></TextInput>

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
