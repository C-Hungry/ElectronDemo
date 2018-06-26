<style scoped lang="less">
  .transportmanager {
    padding: 30px;
  }
</style>

<template>
  <div class="transportmanager">
    <label for="">派单时间：</label>
    <DatePicker type="date" placeholder="派单开始时间" v-model="grapTimeStart" style="width: 200px;"></DatePicker>
    <label for="">至</label>
    <DatePicker type="date" placeholder="派单结束时间" v-model="grapTimeEnd" style="width: 200px;"></DatePicker>
    &nbsp;&nbsp;
    <label for="">发货地：</label>
    <Cascader :data="areasList" v-model="consignerArea" style="width: 200px; display: inline-block;"></Cascader> &nbsp;&nbsp;
    <label for="">收货地：</label>
    <Cascader :data="areasList" v-model="receiverArea" style="width: 200px; display: inline-block;"></Cascader> &nbsp;&nbsp;
    <label for="">状态：</label>
    <Select v-model="status" style="width:200px">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select> &nbsp;&nbsp;
    <Button type="primary" icon="ios-search" v-on:click="onSearch">查询</Button>
    <br><br>
    <Table border :columns="columns" :data="rows"></Table>
    <br>
    <Page :total="totalCount" :current="pageIndex" :page-size="pageSize" @on-change="onPageChange" show-elevator show-total></Page>
    <MapTrack ref="mapTrack"></MapTrack>
    <waybill-detail ref="waybillDetail"></waybill-detail>
    <order-detail ref="orderDetail"></order-detail>
  </div>
</template>

