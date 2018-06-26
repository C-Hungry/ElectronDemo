<style scoped lang="less">
  .common-index {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1200px;
    .base-header {
      color: #fff;
      line-height: 60px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #303133;
      display: flex;
      .base-logo {
        font-size: 18px;
        padding: 0 30px;
        cursor: pointer;
      }
      .base-menu{
        flex: 1;
        font-size: 15px;
        padding: 0 0 0 50px;
        .base-menu-item{
          display: inline-block;
          padding: 0 30px;
          cursor: pointer;
        }
        .base-selected{
          font-weight: bold;
          color: #2d8cf0;
        }
      }
      .base-user{
        font-size: 15px;
        padding: 0 30px;
        cursor: pointer;
        .base-download{
          display: inline-block;
          margin-right: 20px;
        }
        .base-notice {
          display: inline-block;
          margin-right: 20px;
          color: #333;
          .notice-header {
            height: 44px;
            font-size: 14px;
            line-height: 8px;
            margin: 0 16px;
            padding: 16px 0;
            border-bottom: 1px solid #d9d9d9;
            color: #333;
            font-weight: 600;
          }
          .notice-body {
            min-height: 50px;
            max-height: 400px;
            overflow-y: auto;
            .notice-item {
              font-size: 12px;
              min-height: 44px;
              line-height: 20px;
              word-wrap: break-word;
              word-break: break-all;
              margin: 0px 16px;
              padding: 12px 0;
              border-bottom: 1px solid #d9d9d9;
            }
            .notice-item:last-child {
              border-bottom: none;
            }
            .notice-item:hover {
              color: #2d8cf0; 
            }
          }
          .notice-footer {
            font-size: 14px;
            text-align: center;
            height: 36px;
            line-height: 8px;
            margin: 0 16px;
            padding: 16px 0;
            color: #333;
            font-weight: 600;
            border-top: 1px solid #d9d9d9;
          }
          .notice-footer:hover {
            color: #2d8cf0;
          }
        }
        .base-login-regist{
          display: inline-block;
        }
      }
    }
    .base-router-box {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 30px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #F1F6FC;
    }
  }
</style>

<template>
  <div class="common-index">
    <div class="base-header">
      <div class="base-logo">
        <img src="../../images/logo.png" alt="智运 | 无车承运人平台">
      </div>
      <div class="base-menu">
        <div v-for="item in menuItems" class="base-menu-item" 
          v-bind:key="item.path" 
          v-bind:class="$route.path==item.path?'base-selected':''"
          v-on:click="linkto(item)"
          >{{item.title}}</div>
      </div>
      <div class="base-user">
        <div class="base-download">
          <Dropdown trigger="click">
            <a href="javascript:void(0)" style="color: white;">
                下载APP
            </a>
            <DropdownMenu slot="list" style="margin: 10px; line-height: 0px;">
              <img src="../../images/download-code.jpg" alt="">
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="base-notice">
          <Dropdown trigger="click" placement="bottom-end" @on-visible-change="onVisibleChange">
            <Badge :dot="$store.state.unreadMsgNumber > 0" style="margin-top: -3px;">
              <a href="javascript:void(0)" style="color: white;">消息</a>
            </Badge>
            <DropdownMenu slot="list" style="width: 320px;">
              <div class="notice-header">新消息</div>
              <div class="notice-body">
                <div class="notice-item" v-if="$store.state.unreadMsgNumber > 0 && !loading" v-for="(item, index) in messageList" :key="index" @click="openDetail(item)">
                  {{item.msgContent}}
                </div>
                <div v-if="$store.state.unreadMsgNumber == 0 && !loading" class="notice-item" style="text-align: center;">
                  暂无新消息
                </div>
                <div v-if="loading" class="notice-item" style="text-align: center;">
                  加载中...
                </div>
              </div>
              <div class="notice-footer" @click="toMyNotice">
                查看全部
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="base-login-regist">
          <Dropdown trigger="click">
            <a href="javascript:void(0)" style="color: white;">
                {{userInfo.userName}}
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem><router-link to="/consigner/notice" style="font-size: 15px; color: #666;">通知消息</router-link></DropdownItem>
              <DropdownItem divided><router-link to="/consigner/changepass" style="font-size: 15px; color: #666;">修改密码</router-link></DropdownItem>
              <DropdownItem><div style="font-size: 15px; color: #666;" @click="logout">退出登录</div></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="base-router-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { removeUserInfo, removeToken, getUserInfo } from "../../config/utils";
