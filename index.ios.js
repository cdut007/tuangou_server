
/**
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Platform,
    View
} from 'react-native';
import MainView from './Main/MainView'

export default class Ilingo extends Component {


    render() {
        return(<MainView/>);
    }
     
}

AppRegistry.registerComponent('ilingo', () => Ilingo);





if(Platform.OS == 'web'){
  var app = document.createElement('div');
  document.body.appendChild(app);

  AppRegistry.runApplication('ilingo', {
    rootTag: app
  })
}
