<style lang="less" scoped>
  .image-upload {
    // padding: 10px 0;
  }
  input {
    display: none;
  }
  .default {
    height: 80px;
    background-color: #EEE;
    color: #BBB;
    font-size: 40px;
    line-height: 80px;
    text-align: center;
    font-weight: 600;
    cursor: pointer;
  }
  .img-container>img{
    height: 80px;
  }
</style>

<template>
  <div class="image-upload">
    <!-- 伪触发input -->
    <input type="file" @change="imgUpload" :id="id" :name="fileName" :accept="inputAccept"/>
    <div v-show="isDefault" class="default" @click.stop.prevent="inputClick">+</div>
    <div v-show="!isDefault" :id="imgContainerId" class="img-container"  @click.stop.prevent="inputClick"></div>
  </div>
</template>

<script>
import lrz from "lrz";
export default {
  data () {
    return {
      isDefault: true
    }
  },
  computed: {
    imgContainerId() {
      return this.id + "_container_id"
    }
  },
  watch: {
    backfillUrl(newVal, oldVal) {
      // 支持回填图片url
      if (newVal) {
        this.isDefault = false;
        var target = document.getElementById(this.imgContainerId).children
        if (target.length) {
          target[0].src = newVal;
          target[0].style.width = "100%";
          target[0].style.height = "80px";          
        }
        else {
          var img = new Image();
          img.src = newVal;
          img.style.width = "100%";
          img.style.height = '80px';
          document.getElementById(this.imgContainerId).appendChild(img);
        }
      }
      else {
        this.isDefault = true;
      }
    }
  },
  props: {
    id: { //确保id唯一
      type: String,
      default: "file"
    },
    fileName: {
      type: String,
      default: "file"
    },
    url: { //上传服务器地址
      type: String,
      default: ""
    },
    backfillUrl: { //回填图片地址
      type: String,
      default: ""
    },
    options: { //压缩配置项
      type: Object,
      default: function() {
        //width {Number} 图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
        //height {Number} 同上
        //quality {Number} 图片压缩质量，取值 0 - 1，默认为0.7
        //fieldName {String} 后端接收的字段名，默认：file
        return {} 
      }
    },
    extensions: { //上传类型限制
      type: String,
      default: "png,jpg,jpeg,bmp,gif"
    },
    maxFileSize: { //上传大小限制
      type: Number,
      default: 10485760
    },
    inputAccept: { //上传类型限制
      type: String,
      default: "image/*"
    },
    headers: { //请求头
      type: Object,
      default: function() {
        return {} 
      }
    },
    data: { //请求参数
      type: Object,
      default: function() {
        return {
          systemType:'chauffeur'
        } 
      }
    },
    onLoadSucceed: { //上传成功
      type: Function,
      default: function() {}
    },
    onLoadError: { //上传失败
      type: Function,
      default: function() {}
    },
    onUploading: { //上传中
      type: Function,
      default: function() {}
    },
    onCatch: { //上传报错
      type: Function,
      default: function() {}
    },
    onAlways: { //上传
      type: Function,
      default: function() {}
    }
  },
  methods: {
    inputClick(e) {
      //伪触发input
      document.getElementById(this.id).click();
    },
    init(){
      this.isDefault = true;
      var imgClear = document.getElementById(this.imgContainerId).children;
      if (imgClear.length) {
          document.getElementById(this.imgContainerId).removeChild(imgClear[0]);
      }
    },
    imgUpload() {
      let file = document.getElementById(this.id).files[0];
      var target = document.getElementById(this.imgContainerId).children
      let that = this;
      lrz(file, that.options)
        .then(function(rst) {
          // 显示已压缩好的图片
          that.onUploading()
          var img = new Image();
          img.src = rst.base64;
          img.style.width = "100%";
          img.style.height = "80px";
          img.onload = function() {
          that.isDefault = false;
            if (target.length) {
              document.getElementById(that.imgContainerId).removeChild(target[0]);
            }
            document.getElementById(that.imgContainerId).appendChild(img);
          };
          return rst;
        })
        .then(function(rst) {
          // 上传服务器
          var xhr;
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          } else {
            xhr = new ActiveXObject();
          }
          
          xhr.open("POST", that.url);
          
          for (let key in that.headers) {
            xhr.setRequestHeader(key, that.headers[key]);
          }

          // 添加参数
          for (let key in that.data) {
            rst.formData.append(key, that.data[key]);
          }

          // 触发上传
          xhr.send(rst.formData);

          xhr.onload = (res) => {
            if (res && res.target && res.target.status == 200 && res.target.response) {
              that.isDefault = false;
              that.onLoadSucceed(JSON.parse(res.target.response));
            } else {
              that.isDefault = true;
              that.onLoadError(res.target.response);
            }
          } 

          xhr.onerror = (error) => {
            that.isDefault = true;
            that.onLoadError(error);
          } 

          return rst;
        })
        .catch(function(err) {
          // 这里捕捉错误信息
          console.log(err)
          that.onCatch();
        })
        .always(function() {
          // 不管是成功失败，这里都会执行
          that.onAlways()
        });
    }
  }
}
</script>