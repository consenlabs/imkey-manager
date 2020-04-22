<template>
  <div class="manager" style="-webkit-user-select: none;-webkit-app-region: drag">
    <h1>Manager</h1>
    <p class="notice">
      <span>Install or unstall apps on your device</span>
      <span>
        Need Help?
        <i class="el-icon-connection" @click="help"></i>
      </span>
    </p>
    <div class="deviceBox">
      <div class="contentBox">
        <img src="../../assets/miniDevice.png" style="width:40px;height:auto" alt />
        <div class="deviceName">
          <h3>imKey Pro</h3>
          <p>firmware version {{oldVersionData}}</p>
        </div>
      </div>
      <div v-if="!updateSuccess">
        <span class="updateMsg">firmware is {{newVersionData}} avaliable</span>
        <el-button type="primary" @click="updateVersion" size="small" :loading="loading">update</el-button>
      </div>
    </div>
    <div class="appBox">
      <h1>App catalog</h1>
      <el-input prefix-icon="el-icon-search" v-model="appName" placeholder="search app"></el-input>
      <div class="appConten">
        <div v-for="(item,index) in getApps" :key="index" class="appItem">
          <div class="leftContent">
            <img :src="item.icon" alt="/" />
            <div>
              <h4>{{item.name}}</h4>
              <p>{{item.desc}}</p>
            </div>
          </div>
          <div class="rightContent">
            <div v-if="!isSuccess" class="roate">
              <span class="el-icon-refresh"></span>
            </div>
            <div v-else>
              <el-button
                plain
                type="primary"
                size="small"
                :disabled="item.installDis"
                :loading="item.installLoding"
                @click="intall(item,index)"
              >Install</el-button>
              <el-button
                type="danger"
                size="small"
                @click="delet(item,index)"
                :disabled="item.deletDis"
                :loading="item.deletLoding"
                class="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "manager",
  data() {
    return {
      appName: "",
      isSuccess: false,
      oldVersionData: "1.5.0",
      newVersionData: "1.5.2",
      updateSuccess: false,
      loading: false,
      apps: [
        {
          name: "Ark",
          desc: "version 0.2.1",
          id: 1,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: "https://cdn.whale.token.im/imkey/btc.png"
        },
        {
          name: "Bitcoin",
          desc: "version 0.2.1",
          id: 2,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: "https://cdn.whale.token.im/imkey/btc.png"
        },
        {
          name: "Bitcoin",
          desc: "version 0.2.1",
          id: 2,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: "https://cdn.whale.token.im/imkey/btc.png"
        },
        {
          name: "Bitcoin",
          desc: "version 0.2.1",
          id: 2,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: ""
        },
        {
          name: "Bitcoin",
          desc: "version 0.2.1",
          id: 2,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: ""
        },
        {
          name: "Bitcoin Cash",
          desc: "version 0.2.1",
          id: 3,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: ""
        },
        {
          name: "Dash",
          desc: "version 0.2.1",
          id: 4,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: ""
        },
        {
          name: "Digible",
          desc: "version 0.2.1",
          id: 5,
          installLoding: false,
          installDis: false,
          deletDis: false,
          deletLoding: false,
          icon: ""
        }
      ]
    };
  },
  computed: {
    getApps() {
      let arr = [];
      arr = this.appName
        ? this.apps.filter(ele => {
            if (ele.name.match(this.appName)) {
              return ele;
            }
          })
        : this.apps;
      return arr;
    }
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
    delet(val, index) {
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
.manager {
  padding-top: 60px;
  margin-bottom: 10px;
}
.contentBox {
  display: flex;
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
.appBox {
  .el-input {
    margin: 30px 0;
  }
}
#appConten {
  width: 500px;
  height: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
  line-height: 30px;
  text-align: center;
}
#appConten::-webkit-scrollbar {
  display: none;
}
.appConten {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;


  .appItem {
    width: 45%;
    height: 60px;
    background: #fff;
    border-radius: 5px;
    margin: 10px 20px;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: #dcdcdc;
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .leftContent,
    .rightContent {
      flex: 1;
    }
    .rightContent{
      text-align: right
    }
    .leftContent {
      display: flex;
      justify-content: flex-start;
    }
  }
}
.el-icon-connection {
  color: blue;
  cursor: pointer;
}
</style>