<style scoped lang="less">
  .changepass {
    min-height: 600px;
    .form {
      width: 400px;
      height: 300px;
      margin: 0 auto;
      .form-field {
        width: 100%;
      }
    }
  }
</style>

<template>
  <div class="changepass">
    <br><br><br>
    <div class="form">
      <Input class="form-field" type="password" v-model="oldpass" placeholder="请输入旧密码">
      <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </Input>
      <br>
      <Input class="form-field" type="password" v-model="newpass" placeholder="请输入新密码">
      <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </Input>
      <br>
      <Input class="form-field" type="password" v-model="confirmpass" placeholder="请再次输入密码">
      <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </Input>
      <br><br>
      <Button type="primary" :loading="loading" long v-on:click="change()">提交</Button>
    </div>
  </div>
</template>

<script>
  import { removeUserInfo, removeToken } from "../../config/utils";
  export default {
    data() {
      return {
        oldpass: "",
        newpass: "",
        confirmpass: "",

        loading: false,
      };
    },
    methods: {
      
      change(){

        if (!this.oldpass) {
          this.$Message.warning('请输入旧密码！');
          return;
        }
        if (!this.newpass) {
          this.$Message.warning('请输入新密码！');
          return;
        }
        if (this.newpass.length<6||this.newpass.length>12||!/^[0-9a-zA-Z]*$/.test(this.newpass)) {
          this.$Message.warning('新密码应该为6-12位长度字母或数字！');
          return;
        }
        if (!this.confirmpass) {
          this.$Message.warning('请再次输入新密码！');
          return;
        }
        if (this.newpass!=this.confirmpass) {
          this.$Message.warning('两次输入的密码不一致！');
          return;
        }

        this.loading = true;
        this.$commonService.post("/user/updateUserPwd",{
          oldPwd: this.oldpass,
          newPwd: this.newpass
        })
        .then(res=>{
          this.loading = false;
          if(!res.success){
            this.$Message.error(res.msg);
            return;
          }
          this.$Message.success('修改成功！');
          this.oldpass = "";
          this.newpass = "";
          this.confirmpass = "";
          removeUserInfo();
          removeToken();
          this.$router.replace('/common/homepage');
        })
        .catch(res=>{
          this.loading = false;
          this.$Message.error('登录出现未知错误！');
        });
      }
    },
  };
</script>
