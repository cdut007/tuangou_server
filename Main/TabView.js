import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    TabBarIOS,
} from 'react-native';


// import HomeView from './HomeView';
// import GroupBuyCar from './GroupBuyCar';
import MineView from './MineView';


export default class TabView extends Component
{
   
     constructor(props)
    {
        super(props)
        this.state={
            selectedTab: 'tab1'
        }
    }


    componentWillMount(){
        var me = this;
   
    }


      componentWillUnmount() {
            }

    render()
    {
        return (
            <TabBarIOS 
            tintColor="#ea6b10" 
            >
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'tab1'}
                    title="爱邻购"
                    icon={require('../images/home_icon@2x.png')}
                    selectedIcon={require('../images/home_icon_click@2x.png')}
                    badgeText=""
                    onPress={() => this.setState({ selectedTab: 'tab1' })}>
                    {this.rendContent('tab1')}
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'tab2'}
                    title="拼团车"
                    icon={require('../images/shoppingcart_icon@2x.png')}
                    selectedIcon={require('../images/shoppingcart_icon_click@2x.png')}
                    onPress={() => this.setState({ selectedTab: 'tab2' })}>
                    {this.rendContent('tab2')}
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected={this.state.selectedTab === 'tab3'}
                    title="团长"
                    icon={require('../images/me_icon@2x.png')}
                    selectedIcon={require('../images/me_icon_click@2x.png')}
                    onPress={() => this.setState({ selectedTab: 'tab3' })}>
                    {this.rendContent('tab3')}
                </TabBarIOS.Item>
            </TabBarIOS>

        )
    }

    rendContent(tab){
        //return(<View></View>);
       return (<MineView {...this.props}/>)
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tabBarTintColor: {

      color: '#ea6b10'
    },

});