<style scoped lang="less">
  .drivermanager {
    padding: 0 10px;
    min-height: 600px;
    position: relative;
  }
</style>

<template>
  <div>
    <frameInfocenterShipper>
      <div class="drivermanager">
        <br>
        <Input v-model="keyWord" placeholder="司机名或手机号" style="width: 200px"></Input>
        <Button type="primary" icon="ios-search" v-on:click="query()">查询</Button>
        <Button type="warning" icon="plus-round" v-on:click="add()">新增</Button>
        <br><br>
        <Table border :columns="columns" :data="rows"></Table>
        <br>
        <Page :total="totalCount" :current="pageIndex" :page-size="pageSize" @on-change="onPageChange" show-elevator show-total></Page>
        <br>
        <Modal v-model="dlgNew.visible" :title="dlgNew.title">
          <Form :label-width="50" style="padding: 0 10px;">
            <FormItem label="姓名：">
              <Input v-model="dlgNew.driverName" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="手机：">
              <Input v-if="dlgNew.title=='新增'" v-model="dlgNew.telephone" placeholder="请输入手机号"></Input>
              <span v-else>{{dlgNew.telephone}}</span>
            </FormItem>
          </Form>
          <div slot="footer">
              <Button type="primary" @click="addSubmit()">确定</Button>
          </div>
        </Modal>
        <Spin v-if='loading' fix></Spin>
      </div>
    </frameInfocenterShipper>
  </div>
</template>

<script>
  import frameInfocenterShipper from "../../components/frame-infocenter-shipper";
  export default {
    components: {
      frameInfocenterShipper
    },
    data() {
      return {
        loading: false,
        keyWord: "",
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        columns: [
          {
            title: '司机',
            key: 'driverName',
          },
          {
            title: '手机号',
            key: 'telephone',
          },
          {
            title: '操作',
            width: 150,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.modify(params.row.driverId);
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.del(params.row.id);
                    }
                  }
                }, '删除')
              ]);
            }
          },
        ],
        rows: [],

        dlgNew:{

          visible: false,
          title: "",
          id: 0,
          driverName: "",
          telephone: "",
        }
      };
    },
    methods: {

      modify(id){

        this.$shipperService
          .post("/personnelManagement/selectById", {
            id: id
          })
          .then(res => {

            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.dlgNew.title = "修改";
            this.dlgNew.id = id;
            this.dlgNew.driverName = res.data.driverName;
            this.dlgNew.telephone = res.data.telephone;
            this.dlgNew.visible = true;
          })
          .catch(res => {
            this.$Message.error("查询司机信息出现未知错误！");
          });
      },

      del(id){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除司机？</p>',
          onOk: () => {
            this.$shipperService
              .post("/personnelManagement/delete", {
                id: id
              })
              .then(res => {
                if (!res.success) {
                  this.$Message.error(res.msg);
                  return;
                }
                this.$Message.info("删除司机成功！");
                this.query();
              })
              .catch(res => {
                this.$Message.error("删除司机出现未知错误！");
              });
          }
        });
      },
      add() {

        this.dlgNew.id = 0;
        this.dlgNew.title = "新增";
        this.dlgNew.driverName = "";
        this.dlgNew.telephone = "";
        this.dlgNew.visible = true;
      },
      addSubmit(){

        if (!this.dlgNew.driverName) {
          this.$Message.warning("请输入司机姓名！");
          return;
        }
        if (this.dlgNew.driverName.replace(/[\x00-\xff]/g,'aa').length>20) {
          this.$Message.warning("司机姓名过长！");
          return;
        }
        if (!this.dlgNew.telephone) {
          this.$Message.warning("请输入司机联系方式！");
          return;
        }
        if (!new RegExp("^\\d{11}$").test(this.dlgNew.telephone)) {
          this.$Message.warning("司机联系方式格式不正确！");
          return;
        }

        this.loading = true;

        if(this.dlgNew.id){

          this.$shipperService
            .post("/personnelManagement/update", {
              userName: this.dlgNew.driverName,
              telephone: this.dlgNew.telephone,
            })
            .then(res => {
              this.loading = false;
              if (!res.success) {
                this.$Message.error(res.msg);
                return;
              }
              this.$Message.info("修改司机成功！");
              this.dlgNew.visible = false;
              this.query();
            })
            .catch(res => {
              this.loading = false;
              this.$Message.error("修改司机信息出现未知错误！");
            });
          return;
        }

        this.$shipperService
          .post("/personnelManagement/insert", {
            driverName: this.dlgNew.driverName,
            telephone: this.dlgNew.telephone,
          })
          .then(res => {
            this.loading = false;
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.$Message.info("新增司机成功！");
            this.dlgNew.visible = false;
            this.query();
          })
          .catch(res => {
            this.loading = false;
            this.$Message.error("新增司机出现未知错误！");
          });
      },
      onPageChange(index) {
        this.pageIndex = index;
        this.query();
      },
      query() {
        this.loading = true;
        this.$shipperService
          .post("/personnelManagement/selectAll", {
            currentPage: this.pageIndex,
            pageSize: this.pageSize,
            keywords: this.keyWord
          })
          .then(res => {
            this.loading = false;
            if (!res.success) {
              this.$Message.error(res.msg);
              return;
            }
            this.rows = res.data;
            this.totalCount = res.total;
          })
          .catch(res => {
            this.loading = false;
            this.$Message.error("查询司机出现未知错误！");
          });
      }
    },
    mounted() {
      this.query();
    }
  };
</script>
