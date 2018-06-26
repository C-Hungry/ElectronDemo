<style scoped lang="less">
  .frame-infocenter-shipper {}
</style>

<template>
  <div class="frame-infocenter-shipper">
    <frameInfocenter :menuItems="menuItems">
      <slot name="default"></slot>
    </frameInfocenter>
  </div>
</template>

<script>
  import frameInfocenter from './frame-infocenter';
  export default {
    components: {
      frameInfocenter
    },
    data() {
      return {
        menuItems: [
          {
            title: "司机管理",
            path: "/shipper/drivermanager"
          },
          {
            title: "车辆管理",
            path: "/shipper/carmanager"
          },
          {
            title: "通知消息",
            path: "/shipper/notice"
          },
          {
            title: "修改密码",
            path: "/shipper/changepass"
          }
        ],
      };
    },
    methods: {
    },
  };
</script>
