import React, { Component } from 'react';
import { View, StyleSheet,ScrollView,ListView,AsyncStorage,TouchableOpacity,Image,Text,SegmentedControlIOS } from 'react-native';


import NavBar from '../common/NavBar'
import ProductCatagoryListView from './ProductCatagoryListView'
import HttpRequest from '../common/HttpRequest/HttpRequest'
 var Global = require('../common/globals');
var screenWidth = 600,screenHeight=1000;
import CommitButton from '../common/CommitButton'
import ScrollableTabView from '../common/components/scrolltab/index'
 import ProductDetail from './ProductDetail'

import GroupBuyCar from './GroupBuyCar'

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
                selectedIndex:0,
            };
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

                console.log(' error:' + e)
            })
    }

    onGroupBuyListSuccess(response) {
        if (!response.data) {
            console.log(' no data found')
            return
        }
        var titles=[]
        for (var i = 0; i < response.data.group_buy.length; i++) {
            var item = response.data.group_buy[i]
            titles.push('截团时间 '+item.end_time)
        }

        this.setState({
            values:titles,
            gbList: response.data,
            routes: response.data.group_buy
        })

        if (response.data.group_buy.length) {
            var paramBody = { group_buy: response.data.group_buy[0].id ,agent_code:Global.agent_code}
            HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
                (e) => {
                    console.log('group_buy_detail error:' + e)
                })
        }

    }


    onGroupBuyDetailSuccess(response) {
        let gbData = this.state.allGbDetail
        gbData[response.data.id] = response.data

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
    this.setState({rowStyle:this.state.rowStyle });
    console.log(layoutEvent.nativeEvent.layout.width+'wwwwww=='+screenWidth)
    }

    renderItem(item, sectionID, rowID){
        //write your own layout in list view
        let w = (screenWidth - 60) / 2
        console.log(JSON.stringify(item)+'itemitemitemitem=='+rowID)

        return (<TouchableOpacity underlayColor="#dad9d7" style={[{
            screenWidth:screenWidth,
            justifyContent: 'center',
            padding: 1,
            margin: 5,
            width: w,
            height: 220,
            backgroundColor: '#F6F6F6',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 2,
            borderColor: '#CCC'
        }]} onPress={this.onItemPress.bind(this,rowID,item)}>
            <View >

                <Image style={{
                    resizeMode: 'contain', alignItems: 'center',
                    justifyContent: 'center', width: w - 2,
                    backgroundColor: '#ffffff',
                    flex: 4
                }}
                    source={{ uri: item.goods.images[0].image }}
                />
                <View style={{ backgroundColor: '#fdf3ec', flex: 2 }}>
                    <Text style={{
                        alignItems: 'center', fontSize: 14,
                        color: '#1c1c1c',
                        justifyContent: 'center', margin: 2, numberOfLines: 2, ellipsizeMode: 'tail',
                        flex: 1
                    }}>{item.goods.name}</Text>

                    <View style={{
                        alignItems: 'center', flexDirection: 'row',
                        justifyContent: 'center',
                        flex: 1
                    }}>
                        <Text style={{ alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start', numberOfLines: 1, color: '#e31515', fontSize: 20, }}>S$ {item.price}</Text>
                        <Text style={{
                            alignItems: 'center', marginLeft: 10,
                            justifyContent: 'center', numberOfLines: 1, color: '#757575', fontSize: 12
                        }}>{item.brief_dec}</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
        )
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


    renderProductCategoryView(groupBuyDetail ,title) {

        let rowData = groupBuyDetail.group_buy_goods

        if (rowData) {
                console.log('rowData================'+JSON.stringify(rowData))

            this.state.dataSource = this.state.dataSource.cloneWithRows(rowData)

        }

        if(!this.state.dataSource){
          return(<View tabLabel={title} style={styles.container}>

              </View>)
        }

        return (
            <View  style={[styles.list_container,{height:screenHeight}]}>
            <View style={[styles.list_container,{marginTop:0}]}>
            <ListView
                contentContainerStyle={styles.list}
                style={[styles.listview_container,{marginBottom:50}]}
                dataSource={this.state.dataSource}
                initialListSize={21}
                pageSize={3}
                keyboardShouldPersistTaps={true}
                 automaticallyAdjustContentInsets={false}
                 keyboardDismissMode="on-drag"
                scrollRenderAheadDistance={500}
                renderRow={this.renderItem.bind(this)}
            />
                <View style={{
                alignSelf:'stretch',width:screenWidth,position: 'absolute', left: 0, right: 0, bottom: 0 }}><CommitButton title={'开始拼团'} onPress={this.startGroupBuy.bind(this,groupBuyDetail)}></CommitButton></View>

            </View>
            </View>
        );
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
        return(this.createProdcutCategoryList(gbDetail,item.end_time))


        // var displayCategoryAry = []
        // for (var i = 0; i < this.state.routes.length; i++) {
        //     var item = this.state.routes[i]
        //     let key = item.id
        //     let gbDetail = this.state.allGbDetail[key]
        //     displayCategoryAry.push(this.createProdcutCategoryList(gbDetail,item.end_time))
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

      console.log("value=="+event.nativeEvent.selectedSegmentIndex);
     this.onSenceItem(event.nativeEvent.selectedSegmentIndex)
    }

    _onValueChange(value) {
        console.log("value=="+value);

      this.setState({
        value: value,
      });


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
        flexDirection: 'row',
        alignSelf:'stretch',
        flexWrap: 'wrap',
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
});
