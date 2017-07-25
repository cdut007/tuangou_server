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
    TouchableHighlight,
    SegmentedControlIOS,
} from 'react-native';

import SettingView from './SettingView';
import NavBar from '../common/NavBar'
import GroupOrderDetailView from './GroupOrderDetailView';
import HttpRequest from '../common/HttpRequest/HttpRequest'
var Global = require('../common/globals');
import EventEmitter from 'EventEmitter';
export default class GroupOrderListView extends Component {
    static propTypes:{
        emitter: PropTypes.object,
    }
    constructor(props) {
        super(props)
        var title = "拼团中";
        if (this.props.isDoneStatus) {
            title = "拼团已完成";
        }
        this.state={
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
            },
             values: ['拼团中', '已完成',],
             selectedIndex:0,
             orders:[],

        }
    }


    componentDidMount() {
    let orderStatus = this.props.isDoneStatus ? 1 : 0
    this.refreshOderInfo(orderStatus);
    if (this.props.emitter) {
         console.log('inti group_refresh emitter~~~')
        this.props.emitter.on('group_refresh', () => {
         console.log('group_refresh~~~')
         this.refreshOderInfo(this.state.selectedIndex);
        });
    }
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

    onViewLayout(layoutEvent) {
    var height = layoutEvent.nativeEvent.layout.height;
    if (height<=0) {
        return
    }
    this.state.mainStyle.height = height - 70;
    this.state.mainStyle.screenWidth = layoutEvent.nativeEvent.layout.width
    this.setState({mainStyle:this.state.mainStyle});
  }

    onSettingPress(){
          this.props.navigator.push({
                      component: SettingView,
                  })
      }

      _onChange(event) {
        this.setState({
          selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });

        console.log("value=="+event.nativeEvent.selectedSegmentIndex);
        if (event.nativeEvent.selectedSegmentIndex=='1') {
            this.refreshOderInfo(1);
        }else{
            this.refreshOderInfo(0);
        }
      }

      _onValueChange(value) {
          console.log("value=="+value);

        this.setState({
          value: value,
        });


      }

    render() {

        return (
            <View style={styles.container} onLayout={this.onViewLayout.bind(this)}>
                <NavBar title='我的拼团'
                rightIcon={require('../images/setting_icon@2x.png')}
                rightPress={this.onSettingPress.bind(this)}/>
                <SegmentedControlIOS
                    values={this.state.values}
                    tintColor='#ea6b10'
                    selectedIndex={this.state.selectedIndex}
                    onChange={this._onChange.bind(this)}
                    style={{alignSelf:'stretch',margin:20}}
                    onValueChange={this._onValueChange.bind(this)} />
                   {this.renderOderStatusList(this.state.selectedIndex)}

            </View>
        )
    }


    renderOderStatusList(label){
        return (
            <View style={{alignSelf:'stretch',flex:1}}>
            {this.renderGroupOrderListView()}
            </View>
        )
    }

    onItemsClick(prouductItems){

        this.props.navigator.push({
                props: {

                    items:prouductItems,
                },

                    component: GroupOrderDetailView,
                })
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
         var categoryDataAry = this.state.orders;
         var displayCategoryAry = [];

                for (var i = 0; i<categoryDataAry.length; i++) {
                var items = categoryDataAry[i];
                displayCategoryAry.push(
                        <View style={{margin:0}}>
                        <View style = {[styles.brandLabelContainer,{marginBottom:10}]}>
                        <View style={{marginLeft:10,marginTop:10,marginRight:5, alignItems:'center',
                        justifyContent:'flex-start',}}>
                        <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:30,height:30,
              justifyContent:'center'}} source={{ uri: items.classify.icon }}/>
                             </View>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {items.classify.name}
                            </Text>
                            <Text style={{flex:1, marginRight:5,fontSize:16,color:'#757575',textAlign:'right'}}>
                                    预计发货 {categoryDataAry[i].ship_time}
                                </Text>
                            </View>

                        {this.renderCategorysView(items)}
                        <View style={{backgroundColor:'#d5d5d5',alignSelf:'stretch',height:0.5}}>
                        </View>
                        {this.renderStatus(items)}

                        </View>
            );
            }
            return displayCategoryAry;
    }

    renderStatus(items){
        return(<TouchableOpacity onPress={this.onItemsClick.bind(this,items)} style={{alignItems:'center',backgroundColor:'#f7f7f7',
        justifyContent:'center',height:40,alignSelf:'stretch'}}>
        <Text style={{alignItems:'center',
        justifyContent:'center',fontSize:12,color:'#1c1c1c',textAlign:'center'}}>
           查看全部
        </Text>
        </TouchableOpacity>)
    }

    renderItemInfo(item,w,h,total){


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
                <Text style={{alignItems:'center',textAlign:'right',flex:9,justifyContent:'center',fontSize: 12, color: "#757575",}}>已购 {total}</Text>
                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {
        var width = this.state.mainStyle.screenWidth;
        const w = width , h = 110
        let items = prouductItems.order_goods
        var total = 0 ;
        for (var i = 0; i < items.length; i++) {
            total += items[i].quantity;
        }

        var item = items[0];

        let render = (
            <View style={[{ width: w, height: h ,marginTop:0,marginRight:5,marginBottom:0 }, styles.toolsItem]}>
                 {this.renderItemInfo(item,w,h,total)}
            </View>
        )

        return (
            <View style={styles.toolsView}>

            <TouchableHighlight style={{ width: w, height: h }} key={i} onPress={this.onItemsClick.bind(this,prouductItems)}>{render}</TouchableHighlight>


            </View>
        )

        // let renderSwipeView = (types, n) => {
        //     return (
        //         <View style={styles.toolsView}>
        //             {
        //                 types.map((item, i) => {
        //                     let render = (
        //                         <View style={[{ width: w, height: h ,marginTop:0,marginRight:5,marginBottom:0 }, styles.toolsItem]}>
        //                              {this.renderItemInfo(item,w,h,total)}
        //                         </View>
        //                     )
        //                     return (
        //                             <TouchableHighlight style={{ width: w, height: h }} key={i} onPress={this.onItemsClick.bind(this,items)}>{render}</TouchableHighlight>
        //
        //                     )
        //                 })
        //             }
        //         </View>
        //     )
        // }
        // return (
        //     renderSwipeView(items)
        // )
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
    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
    },
});
