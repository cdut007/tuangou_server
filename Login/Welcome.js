
import React,{Component } from 'react';
import HttpRequest from '../common/HttpRequest/HttpRequest'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image,

} from 'react-native';

import TabView from '../Main/TabView';
//import Dimensions from '../utils/Dimensions';
import Linking from '../common/Linking';


var width = 600;//Dimensions.get('window').width;
var index;
var Global = require('../common/globals');
export default class Welcome extends Component
{
    constructor(props)
    {
        super(props)
        index = this.props.index;
        this.state={

            isHaveLoading:false
        }
    }

    componentWillMount(){
     var url = window.location.href;
      var pos = url.indexOf("?");
      if (pos!= -1) {
          var str = url.substr(pos+1);
          var code = this.getQueryString('code',str);

           console.log('url code='+code);
           if (code) {

               Global.code = code;


               var agent_code = this.getQueryString('state',str);
               if (agent_code) {
                   Global.agent_code = agent_code;

               }
               this.getUserInfoByCode(code)




           }

               //  var response = new Object();
               //  response.data = new Object();
               //  response.data.token = 'sasdadas';
               // this.onUserSuccess(response);
      }

    }
    componentDidMount() {
        if (this.state.isHaveLoading){

        }else {
            this.getUserInfoByCode(Global.code)
            // Global.user_address = ''
            // this.props.navigator.resetTo({
            //     component: TabView,
            //     name: 'MainPage'
            // })
        }

    }
    onUserSuccess(response){

        Global.token = response.data.token;

                AsyncStorage.setItem('k_http_token', Global.token).then(function(){
                    console.log('save k_http_token succ.')
                    this.fetchAgentInfo();

                }.bind(this)).catch(function(error){
                    console.log('save k_http_token faild.' + error.message)
    }.bind(this));





    }
    fetchProductList(){
        var paramBody ={agent_code:Global.agent_code }
        HttpRequest.get('/agent_home_page_list', paramBody, this.onProudctListSuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);

                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch(err)
                {
                    alert('agent_home_page_list1:'+err)
                }

                console.log(' agent_home_page_list error:' + e)
            })
    }
    onProudctListSuccess(response){
        console.log(' onProudctListSuccess:' + JSON.stringify(response))
        Global.goodsList = response.data;
        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage'
        })

    }
    onUserInfoSucc(response){
        Global.wxUserInfo = response.data.user_profile;

                AsyncStorage.setItem('k_login_info', JSON.stringify(Global.wxUserInfo)).then(function(){
                    console.log('save k_login_info succ.')

                }.bind(this)).catch(function(error){
                    console.log('save k_login_info faild.' + error.message)
                }.bind(this));
        AsyncStorage.setItem('k_login_agent_code', Global.agent_code).then(function(){
            console.log('save k_login_agent_code succ.')

        }.bind(this)).catch(function(error){
            console.log('save k_login_agent_code faild.' + error.message)
        }.bind(this));


    }
    fetchAgentInfo(){
        console.log('agent_code:'+Global.agent_code)

        var paramBody ={agent_code:Global.agent_code }
        HttpRequest.get('/agent_info', paramBody, this.onUserInfoSuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);

                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch(err)
                {
                    alert('agent_info1:'+err)
                }

                console.log(' error:' + e)
            })
    }
    onUserInfoSuccess(response){
        console.log(' onUserInfoSuccess:' + JSON.stringify(response))

        Global.agent = response.data.user_profile;

        if (response.message == 'Success'){
            this.state.isHaveLoading = true
        }
        HttpRequest.get('/user_address', {}, this.onGetAddressSuccess.bind(this),
            (e) => {

                Global.user_address = ''
                this.props.navigator.resetTo({
                    component: TabView,
                    name: 'MainPage'
                })


            })

    }
    onGetAddressSuccess(response) {

        if (response.message == 'Success'){
            Global.user_address = response.data.user_address
            this.fetchProductList();



        }else {

            Global.user_address = ''

        }



    }
    getUserInfo(){

         var paramBody ={ }

         HttpRequest.get('/user', paramBody, this.onUserInfoSucc.bind(this),
             (e) => {

                 try {

                     var errorInfo = JSON.parse(e);
                     console.log(errorInfo.description)
                     if (errorInfo != null && errorInfo.description) {
                         console.log(errorInfo.description)
                     } else {
                         console.log(e)
                     }
                 }
                 catch(err)
                 {

                     console.log(err)
                 }

                 console.log(' error:' + e)
             })
    }

    getUserInfoByCode(code){
         var paramBody ={ code:code }

         HttpRequest.get('/web_user', paramBody, this.onUserSuccess.bind(this),
             (e) => {
                 try {

                     var errorInfo = JSON.parse(e);

                     if (errorInfo != null && errorInfo.description) {
                         console.log(errorInfo.description)
                     } else {
                         console.log(e)
                     }
                 }
                 catch(err)
                 {
                     alert('web_user1:'+err)
                 }

                 console.log(' error:' + e)
             })
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

    onLoginPress()
    {

        if (!Global.agent_code) {

                alert('请通过团长分享链接访问！')

                return


        }else {
            // if (!Global.token){
            //  alert(Global.token)
            // }


        }
        // WeChat.sendAuthRequest('snsapi_userinfo','1111111').then(res=>{
        //     console.log('log result='+res);
        // })

         console.log('log pathnames='+window.location.href);

        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3dfb837875e773af&redirect_uri=http%3A%2F%2Fwww.ailinkgo.com&response_type=code&scope=snsapi_userinfo&state='+Global.agent_code+'#wechat_redirect';
        Linking.canOpenURL(url).then(supported => {
             return Linking.openURL(url);
           });
    }

    onRegiserPress()
    {

    }

    render()
    {
      //   if (this.state.isHaveLoading){
      //       return (
      //               <View style = {styles.rootcontainer}>
      //                   <Image style={{resizeMode:'contain', alignItems:'center',
      //       marginTop: 120,
      //       justifyContent:'center'}}
      //                          source={require('../images/logo_icon@2x.png')}/>
      //                   <Text style={{alignItems:'center',marginTop: 5,
      //       color: '#dc6917',
      //       fontSize:16,
      //       justifyContent:'center',
      //       letterSpacing:5,
      //       flex:1}} >
      //                       用 心 为 您 精 挑 细 选
      //                   </Text>
      //                   <ProgressBarAndroid color='black' styleattr="LargeInverse" indeterminate={true}>
      //
      //                   </ProgressBarAndroid>
      //                   <TouchableOpacity onPress={this.onLoginPress.bind(this)}
      //                                     style={styles.loginButton}>
      //                       <View style = {styles.logincontainer}>
      //                           <Image style={{resizeMode:'contain', alignItems:'center',
      // justifyContent:'center',width:80,height:80,
      // flex:1}} source={require('../images/login_wechat@3x.png')}/>
      //                           <Text style={[styles.loginText,{marginTop:5}]} >
      //                               微信登录
      //                           </Text>
      //                       </View>
      //                   </TouchableOpacity>
      //
      //
      //               </View>
      //           )
      //
      //   }else {
      //       return (
      //           <View style = {styles.rootcontainer}>
      //               <Image style={{resizeMode:'contain', alignItems:'center',
      //       marginTop: 120,
      //       justifyContent:'center'}}
      //                      source={require('../images/logo_icon@2x.png')}/>
      //               <Text style={{alignItems:'center',marginTop: 5,
      //       color: '#dc6917',
      //       fontSize:16,
      //       justifyContent:'center',
      //       letterSpacing:5,
      //       flex:1}} >
      //                   用 心 为 您 精 挑 细 选
      //               </Text>
      //
      //               <TouchableOpacity onPress={this.onLoginPress.bind(this)}
      //                                 style={styles.loginButton}>
      //                   <View style = {styles.logincontainer}>
      //                       <Image style={{resizeMode:'contain', alignItems:'center',
      // justifyContent:'center',width:80,height:80,
      // flex:1}} source={require('../images/login_wechat@3x.png')}/>
      //                       <Text style={[styles.loginText,{marginTop:5}]} >
      //                           微信登录
      //                       </Text>
      //                   </View>
      //               </TouchableOpacity>
      //
      //
      //           </View>
      //       )
      //   }
        if (this.state.isHaveLoading){
            this.props.navigator.resetTo({
                component: TabView,
                name: 'MainPage'
            })
        }else {
            this.getUserInfoByCode(Global.code)
            // Global.user_address = ''
            // this.props.navigator.resetTo({
            //     component: TabView,
            //     name: 'MainPage'
            // })
        }
        return(
        <View style = {styles.rootcontainer}>

            <Image style={{resizeMode:'contain', alignItems:'center',
            marginTop: 120,
            justifyContent:'center'}}
                   source={require('../images/logo_icon@2x.png')}/>
            <Text style={{alignItems:'center',marginTop: 5,
            color: '#dc6917',
            fontSize:16,
            justifyContent:'center',
            letterSpacing:5,
            flex:1}} >
                用 心 为 您 精 挑 细 选
            </Text>



            <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                              style={styles.loginButton}>
                <View style = {styles.logincontainer}>
                    <Image style={{resizeMode:'contain', alignItems:'center',
      justifyContent:'center',width:80,height:80,
      flex:1}} source={require('../images/login_wechat@3x.png')}/>
                    <Text style={[styles.loginText,{marginTop:5}]} >
                        微信登录
                    </Text>
                </View>
            </TouchableOpacity>


        </View>
    )

    }
}

const styles = StyleSheet.create(
    {

        buttonText:{
                    color: '#ffffff',
                    fontSize:45,
                    fontWeight:'bold',
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems: 'center',
            },
        logo: {
        marginTop: 20,
        alignSelf:'center',
        height: 100,
        width: 100,
        resizeMode: Image.resizeMode.contain,
    },
        logincontainer:
        {
            flexDirection:'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },

        rootcontainer:
        {
            flex: 1,
            flexDirection:'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#ffffff',
        },

        loginText:
        {
            color: '#8dc81b',
            fontSize:14,
        },
        labelText:
        {
            marginTop: 70,
            color: '#ffffff',
            fontSize:45,
            backgroundColor: '#00000000'
        },

        loginButton:
        {
            margin: 30,
            height:100,
            width: width/2 - 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems:'center',
        },
});
