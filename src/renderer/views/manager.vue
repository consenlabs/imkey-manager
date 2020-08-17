<template>
    <div class="container">
        <h2>{{$t('m.imKeyManager.manager')}}</h2>
        <p class="msg">{{$t('m.imKeyManager.view_imKey_Pro_support_coin_list_install_update_Apps')}}</p>
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
                        <a class="col" v-if="item.installed===true" href="javascript:;">{{$t('m.imKeyManager.installed')}}</a>
                        <a v-if="item.installDis===false" href="javascript:;" @click="installApp(item,index)">{{$t('m.imKeyManager.install')}}</a>
                        <a v-if="item.updateDis===false" href="javascript:;" @click="updateApp(item,index)">{{$t('m.imKeyManager.upgrade')}}</a>
<!--                        <a v-if="item.deleteDis===false" href="javascript:;" @click="deleteApp(item,index)">{{$t('m.imKeyManager.delete')}}</a>-->

                        <el-tooltip class="item"  :manual="true" v-if="item.installLoading===true" v-model="item.installLoading" :content="$t('m.imKeyManager.APP_installing_do_not_disconnect_usb')" effect="dark" placement="top-start">
                            <span v-if="item.installLoading===true" class="fas fa-circle-notch fa-spin"></span>
                        </el-tooltip>
                        <el-tooltip  class="item" :manual="true" v-if="item.updateLoading===true" v-model="item.updateLoading" :content="$t('m.imKeyManager.APP_upgrading_do_not_disconnect_usb')" effect="dark" placement="top-start">
                            <span v-if="item.updateLoading===true" class="fas fa-circle-notch fa-spin"></span>
                        </el-tooltip>
