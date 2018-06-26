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
    font-size: 14px;
    display: flex;
    margin-top: 10px;
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
    title="货源信息">
    <Tabs type="card" v-model="tabValue" @on-click="onTabsClick">
      <TabPane label="货源详情" name="sourceInfo">
        <Row :gutter="16">
          <Col span="14">
            <div class="info">
              <div class="title">基本信息</div>
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
                <div class="value">{{sourceInfo.createTime || '待发布...'}}</div>
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
                <div class="value">{{sourceInfo.goodsUserName}}&nbsp;{{sourceInfo.goodsTelephone}}</div>
              </div>
            </div>
          </Col>
          <Col span="10" style="height: 100%">
            <div class="history">
              <div class="title">操作历史</div>
              <div class="content">
                <div v-for="(item, index) in historyList" :style="{'border-left': index == historyList.length - 1 ? 'none' : '1px dashed #CCC'}" class="history-item">
                  <div class="name-icon" :style="{background: item.isDone ? '#409eff' : '#ccc'}">{{item.statusStr}}</div>
                  <div class="name" :style="{color: item.isDone ? '' : '#ccc'}">{{item.statusStr}}</div>
                  <div class="remark" v-if="item.remark">备注：{{item.remark}}</div>
                  <div class="time">{{item.time}}</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="订单列表" name="orderList">
        <Table border :loading="orderloading" :columns="orderColumns" :data="orderList"></Table>
        <Page style="margin-top: 16px;" :total="orderTotal" @on-change="onOrderPageIndexChange" show-total size="small"></Page>
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
  <audit-order ref="auditOrder" @refresh="onRefresh"></audit-order>
  <order-detail ref="orderDetail"></order-detail>
  <waybill-detail ref="waybillDetail"></waybill-detail>
  <map-line ref="mapLine"></map-line>