<script>
  import MapTrack from "../../components/map-track";
  import {
    getAllArea
  } from "../../config/utils";
  export default {
    components: {
      MapTrack
    },
    data() {
      return {
        grapTimeStart: "",
        grapTimeEnd: "",
        consignerArea: [],
        receiverArea: [],
        areasList: [],
        status: 0,
        statusList: [
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
        ],
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        loading: false,
        columns: [
          {
            title: "发货地",
            minWidth: 220,
            render: (h, params) => {
                return h("div", {},
                  params.row.sendLocalDesc + (params.row.sendSupplementaryExplanation ? '(' + params.row.sendSupplementaryExplanation + ')' : '')
                );
              }
          },
          {
            title: "收货地",
            minWidth: 220,
            render: (h, params) => {
                return h("div", {},
                  params.row.getLocalDesc + (params.row.getSupplementaryExplanation ? '(' + params.row.getSupplementaryExplanation + ')' : '')
                );
              }
          },
          {
            title: "货主",
            minWidth: 100,
            key: "goodsUserName"
          },
          {
            title: "承运商",
            minWidth: 100,
            key: "companyName"
          },
          {
            title: "车牌号",
            minWidth: 100,
            key: "carNumber"
          },
          {
            title: "司机",
            minWidth: 100,
            key: "driverName"
          },
          {
            title: "关联订单",
            minWidth: 100,
            render: (h, params) => {
              return h("a", {
                  on: {
                    click: () => {
                      this.orderDetail(params.row.orderId);
                    }
                  }
                },
                "查看"
              );
            }
          },
          {
            title: "派车时间",
            minWidth: 160,
            key: "dispatchTime"
          },
          {
            title: "状态",
            minWidth: 100,
            key: "statusStr"
          },
          {
            title: "操作",
            width: 200,
            align: "center",
            fixed: "right",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "2px"
                    },
                    on: {
                      click: () => {
                        this.detail(params.row.id);
                      }
                    }
                  },
                  "详情"
                ),
                h(
                  "Dropdown", {
                    props: {
                      trigger: "click",
                      transfer: true
                    },
                    on: {
                      "on-click": (type) => {
                        switch(type){
                          case "track":
                            this.track(
                              params.row.carNumber,
                              params.row.dispatchTime,
                              params.row.receiveTime ? params.row.receiveTime : this.$utils.formateDate(new Date())
                            );
                            break;
                          case "cancel":
                            this.cancel(params.row.tmsbillId);
                            break;
                          case "del":
                            this.del(params.row.tmsbillId);
                            break;
                        }
                      }
                    },
                    scopedSlots: {
                      list: function (props) {
                        switch(params.row.status){
                          case 1:
                          case 2:
                            return h("DropdownMenu", [
                              h(
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
                              h(
                                "DropdownItem", {
                                  props: {
                                    name: "cancel"
                                  },
                                  style: {
                                    textAlign: 'center'
                                  },
                                },
                                "撤销"
                              ),
                            ]);
                            break;
                          case 3:
                          case 4:
                            return h("DropdownMenu", [
                              h(
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
                            break;
                          case 5:
                            return h("DropdownMenu", [
                              h(
                                "DropdownItem", {
                                  props: {
                                    name: "del"
                                  },
                                  style: {
                                    textAlign: 'center'
                                  },
                                },
                                "删除"
                              ),
                            ]);
                            break;
                          default:
                            return h("DropdownMenu", []);
                            break;
                        }
                      }
                    }
                  }, 
                  [
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
            }
          }
        ],
        rows: []
      };
    },
    methods: {
      onPageChange(index) {
        this.pageIndex = index;
        this.query();
      },
      orderDetail(orderId) {
        this.$refs.orderDetail.init(orderId)
      },
      detail(id) {
        this.$refs.waybillDetail.init(id)
      },
      del(TMSBillId){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除此运单？</p>',
          onOk: () => {
            this.$shipperService
              .post("/Waybill/delete", {
                TMSBillId: TMSBillId
              })
              .then(res => {
                if (!res.success) {
                  this.$Message.error(res.msg);
                  return;
                }
                this.query();
              })
              .catch(res => {
                this.$Message.error("删除运单出现未知错误！");
              });
          }
        });
      },
      cancel(TMSBillId) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定撤销此运单？</p>',
          onOk: () => {
            this.$shipperService
              .post("/Waybill/update", {
                TMSBillId: TMSBillId
              })
              .then(res => {
                if (!res.success) {
                  this.$Message.error(res.msg);
                  return;
                }
                this.query();
              })
              .catch(res => {
                this.$Message.error("撤销运单出现未知错误！");
              });
          }
        });
      },
      track(carNum, sendTime, recevieTime) {
        this.$refs.mapTrack.init(
          carNum,
          sendTime,
          recevieTime
        );
        // this.$refs.mapTrack.init(
        //   "蒙C26219",
        //   "2018-05-02 12:59:19",
        //   "2018-05-02 13:59:19"
        // );
      },
      onSearch() {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.query();
      },
      query() {

        var sendProvince = this.consignerArea[0] ? this.consignerArea[0] : "";
        var sendCity = this.consignerArea[1] ? this.consignerArea[1] : "";
        var sendCounty = this.consignerArea[2] ? this.consignerArea[2] : "";

        var getProvince = this.receiverArea[0] ? this.receiverArea[0] : "";
        var getCity = this.receiverArea[1] ? this.receiverArea[1] : "";
        var getCounty = this.receiverArea[2] ? this.receiverArea[2] : "";

        this.loading = true;

        this.$shipperService
          .post("/Waybill/selectAllForPc", {
            pcInWaybillDto: {
              createUserId: 0,
              currentPage: 0,
              dispatchAfterTime:this.$utils.formateDate(this.grapTimeEnd),
              dispatchBeforeTime: this.$utils.formateDate(this.grapTimeStart),
              getCity: getCity,
              getCounty: getCounty,
              getProvince: getProvince,
              goodsId: 0,
              goodsUserId: 0,
              orderId: 0,
              pageSize: 0,
              sendCity: sendCity,
              sendCounty: sendCounty,
              sendProvince: sendProvince,
              status: this.status
            },
            currentPage: this.pageIndex,
            pageSize: this.pageSize
          })
          .then(res => {
            this.loading = false;
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.rows = res.data;
            this.totalCount = res.total;
          })
          .catch(res => {
            this.loading = false;
            this.$Message.error("查询运单出现未知错误！");
          });
      }
    },
    mounted() {
      this.areasList = getAllArea();
      this.query();
    }
  };
</script>
