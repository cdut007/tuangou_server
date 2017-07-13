import { AsyncStorage } from 'react-native';

const apiAddr = 'http://www.ailinkgo.com:3000/api/v1'
var httpToken = null
var Global = require('../globals');
var fetch = require('ReactJsonp');
module.exports = {
get(apiName, body,successCallback, failCallback)
{
    if(!httpToken)
    {
        httpToken = Global.token;
        AsyncStorage.getItem('k_http_token').then(function(result){
              if (result !== null){
                 httpToken = result
                 console.log('httpToken = '+httpToken)
              } else {
                console.log('get http token error:' + errs)
              }
            }.bind(this)).catch(function(error){
                //this._appendMessage('AsyncStorage error: ' + error.message);
            }.bind(this));




    }else{

    }

    var param = ""
    var url = apiAddr + apiName+'?format=json'
    var count = 0;
    for(var element in body){
        param += element + "=" + body[element] + "&";
        count++;
    }
    if (count>0) {
        url =  url+"&"+param;
    }


    console.log('GET requesr:' + url)

    const req = new XMLHttpRequest()


      req.onload = function () {
        try{

            var response = JSON.parse(req.response);
          console.log('result:' + req.response)

              if (response.message =='Success' || response.message =='success' ) {
                  successCallback(response);
              }else{
                  failCallback(req.response)
              }
        }catch(error){
            failCallback(error)
        }
      }

      req.ontimeout = function(e) {  console.log('result ontimeout') };
      req.onerror = function(e) {  console.log('result onerror'+e)
      failCallback(e)
        };
      req.timeout = 5000;
      req.open('GET', url,true)

      if (httpToken && httpToken.length) {
          req.setRequestHeader("Authorization", httpToken);
      }

      req.send()


  },

  post(apiName, body,successCallback, failCallback)
  {
      if(!httpToken)
      {
          httpToken = Global.token;
          AsyncStorage.getItem('k_http_token').then(function(result){
                if (result !== null){
                   httpToken = result
                   console.log('httpToken = '+httpToken)
                } else {
                  console.log('get http token error:' + errs)
                }
              }.bind(this)).catch(function(error){
                  //this._appendMessage('AsyncStorage error: ' + error.message);
              }.bind(this));




      }else{

      }

      var param = ""
      var url = apiAddr + apiName+'?format=json'
    


      console.log('POST requesr:' + url+";param="+JSON.stringify(body))

      const req = new XMLHttpRequest()


        req.onload = function () {
          try{

              var response = JSON.parse(req.response);
            console.log('result:' + req.response)

                if (response.message =='Success' || response.message =='success' ) {
                    successCallback(response);
                }else{
                    failCallback(req.response)
                }
          }catch(error){
              failCallback(error)
          }
        }

        req.ontimeout = function(e) {  console.log('result ontimeout') };
        req.onerror = function(e) {  console.log('result onerror'+e)
        failCallback(e)
          };
        req.timeout = 5000;

        req.open('POST', url,true)
        req.setRequestHeader("Content-Type","application/json");
        if (httpToken && httpToken.length) {
            req.setRequestHeader("Authorization", 'eyJhbGciOiJIUzI1NiIsImV4cCI6MTUwMDU0MTg3NCwiaWF0IjoxNDk5OTM3MDc0fQ.eyJpZCI6Nn0.C-O_p1vLWznfZH3lNX46b_Qt76d9Zl0NzAN6q1DQTgU');//httpToken);
        }

        req.send(JSON.stringify(body))


    }
}
