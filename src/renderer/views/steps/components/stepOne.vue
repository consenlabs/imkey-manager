<template>
  <div class="stepOne">
    <h2>Connect your imKey</h2>
    <div>
      <div :class="['selectBox',isTwoChoose?'active':'','deviceBox']" @click="choose(2)">
        <div class="choose el-icon-check" v-if="isTwoChoose"></div>
        <p></p>
        <deviceImage :small="true"></deviceImage>
        <p>imKey Pro</p>
      </div>
    </div>
  </div>
</template>

<script>
import deviceImage from "../../../components/deviceImage";
export default {
  name: "Home",
  data() {
    return {
      isOneChoose: false,
      isTwoChoose: false,
      isTreeChoose: false
    };
  },
  components:{
    deviceImage
  },
  methods: {
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
      setTimeout(() => {
        this.$emit("showTwo");
      }, 500);
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
