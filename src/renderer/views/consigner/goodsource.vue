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
        <div class="label">装货时间：</div>
        <DatePicker type="date" v-model="startTime" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
        <span>至</span>
        <DatePicker type="date" v-model="endTime" format="yyyy-MM-dd" placeholder="请选择" style="width: 162px"></DatePicker>
      </div>
      <div class="header-item">
        <div class="label">发货地：</div>
        <Cascader style="display: inline-block;" :data="addressData" v-model="sendPlace"></Cascader>
      </div>
      <div class="header-item">
        <div class="label">收货地：</div>
        <Cascader style="display: inline-block;" :data="addressData" v-model="receivePlace"></Cascader>
      </div>
      <div class="header-item">
        <RadioGroup v-model="goodsSourceStageName" type="button">
          <Radio label="全部"></Radio>
          <Radio label="发布中"></Radio>
          <Radio label="待发布"></Radio>
          <Radio label="历史货源"></Radio>
        </RadioGroup>
      </div>
      <div class="header-item">
        <Button type="primary" style="margin-right: 16px;" icon="ios-search" @click.native="onSearch">查询</Button>
        <Button type="warning" @click.native="createSource" icon="plus-round">发布货源</Button>
      </div>
    </div>
    <div class="main">
      <Table border :loading="loading" :columns="tableColumns" :data="sourceList"></Table>
      <Page style="margin-top: 16px;" :current="pageIndex" :page-size="pageSize" :total="total" @on-change="onPageIndexChange" @on-page-size-change="onPageSizeChane" show-elevator show-total></Page>
    </div>
    <source-detail ref="sourceDetail"></source-detail>
    <create-source ref="createSource"></create-source>
  </div>
</template>

