<style lang="less" scoped>
  .form {
    padding-right: 30px;
  }
</style>

<template>
  <div>
   <Modal v-model="isShow" width="600" title="发布货源">
    <div class="form">
      <Form ref="sourceForm" :rules="formValidate" :model="formData" :label-width="120">
        <FormItem label="发货地：" prop="sendLocalDesc">
          <Input v-model="formData.sendLocalDesc" @on-focus="onSelectPosition('sendPlace')" placeholder="请输入发货详细地址"></Input>
        </FormItem>
        <FormItem v-if="formData.sendAdditionalRemark" label="发货地补充说明：" prop="fullSendAddress">
          <Input v-model="formData.sendAdditionalRemark" placeholder="请输入（非必填）" disabled></Input>
        </FormItem>
        <FormItem label="收货地：" prop="getLocalDesc">
          <Input v-model="formData.getLocalDesc" @on-focus="onSelectPosition('getPlace')" placeholder="请输入收货详细地址"></Input>
        </FormItem>
        <FormItem v-if="formData.getAdditionalRemark" label="收货地补充说明：" prop="fullSendAddress">
          <Input v-model="formData.getAdditionalRemark" placeholder="请输入（非必填）" disabled></Input>
        </FormItem>
        <FormItem v-if="formData.distance" label="预估距离：" prop="distance">
          <Input v-model="formData.distance" placeholder="请输入（非必填）" style="width:188px" disabled>
            <span slot="append">km</span>
          </Input>
        </FormItem>
        <FormItem label="货物：" prop="goodsType">
          <Select v-model="formData.goodsType" style="width:188px">
            <Option v-for="item in goodsTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数量：" prop="goodsNum">
          <Input v-model="formData.goodsNum" placeholder="请输入" style="width:188px">
            <span slot="append">吨</span>
            <!-- <Select v-model="formData.util" slot="append" style="width: 45px">
              <Option v-for="item in utilsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
          </Input>
        </FormItem>
        <FormItem label="运费单价：" prop="transportPrice">
          <Input v-model="formData.transportPrice" placeholder="请输入" style="width:188px;" >
            <span slot="append">元/吨</span>
          </Input>
          <Checkbox v-model="formData.isATax" style="position: absolute;left: 203px;top: 1px;">含税</Checkbox>
        </FormItem>
        <FormItem label="运输要求：" prop="carType">
          <Select v-model="formData.carType" :multiple="true" style="width:188px">
            <Option v-for="item in carTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Checkbox v-model="formData.isNeedEquipment" style="position: absolute;left: 203px;top: 1px;">车载设备</Checkbox>
        </FormItem>
        <FormItem  label="装货时间：">
          <Row>
            <Col span="11">
              <FormItem prop="loadStartTime">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="装货开始时间" v-model="formData.loadStartTime"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">--</Col>
            <Col span="11">
              <FormItem prop="loadEndTime">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="装货结束时间" v-model="formData.loadEndTime"></DatePicker>              
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem  label="联系人：">
          <Row>
            <Col span="11">
              <FormItem prop="goodsUserName">
                <Input v-model="formData.goodsUserName" placeholder="请输入姓名"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">--</Col>
            <Col span="11">
              <FormItem prop="goodsTelephone">
                <Input v-model="formData.goodsTelephone" placeholder="请输入电话"></Input>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注：" prop="goodsDesc">
          <Input v-model="formData.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注（非必填）"></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" size="large" :loading="isPublishing" @click="onConfirm(1)">保存为草稿</Button>
      <Button type="primary" size="large" :loading="isPublishing" @click="onConfirm(2)">保存并发布</Button>
    </div>
  </Modal>
  <map-position @on-change="onMapPositionChange" @on-estimate="onEstimateDistance"  ref="mapPosition"></map-position>
  </div>
</template>

