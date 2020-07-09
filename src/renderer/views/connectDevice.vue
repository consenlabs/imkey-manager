<template>
    <div>
        <div class="connectDevice">
            <h1>
                <svg width="18" height="30" viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.1173 21.6788C17.1173 26.4596 12.9857 30.237 8.08692 29.7058C4.48659 29.2926 1.5355 26.4596 1.0043 22.8592C0.473108 19.1409 2.3618 16.0717 5.19485 14.5962C5.37191 14.5372 5.54898 14.5962 5.608 14.7733C5.96213 15.6586 6.55235 16.3078 7.14257 17.0161C7.26061 17.1341 7.20159 17.3702 7.02453 17.4883C5.43094 18.2555 4.36854 19.8491 4.36854 21.7378C4.36854 24.5119 6.78844 26.7547 9.62148 26.4005C11.7463 26.1645 13.4579 24.4528 13.694 22.3871C13.9891 20.1442 12.6906 18.1965 10.8609 17.4292C10.8019 17.3702 10.0346 17.0161 9.50344 16.721C7.61474 15.6586 6.37529 13.5928 6.37529 11.409V1.13922C6.37529 1.0802 6.37529 1.0802 6.43431 1.02118C6.43431 1.02118 6.49333 0.962158 6.55235 0.962158H9.97562C10.0937 0.962158 10.2117 1.0802 10.2117 1.19825V4.8576V11.291C10.2117 12.4714 10.8609 13.5338 11.9233 14.065L12.5726 14.4191L12.7496 14.5372C15.2876 15.7766 17.1173 18.4916 17.1173 21.6788Z"
                          fill="white"/>
                    <path d="M14.6384 1.19831V6.3332C14.6384 6.45125 14.5794 6.51027 14.4613 6.51027H11.6873C11.5693 6.51027 11.5103 6.45125 11.5103 6.3332V1.19831C11.5103 1.08026 11.5693 1.02124 11.6873 1.02124H14.4613C14.5204 1.02124 14.6384 1.08026 14.6384 1.19831Z"
                          fill="white"/>
                </svg>
            </h1>
            <p>使用 imKey Pro 完成连接</p>
            <div class="msgBox">
                <div class="msgImg">
                    <svg width="78" height="159" viewBox="0 0 78 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0)">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M2.5 118.772L2.5 16.2276C2.5 11.9595 6.14238 8.5 10.6337 8.5L68.3663 8.5C72.8587 8.5 76.5 11.9595 76.5 16.2276L76.5 118.772C76.5 123.039 72.8587 126.5 68.3663 126.5L10.6337 126.5C6.14237 126.5 2.49999 123.039 2.5 118.772Z"
                                  fill="white" stroke="#181818"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M35.9755 115.071L35.9755 67.8935C35.9755 66.125 37.4071 64.6897 39.1724 64.6897L64.7021 64.6897C66.4674 64.6897 67.8989 66.125 67.8989 67.8935L67.8989 115.071C67.8989 116.84 66.4674 118.274 64.7021 118.274L39.1724 118.274C37.4071 118.274 35.9755 116.84 35.9755 115.071Z"
                                  stroke="#181818"/>
                            <path d="M13.85 49.7617L13.8382 49.738L13.7803 49.6803C13.5747 49.4753 13.3948 49.244 13.2286 48.9943L13.2287 48.9942L13.2232 48.9863C12.9453 48.5856 12.7411 48.176 12.5986 47.7784L12.5956 47.77L12.5923 47.7617C12.5123 47.5613 12.4456 47.3464 12.4068 47.1383C12.3956 47.0763 12.3819 47.0123 12.3699 46.9559C12.3682 46.948 12.3666 46.9404 12.365 46.9328C12.3511 46.8671 12.3391 46.8094 12.3299 46.7541L12.3267 46.7344L12.3247 46.7265C12.3243 46.7232 12.3238 46.7183 12.323 46.7107C12.3228 46.7084 12.3226 46.7059 12.3223 46.7031C12.3199 46.6783 12.3155 46.6336 12.3075 46.5857L12.3053 46.5726L12.3024 46.5595C12.2917 46.5112 12.2818 46.4076 12.2818 46.275L12.2818 46.2559L12.2804 46.2367C12.2738 46.1509 12.2669 46.089 12.2611 46.0369C12.253 45.9639 12.2471 45.9103 12.2471 45.8374C12.2471 45.8035 12.2503 45.7659 12.2566 45.7002L12.2572 45.6935C12.2624 45.6397 12.2696 45.5645 12.2705 45.4843C12.2818 45.3034 12.2908 45.1603 12.317 45.0204L12.319 45.0097L12.3205 44.999L12.3498 44.7935C12.3607 44.7514 12.369 44.7127 12.3751 44.684L12.3761 44.6795C12.385 44.6377 12.3901 44.6147 12.396 44.5942L12.4052 44.5619L12.41 44.5287C12.4154 44.4913 12.4279 44.4428 12.4512 44.3649L12.4533 44.358L12.4551 44.3511C13.091 41.9842 15.2597 40.2439 17.8293 40.2439C20.9009 40.2439 23.4004 42.7455 23.4004 45.8374C23.4004 48.9293 20.9009 51.4308 17.8293 51.4308C17.391 51.4308 16.9639 51.3803 16.5472 51.2805C16.436 51.2478 16.3158 51.2155 16.2008 51.1845C16.1557 51.1723 16.1114 51.1604 16.0687 51.1487C15.3139 50.9016 14.5002 50.4405 13.85 49.7617Z"
                                  stroke="black"/>
                            <path d="M17.8184 86.3315C14.747 86.3315 12.2473 83.8289 12.2473 80.7369C12.2473 77.6451 14.7467 75.1445 17.8184 75.1445C20.9019 75.1445 23.4006 77.6457 23.4006 80.7369C23.4006 83.8283 20.9016 86.3315 17.8184 86.3315Z"
                                  stroke="black"/>
                            <path d="M23.3982 98.1848C23.3982 101.276 20.8998 103.781 17.8215 103.781C14.7433 103.781 12.2449 101.276 12.2449 98.1848C12.2449 95.0929 14.7433 92.5891 17.8215 92.5891C20.8998 92.5891 23.3982 95.0929 23.3982 98.1848Z"
                                  stroke="black"/>
                            <path d="M17.8184 68.8806C14.7468 68.8806 12.2473 66.3791 12.2473 63.2872C12.2473 60.1954 14.7467 57.6948 17.8184 57.6948C20.9019 57.6948 23.4006 60.196 23.4006 63.2872C23.4006 66.3785 20.9017 68.8806 17.8184 68.8806Z"
                                  stroke="black"/>
                        </g>
                        <path d="M14 126H25V137C25 138.105 24.1046 139 23 139H19.5H16C14.8954 139 14 138.105 14 137V126Z"
                              fill="black"/>
                        <path d="M17 158.5V138" stroke="black"/>
                        <path d="M22 158.5V138" stroke="black"/>


                        <defs>
                            <clipPath id="clip0">
                                <rect width="128" height="77" fill="white" transform="translate(77.5 0.5) rotate(90)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div class="msg">
                    <p>1. 使用 USB 将 imkey Pro 连接至电脑</p>
                    <p>2. 点击「连接」按钮</p>
                    <p>3. 在 imKey Pro 中输入 PIN 码</p>
                    <p class="last">* 如果你尚未在 imKey Pro 中设置 PIN 码，可以跳过第 3 步</p>
                </div>
            </div>
            <p>
                <button @click="check()">连接</button>
            </p>
        </div>

        <!--tip 连接中-->
        <div class="tip2 tip" v-if="status==3">
            <div class="tipBox">
                <h3>imKey 连接中，请耐心等待</h3>
                <p>
                    <span :class="[checkFirmwareUpgrade==1?'el-icon-success':checkFirmwareUpgrade==2?'el-icon-loading':'el-icon-success done']"></span>检查固件版本升级
                </p>
                <p>
                    <span :class="[checkDeviceBindingCode==1?'el-icon-success':checkDeviceBindingCode==2?'el-icon-loading':'el-icon-success done']"></span>检查设备绑定码
                </p>
                <p>
                    <span :class="[checkPinAndWallet==1?'el-icon-success':checkPinAndWallet==2?'el-icon-loading':'el-icon-success done']"></span>检查 PIN 码及钱包检查安全测试
                </p>
                <p>
                    <span :class="[checkSafetyTest==1?'el-icon-success':checkSafetyTest==2?'el-icon-loading':'el-icon-success done']"></span>检查安全测试
                </p>
            </div>
        </div>
        <!--tip usb连接异常-->
        <div class="tip1 tip" v-if="status==4">
            <div class="tipBox">
                <h3>USB 连接异常</h3>
                <p>请拔出 USB 重试或检查 USB 接口是否松动，确认无误后再次点击「连接」</p>
                <button @click="changeState(1)">确定</button>
            </div>
        </div>
        <!--tip 固件未升级完毕-->
        <div class="tip3 tip" v-if="status==5">
            <div class="tipBox">
                <p><span class="el-icon-warning-outline"></span></p>
                <h3>固件升级未完成</h3>
                <p>检测到因应用异常退出导致固件升级未完成，请继续升级，完成后可正常使用 imKey Manager</p>
                <button @click="changeState(7)">确定</button>
            </div>
        </div>
        <!--tip 固件升级中-->
        <div class="tip4 tip" v-if="status==6">
            <div class="tipBox">
                <p><span class="el-icon-loading"></span></p>
                <h3>imKey Pro 固件版本升级中，请耐心等待</h3>
                <p>注意：升级完成后 imKey Pro 将自动重启
                    升级过程中请勿断开 USB 连接，同时中止 imKey 操作
                </p>
            </div>
        </div>
        <!--tip 请输入设备绑定码-->
        <div class="tip5 tip" v-if="status==7">
            <div class="tipBox">
                <h3>请输入设备绑定码</h3>
                <div>
                    <input type="text" maxlength="1" v-model="code1" @focus="inpFocus($event)"
                           @keyup="inpCode(1,$event)">
                    <input type="text" maxlength="1" v-model="code2" @focus="inpFocus($event)"
                           @keyup="inpCode(2,$event)">
                    <input type="text" maxlength="1" v-model="code3" @focus="inpFocus($event)"
                           @keyup="inpCode(3,$event)">
                    <input type="text" maxlength="1" v-model="code4" @focus="inpFocus($event)"
                           @keyup="inpCode(4,$event)">
                    <input type="text" maxlength="1" v-model="code5" @focus="inpFocus($event)"
                           @keyup="inpCode(5,$event)">
                    <input type="text" maxlength="1" v-model="code6" @focus="inpFocus($event)"
                           @keyup="inpCode(6,$event)">
                    <input type="text" maxlength="1" v-model="code7" @focus="inpFocus($event)"
                           @keyup="inpCode(7,$event)">
                    <input type="text" maxlength="1" v-model="code8" @focus="inpFocus($event)"
                           @keyup="inpCode(8,$event)">
                </div>
                <p v-if="!codeIsTrue"><span class="el-icon-warning"></span>绑定码错误，请仔细核对，或通过导入助记词 重置 imKey 找回</p>
            </div>
        </div>
        <!--tip PIN码输入错误-->
        <div class="tip6 tip" v-if="status==8">
            <div class="tipBox">
                <h3>请在 imKey Pro 中输入 PIN 码</h3>
                <p>PIN 码错误 / 遗忘可以通过 重置 imKey 找回</p>
            </div>
        </div>
    </div>
