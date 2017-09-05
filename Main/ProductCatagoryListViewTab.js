import React, { Component } from 'react';
import { View, StyleSheet,ScrollView,ListView,AsyncStorage,TouchableOpacity,Image,Text,SegmentedControlIOS,TextInput } from 'react-native';


import NavBar from '../common/NavBar'
import ProductCatagoryListView from './ProductCatagoryListView'
import HttpRequest from '../common/HttpRequest/HttpRequest'
import ConfirmOrderView from './ConfirmOrderView'
 var Global = require('../common/globals');
var screenWidth = 600,screenHeight=1000;
import CommitButton from '../common/CommitButton'
import ScrollableTabView from '../common/components/scrolltab/index'
 import ProductDetail from './ProductDetail'
import CountDownTimer from '../common/components/CountDown'
import GroupBuyCar from './GroupBuyCar'

import Banner from '../common/components/banner/index';
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

export default class ProductCatagoryListViewTab extends Component {

    constructor(props){
        super(props)
       var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.state = {
                index: 0,
                routes: [
                ],
                allGbDetail: {},
                gbList: {},
                goods: { description: '' },
                dataSource: ds,
                values:[],
                group_buy:[],
                selectedIndex:this.props.index,
                banners:[],
                endTime:0,
                image:null,
                cartNum:0,
                cartShow: true,
                exceStock: false,
                exceStockName:'',
                topView: {
                    height: 280,
                    width:375,
                    alignSelf:'stretch',
                    alignItems:'center',
                    // justifyContent:'center',

                },
            };
        let param = {
            agent_code:Global.agent_code,

        }
        HttpRequest.get('/shopping_cart', param, this.onGetFirstCartSuccess.bind(this),
            (e) => {

                console.log('shopping_cart error:' + e)
            })
        }

    clickBack() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.setState({
            product: this.props.prouduct,
        })

        let param = { classify: this.props.prouduct.classify_id,agent_code:Global.agent_code }

