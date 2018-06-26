<style scoped lang="less">
.index {
  .header {
    .header-item {
      margin-right: 16px;
      margin-bottom: 16px;
      display: inline-block;
      .label {
        display: inline-block;
      }
    }
  }
}
</style>

<template>
  <div class="index">
    <div class="header">
      <div class="header-item">
        <div class="label">抢单时间：</div>
        <DatePicker v-model="createBeforeTime" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
        <span>至</span>
        <DatePicker v-model="createAfterTime" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
      </div>
      <div class="header-item">
        <div class="label">发货地：</div>
        <Cascader style="display: inline-block;" :data="addressData" v-model="sendPlace"></Cascader>
      </div>
      <div class="header-item">
        <div class="label">收货地：</div>
        <Cascader style="display: inline-block;"  :data="addressData" v-model="receivePlace"></Cascader>
      </div>
      <div class="header-item">
        <div class="label">状态：</div>
        <Select v-model="orderStatus" style="width:160px">
          <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="header-item">
        <Button type="primary" style="margin-right: 16px;" icon="ios-search" @click.native="onSearch">查询</Button>
      </div>
    </div>
    <div class="main">
      <Table border :loading="loading" :columns="tableColumns" :data="orderList"></Table>
      <Page style="margin-top: 16px;" :current="pageIndex" :page-size="pageSize" :total="total" @on-change="onPageIndexChange" @on-page-size-change="onPageSizeChane" show-elevator show-total></Page>
    </div>
    <order-detail ref="orderDetail"></order-detail>
    <audit-order ref="auditOrder" @refresh="onRefresh"></audit-order>
  </div>
</template>

<script>
import auditOrder from '../../components/auditOrder';
import { getAllArea } from "../../config/utils";
export default {
  components: {
    auditOrder
  },
  data() {
    return {
      loading: false,
      createBeforeTime: "", // 抢单时间
      createAfterTime: "", // 抢单时间
      sendPlace: [], // 发货地址
      receivePlace: [], // 收货地址
      addressData: [], // 三级联动数据
      orderStatus: 0,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      orderStatusList: [],
      orderList: [],
      tableColumns: [
        {
          title: "发货地",
          key: "sendPlace",
          minWidth: 200
        },
        {
          title: "收货地",
          key: "receivePlace",
          minWidth: 200
        },
        {
          title: "货物",
          key: "goodsTypeName",
          minWidth: 80
        },
        {
          title: "抢单数量",
          key: "goodsNum",
          minWidth: 100
        },
        {
          title: "运费",
          key: "transportPrice",
          minWidth: 120
        },
        {
          title: "是否含税",
          key: "isATaxStr",
          minWidth: 100
        },
        {
          title: "承运商",
          key: "transportName",
          minWidth: 100
        },
        {
          title: "关联运单",
          key: "waybillNum",
          minWidth: 100,
          render: (h, params) =>{
            return h("a",{
              style: {
                marginRight: "5px"
              },
              on: {
                click: () => {
                  this.$refs.orderDetail.init(params.row.id, 'waybillList');
                }
              }
            }, params.row.waybillNum)
          }
        },
        {
          title: "抢单时间",
          key: "createTime",
          minWidth: 140
        },
        {
          title: "生效时间",
          key: "updateTime",
          minWidth: 140
        },
        {
          title: "状态",
          key: "orderStatusStr",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          fixed: 'right',
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
              params.row.orderStatus == 1 ? h(
                "Button", {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$refs.auditOrder.init(params.row.id);
                    }
                  }
                },
                "审核"
              ) : '',
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
    };
  },
  methods: {
    //监听页码变化
    onPageIndexChange(num) {
      this.pageIndex = num;
      this.getOrderList();
    },
    //监听页码变化
    onPageSizeChane(num) {
      this.pageSize = num;
      this.pageIndex = 1;
      this.getOrderList();
    },
    // 刷新
    onRefresh() {
      this.getOrderList();
    },
    // 获取地址信息
    getAddressData() {
      this.addressData = getAllArea();
    },
    getOrderStatusList() {
      // 订单状态 1--待确认 2--已撤销 3--已确认 4--已拒绝 ,
      this.orderStatusList= [
        {
          label: "全部",
          value: 0
        },
        {
          label: "待确认",
          value: 1
        },
        {
          label: "已确认",
          value: 3
        },
        {
          label: "已撤销",
          value: 2
        },
        {
          label: "已拒绝",
          value: 4
        },
      ]
    },
    onSearch() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getOrderList();
    },
    getOrderList() {
      this.loading = true;
      this.$consignerService
        .post('/order/queryOrderListWeb', {
          dto: {
            "createAfterTime": this.$utils.formateDate(this.createAfterTime, "yyyy-MM-dd"),
            "createBeforeTime": this.$utils.formateDate(this.createBeforeTime, "yyyy-MM-dd"),
            "currentPage": this.pageIndex,
            "pageSize": this.pageSize,
            "getCity": this.receivePlace.length > 0 ? this.receivePlace[1] : "",
            "getCounty": this.receivePlace.length > 0 ? this.receivePlace[2] : "",
            "getProvince": this.receivePlace.length > 0 ? this.receivePlace[0] : "",
            "sendCity": this.sendPlace.length > 0 ? this.sendPlace[1] : "",
            "sendCounty": this.sendPlace.length > 0 ? this.sendPlace[2] : "",
            "sendProvince": this.sendPlace.length > 0 ? this.sendPlace[0] : "",
            "orderStatus": this.orderStatus
          }
        })
        .then(res => {
          this.loading = false;
          if (!res.success) {
            this.$Message.error('查询订单列表失败，请稍后重试！');
            return;
          }

          res.data.map((item)=>{
            item.sendPlace = item.sendLocalDesc + (item.sendSupplementaryExplanation ? '(' + item.sendSupplementaryExplanation + ')' : '');
            item.receivePlace = item.getLocalDesc + (item.getSupplementaryExplanation ? '(' + item.getSupplementaryExplanation + ')' : '');
            item.goodsNum = item.goodsNum + "吨";
            item.transportPrice = item.transportPrice + "元/吨";
            item.transportPrice = item.transportPrice.replace(/,/g, '');
            item.isATaxStr = item.isATax == 2 ? '含税' : '不含税';
            item.isNeedEquipmentStr = item.isNeedEquipment == 2 ? '需要' : '不需要';
            item.updateTime = this.$utils.formateDate(item.updateTime, 'yyyy-MM-dd HH:mm');
            item.createTime = this.$utils.formateDate(item.createTime, 'yyyy-MM-dd HH:mm');
            return item;
          })
          this.total = res.total;
          this.orderList = res.data;
        })
        .catch(error => {
          console.log(error)
          this.loading = false;
          this.$Message.error('查询订单列表出现未知错误！');
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
  },
  mounted() {
    this.getAddressData();
    this.getOrderStatusList();
    this.getOrderList();
  }
};
</script>
