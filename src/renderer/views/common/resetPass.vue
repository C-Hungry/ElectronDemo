<style scoped lang="less">
  .resetPass {
    .form-field {
      width: 80%!important;
      margin: 0 10%!important;
    }
  }
</style>

<template>
  <div class="resetPass">
    <Modal v-model="frmVisible" width="400" :mask-closable="false">
      <p slot="header" style="text-align:center;font-size: 16px;">
        <span>重置密码</span>
      </p>
      <div v-if="step==1" class="form">
        <Input class="form-field" type="text" v-model="userphone" placeholder="请输入手机号">
        <Icon type="ipad" slot="prepend"></Icon>
        </Input>
        <br>
        <div class="form-field" style="display: flex;">
          <Input v-model="userconfirmcode" placeholder="请输入验证码" style="width: 70%;">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
          <Button type="text" :disabled="!canSendConfirmCode" :loading="sendConfirmCodeLoading" @click="sendConfirmCode()" style="width: 30%; outline: none;">{{confirmCodeText}}</Button>
        </div>
      </div>
      <div v-if="step==2" class="form">
        <Input class="form-field" type="text" v-model="userphone" :disabled="true" placeholder="请输入手机号">
        <Icon type="ipad" slot="prepend"></Icon>
        </Input>
        <br>
        <Input class="form-field" type="password" v-model="password" placeholder="请输入新密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
        <br>
        <Input class="form-field" type="password" v-model="confirmPassword" placeholder="请再次输入新密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </div>
      <div slot="footer">
        <br>
        <Button v-if="step==1" type="primary" @click="next()" long class="form-field">下一步</Button>
        <Button v-if="step==2" type="primary" @click="submit()" long class="form-field">提交</Button>
        <br><br>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { removeUserInfo, removeToken } from "../../config/utils";
  export default {
    data() {
      return {
        frmVisible: false,
        step: 1,
        userphone: "",
        userconfirmcode: "",
        confirmCodeText: "发送验证码",
        password: "",
        confirmPassword: "",
        canSendConfirmCode: true,
        sendConfirmCodeLoading: false,
        timerid: 0,
      };
    },
    methods: {
      show(){
        this.frmVisible = true;
        this.step= 1;
        this.userphone= "";
        this.userconfirmcode= "";
        this.confirmCodeText= "发送验证码";
        this.password= "";
        this.confirmPassword= "";
        this.canSendConfirmCode= true;
        this.sendConfirmCodeLoading= false;
        this.timerid= 0;
      },
      countDown(count) {
        this.confirmCodeText = "重新发送(" + count + ")";
        this.canSendConfirmCode = false;
        if (count <= 0) {
          clearTimeout(this.timerid);
          this.confirmCodeText = "重新发送";
          this.canSendConfirmCode = true;
          return;
        }
        this.timerid = setTimeout(() => {
          this.countDown(--count);
        }, 1000);
      },
      sendConfirmCode() {
        if (!this.userphone) {
          this.$Message.warning('请输入手机号码！');
          return;
        }
        if (!new RegExp("^\\d{11}$").test(this.userphone)) {
          this.$Message.warning('手机号码格式不正确！');
          return;
        }
        this.sendConfirmCodeLoading = true;
        this.confirmCodeText = "发送中...";
        this.$commonService
          .get("/user/createCode", {
            telephone: this.userphone,
            flag: "true"
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error(res.msg);
              this.sendConfirmCodeLoading = false;
              this.countDown(0);
              return;
            }
            this.$Message.success("发送验证码成功！");
            this.sendConfirmCodeLoading = false;
            this.countDown(120);
          })
          .catch(res => {
            this.$Message.error("发送验证码出现未知错误！");
            this.sendConfirmCodeLoading = false;
            this.countDown(0);
          });
      },
      next(){
        if (!this.userphone) {
          this.$Message.warning('请输入手机号码！');
          return;
        }
        if (!new RegExp("^\\d{11}$").test(this.userphone)) {
          this.$Message.warning('手机号码格式不正确！');
          return;
        }
        if (!this.userconfirmcode) {
          this.$Message.warning('请输入短信验证码！');
          return;
        }
        if (!new RegExp("^\\d{6}$").test(this.userconfirmcode)) {
          this.$Message.warning('短信验证码格式不正确！');
          return;
        }
        
        this.$commonService
          .get("/user/checkSmsCode", {
            telephone: this.userphone,
            code: this.userconfirmcode
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.step = 2;
          })
          .catch(res => {
            this.$Message.error('获取验证码出现未知错误！');
          });

      },
      submit(){

        if (!this.password) {
          this.$Message.warning('请输入新密码！');
          return;
        }
        if (this.password.length < 6 || this.password.length > 12 || !/^[0-9a-zA-Z]*$/.test(this.password)) {
          this.$Message.warning('新密码应该为6-12位长度字母或数字！');
          return;
        }
        if (!this.confirmPassword) {
          this.$Message.warning('请输入确认新密码！');
          return;
        }
        if (this.password != this.confirmPassword) {
          this.$Message.warning('新密码与确认新密码不一致！');
          return;
        }
        this.$commonService
          .post("/user/resetPassword", {
            telephone: this.userphone,
            password: this.password,
            code: this.userconfirmcode
          })
          .then(res => {
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.$Message.success("重置密码成功！");
            this.frmVisible = false;
          })
          .catch(res => {
            this.$Message.error("重置密码出现未知错误！");
          });
      }
    },
  };
</script>
