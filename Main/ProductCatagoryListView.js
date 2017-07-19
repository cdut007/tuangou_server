import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ListView,
    AsyncStorage
} from 'react-native';



import GroupBuyCar from './GroupBuyCar'

import CommitButton from '../common/CommitButton'
import ProductDetail from './ProductDetail'
var Global = require('../common/globals');

var screenWidth=600
var rowStyle={
    screenWidth:600,
    justifyContent: 'center',
    padding: 1,
    margin: 5,
    width: 220,
    height: 220,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#CCC'
}

export default class ProductCatagoryListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            goods: { description: '' },
            dataSource: ds,
        }


    }

    static propTypes:{
        groupBuyDetail: PropTypes.object
    }


    onItemClick(prouduct) {

    }







    componentDidMount() {
        if(this.props.groupBuyDetail)
        {
            let rowData = this.props.groupBuyDetail.group_buy_goods

            if (rowData) {
                    console.log('rowData================'+JSON.stringify(rowData))
                    var dataBlob = [];
                    for (var ii = 0; ii < rowData.length; ii++) {
                      dataBlob.push(rowData[ii]);
                    }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(dataBlob)
                });
            }


        }else{
            console.log('no data found:')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderProductCategoryView()}
            </View>
        )
    }



    renderHeader(){
        return (<View style={styles.topView} >
            {/* {this.renderTopView()} */}
        </View>)
    }

    renderItem(item, sectionID, rowID){
        //write your own layout in list view
        let w = (screenWidth - 20) / 2
        return (<TouchableOpacity underlayColor="#dad9d7" style={rowStyle} onPress={this.onPress.bind(this,rowID,items)}>
            <View style={rowStyle}>

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

    onPress(index, item){
        // this.props.navigator.push({
        //     component: ProductDetail,
        //     props: {
        //         prouduct: item,
        //     }
        // })
    };

    bannerClickListener(index) {
        this.setState({
            clickTitle: this.banners[index].title ? `you click ${this.banners[index].title}` : 'this banner has no title',
        })
    }

    bannerOnMomentumScrollEnd(event, state) {
        this.defaultIndex = state.index;
    }

    renderTopView() {
        var image = ''
        if (this.props.groupBuyDetail) {
            image = this.props.groupBuyDetail.classify.image
        }
        this.banners = [
            {
                title: '',
                image: image
            }
        ];

        return (
            <Banner
                style={styles.topView}
                banners={this.banners}
                defaultIndex={this.defaultIndex}
                onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
                intent={this.bannerClickListener.bind(this)}
            />

        )
    }

    startGroupBuy() {

        AsyncStorage.setItem('k_cur_gbdetail', JSON.stringify(this.props.groupBuyDetail)).then(function(){
            console.log('save k_cur_gbdetail succ.')
                    }.bind(this)).catch(function(error){
                        console.log('save k_cur_gbdetail faild.' + error.message)
            }.bind(this));


        Global.gbDetail = this.props.groupBuyDetail

        this.props.navigator.push({
            component: GroupBuyCar,
            props: {
                showBack: true,
            }
        })
    }

    renderFooter()
    {
        return(<View style={{height: 49, width: screenWidth}}/>)
    }

    onViewLayout(layoutEvent) {
    var width = layoutEvent.nativeEvent.layout.width;
    if (width<=0) {
        return
    }

    screenWidth = layoutEvent.nativeEvent.layout.width
    this.setState({rowStyle:this.state.rowStyle });
    console.log(layoutEvent.nativeEvent.layout.width+'wwwwww=='+screenWidth)
    }

    renderProductCategoryView() {
        if(!this.state.dataSource){
          return(<View style={styles.container} onLayout={this.onViewLayout.bind(this)}>

              </View>)
        }

        return (
            <View style={[styles.container,{marginTop:50}]} onLayout={this.onViewLayout.bind(this)}>
            {/* <ListView
                renderHeader={this.renderHeader}
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                initialListSize={21}
                pageSize={10}
                scrollRenderAheadDistance={500}
                renderRow={this.renderItem}
                removeClippedSubviews={false}
                renderFooter={this.renderFooter}
            /> */}
                <View style={{
                alignSelf:'stretch',width:screenWidth,position: 'absolute', left: 0, right: 0, bottom: 0 ,}}><CommitButton title={'开始拼团'} onPress={this.startGroupBuy.bind(this)}></CommitButton></View>

            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
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
    list: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    topView: {
        height: 150,
        alignSelf:'stretch',
    },
    line1: {
        height: 1,
        backgroundColor: '#dadce2'
    },
    line10: {
        height: 10,
        backgroundColor: '#ebeef1'
    },
    textprimary: {
        fontSize: 18,
        color: '#4a4d52',
    },
    textsecond: {
        fontSize: 18,
        color: '#929aa2',
    },
    textPrice: {
        fontSize: 18,
        color: '#fb7e00',
    },
    marginTop10: {
        marginTop: 15,
    },
    paddingLeftRight: {
        paddingLeft: 10,
        paddingRight: 10,
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
    line: {
        height: 1,
        backgroundColor: '#eef0f3',
    },

});
