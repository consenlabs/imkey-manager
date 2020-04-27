<template>
  <div class="manager" style="-webkit-user-select: none;-webkit-app-region: drag">
    <h1 class="deviceImg">
      <deviceImage :large="true"></deviceImage>
      <!-- <img style="width:370px;height:150px" src="../../assets/device.png" alt /> -->
    </h1>
    <h1>Connect your imKey</h1>
    <p class="sideTtile">Follow the steps below to the Manager</p>
    <div class="deviceBox">
      <ul>
        <li :class="activeOne?'active':''">
          <span>
            <i class="el-icon-setting"></i>
            Connect the imKey  to your Computer
          </span>
          <!-- <div v-if="showOne">
            <span v-if="firstLoding" class="el-icon-loading"></span>
            <span v-if="!firstLoding&&firstSuccess" class="el-icon-check"></span>
            <span v-if="!firstLoding&&!firstSuccess" class="el-icon-close"></span>
          </div>-->
        </li>
        <li :class="activeTwo?'active':''">
          <span>
            <i class="el-icon-news"></i>
            Click the connect button
          </span>
          <!-- <div v-if="showTwo">
            <span v-if="SecondLoding" class="el-icon-loading"></span>
            <span v-if="!SecondLoding&&SecondSuccess" class="el-icon-check"></span>
            <span v-if="!SecondLoding&&!SecondSuccess" class="el-icon-close"></span>
          </div>-->
        </li>
        <li :class="activeThree?'active':''">
          <span>
            <i class="el-icon-set-up"></i>
            Enter the PIN code on your imKey
          </span>
          <!-- <div v-if="showThree">
            <span v-if="thirdLoding" class="el-icon-loading"></span>
            <span v-if="!thirdLoding&&thirdSuccess" class="el-icon-check"></span>
            <span v-if="!thirdLoding&&!thirdSuccess" class="el-icon-close"></span>
          </div>-->
        </li>
      </ul>
      <el-button type="primary" @click="connect" :loading="connectLoading" style="width:100%">Connect</el-button>
    </div>
  </div>
</template>

<script>
import deviceImage from "../../components/deviceImage";
import {
  connect_device,
} from '../../../api/devicemanager'
export default {
  name: "manager",
  data() {
    return {
      connectLoading:false,
      firstLoding: false,
      firstSuccess: false,
      SecondSuccess: false,
      SecondLoding: false,
      thirdSuccess: false,
      thirdLoding: false,
      activeOne: false,
      activeTwo: false,
      activeThree: false,
      showThree: false,
      showTwo: false,
      showOne: false
    };
  },
  components: {
    deviceImage
  },
  mounted() {},
  methods: {
    connect() {
      this.connectLoading=true;
      setTimeout(() => {
      connect_device().then(result => {

        if (result.code === 200) {
          const res = result.data
          if (res == "true") {
            console.log("success res " + res)
            this.router.replace("/manager/device");
          } else {
            this.$message.warning(res);
            this.connectLoading=false;
          }
        } else {

        }
      }).catch(err => {

      })
      }, 200);
    },


    // connectOne() {
    //   this.showOne = true;
    //   this.firstLoding = true;
    //   this.activeOne = true;
    //   setTimeout(() => {
    //     this.firstLoding = false;
    //     this.firstSuccess = true;
    //   }, 2000);
    // },
    // connectTwo() {
    //   this.activeOne = false;
    //   this.SecondLoding = true;
    //   this.activeTwo = true;
    //   this.showTwo = true;
    //   setTimeout(() => {
    //     this.SecondLoding = false;
    //     this.SecondSuccess = true;
    //     this.thirdLoding = true;
    //   }, 2000);
    // },
    // connectThree() {
    //   this.activeThree = true;
    //   this.activeTwo = false;
    //   this.showThree = true;
    //   setTimeout(() => {
    //     this.thirdLoding = false;
    //     this.thirdSuccess = true;
    //   }, 2000);
    //   setTimeout(() => {
    //     this.router.replace("/manager/device");
    //   }, 3000);
    // }
  }
};
</script>

<style lang="less" scoped>
.manager {
  padding-top: 10px;
  width: 600px;
  margin: 0 auto;
  margin-bottom: 30px;
  text-align: center;
}
h1 {
  font-size: 20px;
  margin: 10px 0 20px;
}
.sideTtile {
  margin: 0 0 40px;
  color: #666666;
}
.deviceBox {
  width: 600px;

  ul {
    li {
      height: 60px;
      line-height: 60px;
      border: 1px solid #dcdcdc;
      border-radius: 5px;
      margin: 10px 0;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      align-items: center;
      cursor: pointer;
      i {
        margin-right: 10px;
      }
      .el-icon-close {
        color: tomato;
      }
    }
  }
  .active {
    border: 1px solid #409eff;
    border-radius: 5px;
  }
}
.deviceImg {
  display: flex;
  justify-content: center;
  height: 200px;
}
</style>