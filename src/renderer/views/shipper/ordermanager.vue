<style scoped lang="less">
.ordermanager {
  padding: 30px;
}
</style>

<template>
  <div class="ordermanager">
    <label for="">抢单时间：</label>
    <DatePicker type="date" placeholder="抢单开始时间" v-model="grapTimeStart" style="width: 200px;"></DatePicker>
    <label for="">至</label>
    <DatePicker type="date" placeholder="抢单结束时间" v-model="grapTimeEnd" style="width: 200px;"></DatePicker>
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
    <Modal v-model="dlgGrap.visible" title="编辑订单" width="400" :mask-closable="false">
      <Form :label-width="80" style="padding: 0 10px;">
        <FormItem label="抢单数量：">
          <Input v-model="dlgGrap.goodsNum" placeholder="请输入抢单数量">
            <span slot="append">吨</span>
          </Input>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="dlgGrap.grabDesc" :maxlength="40" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="grapSubmit()">抢单</Button>
      </div>
    </Modal>
    <orderDetail ref="orderDetail"></orderDetail>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import { getAllArea } from "../../config/utils";
export default {
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
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "待确认"
        },
        {
          value: 2,
          label: "已撤销"
        },
        {
          value: 3,
          label: "已确认"
        },
        {
          value: 4,
          label: "已拒绝 "
        }
      ],

      loading: false,
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0,
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
          title: "货物",
          minWidth: 100,
          key: "goodsTypeName"
        },
        {
          title: "抢单数量",
          minWidth: 100,
          render: (h, params) => {
              return h("div", {},
                params.row.goodsNum + "吨"
              );
            }
        },
        {
          title: "运费",
          minWidth: 120,
          render: (h, params) => {
              return h("div", {},
                params.row.transportPrice + "元/吨"
              );
            }
        },
        {
          title: "是否含税",
          minWidth: 100,
          render: (h, params) => {
              return h("div", {},
                params.row.isATax == 1 ? "不含税" : 
                params.row.isATax == 2 ? "含税" : 
                "未知"
              );
            }
        },
        {
          title: "联系人",
          minWidth: 100,
          key: "goodsUserName"
        },
        {
          title: "联系电话",
          minWidth: 140,
          key: "transportTelephone"
        },
        {
          title: "关联运单",
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
          minWidth: 160,
          key: "createTime"
        },
        {
          title: "生效时间",
          minWidth: 160,
          key: "createTime"
        },
        {
          title: "状态",
          minWidth: 120,
          key: "orderStatusStr"
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
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
              params.row.orderStatus == 1 ? h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.cancel(params.row.id, params.row.grabDesc, params.row.goodsNum);
                    }
                  }
                },
                "撤销"
              ): 
              params.row.orderStatus == 2 ? h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.grap(params.row.id);
                    }
                  }
                },
                "抢单"
              ): params.row.orderStatus == 3 ? h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.$Message.info("WEB端暂未实现！");
                    }
                  }
                },
                "派车"
              ): params.row.orderStatus == 4 ? h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.del(params.row.id);
                    }
                  }
                },
                "删除"
              ): null
            ]);
          }
        }
      ],
      rows: [],


      dlgGrap:{

        visible: false,
        orderId: 0,
        orderStatus: 2,//撤销
        goodsNum: "",
        grabDesc: "",
      },
    };
  },
  mounted() {
    this.areasList = getAllArea();
    this.query();
  },
  methods: {
    del(id){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定撤销此订单？</p>',
        onOk: () => {
          this.$shipperService
            .post("/order/delete", {
              id: id,
            })
            .then(res => {
              this.loading = false;
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Message.info("删除成功！");
              this.query();
            })
            .catch(res => {
              this.loading = false;
              this.$Message.error("删除订单出现未知错误！");
            });
        }
      });
    },
    grap(id){

      this.$shipperService
        .post("/order/selectById", {
          id: id
        })
        .then(res => {

          if (!res.success) {
            this.$Message.error("查询订单详情失败，请稍后重试！");
            return;
          }
          
          this.dlgGrap.orderId = id;
          this.dlgGrap.goodsNum = res.data.goodsNum;
          this.dlgGrap.grabDesc = res.data.grabDesc;
          this.dlgGrap.visible = true;
        })
        .catch(res => {
          this.$Message.error("查询货源订单出现未知错误！");
        });
    },
    grapSubmit(){

      if (!this.dlgGrap.goodsNum) {
        this.$Message.warning("请输入抢单数量！");
        return;
      }
      if (!/^([1-9]\d{0,6}|0)(\.\d{1,2})?$/.test(this.dlgGrap.goodsNum)) {
        this.$Message.warning("抢单数量格式不正确！");
        return;
      }
      if (this.dlgGrap.grabDesc.replace(/[\u4e00-\u9fa5]/g,'aa').length>40) {
        this.$Message.warning("备注不能超过40个英文字符，20个汉字！");
        return;
      }

      this.$shipperService
        .post("/order/update", {
          orderStatus: 1,//待确认
          id: this.dlgGrap.orderId,
          grabDesc: this.dlgGrap.grabDesc,
          goodsNum: this.dlgGrap.goodsNum,
        })
        .then(res => {
          this.loading = false;
          if (!res.success) {
            this.$Message.error(res.msg);
            return;
          }
          this.dlgGrap.visible = false;
          this.$Message.info("抢单成功！");
          this.query();
        })
        .catch(res => {
          this.loading = false;
          this.$Message.error("抢单出现未知错误！");
        });
    },
    cancel(id,grabDesc,goodsNum){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定撤销此订单？</p>',
        onOk: () => {
          this.$shipperService
            .post("/order/update", {
              orderStatus: 2, //已撤销
              id: id,
              grabDesc: grabDesc,
              goodsNum: goodsNum,
            })
            .then(res => {
              this.loading = false;
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Message.info("撤销成功！");
              this.query();
            })
            .catch(res => {
              this.loading = false;
              this.$Message.error("撤销订单出现未知错误！");
            });
        }
      });
    },
    detail(id){
      this.$refs.orderDetail.init(id);
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.query();
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
        .post("/order/selectAllForPc", {
          pcInOrderDto: {
            createAfterTime: this.$utils.formateDate(this.grapTimeEnd),
            createBeforeTime: this.$utils.formateDate(this.grapTimeStart),
            createUserId: 0,
            getCity: getCity,
            getCounty: getCounty,
            getProvince: getProvince,
            goodsId: 0,
            goodsUserId: 0,
            sendCity: sendCity,
            sendCounty: sendCounty,
            sendProvince: sendProvince,
            orderStatus: this.status,
          },
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
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
          this.$Message.error("查询订单出现未知错误！");
        });
    }
  }
};
</script>
