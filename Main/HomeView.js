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
//import Banner from 'react-native-banner';
 import NavBar from '../common/NavBar';
// import ProductCatagoryListViewTab from './ProductCatagoryListViewTab'
 import ProductDetail from './ProductDetail'
 import CircleImage from '../common/CircleImage';


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


        }
    }

    onAnnounceNow() {
        // this.props.navigator.push({
        //     component: NotifyNowView,
        //
        // })
    }

    onViewLayout(layoutEvent) {
    var height = layoutEvent.nativeEvent.layout.height;
    if (height<=0) {
        return
    }
    this.state.scrollContainerStyle.height = height - 100;
    this.state.toolsView.screenWidth = layoutEvent.nativeEvent.layout.width
    this.setState({scrollContainerStyle:this.state.scrollContainerStyle,toolsView:this.state.toolsView});
  }

    render() {
        console.log('received view layout layoutHeight\n', this.state.scrollContainerStyle.height);
        return (
            <View style={styles.container}  onLayout={this.onViewLayout.bind(this)}>
                <NavBar title="爱邻购" />
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

    renderTopView() {


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
                  imageStyle={styles.logo}
                  src={this._displayIcon() }
                  />
                </View>

              <View style={styles.centerLayout}>
                  <Text style={styles.defaultText}>Lisa团长高优良品购</Text>
              </View>
            </View>

        )


    }

    _displayIcon() {
        return require('../images/default_head@2x.png');
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

         var toolsData = [
             {
                 'index': 0,
                 'title': '稍后通知',
                 'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
             },
             {
                 'index': 1,
                 'title': '通知成功',
                 'image': {uri:'http://www.lyqixuantang.com/upload/image/20151202/1449045717253254.jpg'}
             },
             {
                 'index': 2,
                 'title': '再次通知',
                 'image': {uri:'http://images.meishij.net/p/20120905/d3c961321d94bcfa08b33fc99b754874.jpg'}
             },
             {
                 'index': 3,
                 'title': '拍照寄存',
                 'image': {uri:'http://img.shelive.net/201608/ba70006454058984a1a.jpg'}
             },
             {
                 'index': 4,
                 'title': '发送失败',
                 'image': {uri:'http://photocdn.sohu.com/20151019/mp36482548_1445239748270_2_th_fv23.jpeg'}
             },
             {
                 'index': 5,
                 'title': '更多精选',
                 'image': {uri:'http://image82.360doc.com/DownloadImg/2015/02/2022/50345829_1.jpg'},
                 'tag': 'scan_more'
             }
         ]

          categoryDataAry.push({id:'meat',name:'品质水果','image': require('../images/fruit_type@2x.png'),prouductItems:toolsData,countdown:'48:38:29'},);
          categoryDataAry.push({id:'meat',name:'绿色生鲜','image': require('../images/fresh_type@2x.png'),prouductItems:toolsData,countdown:'48:38:29'},);
          categoryDataAry.push({id:'meat',name:'有机蔬菜','image': require('../images/vegetable_type@2x.png'),prouductItems:toolsData,countdown:'48:38:29'},);

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
                        <View style = {{flex:1,justifyContent:'flex-end',alignItems: 'flex-end',marginRight:5}}>
                        <View onPress={this.onAnnounceNow.bind(this)}
                            style={styles.countdownContainer}>
                            <Text style={styles.countdownText} >
                                截团倒计时{categoryDataAry[i].countdown}
                            </Text>
                        </View>
                        </View>
                        </View>
                        </View>
            );
            }
            displayCategoryAry.push(<View style={{color:'#686868',backgroundColor:'#f2f2f2',height:54,flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:12,color:'#686868',backgroundColor:'#f2f2f2',textAlign:'center',justifyContent:'center',alignItems:'center'}}>拉不动了...</Text>
            </View>);
            return displayCategoryAry;
    }

    renderMoreInfo(item,w,h){
        if (item.tag!='scan_more') {
            return
        }
        return(<View style={{opacity:0.4, position:'absolute',left:0,top:0,alignItems:'center',flex:1,width: w, height: h ,
        justifyContent:'center',backgroundColor:'#999999'}}
        needsOffscreenAlphaCompositing={true}
        >
        <Text needsOffscreenAlphaCompositing={true} style={{opacity:1,alignItems:'center',justifyContent:'center',fontSize: 14, color: "#ffffff",}}>{item.title}</Text>
        </View>)
    }

    renderCategorysView(prouductItems) {
        var width = this.state.toolsView.screenWidth;
        console.log('received view layout width\n', width);
        const w = width / 3 - 9, h = w

        let renderSwipeView = (types, n) => {
            return (
                <View style={this.state.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:0 }, styles.toolsItem]}>

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
        marginTop: 10,
        marginBottom:20,
        height: 32,
        borderColor: '#e31515',
        borderWidth:1,
        borderRadius: 5,
        paddingLeft:5,
        paddingRight:5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    },

    countdownText:{
            color: '#e31515',
            fontSize:14,
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
