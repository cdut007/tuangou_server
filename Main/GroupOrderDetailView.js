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
import HttpRequest from '../common/HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import ProductDetail from './ProductDetail'
var Global = require('../common/globals');
import EventEmitter from 'events';
var deletedItem;
export default class GroupOrderDetailView extends Component {
    constructor(props) {
        super(props)
        var title =this.props.items.classify.name;
        var emitter = new EventEmitter;
        this.state={
            emitter:emitter,
            goods:{description:''},
            title:title,
            mainStyle:{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                screenWidth:600,
                height:1000,
                alignSelf:'stretch',
                paddingBottom:50,
            },
            productGoods:this.props.items,

        }

    }


    clickBack() {
        if (this.props.isBuyDone){
            this.props.navigator.resetTo({
                component: TabView,
                name: 'MainPage',

            })
        }else {
            this.props.navigator.pop()
        }

    }

    onViewLayout(layoutEvent) {
    var height = layoutEvent.nativeEvent.layout.height;
    if (height<=0) {
        return
    }
    this.state.mainStyle.height = height;
    this.state.mainStyle.screenWidth = layoutEvent.nativeEvent.layout.width
    this.setState({mainStyle:this.state.mainStyle});
  }
    render() {
        return (
            <View style={styles.container } onLayout={this.onViewLayout.bind(this)}>
                <NavBar title={this.state.title}
                leftIcon={require('../images/back@2x.png')}
                leftPress={this.clickBack.bind(this)}/>
                {this.renderGroupOrderListView()}

            </View>
        )
    }

    onItemClick(prouductItem){
        console.log('order_product_info:'+JSON.stringify(prouductItem))
        if(this.props.status == 0){
            this.props.navigator.push({
                component: ProductDetail,
                props: {
                    prouduct:{
                        'index': prouductItem.goods.id,
                        'image': {uri:prouductItem.goods.goods.images[0].image},
                    },
                }
            })
        }

    }

    renderGroupOrderListView(){
        return(<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={[this.state.mainStyle]}>
            {this.renderProductCategoryView()}
            </ScrollView>)
    }

    renderProductCategoryView() {
         var categoryDataAry = this.state.productGoods.order_goods;
         var displayCategoryAry = [];
           for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:0}}>

                        {this.renderCategorysView(categoryDataAry[i])}

                        </View>
            );
            }
            return displayCategoryAry;
    }

    cancelOrder(item){
        let param = {
            goods_id: item.goods.id,
            agent_code:Global.agent_code,

        }
        deletedItem = item;
        HttpRequest.delete('/generic_order', param, this.onCancelSuccess.bind(this,item),
                (e) => {

                    console.log(' error:' + e)
                })
    }

    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i].goods.id == val.goods.id) {
          arr.splice(i, 1);
          return arr;
        }
      }
      return arr
    }

    onCancelSuccess(response)
    {
         this.state.productGoods.order_goods = this.removeByValue(this.state.productGoods.order_goods,deletedItem)
           this.state.emitter.emit('group_refresh');
         this.setState({productGoods:this.state.productGoods})
         deletedItem=null;
         alert('取消成功')
    }

    rendCancelOrder(item){
            if(this.props.status == 0){
                return(<TouchableOpacity style={{alignItems:'center',justifyContent:'center',
                flex:3}}  onPress={this.cancelOrder.bind(this, item)}>
                <Text style={{alignItems:'center',textAlign:'right',flex:1,justifyContent:'center',fontSize: 12, color: "#ff7575",}}>取消订单</Text>
                </TouchableOpacity>)
            }
    }

    renderItemInfo(item,w,h){
        if (item.tag!='total_count') {
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
                <Text style={{alignItems:'center',textAlign:'right',flex:7,justifyContent:'center',fontSize: 12, color: "#757575",}}>已购 {item.quantity}</Text>
                {this.rendCancelOrder(item)}

                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {

        var width = this.state.mainStyle.screenWidth;
        const w = width , h = 110
        let render = (
            <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:0 }, styles.toolsItem]}>
                 {this.renderItemInfo(prouductItems,w,h)}
            </View>
        )

        return (
            <View style={styles.toolsView}>

            <TouchableOpacity style={{ width: w, height: h }}  onPress={() => { this.onItemClick(prouductItems) }}>{render}</TouchableOpacity>

            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1:{
        height:1,
        backgroundColor:'#dadce2'
    },
    line10:{
        height:10,
        backgroundColor:'#ebeef1'
    },
    brandLabelContainer:
    {   marginTop:5,
        marginBottom:5,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
});
