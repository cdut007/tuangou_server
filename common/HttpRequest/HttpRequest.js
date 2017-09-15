import { AsyncStorage } from 'react-native';
var test = false;
//const apiAddr = 'http://www.ailinkgo.com:3000/api/v1'http://47.88.139.113:3001/api/v1
const apiAddr = test? 'http://www.ailinkgo.com:3000/api/v1':'http://www.ailinkgo.com:3000/api/v1';
var testHttpToken = 'eyJhbGciOiJIUzI1NiIsImV4cCI6MTU2MzI2NjQ0NywiaWF0IjoxNTAyNzg2NDQ3fQ.eyJpZCI6Nn0.m0KCl0VANnnITqQWRyL7xeYqnj-cBrpqvYAL1dk8p9w'
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
    console.log(count+'GET requesr param:' + param)
    if (count>0) {
        param = param.substr(0,param.length-1);
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

           if (test) {
               req.setRequestHeader("Authorization",testHttpToken);

           }else{
               req.setRequestHeader("Authorization", httpToken);
           }

      }else{
          if (test) {
              req.setRequestHeader("Authorization",testHttpToken);

          }
      }


      req.send()


  },
    put(apiName, body,successCallback, failCallback)
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



        console.log('PUT requesr:' + url+";param="+JSON.stringify(body))

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

        req.open('PUT', url,true)
        req.setRequestHeader("Content-Type","application/json");
        if (httpToken && httpToken.length) {
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }else{
                req.setRequestHeader("Authorization", httpToken);
            }
        }else{
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }
        }



        req.send(JSON.stringify(body))


    },
  delete(apiName, body,successCallback, failCallback)
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



      console.log('DELETE requesr:' + url+";param="+JSON.stringify(body))

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

        req.open('DELETE', url,true)
        req.setRequestHeader("Content-Type","application/json");
        if (httpToken && httpToken.length) {
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }else{
                req.setRequestHeader("Authorization", httpToken);
            }
        }else{
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }
        }



        req.send(JSON.stringify(body))


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
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }else{
                req.setRequestHeader("Authorization", httpToken);
            }
        }else{
            if (test) {
                req.setRequestHeader("Authorization",testHttpToken);

            }
        }



        req.send(JSON.stringify(body))


    }
}
