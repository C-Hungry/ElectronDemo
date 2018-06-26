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
      .base-menu {
        flex: 1;
        font-size: 15px;
        padding: 0 0 0 50px;
        .base-menu-item {
          display: inline-block;
          padding: 0 30px;
          cursor: pointer;
        }
        .base-selected {
          font-weight: bold;
          color: #2d8cf0;
        }
      }
      .base-user {
        font-size: 15px;
        padding: 0 30px;
        cursor: pointer;
        .base-download {
          display: inline-block;
          margin-right: 20px;
        }
        .base-login-regist {
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
        <div class="base-menu-item" :class="{'base-selected': $route.path == '/common/homepage'}" v-on:click="$router.replace('/common/homepage')">首页</div>
        <div class="base-menu-item" :class="{'base-selected': $route.path == '/common/goodsource'}" v-on:click="showLoginform('/common/goodsource')">货源信息</div>
        <div class="base-menu-item" :class="{'base-selected': $route.path == '/common/ordermanager'}" v-on:click="showLoginform('/common/ordermanager')">订单管理</div>
        <div class="base-menu-item" :class="{'base-selected': $route.path == '/common/transportmanager'}" v-on:click="showLoginform('/common/transportmanager')">运单管理</div>
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
        <div class="base-login-regist" v-on:click="showLoginform('')">
          登录/注册
        </div>
      </div>
    </div>
    <div class="base-router-box">
      <router-view></router-view>
    </div>
    <loginAndReg ref="loginAndReg" :onResetPass="onResetPass"></loginAndReg>
    <resetPass ref="resetPass"></resetPass>
  </div>
</template>

<script>
  import loginAndReg from "./loginAndReg";
  import resetPass from "./resetPass";
  export default {
    components:{
      loginAndReg,
      resetPass
    },
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
      onResetPass(){
        this.$refs.resetPass.show();
      },
      showLoginform(path){
        this.$refs.loginAndReg.showLoginform(path);
      },
    }
  };
</script>
