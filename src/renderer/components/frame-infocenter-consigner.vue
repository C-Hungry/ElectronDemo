<style scoped lang="less">
  .frame-infocenter-consigner {}
</style>

<template>
  <div class="frame-infocenter-consigner">
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
            title: "通知消息",
            path: "/consigner/notice"
          },
          {
            title: "修改密码",
            path: "/consigner/changepass"
          }
        ],
      };
    },
    methods: {
    },
  };
</script>
