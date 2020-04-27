<template>
  <div class="stepThree">
    <h2>Set PIN&Create Wallet</h2>
    <p>Please Please disconnect the USB ,set PIN and create wallet</p>
    <div>
      <div class="selectBox">
        <div class="text">
          <span class="sort">1.</span>
          <span>Set and modify PIN code</span>
          <span class="el-icon-link" @click="seeOne"></span>
        </div>
        <div>
          <el-checkbox v-model="IseeOnes" label></el-checkbox>

          <!-- <span v-if="IseeOnes" class="el-icon-check"></span>
          <el-button v-else type="primary" size="small" @click="IseeOne">I See</el-button>-->
        </div>
      </div>
      <div class="selectBox">
        <div class="text">
          <span class="sort">2.</span>
          <span>Create or restore wallets</span>
          <span class="el-icon-link" @click="seeTwo"></span>
        </div>
        <div>
          <el-checkbox v-model="IseeTwos" label></el-checkbox>

          <!-- <span v-if="IseeTwos" class="el-icon-check"></span>
          <el-button v-else type="primary" size="small" @click="IseeTwo">I See</el-button>-->
        </div>
      </div>
      <el-button type="primary" style="width:100%" :loading="nextLoading" @click="connect">Next</el-button>
      <!-- <div class="selectBox"> -->

      <!-- <p class="text">
          <span class="sort"></span>
          <span>To Next</span>
        </p>
        <div>
          <el-button type="primary" style="width:123px" @click="next">Next</el-button>
      </div>-->
      <!-- </div> -->
    </div>
    <OptionOne :optionOneVisible="optionOneVisible" @closeOneBox="closeOneBox($event)"></OptionOne>
    <OptionTwo :optionTwoVisible="optionTwoVisible" @closeTwoBox="closeTwoBox($event)"></OptionTwo>
  </div>
</template>

<script>
import OptionOne from "./stepThreeDialog";
import OptionTwo from "./stepThree2Dialog";
import {
  getBTC_Xpub_,
} from '../../../../api/walletapi'
import {connect_device, deleteApplet} from "../../../../api/devicemanager";
export default {
  name: "Home",
  data() {
    return {
      optionOneVisible: false,
      optionTwoVisible: false,
      IseeOnes: true,
      IseeTwos: true,
      nextLoading: false

    };
  },
  components: {
    OptionOne,
    OptionTwo
  },
  mounted() {
    this.connect();
  },
  methods: {
    connect(){
        connect_device().then(result => {
          if (result.code === 200) {
            const res = result.data
            if(res=="true"){
              this.next();
            }else{
              this.$message.warning(result.data);

            }
          } else {
          }
        }).catch(err => {
        })

    },
    seeOne() {
      this.optionOneVisible = true;
    },
    seeTwo() {
      this.optionTwoVisible = true;
    },
    next() {
      if (this.IseeOnes && this.IseeTwos) {
        this.nextLoading = true;
        //判断是否创建钱包
        setTimeout(() => {
          getBTC_Xpub_().then(result => {
            if (result.code === 200) {
              console.log("getBTC_Xpub_:"+result.data)
              if (result.data != "" || result.data != null) {
                if(result.data.match("xpu")){
                  console.log("getBTC_Xpub_:"+result.data)
                  // this.$emit("showFour", true);
                  this.$emit("finsh");
                } else {
                  this.$message.warning("please create wallet");
                  this.nextLoading = false;
                }
              }else{
                this.$message.warning("please create wallet");
                this.nextLoading = false;
              }
            }
          }).catch(err => {
            this.nextLoading = false;
          })
        }, 300);

      } else {
        this.$message.warning("please click option ");
      }

    },
    closeOneBox() {
      this.optionOneVisible = false;
    },
    closeTwoBox() {
      this.optionTwoVisible = false;
    },
    toShowTree() {
      this.$emit("showThree", true);
    },
    IseeOne() {
      this.IseeOnes = true;
    },
    IseeTwo() {
      this.IseeTwos = true;
    }
  }
};
</script>
<style lang="less" scoped>
.stepThree {
  text-align: center;
  width: 600px;
  margin: 0 auto;
  h2 {
    margin: 30px 0;
  }
  p {
    font-size: 18px;
    color: #555555;
    margin-bottom: 60px;
  }
  .selectBox {
    height: 60px;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #dcdcdc;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
    padding: 0 15px;
    .text {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        display: inline-block;
        height: 100%;
        font-size: 16px;
      }
      .sort {
        color: #409eff;
        width: 12px;
      }
    }
  }
}
.el-icon-link {
  margin-left: 10px;
  color: #409eff;
}
.el-icon-check {
  color: green;
}
</style>
