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
        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs)
            {
                alert('http token=='+httpToken)
                httpToken = result
                console.log('httpToken = '+httpToken)
            }
            else
            {
                console.log('get http token error:' + errs)
            }
        });



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


    console.log('Get requesr:' + url)

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

    // fetch(url, {
    //     mode:'no-cors',
    //     headers:{'Access-Control-Allow-Origin': '*',},
    //     method: 'GET',})
    //  .then((response) => {response.text()
    // console.log("responseText:"+response.status);
    // console.log("responsejson:"+JSON.stringify(response));
    //  })
    //   .then((responseText) => {
    //     console.log("responseText11:"+responseText);
    //     var response = JSON.parse(responseText);
    //     if (response.message =='success') {
    //         successCallback(response);
    //     }else{
    //         failCallback(responseText)
    //     }
    //
    //   })
    //   .catch(function(err){
    //     failCallback(err);
    //   });

  },

post(apiName, body,successCallback, failCallback)
  {
    if(!httpToken.length)
    {
        httpToken = Global.token;

        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs)
            {
                httpToken = result
                console.log('httpToken = '+httpToken)
            }
            else
            {
                console.log('get http token error:' + errs)
            }
        });
    }

    var url = apiAddr + apiName
    try {
        console.log('Post requesr:' + url +":[param body]="+JSON.stringify(body))
    } catch (e) {

    } finally {

    }

    if (httpToken == null) httpToken = ''
    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + httpToken
        }),
        body: JSON.stringify(body)})
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        var response = JSON.parse(responseText);
        if (response.code == 200 || response.access_token || response.id) {
            successCallback(response);
        }else{
            failCallback(responseText)
        }

      })
      .catch(function(err){
        failCallback(err);
      });
  }
}
