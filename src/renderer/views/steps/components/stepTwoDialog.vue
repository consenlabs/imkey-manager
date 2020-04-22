<template>
  <el-dialog
    title="Active&Bind"
    :visible.sync="boxVisible"
    width="400px"
    :before-close="handleClose"
    top="30vh"
  >
    <div class="sideBox">
      <div class="chooseBox">
        <div>
          <span class="el-icon-s-tools icon"></span>
          <span>Activating your imKey</span>
        </div>
        <div v-loading="loading1" element-loading-spinner="el-icon-loading loading" v-if="loading1"></div>
        <div v-else :class="status1?'el-icon-check':'el-icon-close'"></div>
      </div>
      <div class="chooseBox secondChoose">
        <div>
          <el-input v-model="value" style="width:250px" placeholder="enter bind code"></el-input>
        </div>
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="insert"
            v-if="!isCorret"
            :loading="loading"
            :disabled="!status1"
          >Bind</el-button>
          <span v-else :class="isCorret?'el-icon-check':'el-icon-close'"></span>
        </div>
      </div>
      <div class="chooseBox">
        <div>
          <span class="el-icon-s-opportunity icon"></span>
          <span>Binding your imKey</span>
        </div>
        <div v-if="showThree">
          <span v-loading="loading3" element-loading-spinner="el-icon-loading" v-if="loading3"></span>
          <span v-else :class="status3?'el-icon-check':'el-icon-close'"></span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "checkBox",
  data() {
    return {
      status1: false,
      value: "",
      status3: false,
      isCorret: false,
      loading: false,
      loading1: true,
      loading3: false,
      showTwo: false,
      showThree: false
    };
  },
  props: { boxVisible: Boolean },
  watch: {
    boxVisible() {
      if (this.boxVisible) {
        this.firstCheck();
      }
    }
  },
  methods: {
    firstCheck() {
      this.loading1 = true;
      //第一步成功的话，继续要一步操作
      setTimeout(() => {
        this.loading1 = false;
        this.status1 = true;
        this.showTwo = true;
      }, 1000);
      //失败的话
      // this.$emit("showTree", false);
    },
    handleClose() {
      this.$emit("closeCheckBox", false);
      this.status1 = false;
      this.value = "";
      this.status3 = false;
      this.isCorret = false;
      this.loading = false;
      this.loading1 = true;
      this.loading3 = false;
      this.showTwo = false;
      this.showThree = false;
    },
    insert() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.isCorret = true;
        this.showThree = true;
        this.status3 = true;
        this.loading3 = true;
      }, 800);
      setTimeout(() => {
        this.loading3 = false;
      }, 2000);
      setTimeout(() => {
        //第三部成功的话
        this.$emit("showTree", true);
        //失败的话
        // this.$emit("showTree", false);
        this.handleClose();
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.chooseBox {
  display: flex;
  padding: 0 10px;
  height: 60px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
}
.secondChoose {
  border-top: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
}
.sideBox {
  border: 1px solid #dcdcdc;
  border-radius: 5px;
}
.el-icon-check {
  color: green;
}
.el-icon-close {
  color: tomato;
}
.loading {
  margin-top: 20px;
  margin-right: 20px;
}
/deep/.el-loading-spinner {
  top: 65%;
  margin-top: -7px;
  width: 100%;
  text-align: center;
  position: absolute;
  right: 10px;
}
.icon {
  margin-right: 10px;
}
</style>