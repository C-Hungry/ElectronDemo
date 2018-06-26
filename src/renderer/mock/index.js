import Mock from 'mockjs';

Mock.setup({
  timeout: '200-600'
})

Mock.mock(/http:\/\/192\.168\.1\.254:9003\/system\/getSystemDic/,{
  "data|1-10": [
    {
      "typeCode": /[1-9][0-9]*/,
      "typeValue": /[a-zA-Z0-9]+/
    }
  ],
  "msg": /[a-zA-Z0-9]+/,
  "success": true,
  "total": 0
});

Mock.mock("http://192.168.1.254:9002/goodsSource/viewGoodsSourceForPc",{
  "data|8": [{
      "applyResultStr": /[a-zA-Z0-9]+/,
      "carTypeStr": /[a-zA-Z0-9]+/,
      "carTypeValueStr": /[a-zA-Z0-9]+/,
      "createTime": /[a-zA-Z0-9]+/,
      "createUserId": 0,
      "distance": /[1-9][0-9]+/,
      "freight": /[a-zA-Z0-9]+/,
      "getCity": /[a-zA-Z0-9]+/,
      "getCityName": /[a-zA-Z0-9]+/,
      "getCounty": /[a-zA-Z0-9]+/,
      "getCountyName": /[a-zA-Z0-9]+/,
      "getLocalDesc": /[a-zA-Z0-9]+/,
      "getProvince": /[a-zA-Z0-9]+/,
      "getProvinceName": /[a-zA-Z0-9]+/,
      "goodsDesc": /[a-zA-Z0-9]+/,
      "goodsNum": 0,
      "goodsPrice": /[1-9][0-9]{0,2}/,
      "goodsSourceStage": /[a-zA-Z0-9]+/,
      "goodsSourceStageName": /[a-zA-Z0-9]+/,
      "goodsTelephone": /[a-zA-Z0-9]+/,
      "goodsType": /[a-zA-Z0-9]+/,
      "goodsTypeName": /[a-zA-Z0-9]+/,
      "goodsUserName": /[a-zA-Z0-9]+/,
      "id|+1": 0,
      "isATax": 0,
      "isNeedEquipment": 0,
      "listGoodsExts": [
        {
          "carType": /[a-zA-Z0-9]+/,
          "goodsId": 0,
          "id": 0
        }
      ],
      "loadEndTime|1": ["2018-05-15 00:00:00","2018-05-30 00:00:00","2018-04-30 00:00:00"],
      "loadStartTime|1": "@datetime",
      "sendCity": /[a-zA-Z0-9]+/,
      "sendCityName": /[a-zA-Z0-9]+/,
      "sendCounty": /[a-zA-Z0-9]+/,
      "sendCountyName": /[a-zA-Z0-9]+/,
      "sendLocalDesc": /[a-zA-Z0-9]+/,
      "sendProvince": /[a-zA-Z0-9]+/,
      "sendProvinceName": /[a-zA-Z0-9]+/,
      "transportPrice": /[a-zA-Z0-9]+/
    }
  ],
  "msg": /[a-zA-Z0-9]+/,
  "success": true,
  "total": 16
});

Mock.mock(/http:\/\/192\.168\.1\.254:9002\/order\/insert/,{
  "data": true,
  "msg": "string",
  "success": true,
  "total": 0
});