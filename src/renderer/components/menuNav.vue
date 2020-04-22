<template>
  <el-menu :default-active="activePath" class="el-menu-vertical-demo" router>
    <div class="black"></div>
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">Home</span>
    </el-menu-item>
    <el-menu-item index="/manager/connect">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">Manager</span>
    </el-menu-item>
    <el-menu-item index="/setting">
      <i class="el-icon-setting"></i>
      <span slot="title">Setting</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "menuNav",
  data() {
    return {
      activePath: ""
    };
  },
  mounted() {
    this.activePath = this.$route.meta.activePath
      ? this.$route.meta.activePath
      : this.$route.path;
  },
  watch: {
    $route(from, to) {
      console.log(from, to);
      this.activePath = from.meta.activePath ? from.meta.activePath : from.path;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.black {
  height: 60px;
}
/deep/.el-menu-item {
  text-align: left;
}
</style>
