<template>
  <div class="stepOne">
    <h2>Connect your imKey</h2>
    <div>
      <div :class="['selectBox',isTwoChoose?'active':'','deviceBox']" :loading="connectLoading" @click="choose(2)">
        <div class="choose el-icon-check" :loading="connectLoading" v-if="isTwoChoose"></div>
        <p></p>
        <deviceImage :small="true"></deviceImage>
        <p>imKey Pro</p>
      </div>
    </div>
  </div>
</template>

<script>
import deviceImage from "../../../components/deviceImage";
import {
  connect_device,
} from '../../../../api/devicemanager'
export default {
  name: "Home",
  data() {
    return {
      connectLoading:false,
      isConnect:false,
      isOneChoose: false,
      isTwoChoose: false,
      isTreeChoose: false
    };
  },
  components:{
    deviceImage
  },
  mounted() {
    this.choose(2);
  },
  methods: {
      connect(){
      connect_device().then(result => {

        if (result.code === 200) {
          const res = result.data
          if(res=="true"){
            console.log("success res "+res)
            this.$emit("showTwo");
          }else{
            // this.$message.warning("enter pin on your imKey");
            this.$message.warning(result.data);
            this.isOneChoose = false;
            this.isTwoChoose = false;
            this.connectLoading=false;
          }
        } else {
          this.isOneChoose = false;
          this.isTwoChoose = false;
          this.connectLoading=false;
        }
      }).catch(err => {
        this.isOneChoose = false;
        this.isTwoChoose = false;
        this.connectLoading=false;
      })
    },
    choose(index) {
      switch (index) {
        case 1:
          this.isOneChoose = true;
          this.isTwoChoose = false;
          this.isThreeChoose = false;
          break;
        case 2:
          this.isTwoChoose = true;
          this.isOneChoose = false;
          this.isThreeChoose = false;
          break;
        case 3:
          this.isTwoChoose = false;
          this.isOneChoose = false;
          this.isThreeChoose = true;
          break;
      }
      this.connectLoading=true;
      setTimeout(() => {

        this.connect();
      }, 500);

      // setTimeout(() => {
      //  if(this.isConnect){
      //    this.$message.warning("enter pin on your imKey");
      //  }
      // }, 2000);

    }
  }
};
</script>
<style lang="less" scoped>
.stepOne {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .selectBox {
    width: 150px;
    height: 150px;
    border: 1px solid #666666;
    margin: 60px 30px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    svg {
      margin-top: 30px;
    }
    .choose {
      position: absolute;
      right: 10px;
      top: 10px;
      background: #409EFF;
      color: white;
      border-radius: 50%;
    }
  }
  > div {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }
  .active {
    border: 1px solid #409EFF;
  }
}
.deviceBox{
 display: flex;
 align-items: center;
 flex-direction: column;
 justify-content: center;
}
</style>
