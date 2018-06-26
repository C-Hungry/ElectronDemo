<style scoped lang="less">
  .map-line {
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
      min-height: 70px;
      width: 300px;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.7);
      line-height: 20px;
      font-size: 14px;
      .item {
        margin-bottom: 6px; 
        display: flex;
        .label {
          font-weight: 600;
        }
        .value {
          flex: 1;
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
    <Modal v-model="visible" title="货源线路信息" width="800">
      <div class="map-line">
        <baidu-map class="map" :center="center" :scroll-wheel-zoom="true" @ready="handler">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-driving
          :start="sendCenter"
          :end="getCenter"
          :panel="false"
          :auto-viewport="true"
          :selectFirstResult="true"></bm-driving>
          <!-- 圆 -->
          <bm-circle v-if="sendRadius > 0" :center="sendCenter" :radius="sendRadius" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2" ></bm-circle>
          <!-- 多边形 -->
          <bm-polygon v-if="sendRadius == 0" :path="sendPolygon" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"/>
          <!-- 圆 -->
          <bm-circle v-if="getRadius > 0" :center="getCenter" :radius="getRadius" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"></bm-circle>
          <!-- 多边形 -->
          <bm-polygon v-if="getRadius == 0" :path="getPolygon" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"/>
        </baidu-map>
        <div class="map-detail">
          <div class="item">
            <span class="label">发货地：</span>
            <span class="value">{{sendPlace}}{{sendSupplementaryExplanation ? '(' +  sendSupplementaryExplanation + ')' : ''}}</span>
          </div>
          <div class="item">
            <span class="label">收货地：</span>
            <span class="value">{{getPlace}}{{getSupplementaryExplanation ? '(' +  getSupplementaryExplanation + ')' : ''}}</span>
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
  data(){
    return{
      visible:false,
      map: null,
      center: {lng: 116.404, lat: 39.915},
      sendPlace: "",
      sendCenter: {},
      sendRadius: 0,
      sendPolygon: [],
      sendSupplementaryExplanation: '',
      getPlace: "",
      getCenter: {},
      getRadius: 0,
      getPolygon: [],
      getSupplementaryExplanation: '',
      isShowSendCircle: false,
      isShowGetCircle: false,
      zoom: 3,
    }
  },
  methods:{
    handler({BMap, map}){
      this.map = map;
    },
    init(data){
      // 初始化起点和终点
      this.visible = true;
      this.sendPlace = data.sendLocalDesc;
      this.sendCenter = JSON.parse(data.sendCenter);
      this.sendRadius = JSON.parse(data.sendRadius);
      this.sendPolygon = JSON.parse(data.sendPointsStr);
      this.sendSupplementaryExplanation = data.sendSupplementaryExplanation;

      this.getPlace = data.getLocalDesc;
      this.getCenter = JSON.parse(data.getCenter);
      this.getRadius = JSON.parse(data.getRadius);
      this.getPolygon = JSON.parse(data.getPointsStr);
      this.getSupplementaryExplanation = data.getSupplementaryExplanation;
    },
  },
  mounted(){}
}
</script>