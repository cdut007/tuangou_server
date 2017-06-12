/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image
} from 'react-native'

export default class NavBar extends Component{
    static propTypes:{
        title: PropTypes.string,
        leftIcon: PropTypes.any,
        rightIcon: PropTypes.any,
        rightTitle: PropTypes.string,
        leftTitle:PropTypes.string,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        style: PropTypes.object,
    }
     topbarHeight : 44
    renderBtn(pos){
      let render = (obj) => {
        const { name, onPress } = obj

          if (pos=="left" && this.props.leftIcon || pos == 'right' && this.props.rightIcon) {
              if(Platform.OS === 'android'){
              return (
                <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
                  <Image source={name} style={{width: 26, height: 26,resizeMode:'contain'}}/>
                </TouchableNativeFeedback>
              )
            }else{
              return (
                <TouchableOpacity onPress={onPress} style={styles.btn}>
                  <Image source={name} style={{width: 26, height: 26,resizeMode:'contain'}}/>
                </TouchableOpacity>
              )
            }
        }else{
            if(Platform.OS === 'android'){
            return (
              <TouchableNativeFeedback onPress={onPress} >
                <Text style={styles.btnLabel}>{name}</Text>
              </TouchableNativeFeedback>
            )
          }else{
            return (
              <TouchableOpacity onPress={onPress} style={styles.btnLabel}>
                <Text style={styles.btnLabel}>{name}</Text>
              </TouchableOpacity>
            )
          }
        }
      }
      if(pos == "left"){
        if(this.props.leftIcon){
          return render({
            name: this.props.leftIcon,
            onPress: this.props.leftPress
          })
      } else if (this.props.leftTitle) {
            return render({
              name: this.props.leftTitle,
              onPress: this.props.leftPress
            })
        }else{
          return (<View style={styles.btn}></View>)
        }
      }else if(pos == "right"){
        if(this.props.rightIcon){
          return render({
            name: this.props.rightIcon,
            onPress: this.props.rightPress
          })
      } else if (this.props.rightTitle) {
          return render({
            name: this.props.rightTitle,
            onPress: this.props.rightPress
          })
      }else{
          return (<View style={styles.btn}></View>)
        }
      }
    }
    render(){
        return(
            <View style={{alignSelf: 'stretch',}}>

            <View style={[styles.topbar, this.props.style]}>
                {this.renderBtn("left")}
                <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                {this.renderBtn("right")}
            </View>
            <View style={{height:0.5,alignSelf:'stretch',backgroundColor:'#d6d6d6'}}>
            </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    topbar: {
        alignSelf: 'stretch',
        height: NavBar.topbarHeight,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: 10
    },
    btn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnLabel: {
      color: "#ea6b10",
      fontSize: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title:{
        color: "#1b1b1b",
        fontSize: 18,
        marginLeft: 5,
    }
});
