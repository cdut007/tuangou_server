/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 广告视图封装
 */
 /**
  * The examples provided by Facebook are for non-commercial testing and
  * evaluation purposes only.
  *
  * Facebook reserves all rights not expressly granted.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
  * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
  * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  *
  */
 'use strict';

 var React = require('react-native');
 var {
   Image,
   StyleSheet,
   Text,
   TouchableWithoutFeedback,
   TouchableOpacity,
   View,
   ViewPagerAndroid,
 } = React;

 var PAGES = 5;
 var BGCOLOR = ['#fdc08e', '#fff6b9', '#99d1b7', '#dde5fe', '#f79273'];
 var IMAGE_URIS = [
   'http://apod.nasa.gov/apod/image/1410/20141008tleBaldridge001h990.jpg',
   'http://apod.nasa.gov/apod/image/1409/volcanicpillar_vetter_960.jpg',
   'http://apod.nasa.gov/apod/image/1409/m27_snyder_960.jpg',
   'http://apod.nasa.gov/apod/image/1409/PupAmulti_rot0.jpg',
   'http://apod.nasa.gov/apod/image/1510/lunareclipse_27Sep_beletskycrop4.jpg',
 ];




 var HorizontalScrollView = React.createClass({
   statics: {
     title: '<ViewPagerAndroid>',
     description: 'Container that allows to flip left and right between child views.'
   },
   getInitialState: function() {
     return {page: 0, progress: {position: 0, offset: 0}};
   },
   onPageSelected: function(e) {
     this.setState({page: e.nativeEvent.position});
   },
   onPageScroll: function(e) {
     this.setState({progress: e.nativeEvent});
   },
   move: function(delta) {
     var page = this.state.page + delta;
     this.viewPager && this.viewPager.setPage(page);
     this.setState({page});
   },
   go: function(page) {
     this.viewPager && this.viewPager.setPage(page);
     this.setState({page});
   },
   render: function() {
     var pages = [];
     for (var i = 0; i < PAGES; i++) {
       var pageStyle = {
         backgroundColor: BGCOLOR[i % BGCOLOR.length],
         alignItems: 'center',
         padding: 20,
       };
       pages.push(
         <View key={i} style={pageStyle} collapsable={false}>
           <Image
             style={styles.image}
             source={{uri: IMAGE_URIS[i % BGCOLOR.length]}}
           />
        </View>
       );
     }
     var page = this.state.page;
     return (
       <View style={styles.container}>
         <ViewPagerAndroid
           style={styles.viewPager}
           initialPage={0}
           onPageScroll={this.onPageScroll}
           onPageSelected={this.onPageSelected}
           ref={viewPager => { this.viewPager = viewPager; }}>
           {pages}
         </ViewPagerAndroid>

       </View>
     );
   },
 });

 var styles = StyleSheet.create({
   buttons: {
     flexDirection: 'row',
     height: 30,
     backgroundColor: 'black',
     alignItems: 'center',
     justifyContent: 'space-between',
   },
   button: {
     flex: 1,
     margin: 5,
     borderColor: 'gray',
     borderWidth: 1,
     backgroundColor: 'gray',
   },
   buttonDisabled: {
     backgroundColor: 'black',
     opacity: 0.5,
   },
   buttonText: {
     color: 'white',
   },
   container: {
     flex: 1,
     height: 375,
     backgroundColor: 'white',
   },
   image: {
     width: 300,
     height: 375,
     padding: 20,
   },
   likeButton: {
     backgroundColor: 'rgba(0, 0, 0, 0.1)',
     borderColor: '#333333',
     borderWidth: 1,
     borderRadius: 5,
     flex: 1,
     margin: 8,
     padding: 8,
   },
   likeContainer: {
     flexDirection: 'row',
   },
   likesText: {
     flex: 1,
     fontSize: 18,
     alignSelf: 'center',
   },
   progressBarContainer: {
     height: 10,
     margin: 10,
     borderColor: '#eeeeee',
     borderWidth: 2,
   },
   progressBar: {
     alignSelf: 'flex-start',
     flex: 1,
     backgroundColor: '#eeeeee',
   },
   viewPager: {
     flex: 1,
   },
 });

 module.exports = HorizontalScrollView;
//
// import React, {Component} from 'react';
// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     Image,
//     ScrollView,
//     View
// } from 'react-native';
//
// var screenWidth = 600;
//
//
// var imageData = [
//     'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2263582212.jpg',
//     'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2265761240.jpg',
//     'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2266110047.jpg'
// ];
//
// class HorizontalScrollView extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {currentPage: 0};
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <ScrollView
//                     ref='scrollView'
//                     horizontal={true}
//                     showsHorizontalScrollIndicator={false}
//                     pagingEnabled={true}
//                     onMomentumScrollEnd={this.onAnimationEnd.bind(this)}
//                     >
//                     {this.renderImages()}
//                 </ScrollView>
//                 <View style={styles.pagingIndicatorStyle}>
//                     {this.renderPagingIndicator()}
//                 </View>
//             </View>
//
//         );
//     }
//
//
//     renderImages() {
//         let allImage = [];
//         for (let i = 0; i < imageData.length; i++) {
//             let item = imageData[i];
//             allImage.push(
//                 <Image key={i} source={{uri: item}} style={styles.imageStyle}/>
//             );
//         }
//         return allImage;
//     }
//
//     onAnimationEnd(e) {
//         console.log('onAnimationEnd====')
//         let offsetX = e.nativeEvent.contentOffset.x;
//         let pageIndex = Math.floor(offsetX / screenWidth);
//         this.setState({currentPage: pageIndex});
//     }
//
//     renderPagingIndicator() {
//         let indicatorArr = [];
//         let style;
//         for (let i = 0; i < imageData.length; i++) {
//             style = (i == this.state.currentPage) ? {color: 'orange'} : {color: 'white'};
//             indicatorArr.push(
//                 <Text key={i} style={[{fontSize: 30}, style]}>
//                     •
//                 </Text>
//             );
//         }
//         return indicatorArr;
//     }
//
// }
//
//
// const styles = StyleSheet.create({
//     container: {
//         height:375,
//         backgroundColor: '#ffffff'
//     },
//     scrollViewStyle: {
//         backgroundColor: 'yellow',
//     },
//
//     imageStyle: {
//         width: screenWidth,
//         height:375,
//     },
//
//     pagingIndicatorStyle: {
//         height:25,
//         width:screenWidth,
//         backgroundColor:'rgba(0,0,0,0.4)',
//         position:'absolute',
//         bottom:0,
//         flexDirection:'row',
//         alignItems:'center',
//         justifyContent: 'center',
//     }
//
// });
//
// export default HorizontalScrollView;
