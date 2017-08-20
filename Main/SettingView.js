import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    Picker,
    AsyncStorage,
    TextInput
} from 'react-native';

import NavBar from '../common/NavBar'
import Welcome from '../Login/Welcome'
var Global = require('../common/globals');

export default class SettingView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }
    _logout_function(){

        //logout here

        Global.token = null
        Global.wxUserInfo = null;
        Global.agent_code = null;
        AsyncStorage.removeItem('k_http_token').then((value) => {
                AsyncStorage.removeItem('k_login_info').then((value) => {

                        this.props.navigator.resetTo({
                            component: Welcome,
                            name: 'Welcome'
                        })
                    }
                ).done();
        }
        ).done();


        //logout success go 2 call page
        // var routes = this.props.navigator.state.routeStack;
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === "MyDestinationRoute"){
        //     var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //     this.props.navigator.popToRoute(destinationRoute);
        //
        //     }
        // }

    };



    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="设置"
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />
                    <TouchableOpacity
                        style={[styles.btnLogout, { marginTop: 10 }]}
                        onPress={this._logout_function.bind(this)}
                        ><Text style={styles.logoutText}>退出登录</Text>
                    </TouchableOpacity>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
},
logoutText: {
    color: '#ea6b10',
    fontSize: 16,
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
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
