<style lang="less" scoped>
.info {
  background-color: #f1f2f5;
  padding: 16px;
  border-radius: 8px;
  min-height: 410px;
  .title {
    font-size: 14px;
  }
  .distance {
    display: flex;
    margin: 10px 0 20px 0;
    .item {
      flex: 1;
      text-align: center;
      img {
        width: 20px;
        vertical-align: middle;
        margin-top: -4px;
      }
      .up {
        color: #333;
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 3px;
      }
    }
    .item-middle {
      color: #409eff;
      text-align: center;
      .up {
        margin-bottom: -5px;
      }
      .down {
        margin-top: -8px;
      }
    }
  }
  .map {
    background-image: url('../images/map.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    padding: 14px;
    border-radius: 6px;
    height: 60px;
    font-size: 14px;
    position: relative;
    .marker {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #333;
      opacity: 0.5;
      line-height: 60px;
      border-radius: 6px;
      color: #FFF;
      .left {
        margin-left: 16px;
        float: left;
      }
      .right {
        float: right;
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
  .detail {
    display: flex;
    margin-top: 10px;
    font-size: 14px;
    .label {
      display: inline;
      color: #333;
      font-weight: 600;
    }
    .value {
      flex: 1;
      display: inline;
      color: #666;
    }
  }
}
.history {
  background-color: #f1f2f5;
  padding: 16px;
  border-radius: 8px;
  min-height: 410px;
}
</style>
<template>
<div>
  <Modal
    v-model="isShow" width="500"
    title="货源信息">
    <div class="info">
        <div class="distance">
          <div class="item">
            <div class="up">
              <img src="../images/circle_green.svg" alt="">
              <span>{{sourceInfo.sendCountyName}}</span>
            </div>
            <div class="down">
              <span>{{sourceInfo.sendProvinceName}}</span>
              <span>{{sourceInfo.sendCityName}}</span>
            </div>
          </div>
          <div class="item-middle">
            <div class="up">{{sourceInfo.goodsTypeName}}</div>
            <img src="../images/right_grey.svg" width="60" alt="">
            <div class="down">{{sourceInfo.goodsNum}}吨</div>
          </div>
          <div class="item">
            <div class="up">
              <img src="../images/circle_red.svg" alt="">
              <span>{{sourceInfo.getCountyName}}</span>
            </div>
            <div class="down">
              <span>{{sourceInfo.getProvinceName}}</span>
              <span>{{sourceInfo.getCityName}}</span>
            </div>
          </div>
        </div>
        <div class="map">
          <div class="marker">
            <div class="left" v-if="sourceInfo.distance">约{{sourceInfo.distance}}km</div>
            <div class="right" @click="onMapLine">查看路线&nbsp;&nbsp;<Icon type="ios-arrow-right"></Icon></div>
          </div>
        </div>
        <div class="detail">
          <div class="label">运费单价<span style="color:#409EFF">{{sourceInfo.isATax == 2 ? "(含税)" : "(不含税)"}}</span>：</div>
          <div class="value">{{sourceInfo.transportPrice}}元/吨</div>
        </div>
        <div class="detail">
          <div class="label">运输要求：</div>
          <div class="value">{{sourceInfo.carTypeValueStr + (sourceInfo.isNeedEquipment==2? ",北斗" : "") }}</div>
        </div>
        <div class="detail">
          <div class="label">装货开始时间：</div>
          <div class="value">{{sourceInfo.loadStartTime}}</div>
        </div>
        <div class="detail">
          <div class="label">装货结束时间：</div>
          <div class="value">{{sourceInfo.loadEndTime}}</div>
        </div>
        <div class="detail">
          <div class="label">发布时间：</div>
          <div class="value">{{sourceInfo.loadEndTime}}</div>
        </div>
        <div class="detail">
          <div class="label">发货地：</div>
          <div class="value">{{sourceInfo.sendLocalDesc + (sourceInfo.sendSupplementaryExplanation ? '(' + sourceInfo.sendSupplementaryExplanation + ')' : '')}}</div>
        </div>
        <div class="detail">
          <div class="label">收货地：</div>
          <div class="value">{{sourceInfo.getLocalDesc + (sourceInfo.getSupplementaryExplanation ? '(' + sourceInfo.getSupplementaryExplanation + ')' : '')}}</div>
        </div>
        <div class="detail">
          <div class="label">联系人：</div>
          <div class="value">{{sourceInfo.goodsUserName}}&nbsp;{{getTelephone(sourceInfo)}}</div>
        </div>
      </div>
    <div slot="footer">
      <Button type="primary" size="large" @click="isShow=false">关闭</Button>
    </div>
  </Modal>
  <order-detail ref="orderDetail"></order-detail>
  <waybill-detail ref="waybillDetail"></waybill-detail>
  <map-line ref="mapLine"></map-line>
</div>
</template>
<script>
import mapLine from "./map-line";
import { getUserInfo } from "../config/utils";
export default {
  props: {},
  name: "sourceDetail",
  components: {
    mapLine
  },
  data() {
    return {
      
      isShow: false,
      sourceId: "",
      sourceInfo: {},
    };
  },
  methods: {
    getTelephone(info){
      // 获取显示的电话号码
      return info.goodsTelephone ? info.goodsTelephone.substr(0,3) + "****" + info.goodsTelephone.substr(7,4) : "";
    },
    onMapLine() {
      this.$refs.mapLine.init(this.sourceInfo);
    },
    getSourceInfo() {
      this.$shipperService
        .post("/goodsSource/ObservationDetails", {
          id: this.sourceId
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询货源详情失败，请稍后重试！");
            return;
          }
          this.sourceInfo = res.data;
          this.sourceInfo.transportPrice = (this.sourceInfo.freight / 100 + "").replace(/,/g,"");
          this.sourceInfo.loadStartTime = this.$utils.formateDate(this.sourceInfo.loadStartTime,"yyyy-MM-dd HH:mm");
          this.sourceInfo.loadEndTime = this.$utils.formateDate(this.sourceInfo.loadEndTime,"yyyy-MM-dd HH:mm");
        })
        .catch(res => {
          this.$Message.error("查询货源详情出现未知错误！");
        });
    },
    init(id) {

      this.isShow = true;
      this.sourceId = id;
      this.sourceInfo = {};
      this.getSourceInfo();
    }
  }
};
</script>