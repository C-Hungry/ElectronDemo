<style scoped lang="less">
  .notice {
    min-height: 600px;
    padding: 15px 50px;
    .notice-header {
      height: 50px;
      line-height: 50px;
      font-weight: 600;
      font-size: 14px;
      border-bottom: 1px solid #D9D9D9;
    }
    .notice-body {
      font-size: 14px;
      .notice-item {
        cursor: pointer;
        min-height: 44px;
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
        padding: 12px 0;
        border-bottom: 1px solid #d9d9d9;
        .title {
          display: flex;
          .header {
            flex: 1;
            text-align: left;
            font-weight: 600;
          }
          .time {
            font-size: 12px;
            text-align: right;
            color: #999;
          }
        }
        .detail {
          color: #666;
          padding: 8px 0 0 12px;
        }
      }
      .notice-item:last-child {
        border-bottom: none;
      }
      .notice-item:hover {
        .detail {
          color: #2d8cf0; 
        }
      }
      .no-notice {
        text-align: center;
        margin-top: 200px; 
      }
    }
    .notice-footer {
      font-size: 14px;
      padding: 16px 0;
      border-top: 1px solid #d9d9d9;
    }
  }
</style>

<template>
  <div class="notice">
    <div class="notice-header">
      通知消息
    </div>
    <div class="notice-body">
      <div v-if="messageList.length > 0" class="notice-item" v-for="(item, index) in messageList" :key="index" @click="openDetail(item)">
        <div class="title">
          <div class="header">【系统消息】</div>
          <div class="time">{{item.createTime}}</div>
        </div>
        <div class="detail">
          {{item.msgContent}}
        </div>
      </div>
      <div v-if="messageList.length == 0" class="no-notice">
        暂无通知消息
      </div>
    </div>
    <div class="notice-footer" v-if="messageList.length > 0">
      <Page show-total show-elevator :total="total" @on-change="onPageIndexChange" @on-page-size-change="onPageSizeChange"></Page>
    </div>
  </div>
</template>

<script>
  import { removeUserInfo, removeToken, getUserInfo, DateManager } from "../../config/utils";
  export default {
    data() {
      return {
        loading: false,
        messageList: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10
      };
    },
    methods: {
      // 打开对应处理页面
      openDetail(data) {
        
        /**
         * userType:
         * 1 货主 
         * 2 承运方
         * 4 司机
         * 8 超管 
         * 
         * type:
         * 1  司机、承运商抢单      货主    —> 订单列表
         * 2  司机取消订单          货主    —> 订单列表
         * 3  承运商取消派车        司机    —> 历史运单
         * 
         * 4  货主同意抢单          承运商  —> 订单列表
         *                         司机    —> 首页
         * 
         * 5  货主拒绝抢单          承运商  —> 订单列表
         *                         司机    —> 首页
         * 
         * 6  承运商派车            司机    —> 首页
         * 
         * 7  司机开始运输          承运商  —> 运单列表页
         *                         货主    —> 运单列表页
         * 
         * 8  司机回单              承运商  —> 运单列表页
         *                         货主    —> 运单列表页
         * 
         * 9  货主收货              承运商  —> 运单列表页
         *                         司机    —> 历史运单
         */

        let userInfo = getUserInfo();
        let userType = userInfo.userType;
        let type = data.msgType;

        switch(type) {
          case 1:
            this.$router.push('/consigner/ordermanager');
            break; 
          case 2:
            this.$router.push('/consigner/ordermanager');
            break;
          case 4:
            this.$router.push('/shipper/ordermanager');
            break; 
          case 5:
            this.$router.push('/shipper/ordermanager');
            break;
          case 7:
            userType == 2 ? this.$router.push('/shipper/transportmanager') :
            this.$router.push('/consigner/transportmanager');
            break; 
          case 8:
            userType == 2 ? this.$router.push('/shipper/transportmanager') :
            this.$router.push('/consigner/transportmanager');
            break; 
          case 9:
            this.$router.push('/consigner/transportmanager');
            break; 
        }
      },
      // 读取未读消息列表
      getMessageList(){
        this.loading = true;
        this.$commonService.post("/message/selectAll",{
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          isView: 0
        }).then(res=>{
          this.loading = false;
          res.data.map((item)=>{
            item.createTime = DateManager.formatTime(item.createTime);
            return item;
          })
          this.total = res.total;
          this.messageList = res.data;
          
        }).catch(err=>{
          this.loading = false;
        })
      },
      // 设置全部已读
      setMarkRead() {
        this.$commonService
          .get("/message/updateAll", {})
          .then(res=>{
            if (!res.success) {
              this.$vux.toast.text("设置全部已读失败！", "default");
            }
          })
      },
      // index变化
      onPageIndexChange(index) {
        this.pageIndex = index;
        this.getMessageList();
      },
      // size变化
      onPageSizeChange(size) {
        this.pageSize = size;
      }
    },
    watch: {
      pageSize(newVal) {
        if (newVal) {
          this.getMessageList();
        }
      }
    },
    mounted() {
      this.setMarkRead();
      this.getMessageList();
      this.$store.state.unreadMsgNumber = 0;
    }
  };
</script>
