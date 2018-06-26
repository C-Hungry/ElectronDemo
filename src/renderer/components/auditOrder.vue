<template>
  <Modal
    width="360"
    v-model="isShow"
    title="审核"
    :loading="loading"
    @on-ok="asyncOK">
    <div style="padding-right: 16px;">
      <Form :model="formData" :label-width="80">
        <FormItem label="是否通过：">
          <RadioGroup v-model="formData.isAgreed">
            <Radio :label="3">通过</Radio>
            <Radio :label="4">不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="原因：">
          <Input v-model="formData.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入"></Input>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      loading: true,
      orderId: "",
      formData: {
        isAgreed: 3,
        reason: ""
      }
    };
  },
  methods: {
    asyncOK() {
      // 1--待确认 2--已撤销 3--已确认  4--已拒绝
      this.$consignerService
        .post("/order/updateOrder", {
          orderId: this.orderId,
          orderStatus: this.formData.isAgreed,
          reason: this.formData.reason
        })
        .then(res => {
          if (!res.success) {
            this.$Message.error(res.msg);
            return;
          }
          this.loading = false;
          this.isShow = false;
          this.$Message.success("审核成功！");
          this.$emit("refresh");
        })
        .catch(res => {
          this.loading = false;
          this.$Message.error("订单审核操作出现未知错误，请稍后重试！");
        });
    },
    init(id) {
      this.orderId = id;
      this.isShow = true;
    }
  }
};
</script>