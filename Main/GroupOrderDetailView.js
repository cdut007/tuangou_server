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


import NavBar from '../common/NavBar'


export default class GroupOrderDetailView extends Component {
    constructor(props) {
        super(props)
        var title = "品质水果";

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

        }
    }


    clickBack() {
     this.props.navigator.pop()
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

    onItemClick(prouductItems){

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
         var categoryDataAry = [];
         var displayCategoryAry = [];

         var toolsData = [
             {
                 'index': 0,
                 'title': '稍后通知',
                 'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
             }, {
                  'index': 0,
                  'title': '稍后通知',
                  'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
              }, {
                   'index': 0,
                   'title': '稍后通知',
                   'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
               }, {
                    'index': 0,
                    'title': '稍后通知',
                    'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
                }, {
                     'index': 0,
                     'title': '稍后通知',
                     'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
                 },


         ]

         categoryDataAry.push({id:'meat',name:'品质水果','image': require('../images/fruit_type@2x.png'),prouductItems:toolsData,countdown:'48:38:29'},);
         categoryDataAry.push({id:'meat',name:'绿色生鲜','image': require('../images/fresh_type@2x.png'),prouductItems:toolsData,countdown:'48:38:29'},);
            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:0}}>

                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}

                        </View>
            );
            }
            return displayCategoryAry;
    }

    renderItemInfo(item,w,h){
        if (item.tag!='total_count') {
            return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'center',paddingLeft:20,paddingRight:10,flexDirection: "row",backgroundColor:'#f7f7f7',
            flex:1}}>


                <View style={{
                flex:2}}>
                <Image style={{resizeMode:'contain', alignItems:'center',width: 80, height: 80,
                justifyContent:'center',}} source={item.image}/>
                </View>
                <View style={{
                height:h,
                alignItems:'flex-start',
                flex:6}}>
                <Text style={{marginLeft:30,marginTop:10,numberOfLines:2,ellipsizeMode:'tail',fontSize: 14, color: "#1c1c1c",}}>越南芒果</Text>
                <Text style={{marginLeft:30,alignItems:'center',justifyContent:'center',fontSize: 12, color: "#757575",}}>每个约350g</Text>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:30,paddingBottom:10,position:'absolute',left:0,right:0,bottom:0}}>
                <Text style={{alignItems:'center',justifyContent:'center',fontSize: 16, color: "#fb7210",}}>S$ 8.00</Text>
                <Text style={{alignItems:'center',textAlign:'right',flex:9,justifyContent:'center',fontSize: 12, color: "#757575",}}>已购 230</Text>
                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {
        const w = width , h = 110
        var width = this.state.mainStyle.screenWidth;
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:0 }, styles.toolsItem]}>
                                     {this.renderItemInfo(item,w,h)}
                                </View>
                            )
                            return (

                                    <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(prouductItems) }}>{render}</TouchableOpacity>

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
