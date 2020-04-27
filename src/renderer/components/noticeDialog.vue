<template>
  <el-dialog
    title="welcome"
    :visible.sync="noticeVisible"
    width="600px"
    :show-close="false"
    center
  >
    <div class="body">
      <p>welcome to imKey-desktop</p>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="sure" size="small">Got it</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "notice",
  props: { noticeVisible: Boolean },
  mounted() {
    this.handleClose();
  },
  methods: {
    handleClose() {
      this.$emit("closeNotice", false);
    },
    sure() {
      this.handleClose();
    }
  }
};
</script>

<style lang="less" scoped>
.body {
  height: 350px;
}
</style>