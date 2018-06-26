<style scoped lang="less">
  .frame-infocenter {
    width: 1200px;
    margin: 0 auto;
    .frame-header{
      background-color: #45B8FB;
      height: 45px;
      line-height: 45px;
      padding: 0 20px;
      font-size: 18px;
      color: #fff;
      border-radius: 5px 5px 0 0;
    }
    .frame-body{
      display: flex;
      .frame-menu{
        width: 200px;
        background-color: #E2E3E8;
        .frame-menu-item{
          padding: 20px 0;
          font-size: 15px;
          text-align: center;
          cursor: pointer;
        }
        .selected{
          background-color: #fff;
        }
      }
      .frame-content{
        flex: 1;
        background-color: #fff;
        position: relative;
      }
    }
    
  }
</style>

<template>
  <div class="frame-infocenter">
    <br>
    <div class="frame-header">
      个人中心
    </div>
    <div class="frame-body">
      <div class="frame-menu">
        <div class="frame-menu-item" v-for="item in menuItems" 
        :key="item.path" 
        :class="$route.path==item.path?'selected':''"
        v-on:click="linkTo(item)">
          {{item.title}}
        </div>
      </div>
      <div class="frame-content">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      menuItems: {
        type: Array,
        default: [],
      }
    },
    data(){
      return {};
    },
    methods:{
      linkTo(item){
        this.$router.push(item.path);
      }
    }
  }
</script>
