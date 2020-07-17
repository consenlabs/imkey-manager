<template>
    <div class="container">
        <h2>{{$t('m.imKeyManager.manager')}}</h2>
        <p class="msg">{{$t('m.imKeyManager.imKey_pro_install_uninstall_delete_Apps')}}</p>
        <h3>{{$t('m.imKeyManager.App_list')}}</h3>
        <div class="searchBox">
            <input type="text" :placeholder="$t('m.imKeyManager.search')" v-model="appName">
            <i class="el-icon-search"></i>
        </div>

        <div v-for="(item,index) in getApps" :key="item.id" class="appItem">
            <ul>
                <li>
                    <div class="app">
                        <img :src="item.icon" alt="/"/>
                    </div>
                    <div>
                        <p>{{item.name}}</p>
                        <p>{{item.desc}}</p>
                    </div>
                    <div>
                        <a v-if="item.installDis===false" href="javascript:;" @click="installApp(item,index)">{{$t('m.imKeyManager.install')}}</a>
                        <a v-if="item.updateDis===false" href="javascript:;" @click="updateApp(item,index)">{{$t('m.imKeyManager.upgrade')}}</a>
                        <a class="col" v-if="item.installed===true" href="javascript:;">{{$t('m.imKeyManager.installed')}}</a>
                        <a v-if="item.deleteDis===false" href="javascript:;" @click="deleteApp(item,index)">{{$t('m.imKeyManager.delete')}}</a>
                        <el-tooltip class="item" effect="dark" placement="right">
                            <div slot="content">{{$t('m.imKeyManager.APP_installing_do_not_disconnect_usb')}}</div>
                            <span v-if="item.installLoading===true" class="fas fa-circle-notch fa-spin"></span>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="dark" placement="right">
                            <div slot="content">{{$t('m.imKeyManager.APP_deleting_do_not_disconnect_usb')}}</div>
                            <span v-if="item.updateLoading===true" class="fas fa-circle-notch fa-spin"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" placement="right">
                            <div slot="content">{{$t('m.imKeyManager.APP_upgrading_do_not_disconnect_usb')}}</div>
                            <span v-if="item.deleteLoading===true" class="fas fa-circle-notch fa-spin"></span>
                        </el-tooltip>
                    </div>
                </li>
            </ul>
        </div>
        <div class="dioBox" v-if="tip">
            <div class="box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" stroke="#43454F"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h4>{{$t('m.imKeyManager.install_uninstall_upgrade_delete_Apps_fail')}}</h4>
                <p>{{$t('m.imKeyManager.check_usb_or_internet_connect')}}</p>
                <button @click="ok">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import constants from '../../common/constants'
import { ipcRenderer } from 'electron'

export default {
  name: 'manager',
  data () {
    return {
      tip: false,
      buttonTexts: '',
      appName: '',
      apps: [],
      isLatest: false,
      updateType: '',
      description: ''
    }
  },

  computed: {
    getApps () {
      let arr = []
      arr = this.appName
        ? this.apps.filter(ele => {
          if (ele.name.match(this.appName)) {
            return ele
          }
        })
        : this.apps
      return arr
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    changeStatus (name, code) {
      this[name] = code
      /* if(是否加载成功){
                    成功
                    this[name]=2;
                }else{
                    this[name]=1;
                    this.tip=true;
                } */
    },
    ok () {
      this.tip = false
    },
    init () {
      // const result = ipcRenderer.sendSync('connectDevice')
      // const response = result.result
      // if (result.isSuccess) {
      //   if (response === constants.RESULT_STATUS_SUCCESS) {

      if (this.$store.state.apps === '' || this.$store.state.apps === null || this.$store.state.apps === []) {
        // 加载应用
        this.getAppsList()
      } else {
        this.apps = this.$store.state.apps
      }

      //   } else {
      //     this.tip = true
      //   }
      // } else {
      //   this.tip = true
      // }
    },

    getAppsList () {
      const connectResult = ipcRenderer.sendSync('connectDevice')
      if (connectResult.isSuccess) {
        const result = ipcRenderer.sendSync('checkUpdate')
        const response = result.result
        if (result.isSuccess) {
          const appList = []
          const tempAppList = response.list
          for (let i = 0; i < tempAppList.length; i++) {
            const collection = {
              name: tempAppList[i].name,
              desc: tempAppList[i].desc,
              lastVersion: tempAppList[i].lastVersion,
              id: i,
              installLoading: tempAppList[i].installLoading,
              installDis: tempAppList[i].installDis,
              deleteDis: tempAppList[i].deleteDis,
              installed: tempAppList[i].installed,
              updateLoading: tempAppList[i].updateLoading,
              updateDis: tempAppList[i].updateDis,
              deleteLoading: tempAppList[i].deleteLoading,
              icon: tempAppList[i].icon
            }
            appList.push(collection)
          }
          this.apps = appList
          this.$store.state.apps = appList
          this.isSuccess = true
        } else {
          this.tip = true
        }
      } else {
        this.tip = true
      }
    },

    installApp (item, index) {
      const connectResult = ipcRenderer.sendSync('connectDevice')
      if (connectResult.isSuccess) {
        this.apps[index].installLoading = true
        this.apps[index].deleteLoading = false
        this.apps[index].installDis = true
        this.apps[index].installed = false
        setTimeout(() => {
          const result = ipcRenderer.sendSync('downloadApplet', item.name)
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              this.apps[index].installed = true
              this.apps[index].deleteDis = false
              this.apps[index].installLoading = false
              this.apps[index].desc = this.apps[index].lastVersion
            } else {
              this.apps[index].installLoading = false
              this.tip = true
              this.apps[index].installDis = false
            }
          } else {
            this.apps[index].installLoading = false
            this.apps[index].installDis = false
            this.tip = true
          }
        }, 200)
      } else {
        this.tip = true
      }
    },

    updateApp (item, index) {
      const connectResult = ipcRenderer.sendSync('connectDevice')
      if (connectResult.isSuccess) {
        this.apps[index].updateLoading = true
        this.apps[index].deleteLoading = false
        this.apps[index].updateDis = true
        this.apps[index].installed = false
        setTimeout(() => {
          const result = ipcRenderer.sendSync('updateApplet', item.name)
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              this.apps[index].deleteDis = false
              this.apps[index].installed = true
              this.apps[index].updateLoading = false
              this.apps[index].installDis = false
              this.apps[index].installLoading = false
              this.apps[index].desc = this.apps[index].lastVersion
            } else {
              this.apps[index].installLoading = false
              this.apps[index].updateDis = false
              this.tip = true
            }
          } else {
            this.apps[index].updateDis = false
            this.apps[index].installLoading = false
            this.tip = true
          }
        }, 200)
      } else {
        this.tip = true
      }
    },

    deleteApp (item, index) {
      const connectResult = ipcRenderer.sendSync('connectDevice')
      if (connectResult.isSuccess) {
        this.apps[index].deleteLoading = true
        this.apps[index].installLoading = false
        this.apps[index].deleteDis = true
        this.apps[index].installed = false
        setTimeout(() => {
          const result = ipcRenderer.sendSync('deleteApplet', item.name)
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              this.apps[index].installDis = false
              this.apps[index].deleteLoading = false
              this.apps[index].desc = ''
              this.apps[index].installed = false
            } else {
              this.apps[index].deleteDis = false
              this.apps[index].deleteLoading = false
              this.tip = true
            }
          } else {
            this.apps[index].deleteDis = false
            this.apps[index].deleteLoading = false
            this.tip = true
          }
        }, 200)
      } else {
        this.tip = true
      }
    }
  }
}
</script>