        HttpRequest.get('/group_buy_list', param, this.onGroupBuyListSuccess.bind(this),
            (e) => {

                console.log('group_buy_list error:' + e)
            })
            // this.fetchBanner();
    }
    onGetFirstCartSuccess(response){
        console.log(' get shopping_cart response'+JSON.stringify(response))


        var cart = []
        this.state.group_buy = response.data.group_buy

        var group_buyNum = 0
        console.log('group_buy.length:'+this.state.group_buy.length)
        for (var i =0; i < this.state.group_buy.length; i++){
            cart =  this.state.group_buy[i].goods_list
            for (var j = 0; j < cart.length;j++){
                let  quantity  = parseInt(cart[j].quantity)
                group_buyNum += quantity

                console.log('group_buyNum:'+group_buyNum)
            }

        }



        // var prouduct = this.props.prouduct;
        // hasGotGbDetail = false

        this.setState({
            // goods: { goods: { images: [{ image: prouduct.image.uri }] } },
            group_buy : response.data.group_buy,
            cartNum : group_buyNum,
            cartShow: !this.state.cartShow
        });


    }
    onGroupBuyListSuccess(response) {
        console.log('group_buy22:'+JSON.stringify(response))
        if (!response.data) {
            console.log(' no data found')
            return
        }
        var titles=[]
        for (var i = 0; i < response.data.group_buy.length; i++) {
            var item1 = response.data.group_buy[i]
             var oldTime = (new Date(item1.ship_time.replace(' ','T'))).getTime();
             var curTime = new Date(oldTime).format("M月d日");
            titles.push(curTime+'发货拼团')
        }

        this.setState({
            values:titles,
            gbList: response.data,
            routes: response.data.group_buy,
            image:response.data.image,
        })

        if (response.data.group_buy.length) {
            var paramBody = { group_buy: response.data.group_buy[0].id ,agent_code:Global.agent_code}
            HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
                (e) => {
                    console.log('group_buy_detail error:' + e)
                })
        }

    }

    changeTheTab(id){
        var paramBody = { group_buy: id ,agent_code:Global.agent_code}
        HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
            (e) => {
                console.log('group_buy_detail error:' + e)
            })
    }


    onGroupBuyDetailSuccess(response) {
        let gbData = this.state.allGbDetail
        gbData[response.data.id] = response.data
        gbData[response.data.id].group_buy_goods.map((item, n) => {

                    item.quantity = 0


        })



        this.setState({
            allGbDetail: gbData
        })
    }

    onViewLayout(layoutEvent) {
    var width = layoutEvent.nativeEvent.layout.width;
    if (width<=0) {
        return
    }

    screenWidth = layoutEvent.nativeEvent.layout.width
    screenHeight = layoutEvent.nativeEvent.layout.height
    this.state.topView.screenWidth = screenWidth
    this.setState({rowStyle:this.state.rowStyle,topView:this.state.topView });
    console.log(layoutEvent.nativeEvent.layout.width+'wwwwww=='+screenWidth)
    }
    onProdcutInfo(prouductItem){
        this.props.navigator.push({
            component: ProductDetail,
            props: {
                prouduct: {
                    'index': prouductItem.id,
                    'image': {uri:prouductItem.goods.images[0].image},
                },
            }
        })
        // this.props.navigator.push({
        //     component: ProductDetail,
        //     props: {
        //         prouduct:{
        //             'index': prouductItem.goods.id,
        //             'image': {uri:prouductItem.goods.goods.images[0].image},
        //         },
        //     }
        // })
    }
    renderItem(item, sectionID, rowID){
        //write your own layout in list view
        let w = screenWidth
        let  h = 110

        console.log(JSON.stringify(item)+'itemitemitemitem=='+rowID)
        return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'flex-start',flexDirection: "column",backgroundColor:'#ffffff',
            flex:1}}>
            <View style={{resizeMode:'contain', alignItems:'center',width: w, height: h-5,
            justifyContent:'center',paddingRight:10,flexDirection: "row",backgroundColor:'#ffffff',
            flex:1}}>


            <TouchableOpacity style={{
               flexDirection:'row' ,alignItems:'center',width:this.state.topView.width-100}}  onPress={this.onProdcutInfo.bind(this, item)}>

            <Image style={{resizeMode:'contain', alignItems:'center',width: h, height: h,
                justifyContent:'center',}} source={{ uri: item.goods.images[0].image  }}/>
            <View style={{
                height:h,
                alignItems:'flex-start',
                flex:12,backgroundColor:'#ffffff'}}>
                <Text style={{marginLeft:30,marginTop:10,numberOfLines:2,ellipsizeMode:'tail',fontSize: 14, color: "#1c1c1c",}}>{item.goods.name}</Text>
                <Text style={{marginLeft:30,alignItems:'center',justifyContent:'center',fontSize: 12, color: "#757575",}}>{item.brief_dec}</Text>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:30,paddingBottom:10,position:'absolute',left:0,right:0,bottom:0}}>
                    <Text style={{fontSize: 16, color: "#fb7210",}}>S$ {item.price}</Text>
                    <Text style={{marginLeft:10,fontSize: 12, color: "#757575",}}>库存：{item.stock}</Text></View>
            </View>
            </TouchableOpacity>
            <View style={{
                height:h,
                alignItems:'flex-end',
                paddingBottom:10,
                flex:6,backgroundColor:'#ffffff'}}>

                    <View style={{alignItems:'flex-end',textAlign:'right',flex:6,justifyContent:'flex-end',fontSize: 12, color: "#ffffff",}}>

                        <View style={{ height: 30, borderWidth: 0.5, borderColor: 'rgb(234,107,16)', borderRadius: 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{width:55,height:15,
                        marginLeft: 5, fontSize: 14, flex: 20,
                        textAlign: 'center', color: 'rgb(234,107,16)',
                    }}>数量:</Text>
                            {/*<TouchableOpacity onPress={this.onNumberMinus.bind(this, item)}*/}
                                              {/*style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>*/}
                                {/*<Image style={{width:14,height:14}} source={require('../images/deleteNumberIcon@2x.png')}></Image>*/}
                            {/*</TouchableOpacity>*/}
                            <TextInput style={{width:35,height:15,
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'center', color: 'rgb(234,107,16)',
                    }}
                                       clearTextOnFocus ={true}
                                       keyboardType={'numeric'}
                                       editable={true}
                                       onChangeText={(text) => this.changeItemQuantity(item,text,this.state.selectedIndex).bind(this)}

                                       value= {item.quantity}
                            ></TextInput>

                            {/*<TouchableOpacity onPress={this.onNumberAdd.bind(this, item)}*/}
                                              {/*style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>*/}
                            {/*</TouchableOpacity>*/}
                        </View>

                    </View>
                </View>


        </View>
        <View style={{width:this.state.topView.screenWidth ,alignSelf:'flex-end',height:5,backgroundColor:'rgb(244,244,244)'}} ></View>
        </View>)

    }


    // renderItem(item, sectionID, rowID){
    //     //write your own layout in list view
    //     let w = (screenWidth - 20) / 2
    //     console.log(JSON.stringify(item)+'itemitemitemitem=='+rowID)
    //
    //     return (<TouchableOpacity underlayColor="#dad9d7" style={[{
    //         screenWidth:screenWidth,
    //         justifyContent: 'center',
    //         padding: 1,
    //         margin: 5,
    //         width: w,
    //         height: 220,
    //         backgroundColor: '#F6F6F6',
    //         alignItems: 'center',
    //         borderWidth: 1,
    //         borderRadius: 2,
    //         borderColor: '#CCC'
    //     }]} onPress={this.onItemPress.bind(this,rowID,item)}>
    //             <View >
    //
    //                 <Image style={{
    //                 resizeMode: 'contain', alignItems: 'center',
    //                 justifyContent: 'center', width: w - 2,
    //                 backgroundColor: '#ffffff',
    //                 flex: 4
    //             }}
    //                        source={{ uri: item.goods.images[0].image }}
    //                 />
    //                 <View style={{ backgroundColor: '#fdf3ec', flex: 2 }}>
    //                     <Text style={{
    //                     alignItems: 'center', fontSize: 14,
    //                     color: '#1c1c1c',
    //                     justifyContent: 'center', margin: 2, numberOfLines: 2, ellipsizeMode: 'tail',
    //                     flex: 1
    //                 }}>{item.goods.name}</Text>
    //
    //                     <View style={{
    //                     alignItems: 'center', flexDirection: 'row',
    //                     justifyContent: 'center',
    //                     flex: 1
    //                 }}>
    //                         <Text style={{ alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start', numberOfLines: 1, color: '#e31515', fontSize: 20, }}>S$ {item.price}</Text>
    //                         <Text style={{
    //                         alignItems: 'center', marginLeft: 10,
    //                         justifyContent: 'center', numberOfLines: 1, color: '#757575', fontSize: 12
    //                     }}>{item.brief_dec}</Text>
    //                     </View>
    //                 </View>
    //
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }
    renderItemInfo(item, sectionID, rowID){
        var width = this.state.topView.screenWidth;
        const w = width , h = 110



    }
    changeItemQuantity(item,text,categoryNum){
        var product = item

        console.log('changeItemQuantity:'+JSON.stringify(item))
        if (parseInt(text) > parseInt(item.stock)){
            alert('添加商品数量超过最大库存，请重新输入')

        }else {
            item.quantity = parseInt(text);
        }

        // let gbData = this.state.allGbDetail
        // let clearId = this.state.routes[this.state.selectedIndex].id
        //
        // gbData[clearId].group_buy_goods.map((dataitem, n) => {
        //
        //     if (product.cart_id == dataitem.cart_id){
        //         dataitem.quantity = text;
        //     }
        //
        //
        // })

        //
        //
        // this.state.allGbDetail = gbData
        // this.state.group_buy[categoryNum].cart_goods.map((item, i) => {
        //
        //     if (product.cart_id == item.cart_id){
        //         item.quantity = text;
        //     }
        //
        //
        // })



        // var product = item
        // console.log('changeItemQuantity:'+JSON.stringify(product))
        //
        // product.quantity = text;
        //
        //
        this.setState({ ...this.state })

    }
    SubmitItemQuantity(item,text,categoryNum){
        // alert('item'+JSON.stringify(item))
        // if (text > item.goods.stock){
        //
        //     Alert.alert('已超过最大库存量！')
        // }else {
        //
        //     let param = {
        //         cart_id:item.cart_id,
        //         quantity:text,
        //
        //
        //
        //     }
        //
        //     HttpRequest.put('/shopping_cart', param, this.onPutCartSuccess.bind(this),
        //         (e) => {
        //             alert('刷新购物车失败，请稍后再试。')
        //             console.log('shopping_cart error:' + e)
        //         })
        // }
    }
    onNumberMinus(item) {
        item.quantity=parseInt(item.quantity)-1;
        if (item.quantity <0) {
            item.quantity = 0
        }


        if (item.quantity == 0){
            // let param = {
            //     cart_id:item.cart_id,
            //
            //
            //
            //
            // }
            // HttpRequest.delete('/shopping_cart', param, this.onDeleteCartSuccess.bind(this),
            //     (e) => {
            //
            //         console.log('deleteshopping_cart error:' + e)
            //     })
        }else {
            // let param = {
            //     cart_id:item.cart_id,
            //     quantity:item.quantity,
            //
            //
            //
            // }

            // HttpRequest.put('/shopping_cart', param, this.onPutCartSuccess.bind(this),
            //     (e) => {
            //         alert('刷新购物车失败，请稍后再试。')
            //         console.log('shopping_cart error:' + e)
            //     })
        }
        this.setState({  ...this.state})

    }
    onNumberAdd(item) {
        if (parseInt(item.quantity)+1 > parseInt(item.stock)){

            alert('已添加到最大库存量！')
        }else {
            item.quantity=parseInt(item.quantity)+1;


        }
        var dataSource = this.state.dataSource._dataBlob.s1
       console.log('  this.state.dataSource22'+JSON.stringify(this.state.dataSource))
        dataSource.map((dataItem, i) => {
           if (item.goods_id == dataItem.id){
               dataItem.quantity = item.quantity
           }



        })
        this.onSenceItem(this.state.selectedIndex)


    }
    onItemPress(index, item){
        this.props.navigator.push({
            component: ProductDetail,
            props: {
                prouduct: {
                    'index': item.id,
                    'image': {uri:item.goods.images[0].image},
                },
            }
        })
    };

    startGroupBuy(groupBuyDetail) {

        AsyncStorage.setItem('k_cur_gbdetail', JSON.stringify(groupBuyDetail)).then(function(){
            console.log('save k_cur_gbdetail succ.')
                    }.bind(this)).catch(function(error){
                        console.log('save k_cur_gbdetail faild.' + error.message)
            }.bind(this));


        Global.gbDetail = groupBuyDetail

        this.props.navigator.push({
            component: GroupBuyCar,
            props: {
                showBack: true,
            }
        })
    }

    onBannerSuccess(response){
        console.log('get banners succ.....'+JSON.stringify(response))
    this.state.banners = response.data.images;
    this.setState({banners:this.state.banners});
}

    fetchBanner(){
    var paramBody ={ }

    HttpRequest.get('/banner', paramBody, this.onBannerSuccess.bind(this),
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


    renderProductCategoryView(groupBuyDetail ,title) {

        let rowData = groupBuyDetail.group_buy_goods

        if (rowData) {


            this.state.dataSource = this.state.dataSource.cloneWithRows(rowData)

        }

        if(!this.state.dataSource){
          return(<View tabLabel={title} style={styles.container}>

              </View>)
        }
        console.log('this.state.dataSource '+JSON.stringify(rowData))
        return (
            <View  style={[styles.list_container,{height:screenHeight}]}>
            <View style={[styles.list_container,{marginTop:0}]}>
            <ListView
                contentContainerStyle={styles.list}
                style={[styles.listview_container,{marginBottom:55}]}
                dataSource={this.state.dataSource}
                initialListSize={10}
                renderHeader={this.renderTopView.bind(this)}
                pageSize={3}
                keyboardShouldPersistTaps={true}
                 automaticallyAdjustContentInsets={false}
                 keyboardDismissMode="on-drag"
                scrollRenderAheadDistance={500}
                renderRow={this.renderItem.bind(this)}
            />
                {/* <View style={{
                alignSelf:'stretch',width:screenWidth,position: 'absolute', left: 0, right: 0, bottom: 0 }}><CommitButton title={'开始拼团'} onPress={this.startGroupBuy.bind(this,groupBuyDetail)}></CommitButton></View> */}

            </View>
                <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>


                    {this.renderProductDetailBuyView()}


                </View>
            </View>
        );
    }
    renderProductDetailBuyView(isLoad){
        var width = this.state.topView.screenWidth;

        let h = 55

        // let display = this.state.cartShow ? this.state.cartNum : this.state.cartNum;
        // console.log('this.state.cartNum '+display);
        var buyNowBtnColor =''
        var addGroupBuyColor =''

            buyNowBtnColor ='rgb(244,244,244)'
            addGroupBuyColor ='rgb(234,107,16)'


            return(<View style={{ height: h,
        justifyContent:'flex-start',flexDirection: "row"}}>
                <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',}} onPress={this.goToGroupBuyCar.bind(this)} >
                    <View style={{flexDirection: 'column',width:this.state.topView.screenWidth/5,height:52,backgroundColor:'rgb(244,244,244)'}}>

                        <Image style={{width:20,height:20,alignItems: 'center',alignSelf:'center',marginLeft:28,}} source={require('../images/number@3x.png')}><Text style={{color:'#ffffff'}}>{this.state.cartNum}</Text> </Image>
                        <Image style={{resizeMode:'contain', width: 40,height: 35,alignItems: 'center',alignSelf:'center',backgroundColor:'rgb(244,244,244,0.8)',}}
                               source={require('../images/shoppingcart_icon@2x.png')}
                        >
                        </Image>



                    </View>
                </TouchableOpacity>
                <View style={{height:49,width:0.5,backgroundColor:'rgb(221,221,221)'}}></View>
                <TouchableOpacity underlayColor="#ffffff" style={{width:this.state.topView.screenWidth/5*2} }  onPress={this.onBuyNow.bind(this)}>

                    <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:buyNowBtnColor,height:49,}}>

                        <Text  style={{fontSize: 16,
                     textAlign: 'Center',fontFamily:'PingFangSC-Regular',
                     color: 'rgb(117,117,117)',}}>立即购买</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity underlayColor="rgb(234,107,16,0.8)" style={{justifyContent:'flex-end',width:this.state.topView.screenWidth/5*2}} onPress={this.addGroupBuy.bind(this)}  >

                    <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:addGroupBuyColor,height:49}}>

                        <Text  style={{fontSize: 16,
                     textAlign: 'Center',fontFamily:'PingFangSC-Regular',
                     color: '#ffffff',}}>加入拼团车</Text>

                    </View>
                </TouchableOpacity>
            </View>)


    }
    onBuyNow(){
        var categoryDataAry = []
        var group_buy_goods_cars = []
        var hasGood = false
       var group_buy_goods_car_data = this.state.dataSource._dataBlob.s1

        group_buy_goods_car_data.map((item, i) => {
            var itemSelected = false
            if (item.quantity > 0){
                itemSelected = true
                 hasGood = true
            }

            group_buy_goods_cars.push({
                goods_id:item.id,
                goods_name:item.goods.name,
                image:item.goods.images[0].image,
                brief_desc:item.brief_dec,
                price:item.price,
                quantity: item.quantity,
                cart_id: '',
                selected:itemSelected,
                stock:item.stock

            })


        })
        var cateItem = this.state.routes[this.state.selectedIndex]

        let key = cateItem.id
        let gbDetail = this.state.allGbDetail[key]
        console.log('gbDetail:'+JSON.stringify(gbDetail))
        categoryDataAry.push({classify:{name:gbDetail.classify.name},ship_time:cateItem.ship_time,group_buy_goods_car: group_buy_goods_cars})
        if (hasGood){
            Global.categoryData = categoryDataAry

            this.props.navigator.push({
                component: ConfirmOrderView,
                props: {

                    showBack:true,
                    isMoreBuy:false
                }
            })
        }else {
            alert('请添加拼团商品数量')
        }


    }

    addGroupBuy(){
        console.log('addGroupBuy33'+JSON.stringify(this.props.prouduct))
        var group_buy_goods_car_data = this.state.dataSource._dataBlob.s1
        var hasGood = false

        var addGroup_buy_goods =[]
        group_buy_goods_car_data.map((item, i) => {
            var itemSelected = false
            if (item.quantity > 0){

                addGroup_buy_goods.push({goods_id:item.id,goods_quantity:item.quantity})
            }

        })

        if (addGroup_buy_goods.length > 0){
            hasGood = true
        }

        if (hasGood){


                let param = {
                    agent_code:Global.agent_code,
                    goods_list:addGroup_buy_goods
                }
                HttpRequest.post('/shopping_cart', param, this.onAddCartSuccess.bind(this),
                    (e) => {

                        console.log('shopping_cart error:' + e)
                    })


        }else {
            alert('请添加拼团商品数量')
        }


    }
    onAddCartSuccess(response){
        console.log('post shopping_cart response'+JSON.stringify(response))
        if (response.message =='Success'){

            alert('加入到购物车成功')
            this.props.navigator.replace({
                component: ProductCatagoryListViewTab,
                props: {
                    prouduct:this.props.prouduct,
                    index:this.state.selectedIndex
                }
            })
            // let param = {
            //     agent_code:Global.agent_code,
            //
            // }
            //
            // HttpRequest.get('/shopping_cart', param, this.onGetCartSuccess.bind(this),
            //     (e) => {
            //
            //         console.log('shopping_cart error:' +e )
            //     })
        }else {

        }


    }
    onGetCartSuccess(response){
        console.log(' get shopping_cart response'+JSON.stringify(response))


        var cart = []
        this.state.group_buy = response.data.group_buy
        Global.group_buy = response.data.group_buy
        var group_buyNum = 0
        console.log('group_buy.length:'+this.state.group_buy.length)
        for (var i = 0; i < this.state.group_buy.length; i++){
            cart =  this.state.group_buy[i].goods_list
            for (var j = 0; j < cart.length;j++){
                let  quantity  = parseInt(cart[j].quantity)
                group_buyNum += quantity
            }


        }
        this.state.cartNum = group_buyNum
        this.state.cartShow = !this.state.cartShow

        let gbData = this.state.allGbDetail
         let clearId = this.state.routes[this.state.selectedIndex].id

        gbData[clearId].group_buy_goods.map((item, n) => {

            item.quantity = 0


        })


        this.state.allGbDetail = gbData

        this.setState({ ...this.state })
        alert('加入到购物车成功')




    }
    goToGroupBuyCar(){




        // var group_buy_goods_car = []
        // if (Global.gbDetail) {
        //     group_buy_goods_car = Global.gbDetail.group_buy_goods_car
        //     if (!group_buy_goods_car) {
        //         group_buy_goods_car = []
        //     }
        // }
        // Global.gbDetail = this.state.gbDetail
        // Global.gbDetail.group_buy_goods_car = group_buy_goods_car

        Global.group_buy = this.state.group_buy


        this.props.navigator.push({
            component: GroupBuyCar,
            props: {
                goods:this.state.group_buy  ,
                showBack:true,
            }
        })
    }
    createProdcutCategoryList(gbDetail,title) {
        if (!gbDetail) {
            return (<View></View>)
        }

         return (this.renderProductCategoryView(gbDetail,title))
        //return (<ProductCatagoryListView tabLabel={title} groupBuyDetail= {gbDetail} navigator= {this.props.navigator} ></ProductCatagoryListView>)
    }

    onSenceItem(index) {


        var item = this.state.routes[index]

        let key = item.id
        let gbDetail = this.state.allGbDetail[key]





    // this.setState({ ...this.state })
        return(this.createProdcutCategoryList(gbDetail,item.ship_time))


        // var displayCategoryAry = []
        // for (var i = 0; i < this.state.routes.length; i++) {
        //     var item = this.state.routes[i]
        //     let key = item.id
        //     let gbDetail = this.state.allGbDetail[key]
        //     displayCategoryAry.push(this.createProdcutCategoryList(gbDetail,item.ship_time))
        // }
        //
        // if (displayCategoryAry.length == 0) {
        //     displayCategoryAry.push(<View></View>)
        // }
        //
        // return displayCategoryAry
    }


    _onChange(event) {
      this.setState({
        selectedIndex: event.nativeEvent.selectedSegmentIndex,
      });

     this.changeTheTab(this.state.routes[event.nativeEvent.selectedSegmentIndex].id)
      console.log("value=="+event.nativeEvent.selectedSegmentIndex);
          var item = this.state.routes[event.nativeEvent.selectedSegmentIndex]
          this.state.endTime = item.end_time
     this.onSenceItem(event.nativeEvent.selectedSegmentIndex)
    }

    _onValueChange(value) {
        console.log("value=="+value);

      this.setState({
        value: value,
      });


    }

    renderTopView() {
        var image = ''
        if (this.state.image) {
            var banners = [];
            var item = this.state.routes[this.state.selectedIndex]
            var endTime = (new Date(item.end_time.replace(' ','T'))).getTime();
            var curTime = new Date(endTime).format("yyyy-MM-ddThh:mm:ss+00:00");
            banners.push({image:this.state.image})
            return (

                <View style = {this.state.topView}>
                <Image
                   style={{resizeMode:'contain',height: 180,
                   width:this.state.topView.screenWidth,
                    }}
                   source={{uri: this.state.image}}
                   />

                   <Text style={{margin:10,fontSize:14,color:'#1c1c1c',textAlign:'center',alignItems:'center',justifyContent:'center'}}>
                      {this.props.prouduct.classify_desc}
                      </Text>

                   <View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'stretch'}}>
                   <Text style={{fontSize:12,color:'#e41515',textAlign:'center',alignItems:'center',justifyContent:'center'}}>
                      截团倒计时
                      </Text>
                   <CountDownTimer
                        date={curTime}
                        // date="2017-11-28T00:00:00+00:00"
                        days={{plural: '天 ',singular: '天 '}}
                        hours=':'
                        mins=':'
                        segs=''

                        daysStyle={styles.time}
                        hoursStyle={styles.time}
                        minsStyle={styles.time}
                        secsStyle={styles.time}
                        firstColonStyle={styles.colon}
                        secondColonStyle={styles.colon}
                    />
                   </View>

                </View>


                //  <Banner
                //     style={styles.topView}
                //     banners={banners}
                //     defaultIndex={0}
                // />

            )
        }
        //
        // {/* <Banner
        //     style={styles.topView}
        //     banners={this.banners}
        //     defaultIndex={this.defaultIndex}
        //     onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
        //     intent={this.bannerClickListener.bind(this)}
        // /> */}


    }

    renderTabView() {
         if (this.state.gbList.group_buy && this.state.gbList.group_buy.length) {

            return(
                <View  onLayout={this.onViewLayout.bind(this)}>

                <SegmentedControlIOS
                    values={this.state.values}
                    tintColor='#ea6b10'
                    selectedIndex={this.state.selectedIndex}
                    onChange={this._onChange.bind(this)}
                    style={{alignSelf:'stretch',margin:20}}
                    onValueChange={this._onValueChange.bind(this)} />

                   {this.onSenceItem(this.state.selectedIndex)}
                {/* <ScrollableTabView style={styles.container}>
               {this.onSenceItem()}
                </ScrollableTabView> */}
                </View>
            )

         }
        else {
            return (<View onLayout={this.onViewLayout.bind(this)}></View>)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.state.gbList.name}
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.clickBack.bind(this)} />
                {this.renderTabView()}
            </View>

        );
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list_container: {
        flex: 1,
        alignSelf:'stretch',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    listview_container: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignSelf:'stretch',
        flexWrap: 'wrap',
    },
    list: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'column',
        alignSelf:'stretch',
        flexWrap: 'wrap',
        marginTop:10
    },
    tabbar: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ffffff',
    },
    tab: {
        width: screenWidth / 2,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        backgroundColor: '#ea6b10',
    },
    label: {
        color: '#ea6b10',
    },
    //时间文字
     time: {
       paddingHorizontal: 3,
       backgroundColor: 'rgba(85, 85, 85, 1)',
       fontSize: 12,
       color: 'white',
       marginHorizontal: 3,
       borderRadius: 2,
     },

     //冒号
     colon: {
       fontSize: 12, color: 'rgba(85, 85, 85, 1)'
     },

});