<script>
import createSource from '../../components/createSource';
import { getAllArea } from "../../config/utils";
export default {
  components: {
    createSource
  },
  data() {
    return {
      loading: false,
      sourceId: -1, // 货源id
      startTime: "", // 发布时间
      endTime: "",
      sendPlace: [], // 发货地址
      receivePlace: [], // 收货地址
      goodsSourceStageName: "全部",
      pageSize: 10,
      pageIndex: 1,
      addressData: [], // 三级联动数据
      tableColumns: [
        {
          title: "发货地",
          key: "sendPlace",
          minWidth: 220
        },
        {
          title: "收货地",
          key: "receivePlace",
          minWidth: 220
        },
        {
          title: "货物",
          key: "goodsTypeName",
          minWidth: 80
        },
        {
          title: "数量",
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
          title: "车型",
          key: "carTypeValueStr",
          width: 140
        },
        {
          title: "车载设备",
          key: "isNeedEquipmentStr",
          minWidth: 100
        },
        {
          title: "装货时间",
          key: "loadTimeRange",
          minWidth: 250
        },
        // {
        //   title: "发布时间",
        //   key: "createTime",
        //   minWidth: 140
        // },
        {
          title: "状态",
          key: "goodsSourceStageName",
          minWidth: 100
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          fixed: 'right',
          align: "center",
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
                      this.$refs.sourceDetail.init(params.row.id);
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
                    "on-click": status => {
                      switch (status) {
                        case "publish": 
                          this.updateGoodsSourceStage(params.row.id, params.row.loadEndTime, 2);
                          break;
                        case "edit": 
                          this.$refs.createSource.init(params.row.id);
                          break;
                        case "cancel": 
                          this.updateGoodsSourceStage(params.row.id, params.row.loadEndTime,4);
                          break;
                        case "delete": 
                          this.deleteGoodsSource(params.row.id);
                          break;
                      }
                    }
                  },
                  scopedSlots: {
                    list: function (props) {
                      return h("DropdownMenu", [
                        params.row.goodsSourceStage == "2" ? '' : h(
                          "DropdownItem", {
                            props: {
                              name: "publish"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "发布"
                        ), 
                        params.row.goodsSourceStage == "2" ? '' : h(
                          "DropdownItem", {
                            props: {
                              name: "edit"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "修改"
                        ), 
                        params.row.goodsSourceStage != "2" ? '' : h(
                          "DropdownItem", {
                            props: {
                              name: "cancel"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "下架"
                        ), 
                        params.row.goodsSourceStage == "2" ? '' : h(
                          "DropdownItem", {
                            props: {
                              name: "delete"
                            },
                            style: {
                              textAlign: 'center'
                            },
                          },
                          "删除"
                        )
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
          }
        }
      ],
      sourceList: [],
      total: 0,
    };
  },
  methods: {
    createSource() {
      this.$refs.createSource.init();
    },
    // 获取地址信息
    getAddressData() {
      this.addressData = getAllArea();
    },
    //监听页码变化
    onPageIndexChange(num) {
      this.pageIndex = num;
      this.getSourceList();
    },
    //监听页码变化
    onPageSizeChane(num) {
      this.pageSize = num;
      this.pageIndex = 1;
      this.getSourceList();
    },
    onSearch() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getSourceList();
    },
    // 获取列表
    getSourceList() {
      this.loading = true;

      // 货源状态 1--草稿   2--发布  3--不发布
      let goodsSourceStage = "";
      switch (this.goodsSourceStageName) {
        case "全部": 
          goodsSourceStage = 0;
          break;
        case "发布中": 
          goodsSourceStage = 2;
          break;
        case "待发布": 
          goodsSourceStage = 1;
          break;
        case "历史货源": 
          goodsSourceStage = 3;
          break;
        default:
          goodsSourceStage = 0;
      }

      this.$consignerService
        .post('/goods-source/queryGoodsSourceListWeb', {
          dto: {
            "carTypeList": [],
            "currentPage": this.pageIndex,
            "pageSize": this.pageSize,
            "startTime": this.$utils.formateDate(this.startTime, "yyyy-MM-dd"),
            "endTime": this.$utils.formateDate(this.endTime, "yyyy-MM-dd"),
            "isNeedEquipment": 0,
            "goodsSourceStage": goodsSourceStage,
            "getCity": this.receivePlace.length > 0 ? this.receivePlace[1] : "",
            "getCounty": this.receivePlace.length > 0 ? this.receivePlace[2] : "",
            "getProvince": this.receivePlace.length > 0 ? this.receivePlace[0] : "",
            "sendCity": this.sendPlace.length > 0 ? this.sendPlace[1] : "",
            "sendCounty": this.sendPlace.length > 0 ? this.sendPlace[2] : "",
            "sendProvince": this.sendPlace.length > 0 ? this.sendPlace[0] : "",
          }
        })
        .then(res => {
          this.loading = false;
          if (!res.success) {
            this.$Message.error(res.msg);
            return;
          }
          res.data.map((item)=>{
            item.sendPlace = item.sendLocalDesc + (item.sendSupplementaryExplanation ? '(' + item.sendSupplementaryExplanation + ')' : '');
            item.receivePlace = item.getLocalDesc + (item.getSupplementaryExplanation ? '(' + item.getSupplementaryExplanation + ')' : '');
            item.goodsNum = item.goodsNum + '吨';
            item.transportPrice = item.transportPrice.replace(/,/g, '') + '元/吨';
            item.isATaxStr = item.isATax == 2 ? '含税' : '不含税';
            item.isNeedEquipmentStr = item.isNeedEquipment == 2 ? '需要' : '不需要';
            item.loadStartTime = this.$utils.formateDate(item.loadStartTime, 'yyyy-MM-dd HH:mm');
            item.loadEndTime = this.$utils.formateDate(item.loadEndTime, 'yyyy-MM-dd HH:mm');
            item.loadTimeRange = item.loadStartTime + ' ~ '+ item.loadEndTime;
            item.createTime = this.$utils.formateDate(item.createTime, 'yyyy-MM-dd HH:mm');
            return item;
          })
          
          this.total = res.total;
          this.sourceList = res.data;
        })
        .catch(error => {
          console.log(error)
           this.loading = false;
          this.$Message.error('查询货源列表出现未知错误！');
        });
    },
    // 更新货源状态
    updateGoodsSourceStage(goodId, loadEndTime,status) {

      // 货源状态 1--草稿、待发布 2--发布中 3-过期 4--下架 5 管理员下架
      if (status == 2) {
        let now = new Date().getTime();
        let end = new Date(loadEndTime).getTime();
        if (now >= end) {
          this.$Message.error("该货源装货结束时间早于当前时间，请先修改后再进行发货！");
          return
        }
      }

      this.$Modal.confirm({
        title: '操作提示',
        content: status == 2 ? '<p>您确定要发布此货源吗？</p>' : '<p>您确定要下架此货源吗？</p>',
        loading: true,
        onOk: () => {
          this.$consignerService
            .post("/goods-source/updateGoodsSourceStage", {
              goodId: goodId,
              status: status
            })
            .then(res => {
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Modal.remove();
              this.$Message.success(status == 2 ? '发布货源成功！' : '下架货源成功！');
              this.getSourceList();
            })
            .catch(res => {
              this.$Modal.remove();
              this.$Message.error(status == 2 ? "发布货源出现未知错误！" : "下架货源出现未知错误！");
            });
        }
      });
    },
    // 删除货源
    deleteGoodsSource(goodId) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>您确定要删除此货源信息吗？</p>',
        loading: true,
        onOk: () => {
          this.$consignerService
            .post("/goods-source/deleteGoodsSource", {
              goodId: goodId
            })
            .then(res => {
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Modal.remove();
              this.$Message.success('删除货源成功！');
              this.getSourceList();
            })
            .catch(res => {
              this.$Modal.remove();
              this.$Message.error("删除货源出现未知错误！");
            });
        }
      });
    },
  },
  mounted() {
    this.getAddressData();
    this.getSourceList();
  }
};
</script>
