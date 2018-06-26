<style scoped lang="less">
  .model-body {
    display: flex;
    width: 100%;
    height: 100%;
    .map-content {
      flex: 1;
      position: relative;
      .map {
        width: 100%;
        height: 600px;
      }
      .local-search {
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        background: #FFF;
        opacity: 0.9;
        color: #000;
        .search-item {
          border-bottom: 1px solid #CCC;
          padding: 8px 10px;
          cursor: pointer;
          .title {
            font-weight: 600;
            color: #333;
          }
          .detail {
            color: #999;
          }
        }
        .search-item:hover {
          .title {
            font-weight: 600;
            color: #2d8cf0;
          }
          .detail {
            color: #2d8cf0;
          }
        }
      }
      .btn-custom {
        position: absolute;
        left: 20px;
        padding: 12px;
        width: 54px;
      }
    }
    .address-form {
      padding-left: 20px;
      width: 240px;
      .ivu-form-item-content {
        line-height: 20px!important;
      }
    }
  }
</style>

<style>
  .address-form .ivu-form-item-content{
    line-height: 20px!important;
  }
  .address-form .ivu-form-item-label {
    font-weight: 600;
  }
  .anchorBL{display:none;}
</style>

<template>
  <div>
    <Modal v-model="visible" :title="title" width="1000">
      <div class="model-body">
        <div class="map-content">
          <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
            <!-- 坐标点 -->
            <bm-marker 
              v-if="isShowMarker"
              dragging
              @dragend="onDragend"
              :massClear="false"
              :position="addressForm.center"
              :offset="{width: 6,height: -14}"
              :icon="{url: require('../images/position-active.png'), size: {width: 60, height: 60}}">
            </bm-marker>
            <!-- 圆 -->
            <bm-circle v-if="isShowCircle" :center="addressForm.center" :radius="addressForm.radius" stroke-color="red" :massClear="false" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCirclePath" :editing="true"></bm-circle>
            <!-- 多边形 -->
            <bm-polygon v-if="isShowPolygon" :path="addressForm.polygonPath" stroke-color="red" :stroke-opacity="0.5" :massClear="false" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
            <!-- 检索 -->
            <!-- <bm-local-search class="local-search" :keyword="keyword" :panel="isShowPanel" :auto-viewport="true" :location="location"></bm-local-search> -->
            <!-- 定位 -->
            <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
          </baidu-map>
          <Button class="btn-custom" :type="drawingType == 'point' ? 'primary' : 'default'" style="top: 30px;" @click="setDrawingType('point')">点</Button>
          <Button class="btn-custom" :type="drawingType == 'polygon' ? 'primary' : 'default'" style="top: 80px;" @click="setDrawingType('polygon')">区域</Button>
          <Button class="btn-custom" :type="mapType == 'normal' ? 'primary' : 'default'" style="top: 130px;" @click="setMapType('normal')">平面</Button>
          <Button class="btn-custom" :type="mapType == 'satellite' ? 'primary' : 'default'" style="top: 180px;" @click="setMapType('satellite')">卫星</Button>
          <Button class="btn-custom" style="bottom: 90px;" icon="plus-round" @click="addZoom"></Button>
          <Button class="btn-custom" style="bottom: 40px;" icon="minus-round" @click="minusZoom"></Button>
          <Spin v-if="loading" size="large" fix>定位中...</Spin>
          <div class="local-search" v-if="isShowPanel">
            <div class="search-item" v-for="(item, index) in searchList" :key="index" @click="onCellClick(item.point)">
              <div class="title">{{item.title}}</div>
              <div class="detail">{{item.address}}</div>
            </div>
          </div>
        </div>
        <div class="address-form">
          <Form ref="addressForm" :rules="addressFormValidate" :model="addressForm" label-position="top">
            <FormItem label="关键字搜索：">
              <Input v-model="keyword" placeholder="关键字搜索">
                  <Button slot="append" icon="ios-search" @click="mapLocalSearch"></Button>
              </Input>
              <div v-if="isSearching" style="margin-top: 5px;color: #2d8cf0;">检索中...</div>
            </FormItem>
            <FormItem :label="addressForm.type == 'sendPlace' ? '发货地：' : '收货地：'" prop="areaCode">
              <!-- <Cascader :data="addressData" v-model="addressForm.areaCode" @on-change="onCascaderChange" transfer placeholder="请选择"></Cascader> -->
              <span>{{addressForm.addressDetail}}</span>
            </FormItem>
            </FormItem>
            <FormItem label="地址补充说明：">
              <Input v-model="addressForm.additionalRemark" placeholder="详细地址补充说明(非必填)"></Input>
            </FormItem>
            <FormItem v-if="drawingType == 'point'" label="半径：" prop="radius">
              <Input v-model="addressForm.radius" placeholder="请选择半径">
                <span slot="append">米</span>
              </Input>
            </FormItem>
            <FormItem label="经度：" prop="position">
              <Input v-model="addressForm.center.lng" placeholder="请选择坐标" disabled></Input>
            </FormItem>
            <FormItem label="纬度：" prop="position">
              <Input v-model="addressForm.center.lat" placeholder="请选择坐标" disabled></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      
      <div slot="footer">
        <Button type="primary" size="large" @click="visible=false">取消</Button>
        <Button type="primary" size="large" @click="onBtnOK">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllArea } from "../config/utils";
