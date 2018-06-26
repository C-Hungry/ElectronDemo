<style lang="less" scoped>
.info {
  background-color: #f1f2f5;
  padding: 16px;
  border-radius: 8px;
  min-height: 423px;
  .title {
    font-size: 14px;
    margin-bottom: 16px;
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
      margin-top: 12px;
      .up {
        margin-bottom: -10px;
      }
      .down {
        margin-top: -3px;
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
    margin-top: 10px;
    position: relative;
    cursor: pointer;
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
  min-height: 423px;
  .content {
    padding: 20px 40px;
    .history-item {
      position: relative;
      border-left: 1px dashed #CCC;
      padding: 1px 0 30px 36px;
      min-height: 80px;
      .name-icon {
        font-size: 12px;
        color: #FFF;
        position: absolute;
        width: 48px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        border-radius: 50%;
        background-color: #409eff;
        left: -24px; 
      } 
      .name {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 600;
      }
      .remark {
        font-size: 14px;
        font-weight: 600;
      }
      .time {
        color: #666
      }
    }
  }
}
</style>
<template>
<div>
  <Modal
    v-model="isShow" width="800"
    title="运单详情">
    <Row :gutter="16">
      <Col span="14">
        <div class="info">
          <div class="title">基本信息</div>
          <div class="detail">
            <div class="label">车牌号：</div>
            <div class="value">{{waybillInfo.carNumber}}</div>
          </div>
          <div class="detail">
            <div class="label">司机：</div>
            <div class="value">{{waybillInfo.driverName}}&nbsp;&nbsp;{{waybillInfo.driverTelephone}}</div>
          </div>
          <div class="detail">
            <div class="label">状态：</div>
            <div class="value">{{waybillInfo.statusStr}}</div>
          </div>
          <div class="detail">
            <div class="label">发货地：</div>
            <div class="value">{{waybillInfo.sendLocalDesc + (waybillInfo.sendSupplementaryExplanation ? '(' + waybillInfo.sendSupplementaryExplanation + ')' : '')}}</div>
          </div>
          <div class="detail">
            <div class="label">收货地：</div>
            <div class="value">{{waybillInfo.getLocalDesc + (waybillInfo.getSupplementaryExplanation ? '(' + waybillInfo.getSupplementaryExplanation + ')' : '')}}</div>
          </div>
          <div class="detail">
            <div class="label">承运商：</div>
            <div class="value">{{waybillInfo.companyName}}</div>
          </div>
          <div class="detail">
            <div class="label">关联订单：</div>
            <div class="value" style="color: #2D8CF0;cursor: pointer;" @click="openOrderDetail()">点击查看详情</div>
          </div>
          <div class="map" v-if="waybillInfo.status != 5">
            <div class="marker" @click="onMapTrack">
              <div class="left">车辆轨迹</div>
              <div class="right"><Icon type="ios-arrow-right"></Icon></div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="10">
        <div class="history">
          <div class="title">动态</div>
          <div class="content">
            <div v-for="(item, index) in historyList" :style="{'border-left': index == historyList.length - 1 ? 'none' : '1px dashed #CCC'}" class="history-item">
              <div class="name-icon" :style="{background: item.isStateDone ? '' : '#ccc'}">{{item.statusStr}}</div>
              <div class="name" :style="{color: item.isStateDone ? '#409eff' : '#ccc'}">{{item.statusStr}}</div>
              <div class="time">{{item.time}}</div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div slot="footer">
      <Button type="primary" size="large" @click="isShow=false">关闭</Button>
    </div>
    <order-detail v-if="isShow" ref="orderDetail"></order-detail>
  </Modal>
  <map-track ref="mapTrack"></map-track>
</div>
</template>
<script>
import MapTrack from "./map-track";
import { getUserInfo } from "../config/utils";
export default {
  components: {
    MapTrack
  },
  props: {},
  data() {
    return {
      userType: 1,
      isShow: false,
      waybillId: "",
      waybillInfo: {},
      historyList: []
    };
  },
  methods: {
    openOrderDetail() {
      this.$refs.orderDetail.init(this.waybillInfo.orderId);
    },
    onMapTrack() {
      let startTime = this.waybillInfo.dispatchTime;
      let endTime = this.waybillInfo.receiveTime || new Date();
      this.$refs.mapTrack.init(this.waybillInfo.carNumber, startTime, endTime);
    },
    getWaybillInfo() {
      if(this.userType == 1){
        this.$consignerService
          .post("/waybill/queryWaybillInfo", {
            id: this.waybillId
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error("查询订单详情失败，请稍后重试！");
              return;
            }
            this.waybillInfo = res.data;
             // 1 已派车 2 已发货 3 收货 4 已回单 5 已撤销

            let dispatchStep = {
              time: this.$utils.formateDate(res.data.dispatchTime,"yyyy-MM-dd HH:mm"),
              status: 1,
              statusStr: "派车",
              isStateDone: !!res.data.dispatchTime,
            }
            let sendStep = {
              time: res.data.sendTime && this.$utils.formateDate(res.data.sendTime,"yyyy-MM-dd HH:mm"),
              status: 2,
              statusStr: "发货",
              isStateDone:  !!res.data.sendTime,
            }
            let receiveStep = {
              time: res.data.receiveTime &&  this.$utils.formateDate(res.data.receiveTime,"yyyy-MM-dd HH:mm"),
              status: 3,
              statusStr: "收货",
              isStateDone:  !!res.data.receiveTime,
            }
            let receiptStep = {
              time:  res.data.receiptTime && this.$utils.formateDate(res.data.receiptTime,"yyyy-MM-dd HH:mm"),
              status: 4,
              statusStr: "回单",
              isStateDone:  !!res.data.receiptTime,
            }
            let cancelStep = {
              time:  res.data.cancelTime && this.$utils.formateDate(res.data.cancelTime,"yyyy-MM-dd HH:mm"),
              status: 5,
              statusStr: "已撤销",
              isStateDone:  !!res.data.cancelTime,
            }

            if(res.data.status == 5 && res.data.sendTime) {
              this.historyList = [dispatchStep, sendStep, cancelStep];
              return;
            }
            if(res.data.status == 5 && !res.data.sendTime) {
              this.historyList = [dispatchStep, cancelStep];
              return;
            }

            this.historyList = [dispatchStep, sendStep, receiptStep, receiveStep];
          })
          .catch(res => {
            this.$Message.error("查询货源订单出现未知错误！");
          });
      }
      else{
        this.$shipperService
          .post("/Waybill/selectById", {
            id: this.waybillId
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error("查询订单详情失败，请稍后重试！");
              return;
            }
            this.waybillInfo = res.data;
            // 1 已派车 2 已发货 3 收货 4 已回单 5 已撤销

            let dispatchStep = {
              time: this.$utils.formateDate(res.data.dispatchTime,"yyyy-MM-dd HH:mm"),
              status: 1,
              statusStr: "派车",
              isStateDone: !!res.data.dispatchTime,
            }
            let sendStep = {
              time: res.data.sendTime && this.$utils.formateDate(res.data.sendTime,"yyyy-MM-dd HH:mm"),
              status: 2,
              statusStr: "发货",
              isStateDone:  !!res.data.sendTime,
            }
            let receiveStep = {
              time: res.data.receiveTime &&  this.$utils.formateDate(res.data.receiveTime,"yyyy-MM-dd HH:mm"),
              status: 3,
              statusStr: "收货",
              isStateDone:  !!res.data.receiveTime,
            }
            let receiptStep = {
              time:  res.data.receiptTime && this.$utils.formateDate(res.data.receiptTime,"yyyy-MM-dd HH:mm"),
              status: 4,
              statusStr: "回单",
              isStateDone:  !!res.data.receiptTime,
            }
            let cancelStep = {
              time:  res.data.cancelTime && this.$utils.formateDate(res.data.cancelTime,"yyyy-MM-dd HH:mm"),
              status: 5,
              statusStr: "已撤销",
              isStateDone:  !!res.data.cancelTime,
            }

            if(res.data.status == 5 && res.data.sendTime) {
              this.historyList = [dispatchStep, sendStep, cancelStep];
              return;
            }
            if(res.data.status == 5 && !res.data.sendTime) {
              this.historyList = [dispatchStep, cancelStep];
              return;
            }

            this.historyList = [dispatchStep, sendStep, receiptStep, receiveStep];
          })
          .catch(res => {
            this.$Message.error("查询货源订单出现未知错误！");
          });
      }
    },
    init(id) {

      var userInfo = getUserInfo();
      if(userInfo) this.userType = userInfo.userType;
      
      this.isShow = true;
      this.waybillId = id;
      this.getWaybillInfo();
    }
  }
};
</script>