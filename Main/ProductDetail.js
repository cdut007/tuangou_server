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
    AsyncStorage,
    WebView,

} from 'react-native';

var hasGotGbDetail = false
import HttpRequest from '../common/HttpRequest/HttpRequest'
var Global = require('../common/globals');
import NavBar from '../common/NavBar'
import CommitButton from '../common/CommitButton'
import GroupBuyCar from './GroupBuyCar'
import ConfirmOrderView from './ConfirmOrderView'

var BGWASH = 'rgba(255,255,255,0.8)';
import Banner from '../common/components/banner/index';
import HorizontalScrollView from '../common/components/banner/HorizontalScrollView'
export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
            defaultIndex:0,
            toolsView: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: 'center',
                alignItems: 'center',
                screenWidth:500,
                screenHeight:1000,
            },
            goods: { goods: { images: [{ image: '' }] } },//defualt image later
            gbDetail: { classify: { name: '', icon: '' }, group_buy_goods: [] },
            url:'https://m.baidu.com',
            cartNum:0,
            cartShow: true,
             group_buy:[],

            isHaveGood:true,
            isLoad: false,

            }
        let param = {
            agent_code:Global.agent_code,

        }
        HttpRequest.get('/shopping_cart', param, this.onGetFirstCartSuccess.bind(this),
            (e) => {

                console.log('shopping_cart error:' + e)
            })
    }


    onItemClick(prouductItem){
        this.props.navigator.replace({
           component: ProductDetail,
            props: {
                prouduct:{
                    'index': prouductItem.goods_id,
                    'image': {uri:prouductItem.image},
                },
               }
       })
    }





    componentWillMount(){

    }

    componentDidMount() {



    }

    onGroupBuyDetailSuccess(response) {
         hasGotGbDetail = true
         this.setState({
             gbDetail: response.data,
             isLoad: true
         })

     }

    onProudctDetailSuccess(response) {
      this.setState({ goods: response.data })
        if (this.state.goods.stock >  0){
         this.state.isHaveGood = true
        }else {
            this.state.isHaveGood = false
        }

      var paramBody = {group_buy: response.data.group_buy,
      agent_code:Global.agent_code}
      HttpRequest.get('/group_buy_detail' ,paramBody, this.onGroupBuyDetailSuccess.bind(this),
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
              catch (err) {
                  console.log(err)
              }

              console.log(' error:' + e)
          })
  }

    _fetchGoods(spec_id) {

        var paramBody = {agent_code:Global.agent_code,goods:spec_id}
                HttpRequest.get('/goods_detail', paramBody, this.onProudctDetailSuccess.bind(this),
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
                        catch (err) {
                            console.log(err)
                        }

                        console.log(' error:' + e)
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
    this.state.toolsView.screenWidth = layoutEvent.nativeEvent.layout.width
    this.state.toolsView.screenHeight = height

    this.setState({toolsView:this.state.toolsView});
  }

    render() {
        return (
            <View style={styles.container} onLayout={this.onViewLayout.bind(this)}>
                <NavBar title="商品详情"
                leftIcon={require('../images/back@2x.png')}
                leftPress={this.clickBack.bind(this)}/>
                {this.renderProductDetailView()}
            </View>
        )
    }

    addGroupBuy(){
        if (this.state.isHaveGood){

            let param = {
                agent_code:Global.agent_code,

                goods_list: [{goods_id: this.props.prouduct.index, goods_quantity: 1}]
            }
            HttpRequest.post('/shopping_cart', param, this.onAddCartSuccess.bind(this),
                (e) => {

                    console.log('shopping_cart error:' + e)
                })
        }



    }
    onAddCartSuccess(response){
        console.log('post shopping_cart response'+JSON.stringify(response))
        if (response.message =='Success'){

            let param = {
                agent_code:Global.agent_code,

            }

            HttpRequest.get('/shopping_cart', param, this.onGetCartSuccess.bind(this),
                (e) => {

                    console.log('shopping_cart error:' +e )
                })
        }else {

        }


    }
    _handleNumberInput(input){

    }
    _handleStringInput(input){

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



        var prouduct = this.props.prouduct;
        hasGotGbDetail = false

        this.setState({
            goods: { goods: { images: [{ image: prouduct.image.uri }] } },
            group_buy : response.data.group_buy,
            cartNum : group_buyNum,
            cartShow: !this.state.cartShow
        });
        this._fetchGoods(prouduct.index);

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

                console.log('group_buyNum:'+group_buyNum)
            }


        }
        this.state.cartNum = group_buyNum
        this.state.cartShow = !this.state.cartShow


        this.setState({ ...this.state })
        alert('加入到购物车成功')


    }
    bannerClickListener(index) {
    // this.setState({
    //     clickTitle: this.state.banners[index].title ? `you click ${this.state.banners[index].title}` : 'this banner has no title',
    // })

}

