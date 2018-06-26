<style scoped lang="less">
  .map-trace {
    width: 100%;
    height: 100%;
    position: relative;
    .map {
      width: 100%;
      height: 500px;
    }
    .map-detail {
      position: absolute;
      top: 5px;
      left: 5px;
      height: 120px;
      width: 300px;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.7);
      line-height: 20px;
      font-size: 14px;
      .item {
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 6px; 
        .status {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          margin-right: 8px;
          background: #289CF3;
          padding: 2px 8px;
          border-radius: 3px;
        }
        .label {
          font-weight: 600;
        }
      }
    }
  }
</style>

<style>
  .anchorBL{display:none;}
</style>

<template>
  <div>
    <Modal v-model="visible" title="车辆跟踪" width="800" @on-visible-change="onVisibleChange">
      <div class="map-trace">
        <baidu-map class="map" :center="{lng: carPosition.lng, lat: carPosition.lat}" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
          <bm-marker v-if="isShowMarker" :position="{lng: carPosition.lng, lat: carPosition.lat}" animation="BMAP_ANIMATION_BOUNCE" :offset="{width: 30,height:30}" :icon="{url: require('../images/position-active.png'), size: {width: 60, height: 60}}"></bm-marker>
          <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :offset="{width: 20,height:80}"></bm-navigation>
        </baidu-map>
        <div class="map-detail">
          <div class="item">
            <span class="label" style="font-size: 16px;margin-right: 8px;">{{carPosition.carNumber}}</span>
            <span class="status" style="">{{carPosition.status}}</span>
          </div>
          <div class="item">
            <span class="label">当前位置：</span>
            <span>{{carPosition.position}}</span>
          </div>
          <div class="item">
            <span class="label">当前速度：</span>
            <span>{{carPosition.speed == '未知' ? '未知' : carPosition.speed + ' km/h'}}</span>
          </div>
          <div class="item">
            <span class="label">当前时间：</span>
            <span>{{carPosition.time || '未知'}}</span>
          </div>
        </div>
        <Spin v-if="loading" size="large" fix></Spin>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="visible=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { setInterval, clearInterval, clearTimeout, setTimeout } from 'timers';
var mapTimeout = null;
export default {
  data () {
    let _this = this;
    return {
      visible: false,
      loading: false,
      map: null,
      isShowMarker: false,
      zoom: 3,
      carPosition: {
        carNumber: "",
        speed: "未知",
        position: "未知",
        time: "未知",
        lng: 116.404,
        lat: 39.915,
        status: ""
      }
    }
  },
  methods: {
    handler ({BMap, map}) {
      this.map = map;
    },
    onVisibleChange(status) {
      clearTimeout(mapTimeout);
    },
    init(carNumber) {
      this.visible = true;
      this.loading = true;
      this.$tmsService.get("/api/WeChat/Carrier/GetVehiclePos_mineMap",{
        ids: carNumber
      }).then(res => {
        if (res.Status == 1) {
          this.loading = false;
          if (!res.Data.position) {
            this.isShowMarker = false;
            this.$Message.error("找不到该车辆的位置信息！", 'default'); 
            return
          }
          this.zoom = 15;
          this.carPosition = {
            carNumber: res.Data.dispatchInfo['car_num'],
            speed: res.Data.position.Speed,
            position: "",
            time: res.Data.position.GpsTime.replace("T"," "),
            lng: res.Data.position.Longitude,
            lat: res.Data.position.Latitude,
            status: res.Data.dispatchInfo.StatusStr
          }

          this.isShowMarker = true;

          let _this = this;
          // 位置逆解析    
          new BMap.Geocoder().getLocation(new BMap.Point(res.Data.position.Longitude,res.Data.position.Latitude), function (rs) {
            let addComp = rs.addressComponents;
            _this.carPosition.position = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          });

          mapTimeout = setTimeout(()=>{
            _this.init();
          },5000)
        } else {
          this.$Message.error("查询车辆位置信息发生未知错误！", 'default'); 
          this.isShowMarker = false; 
        }
      }).catch(err => {
        console.log(err)
        this.loading = false;
        this.isShowMarker = false;
        this.$Message.error("查询车辆位置信息发生未知错误！", 'default'); 
        clearTimeout(mapTimeout);
      })
    },
    refresh() {
      clearTimeout(mapTimeout);
      this.init();
    }
  },
  mounted() {
    
  },
  beforeDestroy() {
    clearTimeout(mapTimeout);
  }
}
</script>