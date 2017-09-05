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
import TabView from './TabView'
import NavBar from '../common/NavBar'

export default class GroupBuyNowView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()

}

        onCopyPress(){

        }

        onSharePress(){

        }

        onPressToMainPage(){
            this.props.navigator.resetTo({
                component: TabView,
                name: 'MainPage',

            })
        }
    render() {
        return (
            <View style={styles.container}>

                <NavBar
                    title="下单成功"
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />

                <Image style={{width:375,height:150}} source={require('../images/banner1@2x.png')}></Image>
                <TouchableOpacity  onPress={this.onPressToMainPage.bind(this)} style={{alignItems:'center'}} >
                    <Image style={{width:150,height:40,marginTop:30}} source={require('../images/btn1@2x.png')}>
                        <Text style={{fontSize:18,color:'#ffffff',justifyContent:'center',textAlign:'center',marginTop:10}}>返回首页</Text>
                    </Image>
                </TouchableOpacity>

                    <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:14,color:'#1c1c1c',padding:10,marginTop:40}}>点击右上方分享链接</Text>
                    <View style={{flex:1,marginTop:60,justifyContent:'center',flexDirection:'row'}}>

                        {/* <TouchableOpacity style={{
                         height: 36,
                         width: 120,
                         backgroundColor: '#6d9ee1',
                         borderRadius: 50,
                         borderColor:'#5590df',
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center',
                         }}
                         onPress={this.onCopyPress.bind(this)}
                         >
                         <Text style={{color:'#ffffff',fontSize:16}}>
                         复制链接
                         </Text>
                         </TouchableOpacity> */}

                        {/* <TouchableOpacity onPress={this.onSharePress.bind(this)}
                         style={{
                         height: 36,
                         width: 120,
                         marginLeft:60,
                         backgroundColor: '#8dc81b',
                         borderRadius: 50,
                         borderColor:'#7db909',
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center',
                         }}>
                         <Text style={{color:'#ffffff',fontSize:16}}
                         >
                         分享链接
                         </Text>
                         </TouchableOpacity> */}
                    </View>


            </View>
        )
    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
        backgroundColor: '#d40000',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
},
logoutText: {
    color: '#ffffff',
    fontSize: 18,
},
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
    },
    defaultText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemView:
    {
        alignSelf: 'stretch',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
