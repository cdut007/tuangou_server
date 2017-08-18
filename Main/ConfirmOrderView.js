/**
 * Created by Arlen_JY on 2017/8/15.
 */
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
    Alert
} from 'react-native'
import NavBar from '../common/NavBar'
import GroupBuyNowView from './GroupBuyNowView'
import HttpRequest from '../common/HttpRequest/HttpRequest'
var Global = require('../common/globals');
Date.prototype.format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
export default class ConfirmOrderView extends Component{

    constructor(props){
        super(props)
        var title = '确认订单'

        this.state = {

            scrollContainerStyle:{
                height:1000,alignSelf:'stretch',
            },
            title:title,
            orders:[],
            isMoreBuy: true,
            btn_bottom:50,
            mainStyle:{
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: "wrap",
                screenWidth:600,
                height:1000,




            },
        }
        console.log('ConfirmOrderView goods1DataAry1:'+JSON.stringify(Global.categoryDataAry))
        if (this.props.isMoreBuy)
        {
            this.state.orders = Global.categoryDataAry
            console.log('ConfirmOrderView goods1DataAry:'+JSON.stringify(this.state.orders))
        }else {
            this.state.orders = Global.categoryData
            console.log('ConfirmOrderView goods1Data2:'+JSON.stringify(this.state.orders))
        }
        console.log('ConfirmOrderView goods1Data:'+JSON.stringify(this.state.orders))
        for (var i = 0; i <  this.state.orders.length; i++){

                this.state.orders[i].group_buy_goods_car.map((item, i) => {

                item.selected = true;

            })
        }


    }
    componentDidMount() {
        if (this.props.isMoreBuy)
        {
            this.state.orders = Global.categoryDataAry
        }else {
            this.state.orders = Global.categoryData
        }

        console.log('ConfirmOrderView goods2:'+JSON.stringify(this.state.orders))


        // let orderStatus = this.props.isDoneStatus ? 1 : 0
        // let param = { status: orderStatus }
        // console.log('orderStatus:' +orderStatus)
        // HttpRequest.get('/agent_order', param, this.onGetListSuccess.bind(this),
        //     (e) => {
        //         console.log(' error:' + e)
        //         Alert.alert('提示','获取团购列表失败，请稍后再试。')
        //     })
    }

