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
    AsyncStorage,

} from 'react-native';
//import Banner from 'react-native-banner';
 import NavBar from '../common/NavBar';
 import ProductCatagoryListViewTab from './ProductCatagoryListViewTab'
 import ProductCatagoryListView from './ProductCatagoryListView'
 import ProductDetail from './ProductDetail'
 import CircleImage from '../common/CircleImage';
 import HttpRequest from '../common/HttpRequest/HttpRequest'
 var Global = require('../common/globals');

import AddressView from './AddressView'
export default class HomeView extends Component {
    constructor(props) {
        super(props)
        this.state={
            scrollContainerStyle:{
                height:1000,alignSelf:'stretch',
            },
            toolsView: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: 'center',
                alignItems: 'center',
                screenWidth:600,
            },

            goodsList:[],
            agent:{},
        }
    }

    componentWillMount(){
        console.log('componentWillMount1')
        if (Global.agent != null){
            this.fetchProductList();
            console.log('componentWillMount2')
        }else {
            console.log('componentWillMount3')
            this.fetchAgentInfo();
            this.fetchProductList();

        }


    }
    componentDidMount() {
        this.getUserInfo()
    }

    onProudctListSuccess(response){
        console.log(' onProudctListSuccess:' + JSON.stringify(response))
        this.state.goodsList = response.data;
        this.setState({goodsList:this.state.goodsList});
    }

    onUserInfoSuccess(response){
        console.log(' onUserInfoSuccess:' + JSON.stringify(response))
        this.state.agent = response.data.user_profile;
        Global.agent = response.data.user_profile;
        this.setState({agent:this.state.agent});
        HttpRequest.get('/user_address', {}, this.onGetAddressSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)

            })

    }
    onGetAddressSuccess(response) {
        console.log('onGetAddressSuccess113:'+JSON.stringify(response))
        if (response.message == 'The user has no address'){
            Global.user_address = ''
        }else {
            Global.user_address = response.data.user_address
        }



    }

    fetchAgentInfo(){
        console.log('agent_code:'+Global.agent_code)
       var paramBody ={agent_code:Global.agent_code }
       HttpRequest.get('/agent_info', paramBody, this.onUserInfoSuccess.bind(this),
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

    fetchProductList(){
        var paramBody ={agent_code:Global.agent_code }
        HttpRequest.get('/agent_home_page_list', paramBody, this.onProudctListSuccess.bind(this),
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

                console.log(' agent_home_page_list error:' + e)
            })
    }

    onViewLayout(layoutEvent) {
    var height = layoutEvent.nativeEvent.layout.height;
    if (height<=0) {
        return
    }
    this.state.scrollContainerStyle.height = height - 60;
    this.state.toolsView.screenWidth = layoutEvent.nativeEvent.layout.width
    this.setState({scrollContainerStyle:this.state.scrollContainerStyle,toolsView:this.state.toolsView});
  }

    render() {
        console.log('received view layout layoutHeight\n', this.state.scrollContainerStyle.height);
        return (
            <View style={styles.container}  onLayout={this.onViewLayout.bind(this)}>
                {/* <NavBar title="爱邻购" /> */}

                <View
                style={this.state.scrollContainerStyle}>
                <ScrollView

                automaticallyAdjustContentInsets={false}
                scrollEventThrottle={200}>
                {this.renderTopView()}

                {this.renderProductCategoryView()}

                </ScrollView>
                </View>



            </View>
        )
    }



     bannerClickListener(index) {
     this.setState({
             clickTitle: this.banners[index].title ? `you click ${this.banners[index].title}` : 'this banner has no title',
         })
     }

     bannerOnMomentumScrollEnd(event, state) {
         console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`);
         this.defaultIndex = state.index;
     }
    onAnnounceNow() {
        // this.props.navigator.push({
        //     component: NotifyNowView,
        //
        // })
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
    onUserInfoSucc(response){
        Global.wxUserInfo = response.data.user_profile;
        console.log('Global.wxUserInfo:'+JSON.stringify(Global.wxUserInfo))
        AsyncStorage.setItem('k_login_info', JSON.stringify(Global.wxUserInfo)).then(function(){
            console.log('save k_login_info succ.')

        }.bind(this)).catch(function(error){
            console.log('save k_login_info faild.' + error.message)
        }.bind(this));


    }
    renderTopView() {
        var nickname = '加载中'
        if (Global.agent != null) {
            nickname = Global.agent.nickname
        }else {

        }


        return (
            <View style={[styles.headView,]}>
              <View style={{alignSelf:'stretch',}}>

               <View style={{height:180,position: 'absolute', left: 0, right: 0}}>
               <Image style={{height:180,resizeMode:'contain'}}
                      source={require('../images/me_bj.jpg')}
                />
              </View>

              </View>


                <View>
                <CircleImage
                  imageStyle={[styles.logo,{'border-radius':'50%'}]}
                  src={this._displayIcon() }
                  />
                </View>

              <View style={styles.centerLayout}>
                  <Text style={styles.defaultText}>{nickname}</Text>
              </View>
            </View>

        )


    }

    _displayIcon() {
    if (Global.agent != null) {
            return {uri: Global.agent.headimgurl};
        } else {
                return require('../images/default_head@2x.png');
            }
        }

    onItemClick(prouduct){
         if (prouduct.tag != 'scan_more') {
             this.props.navigator.push({
                component: ProductDetail,
                 props: {
                     prouduct:prouduct,
                    }
            })
        }else{
        //     this.props.navigator.push({
        //        component: ProductCatagoryListView,
        //         props: {
        //             groupBuyDetail:
        //             prouduct:prouduct,
        //            }
        //    })

            this.props.navigator.push({
               component: ProductCatagoryListViewTab,
                props: {
                    prouduct:prouduct,
                   }
           })
        }
    }

    renderItemSpaceLine(index){
        if (index == 0) {
            return
        }
        return (<View style={{backgroundColor:"#f2f2f2",height:10,flex:1}}></View>)
    }

    renderProductCategoryView() {

        var categoryDataAry = [];
        var displayCategoryAry = [];

           for (var i = 0; i < this.state.goodsList.length; i++) {
               var goods = this.state.goodsList[i].goods
               var classify = this.state.goodsList[i].classify
               var goodsMaxLengh = goods.length > 6 ? 6: goods.length;
               var toolsData = [];
               for (var j = 0; j < goodsMaxLengh; j++) {
                   var product = goods[j]
                   if (j == goodsMaxLengh -1 ) {
                       toolsData.push({
                           'index': product.goods_id,
                           'image': {uri:product.image},
                            'title':'前往购买',
                           'tag': 'scan_more',
                           'name':classify.name,
                           'classify_id':classify.id,
                           'classify_desc':classify.desc,
                       });
                   }else{
                       toolsData.push({
                           'index': product.goods_id,
                           'image': {uri:product.image},
                       });
                   }
               }
               console.log(goodsMaxLengh+ ' toolsData max length === '+toolsData.length+";type name"+ classify.name);

               categoryDataAry.push({id:classify.id,name:classify.name,image:{uri:classify.icon} ,desc:classify.desc ,prouductItems:toolsData,countdown:'48:38:29'},);

           }


            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View>
                        {this.renderItemSpaceLine(i)}
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:30,height:30,
                  justifyContent:'center'}} source={categoryDataAry[i].image}/>
                            <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                            </View>
                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}
                        <View style = {{flex:1,justifyContent:'flex-start',alignItems: 'flex-start',marginLeft:5}}>
                            <View onPress={this.onAnnounceNow.bind(this)}
                                  style={styles.countdownContainer}>
                                <Text style={styles.countdownText} >
                                    {categoryDataAry[i].desc}
                                </Text>
                            </View>
                        </View>
                        </View>
                        </View>
            );
            }
            if (categoryDataAry.length>3) {
                displayCategoryAry.push(<View style={{color:'#686868',backgroundColor:'#f2f2f2',height:54,flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'#686868',backgroundColor:'#f2f2f2',textAlign:'center',justifyContent:'center',alignItems:'center'}}>拉不动了...</Text>
                </View>);
            }
            return displayCategoryAry;
    }

    renderMoreInfo(item,w,h){
        if (item.tag!='scan_more') {
            return
        }
        return(<View style={{opacity:0.8, position:'absolute',left:0,top:0,alignItems:'center',flex:1,width: w, height: h ,
        justifyContent:'center',backgroundColor:'#ea6b10',marginRight:2}}
        needsOffscreenAlphaCompositing={true}
        >
        <Text  numberOfLines={2} needsOffscreenAlphaCompositing={true} style={{opacity:1,alignItems:'center',justifyContent:'center',fontSize: 18, color: "#ffffff",fontFamily:'PingFang-SC-Medium'}}>{item.title}</Text>
        </View>)
    }

    renderCategorysView(prouductItems) {
        var width = this.state.toolsView.screenWidth;
        console.log('received view layout width\n', width);
        const w = (width - 30)/3, h = w

        let renderSwipeView = (types, n) => {
            return (
                <View style={this.state.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,}, styles.toolsItem]}>

                                    <Image style={{resizeMode:'cover', alignItems:'center',width: w-2, height: h,
                                    justifyContent:'center',margin:2,
                                    flex:1}} source={item.image}/>
                                     {this.renderMoreInfo(item,w,h)}
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
    countdownContainer:
    {
        marginTop: 20,
        marginBottom:20,
        height: 32,
        marginLeft:5,
        marginRight:5,
        paddingLeft:5,
        paddingRight:5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'flex-start',

    },

    countdownText:{
        color: 'black',
        fontSize:16,
        fontFamily:'PingFangSC-Regular',
        textAlign:'left',
    },
    brandLabelContainer:
    {   marginTop:5,
        marginBottom:5,
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
    logo: {
        width: 80,
        height: 80,
        marginTop: 30,
        alignSelf: 'center',
    },
    centerLayout:{
          justifyContent:'center',
          alignItems:'center',
        },
    headView: {
            height: 180,
            backgroundColor: '#ffffff',
        },
        defaultText:{
                marginTop:10,
                color: '#ffffff',
                fontSize:16,
                justifyContent: "center",
                alignItems: 'center',
        },
});
