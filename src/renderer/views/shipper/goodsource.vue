<style scoped lang="less">
.goodsource {
  width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  font-size: 14px;
  .card-list {
    display: flex;
    flex-wrap: wrap;
    .card {
      position: relative;
      width: 280px;
      margin-bottom: 20px;
      margin-right: 20px;
      background-color: #fff;
      border: solid 1px #dededd;
      border-radius: 3px;
      text-align: center;
      .card-title {
        padding: 10px 5px;
        border-bottom: solid 1px #dededd;
        display: flex;
        flex-direction: row;
        .item {
          flex: 1;
          vertical-align: top;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          img {
            display: inline-block;
          }
          span {
            position: relative;
            top: -3px;
            font-size: 16px;
          }
        }
      }
      .card-content {
        padding: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-overflow: ellipsis;
        .tag {
          background-color: #dededd;
          padding: 5px;
          border-radius: 3px;
          display: inline-block;
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .timespan {
          display: inherit;
        }
        .transfee {
          .content {
            width: 200px;
            margin: 0 auto;
            display: flex;
            flex-direction: row;
            .left {
              flex: 1;
              display: flex;
              flex-direction: column;
              line-height: 15px;
              .top {
                flex: 1;
              }
              .bottom {
                flex: 1;
                color: #f23e3e;
              }
            }
            .middle {
              font-size: 38px;
              line-height: 30px;
              font-weight: bold;
              color: #f23e3e;
            }
            .right {
              flex: 1;
              display: flex;
              flex-direction: column;
              line-height: 15px;
              .top {
                flex: 1;
              }
              .bottom {
                flex: 1;
                color: #f23e3e;
              }
            }
          }
        }
        .leftcount {
          display: inherit;
          font-weight: bold;
        }
      }
      .grap {
        width: 100%;
        position: absolute;
        bottom: 0;
        background-color: #0e9aec;
        color: #fff;
        font-size: 16px;
        line-height: 35px;
        border-radius: 0 0 3px 3px;
        cursor: pointer;
      }
      .disabled{
        background-color: #aaa;
        color: #fff;
        font-size: 16px;
        line-height: 35px;
        border-radius: 0 0 3px 3px;
      }
    }
    .card:hover {
      border: solid 1px #0e9aec;
      box-shadow: 0px 0px 10px #0e9aec;
    }
  }
}
</style>

<template>
  <div class="goodsource">
    <label for="">发货地：</label>
    <Cascader :data="areasList" v-model="consignerArea" style="width: 200px; display: inline-block;"></Cascader> &nbsp;&nbsp;
    <label for="">收货地：</label>
    <Cascader :data="areasList" v-model="receiverArea" style="width: 200px; display: inline-block;"></Cascader> &nbsp;&nbsp;
    <label for="">运输要求：</label>
    <Select v-model="carType" style="width:200px">
      <Option v-for="item in carTypeList" :value="item.typeCode" :key="item.typeCode">{{ item.typeValue }}</Option>
    </Select> &nbsp;&nbsp;
    <Checkbox v-model="hasGPS">北斗</Checkbox>
    &nbsp;&nbsp;
    <Button type="primary" icon="ios-search" v-on:click="onSearch()">查询</Button>
    <br><br>
    <div class="card-list">
      <div v-for="(item,index) in rows" :key="item.id" class="card">
        <div slot="title" v-on:click="detail(item.id)" class="card-title">
          <div class="item">
            <img src="../../images/circle_green.svg" height="20" alt="">
            <span class="county" style="font-weight: bold;" :title="item.sendCityName">{{item.sendCityName}}</span>
            <br>
            <a href="javascript:void(0);">{{item.sendProvinceName}}</a>
          </div>
          <div class="item" style="flex: 0.8;">
            <a href="javascript:void(0);">{{item.distance?"约"+item.distance+"km":""}}</a>
            <br>
            <img src="../../images/right_grey.svg" height="10" alt="">
          </div>
          <div class="item">
            <img src="../../images/circle_red.svg" height="20" alt="">
            <span style="font-weight: bold;" :title="item.getCityName">{{item.getCityName}}</span>
            <br>
            <a href="javascript:void(0);">{{item.getProvinceName}}</a>
          </div>
        </div>
        <div v-on:click="detail(item.id)" class="card-content">
          <span class="tag" v-if="item.goodsTypeName">{{item.goodsTypeName}}</span>
          <span class="tag" v-if="item.isNeedEquipment==2">北斗</span>
          <span class="tag">{{item.goodsNum}}吨</span>
          <span class="tag" v-if="item.carTypeValueStr" :title="item.carTypeValueStr">{{item.carTypeValueStr}}</span>
          <br><br>
          <div class="timespan">
            装货时间
            <br> {{item.loadStartTime.substr(0,10)}} ---- {{item.loadEndTime.substr(0,10)}}
          </div>
          <br>
          <div class="transfee">
            <div class="content">
              <div class="left">
                <div class="top" v-bind:style="{ lineHeight: item.isATax==1 ? '30px' : '15px' }">运费</div>
                <div v-if="item.isATax==2" class="bottom">含税</div>
              </div>
              <div class="middle">
                {{(item.freight / 100)}}
              </div>
              <div class="right">
                <div class="top"></div>
                <div class="bottom">元/吨</div>
              </div>
            </div>
          </div>
          <br>
          <div class="leftcount">
            抢单倒计时：<span v-html="item.tick?item.tick:'已过期'"></span>
          </div>
          <br><br>
        </div>
        <div v-if="item.tick" class="grap" v-on:click="grap(item.id)">
          抢单
        </div>
        <div v-else class="disabled">
          已过期
        </div>
      </div>
      <div v-if="rows.length<=0" style="background-color: #fff; width: 100%; height: 200px; text-align: center; line-height: 200px; margin-bottom: 10px; border: 1px solid #dddee1;">
        暂无数据
      </div>
    </div>
    <Page :total="totalCount" :current="pageIndex" :page-size="pageSize" @on-change="onPageChange" show-elevator show-total></Page>

    <Modal v-model="dlgGrap.visible" title="新增订单" width="400" :mask-closable="false">
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
        <Button type="primary" @click="grapSubmit()">确定</Button>
      </div>
    </Modal>
    <sourceDetailShipper ref="sourceDetailShipper"></sourceDetailShipper>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import { getAllArea } from "../../config/utils";
import sourceDetailShipper from "../../components/sourceDetailShipper";
export default {
  components:{
    sourceDetailShipper
  },
  data() {
    return {

      dlgGrap:{

        visible: false,
        goodsId: 0,
        goodsNum: "",
        grabDesc: "",
      },

      timeSpan: 0,

      consignerArea: [],
      receiverArea: [],
      areasList: [],
      hasGPS: false,
      carType: "-1",
      carTypeList: [],
      loading: false,
      pageSize: 8,
      pageIndex: 1,
      totalCount: 0,
      rows: [],
      timeoutId: 0
    };
  },
  methods: {
    detail(goodsId){
      this.$refs.sourceDetailShipper.init(goodsId);
    },
    grap(goodsId){

      this.dlgGrap.goodsId = goodsId;
      this.dlgGrap.goodsNum = "";
      this.dlgGrap.grabDesc = "";
      this.dlgGrap.visible = true;
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
        .post("/order/insert", {
          goodsId: this.dlgGrap.goodsId,
          goodsNum: this.dlgGrap.goodsNum,
          grabDesc: this.dlgGrap.grabDesc,
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error(res.msg);
            return;
          }
          this.$Message.info("抢单成功！");
          this.dlgGrap.visible = false;
          this.query();
        })
        .catch(res => {
          this.$Message.error("抢单出现未知错误！");
        });
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.query();
    },
    createTimeout() {
      this.rows.forEach(row => {

        var tick = Math.floor((new Date(row.loadEndTime) - (new Date() - this.timeSpan)) / 1000);

        if(tick<=0){
          row.tick = "";
          return;
        }

        var days = parseInt(tick / 60 / 60 / 24 , 10); //计算剩余的天数     
        var hours = parseInt(tick / 60 / 60 % 24 , 10); //计算剩余的小时     
        var minutes = parseInt(tick / 60 % 60, 10);//计算剩余的分钟
        var seconds = parseInt(tick % 60, 10);//计算剩余的秒数
        
        row.tick = (days ? "<font color='#0E9AEC'>" + days + "</font>天" : "") +
          ((days || hours)? "<font color='#0E9AEC'>" + hours + "</font>小时" : "") + 
          ((days || hours || minutes) ? "<font color='#0E9AEC'>" + minutes + "</font>分钟" : "") +
          ((!minutes && seconds) ? "<font color='#0E9AEC'>" + seconds + "</font>秒" : '');

      });
      this.$forceUpdate();
      this.timeoutId = setTimeout(() => {
        this.createTimeout();
      }, 1000);
    },
    onSearch() {
      this.pageIndex = 1;
      this.pageSize = 8;
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
        .post("/goodsSource/viewGoodsSourceForPc", {
          goodsSourceQueryDto: {
            startTime: "",
            endTime: "",
            carTypeList: this.carType == "-1" ? [] : [this.carType],
            getCity: getCity,
            getCounty: getCounty,
            getProvince: getProvince,
            isNeedEquipment: this.hasGPS ? 2 : 0,
            sendCity: sendCity,
            sendCounty: sendCounty,
            sendProvince: sendProvince,
            currentPage: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.loading = false;
          if (!res.success) {
            this.$Message.error(res.msg);
            return;
          }
          this.rows = res.data;
          this.totalCount = res.total;
          if(res.data.length>0){
            this.timeSpan = new Date() - new Date(res.data[0].systemTime);
          }
          if(this.timeoutId) clearTimeout(this.timeoutId);
          this.createTimeout();
        })
        .catch(res => {
          this.loading = false;
          this.$Message.error("查询货源出现未知错误！");
        });
    }
  },
  mounted() {
    this.areasList = getAllArea();
    this.$commonService
      .get("/system/getSystemDic", {
        key: "carType"
      })
      .then(res => {
        if (!res.success) {
          this.$Message.error(res.msg);
          return;
        }
        this.carTypeList = res.data;
        this.carTypeList.splice(0, 0, {
          typeCode: "-1",
          typeValue: "请选择"
        });
      })
      .catch(res => {
        this.$Message.error("查询车辆类型出现未知错误！");
      });
    this.query();
  },
  beforeDestroy(){
    if(this.timeoutId) clearTimeout(this.timeoutId);
  }
};
</script>