export default {
  data() {
    return {
      userInfo: {},
      messageList: [],
      loading: false,
      menuItems:[
        {
          title: "首页",
          path: "/consigner/homepage",
        },
        {
          title: "货源信息",
          path: "/consigner/goodsource",
        },
        {
          title: "订单管理",
          path: "/consigner/ordermanager",
        },
        {
          title: "运单管理",
          path: "/consigner/transportmanager",
        },
      ],
    };
  },
  mounted() {
    this.userInfo = getUserInfo();
    this.getBadgeNumber();
  },
  methods: {
    linkto(item){
      this.$router.push(item.path);
    },
    openDetail(data) {
      /**
       * type:
       * 1  司机、承运商抢单      货主    —> 订单列表
       * 2  司机取消订单          货主    —> 订单列表
       * 
       * 7  司机开始运输          货主    —> 运单列表页
       * 
       * 8  司机回单              货主    —> 运单列表页
       */
      
      this.setMarkRead(data.id);

      let type = data.msgType;

      switch(type) {
        case 1:
          this.$router.push('/consigner/ordermanager');
          break; 
        case 2:
          this.$router.push('/consigner/ordermanager');
          break; 
        case 7:
          this.$router.push('/consigner/transportmanager');
          break; 
        case 8:
          this.$router.push('/consigner/transportmanager');
          break; 
      }
    },
    // 跳转至消息
    toMyNotice() {
      this.$router.push('/consigner/notice');
    },
    // 监听消息框
    onVisibleChange(visible) {
      if (visible) {
        this.getMessageList();
      }
    },
    // 读取未读消息个数
    getBadgeNumber(){
      this.$commonService.post("/message/selectAll",{
        currentPage: 1,
        pageSize: 1,
        isView: 2
      }).then(res=>{
        this.$store.state.unreadMsgNumber = res.total;
        setTimeout(()=>{
          this.getBadgeNumber();
        }, 20 * 1000);
      }).catch(err=>{
        setTimeout(()=>{
          this.getBadgeNumber();
        }, 10 * 1000);
      })
    },
    // 读取未读消息列表
    getMessageList(){
      this.loading = true;
      this.$commonService.post("/message/selectAll",{
        currentPage: 0,
        pageSize: 0,
        isView: 2
      }).then(res=>{
        this.loading = false;
        this.$store.state.unreadMsgNumber = res.total;
        this.messageList = res.data;
      }).catch(err=>{
        this.loading = false;
      })
    },
    // 设置单条已读
    setMarkRead(id) {
      this.$commonService
        .post("/message/update", {id: id})
        .then(res=>{
          if (!res.success) {
            this.$vux.toast.text("设置已读失败！", "default");
          }
        })
    },
    logout(){
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>您确定要退出登录吗？</p>',
        loading: true,
        onOk: () => {
          this.$commonService.post("/user/removeToken",{})
            .then(res=>{
              if (!res.success) {
                this.$Message.error('退出登录出现未知错误！');
                return;
              }
              removeUserInfo();
              removeToken();
              this.$router.replace('/common/homepage');
              this.$Modal.remove();
              this.$Message.success('退出登录成功！');
            })
            .catch(res=>{
              this.$Message.error('退出登录出现未知错误！');
            });
        }
      });
    },
  }
};
</script>