<!--                        <el-tooltip class="item" :manual="true" v-if="item.deleteLoading===true" v-model="item.deleteLoading" :content="$t('m.imKeyManager.APP_deleting_do_not_disconnect_usb')" effect="dark" placement="top-start">-->
<!--                            <span v-if="item.deleteLoading===true" class="fas fa-circle-notch fa-spin"></span>-->
<!--                        </el-tooltip>-->

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
        <div class="alert" v-if="supportCode==1">
            <div class="alertBox alert1" >
                <span class="fas fa-circle-notch fa-spin"></span>
                <h4>{{$t('m.imKeyManager.imKey_pro_firmware_update_wait')}}</h4>
                <line></line>
                <p>{{$t('m.imKeyManager.restart_automatically_after_upgrade')}}</p>
                <p>{{$t('m.imKeyManager.upgrading_do_not_disconnect_usb_operating')}}</p>
            </div>
        </div>
        <div class="alert" v-if="supportCode==2">
            <div class="alertBox alert2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h5>{{$t('m.imKeyManager.upgrade_done')}}</h5>
                <p>{{$t('m.imKeyManager.can_used_imKey_manager')}}</p>
                <button @click="changeCode(0)">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
        <div class="alert" v-if="supportCode==3">
            <div class="alertBox alert3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <h5>{{$t('m.imKeyManager.upgrade_fail')}}</h5>
                <p>{{$t('m.imKeyManager.check_usb_internet_connect_click_upgrade_retry')}}</p>
                <button @click="changeCode(0)">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
        <div class="alert" v-if="supportCode==5">
            <div class="alertBox alert3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <h5>{{$t('m.imKeyManager.loading_fail')}}</h5>
                <p>{{$t('m.imKeyManager.check_usb_internet_connect_retry')}}</p>
                <button @click="changeCode(0)">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import constants from '../../common/constants'
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
      description: '',
      supportCode: 0, // 0不显示  1升级中  2升级完成  3升级失败  4绑定码
      isCosUpdate: false,
      centerDialogVisible: false,
      cosOldVersionData: '',
      cosNewVersionData: '',
      cosUpdateStatus: '0'
    }
  },

  computed: {
    getApps () {
      let arr = []
      arr = this.appName.toUpperCase()
        ? this.apps.filter(ele => {
          if (ele.name.match(this.appName.toUpperCase())) {
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
    changeCode (code) {
      this.supportCode = code
    },
    checkFirmwareVersion () {
      // 返回状态 0，无需更新COS，1，更新cos 2，更新错误
      this.$ipcRenderer.send('getFirmwareVersion')
      this.$ipcRenderer.on('getFirmwareVersion', (getFirmwareVersionResult) => {
        const getFirmwareVersionResponse = getFirmwareVersionResult.result
        if (getFirmwareVersionResult.isSuccess) {
          this.cosOldVersionData = getFirmwareVersionResponse
          this.$store.state.cosOldVersionData = getFirmwareVersionResponse
          this.$ipcRenderer.send('cosCheckUpdate')
          this.$ipcRenderer.on('cosCheckUpdate', (cosCheckUpdateResult) => {
            const cosCheckUpdateResponse = cosCheckUpdateResult.result
            if (cosCheckUpdateResult.isSuccess) {
              this.cosNewVersionData = cosCheckUpdateResponse.latestCosVersion
              this.isLatest = cosCheckUpdateResponse.isLatest
              this.updateType = cosCheckUpdateResponse.updateType
              this.description = cosCheckUpdateResponse.description
              // 对比COS版本，提示用户是否升级
              // 如果cos版本不一致，提示用户更新
              if (this.cosNewVersionData === null || this.cosNewVersionData === '') {
                this.isCosUpdate = false
                this.cosUpdateStatus = '0'
              } else {
                if (this.cosOldVersionData === this.cosNewVersionData) {
                  this.isCosUpdate = false
                  this.cosUpdateStatus = '0'
                } else {
                  // 开始升级
                  this.$store.state.isCosUpdate = true
                  this.$store.state.cosNewVersionData = this.cosNewVersionData
                  this.isCosUpdate = true
                  this.cosUpdateStatus = '1'
                }
              }
            } else {
              this.isCosUpdate = false
              // 检查COS更新失败
              this.changeCode(5)
              this.cosUpdateStatus = '2'
            }
          })
        } else {
          this.isCosUpdate = false
          // 获取固件版本失败
          this.changeCode(5)
          this.cosUpdateStatus = '2'
        }
      })
    },
    updateFirmware () {
      this.changeCode(1)
      this.$ipcRenderer.send('connectDevice')
      this.$ipcRenderer.on('connectDevice', (connectResult) => {
        if (connectResult.isSuccess) {
          this.$ipcRenderer.send('cosUpdate')
          this.$ipcRenderer.on('cosUpdate', (cosUpdateResult) => {
            const response = cosUpdateResult.result
            if (cosUpdateResult.isSuccess) {
              if (response === constants.RESULT_STATUS_SUCCESS) {
                this.isCosUpdate = false
                this.cosOldVersionData = this.cosNewVersionData
                this.$store.state.isCosUpdate = false
                this.$store.state.cosOldVersionData = this.cosNewVersionData
                this.$store.state.cosNewVersionData = this.cosNewVersionData
                this.changeCode(2)
                // 更新完cos之后需要清除缓存重新加载数据刷新页面
                // setTimeout(() => {
                //   this.init()
                //   this.changeCode(2)
                // }, 200)
              } else {
                this.isCosUpdate = true
                this.changeCode(3)
              }
            } else {
              this.isCosUpdate = true
              this.changeCode(3)
            }
          })
        } else {
          this.isCosUpdate = true
          this.changeCode(3)
        }
      })
    },

    ok () {
      this.tip = false
    },
    init () {
      // const result = ipcRenderer.sendSync('connectDevice')
      // const response = result.result
      // if (result.isSuccess) {
      //   if (response === constants.RESULT_STATUS_SUCCESS) {
      if (JSON.stringify(this.$store.state.apps) === '[]') {
        // 加载应用
        this.getAppsList()
      } else {
        this.apps = this.$store.state.apps
      }
      // TODO 检测COS升级
      this.checkFirmwareVersion()
      //   } else {
      //     this.tip = true
      //   }
      // } else {
      //   this.tip = true
      // }
    },

    getAppsList () {
      this.$ipcRenderer.send('connectDevice')
      this.$ipcRenderer.on('connectDevice', (connectResult) => {
        if (connectResult.isSuccess) {
          this.$ipcRenderer.send('checkUpdate')
          this.$ipcRenderer.on('checkUpdate', (checkUpdateResult) => {
            const response = checkUpdateResult.result
            if (checkUpdateResult.isSuccess) {
              const appList = []
              const tempAppList = response.list
              for (let i = 0; i < tempAppList.length; i++) {
                if (tempAppList[i].name === 'IMK') {
                  tempAppList[i].name = this.$t('m.imKeyManager.imKey_soft')
                }
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
          })
        } else {
          this.tip = true
        }
      })
    },

    installApp (item, index) {
      if (this.cosUpdateStatus === '1') {
        this.updateFirmware()
      } else if (this.cosUpdateStatus === '0') {
        this.$ipcRenderer.send('connectDevice')
        this.$ipcRenderer.on('connectDevice', (connectResult) => {
          if (connectResult.isSuccess) {
            this.apps[index].installLoading = true
            this.apps[index].deleteLoading = false
            this.apps[index].installDis = true
            this.apps[index].installed = false
              let name = '';
              if (item.name === this.$t('m.imKeyManager.imKey_soft')) {
                  name = 'IMK'
              }else{
                  name = item.name
              }
            this.$ipcRenderer.send('downloadApplet', name)
            this.$ipcRenderer.on('downloadApplet', (downloadAppletResult) => {
              const response = downloadAppletResult.result
              if (downloadAppletResult.isSuccess) {
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
            })
          } else {
            this.tip = true
          }
        })
      } else {

      }
    },

    updateApp (item, index) {
      if (this.cosUpdateStatus === '1') {
        this.updateFirmware()
      } else if (this.cosUpdateStatus === '0') {
        this.$ipcRenderer.send('connectDevice')
        this.$ipcRenderer.on('connectDevice', (connectResult) => {
          if (connectResult.isSuccess) {
            this.apps[index].updateLoading = true
            this.apps[index].deleteLoading = false
            this.apps[index].updateDis = true
            this.apps[index].installed = false
              let name = '';
              if (item.name === this.$t('m.imKeyManager.imKey_soft')) {
                  name = 'IMK'
              }else{
                  name = item.name
              }
            this.$ipcRenderer.send('updateApplet', name)
            this.$ipcRenderer.on('updateApplet', (updateAppletResult) => {
              const response = updateAppletResult.result
              if (updateAppletResult.isSuccess) {
                if (response === constants.RESULT_STATUS_SUCCESS) {
                  this.apps[index].deleteDis = false
                  this.apps[index].installed = true
                  this.apps[index].updateLoading = false
                  this.apps[index].installDis = true
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
            })
          } else {
            this.tip = true
          }
        })
      } else {

      }
    },

    deleteApp (item, index) {
      if (this.cosUpdateStatus === '1') {
        this.updateFirmware()
      } else if (this.cosUpdateStatus === '0') {
        this.$ipcRenderer.send('connectDevice')
        this.$ipcRenderer.on('connectDevice', (connectResult) => {
          if (connectResult.isSuccess) {
            this.apps[index].deleteLoading = true
            this.apps[index].installLoading = false
            this.apps[index].deleteDis = true
            this.apps[index].installed = false
              let name = '';
              if (item.name === this.$t('m.imKeyManager.imKey_soft')) {
                  name = 'IMK'
              }else{
                  name = item.name
              }
            this.$ipcRenderer.send('deleteApplet', name)
            this.$ipcRenderer.on('deleteApplet', (deleteAppletResult) => {
              const response = deleteAppletResult.result
              if (deleteAppletResult.isSuccess) {
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
            })
          } else {
            this.tip = true
          }
        })
      } else {}
    }
  }
}
</script>

<style scoped>
    .alert{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
    }
    .alert .alertBox{
        background: #FAFBFC;
        border-radius: 12px;
        position: absolute;
        left: 50%;
        top: 50%;
        left: 35.42%;
        top: 30.56%;
        bottom: 42.78%;
        width: 420px;
        height: 225px;
        text-align: center;
    }
    .alert1  span{
        margin-top: 33px;
        font-size: 22px;
    }
    .alert1  h4{
        font-weight: 500;
        font-size: 15px;
        color: #2C2842;
        margin-bottom: 41px;
        margin-top: 11px;
    }
    .alert1  p{
        font-weight: 300;
        font-style: normal;
        font-size: 13px;
        line-height: 21px;
        /* or 165% */
        text-align: center;
        color: #2C2842;
        margin-bottom: 6px;
    }
    .alert2 svg,.alert3 svg{
        margin-top: 34px;
    }
    .alert2 h5,.alert3 h5,.alert5 h5{
        font-weight: 500;
        font-size: 15px;
        color: #2C2842;
        margin-top: 12px;
    }
    .alert2 p,.alert3 p,.alert5 p{
        font-weight: 300;
        font-size: 13px;
        color: #2C2842;
        margin-top: 6px;
    }
    .alert2 button,.alert3 button,.alert5 button{
        width: 90px;
        height: 36px;
        background: #2E3035;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        color: #fff;
        margin-top: 24px;
    }

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
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 18px;
        display: flex;
        align-items: center;
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
        font-weight: 600;
        font-size: 15px;
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
    .el-tooltip__popper {
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 18px;
        font-size: 12px;
        line-height: 1.2;
        background: #2E3035;
        border-radius: 6px;
    }
</style>