</template>

<script>
import constants from '../../common/constants'
import { ipcRenderer } from 'electron'

export default {
  name: 'connectDevice',
  data () {
    return {
      userPath: '',
      connectText: this.$t('m.connectDevice.connect'),
        codeIsTrue: true,
      status: 1, // 1开始界面  2连接页面 3检测x`页面  4 检测异常页面  5固件未升级完成页面 6固件升级中 7请输入设备绑定码 8验证码错误
      checkFirmwareUpgrade: 1, // 检测固件版本升级  1 还没检测  2正在检测  3检测成功
      checkDeviceBindingCode: 1, // 检查设备绑定码
      checkPinAndWallet: 1, // 检查 PIN 码及钱包
      checkSafetyTest: 1, // 检查 安全测试
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
      code7: '',
      code8: ''
    }
  },
  mounted () {
    this.getUserPath()
    // 禁止主页面滑动
    this.noScroll()
  },
  methods: {
    changeState (index) {
      this.status = index
    },
    inpCode (code, event) {
        this.codeIsTrue=true
      if (code === 8) {
        // 完成输入  写完成后的跳转
        const bindCode = this.code1 + this.code2 + this.code3 + this.code4 + this.code5 + this.code6 + this.code7 + this.code8

        const reg = /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/
        if (reg.test(bindCode)) {
          this.bindAcquire(bindCode)
        } else {
          this.codeIsTrue=false
        }
      }
      if (event.srcElement.value.length === 1) {
        event.srcElement.nextElementSibling.focus()
      }
      if (event.keyCode === 8) {
        event.srcElement.previousElementSibling.focus()
      }
      return;
    },
    inpFocus () {
      event.srcElement.value = ''
    },

    check () {
      // //连接设备
      this.connect()
    },
    checkIsBL () {
      this.checkFirmwareUpgrade = 2
      setTimeout(() => {
        const result = ipcRenderer.sendSync('isBLStatus')
          const response = result.result
          if (result.isSuccess) {
            if (response) {
              // 处于BL状态,更新COS
              this.toCosUpdate()
            } else {
              // 无需更新COS
              this.checkFirmwareUpgrade = 3
              this.checkIsActive()
            }
          } else {
            this.changeState(4)
          }
      }, 100)
    },
    checkIsActive () {
      // 绑定之前检查激活
      this.checkDeviceBindingCode = 2
      setTimeout(() => {
          const result = ipcRenderer.sendSync('checkUpdate')
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
                this.$router.push('imKeySetting');
            }
          } else {
            this.changeState(4)
          }
      }, 200)
    },
    checkIsBind () {
      setTimeout(() => {
          const result = ipcRenderer.sendSync('deviceBindCheck', this.userPath)

          const response = result.result
          if (result.isSuccess) {
            if (response === '' || response === null) {
              // 失败的话
              this.openErrorView('bind error: null')
            } else {
              if (response === constants.BIND_STATUS_STRING_BOUND_OTHER) {
                // 弹出绑定码输入框，输入绑定码，输入完成后，检查是否创建钱包
                this.changeState(7)
              } else if (response === constants.BIND_STATUS_STRING_UNBOUND) {
                // 跳转到绑定界面
                  this.$router.push('imKeySetting');
              } else if (response === constants.BIND_STATUS_STRING_BOUND_THIS) {
                // 成功绑定 继续
                this.checkDeviceBindingCode = 3
                this.checkIsCreateWallet()
              } else {
                this.changeState(4)
              }
            }
          } else {
            this.changeState(4)
          }

      }, 200)
    },
    checkIsCreateWallet () {
      this.checkPinAndWallet = 2
      setTimeout(() => {
          const result = ipcRenderer.sendSync('getBTCXpub')
          const response = result.result
          if (result.isSuccess) {
            if (response !== '' || response !== null) {
              if (response.match('xpu')) {
                this.checkPinAndWallet = 3
                this.checkSafetyTest = 2
                setTimeout(() => {
                  this.checkSafetyTest = 3
                }, 1000)
                setTimeout(() => {
                    //跳转到主页
                    // this.router.replace('/index')
                    this.$router.push('imKeySetting');
                }, 2000)

              } else {
                // 跳转到创建钱包界面
                  this.$router.push('imKeySetting');
              }
            } else {
              // 跳转到创建钱包界面
                this.$router.push('imKeySetting');
            }
          } else {
            // 错误界面
            this.changeState(4)
          }
      }, 200)
    },
    connect () {
      this.changeState(3)
      setTimeout(() => {
          const result = ipcRenderer.sendSync('connectDevice')

          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              this.checkIsBL()
            } else {
                //连接失败
              this.changeState(4)
            }
          } else {
              //连接失败
            this.changeState(4)
          }
      }, 200)
    },
    toCosUpdate () {
      this.changeState(6)
      setTimeout(() => {
          const result = ipcRenderer.sendSync('cosUpdate')
          const response = result.result
          if (result.isSuccess) {
            if (response === constants.RESULT_STATUS_SUCCESS) {
              // cos更新成功检查是否激活
              this.check()
            } else {
                //固件升级失败
              this.changeState(5)
            }
          } else {
              //固件升级失败
            this.changeState(5)
          }
      }, 200)
    },
    bindAcquire (bindCode) {
        const result = ipcRenderer.sendSync('deviceBindAcquire', bindCode)
        const response = result.result
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            this.checkIsCreateWallet()
          } else {
            this.codeIsTrue=false
          }
        } else {
            this.codeIsTrue=false
        }
    },
    getUserPath () {
        const result = ipcRenderer.sendSync('getUserPath')
        const response = result.result
        if (result.isSuccess) {
          this.userPath = response
          this.$store.state.userPath = response
        } else {
        }
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
    }

  }
}
</script>
<style scoped>
    .connectDevice h1 {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #000;
        text-align: center;
        margin: 6% auto 0;
    }

    .connectDevice h1 svg {
        margin-top: 8px;
    }

    .connectDevice p {
        margin-top: 2%;
        font-weight: 600;
        font-size: 22px;
        line-height: 31px;
        text-align: center;
        color: #000000;
    }

    .connectDevice .msgBox {
        margin-top: 3%;
        display: flex;
        justify-content: center;
    }

    .connectDevice .msgBox .msg {
        margin-left: 88px;
    }

    .connectDevice .msgBox .msgImg {
        margin-left: 174px;
    }

    .connectDevice .msgBox .msg p {
        text-align: left;
        font-size: 16px;
        font-weight: normal;

    }

    .connectDevice .msgBox .msg .last {
        margin-top: 20px;
        font-size: 15px;
        font-weight: 300;
    }

    .connectDevice p button {
        width: 400px;
        height: 44px;
        background: #2E3035;
        border-radius: 44px;
        color: #fff;
        margin-top: 30px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
    }

    .tip {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        left: 0;
    }

    .tipBox {
        background: #FAFBFC;
        border-radius: 12px;
        width: 400px;
        height: 217px;
        position: absolute;
        top: 45%;
        left: 50%;
        margin-left: -240px;
        margin-top: -150px;
        text-align: center;
        padding: 0 44px;
    }

    .tipBox h3 {
        margin-top: 40px;
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        ine-height: 30px;
        color: #2C2842;
    }

    .tipBox p {
        margin-top: 14px;
        font-style: normal;
        font-weight: 300;
        font-size: 13px;
        ine-height: 20px;
        color: #2C2842;
    }

    .tipBox button {
        background: #2E3035;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        width: 90px;
        height: 36px;
        color: #fff;
        margin-top: 45px;

        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
    }

    .tip2 h3 {
        font-weight: 500;
        font-size: 15px;
        color: #2C2842;
    }

    .tip2 p {
        text-align: left;
        font-style: normal;
        font-size: 15px;
        color: #8189A7;
    }

    .tip2 p span {
        margin-right: 6px;
        color: #000;
    }

    .tip3 button {
        background: #2E3035;
        border-radius: 26.5px;
        color: #FAFBFC;
    }

    .tip3 h3 {
        margin-top: 20px;
    }

    .tip3 button {
        margin-top: 26px;
    }

    .tip4 span {
        margin-top: 20px;
        font-size: 26px;
    }

    .tip4 h3 {
        margin-top: 20px;
    }

    .tip5 h3 {
        font-weight: 500;
        font-size: 15px;
        color: #2C2842;
    }

    .tip5 input {
        width: 38px;
        height: 47px;
        border: 0.5px solid #000000;
        box-sizing: border-box;
        margin: 0 3px;
        text-align: center;

        font-family: SF Compact Display;
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 29px;

    }

    .tip5 .tipBox {
        padding: 0 20px;
    }

    .tip5 .tipBox div {
        padding: 0;
        margin-top: 20px;
    }

    .tip5 p {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 17px;
        color: #EC6D62;
    }

    .tip5 p span {
        padding-right: 4px;
    }

    .tip6 h3 {
        margin-top: 74px;
    }
</style>
