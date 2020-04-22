<template>
  <div class="showFour">
    <h2>Enter your Pin Code</h2>

    <div class="bottomBox">
      <div class="selectBox">
        <deviceImage :middle="true"></deviceImage>
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
        :type="one?'success':'primary'"
        @click="choose(1)"
      >Connect</el-button>
    </div>
    <!-- <div class="btns">
      <el-button
        style="width:100%"
        :type="two?'success':'primary'"
        @click="choose(2)"
      >use a dligt for security</el-button>
    </div> -->
  </div>
</template>

<script>
import deviceImage from "../../../components/deviceImage";
export default {
  name: "three",
  data() {
    return {
      one: false,
      two: false
    };
  },
  components: {
    deviceImage
  },
  methods: {
    choose(val) {
      if (val === 1) {
        this.one = true;
        this.two = false;
      }
      if (val === 2) {
        this.one = false;
        this.two = true;
      }
      this.$emit("finsh");
    }
  }
};
</script>
<style lang="less" scoped>
.showFour {
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
        height: 30px;
        line-height: 30px;
      }
    }
  }
.btns{
  margin-top: 20px
}
}

</style>
