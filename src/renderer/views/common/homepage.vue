<style scoped lang="less">
  .homepage {
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    background-image:url('../../images/bg_01.png');
    background-repeat:no-repeat;
    background-attachment:fixed;
    background-position:center;
    background-size: 100% 100%;
    .content {
      height: 100%;
      background-image:url('../../images/bg_02.png');
      background-repeat:no-repeat;
      background-attachment:fixed;
      background-position: 15% 39%;
      background-size: 50%;
      animation: shaking 2.5s infinite;
    }

    @keyframes shaking {  
      0% {  
        transform: translate(0px, 0px);  
      }  
      50% {  
        transform: translate(0px, -30px);  
      }  
      100% {  
        transform: translate(0px, 0px);  
      }  
    }  
  }
</style>

<template>
  <div class="homepage">
      <div v-if="isMounted" class="content"></div>
  </div>
</template>

<script>
import { getUserInfo } from '../../config/utils';
  export default {
    data() {
      return {
        isMounted: false
      }
    },
    mounted(){
      this.isMounted = true;
      var userInfo = getUserInfo();
      if(userInfo&&userInfo.userType==1){
        this.$router.replace("/consigner/homepage");
        return;
      }
      if(userInfo&&userInfo.userType==2){
        this.$router.replace("/shipper/homepage");
        return;
      }
    }
  }
</script>
