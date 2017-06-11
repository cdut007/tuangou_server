import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    AsyncStorage
} from 'react-native';
// import Dimensions from 'Dimensions';
// import NavBar from '../common/NavBar';
// import HttpRequest from '../HttpRequest/HttpRequest'
// import CircleImage from '../common/CircleImage';
// import SettingView from './SettingView';
// import GroupOrderListView from './GroupOrderListView';
// import AddressView from './AddressView';
// import GroupMasterLinkView from './GroupMasterLinkView';
// import HelpView from './HelpView';
// const isIOS = Platform.OS == "ios"
var width = 600;//Dimensions.get('window').width;
var account = Object();
//var Global = require('../common/globals');


export default class MineView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: account,
        };
    }

    componentWillMount(){
        var me = this
       
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                <Image style={[styles.headView,{position: 'absolute', left: 0, right: 0,}]}
                       source={require('../images/me_bj.jpg')}
                 />
               
                  <View style={styles.centerLayout}>
                      <Text style={styles.defaultText}>{this.state.account.nickname}Lisa团长高优良品购</Text>
                  </View>
                </View>

                <TouchableOpacity style={[styles.itemLayout, {alignItems: "flex-start",}]}>
                    <Text style={{marginLeft:10,fontSize:16,color:'#1c1c1c',textAlign:'left'}}>我的拼团</Text>
                </TouchableOpacity>

                <View style={styles.itemLine}/>


                <View style={styles.flexContainer}>
                <TouchableOpacity style={styles.cell} >
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/link_icon@2x.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    团长链接
                  </Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cell} >
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/buying_icon@2x.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    拼团中
                  </Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cell} >
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/success_icon@2x.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    已完成
                  </Text>
                </View>
                </TouchableOpacity>
              </View>


              <TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout,{marginTop:10}]}  >

                  <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                    <Image style={[styles.iconSize,{marginRight:15}]}
                      source={require('../images/address_icon@2x.png')} />
                    <Text  style={{fontSize: 16,flex:20,
                     textAlign: 'left',
                     color: '#1c1c1c',}}>收货地址</Text>
                    <Image style={[styles.iconSize]}
                      source={require("../images/next_icon@2x.png")} />
                  </View>
              </TouchableOpacity>
              <View style={styles.itemLine}/>
              <TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]}  >
              <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                <Image style={[styles.iconSize,{marginRight:15}]}
                  source={require('../images/help_icon@2x.png')} />
                <Text  style={{fontSize: 16,flex:20,
                 textAlign: 'left',
                 color: '#1c1c1c',}}>帮助中心</Text>
                <Image style={[styles.iconSize]}
                  source={require("../images/next_icon@2x.png")} />
              </View>
              </TouchableOpacity>
               <View style={styles.itemLine}/>
              <TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]}  >
              <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                <Image style={[styles.iconSize,{marginRight:15}]}
                  source={require('../images/setting_icon@2x.png')} />
                <Text  style={{fontSize: 16,flex:20,
                 textAlign: 'left',
                 color: '#1c1c1c',}}>设置</Text>
                <Image style={[styles.iconSize]}
                  source={require("../images/next_icon@2x.png")} />
              </View>
              </TouchableOpacity>

            </View>
        )
    }



    _displayIcon() {
            if (this.state.account.icon_url != null) {
                return { uri: this.state.account.icon_url };
            } else {
                return require('../images/default_head@2x.png');
            }

        }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },
    topView: {
        height: 120,
        width: width,
    },
    headView: {
        height: 180,
        width: width,
        backgroundColor: '#ffffff',
    },
    toolsView:
    {
        height: width / 1.5 + 30,
        //   backgroundColor: 'red',
    },
    list:
    {
        flex: 1,
        // height: width / 1.5,
    },

    typesView: {
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    typesItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'gray',
        borderWidth: 1,
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 30,
        alignSelf: 'center',
    },
    defaultText:{
            marginTop:10,
            color: '#ffffff',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },
    flexContainer: {
           height: 80,
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
       },
       cell: {
           backgroundColor: '#ffffff',
           flex: 1,
           height: 80,
           justifyContent: "center",
           alignItems: 'center',
       },
       cellLine: {
           width: 1,
           height: 80,
           backgroundColor: '#cccccc',
       },
       itemLine:{
           marginLeft:10,
           width: width,
           height: 0.5,
           backgroundColor: '#d5d5d5',
       },
       label: {
           fontSize: 14,
           textAlign: 'center',
           color: '#4f4f4f',
       },
       labelInfo: {
           fontSize: 18,
           textAlign: 'center',
           color: '#fbab3b',
       },
});
