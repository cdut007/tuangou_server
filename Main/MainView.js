import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    AsyncStorage
} from 'react-native';


// import Navigation from '../common/Navigation';
// import TabNavigator from 'react-native-tab-navigator';
// import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
//import * as WeChat from 'react-native-wechat';

var Global = require('../common/globals');

export default class MainView extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            hasGotLogin: false,
            hasLogin: null
        }
        this.getHasLogin()
    }

    componentDidMount(){
       // WeChat.registerApp('your wechat appid')
    }

    getHasLogin()
    {
        var me = this
        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                me.setState({hasLogin: true})
                Global.token = result;
            }
            else
            {
                me.setState({hasLogin: false})
            }
        });


        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                Global.wxUserInfo = JSON.parse(result)
                console.log('get k_wx_user_info:' + result)
            }
            else
            {

            }
        });



    }

    render() {
        // if(this.state.hasLogin == null)
        // {
        //     return(<View/>)
        // }

        if (this.state.hasLogin)
        {
            return (
                <Navigator
                initialRoute={{component: TabView, name: "MainPage"}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
                    }
                }
              />
            )
        }
        else {
            return (
                <Navigator
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
                    }
                }
              />
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