<script>
import { getAllArea, getUserInfo } from "../config/utils";
import mapPosition from "./map-position";
export default {
  components: {
    mapPosition
  },
  data() {

    const validateSendLocalDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入发货详情地址'));
      } else if (value && value.length > 40) {
        callback(new Error('详情地址不能超过40个字'));
      } else {
        callback();
      }
    }

    const validateGetLocalDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入收货详情地址'));
      } else if (value && value.length > 40) {
        callback(new Error('详情地址不能超过40个字'));
      } else {
        callback();
      }
    }

    const validateDistance = (rule, value, callback) => {
      if (value && !new RegExp("^[0-9]{0,6}(\\.\\d{1,2})?$").test(value)) {
        callback(new Error('数值范围0~9999999，可保留两位小数'));
      } else {
        callback();
      }
    }

    const validateCarType = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请选择运输要求'));
      } else {
        callback();
      }
    }

    const validateGoodsType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择货物'));
      } else {
        callback();
      }
    }

    const validateGoodsNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入货物数量'));
      } else if (!new RegExp("^[1-9][0-9]{0,6}(\\.\\d{1,2})?$").test(value)) {
        callback(new Error('数值范围0~9999999，可保留两位小数'));
      } else {
        callback();
      }
    }

    const validateTransportPrice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入运费'));
      } else if (!new RegExp("^[1-9][0-9]{0,6}(\\.\\d{1,2})?$").test(value)) {
        callback(new Error('数值范围0~9999999，可保留两位小数'));
      } else {
        callback();
      }
    }

    const validateGoodsUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'));
      } else if (value.length > 6) {
        callback(new Error('姓名不能超过8个字'));
      } else {
        callback();
      }
    }

    const validateGoodsTelephone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话'));
      } else if (!new RegExp("^\\d{11}$").test(value)) {
        callback(new Error('电话号码格式不正确'));
      } else {
        callback();
      }
    }

    const validateRemark = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback(new Error('备注信息不能超过20个字'));
      } else {
        callback();
      }
    }

    const validateLoadStartTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择装货开始时间'));
        return;
      }
      if (value && this.formData.loadEndTime) {
        let start = new Date(value).getTime();
        let end = new Date(this.formData.loadEndTime).getTime();
        if (start >= end) {
          callback(new Error('开始时间不能晚于结束时间'));
        }
        else {
          callback();
        }
        return;
      } 
      callback();
    }

    const validateLoadEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择装货结束时间'));
        return;
      }
      if (value) {
        let start = this.formData.loadStartTime && new Date(this.formData.loadStartTime).getTime();
        let now = new Date().getTime();
        let end = new Date(this.formData.loadEndTime).getTime();
        if (end < now) {
          callback(new Error('结束时间不能早于当前时间'));
          return;
        }
        if (start && start >= end) {
          callback(new Error('开始时间不能晚于结束时间'));
          return;
        }
        callback();
      }
    }

    return {
      isShow: false,
      isPublishing: false,
      addressData: [],
      goodsTypeList: [],
      carTypeList: [],
      utilsList: [],
      formData: {},
      formValidate: {
        // sendPlace: [
        //   {required: true,type: "array",message: "请选择发货地",trigger: "blur"}
        // ],
        sendLocalDesc: [
          { validator: validateSendLocalDesc, trigger: 'change' }
        ],
        // getPlace: [
        //   {required: true,type: "array",message: "请选择收货地",trigger: "blur"}
        // ],
        distance: [
          { validator: validateDistance, trigger: 'blur' }
        ],
        getLocalDesc: [
          { validator: validateGetLocalDesc, trigger: 'change' }
        ],
        goodsType: [
          // {required: true,message: "请选择货物",trigger: "blur"}
          { validator: validateGoodsType, trigger: 'blur' }
        ],
        goodsNum: [
          // {required: true,type: "string",message: "请输入货物数量",trigger: "blur"},
          { validator: validateGoodsNum, trigger: 'blur' }
        ],
        transportPrice: [
          // {required: true,type: "string",message: "请输入运费",trigger: "blur"},
          { validator: validateTransportPrice, trigger: 'blur' }
        ],
        carType: [
          // {required: true, type: "array",message: "请选择运输要求",trigger: "blur"}
          { validator: validateCarType, trigger: 'blur' }
        ],
        loadStartTime: [
          {required: true,type: "date",message: '请选择装货开始时间', trigger: 'blur' },
          { validator: validateLoadStartTime, trigger: 'change' }
        ],
        loadEndTime: [
          {required: true,type: "date", message: '请选择装货结束时间', trigger: 'blur' },
          { validator: validateLoadEndTime, trigger: 'change' }
        ],
        goodsUserName: [
          // {required: true,type: "string",message: "请填正确格式电话号码",trigger: "blur"},
          { validator: validateGoodsUserName, trigger: 'blur' }
        ],
        goodsTelephone: [
          // {required: true,type: "string",message: "请输入电话号码",trigger: "blur"},
          { validator: validateGoodsTelephone, trigger: 'blur' }
        ],
        goodsDesc: [
          { validator: validateRemark, trigger: 'blur' } 
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.isShow = true;
      this.getAddressData();
      this.getGoodsTypeList();
      this.getCarTypeList();
      this.getUtilsList();

      this.formData = {
        id: -1,
        getLocalDesc: "",
        getPlace: [],
        getPlaceCenter: {},
        getPlacePolygon: [],
        getPlaceRadius: 200,
        getAdditionalRemark: '',
        sendLocalDesc: "",
        sendPlace: [],
        sendPlaceCenter: {},
        sendPlacePolygon: [],
        sendPlaceRadius: 200,
        sendAdditionalRemark: '',
        distance: "",
        transportPrice: "",
        goodsNum: "",
        util: "吨",
        goodsTypeName: "",
        goodsType: "",
        carType: [],
        isATax: true, // 是否含税 1--不含税  2--含税
        isNeedEquipment: true, // 是否需要设备 1--不需要 2---需要
        loadEndTime: "",
        loadStartTime: "",
        goodsUserName: getUserInfo().userName,
        goodsTelephone: getUserInfo().telephone,
        goodsDesc: "", // 备注
      }

      if (id) {
        this.getGoodsSourceInfo(id)
      }
    },
    // 获取地址信息
    getAddressData() {
      this.addressData = getAllArea();
    },
    // // 动态加载三级联动数据  暂时没用使用
    getAllProvince() {
      this.$commonService
        .get("/area/getAllProvince", {})
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询省份信息失败，请稍后重试！");
            return;
          }
          this.addressData = [];
          res.data.forEach(item => {
            this.addressData.push({
              level: 1,
              value: item.value,
              label: item.name,
              children: [],
              loading: false
            })
          })
        })
        .catch(res => {
          this.$Message.error("查询省份信息出现未知错误，请稍后重试！");
        });
    },
    // // 动态加载三级联动数据  暂时没用使用
    loadAddressData(data, callback) {
      data.loading = true;
      this.$commonService
        .get("/area/getAllChild", {
          pId: data.value,
          level: data.level + 1
        })
        .then(res => {
          data.loading = false;
          if (!res.success) {
            this.$Message.error("查询省份信息失败，请稍后重试！");
            return;
          }
          res.data.forEach(item => {
            if (data.level == 1) {
              data.children.push({
                level: 2,
                value: item.value,
                label: item.name,
                children: [],
                loading: false
              })
            } else {
              data.children.push({
                level: 3,
                value: item.value,
                label: item.name
              })
            }
          })
          callback();
        })
        .catch(res => {
          data.loading = false;
          this.$Message.error("查询省份信息出现未知错误，请稍后重试！");
        });
    },
    // 获取货物类型
    getGoodsTypeList() {
      this.goodsTypeList = [];
      this.$commonService
        .get("/system/getSystemDic", {
          key: "goodsType"
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询货物类型失败，请稍后重试！");
            return;
          }
          res.data.forEach((item, index) => {
             this.goodsTypeList.push({
                label: item.typeValue,
                value: item.typeCode
             })
          })
        })
        .catch(res => {
          this.$Message.error("查询货物类型出现未知错误，请稍后重试！");
        });
    },
    // 获取车辆类型
    getCarTypeList() {
      this.carTypeList = [];
      this.$commonService
        .get("/system/getSystemDic", {
          key: "carType"
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询车辆类型失败，请稍后重试！");
            return;
          }
          res.data.forEach((item, index) => {
             this.carTypeList.push({
                label: item.typeValue,
                value: item.typeCode
             })
          })
        })
        .catch(res => {
          this.$Message.error("查询车辆类型出现未知错误，请稍后重试！");
        });
    },
    // 货物数量单位
    getUtilsList() {
      this.utilsList = [{
        label: "吨",
        value: "吨"
      }];
    },
    // 修改 获取货源详情
    getGoodsSourceInfo(id) {
      this.$consignerService
        .get("/goods-source/queryGoodsSourceInfo", {
          id: id
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询货源详情失败！");
            return;
          }
          this.formData = {
            getPlaceCenter: JSON.parse(res.data.getCenter),
            getPlacePolygon: JSON.parse(res.data.getPointsStr),
            getPlaceRadius: res.data.getRadius,
            getLocalDesc: res.data.getLocalDesc,
            getPlace: [res.data.getProvince, res.data.getCity, res.data.getCounty],
            getAdditionalRemark: res.data.getSupplementaryExplanation,
            sendPlaceCenter: JSON.parse(res.data.sendCenter),
            sendPlacePolygon: JSON.parse(res.data.sendPointsStr),
            sendPlaceRadius: res.data.sendRadius,
            sendLocalDesc: res.data.sendLocalDesc,
            sendPlace: [res.data.sendProvince, res.data.sendCity, res.data.sendCounty],
            sendAdditionalRemark: res.data.sendSupplementaryExplanation,
            distance: res.data.distance,
            transportPrice: res.data.transportPrice.replace(/,/g, ""),
            goodsNum: String(res.data.goodsNum),
            util: "吨",
            goodsTypeName: res.data.goodsTypeName,
            goodsType: res.data.goodsType,
            carType: res.data.carTypeStr.split(','),
            id: res.data.id,
            isATax: res.data.isATax == 2,
            isNeedEquipment: res.data.isNeedEquipment == 2,
            loadEndTime: this.$utils.formateDate(res.data.loadEndTime, "yyyy-MM-dd HH:mm"),
            loadStartTime: this.$utils.formateDate(res.data.loadStartTime, "yyyy-MM-dd HH:mm"),
            goodsUserName: res.data.goodsUserName,
            goodsTelephone: res.data.goodsTelephone,
            goodsDesc: res.data.goodsDesc,
          }
        })
        .catch(error => {
          console.log(error)
          this.$Message.error("查询货源出现未知错误！");
        });
    },
    // 保存
    onConfirm(status) {
      this.$refs['sourceForm'].validate((valid) => {
        if (valid) {
          let params = {
            "sendCenter": JSON.stringify(this.formData.sendPlaceCenter),
            "sendPointsStr": JSON.stringify(this.formData.sendPlacePolygon),
            "sendRadius": this.formData.sendPlaceRadius,
            "sendCity": this.formData.sendPlace[1],
            "sendCounty": this.formData.sendPlace[2],
            "sendProvince": this.formData.sendPlace[0],
            "sendLocalDesc": this.formData.sendLocalDesc,
            "sendSupplementaryExplanation": this.formData.sendAdditionalRemark,
            "getCenter": JSON.stringify(this.formData.getPlaceCenter),
            "getPointsStr": JSON.stringify(this.formData.getPlacePolygon),
            "getRadius": this.formData.getPlaceRadius,
            "getCity": this.formData.getPlace[1],
            "getCounty": this.formData.getPlace[2],
            "getProvince": this.formData.getPlace[0],
            "getLocalDesc": this.formData.getLocalDesc,
            "getSupplementaryExplanation": this.formData.getAdditionalRemark,
            "goodsDesc": this.formData.goodsDesc,
            "distance": this.formData.distance,
            "goodsNum": Number(this.formData.goodsNum),
            "goodsSourceStage": status, // 货源状态 1--草稿   2--发布  3--不发布  4--待开发
            "goodsTelephone": this.formData.goodsTelephone,
            "goodsType": this.formData.goodsType,
            "goodsUserName": this.formData.goodsUserName,
            "isATax": this.formData.isATax ? 2 : 1,
            "isNeedEquipment": this.formData.isNeedEquipment ? 2 : 1,
            "listGoodsExts": [],
            "loadEndTime": this.$utils.formateDate(this.formData.loadEndTime, "yyyy-MM-dd HH:mm:ss"),
            "loadStartTime": this.$utils.formateDate(this.formData.loadStartTime, "yyyy-MM-dd HH:mm:ss"),
            "transportPrice": this.formData.transportPrice
          }

          if (this.formData.id != -1) {
            params.id = this.formData.id
          }

          this.formData.carType.forEach(item => {
            params.listGoodsExts.push({
              "carType": item,
              "goodsId": 0,
              "id": 0
            })
          })

          this.isPublishing = true;
          this.$consignerService
          .post(params.id ? "/goods-source/updateGoodsSource" : "/goods-source/insertGoodsSource", {
            dto: params
          })
          .then(res => {
            this.isPublishing = false;
            this.isShow = false;
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.$Message.success(status == 1 ? "保存草稿成功" : "发布货源成功！");
            this.$parent.getSourceList();
          })
          .catch(res => {
            this.isPublishing = false;
            this.$Message.error("操作货源出现未知错误！");
          });

        } else {
          
        }
      })
    },
    // 地图选点
    onSelectPosition(type) {
      /** 
       * data: 回填值，用于信息回填（发货地or收货地）
       * center： 发货地或者收货地中心点，用于计算预估距离
      */
      let data = {};
      let center = {};

      if (type == 'sendPlace') {
        data = {
          type: "sendPlace", // 选择地址的类型 
          areaCode: this.formData.sendPlace, // 行政编号code
          addressDetail: this.formData.sendLocalDesc, // 街道详情地址
          additionalRemark: this.formData.sendAdditionalRemark, // 补充说明
          center: this.formData.sendPlaceCenter,// 坐标中心点
          polygonPath: this.formData.sendPlacePolygon, // 采用多边形绘制的轨迹
          radius: this.formData.sendPlaceRadius // 采用点绘制时的半径（米）
        }

        center = this.formData.getPlaceCenter;
      } 
      else {
        data = {
          type: "getPlace", // 选择地址的类型 
          areaCode: this.formData.getPlace, // 行政编号code
          addressDetail: this.formData.getLocalDesc, // 街道详情地址
          additionalRemark: this.formData.getAdditionalRemark, // 补充说明
          center: this.formData.getPlaceCenter,// 坐标中心点
          polygonPath: this.formData.getPlacePolygon, // 采用多边形绘制的轨迹
          radius: this.formData.getPlaceRadius // 采用点绘制时的半径（米）
        }
      
        center = this.formData.sendPlaceCenter;
      }

      this.$refs.mapPosition.init(data, center);
    },
    // 区域选点
    onMapPositionChange(data) {
      if (data.type == 'sendPlace') {
        this.formData.sendPlace = data.areaCode;
        this.formData.sendLocalDesc = data.addressDetail;
        this.formData.sendAdditionalRemark = data.additionalRemark; 
        this.formData.sendPlaceCenter = data.center;
        this.formData.sendPlacePolygon = data.polygonPath;
        this.formData.sendPlaceRadius = data.radius;
      }
      else {
        this.formData.getPlace = data.areaCode;
        this.formData.getLocalDesc = data.addressDetail;
        this.formData.getAdditionalRemark = data.additionalRemark; 
        this.formData.getPlaceCenter = data.center;
        this.formData.getPlacePolygon = data.polygonPath;
        this.formData.getPlaceRadius = data.radius;
      }
    },
    // 计算预估距离
    onEstimateDistance(data) {
      this.formData.distance = (data / 1000).toFixed(2); 
    }
  },
  mounted() {
    
  }
};
</script>
