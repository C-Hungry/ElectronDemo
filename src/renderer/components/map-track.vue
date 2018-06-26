<style scoped lang="less">
  .map-track {
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
      height: 100px;
      width: 300px;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.7);
      line-height: 20px;
      div {
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>

<style>
  .anchorBL{display:none;}
</style>

<template>
  <div>
    <Modal v-model="visible" title="轨迹" width="800">
      <div class="map-track">
        <baidu-map ref="map" class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @mousemove="mousemove">
          <bm-marker v-for="(point, index) in allPoints" :position="point" @click="infoWindowOpen(point)" :key="index" 
            :icon="point == current || point == selected ? iconSelected : icon">
            <bm-info-window :show="point.show" @close="infoWindowClose(point)" @open="infoWindowOpen(point)">
              <div><label style="font-weight: bold;">当前时间：</label>{{point.dateTime}}</div>
              <div><label style="font-weight: bold;">当前速度：</label>{{point.speed}}km/h</div>
              <div><label style="font-weight: bold;">当前位置：</label>{{point.address}}</div>
            </bm-info-window>
          </bm-marker>
          <bm-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="4"></bm-polyline>
          <bm-marker v-if="isShowMarker" :massClear="false" :zIndex="10" :offset="{width: 0,height:-30}" :position="start" :icon="{url: require('../images/startpointmap.png'), size: {width: 44, height: 61}}"></bm-marker>
          <bm-marker v-if="isShowMarker" :massClear="false" :zIndex="10" :offset="{width: 0,height:-30}" :position="end" :icon="{url: require('../images/endpointmap.png'), size: {width: 44, height: 61}}"></bm-marker>
        </baidu-map>
        <div class="map-detail">
          <div>
            <img src="../images/circle_green.svg" width="20" alt="">
            <span style="position: relative; top: -5px;">{{startAddress}}</span>
          </div>
          <div>
            <img src="../images/circle_red.svg" width="20" alt="">
            <span style="position: relative; top: -5px;">{{endAddress}}</span>
          </div>
          <div>
            <span>里程：{{totalDistance}} km</span><span style="float: right;">耗时：{{totalTimeSpan}}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="visible=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,

        startAddress: "加载中...",
        endAddress: "加载中...",
        totalDistance: "加载中...",
        totalTimeSpan: "加载中...",

        map: null,
        icon: {
          url: require('../images/pointSelected.png'),
          size: {
            width: 0,
            height: 0
          },
          opts: {
            imageSize: {
              width: 0,
              height: 0
            }
          }
        },
        iconSelected: {
          url: require('../images/pointSelected.png'),
          size: {
            width: 16,
            height: 16
          },
          opts: {
            imageSize: {
              width: 16,
              height: 16
            }
          }
        },
        center: {
          lng: 116.404,
          lat: 39.915
        },
        zoom: 3,
        isShowMarker: false,
        start: {
          lng: 116.404,
          lat: 39.915
        },
        end: {
          lng: 116.404,
          lat: 39.915
        },
        polylinePath: [],
        allPoints: [],
        current: null,
        selected: null,
      };
    },
    methods: {
      mousemove(e){
        this.current = null;
        var points = this.allPoints.filter(item => 
          Math.pow(e.point.lng - item.lng,2) + Math.pow(e.point.lat - item.lat,2) < 0.00001
        );
        // console.log(points.length);
        if(points.length>0){
          points = points.sort((a,b) => {
            return (Math.pow(e.point.lng - a.lng,2) + Math.pow(e.point.lat - a.lat,2)) - (Math.pow(e.point.lng - b.lng,2) + Math.pow(e.point.lat - b.lat,2));
          });
          this.current = points[0];
        }
      },
      infoWindowClose(point) {
        point.show = false;
        this.selected = null;
      },
      infoWindowOpen(point) {
        if (!point.address) {
          point.address = "加载中...";
          // 位置逆解析
          new BMap.Geocoder().getLocation(
            new BMap.Point(point.lng, point.lat),
            (rs) => {
              let addComp = rs.addressComponents;
              point.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            }
          );
        }
        point.show = true;
        this.selected = point;
      },
      handler({
        BMap,
        map
      }) {
        this.map = map;
      },
      init(carNum, startTime, endTime) {
        let _this = this;
        this.polylinePath = [];
        this.allPoints = [];
        this.$tmsService
          .get("/api/WeChat/Carrier/GetTerminalHisPos", {
            carNum: carNum,
            begin_time: _this.$utils.formateDate(startTime, "yyyy-MM-dd HH:mm:ss"),
            end_time: _this.$utils.formateDate(endTime, "yyyy-MM-dd HH:mm:ss"),
            spacing: 0,
            pageNo: 0,
            pageSize: 100000
          })
          .then(res => {
            if (res.Data.status == 1) {
              this.isShowMarker = true;
              res.Data.obj.result.detail.forEach(item => {
                this.polylinePath.push({
                  lng: item.Longitude,
                  lat: item.Latitude,
                });
                this.allPoints.push({
                  lng: item.Longitude,
                  lat: item.Latitude,
                  show: false,
                  speed: item.Speed,
                  dateTime: _this.$utils.formateDate(item.GpsTime),
                  date: _this.$utils.formateDate(item.GpsTime, "MM-dd"),
                  time: _this.$utils.formateDate(item.GpsTime, "HH:mm:ss"),
                  address: ""
                  });
              });
              
              // 初始化起点和终点
              this.start = this.allPoints[0];
              this.end = this.allPoints[this.allPoints.length - 1];
              
              this.totalDistance = res.Data.obj.result.distance / 10;

              var tick = Math.floor((new Date(this.end.dateTime) - new Date(this.start.dateTime)) / 1000);
              if(tick<=0){
                row.tick = "";
                return;
              }
              var minutes = Math.floor(tick / 60 % 60);
              var hours =  Math.floor(tick / 60 / 60 % 60);
              var days =  Math.floor(tick / 60 / 60 / 24);
              this.totalTimeSpan = (days ? days + "天" : "") + (hours ? hours + "小时" : "") + minutes + "分钟";

              // 位置逆解析
              new BMap.Geocoder().getLocation(
                new BMap.Point(this.start.lng, this.start.lat),
                (rs) => {
                  let addComp = rs.addressComponents;
                  this.startAddress =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                }
              );
              // 位置逆解析
              new BMap.Geocoder().getLocation(
                new BMap.Point(this.end.lng, this.end.lat),
                (rs) => {
                  let addComp = rs.addressComponents;
                  this.endAddress =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                }
              );
              setTimeout(()=>{
                // 获取地图的绽放级别及中心点
                let view = this.map.getViewport(this.allPoints);
                this.zoom = view.zoom - 1;
                this.center = view.center;
                this.map.centerAndZoom(new BMap.Point(this.center.lng, this.center.lat), this.zoom);
              }, 200);
            } else {
              this.isShowMarker = false;
            }
          })
          .catch(err => {
            this.isShowMarker = false;
          });
        this.visible = true;
      },
    }
  };
</script>