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
} from 'react-native';

var hasGotGbDetail = false
import HttpRequest from '../common/HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import CommitButton from '../common/CommitButton'
import GroupBuyCar from './GroupBuyCar'
var Global = require('../common/globals');


export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
            toolsView: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: 'center',
                alignItems: 'center',
                screenWidth:500,
                screenHeight:1000,
            },
            goods: { goods: { images: [{ image: '' }] } },//defualt image later
            gbDetail: { classify: { name: '', icon: '' }, group_buy_goods: [] }

            }
    }


    onItemClick(prouduct){

    }






    componentDidMount() {
        var prouduct = this.props.prouduct;
        hasGotGbDetail = false

    this.setState({
        goods: { goods: { images: [{ image: prouduct.image.uri }] } }
    });
        this._fetchGoods(prouduct.index);
    }

    onGroupBuyDetailSuccess(response) {
         hasGotGbDetail = true
         this.setState({
             gbDetail: response.data
         })
     }

    onProudctDetailSuccess(response) {
      this.setState({ goods: response.data })

      var paramBody = {group_buy: response.data.group_buy}
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

        var paramBody = {}
                HttpRequest.get('/goods_detail/' + spec_id, paramBody, this.onProudctDetailSuccess.bind(this),
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

    startGroupBuy(){


        if(!hasGotGbDetail)
       {
           return
       }

       AsyncStorage.setItem('k_cur_gbdetail', JSON.stringify(this.state.gbDetail)).then(function(){
                   console.log('save k_cur_gbdetail succ.')
               }.bind(this)).catch(function(error){
                 console.log('save k_cur_gbdetail faild.')
        }.bind(this));


       Global.gbDetail = this.state.gbDetail


        this.props.navigator.push({
           component: GroupBuyCar,
            props: {
                showBack:true,
               }
       })
    }

    renderProductDetailView() {
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
                    <Image
                        style={{height:375,width:this.state.toolsView.screenWidth}}
                        source={{uri: goods.goods.images[0].image}}
                        />
                    <Text style={{flex:1,color:'#1c1c1c',fontSize:18,margin:10}}>{goods.goods.name}</Text>
                    <View style={{alignItems:'center',flexDirection:'row',
                    justifyContent:'flex-start',margin:10,
                    flex:1}}>
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
                        <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:32,height:32,
              justifyContent:'center'}} source={{ uri: this.state.gbDetail.classify.icon }}/>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                            {this.state.gbDetail.classify.name}
                        </Text>
                        </View>
                        {/* {this.renderCategorysView(goodsRecommendItems)} */}
                        <View style={{backgroundColor:'#f2f2f2',height:10,flex:1,}}>
                        </View>

                        <Text style={{fontSize:18,color:'#757575',textAlign:'left',marginTop:20}}>
                            商品详情
                        </Text>

                        <Text style={{fontSize:16,color:'#1b1b1b',textAlign:'left',margin:10}}>
                                {this.state.gbDetail.classify.desc}
                                </Text>

                    {/* <HTMLView
                        value={htmlContent}
                        style={styles.container}
                      /> */}
                </View>
            </ScrollView>

            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}><CommitButton title={'开始拼团'} onPress = {this.startGroupBuy.bind(this)}></CommitButton></View>
            </View>
        );
    }

    renderCategorysView(prouductItems) {
        var width = this.state.toolsView.screenWidth;
        const w = width / 3 - 9, h = w

        let renderSwipeView = (types, n) => {
            return (
                <View style={this.state.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:5 }, styles.toolsItem]}>

                                    <Image style={{resizeMode:'contain', alignItems:'center',width: w-2, height: h,
                                    justifyContent:'center',margin:2,
                                    flex:1}} source={{uri: item.goods.images[0].image}}/>
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

});
