<template>
    <div>
        <div class="connectDevice">
            <h1>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="10.8723" fill="#181818"/>
                    <g clip-path="url(#clip1)">
                        <path d="M30.4788 31.9974C30.4788 35.7838 27.4225 38.8571 23.653 38.8571C19.8836 38.8571 16.8272 35.7838 16.8272 31.9974C16.8272 30.4352 17.3366 29.0089 18.2026 27.8713C18.2026 27.8713 18.2026 27.8713 18.2026 27.8543C18.2535 27.7864 18.3045 27.7185 18.3554 27.6676C18.661 27.328 19.0685 26.8186 19.1025 26.8356C19.1365 26.8525 19.9685 27.311 20.2911 27.5147C20.7835 27.8374 21.8192 28.5505 21.8192 28.5675C21.2929 29.2127 21.1231 29.5353 20.9023 29.807C20.6986 30.0787 20.5288 30.3673 20.3929 30.6899C20.2571 31.0635 20.1722 31.454 20.1552 31.8785C20.1043 33.7123 21.4796 35.3254 23.2965 35.4951C25.3849 35.6989 27.1338 34.0519 27.1338 31.9974C27.1338 30.7918 26.5226 29.7221 25.6057 29.0938H25.5887L25.1812 28.8561L23.0587 27.5996L23.0418 27.5827L20.325 25.9866L19.2383 25.3414C19.1874 25.3074 19.1534 25.2904 19.1025 25.2565C18.9497 25.1716 18.7969 25.0697 18.661 24.9678C16.4197 23.3887 14.9595 20.7908 14.9595 17.8364C14.9595 13.0311 18.8308 9.14282 23.6191 9.14282C28.4073 9.14282 32.2787 13.0311 32.2787 17.8364C32.2787 20.604 30.9882 23.0661 28.9846 24.6622C28.5092 25.0357 27.847 25.1036 27.3036 24.781L24.5869 23.2189C24.3662 23.1 24.2473 22.8623 24.2473 22.6076V19.3306C24.2473 19.2627 24.2982 19.2117 24.3662 19.2117H25.6566V15.7139H24.3662C24.2982 15.7139 24.2473 15.663 24.2473 15.5951V13.8631C24.2473 13.7613 24.1624 13.6594 24.0436 13.6594C23.5851 13.6594 22.5324 13.6594 22.0909 13.6594C21.989 13.6594 21.8871 13.7443 21.8871 13.8631V22.5227C21.8871 22.8793 22.0739 23.2019 22.3796 23.3717L24.2303 24.4414L26.7942 25.9356C26.8282 25.9526 26.8622 25.9696 26.9131 26.0036L27.032 26.0715C27.0999 26.1054 27.1508 26.1394 27.2187 26.1734C29.1884 27.3619 30.4788 29.5183 30.4788 31.9974Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip1">
                            <rect width="17.3192" height="29.7143" fill="white" transform="translate(14.9595 9.14282)"/>
                        </clipPath>
                    </defs>
                </svg>

            </h1>
            <p>{{$t('m.imKeyManager.use_imKey_connected')}}</p>
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
                    <p>{{$t('m.imKeyManager.use_imKey_connect_computer')}}</p>
                    <p>{{$t('m.imKeyManager.click_connect_button')}}</p>
                    <p>{{$t('m.imKeyManager.enter_pin_on_imKey')}}</p>
                    <p class="last">{{$t('m.imKeyManager.if_no_set_pin_can_jump_step3')}}</p>
                    <p class="last1">{{$t('m.imKeyManager.if_bind_device_disconnect_bluetooth')}}</p>
                </div>
            </div>
            <p>
                <button @click="check()">{{$t('m.imKeyManager.connect')}}</button>
            </p>
        </div>

        <!--tip 连接中-->
        <div class="tip2 tip" v-if="status==3">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1" fill="white">
                    <path d="M12 6C12 4.92009 11.7085 3.86021 11.1564 2.93214C10.6042 2.00407 9.8118 1.24223 8.86274 0.726983C7.91368 0.211734 6.84315 -0.0378218 5.76408 0.00463995C4.68501 0.0471017 3.6374 0.380007 2.73176 0.968238C1.82612 1.55647 1.09603 2.37822 0.618498 3.34681C0.140965 4.31539 -0.0663052 5.39491 0.0185526 6.47147C0.10341 7.54804 0.47725 8.58175 1.10064 9.46356C1.72402 10.3454 2.57384 11.0426 3.56046 11.4817L4.08834 10.2955C3.31522 9.95144 2.64928 9.40509 2.16079 8.71409C1.6723 8.0231 1.37935 7.21307 1.31285 6.36945C1.24636 5.52584 1.40878 4.67992 1.78298 3.92092C2.15718 3.16192 2.72929 2.51799 3.43896 2.05704C4.14863 1.59609 4.96956 1.33523 5.81513 1.30195C6.66071 1.26868 7.49959 1.46423 8.24328 1.86799C8.98698 2.27175 9.60792 2.86873 10.0406 3.59598C10.4733 4.32323 10.7017 5.15377 10.7017 6H12Z"/>
                </mask>
                <path d="M12 6C12 4.92009 11.7085 3.86021 11.1564 2.93214C10.6042 2.00407 9.8118 1.24223 8.86274 0.726983C7.91368 0.211734 6.84315 -0.0378218 5.76408 0.00463995C4.68501 0.0471017 3.6374 0.380007 2.73176 0.968238C1.82612 1.55647 1.09603 2.37822 0.618498 3.34681C0.140965 4.31539 -0.0663052 5.39491 0.0185526 6.47147C0.10341 7.54804 0.47725 8.58175 1.10064 9.46356C1.72402 10.3454 2.57384 11.0426 3.56046 11.4817L4.08834 10.2955C3.31522 9.95144 2.64928 9.40509 2.16079 8.71409C1.6723 8.0231 1.37935 7.21307 1.31285 6.36945C1.24636 5.52584 1.40878 4.67992 1.78298 3.92092C2.15718 3.16192 2.72929 2.51799 3.43896 2.05704C4.14863 1.59609 4.96956 1.33523 5.81513 1.30195C6.66071 1.26868 7.49959 1.46423 8.24328 1.86799C8.98698 2.27175 9.60792 2.86873 10.0406 3.59598C10.4733 4.32323 10.7017 5.15377 10.7017 6H12Z" stroke="#43454F" stroke-width="4" stroke-linecap="round" mask="url(#path-1-inside-1)"/>
            </svg>

            <div class="tipBox">
                <h3>{{$t('m.imKeyManager.imKey_connecting_wait')}}</h3>
                <p>
                    <span :class="[checkFirmwareUpgrade==1?'el-icon-success':checkFirmwareUpgrade==2?'fas fa-circle-notch fa-spin':'el-icon-success done']"></span>{{$t('m.imKeyManager.check_firmware_version_update')}}
                </p>
                <p>
                    <span :class="[checkDeviceBindingCode==1?'el-icon-success':checkDeviceBindingCode==2?'fas fa-circle-notch fa-spin':'el-icon-success done']"></span>{{$t('m.imKeyManager.check_device_bind_code')}}
                </p>
                <p>
                    <span :class="[checkPinAndWallet==1?'el-icon-success':checkPinAndWallet==2?'fas fa-circle-notch fa-spin':'el-icon-success done']"></span>{{$t('m.imKeyManager.check_pin_wallet')}}
                </p>
                <p>
                    <span :class="[checkSafetyTest==1?'el-icon-success':checkSafetyTest==2?'fas fa-circle-notch fa-spin':'el-icon-success done']"></span>{{$t('m.imKeyManager.check_secure_test')}}
                </p>
            </div>
        </div>
        <!--tip usb连接异常-->
        <div class="tip1 tip" v-if="status==4">
            <div class="tipBox">
                <h3>{{$t('m.imKeyManager.usb_connect_error')}}</h3>
                <p>{{$t('m.imKeyManager.check_usb_connect')}}，{{errorInfo}}</p>
                <button @click="changeState(1)">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
        <!--tip 固件未升级完毕-->
        <div class="tip3 tip" v-if="status==5">
            <div class="tipBox">
                <p><span class="el-icon-warning-outline"></span></p>
                <h3>{{$t('m.imKeyManager.firmware_update_fail')}}</h3>
                <p>{{$t('m.imKeyManager.find_firmware_update_fail_continue')}}</p>
                <button @click="changeState(7)">{{$t('m.imKeyManager.ok')}}</button>
            </div>
        </div>
        <!--tip 固件升级中-->
        <div class="tip4 tip" v-if="status==6">
            <div class="tipBox">
                <p><span class="fas fa-circle-notch fa-spin"></span></p>
                <h3>{{$t('m.imKeyManager.imKey_pro_firmware_update_wait')}}</h3>
                <p>{{$t('m.imKeyManager.imKey_pro_firmware_update_no_disconnect')}}
                </p>
            </div>
        </div>
        <!--tip 请输入设备绑定码-->
        <div class="tip5 tip" v-if="status==7">
            <div class="tipBox">
                <h3>{{$t('m.imKeyManager.enter_bind_code')}}</h3>
                <div>
                    <input type="text" maxlength="1" v-model="code1" @focus="inpFocus($event)"
                           @keyup="inpCode(1,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code2" @focus="inpFocus($event)"
                           @keyup="inpCode(2,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code3" @focus="inpFocus($event)"
                           @keyup="inpCode(3,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code4" @focus="inpFocus($event)"
                           @keyup="inpCode(4,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code5" @focus="inpFocus($event)"
                           @keyup="inpCode(5,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code6" @focus="inpFocus($event)"
                           @keyup="inpCode(6,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code7" @focus="inpFocus($event)"
                           @keyup="inpCode(7,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                    <input type="text" maxlength="1" v-model="code8" @focus="inpFocus($event)"
                           @keyup="inpCode(8,$event)" onkeyup="this.value=this.value.toUpperCase()" >
                </div>
                <div class="bindTip">
                <p1 v-if="bindingStatus==1"><span class="fas fa-circle-notch fa-spin"></span>{{$t('m.imKeyManager.verifying')}}</p1>
                <p2 v-if="bindingStatus==2"><span class="el-icon-success"></span>{{$t('m.imKeyManager.verified_successfully')}}</p2>
                <p v-if="!codeIsTrue"><span class="el-icon-warning"></span>{{$t('m.imKeyManager.bind_code_error_please_check')}}
                    <a class="link1" @click="openUrl">{{$t('m.imKeyManager.reset_imKey')}}</a>
                    <a>{{$t('m.imKeyManager.retrieved')}}</a>
                </p>
                </div>
            </div>
        </div>
        <!--tip PIN码输入错误-->
        <div class="tip6 tip" v-if="status==8">
            <div class="tipBox">
                <h3>{{$t('m.imKeyManager.enter_pin_imKey_pro')}}</h3>
                <p>{{$t('m.imKeyManager.pin_code_error_please_check')}}
                    <a class="link"   @click="openUrl">{{$t('m.imKeyManager.reset_imKey')}}</a>
                    <a>{{$t('m.imKeyManager.retrieved')}}</a>
                </p>

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
      errorInfo: '',
      userPath: '',
      connectText: this.$t('m.connectDevice.connect'),
      codeIsTrue: true,
      bindingStatus: '', // 0不显示 1验证中 2验证成功
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
    openUrl () {
      ipcRenderer.send('openUrl', 'https://support.imkey.im/hc/zh-cn/articles/360019787533-%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEimKey-')
    },
    changeState (index) {
      this.status = index
    },
    inpCode (code, event) {
      this.codeIsTrue = true
      if (code === 8) {
        // 完成输入  写完成后的跳转
        let bindCode = this.code1 + this.code2 + this.code3 + this.code4 + this.code5 + this.code6 + this.code7 + this.code8
        bindCode = bindCode.toUpperCase()
        const reg = /^[a-hj-np-zA-HJ-NP-Z2-9]{8}$/
        if (reg.test(bindCode)) {
          if (bindCode.length === 8) {
            // 提示正在验证
            this.bindingStatus = 1
            setTimeout(() => {
              this.bindAcquire(bindCode)
            }, 100)
          }
        } else {
          this.codeIsTrue = false
        }
      }
      if (event.srcElement.value.length === 1) {
        event.srcElement.nextElementSibling.focus()
      } else {
        event.srcElement.value = ''
      }

      if (event.keyCode === 8) {
        event.srcElement.previousElementSibling.focus()
      }
    },
    inpFocus () {
      event.srcElement.value = ''
    },

    check () {
      this.checkFirmwareUpgrade = 1
      this.checkDeviceBindingCode = 1
      this.checkPinAndWallet = 1
      this.checkSafetyTest = 1
      // 连接设备
      this.connect()
    },
    checkIsBL () {
      this.checkFirmwareUpgrade = 2

      this.$ipcRenderer.send('isBLStatus')
      this.$ipcRenderer.on('isBLStatus', (result) => {
        // const result = ipcRenderer.sendSync('isBLStatus')
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
          this.errorInfo = response
          this.changeState(4)
        }
      })
    },
    checkIsActive () {
      // 绑定之前检查激活
      this.checkDeviceBindingCode = 2

      this.$ipcRenderer.send('checkUpdate')
      this.$ipcRenderer.on('checkUpdate', (result) => {
        // const result = ipcRenderer.sendSync('checkUpdate')
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
            this.$store.state.apps = appList
            this.connectText = this.$t('m.connectDevice.active_success')
            this.checkIsBind()
          } else {
            // 还没有激活，跳转到激活界面
            this.$router.push('imKeySetting')
          }
        } else {
          this.errorInfo = response
          this.changeState(4)
        }
      })
    },
    checkIsBind () {
      this.$ipcRenderer.send('deviceBindCheck', this.userPath)
      this.$ipcRenderer.on('deviceBindCheck', (result) => {
        // const result = ipcRenderer.sendSync('deviceBindCheck', this.userPath)
        const response = result.result
        if (result.isSuccess) {
          if (response === '' || response === null) {
            // 失败的话
            this.errorInfo = response
            this.changeState(4)
          } else {
            if (response === constants.BIND_STATUS_STRING_BOUND_OTHER) {
              // 弹出绑定码输入框，输入绑定码，输入完成后，检查是否创建钱包
              this.changeState(7)
            } else if (response === constants.BIND_STATUS_STRING_UNBOUND) {
              // 跳转到绑定界面
              this.$router.push('imKeySetting')
            } else if (response === constants.BIND_STATUS_STRING_BOUND_THIS) {
              // 成功绑定 继续
              this.checkDeviceBindingCode = 3
              this.checkIsCreateWallet()
            } else {
              this.errorInfo = response
              this.changeState(4)
            }
          }
        } else {
          this.errorInfo = response
          this.changeState(4)
        }
      })
    },
    checkIsCreateWallet () {
      this.checkPinAndWallet = 2

      this.$ipcRenderer.send('getBTCXpub')
      this.$ipcRenderer.on('getBTCXpub', (result) => {
        // const result = ipcRenderer.sendSync('getBTCXpub')
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
                // 跳转到主页
                this.$router.push('/home/welcomeHome')
                // this.$router.push('imKeySetting')
              }, 2000)
            } else {
              // 跳转到创建钱包界面
              this.$router.push('imKeySetting')
            }
          } else {
            // 跳转到创建钱包界面
            this.$router.push('imKeySetting')
          }
        } else {
          // 错误界面
          this.errorInfo = response
          this.changeState(4)
        }
      })
    },
    bindOtherCheckIsCreateWallet () {
      this.$ipcRenderer.send('getBTCXpub')
      this.$ipcRenderer.on('getBTCXpub', (result) => {
        // const result = ipcRenderer.sendSync('getBTCXpub')
        const response = result.result
        if (result.isSuccess) {
          if (response !== '' || response !== null) {
            if (response.match('xpu')) {
            // 跳转到主页
              this.$router.push('/home/welcomeHome')
            } else {
            // 跳转到创建钱包界面
              this.$router.push('imKeySetting')
            }
          } else {
          // 跳转到创建钱包界面
            this.$router.push('imKeySetting')
          }
        } else {
        // 错误界面
          this.errorInfo = response
          this.changeState(4)
        }
      })
    },
    connect () {
      this.$ipcRenderer.send('connectDevice')
      this.$ipcRenderer.on('connectDevice', (result) => {
        // event.sender.removeAllListeners('connectDeviceResult')
        // const result = ipcRenderer.sendSync('connectDevice')
        const response = result.result
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            this.changeState(3)
            this.checkIsBL()
          } else {
            // 连接失败
            this.errorInfo = response
            this.changeState(4)
          }
        } else {
          // 连接失败
          this.errorInfo = response
          this.changeState(4)
        }
      })
      setTimeout(() => {
        if (this.status === 1) {
          this.changeState(8)
        }
      }, 800)
    },
    toCosUpdate () {
      this.changeState(6)

      this.$ipcRenderer.send('cosUpdate')
      this.$ipcRenderer.on('cosUpdate', (result) => {
        // const result = ipcRenderer.sendSync('cosUpdate')
        const response = result.result
        if (result.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            // cos更新成功检查是否激活
            this.check()
          } else {
            // 固件升级失败
            this.changeState(5)
          }
        } else {
          // 固件升级失败
          this.changeState(5)
        }
      })
    },
    bindAcquire (bindCode) {
      this.$ipcRenderer.send('deviceBindAcquire', bindCode)
      this.$ipcRenderer.on('deviceBindAcquire', (deviceBindResult) => {
        // const deviceBindResult = ipcRenderer.sendSync('deviceBindAcquire', bindCode)
        const response = deviceBindResult.result
        console.log(response)
        if (deviceBindResult.isSuccess) {
          if (response === constants.RESULT_STATUS_SUCCESS) {
            // 绑定成功后存储绑定码
            this.$ipcRenderer.send('importBindCode', bindCode)
            this.$ipcRenderer.on('importBindCode', (importBindResult) => {
              // const bindCodeResult = ipcRenderer.sendSync('importBindCode', bindCode)
              const importBindResponse = importBindResult.result
              if (importBindResult.isSuccess) {
                this.bindingStatus = 2
                this.bindOtherCheckIsCreateWallet()
              } else {
                this.errorInfo = importBindResponse
                this.changeState(4)
              }
            })
          } else {
            this.codeIsTrue = false
            this.bindingStatus = 0
          }
        } else {
          this.codeIsTrue = false
          this.bindingStatus = 0
        }
      })
    },
    getUserPath () {
      this.$ipcRenderer.send('getUserPath')
      this.$ipcRenderer.on('getUserPath', (result) => {
        // const result = ipcRenderer.sendSync('getUserPath')
        const response = result.result
        if (result.isSuccess) {
          this.userPath = response
          this.$store.state.userPath = response
        } else {
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
    }

  }
}
</script>
<style scoped>
    .link:hover,
    hover {
        cursor: pointer;
    }
    .link {
        border-bottom: 0.1px solid #2C2842;
    }
    .link1:hover,
    hover {
        cursor: pointer;
    }
    .link1 {
        border-bottom: 0.1px solid #EC6D62;
    }
    .connectDevice h1 {
        /*width: 48px;*/
        /*height: 48px;*/
        /*border-radius: 50%;*/
        /*background: #000;*/
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
        margin-top: 4%;
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
    .connectDevice .msgBox .msg .last1 {
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
        margin-top: -140px;
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
        line-height: 20px;
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

    /*.tip5 .tipBox {*/
    /*    padding: 0 20px;*/
    /*}*/

    .tip5 .tipBox div {
        padding: 0;
        margin-top: 20px;
    }

    .tip5 p {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 17px;
        color: #EC6D62;
    }
    .tip5 p1 {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 17px;
        color: #000000;
    }
    .tipBox .bindTip .el-icon-success{
        color: #1BAD3B;

    }
    .tip5 p2 {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 17px;
        color: #1BAD3B;
    }

    .tip5 p span {
        padding-right: 5px;
    }

    .tip6 h3 {
        margin-top: 74px;
    }

    .tipBox .el-icon-success{
        color: #E0E0E0;

    }
    .el-icon-success.done{
        color: #000;
    }
</style>
