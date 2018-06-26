
import { getToken, removeToken, removeUserInfo } from "../config/utils";
import config from "../config/config";

var ApiServicePlugin = {};

ApiServicePlugin.install = function (Vue) {


  var fetch = (url, data, type) => {

    type = type.toUpperCase();

    return new Promise((resolve, reject) => {

      let dataStr = ''; //数据拼接字符串
      let sendData = {};

      Object.keys(data).forEach(key => {
        if (typeof (data[key]) == "object") {
          sendData = data[key];
        }
        else {
          dataStr += key + '=' + data[key] + '&';
        }
      })

      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        url = url + '?' + dataStr;
      }

      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject();
      }
      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Accept", "application/json");
      requestObj.setRequestHeader("Content-type", "application/json");
      requestObj.setRequestHeader("Authorization", "Bearer " + getToken());
      requestObj.send(JSON.stringify(sendData));

      requestObj.onreadystatechange = () => {

        if (requestObj.readyState == 4) {
          if(!requestObj.response){
            resolve(JSON.parse(requestObj.responseText));
            return;
          }
          let obj = requestObj.response;
          if (obj && typeof obj !== 'object') {
            obj = JSON.parse(obj);
          }
          if (requestObj.status == 200) {
            resolve(obj);
          } else if (requestObj.status == 401) {
            resolve({
              success: false,
              msg: "当前用户登录信息已过期！",
              data: null
            });
            setTimeout(()=>{
              removeToken();
              removeUserInfo();
              window.VueRootInstance.$children[0].$router.replace("/common/homepage");
            },200);
          } else {
            console.log(obj);
            reject(obj);
          }
        }
      }
    });
  };

  Vue.prototype.$commonService = {

    get: function (url, data) {

      url = config.commonBaseUrl + url;
      return fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      url = config.commonBaseUrl + url;
      return fetch(url, data, "POST", true);
    },
  }

  Vue.prototype.$shipperService = {

    get: function (url, data) {

      url = config.shipperBaseUrl + url;
      return fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      url = config.shipperBaseUrl + url;
      return fetch(url, data, "POST", true);
    },
  }

  Vue.prototype.$consignerService = {

    get: function (url, data) {

      url = config.consignerBaseUrl + url;
      return fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      url = config.consignerBaseUrl + url;
      return fetch(url, data, "POST", true);
    },
  }
  // TMS
  Vue.prototype.$tmsService = {

    get: function (url, data) {

      url = config.tmsBaseUrl + url;
      return fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      url = config.tmsBaseUrl + url;
      return fetch(url, data, "POST", true);
    },
  }
}

export default ApiServicePlugin;