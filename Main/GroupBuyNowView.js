import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    ScrollView,
} from 'react-native';
import TabView from './TabView'
import NavBar from '../common/NavBar'
var Global = require('../common/globals');
import GroupOrderDetailView from './GroupOrderDetailView';
import HttpRequest from '../common/HttpRequest/HttpRequest'

export default class GroupBuyNowView extends Component {
    constructor(props) {
        super(props)
        this.state={
            orders:[],
            group_buy_id:null,
        }

    }


    back() {
        this.props.navigator.pop()

}
    componentDidMount() {
        this.state.group_buy_id = this.props.group_buy_id
        this.refreshOderInfo(0);

    }
        onCopyPress(){

        }

        onSharePress(){

        }
        onPressToMainPage(){
        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage',

        })
    }
         onPressToOrderDetail(){


             var  prouductItems ={}
             for (var i = 0; i < this.state.orders.length; i++){
                 var items = this.state.orders[i];
                 if (this.state.group_buy_id == items.id){
                     prouductItems = items

                 }
             }
             console.log('prouductItems221'+JSON.stringify(prouductItems))
             this.props.navigator.push({
                 component: GroupOrderDetailView,
                 props: {
                     status:0,
                     items:prouductItems,
                     isBuyDone:true,
                 },


             })
    }
    refreshOderInfo(orderStatus){
        let param = { status: orderStatus,agent_code: Global.agent_code}

        HttpRequest.get('/generic_order', param, this.onGetListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)

            })
    }
    onGetListSuccess(response) {
        this.setState({
            orders: response.data.group_buy
        })
    }

    render() {
        return (
            <View style={styles.container}>

                <NavBar
                    title="下单成功"
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />

                <Image style={{width:375,height:150}} source={require('../images/banner1@2x.png')}></Image>
                <TouchableOpacity  onPress={this.onPressToMainPage.bind(this)} style={{alignItems:'center',alignSelf:'flex-start',marginLeft:30}} >
                    <Image style={{width:150,height:40,marginTop:30,alignItems:'center',justifyContent:'flex-start',flexDirection:'row'}} source={require('../images/btn1@2x.png')}>
                        <Image style={{width:10,height:18,marginLeft:15,marginRight:15}} source={require('../images/toHomeIcon@2x.png')} ></Image>
                        <Text style={{fontSize:18,color:'#ffffff',alignSelf:'center',textAlign:'center'}}>返回首页</Text>


                    </Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onPressToOrderDetail.bind(this)} style={{alignItems:'center',alignSelf:'flex-end',marginRight:30}} >
                    <Image style={{width:150,height:40,marginTop:30,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}} source={require('../images/btn1@2x.png')}>

                        <Text style={{fontSize:18,color:'#ffffff',alignSelf:'center',textAlign:'center'}}>查看订单</Text>
                        <Image style={{width:10,height:18,marginRight:15,marginLeft:15}} source={require('../images/toOrderIcon@2x.png')} ></Image>
                    </Image>
                </TouchableOpacity>
                    <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:14,color:'#1c1c1c',padding:10,marginTop:40}}>点击右上方分享链接</Text>
                    <View style={{flex:1,marginTop:60,justifyContent:'center',flexDirection:'row'}}>

                        {/* <TouchableOpacity style={{
                         height: 36,
                         width: 120,
                         backgroundColor: '#6d9ee1',
                         borderRadius: 50,
                         borderColor:'#5590df',
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center',
                         }}
                         onPress={this.onCopyPress.bind(this)}
                         >
                         <Text style={{color:'#ffffff',fontSize:16}}>
                         复制链接
                         </Text>
                         </TouchableOpacity> */}

                        {/* <TouchableOpacity onPress={this.onSharePress.bind(this)}
                         style={{
                         height: 36,
                         width: 120,
                         marginLeft:60,
                         backgroundColor: '#8dc81b',
                         borderRadius: 50,
                         borderColor:'#7db909',
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center',
                         }}>
                         <Text style={{color:'#ffffff',fontSize:16}}
                         >
                         分享链接
                         </Text>
                         </TouchableOpacity> */}
                    </View>


            </View>
        )
    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
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
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
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
