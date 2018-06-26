<style lang="less" scoped>
.info {
  background-color: #f1f2f5;
  padding: 16px;
  border-radius: 8px;
  min-height: 410px;
  .title {
    font-size: 14px;
  }
  .header {
    font-size: 15px;
    font-weight: 600;
    margin-top: 16px;
    .icon {
      color: #FFF;
      font-size: 13px;
      background-color: #83DA44;
      display: inline-block;
      width: 18px;
      height: 18px;
      text-align: center;
      border-radius: 2px;
      margin-right: 3px;
    }
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
    margin-top: 10px;
    display: flex;
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
  .content {
    padding: 20px 10px 20px 40px;
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
    title="订单详情">
    <Tabs type="card" v-model="tabValue" @on-click="onTabsClick">
      <TabPane label="基本信息" name="orderInfo">
        <Row :gutter="16">
          <Col span="14">
            <div class="info">
              <div class="title">基本信息</div>
              <div class="header">
                <span class="icon">运</span>
                <span>{{orderInfo.transportName}}</span>
              </div>
              <div class="distance">
                <div class="item">
                  <div class="up">
                    <img src="../images/circle_green.svg" alt="">
                    <span>{{orderInfo.sendCountyName}}</span>
                  </div>
                  <div class="down">
                    <span>{{orderInfo.sendProvinceName}}</span>
                    <span>{{orderInfo.sendCityName}}</span>
                  </div>
                </div>
                <div class="item-middle">
                  <div class="up">{{orderInfo.goodsTypeName}}</div>
                  <img src="../images/right_grey.svg" width="60" alt="">
                  <div class="down">抢：{{orderInfo.goodsNum}}</div>
                </div>
                <div class="item">
                  <div class="up">
                    <img src="../images/circle_red.svg" alt="">
                    <span>{{orderInfo.getCountyName}}</span>
                  </div>
                  <div class="down">
                    <span>{{orderInfo.getProvinceName}}</span>
                    <span>{{orderInfo.getCityName}}</span>
                  </div>
                </div>
              </div>
              <div class="map">
                <div class="marker">
                  <div class="left" v-if="orderInfo.distance">约{{orderInfo.distance}}km</div>
                  <div class="right" @click="onMapLine">查看路线&nbsp;&nbsp;<Icon type="ios-arrow-right"></Icon></div>
                </div>
              </div>              
              <div class="detail">
                <div class="label">运费单价<span style="color:#409EFF">{{orderInfo.isATax == 2 ? "(含税)" : "(不含税)"}}</span>：</div>
                <div class="value">{{orderInfo.transportPrice}}元/吨</div>
              </div>
              <div class="detail">
                <div class="label">抢单数量：</div>
                <div class="value">{{orderInfo.goodsNum}}</div>
              </div>
              <div class="detail">
                <div class="label">抢单时间：</div>
                <div class="value">{{orderInfo.createTime}}</div>
              </div>
              <div class="detail">
                <div class="label">生效时间：</div>
                <div class="value">{{orderInfo.updateTime || '未生效'}}</div>
              </div>
              <div class="detail">
                <div class="label">发货地：</div>
                <div class="value">{{orderInfo.sendLocalDesc + (orderInfo.sendSupplementaryExplanation ? '(' + orderInfo.sendSupplementaryExplanation + ')' : '')}}</div>
              </div>
              <div class="detail">
                <div class="label">收货地：</div>
                <div class="value">{{orderInfo.getLocalDesc + (orderInfo.getSupplementaryExplanation ? '(' + orderInfo.getSupplementaryExplanation + ')' : '')}}</div>
              </div>
              <div v-if="userType==2" class="detail">
                <div class="label">联系人：</div>
                <div class="value">{{orderInfo.goodsUserName}}&nbsp;{{getTelephone(orderInfo)}}</div>
              </div>
              <div v-if="userType==1" class="detail">
                <div class="label">联系人：</div>
                <div class="value">{{orderInfo.transportName}}&nbsp;{{orderInfo.transportTelephone}}</div>
              </div>            
              </div>
            </Col>
          <Col span="10">
            <div class="history">
              <div class="title">操作历史</div>
              <div class="content">
                <div v-for="(item, index) in historyList" :style="{'border-left': index == historyList.length - 1 ? 'none' : '1px dashed #CCC'}" class="history-item">
                  <div class="name-icon" :style="{background: item.isDone ? '#409eff' : '#ccc'}">{{item.name}}</div>
                  <div class="name" :style="{color: item.isDone ? '' : '#ccc'}">{{item.name}}&nbsp;&nbsp;{{item.statusStr}}</div>
                  <div class="remark" v-if="item.remark">备注：{{item.remark}}</div>
                  <div class="time">{{item.time}}</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="运单列表" name="waybillList">
        <Table border :loading="waybillloading" :columns="waybillColumns" :data="waybillList"></Table>
        <Page style="margin-top: 16px;" :total="waybillTotal" @on-change="onWaybillPageIndexChange" show-total size="small"></Page>
      </TabPane>
    </Tabs>
    <div slot="footer">
      <Button type="primary" size="large" @click="isShow=false">关闭</Button>
    </div>
  </Modal>
  <waybill-detail ref="waybillDetail"></waybill-detail>  
  <map-line ref="mapLine"></map-line>
</div>
</template>
<script>
import mapLine from "./map-line";
import { getUserInfo } from "../config/utils";
export default {
  name: "orderDetail",
  components: {
    mapLine
  },
  props: {},
  data() {
    return {
      userType: 1,
      isShow: false,
      tabValue: "orderInfo",
      orderId: "",
      orderInfo: {},
      historyList: [],
      waybillloading: false,
      waybillTotal: 0,
      waybillPageIndex: 1,
      waybillList: [],
      waybillColumns: [
        {
          title: "车牌号",
          key: "carNumber",
          minWidth: 90
        },
        {
          title: "司机",
          key: "driverName",
          minWidth: 90
        },
        {
          title: "派单时间",
          key: "dispatchTime",
          minWidth: 140
        },
        {
          title: "状态",
          key: "statusStr",
          minWidth: 80
        },
        {
          title: "承运商",
          key: "companyName",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$refs.waybillDetail.init(params.row.id)
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    getTelephone(info){
      // 获取显示的电话号码
      if(info.orderStatus == 1 || info.orderStatus == 2){
        return info.goodsTelephone.substr(0,3) + "****" + info.goodsTelephone.substr(7,4);
      }
      return info.goodsTelephone;
    },
    onTabsClick(name) {
      switch (name) {
        case "orderInfo":
          this.getOrderInfo();
          break;
        case "waybillList":
          this.getWaybillList();
          break;
      }
    },
    onMapLine() {
      this.$refs.mapLine.init(this.orderInfo);
    },
    onWaybillPageIndexChange(index) {
      this.waybillPageIndex = index;
      this.getWaybillList();
    },
    getOrderInfo() {

      if(this.userType == 1){
        //货主
        this.$consignerService
          .get("/order/queryOrderInfo", {
            id: this.orderId
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error("查询订单详情失败，请稍后重试！");
              return;
            }
            this.orderInfo = res.data;
            this.orderInfo.goodsNum = this.orderInfo.goodsNum + "吨";
            this.orderInfo.createTime = this.$utils.formateDate(this.orderInfo.createTime, "yyyy-MM-dd HH:mm");
            this.orderInfo.updateTime = this.$utils.formateDate(this.orderInfo.updateTime, "yyyy-MM-dd HH:mm");

            // 抢单
            let firstStep = {
              time: this.orderInfo.createTime,
              name: res.data.transportName,
              isDone: !!res.data.createTime,
              status: 1,
              statusStr: '抢货源',
              remark: res.data.grabDesc,
            }

            //审批 
            let secondStep = {
              time: this.orderInfo.updateTime,
              name: res.data.goodsUserName,
              isDone: res.data.orderStatus != 1,
              status: res.data.orderStatus,
              statusStr:  res.data.orderStatusStr,
              remark: res.data.reason,
            }

            this.historyList = [firstStep, secondStep];
          })
          .catch(res => {
            this.$Message.error("查询货源订单出现未知错误！");
          });
      }
      else{
        //承运商
        this.$shipperService
          .post("/order/selectById", {
            id: this.orderId
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error("查询订单详情失败，请稍后重试！");
              return;
            }
            this.orderInfo = res.data;
            this.orderInfo.goodsNum = this.orderInfo.goodsNum + "吨";
            this.orderInfo.createTime = this.$utils.formateDate(this.orderInfo.createTime, "yyyy-MM-dd HH:mm");
            this.orderInfo.updateTime = this.$utils.formateDate(this.orderInfo.updateTime, "yyyy-MM-dd HH:mm");

            // 抢单
            let firstStep = {
              time: this.orderInfo.createTime,
              name: res.data.transportName,
              isDone: !!res.data.createTime,
              status: 1,
              statusStr: '抢货源',
              remark: res.data.grabDesc,
            }

            //审批 
            let secondStep = {
              time: this.orderInfo.updateTime,
              name: res.data.goodsUserName,
              isDone: res.data.orderStatus != 1,
              status: res.data.orderStatus,
              statusStr:  res.data.orderStatusStr,
              remark: res.data.reason,
            }

            this.historyList = [firstStep, secondStep];
          })
          .catch(res => {
            this.$Message.error("查询货源订单出现未知错误！");
          });
      }
    },
    getWaybillList() {
      this.waybillloading = true;

      if(this.userType == 1){
        //货主
        this.$consignerService
          .post("/waybill/queryWaybillListWeb", {
            dto: {
              orderId: this.orderId,
              currentPage: this.waybillPageIndex,
              pageSize: 10
            }
          })
          .then(res => {
            this.waybillloading = false;
            if (!res.success) {
              this.$Message.error("查询运单列表失败，请稍后重试！");
              return;
            }
            res.data.map(item => {
              item.dispatchTime = this.$utils.formateDate(item.dispatchTime,"yyyy-MM-dd HH:mm");
              return item;
            });
            this.waybillList = res.data;
            this.waybillTotal = res.total;
          })
          .catch(res => {
            this.waybillloading = false;
            this.$Message.error("查询运单列表出现未知错误，请稍后重试！");
          });
      }
      else{
        //承运商
        this.$shipperService
          .post("/Waybill/selectAllForPc", {
            pcInOrderDto: {
              orderId: this.orderId,
              currentPage: this.waybillPageIndex,
              pageSize: 10
            },
            currentPage: this.waybillPageIndex,
            pageSize: 10
          })
          .then(res => {
            this.waybillloading = false;
            if (!res.success) {
              this.$Message.error("查询运单列表失败，请稍后重试！");
              return;
            }
            res.data.map(item => {
              item.dispatchTime = this.$utils.formateDate(item.dispatchTime,"yyyy-MM-dd HH:mm");
              return item;
            });
            this.waybillList = res.data;
            this.waybillTotal = res.total;
          })
          .catch(res => {
            this.waybillloading = false;
            this.$Message.error("查询运单列表出现未知错误，请稍后重试！");
          });
      }

    },
    init(id, tabValue) {

      var userInfo = getUserInfo();
      if(userInfo) this.userType = userInfo.userType;

      this.isShow = true;
      this.orderId = id;
      this.tabValue = tabValue || "orderInfo";
      this.orderInfo = {};
      this.waybillList = [];
      if (this.tabValue == 'orderInfo') {
        this.getOrderInfo();
      } else {
        this.getWaybillList();
      }
    }
  }
};
</script>