</div>
</template>
<script>
import auditOrder from "./auditOrder";
import mapLine from "./map-line";
export default {
  props: {},
  name: "sourceDetail",
  components: {
    auditOrder,
    mapLine
  },
  data() {
    return {
      isShow: false,
      tabValue: "sourceInfo",
      sourceId: "",
      sourceInfo: {},
      historyList: [],
      orderloading: false,
      orderTotal: 0,
      orderPageIndex: 1,
      orderList: [],
      waybillloading: false,
      waybillTotal: 0,
      waybillPageIndex: 1,
      waybillList: [],
      orderColumns: [
        {
          title: "承运公司",
          key: "transportName",
          minWidth: 90
        },
        {
          title: "抢单数量",
          key: "goodsNum",
          minWidth: 90
        },
        {
          title: "抢单时间",
          key: "createTime",
          minWidth: 135
        },
        {
          title: "状态",
          key: "orderStatusStr",
          minWidth: 90
        },
        {
          title: "备注",
          key: "grabDesc",
          minWidth: 120,
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          fixed: "right",
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "Button", {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$refs.orderDetail.init(params.row.id);
                    }
                  }
                },
                "详情"
              ),
              params.row.orderStatus != 1 ? '' : h(
                "Button", {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$refs.auditOrder.init(params.row.id);
                    }
                  }
                },
                "审批"
              ),
              params.row.orderStatus == 4 ? h(
                "Button", {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.deleteOrder(params.row.id);
                    }
                  }
                },
                "删除"
              ) : ''
            ]);
          }
        }
      ],
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
    onTabsClick(name) {
      switch (name) {
        case "sourceInfo":
          this.getSourceInfo();
          break;
        case "orderList":
          this.getOrderList();
          break;
        case "waybillList":
          this.getWaybillList();
          break;
      }
    },
    onMapLine() {
      this.$refs.mapLine.init(this.sourceInfo);
    },
    onRefresh() {
      this.getOrderList();
    },
    onOrderPageIndexChange(index) {
      this.orderPageIndex = index;
      this.getOrderList();
    },
    onWaybillPageIndexChange(index) {
      this.waybillPageIndex = index;
      this.getWaybillList();
    },
    getSourceInfo() {
      this.$consignerService
        .get("/goods-source/queryGoodsSourceInfo", {
          id: this.sourceId
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error("查询货源详情失败，请稍后重试！");
            return;
          }
          this.sourceInfo = res.data;
          this.sourceInfo.transportPrice = this.sourceInfo.transportPrice.replace(/,/g,"");
          this.sourceInfo.loadStartTime = this.$utils.formateDate(this.sourceInfo.loadStartTime,"yyyy-MM-dd HH:mm");
          this.sourceInfo.loadEndTime = this.$utils.formateDate(this.sourceInfo.loadEndTime,"yyyy-MM-dd HH:mm");
          this.sourceInfo.createTime = this.$utils.formateDate(this.sourceInfo.createTime,"yyyy-MM-dd HH:mm");
          this.sourceInfo.updateTime = this.$utils.formateDate(this.sourceInfo.updateTime,"yyyy-MM-dd HH:mm");
        
          // 发布
          let firstStep = {
            time: this.sourceInfo.createTime,
            isDone: !!res.data.createTime,
            status: 1,
            statusStr: '发布'
          }

          let secondStep = {};

          if (this.sourceInfo.goodsSourceStage == '4') {
            //下架 
            secondStep = {
              time: this.sourceInfo.updateTime,
              isDone: !!res.data.updateTime,
              status: res.data.goodsSourceStage,
              statusStr:  '下架',
            }
            this.historyList = [firstStep, secondStep];
            return;
          }
          
          if (this.sourceInfo.goodsSourceStage == '5') {
            //过期
            secondStep = {
              time: this.sourceInfo.updateTime,
              isDone: !!res.data.updateTime,
              status: res.data.goodsSourceStage,
              statusStr:  '过期'
            }
            this.historyList = [firstStep, secondStep];
            return;
          }

          this.historyList = [firstStep]
        
        })
        .catch(res => {
          this.$Message.error("查询货源详情出现未知错误！");
        });
    },
    getOrderList() {
      this.orderloading = true;
      this.$consignerService
        .post("/order/queryOrderListWeb", {
          dto: {
            goodsId: this.sourceId,
            currentPage: this.orderPageIndex,
            pageSize: 10
          }
        })
        .then(res => {
          this.orderloading = false;
          if (!res.success) {
            this.$Message.error("查询订单列表失败，请稍后重试！");
            return;
          }
          res.data.map(item => {
            item.createTime = this.$utils.formateDate(item.createTime,"yyyy-MM-dd HH:mm");
            item.goodsNum = item.goodsNum + "吨";
            return item;
          });
          this.orderList = res.data;
          this.orderTotal = res.total;
        })
        .catch(res => {
          this.orderloading = false;
          this.$Message.error("查询订单列表出现未知错误，请稍后重试！");
        });
    },
    getWaybillList() {
      this.waybillloading = true;
      this.$consignerService
        .post("/waybill/queryWaybillListWeb", {
          dto: {
            goodsId: this.sourceId,
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
    },
    // 删除订单
    deleteOrder(id) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>您确定要删除此订单吗？</p>',
        loading: true,
        onOk: () => {
          this.$consignerService
            .post("/order/deleteOrderById", {
              id: id
            })
            .then(res => {
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Modal.remove();
              this.$Message.success('删除订单成功！');
              this.getOrderList();
            })
            .catch(res => {
              this.$Modal.remove();
              this.$Message.error("删除订单出现未知错误！");
            });
        }
      });
    },
    init(id) {
      this.isShow = true;
      this.sourceId = id;
      this.tabValue = "sourceInfo";
      this.sourceInfo = {};
      this.orderList = [];
      this.waybillList = [];
      this.getSourceInfo();
    }
  }
};
</script>