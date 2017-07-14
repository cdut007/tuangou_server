import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableNativeFeedback,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import CheckBox from '../common/checkbox'

import NavBar from '../common/NavBar'
import GroupBuyNowView from './GroupBuyNowView'
import CommitButton from '../common/CommitButton'
var Global = require('../common/globals');
import AddressView from './AddressView'
import HttpRequest from '../common/HttpRequest/HttpRequest'

export default class GroupBuyCar extends Component {
    constructor(props) {
        super(props)
        this.state={
            toolsView: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: 'center',
                alignItems: 'center',
                screenWidth:600,
                screenHeight:1000,
            },

            gbDetail: { classify: { name: '', icon: '' }, group_buy_goods: [] }

        }

    }

    componentDidMount() {
    if (Global.gbDetail) {
        this.setState({ gbDetail: Global.gbDetail })
    }
    }

    onGroupBuyNow(){
        var goodsIds = []
    this.state.gbDetail.group_buy_goods.map((item, i) => {
        if (item.selected && item.seletecedCount && item.seletecedCount>0) {
            goodsIds.push({goods:item.id,quantity:item.seletecedCount})
        }
    })
    if (this.state.gbDetail.id == null || !goodsIds.length) {
        alert('请选择需要团购的商品。')
        return
    }

    let param = { goods: goodsIds, agent_code: Global.agent_code }
    if (!Global.user_address) {
        this.props.navigator.push({
            component: AddressView,
        })
    }
    else {

        HttpRequest.post('/generic_order', param, this.onGroupBuySuccess.bind(this),
                (e) => {
                    alert('提交订单失败，请稍后再试。')
                    console.log(' error:' + e)
                })

        }
    }

    onGroupBuySuccess(response){

        this.props.navigator.push({
           component: GroupBuyNowView,
            props: {

               }
       })
    }

    clickBack() {
     this.props.navigator.pop()
    }

   renderTopBar(){
       if (this.props.showBack) {
           return(<NavBar title="拼团车"
           leftIcon={require('../images/back@2x.png')}
           leftPress={this.clickBack.bind(this)}/>
           )
       }else{
           return(<NavBar title="拼团车" />)
       }
   }

   onViewLayout(layoutEvent) {
   var height = layoutEvent.nativeEvent.layout.height;
   if (height<=0) {
       return
   }
   this.state.toolsView.screenWidth = layoutEvent.nativeEvent.layout.width-10
   this.state.toolsView.screenHeight = height
   this.setState({toolsView:this.state.toolsView});
   }

    render() {
        var scrollHeight = this.state.toolsView.screenHeight-150
        console.log('received view layout scrollHeight\n', scrollHeight);
        return (
            <View style={styles.container} onLayout={this.onViewLayout.bind(this)}>
                {this.renderTopBar()}
                <View style={{alignSelf:'stretch',height:scrollHeight}}>
                <ScrollView
                automaticallyAdjustContentInsets={false}
                scrollEventThrottle={200}
                style={{alignSelf:'stretch',height:scrollHeight}}>
                {this.renderProductCategoryView()}
                </ScrollView>
                </View>
                <View style={{position:'absolute',left:0,right:0,bottom:50,}}>
                <View style={{height:0.5,width:this.state.toolsView.screenWidth,backgroundColor:'#dedede'}}></View>
                {this.renderProductStartGroupBuyView()}
                </View>

            </View>
        )
    }
    renderProductStartGroupBuyView(){
        var width = this.state.toolsView.screenWidth;
        console.log('received renderProductStartGroupBuyView layout width\n', width);
        let h = 51

        let selectedPrice = 0
        var categoryDataAry = [this.state.gbDetail];
        for (var i = 0; i < categoryDataAry.length; i++) {
            categoryDataAry[i].group_buy_goods.map((item, n) => {
                if (item.selected) {
                    if (!item.seletecedCount) {
                        item.seletecedCount = 0 ;
                    }
                    selectedPrice+= item.price*item.seletecedCount;
                }
            })
        }
        selectedPrice = selectedPrice.toFixed(2)

        return(<View style={{alignItems:'center',width: width, height: h,
        justifyContent:'center',margin:0,flexDirection: "row",}}>
        <View style={{marginLeft:20,marginRight:0, alignItems:'center',
        justifyContent:'center',}}>
                 {this.renderCheckBox(this.state.gbDetail)}
             </View>

            <View style={{
            flex:1}}>
            <Text style={{alignItems:'center',justifyContent:'center',fontSize: 14, color: "#1c1c1c",}}>全选</Text>
            </View>
            <View style={{
            flex:6}}>
            <Text style={{margin:10,alignItems:'center',justifyContent:'flex-start',fontSize: 14, color: "#757575",}}>合计：{selectedPrice}元</Text>
            </View>
            <View style={[{flex:4,alignItems:'flex-end',justifyContent:'flex-end',}]}>
            <CommitButton title={'提交订单'} onPress={this.onGroupBuyNow.bind(this)}>
            </CommitButton>
            </View>
        </View>)
    }



    onItemClick(prouduct){

    }
    renderCheckBox(item) {
        if (!item) {
            return ({})
        }

        if (!item.seletecedCount) {
            item.seletecedCount = 0 ;
        }

        return(<CheckBox
                    label=''
                    checkedImage={require('../images/choose_one_click@2x.png')}
                    uncheckedImage={require('../images/choose_one@2x.png')}
                    checked={item.selected == null ? false : item.selected}
                    onChange={(checked) => {
                        item.selected = !checked

                        if (item.classify && item.group_buy_goods) {
                            item.group_buy_goods.map((subitem, i) => {
                                subitem.selected = item.selected
                            })
                        }
                        this.setState({ ...this.state })
                     }}
                />)
    }


    renderProductCategoryView() {
         var categoryDataAry =[this.state.gbDetail];
         var displayCategoryAry = [];
          for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                        <View style={{marginLeft:5,marginRight:5, alignItems:'center',
                        justifyContent:'flex-start',}}>
                                {this.renderCheckBox(categoryDataAry[i])}
                             </View>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].classify.name}
                            </Text>
                            </View>
                        {this.renderCategorysView(categoryDataAry[i].group_buy_goods)}
                        <View style = {{flex:1,justifyContent:'flex-end',alignItems: 'flex-end',marginRight:5}}>

                        </View>
                        </View>
            );
            }
            return displayCategoryAry;
    }


    onNumberAdd(item) {
        item.seletecedCount+=1;
        this.setState({ ...this.state })
    }

    onNumberMinus(item) {
        item.seletecedCount=item.seletecedCount-1;
        if (item.seletecedCount <0) {
            item.seletecedCount = 0
        }
        this.setState({ ...this.state })
    }


    renderItemInfo(item,w,h){
        if (item.tag!='total_count') {
            return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'center',paddingLeft:10,paddingRight:10,flexDirection: "row",backgroundColor:'#f7f7f7',
            flex:1}}>
            <View style={{marginLeft:5,
            flex:1,marginRight:10, alignItems:'center',
            justifyContent:'center',}}>
            {this.renderCheckBox(item)}
                 </View>

                <View style={{
                flex:2}}>
                <Image style={{resizeMode:'contain', alignItems:'center',width: 80, height: 80,
                justifyContent:'center',}} source={{ uri: item.goods.images[0].image }}/>
                </View>
                <View style={{
                height:h,
                alignItems:'flex-start',
                flex:6}}>
                <Text style={{marginLeft:30,marginTop:10,numberOfLines:2,ellipsizeMode:'tail',fontSize: 14, color: "#1c1c1c",}}>{item.goods.name}</Text>
                <Text style={{marginLeft:30,alignItems:'center',justifyContent:'center',fontSize: 12, color: "#757575",}}>{item.brief_dec}</Text>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:30,paddingBottom:10,position:'absolute',left:0,right:0,bottom:0}}>
                <Text style={{alignItems:'center',justifyContent:'center',fontSize: 16, color: "#fb7210",}}>库存 {item.stock}</Text>
                <View style={{alignItems:'flex-end',textAlign:'right',flex:6,justifyContent:'flex-end',fontSize: 12, color: "#757575",}}>

                        <View style={{ height: 30, borderWidth: 0.5, borderColor: 'b3b3b3', borderRadius: 2, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.onNumberMinus.bind(this, item)}
                            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#b3b3b3', }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#757575', alignItems: 'center', justifyContent: 'center',flex: 1, textAlign: 'center' }}>{item.seletecedCount}</Text>
                        <TouchableOpacity onPress={this.onNumberAdd.bind(this, item)}
                            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#b3b3b3' }}>+</Text>
                        </TouchableOpacity>
                        </View>

                </View>
                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {
        var width = this.state.toolsView.screenWidth;
        const w = width , h = 110

        let renderSwipeView = (types, n) => {
            return (
                <View style={this.state.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:5 }, styles.toolsItem]}>
                                     {this.renderItemInfo(item,w,h)}
                                </View>
                            )
                            return (

                                    <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>

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
        backgroundColor: '#ffffff',
    },
    topView: {
        height: 150,
    },
    list:
    {
        flex: 1,
    },
    GroupBuyContainer:
    {

        borderColor: '#e31515',
        borderWidth:1,
        textAlign:'center',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    },

    countdownText:{
            color: '#e31515',
            fontSize:14,
    },
    brandLabelContainer:
    {
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    toolsItem: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#e6e6e6',
        borderWidth:1,
    },
});
