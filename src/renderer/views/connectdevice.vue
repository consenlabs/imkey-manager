<template>
    <div class="connectdevice">
        <NoticeBox :noticeVisible="noticeVisible"
                   @closeNotice="closeErrorView"></NoticeBox>
        <div class="logoview">
            <img style="height:100px" src="../assets/logo.png" alt="">
            <h2>{{$t('m.connectDevice.get_start_imKey')}}</h2>
        </div>
        <div class="bottomBox">
            <div class="selectBox">
                <deviceImage :middle="true" :line="true"></deviceImage>
            </div>
            <div class="textBox">
                <ul style="list-style-type: none">
                    <li>1. {{$t('m.connectDevice.info_connect_imKey')}}</li>
                    <li>2. {{$t('m.connectDevice.info_click_button')}}</li>
                    <li>3. {{$t('m.connectDevice.info_enter_pin')}}</li>
                    <h5>*{{$t('m.connectDevice.info_if_pin')}}</h5>
                </ul>
            </div>
        </div>
        <div class="btns">
            <el-button
                    style="width:100%"
                    :loading="connectLoading"
                    :type="one?'success':'primary'"
                    @click="check()"
            >{{connectText}}
            </el-button>
        </div>
    </div>
</template>

<script>
import deviceImage from '../components/deviceImage'
import constants from '../../common/constants'
import NoticeBox from '@/components/noticeDialog'
import { ipcRenderer } from 'electron'

