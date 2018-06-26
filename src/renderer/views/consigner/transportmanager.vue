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
        <div class="label">派单时间：</div>
        <DatePicker v-model="dispatchBeforeTime" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
        <span>至</span>
        <DatePicker v-model="dispatchAfterTime" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
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
        <Select v-model="waybillStatus" style="width:160px">
          <Option v-for="item in waybillStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="header-item">
        <Button type="primary" style="margin-right: 16px;" icon="ios-search" @click.native="onSearch">查询</Button>
      </div>
    </div>
    <div class="main">
      <Table border :loading="loading" :columns="tableColumns" :data="waybillList"></Table>
      <Page style="margin-top: 16px;" :current="pageIndex" :page-size="pageSize" :total="total" @on-change="onPageIndexChange" @on-page-size-change="onPageSizeChane" show-elevator show-total></Page>
    </div>
    <waybill-detail ref="waybillDetail"></waybill-detail>
    <order-detail ref="orderDetail"></order-detail>
    <map-track ref="mapTrack"></map-track>
    <map-trace ref="mapTrace"></map-trace>
  </div>
</template>

<script>
import MapTrack from "../../components/map-track";
import MapTrace from "../../components/map-trace";
import { getAllArea } from "../../config/utils";
export default {
  components: {
    MapTrack,
    MapTrace
  },
  data() {
    return {
      loading: false,
      dispatchBeforeTime: "", // 抢单时间
      dispatchAfterTime: "", // 抢单时间
      sendPlace: [], // 发货地址
      receivePlace: [], // 收货地址
      addressData: [], // 三级联动数据
      waybillStatus: 0,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      waybillStatusList: [],
      waybillList: [],
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
          title: "货主",
          key: "goodsUserName",
          minWidth: 100
        },
        {
          title: "承运方",
          key: "companyName",
          minWidth: 100
        },
        {
          title: "车牌号",
          key: "carNumber",
          minWidth: 100
        },
        {
          title: "司机",
          key: "driverName",
          minWidth: 100
        },
        {
          title: "关联订单",
          key: "transportName",
          minWidth: 90,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.$refs.orderDetail.init(params.row.orderId);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        },
        {
          title: "派车时间",
          key: "dispatchTime",
          minWidth: 140
        },
        {
          title: "状态",
          key: "statusStr",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          width: 140,
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
                    'click': () => {
                      this.$refs.waybillDetail.init(params.row.id);
                    }
                  }
                }, 
                "详情"
              ),
              params.row.status == 5 ? '' : h(
                "Dropdown", {
                  props: {
                    trigger: "click",
                    transfer: true
                  },
                  on: {
                    "on-click": status => {
                      switch (status) {
                        case "confirm": 
                          this.updateWaybillStatus(params.row.id);
                          break;
                        case "trace": 
                          this.$refs.mapTrace.init(params.row.carNumber);
                          break;
                        case "track": 
                          let startTime = params.row.dispatchTime;
                          let endTime = params.row.receiveTime || new Date();
                          this.$refs.mapTrack.init(params.row.carNumber, startTime, endTime);
                          break;
                      }
                    }
                  },
                  scopedSlots: {
                    list: function (props) {
                      return h("DropdownMenu", [
                        // params.row.status == 1 || params.row.status == 2 ? h(
                        //   "DropdownItem", {
                        //     props: {
                        //       name: "trace"
                        //     },
                        //     style: {
                        //       textAlign: 'center'
                        //     },
                        //   },
                        //   "跟踪"
                        // ) : '', 
                        params.row.status == 1 || params.row.status == 2 || params.row.status == 4 ? h(
                          "DropdownItem", {
                            props: {
                              name: "confirm"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "确认收货"
                        ) : '', 
                        params.row.status == 5 ? '' : h(
                          "DropdownItem", {
                            props: {
                              name: "track"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "轨迹"
                        ),
                      ]);
                    }
                  }
                }, [
                  h(
                    "Button", {
                      props: {
                        type: 'ghost',
                        size: 'small'
                      }
                    }, [
                      "更多",
                      h("Icon", {
                        style: {
                          marginLeft: "5px"
                        },
                        props: {
                          type: "arrow-down-b"
                        }
                      })
                    ]
                  )
                ]
              )
            ]);
          },
        }
      ]
    };
  },
  methods: {
    //监听页码变化
    onPageIndexChange(num) {
      this.pageIndex = num;
      this.getWaybillList();
    },
    //监听页码变化
    onPageSizeChane(num) {
      this.pageSize = num;
      this.pageIndex = 1;
      this.getWaybillList();
    },
    // 获取地址信息
    getAddressData() {
      this.addressData = getAllArea();
    },
    getWaybillStatusList() {
      // 1 已派车 2 已发货 3 收货 4 已回单 5 已撤销
      this.waybillStatusList= [
        {
          label: "全部",
          value: 0
        },
        {
          label: "已派车",
          value: 1
        },
        {
          label: "已发货",
          value: 2
        },
        {
          label: "已收货",
          value: 3
        },
        {
          label: "已回单",
          value: 4
        },
        {
          label: "已撤销",
          value: 5
        }
      ]
    },
    onSearch() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getWaybillList();
    },
    getWaybillList() {
      this.loading = true;
      this.$consignerService
        .post('/waybill/queryWaybillListWeb', {
          dto: {
            "dispatchAfterTime": this.$utils.formateDate(this.dispatchAfterTime, "yyyy-MM-dd"),
            "dispatchBeforeTime": this.$utils.formateDate(this.dispatchBeforeTime, "yyyy-MM-dd"),
            "currentPage": this.pageIndex,
            "pageSize": this.pageSize,
            "getCity": this.receivePlace.length > 0 ? this.receivePlace[1] : "",
            "getCounty": this.receivePlace.length > 0 ? this.receivePlace[2] : "",
            "getProvince": this.receivePlace.length > 0 ? this.receivePlace[0] : "",
            "sendCity": this.sendPlace.length > 0 ? this.sendPlace[1] : "",
            "sendCounty": this.sendPlace.length > 0 ? this.sendPlace[2] : "",
            "sendProvince": this.sendPlace.length > 0 ? this.sendPlace[0] : "",
            "status": this.waybillStatus
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
            item.dispatchTime = this.$utils.formateDate(item.dispatchTime, 'yyyy-MM-dd HH:mm');
            return item;
          })
          this.total = res.total;
          this.waybillList = res.data;
        })
        .catch(error => {
          console.log(error)
          this.loading = false;
          this.$Message.error('查询订单列表出现未知错误！');
        });
    },
    // 删除货源
    updateWaybillStatus(id) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>您确定要确认收货吗？</p>',
        loading: true,
        onOk: () => {
          this.$consignerService
            .post("/waybill/updateWaybillStatus", {
              id: id,
              status: 3 
            })
            .then(res => {
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Modal.remove();
              this.$Message.success('确认收货成功！');
              this.getWaybillList();
            })
            .catch(res => {
              this.$Modal.remove();
              this.$Message.error("确认收货出现未知错误！");
            });
        }
      });
    },
  },
  mounted() {
    this.getAddressData();
    this.getWaybillStatusList();
    this.getWaybillList();
  }
};
</script>