<style scoped>
    .dioBox {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.2);
    }

    .dioBox .box {
        position: absolute;
        left: 35.42%;
        right: 35.42%;
        top: 30.56%;
        bottom: 45.33%;
        background: #FAFBFC;
        border-radius: 12px;
        text-align: center;
        height: 217px;
    }

    .dioBox svg {
        margin-top: 34px;
    }

    .dioBox h4 {
        margin-top: 12px;
        font-weight: 500;
        font-size: 15px;
        line-height: 30px;
        color: #2C2842;
    }

    .dioBox p {
        color: #2C2842;
        font-weight: 300;
        font-size: 13px;
    }

    .dioBox button {
        margin-top: 27px;
        background: #2E3035;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        width: 90px;
        height: 36px;
        color: #fff;
    }

    .container {
        padding-left: 38px;
        font-family: PingFang SC;
    }

    .container h2 {
        margin-top: 57px;
        font-weight: 600;
        font-size: 24px;
    }

    .container .msg {
        margin-top: 6px;
        font-size: 16px;
        color: #8189A7;
    }

    .container h3 {
        margin-top: 50px;
        font-weight: 600;
        font-size: 15px;
        color: #0E1019;
    }

    .container .searchBox {
        position: relative;
        margin-top: 20px;
    }

    .container .searchBox i {
        position: absolute;
        left: 16px;
        top: 9px;
    }

    .container .searchBox input {
        border: none;
        width: 400px;
        height: 34px;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
        border-radius: 147px;
        padding-left: 38px;
        font-size: 13px;
        line-height: 18px;
        color: #C8CAD0;
    }

    .appItem img {
        width: 34px;
        height: 34px;
    }

    .appItem ul {
        margin-top: 34px;
        width: 830px;
    }

    .appItem ul li {
        list-style: none;
        float: left;
        width: 386px;
        height: 80px;
        background: #FAFAFA;
        border-radius: 4px;
        margin-right: 28px;
        margin-bottom: 20px;
    }

    .appItem ul li div {
        float: left;
    }

    .appItem ul li div:nth-child(1) {
        margin-top: 23px;
        margin-left: 20px;
    }

    .appItem ul li div:nth-child(2) {
        margin-top: 18px;
        margin-left: 23px;
    }

    .appItem ul li div:nth-child(3) {
        float: right;
        margin-top: 30px;
    }

    .appItem ul li div p:nth-child(1) {
        color: #0E1019;
    }

    .appItem ul li div p:nth-child(2) {
        color: #8189A7;
    }

    .appItem ul li div a {
        text-decoration: none;
        color: #B8AC95;
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 13px;
        margin-right: 20px;
    }

    .appItem ul li div a.col {
        color: #D0D0D0;
    }

    .appItem ul li div span {
        margin-right: 20px;
    }
    .appItem ul li div span {
        margin-right: 20px;
        color: #B8AC95;
    }
</style>
