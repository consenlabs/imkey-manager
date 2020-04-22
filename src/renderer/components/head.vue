<template>
  <div class="header">
    <span
      class="el-icon-switch-button"
      @click="exit"
    ></span>
  </div>
</template>

<script>
export default {
  name: "headNav",
  methods: {
    exit() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center:true
      })
        .then(() => {
          this.router.replace("/menu");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  padding: 20px 40px;
  height: 40px;
  line-height: 40px;
  text-align: right;
  font-size: 28px;
  color: #409eff;
}
</style>