bannerOnMomentumScrollEnd(event, state) {
     console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`);
    this.state.defaultIndex = state.index;
}

  renderTopBanner(goods){
      if (goods.goods.images && goods.goods.images.length > 1 && goods.goods.images[0].image != '') {

           console.log("--->banners :"+ JSON.stringify(goods.goods.images[0].image));

          return (

              <Banner
               style={{height:305,width:this.state.toolsView.screenWidth}}
              banners={goods.goods.images}
              defaultIndex={this.state.defaultIndex}
              onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
              intent={this.bannerClickListener.bind(this)}

          />
          )
      }else{
          return(
              <Image
                 style={{height:305,width:this.state.toolsView.screenWidth}}
                 source={{uri: goods.goods.images[0].image}}
                 />
          )
      }
  }

    renderProductDetailView() {
        const ItemW = this.state.toolsView.screenWidth / 3 - 9, ItemH = 140
        var goods = this.state.goods;
        var goodsRecommendItems= this.state.gbDetail.group_buy_goods;
            // if(!goods){
        //     return <Loading loadingtext='正在加载商品...'/>
        // }
        //var htmlContent = goods.description||"";
        console.log('received view ScrollView layout screenWidth\n',this.state.toolsView.screenWidth);
        return (
            <View style={styles.container}>
            <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}
            style={{marginBottom:50,height:this.state.toolsView.screenHeight,width:this.state.toolsView.screenWidth}}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            >
                <View style={{alignSelf:'stretch'}}>

                  {this.renderTopBanner(goods)}
                    <Text style={{flex:1,color:'#1c1c1c',fontSize:18,margin:10}}>{goods.goods.name}</Text>
                    <View style={{alignItems:'center',flexDirection:'row',
                    justifyContent:'flex-start',margin:10,}}>
                    <Text style={{alignItems:'center', textAlign: 'left', justifyContent:'flex-start',numberOfLines:1,color:'#e31515',fontSize:20,}}>S$ {goods.price}</Text>
                    <Text style={{alignItems:'center',marginLeft:10,flex:7,
                    justifyContent:'center',numberOfLines:1,color:'#757575',fontSize:12}}>{goods.brief_dec}</Text>
                    <Text style={{alignItems:'center',marginLeft:10,flex:2,
                    justifyContent:'flex-end',numberOfLines:1,color:'#757575',fontSize:12}}>库存 {goods.stock}</Text>
                    </View>


                    <View style = {{
                        flexDirection:'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        margin:10,
                    }}>
                        <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:30,height:30,
              justifyContent:'center'}} source={{ uri: this.state.gbDetail.classify.icon }}/>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                            {this.state.gbDetail.classify.name}
                        </Text>
                        </View>

                        <View style={{width:this.state.toolsView.screenWidth,height:160}}>
                        <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{width:ItemW*goodsRecommendItems.length,height:ItemH}}
                        style={{width:this.state.toolsView.screenWidth,height:ItemH}}
                    >

                        {this.renderCategorysView(goodsRecommendItems)}
                    </ScrollView>
                        </View>

                        <View style={{backgroundColor:'#f2f2f2',height:10,width:this.state.toolsView.screenWidth,}}>
                        </View>



                    <Text
                        style={{ fontSize: 18, color: '#757575', textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
                        商品详情
                    </Text>

                        {this.renderDetailView(goodsRecommendItems,goods.goods)}

                    {/* <HTMLView
                        value={htmlContent}
                        style={styles.container}
                      /> */}
                </View>
            </ScrollView>

            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>


                    {this.renderProductDetailBuyView(this.state.isLoad)}


            </View>
            </View>
        );
    }
    goToGroupBuyCar(){
        if(!hasGotGbDetail)
        {
            return
        }

        AsyncStorage.setItem('k_cur_gbdetail', JSON.stringify(this.state.gbDetail)).then(function(){
            console.log('save k_cur_gbdetail succ.')
        }.bind(this)).catch(function(error){
            console.log('save k_cur_gbdetail faild.')
        }.bind(this));
        AsyncStorage.setItem('k_cur_group_buy', JSON.stringify(this.state.group_buy)).then(function(){
            console.log('save k_cur_group_buy succ.')
        }.bind(this)).catch(function(error){
            console.log('save k_cur_group_buy faild.')
        }.bind(this));

        var group_buy_goods_car = []
        if (Global.gbDetail) {
            group_buy_goods_car = Global.gbDetail.group_buy_goods_car
            if (!group_buy_goods_car) {
                group_buy_goods_car = []
            }
        }
        Global.gbDetail = this.state.gbDetail
        Global.gbDetail.group_buy_goods_car = group_buy_goods_car

        Global.group_buy = this.state.group_buy  


        this.props.navigator.push({
            component: GroupBuyCar,
            props: {
                goods:this.state.group_buy  ,
                showBack:true,
            }
        })

    }
    onBuyNow(){
        console.log('onBuyNow11'+JSON.stringify(this.state.goods))
        if (this.state.isHaveGood){
            var categoryDataAry = []
            categoryDataAry.push({classify:{name:this.state.gbDetail.classify.name},ship_time:this.state.gbDetail.ship_time,group_buy_goods_car:[
                {
                    goods_id:this.state.goods.id,
                    goods_name:this.state.goods.goods.name,
                    image:this.state.goods.goods.images[0].image,
                    brief_desc:this.state.goods.brief_desc,
                    price:this.state.goods.price,
                    quantity: 1,
                    cart_id: '',
                    selected:true,
                    stock:this.state.goods.stock
                }]})

            Global.categoryData = categoryDataAry

            this.props.navigator.push({
                component: ConfirmOrderView,
                props: {

                    showBack:true,
                    isMoreBuy:false
                }
            })
        }

    }
    renderProductDetailBuyView(isLoad){
        var width = this.state.toolsView.screenWidth;
        console.log('received renderProductStartGroupBuyView layout width\n', width);
        let h = 55

        let display = this.state.cartShow ? this.state.cartNum : this.state.cartNum;
        console.log('this.state.cartNum '+display);
        var buyNowBtnColor =''
        var addGroupBuyColor =''
        if (this.state.isHaveGood){
             buyNowBtnColor ='rgb(244,244,244)'
             addGroupBuyColor ='rgb(234,107,16)'
        }else {
            buyNowBtnColor ='#D4D4D4'
            addGroupBuyColor ='#8B8B8B'
        }
        if (isLoad){
            return(<View style={{ height: h,
        justifyContent:'flex-start',flexDirection: "row"}}>
                <TouchableOpacity style={{justifyContent:'center',alignItems: 'center',}} onPress={this.goToGroupBuyCar.bind(this)} >
                    <View style={{flexDirection: 'column',width:this.state.toolsView.screenWidth/5,height:52,backgroundColor:'rgb(244,244,244)'}}>

                        <Image style={{width:20,height:20,alignItems: 'center',alignSelf:'center',marginLeft:28,}} source={require('../images/number@3x.png')}><Text style={{color:'#ffffff'}}>{display}</Text> </Image>
                        <Image style={{resizeMode:'contain', width: 40,height: 35,alignItems: 'center',alignSelf:'center',backgroundColor:'rgb(244,244,244,0.8)',}}
                               source={require('../images/shoppingcart_icon@2x.png')}
                        >
                        </Image>



                    </View>
                </TouchableOpacity>
                <View style={{height:49,width:0.5,backgroundColor:'rgb(221,221,221)'}}></View>
                <TouchableOpacity underlayColor="#ffffff" style={{width:this.state.toolsView.screenWidth/5*2} }  onPress={this.onBuyNow.bind(this)}>

                    <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:buyNowBtnColor,height:49,}}>

                        <Text  style={{fontSize: 16,
                     textAlign: 'Center',fontFamily:'PingFangSC-Regular',
                     color: 'rgb(117,117,117)',}}>立即购买</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity underlayColor="rgb(234,107,16,0.8)" style={{justifyContent:'flex-end',width:this.state.toolsView.screenWidth/5*2}} onPress={this.addGroupBuy.bind(this)}  >

                    <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:addGroupBuyColor,height:49}}>

                        <Text  style={{fontSize: 16,
                     textAlign: 'Center',fontFamily:'PingFangSC-Regular',
                     color: '#ffffff',}}>加入购物车</Text>

                    </View>
                </TouchableOpacity>
            </View>)
        }else {
            return(<View></View>)
        }

    }
    renderDetailView(prouductItems,goods){
        var divStyle = {
           color: 'blue',
            width: this.state.toolsView.screenWidth

       };
        return (
            // <iframe src="https://www.baidu.com" width="540" height="450"></iframe>
          <View style={[{ width: this.state.toolsView.screenWidth}]}>
          <div
          style={divStyle}
          dangerouslySetInnerHTML={{__html: goods.desc}}
          >
          </div>
          </View>
        )
    }

    renderCategorysView(prouductItems,goods) {
    console.log('prouductItemsdetail:'+JSON.stringify(prouductItems))
        var width = this.state.toolsView.screenWidth;
        const w = width / 3 - 9, h = 120

        let renderSwipeView = (types, n) => {
            return (
                <View style={this.state.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:5 }, styles.toolsItem]}>

                                    <Image style={{resizeMode:'contain', alignItems:'center',width: w-2, height: h-20,
                                    justifyContent:'center',margin:2,}} source={{uri: item.goods.images[0].image}}/>
                                    <Text style={{ fontSize: 12, color: '#1b1b1b', textAlign: 'center', numberOfLines: 2, margin: 10 }}>{item.goods.name}</Text>
                                    <Text style={{ textAlign: 'center', numberOfLines: 1, color: '#e31515', fontSize: 12}}>S$ {item.price}</Text>

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
    textprimary:{
        fontSize:18,
        color:'#4a4d52',
    },
    textsecond:{
        fontSize:18,
        color:'#929aa2',
    },
    textPrice:{
        fontSize:18,
        color:'#fb7e00',
    },
    marginTop10:{
        marginTop:15,
    },
    paddingLeftRight:{
        paddingLeft:10,
        paddingRight:10,
    },
    scrollSpinner: {
        marginVertical: 20,
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 10,
    },
    rowSeparatorHide: {
        opacity: 0.0,
    },
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
    webView: {
    backgroundColor: BGWASH,
    height: 350,
  },

});
