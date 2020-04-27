<template>
  <div class="stepFour">
    <h2>Enter your Pin Code</h2>

    <div class="bottomBox">
      <div class="selectBox">
        <deviceImage :middle="true" :line="true"></deviceImage>
      </div>
      <div class="textBox">
        <ul>
          <li>1. Connect the imKey  to your Computer</li>
          <li>2. Click the connect button</li>
          <li>3. Enter the PIN code on imKey</li>
        </ul>
      </div>
    </div>
    <div class="btns">
      <el-button
              style="width:100%"
              :loading="connectLoading"
              :type="one?'success':'primary'"
              @click="connect()"
      >Connect</el-button>
    </div>
    <!-- <div class="btns">
      <el-button
        style="width:100%"
        :type="two?'success':'primary'"
        @click="choose(2)"
      >Connect</el-button>
    </div>-->
  </div>
</template>

<script>
  import deviceImage from "../../../components/deviceImage";
  import {
    connect_device,
  } from '../../../../api/devicemanager'
  export default {
    name: "three",
    data() {
      return {
        one: false,
        two: false,
        connectLoading:false
      };
    },
    components: {
      deviceImage
    },
    methods: {
      connect(){
        this.connectLoading=true;
        setTimeout(() => {
        connect_device().then(result => {

          if (result.code === 200) {
            const res = result.data
            if(res=="true"){
              console.log("success res "+res)
              this.$emit("finsh");
            }else{
              this.$message.warning(result.data);
            }
          } else {

          }
        }).catch(err => {

        })
        }, 200);
      },
    }
  };
</script>
<style lang="less" scoped>
  .stepFour {
    text-align: center;
    width: 600px;
    margin: 0 auto;
    h2 {
      margin: 30px 0;
    }
    .bottomBox {
      display: flex;
    }
    .textBox {
      text-align: left;
      margin-left: 30px;

      ul {
        li {
          height: 40px;
          line-height: 40px;
          border: 1px solid #dcdcdc;
          margin: 10px 0;
          padding: 0 10px;
          border-radius: 5px;
        }
      }
    }
    .btns {
      margin-top: 20px;
    }
  }
</style>
