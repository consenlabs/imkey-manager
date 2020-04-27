<template>
  <div class="setting">
    <h1>Setting</h1>
    <p class="notice">
      <span>Setting imKey-desktop</span>
      <span>
        Need Help?
        <i class="el-icon-connection" @click="help"></i>
      </span>
    </p>
    <div class="deviceBox">
      <div class="contentBox">
        <img src="../../assets/logo64.png" style="width:60px;height:70px" alt="">
        <div class="deviceName">
          <h3>imKey-desktop</h3>
          <p>imKey-desktop version {{oldVersionData}}</p>
        </div>
      </div>
      <div v-if="!updateSuccess">
        <span class="updateMsg">imKey-desktop version is {{newVersionData}} avaliable</span>
        <el-button type="primary" @click="updateVersion" size="small" :loading="loading">update</el-button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      appName: "",
      isSuccess: false,
      oldVersionData: "1.0.0",
      newVersionData: "1.0.2",
      loading: false,
      updateSuccess:false
    };
  },
  mounted() {
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  },
  methods: {
    updateVersion() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.updateSuccess = true;
        this.oldVersionData = this.newVersionData;
      }, 1500);
    },
    intall(val, index) {
      this.apps[index].installLoding = true;
      this.apps[index].deletLoding = false;
      setTimeout(() => {
        this.apps[index].deletDis = false;
        this.apps[index].installDis = true;
        this.apps[index].installLoding = false;
      }, 1500);
    },
    delet(val,index){
       this.apps[index].deletLoding = true;
       this.apps[index].installLoding = false;
      setTimeout(() => {
        this.apps[index].deletDis = true;
        this.apps[index].installDis = false;
        this.apps[index].deletLoding = false;
      }, 1500);
    },
    help() {
      window.open(
        "https://support.imkey.im/hc/zh-cn/articles/360019656954-如何设置与修改-PIN-码",
        "_blank",
        "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes"
      );
    },
  }
};
</script>

<style lang="less" scoped>
.setting {
  padding-top: 60px;
  margin-bottom: 370px;
}
.contentBox{
  display: flex;
  align-items: center;
}
.notice {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.deviceBox {
  height: 100px;
  background: #fff;
  margin: 30px 0;
  padding: 0 30px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .updateMsg {
    margin: 0 20px;
  }
  .deviceName {
    margin-left: 10px;
    p {
      color: #dcdcdc;
      margin-top: 10px;
    }
  }
}
.el-icon-connection {
  color: blue;
  cursor: pointer;
}
</style>