    buyNow(delay ){
        var categoryDataAry = this.state.orders
        var goodsIds = []

        for (var  i = 0;i < categoryDataAry.length; i++){
            var categoryData = categoryDataAry[i]
            console.log('categoryData:'+JSON.stringify(categoryData))
            categoryDataAry[i].group_buy_goods_car.map((item, i) => {
                if ( item.quantity ) {
                    goodsIds.push({goods:item.goods.id,quantity:item.quantity})
                }
            })
        }

        console.log('goodsIds:'+JSON.stringify(goodsIds))
        if ( !goodsIds.length) {
            alert('请选择需要团购的商品。')
            return
        }

        let param = { goods: goodsIds, agent_code: Global.agent_code }

        console.log('generic_order:'+JSON.stringify(param))
        if (!delay) {
            HttpRequest.post('/generic_order', param, this.onGroupBuySuccess.bind(this),
                (e) => {

                    console.log('generic_order error:' + e)
                })
        }else{

            setTimeout(function() {
                HttpRequest.post('/generic_order', param, this.onGroupBuySuccess.bind(this),
                    (e) => {
                        alert('提交订单失败，请稍后再试。')
                        console.log(' generic_order error:' + e)
                    })
            }.bind(this), 500);
        }
    }
    onGroupBuySuccess(response){
        Global.gbDetail=null;
        this.setState({gbDetail: { classify: { name: '', icon: '' }, group_buy_goods_car: [] }})
        this.props.navigator.push({
            component: GroupBuyNowView,
            props: {

            }
        })
    }
    onSaveOrderSuccess(response)
    {
        Global.user_address = {
            address: this.state.address,
            phone_num: this.state.mobile
        }

        //this.state.emitter.emit('address_refresh');

    }
    onGetListSuccess(response) {
        console.log('groupOrderList +' +JSON.stringify(response))
        this.setState({
            orders: response.data.order
        })
    }
    clickBack() {
        this.props.navigator.pop()
    }
    onViewLayout(layoutEvent) {
        var height = layoutEvent.nativeEvent.layout.height;
        if (height<=0) {
            return
        }
        this.state.mainStyle.height = height ;
        this.state.mainStyle.screenWidth = layoutEvent.nativeEvent.layout.width
        this.setState({mainStyle:this.state.mainStyle});
        console.log('mainStyle:'+this.state.mainStyle.screenWidth+':'+this.state.mainStyle.height)
    }
    renderGroupAdressView(){
        return (<View style={[styles.groupAdressView,{ width:this.state.mainStyle.screenWidth,}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between',width:this.state.mainStyle.screenWidth,height:40}}>
                    <Text style={{fontFamily:'PingFangSC-Light',fontSize:14,textAlign:'center',color:'black',margin:10}}> 用户微信名</Text>
                    <Text style={{fontFamily:'PingFangSC-Light',fontSize:14,textAlign:'left',color:'black',margin:10}}>6588837925 </Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',height:55}}>
                    <Text style={{fontFamily:'PingFangSC-Light',fontSize:14,textAlign:'left',color:'black',margin:10,}}>团长家:</Text>
                </View>


            </View>
        )
    }
    render() {

        return (

                <View style={styles.container} onLayout={this.onViewLayout.bind(this)}>
                    <NavBar title={this.state.title}
                            leftIcon={require('../images/back@2x.png')}
                            leftPress={this.clickBack.bind(this)}/>

                    {this.renderGroupOrderListView()}
                </View>


        )
    }
    onItemsClick(prouductItems) {
        this.props.navigator.push({
            props: {
                gbDetail: prouductItems,
            },
            component: GroupOrderDetailView,
        })
    }
    renderGroupOrderListView() {
        var scrollHeight = this.state.mainStyle.height-100
        return (
            <View style={styles.container}>
                <View style={{alignSelf:'stretch'}}>
                <ScrollView

                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={200}
                    style={{height:scrollHeight,width:this.state.mainStyle.screenWidth,backgroundColor:'#ffffff'}}
                >

                    {this.renderGroupAdressView()}

                    {this.renderProductCategoryView()}

                </ScrollView>
                </View>
                <View style={{position:'absolute',left:0,right:0,bottom:0}}>
                    <View style={{height:0.5,width:this.state.mainStyle.screenWidth,backgroundColor:'#dedede'}}></View>
                    {this.renderProductStartGroupBuyView()}
                </View>
            </View>


        )

    }
    renderProductStartGroupBuyView(){
        var width = this.state.mainStyle.screenWidth;
        console.log('received renderProductStartGroupBuyView layout width\n', width);
        let h = 51

        let selectedPrice = 0
        var categoryDataAry = this.state.orders;
        for (var i = 0; i < categoryDataAry.length; i++) {
            categoryDataAry[i].group_buy_goods_car.map((item, n) => {
                if (item.selected) {
                    if (!item.quantity) {
                        item.quantity = 0 ;
                    }
                    selectedPrice+= item.goods.price*item.quantity;
                    console.log('item.goods.price :'+item.goods.price+'item.quantity:'+item.quantity);
                }
            })
        }
        selectedPrice = selectedPrice.toFixed(2)
        console.log('selectedPrice :', selectedPrice);
        return(<View style={{alignItems:'center',width: width, height: h,
        justifyContent:'center',margin:0,flexDirection: "row",}}>

            <View style={{
            flex:6}}>
                <Text style={{marginLeft:20,margin:10,alignItems:'center',justifyContent:'flex-start',fontSize: 14, color: "#757575",textAlign:'center'}}>合计：{selectedPrice}元</Text>
            </View>
            <TouchableOpacity underlayColor="rgb(234,107,16,0.8)" style={{justifyContent:'flex-end',width:this.state.mainStyle.screenWidth/2}} onPress={this.buyNow.bind(this)}  >

                <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'rgb(234,107,16)',height:49}}>

                    <Text  style={{fontSize: 16,
                     textAlign: 'Center',fontFamily:'PingFangSC-Regular',
                     color: '#ffffff',}}>提交订单</Text>

                </View>
            </TouchableOpacity>
        </View>)
    }
    renderProductCategoryView() {
        var categoryDataAry = this.state.orders
        var displayCategoryAry = [];
        console.log('this.state.orders:'+JSON.stringify(this.state.orders))
        for (var i = 0; i < categoryDataAry.length; i++) {
            var order = categoryDataAry[i]

            var oldTime = (new Date(order.ship_time.replace(' ','T'))).getTime();
            var curTime = new Date(oldTime).format("M月d号");


            displayCategoryAry.push(
                <View style={{margin:0}}>
                    <View style = {[styles.brandLabelContainer,{marginBottom:10}]}>
                        <View style={{marginLeft:10,marginTop:10,marginRight:5, alignItems:'center',
                        justifyContent:'flex-start',}}>
                            <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:30,height:30,
              justifyContent:'center'}} source={{ uri: 'http://www.ailinkgo.com:3000/images/2017/06/fruit_type.png' }}/>
                        </View>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                            {order.classify.name}
                        </Text>
                        <Text style={{flex:1, marginRight:5,fontSize:12,color:'#757575',textAlign:'right'}}>
                            预计{curTime}发货
                        </Text>
                    </View>

                    {this.renderCategorysView(order.group_buy_goods_car)}
                    <View style={{backgroundColor:'#d5d5d5',alignSelf:'stretch',height:0.5}}>
                    </View>


                </View>
            );
        }
        return displayCategoryAry;
    }
    renderItemInfo(item,w,h,total){


        return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'center',paddingLeft:20,paddingRight:10,flexDirection: "row",backgroundColor:'#f7f7f7',
            flex:1}}>


            <View style={{
                flex:2}}>
                <Image style={{resizeMode:'contain', alignItems:'center',width: 80, height: 80,
                justifyContent:'center',}} source={{ uri: item.goods.goods.images[0].image }}/>
            </View>
            <View style={{
                height:h,
                alignItems:'flex-start',
                flex:6}}>
                <Text style={{marginLeft:30,marginTop:10,numberOfLines:2,ellipsizeMode:'tail',fontSize: 14, color: "#1c1c1c",}}>{item.goods.goods.name}</Text>
                <Text style={{marginLeft:30,alignItems:'center',justifyContent:'center',fontSize: 12, color: "#757575",}}>{item.goods.brief_dec}</Text>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:30,paddingBottom:10,position:'absolute',left:0,right:0,bottom:0}}>
                    <Text style={{alignItems:'center',justifyContent:'center',fontSize: 16, color: "#fb7210",}}>S$ {item.goods.price}</Text>
                    <Text style={{alignItems:'center',textAlign:'right',flex:9,justifyContent:'center',fontSize: 12, color: "#757575",}}>已购{item.quantity}件</Text>
                </View>
            </View>

        </View>)


    }

    renderCategorysView(prouductItems) {
        const w = this.state.mainStyle.screenWidth, h = 110

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h-10, marginTop: 5, marginRight: 5,  }, styles.toolsItem]}>
                                    {this.renderItemInfo(item, w, h)}
                                </View>

                            )
                            return (
                                <TouchableOpacity style={{ width: w - 10, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(prouductItems)
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    groupAdressView:{
        flexDirection: 'column',
        justifyContent: 'center',
        height:85,
        backgroundColor:'#ffffff'
    },

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1: {
        height: 1,
        backgroundColor: '#dadce2'
    },
    line10: {
        height: 10,
        backgroundColor: '#ebeef1'
    },
    brandLabelContainer:
        {
            marginTop: 5,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    line: {
        height: 1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },

    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolsItem: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#e6e6e6',
        borderWidth:1,
    },
});
