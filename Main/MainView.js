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
 import TabView from './TabView'
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
       var url = window.location.href;
        var pos = url.indexOf("?");
        if (pos!= -1) {
            var str = url.substr(pos+1);
            var agent_code = this.getQueryString('agent_code',str);
             console.log('url agent_code='+agent_code);
             agent_code = 'ocsmexGwV4BzMOQMFN_IzHwgkj3I';//for test.
             if (agent_code) {
                 Global.agent_code = agent_code;
             }
        }
    }

    getQueryString(name,url) {
    if (!url) {
            return null
        }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
    var result = url.match(reg);  // 对querystring匹配目标参数
     console.log('url result='+url);
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
    }

    getHasLogin()
    {
        var me = this

        AsyncStorage.getItem('k_login_info').then(function(result){
              if (result !== null){
                  Global.wxUserInfo = JSON.parse(result)
                  console.log('get k_wx_user_info:' + result)
              } else {
                   console.log('get k_login_info null:')
                me.setState({hasLogin: false})
              }
            }.bind(this)).catch(function(error){
                 console.log('get k_wx_user_info:error' +  error.message)
                //this._appendMessage('AsyncStorage error: ' + error.message);
            }.bind(this));

        AsyncStorage.getItem('k_http_token').then(function(result){
              if (result !== null){
                  me.setState({hasLogin: true})
                   console.log('get k_http_token succ:')
                  Global.token = result;
              } else {
                  console.log('get k_http_token null:')
                me.setState({hasLogin: false})
              }
            }.bind(this)).catch(function(error){
                console.log('get k_http_token:error:' +  error.message)
                //this._appendMessage('AsyncStorage error: ' + error.message);
            }.bind(this));








    }

    render() {

         if(this.state.hasLogin == null)
        {
            return(<View/>)
        }

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
            // return (
            //     <Navigator
            //     initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index}}
            //     configureScene={() => Navigator.SceneConfigs.FloatFromRight}
            //     renderScene={(route, navigator) => {
            //           return <route.component navigator={navigator} {...route.props}/>
            //         }
            //     }
            //   />
            // )
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