import { setInterval, clearInterval, clearTimeout, setTimeout } from 'timers';
var mapTimeout = null;
export default {
  data () {

    const validateAddressDetail = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback(new Error('详情地址不能超过20个字'));
      } else {
        callback();
      }
    }

    const validateRadius = (rule, value, callback) => {
      if (value && !new RegExp("^[1-9][0-9]{0,6}$").test(value)) {
        callback(new Error('数值范围为1~9999999的整数'));
      } else {
        callback();
      }
    }

    return {
      visible: false,
      title: "区域选择",
      type: "",
      loading: false,
      keyword: '',
      center: {lng: 0, lat: 0},
      otherCenter: {}, // 用于计算预估距离
      isShowPanel: false,
      isShowMarker: true,
      isShowCircle: false,
      isShowPolygon: false,
      isSearching: false,
      searchList: [],
      detailAddress: '',
      location: '', // 搜索限制地区
      mapType: 'normal', // 地图类型
      drawingType: 'point', // 绘制类型
      polygonPath: [], // 多边形路径
      zoom: 16,
      map: null, //
      addressData: getAllArea(),
      addressFormValidate: {
        areaCode: [
          // {required: true,type: "array",message: "请选择省市区"}
        ],
        addressDetail: [
          // {required: true, message: "请输入详细地址"},
          { validator: validateAddressDetail}
        ],
        radius: [
          // {required: true, message: "请输入半径"},
          { validator: validateRadius}
        ],
        center: [
          {
            required: true,
            type: "object", 
            fields: {
              lng: {type: "number", required: true, message: "请选择坐标"},
              lat: {type: "number", required: true, message: "请选择坐标"},
            }
          }
        ]
      },
      addressForm: {
        type: "", // 选择地址的类型  发货地 or 收货地
        areaCode: [], // 行政编号code
        addressDetail: '', // 街道详情地址
        additionalRemark: '', // 补充说明
        center: {lng: 0,lat: 0},// 坐标中心点
        polygonPath: [], // 采用多边形绘制的轨迹
        radius: 200 // 采用点绘制时的半径（米）
      }
    }
  },
  methods: {
    onBtnOK() {
      this.$refs['addressForm'].validate((valid)=>{
        if (valid) {
          if (this.drawingType == 'point') {
            this.addressForm.polygonPath = [];
          }
          else {
            this.addressForm.radius = 0;
          }
          this.$emit('on-change',this.addressForm);
          this.visible = false;
        }
      })
    },
    // 三级级联change事件
    onCascaderChange(value, selectedData) {
      if (value.length > 0) {
        this.isShowMarker = true;

        this.location = selectedData[0].label + selectedData[1].label + selectedData[2].label;
        // 位置逆解析
        let _this = this;    
        new BMap.Geocoder().getPoint(_this.location, function (res) {
          _this.center = res;
          _this.addressForm.center = res;
          // 获取详细地址
          new BMap.Geocoder().getLocation(res, function(data) {
            _this.addressForm.addressDetail = data.addressComponents.street + data.addressComponents.streetNumber;
          })
        });
      }
    },
    // 地图ready事件
    handler ({BMap, map}) {
      this.map = map;
      // 监听地图点击事件
      let _this = this;
      this.map.removeEventListener('click');
      this.map.addEventListener('click',function(e) {
        _this.isShowMarker = true;
        _this.isShowPanel = false;
        _this.map.clearOverlays();
        if (_this.drawingType == 'point') {
          _this.addressForm.center = e.point;
        } 
        else {
          _this.addressForm.polygonPath.push(e.point);
          let view = _this.map.getViewport(_this.addressForm.polygonPath);
          _this.addressForm.center = view.center;
        }
        _this.getLocation(_this.addressForm.center);
      })
    },
    // 初始化
    init(data, center) {
      try {
        let _this = this;

        this.addressForm = data;

        this.addressForm.center = this.addressForm.center.lng && this.addressForm.center.lat ? new BMap.Point(this.addressForm.center.lng, this.addressForm.center.lat) : new BMap.Point(0, 0);

        this.addressForm.polygonPath.map(item=>{
          item = new BMap.Point(item.lng, item.lat);
          return item;
        })
        
        this.otherCenter = center.lng && center.lat ? new BMap.Point(center.lng, center.lat) : {};
 
        this.visible = true;
        this.loading = true;

        if (this.addressForm.radius > 0 ) {
          this.setDrawingType('point');
        }
        else {
          this.addressForm.radius = 200;
          this.setDrawingType('polygon');
        }
        if (this.addressForm.center.lng == 0 && this.addressForm.center.lat == 0) {
          // 获取当前位置
          new BMap.Geolocation().getCurrentPosition(function(r){
            _this.loading = false;
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
              _this.center = r.point;
              _this.addressForm.center = r.point;
              _this.getLocation(r.point);
            } 
            else {
              _this.$Message.error('获取当前位置失败，请刷新重试！')
            }       
          },{enableHighAccuracy: true})
        }
        else {
          this.loading = false;
          setTimeout(()=>{
            this.center = this.addressForm.center;
          },100)
          this.getLocation(this.addressForm.center);
        }
        
      }
      catch (error) {
        console.log(error)
        this.$Message.error("加载地图失败，请刷新重试！");
      }
    },
    // 监听当前点拖拽
    onDragend(target) {
      this.addressForm.center = target.point;
      this.getLocation(target.point);
    },
    // 设置绘制方式   点 多边形
    setDrawingType(type) {
      this.map.clearOverlays();
      this.drawingType = type;
      if (type == 'point') {
        this.isShowCircle = true;
        this.isShowPolygon = false;
      }
      else {
        this.isShowCircle = false;
        this.isShowPolygon = true;
      }
    },
    // 设置地图类型
    setMapType(type) {
      this.mapType = type;
      this.map.setMapType(type == 'normal' ? BMAP_NORMAL_MAP : BMAP_SATELLITE_MAP);
    },
    // 缩放级别+1
    addZoom() {
      if (this.zoom >= 18) {
        return;
      } else {
        this.zoom++;
      }
    },
    // 缩放级别-1
    minusZoom() {
      if (this.zoom <= 1) {
        return;
      } else {
        this.zoom--;
      }
    },
    // 更新多边形后回调
    updatePolygonPath (e) {
      this.addressForm.polygonPath = e.target.getPath();
      let view = this.map.getViewport(this.addressForm.polygonPath);
      this.addressForm.center = view.center;
      this.getLocation(view.center);
    },
    // 更新圆形后回调
    updateCirclePath (e) {
      this.addressForm.center = e.target.getCenter();
      this.addressForm.radius = Math.floor(e.target.getRadius());
    },
    // 位置逆解析 回填三级级联及详细地址
    getLocation(point) {
      let _this = this;
      this.getEstimateDistance(point);
      new BMap.Geocoder().getLocation(point, function(data) {
        if (data.surroundingPois.length > 0) {
          _this.addressForm.addressDetail = data.surroundingPois[0].address + data.surroundingPois[0].title;
        } 
        else {
          _this.addressForm.addressDetail = data.address;
        }
        _this.queryAddressCode(data.addressComponents);
      })
    },
    // 检索关键字
    mapLocalSearch() {
      let _this = this;
      this.isSearching = true;
      let options = {
        onSearchComplete: function(data){
          // 判断状态是否正确
          _this.isSearching = false;
          if (local.getStatus() == BMAP_STATUS_SUCCESS){
            if (data && data.Br.length > 0) {
              _this.searchList = data.Br;
              _this.isShowPanel = true;
            }
            else {
              _this.$Message.error("未检索到位置信息！");
              _this.searchList = [];
            }
          }
          else {
            _this.$Message.error("检索位置失败！");
          }
        }
      };
      let local = new BMap.LocalSearch(this.map, options);
      local.search(this.keyword);
    },

    onCellClick(point) {
      this.isShowPanel = false;
      this.addressForm.center = point;
      this.center = point;
      this.getLocation(point);
    },
    // 获取预估距离
    getEstimateDistance(center) {
      if (JSON.stringify(this.otherCenter) == '{}') {
        return;
      }
      this.$emit('on-estimate', this.map.getDistance(center, this.otherCenter));
    },
    // 获取行政编号
    queryAddressCode(data) {

      let codeArr = [];
      let cityArr = [];
      let countryArr= [];

      if (!this.addressData) {
        this.addressData = getAllArea();
      }

      for (let i = 0; i < this.addressData.length; i++) {
        if (this.addressData[i].label == data.province) {
          codeArr.push(this.addressData[i].value);
          cityArr = this.addressData[i].children;
          break;
        }
      }

      if (codeArr.length == 0) {
        for (let i = 0; i < this.addressData.length; i++) {
          if (data.province.indexOf(this.addressData[i].alias) > -1) {
            codeArr.push(this.addressData[i].value);
            cityArr = this.addressData[i].children;
            break;
          }
        }
      }

      for (let i = 0; i < cityArr.length; i++) {
        if (cityArr[i].label == data.city) {
          codeArr.push(cityArr[i].value);
          countryArr = cityArr[i].children;
          break;
        }
      }

      if (codeArr.length == 1) {
        for (let i = 0; i < cityArr.length; i++) {
          if (data.city.indexOf(cityArr[i].alias) > -1) {
            codeArr.push(cityArr[i].value);
            countryArr = cityArr[i].children;
            break;
          }
        }
      }

      for (let i = 0; i < countryArr.length; i++) {
        if (countryArr[i].label == data.district) {
          codeArr.push(countryArr[i].value);
          break;
        }
      }

      if (codeArr.length == 2) {
        for (let i = 0; i < countryArr.length; i++) {
          if (data.district.indexOf(countryArr[i].alias) > -1) {
            codeArr.push(countryArr[i].value);
            break;
          }
        }
      }

      if (codeArr.length == 3) {
        this.addressForm.areaCode = codeArr
      }
      else {
        this.addressForm.areaCode = [];
        this.$Message.error('找不到所选区域的行政编码！请联系客服处理，电话：400 1617 400！');            
      }
    }
  },
  mounted() {
    
  },
}
</script>