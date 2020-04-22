<template>
  <div class="index">
    <el-container>
      <el-aside width="200px">
        <MenuNav></MenuNav>
      </el-aside>
      <el-container class="right">
        <!-- <el-header>
          <headeTop></headeTop>
        </el-header>-->
        <el-main>
          <div class="main">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <NoticeBox v-if="$store.state.agree" :noticeVisible="noticeVisible" @closeNotice="closeNotice"></NoticeBox>
  </div>
</template>
<script>
import MenuNav from "@/components/menuNav";
import NoticeBox from "@/components/noticeDialog";
// import headeTop from "@//components/head";
export default {
  name: "index",
  data(){
    return{
      noticeVisible: false,
    }
  },
  components: {
    MenuNav,
    NoticeBox
    // headeTop
  },
  mounted() {
    setTimeout(() => {
      this.noticeVisible = true;
    }, 1000);
  },
  methods:{
    closeNotice() {
      this.noticeVisible = false;
      this.$store.state.agree = false;
    },
  }
};
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
  margin: 0 40px;
  // border-top: 1px solid #797777;
}
.right {
  background: #f7f6f6;
}
</style>
