import React, { Component } from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';


import NavBar from '../common/NavBar'
import ProductCatagoryListView from './ProductCatagoryListView'
import HttpRequest from '../common/HttpRequest/HttpRequest'
 var Global = require('../common/globals');
var width = 600;

import ScrollableTabView from '../common/components/scrolltab/index'



export default class ProductCatagoryListViewTab extends Component {

    constructor(props){
        super(props)

            this.state = {
                index: 0,
                routes: [
                ],
                allGbDetail: {},
                gbList: {}
            };
        }

    clickBack() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.setState({
            product: this.props.prouduct,
        })

        let param = { classify: this.props.prouduct.index,agent_code:Global.agent_code }
        HttpRequest.get('/group_buy_list', param, this.onGroupBuyListSuccess.bind(this),
            (e) => {

                console.log(' error:' + e)
            })
    }

    onGroupBuyListSuccess(response) {
        var tabTitle = []
        for (var i = 0; i < response.data.group_buy.length; i++) {
            let item = response.data.group_buy[i]
            tabTitle.push({ key: '' + i, title: item.start_time })
        }
        this.setState({
            gbList: response.data,
            routes: tabTitle
        })

        if (response.data.group_buy.length) {
            var paramBody = { group_buy: response.data.group_buy[0].id ,agent_code:Global.agent_code}
            HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
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

    createProdcutCategoryList(gbDetail) {

        return (<View  style={[styles.container, { backgroundColor: '#ff4081' }]}
         tabLabel='No Data'
        >
            <ProductCatagoryListView groupBuyDetail= {gbDetail} navigator= {this.props.navigator}></ProductCatagoryListView>
        </View>)
    }

    onSenceItem() {
        var scence = {}
        this.state.routes.map((item, n) => {
            let index = Number(item.key)
            let key = this.state.gbList.group_buy[index].id
            let gbDetail = this.state.allGbDetail[key]
            scence[item.key] = this.createProdcutCategoryList(gbDetail)
        })

        return scence
    }





    renderTabView() {
         if (this.state.gbList.group_buy && this.state.gbList.group_buy.length) {

             <ScrollableTabView style={styles.container}>
             {this.createProdcutCategoryList({})}
             </ScrollableTabView>

         }
        else {
            return(<ScrollableTabView style={styles.container}>
            {this.createProdcutCategoryList({})}
            </ScrollableTabView>)
            //return (<View />)
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
    tabbar: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ffffff',
    },
    tab: {
        width: width / 2,
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