export default {
  name: 'connectDevice',
  data () {
    return {
      userPath: '',
      one: false,
      connectLoading: false,
      connectText: this.$t('m.connectDevice.connect'),
      connectStatus: false,
      BLStatus: false,
      activeStatus: false,
      bindStatus: false,
      createWalletStatus: false,
      noticeVisible: false
    }
  },
  destroyed () {
    // 移除事件监听
    ipcRenderer.removeAllListeners('connectDeviceResult')
    ipcRenderer.removeAllListeners('isBLStatusResult')
    ipcRenderer.removeAllListeners('checkUpdateResult')
    ipcRenderer.removeAllListeners('deviceBindCheckResult')
    ipcRenderer.removeAllListeners('getBTCXpubResult')
    ipcRenderer.removeAllListeners('cosUpdateResult')
  },
  components: {
    deviceImage,
    NoticeBox
  },
  mounted () {
    this.getUserPath()
    // 禁止主页面滑动
    this.noScroll()
  },
  methods: {
    check () {
      // //连接设备
      this.connect()
    },
    checkIsBL () {
      this.connectText = this.$t('m.connectDevice.check_BL')
      setTimeout(() => {
        // 通过getSeid来判断是否处于BL状态
        ipcRenderer.send('isBLStatus')
        ipcRenderer.on('isBLStatusResult', (event, result) => {
          event.sender.removeAllListeners('isBLStatusResult')
          const response = result.result
          if (result.isSuccess) {
            if (response) {
              // 处于BL状态,更新COS
              this.toCosUpdate()
            } else {
              // 无需更新COS
              this.BLStatus = true
              this.checkIsActive()
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 100)
    },
    checkIsActive () {
      this.connectText = this.$t('m.connectDevice.check_active')
      setTimeout(() => {
        ipcRenderer.send('checkUpdate')
        ipcRenderer.on('checkUpdateResult', (event, result) => {
          event.sender.removeAllListeners('checkUpdateResult')
          const response = result.result
          if (result.isSuccess) {
            const activeStatus = response.status
            if (activeStatus === 'latest') {
              // 缓存激活状态
              this.$store.state.activeStatus = response.status
              // 缓存应用数据
              const appList = []
              const tempAppList = response.list
              for (let i = 0; i < tempAppList.length; i++) {
                let buttonTexts
                if (tempAppList[i].buttonTexts === 'update') {
                  buttonTexts = this.$t('m.manager.update')
                } else {
                  buttonTexts = this.$t('m.manager.install')
                }

                const collection = {
                  name: tempAppList[i].name,
                  desc: tempAppList[i].desc,
                  lastVersion: tempAppList[i].lastVersion,
                  id: i,
                  installLoading: tempAppList[i].installLoading,
                  installDis: tempAppList[i].installDis,
                  deleteDis: tempAppList[i].deleteDis,
                  deleteLoading: tempAppList[i].deleteLoading,
                  icon: tempAppList[i].icon,
                  buttonTexts: buttonTexts
                }
                appList.push(collection)
              }
              this.$store.state.apps = appList
              this.connectText = this.$t('m.connectDevice.active_success')
              this.checkIsBind()
            } else {
              // 还没有激活，跳转到激活界面
              this.goStep(2)
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 200)
    },
    checkIsBind () {
      this.connectText = this.$t('m.connectDevice.check_bind')
      setTimeout(() => {
        ipcRenderer.send('deviceBindCheck', this.userPath)
        ipcRenderer.on('deviceBindCheckResult', (event, result) => {
          event.sender.removeAllListeners('deviceBindCheckResult')
          const response = result.result
          if (result.isSuccess) {
            if (response === '' || response === null) {
              // 失败的话
              this.openErrorView('bind error: null')
            } else {
              if (response === constants.BIND_STATUS_STRING_BOUND_OTHER) {
                // 跳转到绑定界面
                this.goStep(2)
              } else if (response === constants.BIND_STATUS_STRING_UNBOUND) {
                // 跳转到绑定界面
                this.goStep(2)
              } else if (response === constants.BIND_STATUS_STRING_BOUND_THIS) {
                // 成功绑定 继续
                this.bindStatus = true
                this.checkIsCreateWallet()
              } else {
                this.openErrorView(result.data)
              }
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 200)
    },
    checkIsCreateWallet () {
      this.connectText = this.$t('m.connectDevice.check_create_wallet')
      setTimeout(() => {
        ipcRenderer.send('getBTCXpub')
        ipcRenderer.on('getBTCXpubResult', (event, result) => {
          event.sender.removeAllListeners('getBTCXpubResult')
          const response = result.result
          if (result.isSuccess) {
            if (response !== '' || response !== null) {
              if (response.match('xpu')) {
                // 成功 继续
                this.createWalletStatus = true
                this.router.replace('/index')
              } else {
                // 跳转到创建钱包界面
                this.goStep(3)
              }
            } else {
              // 跳转到创建钱包界面
              this.goStep(3)
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 200)
    },
    connect () {
      this.connectLoading = true
      this.connectText = this.$t('m.connectDevice.connecting')
      setTimeout(() => {
        ipcRenderer.send('connectDevice')
        ipcRenderer.on('connectDeviceResult', (event, result) => {
          event.sender.removeAllListeners('connectDeviceResult')
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              this.connectText = this.$t('m.connectDevice.connect_success')
              this.connectStatus = true
              this.checkIsBL()
            } else {
              this.openErrorView(response)
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 200)
    },
    toCosUpdate () {
      this.connectText = this.$t('m.connectDevice.upgrading_firmware')
      setTimeout(() => {
        ipcRenderer.send('cosUpdate')
        ipcRenderer.on('cosUpdateResult', (event, result) => {
          event.sender.removeAllListeners('cosUpdateResult')
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              // cos更新成功检查是否激活
              this.BLStatus = true
              this.checkIsActive()
            } else {
              this.openErrorView(response)
            }
          } else {
            this.openErrorView(response)
          }
        })
      }, 200)
    },
    getUserPath () {
      ipcRenderer.send('getUserPath')
      ipcRenderer.on('getUserPathResult', (event, result) => {
        event.sender.removeAllListeners('getUserPathResult')
        const response = result.result
        if (result.isSuccess) {
          this.userPath = response
          this.$store.state.userPath = response
        } else {
          this.openErrorView(response)
        }
      })
    },
    goStep (index) {
      switch (index) {
        case 1:
          this.router.push({
            path: '/deviceStep',
            query: {
              index: 1
            }
          })
          break
        case 2:
          this.router.push({
            path: '/deviceStep',
            query: {
              index: 2
            }
          })
          break
        case 3:
          this.router.push({
            path: '/deviceStep',
            query: {
              index: 3
            }
          })
          break
      }
    },
    openErrorView (msg) {
      this.connectLoading = false
      this.$store.state.message = msg
      this.noticeVisible = true
    },
    closeErrorView () {
      this.connectText = this.$t('m.connectDevice.connect')
      this.noticeVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
    .connectdevice {
        text-align: center;
        width: 600px;
        margin: 80px auto;

        h2 {
            margin: 30px 0;
        }

        .bottomBox {
            margin: 100px 20px;
            display: flex;
        }

        .textBox {
            text-align: left;
            margin: -80px 20px;

            ul {
                li {
                    height: 50px;
                    line-height: 50px;
                    border: 1px solid #dcdcdc;
                    margin: 20px 0;
                    padding: 0 20px;
                    border-radius: 5px;
                }
            }
        }

        .btns {
            margin-top: 20px;
            margin-left: -30px;
        }
    }
</style>
