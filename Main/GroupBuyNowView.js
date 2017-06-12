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


    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="拼团成功"
                    leftIcon={require('../images/back@2x.png')}
                    leftPress={this.back.bind(this)} />
                    <Text style={{fontSize:14,color:'#a9a9a9',padding:40,marginTop:20}}>该链接为团长：Lisa团长高优良品购的专属链接
每次申请拼团后直接分享该链接至微信群即可
团员点击链接购买的商品可在拼团中查看</Text>
                    <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:14,color:'#1c1c1c',padding:10,marginTop:40}}>https://pro.modao.cc/app/Fb0cbnqYMzpzDoqjdyO4QKreG44wH1s#screen=sB5D6183EED1496652452856</Text>
                    <View style={{flex:1,marginTop:60,justifyContent:'center',flexDirection:'row'}}>

                                        <TouchableOpacity style={{
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
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.onSharePress.bind(this)}
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
                                        </TouchableOpacity>
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
