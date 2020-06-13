<template>
    <el-dialog
            title="info"
            :visible.sync="noticeVisible"
            width="550px"
            :show-close="false"
            center
    >
        <div class="body">
            <p>{{Message}}</p>
        </div>
        <span slot="footer">
      <el-button type="primary" @click="sure" size="small">ok</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
      name: 'notice',
      props: {noticeVisible: Boolean},
      data () {
        return {
          Message: ''
        }
  },

      watch: {
        noticeVisible () {
          if (this.noticeVisible) {
            this.Message = this.$store.state.message
          }
        }
      },

      methods: {
        handleClose () {
          this.$emit('closeNotice', false)
        },
        sure () {
          this.handleClose()
        }
      }
    }
</script>

<style lang="less" scoped>
    .body {
        height: 200px;
    }
</style>