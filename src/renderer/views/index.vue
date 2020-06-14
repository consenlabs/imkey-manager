<template>
    <div class="index">
        <NoticeBox v-if="$store.state.agree" :noticeVisible="noticeVisible"
                   @closeNotice="closeNotice"></NoticeBox>
        <el-container v-else>
            <el-aside width="200px">
                <MenuNav></MenuNav>
            </el-aside>
            <el-container class="right">
                <el-main>
                    <div class="main">
                        <el-scrollbar style="height:100%">
                            <router-view></router-view>
                        </el-scrollbar>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import MenuNav from '@/components/menuNav'
import NoticeBox from '@/components/noticeDialog'

export default {
  name: 'index',

  components: {
    MenuNav,
    NoticeBox
  },
  data () {
    return {
      noticeVisible: false
    }
  },
  mounted () {
    this.closeNotice()
  },
  methods: {
    closeNotice () {
      this.noticeVisible = false
      this.$store.state.agree = false
      this.router.replace('/home')
    }
  }
}
</script>
<style lang="less" scoped>
    .index {
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .el-menu {
        height: 100%;
    }

    .main {
        overflow: hidden;
        background: #f7f6f6;
    }

    .right {
        background: #f7f6f6;
    }
</style>
