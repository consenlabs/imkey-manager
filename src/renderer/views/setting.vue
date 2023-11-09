<template>
  <div class="container" v-if="status==1 || status==6">
    <h2>{{$t('m.imKeyManager.setting')}}</h2>
    <p class="msg">{{$t('m.imKeyManager.imKey_pro_setting_and_info')}}</p>
    <h3>{{$t('m.imKeyManager.device')}}</h3>
    <div class="equipmentBox">
      <div class="session1">
        <div class="left">
          <p>imKey Pro</p>
          <p>ble version {{bleOldVersionData}}</p>
          <p>firmware version {{cosOldVersionData}}</p>
        </div>
        <div class="rightNoUpdate" v-if="isCosUpdate==false">
          <p>
            {{$t('m.imKeyManager.current_least_cos_version')}}
            <button>{{$t('m.imKeyManager.upgrade')}}</button>
          </p>
        </div>
        <div class="rightUpdate" v-if="isCosUpdate==true">
          <p>
            {{$t('m.imKeyManager.found_new_cos_version')}}
            <button @click="isShowalert">{{$t('m.imKeyManager.upgrade')}}</button>
          </p>
        </div>
      </div>
      <div class="session2">

        <p>{{$t('m.imKeyManager.device_SN')}}SN:{{SN}}
          <el-tooltip :manual="true" v-model="copyTooltipDisabled" :content="$t('m.imKeyManager.copy_success')" placement="top">
            <span class="el-icon-copy-document" @click="copyText"></span>
          </el-tooltip>
        </p>
        <p>{{$t('m.imKeyManager.device_bind_code')}}<span class="exportBindCode" @click="exportBindCode">{{$t('m.imKeyManager.export')}}</span></p>
      </div>
    </div>
    <h3>{{$t('m.imKeyManager.understand_more')}}</h3>
    <div class="moreBox">
      <a class="link5" @click="openUrl('getStarted')">
        <div class="box">
          <a>
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33.25 7H29.75V22.75H7V26.25C7 27.2125 7.7875 28 8.75 28H28L35 35V8.75C35 7.7875 34.2125 7 33.25 7ZM26.25 17.5V1.75C26.25 0.7875 25.4625 0 24.5 0H1.75C0.7875 0 0 0.7875 0 1.75V26.25L7 19.25H24.5C25.4625 19.25 26.25 18.4625 26.25 17.5Z" fill="url(#paint0_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="2.75964e-07" y1="26.5" x2="35" y2="-1.95578e-07" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E1DDD2"/>
                  <stop offset="1" stop-color="#EDE8DC"/>
                </linearGradient>
              </defs>
            </svg>
            <h3>{{$t('m.imKeyManager.beginner_guide')}}</h3>
            <span>
                         <p>{{$t('m.imKeyManager.learn_use_imKey')}}</p>
                    </span>
          </a>
        </div>
      </a>
      <a class="link5" @click="openUrl('buy')">
        <div class="box">
          <a>
            <svg width="39" height="37" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 36.5625C11.7693 36.5625 13.4063 34.9255 13.4063 32.9063C13.4063 30.887 11.7693 29.25 9.75 29.25C7.73071 29.25 6.09375 30.887 6.09375 32.9063C6.09375 34.9255 7.73071 36.5625 9.75 36.5625Z" fill="url(#paint0_linear)"/>
              <path d="M32.9063 36.5625C34.9255 36.5625 36.5625 34.9255 36.5625 32.9063C36.5625 30.887 34.9255 29.25 32.9063 29.25C30.887 29.25 29.25 30.887 29.25 32.9063C29.25 34.9255 30.887 36.5625 32.9063 36.5625Z" fill="url(#paint1_linear)"/>
              <path d="M34.125 26.8125H8.53126C7.92798 26.8125 7.41488 26.3713 7.32591 25.7742L3.82566 2.4375H0V0H4.87501C5.47829 0 5.99138 0.441188 6.08035 1.03838L6.83841 6.09376H37.7813C38.1469 6.09376 38.4918 6.25707 38.7234 6.53982C38.9549 6.82135 39.0476 7.19307 38.9757 7.55138L35.3194 25.8327C35.2061 26.403 34.7064 26.8125 34.125 26.8125Z" fill="url(#paint2_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="6.09375" y1="34.7866" x2="13.4063" y2="29.25" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E1DDD2"/>
                  <stop offset="1" stop-color="#EDE8DC"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="29.25" y1="34.7866" x2="36.5625" y2="29.25" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E1DDD2"/>
                  <stop offset="1" stop-color="#EDE8DC"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="3.07499e-07" y1="20.3009" x2="27.7277" y2="-10.2352" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E1DDD2"/>
                  <stop offset="1" stop-color="#EDE8DC"/>
                </linearGradient>
              </defs>
            </svg>
            <h3>{{$t('m.imKeyManager.buy')}}</h3>
            <span>
                         <p>{{$t('m.imKeyManager.visit_Youzan_Mall_to_buy')}}</p>
                    </span>
          </a>
        </div>
      </a>
      <a>
        <div class="box">
          <a>
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1" fill="white">
                <path d="M0 29.1667V17.5C6.91606e-08 12.8587 1.84374 8.40752 5.12563 5.12563C8.40752 1.84374 12.8587 0 17.5 0C22.1413 0 26.5925 1.84374 29.8744 5.12563C33.1563 8.40752 35 12.8587 35 17.5V29.1667"/>
              </mask>
              <path d="M0 17.5H-3H0ZM17.5 0V3V0ZM35 17.5H38H35ZM3 29.1667V17.5H-3V29.1667H3ZM3 17.5C3 13.6544 4.52767 9.96623 7.24695 7.24695L3.00431 3.00431C-0.840185 6.84881 -3 12.0631 -3 17.5H3ZM7.24695 7.24695C9.96623 4.52767 13.6544 3 17.5 3V-3C12.0631 -3 6.84881 -0.840185 3.00431 3.00431L7.24695 7.24695ZM17.5 3C21.3456 3 25.0338 4.52767 27.753 7.24695L31.9957 3.00431C28.1512 -0.840184 22.9369 -3 17.5 -3V3ZM27.753 7.24695C30.4723 9.96623 32 13.6544 32 17.5H38C38 12.0631 35.8402 6.84881 31.9957 3.00431L27.753 7.24695ZM32 17.5V29.1667H38V17.5H32Z" fill="#E6E2D7" mask="url(#path-1-inside-1)"/>
              <path d="M35 31.1109C35 32.1423 34.5903 33.1314 33.861 33.8608C33.1317 34.5901 32.1425 34.9998 31.1111 34.9998H29.1667C28.1353 34.9998 27.1461 34.5901 26.4168 33.8608C25.6875 33.1314 25.2778 32.1423 25.2778 31.1109V25.2776C25.2778 24.2462 25.6875 23.257 26.4168 22.5277C27.1461 21.7984 28.1353 21.3887 29.1667 21.3887H35V31.1109ZM0 31.1109C0 32.1423 0.409721 33.1314 1.13903 33.8608C1.86834 34.5901 2.85749 34.9998 3.88889 34.9998H5.83333C6.86473 34.9998 7.85389 34.5901 8.58319 33.8608C9.3125 33.1314 9.72222 32.1423 9.72222 31.1109V25.2776C9.72222 24.2462 9.3125 23.257 8.58319 22.5277C7.85389 21.7984 6.86473 21.3887 5.83333 21.3887H0V31.1109Z" fill="url(#paint0_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="2.75964e-07" y1="31.6942" x2="11.4943" y2="9.31552" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E1DDD2"/>
                  <stop offset="1" stop-color="#EDE8DC"/>
                </linearGradient>
              </defs>
            </svg>
            <h3>{{$t('m.imKeyManager.user_support')}}</h3>
            <span>
                         <p>{{$t('m.imKeyManager.email')}}</p>
                         <p>{{$t('m.imKeyManager.wechat')}}</p>
                    </span>
          </a>
        </div>
      </a>
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
    <div class="alert" v-if="supportCode==4">
      <div class="alertBox alert4">
        <p class="codeBox">{{bindCode}}</p>
        <h5>{{$t('m.imKeyManager.bin_code')}}</h5>
        <p>{{$t('m.imKeyManager.bind_code_8_bit_world_uppercase')}}</p>
        <p>{{$t('m.imKeyManager.bind_code_used_check_device_please_save')}}</p>
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

    <div class="alert" v-if="supportCode==6">
      <div class="alertBox alert2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h5>{{$t('m.imKeyManager.notice')}}</h5>
        <p>{{$t('m.imKeyManager.imKey_pro_ble_update_prompt_message')}}</p>
        <button @click="updateFirmware">{{$t('m.imKeyManager.ok')}}</button>
      </div>
    </div>

    <div class="tip6" v-else-if="status==6">
      <p>{{$t('m.imKeyManager.found_imKey_manager_new_version')}}</p>
      <button @click="updateNowTip">{{$t('m.imKeyManager.update')}}</button>
    </div>
  </div>
  <div class="statusBox status2" v-else-if="status==2">
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52.68 42.72C53.52 40.65 54 38.385 54 36C54 26.055 45.945 18 36 18C33.615 18 31.35 18.48 29.265 19.32L34.14 24.195C34.755 24.09 35.37 24 36 24C42.63 24 48 29.37 48 36C48 36.645 47.94 37.275 47.835 37.875L52.68 42.72ZM36 12C49.26 12 60 22.74 60 36C60 40.065 58.95 43.86 57.165 47.205L61.575 51.615C64.365 47.07 66 41.73 66 36C66 19.425 52.56 6 36 6C30.27 6 24.93 7.635 20.385 10.425L24.765 14.805C28.11 13.02 31.935 12 36 12ZM9.81 7.5L6 11.325L12.315 17.64C8.37 22.71 6 29.07 6 36C6 47.085 12.03 56.745 20.985 61.935L23.985 56.745C16.83 52.605 12 44.865 12 36C12 30.735 13.71 25.875 16.59 21.915L20.895 26.22C19.065 29.04 18 32.385 18 36C18 42.66 21.615 48.45 26.985 51.57L30.015 46.35C26.43 44.265 24 40.44 24 36C24 34.065 24.51 32.265 25.32 30.645L30.06 35.385L30 36C30 39.315 32.685 42 36 42L36.615 41.94L36.645 41.97L59.175 64.5L63 60.675L12.81 10.5L9.81 7.5Z" fill="#111111"/>
    </svg>
    <p>{{$t('m.imKeyManager.access_error_please_check_your_network_connection')}}</p>
  </div>
  <div class="statusBox status3" v-else-if="status==3">
    <svg width="61" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.457 12.7291C4.30497 14.4024 3.2742 16.1355 2.48597 17.988C0.9095 21.6932 0 25.6972 0 29.9402C0 34.6016 1.0914 39.0239 3.03167 42.9681L11.7629 37.9482C10.6715 35.498 10.0651 32.749 10.0651 29.9402C10.0651 27.5498 10.4896 25.2191 11.2778 23.0677C12.0054 21.1554 12.9755 19.3626 14.2488 17.749C17.4018 13.6255 22.1312 10.757 27.5882 9.98008V0C18.4325 0.836653 10.4896 5.67729 5.457 12.7291ZM58.5112 17.8685C57.7229 16.0757 56.7528 14.4024 55.6614 12.7888C50.6288 5.73705 42.6252 0.896414 33.4696 0V9.98008C38.9266 10.757 43.7166 13.6853 46.8696 17.8088C48.0216 19.3626 48.9917 21.0359 49.6587 22.8884C50.5076 25.0996 50.932 27.4303 50.932 29.8805C50.932 32.6892 50.3257 35.3785 49.2949 37.7689L58.0261 42.7888C59.9057 38.8446 60.9972 34.4821 60.9972 29.8805C61.0578 25.6375 60.1483 21.5737 58.5112 17.8685ZM33.4696 49.9004C32.4995 50.0199 31.5293 50.1394 30.5592 50.1394C29.5891 50.1394 28.6189 50.0797 27.6488 49.9004C22.5556 49.1833 18.0687 46.6135 14.9158 42.9084L6.06333 47.9283C11.0959 54.5618 18.7963 59.0438 27.5882 59.8805C28.5583 59.9402 29.5284 60 30.4986 60C31.4687 60 32.4388 59.9402 33.409 59.8805C42.1402 59.0438 49.8406 54.5618 54.8732 48.0478L46.0813 42.9681C42.9284 46.6135 38.5022 49.1833 33.4696 49.9004Z" fill="#111111"/>
    </svg>
    <p>{{$t('m.imKeyManager.loading_please_wait')}}</p>
  </div>
  <div class="statusBox status4" v-else-if="status==4">
    <div class="status4Alert">
      <div class="status4AlertBox">
        <h4>{{$t('m.imKeyManager.found_new_soft_version')}}</h4>
        <p>{{$t('m.imKeyManager.new_version_is')}}V{{softNewVersionData}}{{$t('m.imKeyManager.current_version_is')}}V{{softOldVersionData}}</p>
        <p>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
          </svg>
          你可以在「管理」中看到设备内存并进行管理
        </p>
        <p>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
          </svg>
          新增暗黑模式
        </p>
        <p>
          <button class="later" @click="later">{{$t('m.imKeyManager.update_later')}}</button>
          <button class="updateNow" @click="updateNow">{{$t('m.imKeyManager.update_now')}}</button>
        </p>
      </div>
    </div>
  </div>
  <div class="statusBox status5" v-else-if="status==5">
    <div class="status5Alert">
      <div class="status5AlertBox">
        <h4>{{$t('m.imKeyManager.found_new_soft_version')}}</h4>
        <p>{{$t('m.imKeyManager.new_version_is')}}V{{softNewVersionData}}{{$t('m.imKeyManager.current_version_is')}}V{{softOldVersionData}}</p>
        <p>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
          </svg>
          你可以在「管理」中看到设备内存并进行管理
        </p>
        <p>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
          </svg>
          新增暗黑模式
        </p>
        <p>
          <el-progress color="#000" :percentage="progress" ></el-progress>
          <a href="javascript:;" @click="later">{{$t('m.imKeyManager.cancel')}}</a>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
import { ipcRenderer } from 'electron'
import constants from '../../common/constants'
const copy = require('copy-to-clipboard')
const packagejson = require('../../../package.json')
const isOnline = require('is-online')
export default {
  name: 'setting',
  data () {
    return {
      supportCode: 0, // 0不显示  1升级中  2升级完成  3升级失败  4绑定码
      status: 3, // 1正常状态  2访问错误 3加载中 4发现新版本 5加载新标准 6稍后左下角显示新版本
      progress: 0, // 更新进度
      name: this.$t('m.setting.info'),
      SN: '',
      bindCode: '',
      isLatest: false,
      updateType: '',
      description: '',
      isCosUpdate: false,
      centerDialogVisible: false,
      cosOldVersionData: '',
      cosNewVersionData: '',
      bleOldVersionData: '',
      bleNewVersionData: '',
      showError: false,
      errorInfo: {},
      softUpdateInfo: '',
      softOldVersionData: packagejson.version,
      softNewVersionData: '',
      copyTooltipDisabled: false
    }
  },
  destroyed () {
    // 移除事件监听
    ipcRenderer.removeAllListeners('updateMessage')
    ipcRenderer.removeAllListeners('downloadProgress')
    // ipcRenderer.removeAllListeners('isUpdateNow')
  },
  mounted () {
    // 检测网络
    isOnline({
      timeout: 5000
      // version: "v4" // v4 or v6
    }).then(online => {
      if (online) {
        this.$ipcRenderer.send('connectDevice')
        this.$ipcRenderer.on('connectDevice', (connectResult) => {
          if (connectResult.isSuccess) {
            this.$ipcRenderer.send('exportBindCode')
            this.$ipcRenderer.on('exportBindCode', (result) => {
              const response = result.result
              if (result.isSuccess) {
                this.bindCode = response
                this.bleVersion()
              }
            })
          } else {
          // 获取SN失败
          // this.changeCode(5)
            this.status = 2
          }
        })
      } else {
        this.status = 2
      }
    })
  },
  methods: {
    copyText () {
      const res = copy(this.SN)
      if (res) {
        this.copyTooltipDisabled = true
        setTimeout(() => {
          this.copyTooltipDisabled = false
        }, 1000)
      }
    },
    changeCode (code) {
      this.supportCode = code
    },
    later () {
      // 稍后更新
      this.status = 6
    },
    // updateNow(){
    //     //立刻更新
    //     this.status=5
    // },
    compareByFirmwareVersion () {
      // 如果cos版本不一致，提示用户更新
      if ((this.cosNewVersionData === null || this.cosNewVersionData === '') &&
            (this.bleNewVersionData === null || this.bleNewVersionData === '')) {
        this.isCosUpdate = false
      } else {
        if ((this.cosOldVersionData === this.cosNewVersionData) &&
                (this.bleOldVersionData === this.bleNewVersionData)) {
          this.isCosUpdate = false
        } else {
          // 升级按钮变黑
          this.isCosUpdate = true
          this.$store.state.isCosUpdate = true
          this.$store.state.cosNewVersionData = this.cosNewVersionData
          if (this.$store.state.installedBleVersion === '') {
            this.$store.state.bleNewVersionData = this.bleNewVersionData
          } else {
            this.$store.state.bleNewVersionData = this.$store.state.installedBleVersion
          }

          // 检查完成
          this.status = 1
          // 提示更新信息
          // this.openErrorView(this.description)
        }
      }
    },
    exportBindCode () {
      this.$ipcRenderer.send('exportBindCode')
      this.$ipcRenderer.on('exportBindCode', (result) => {
        const response = result.result
        if (result.isSuccess) {
          this.bindCode = response
          // 显示绑定码
          this.changeCode(4)
        }
      })
    },
    getSn () {
      this.$ipcRenderer.send('getSn')
      this.$ipcRenderer.on('getSn', (getSnResult) => {
        const getSnResponse = getSnResult.result
        if (getSnResult.isSuccess) {
          this.SN = getSnResponse
          this.firmwareVersion()
        } else {
          // 获取SN失败
          // this.changeCode(5)
          this.status = 2
        }
      })
    },
    firmwareVersion () {
      this.$ipcRenderer.send('getFirmwareVersion')
      this.$ipcRenderer.on('getFirmwareVersion', (getFirmwareVersionResult) => {
        const getFirmwareVersionResponse = getFirmwareVersionResult.result
        if (getFirmwareVersionResult.isSuccess) {
          this.cosOldVersionData = getFirmwareVersionResponse
          this.$store.state.cosOldVersionData = getFirmwareVersionResponse
          this.toCosCheckUpdate()

          // 检查完成
          this.status = 1
        } else {
          // 获取固件版本失败
          this.changeCode(5)
        }
      })
    },
    bleVersion () {
      this.$ipcRenderer.send('getBleVersion')
      this.$ipcRenderer.on('getBleVersion', (getBleVersionResult) => {
        const getBleVersionResponse = getBleVersionResult.result
        if (getBleVersionResult.isSuccess) {
          if (this.$store.state.installedBleVersion === '') {
            this.bleOldVersionData = getBleVersionResponse
            this.$store.state.bleOldVersionData = getBleVersionResponse
          } else {
            this.bleOldVersionData = this.$store.state.installedBleVersion
            this.$store.state.bleOldVersionData = this.$store.state.installedBleVersion
          }
          this.getSn()
        } else {
          // 获取BLE固件版本失败
          this.changeCode(5)
        }
      })
    },
    toCosCheckUpdate () {
      this.$ipcRenderer.send('cosCheckUpdate')
      this.$ipcRenderer.on('cosCheckUpdate', (result) => {
        const response = result.result
        if (result.isSuccess) {
          this.cosNewVersionData = response.latestCosVersion
          this.bleNewVersionData = response.latestBleVersion
          this.isLatest = response.isLatest
          this.updateType = response.updateType
          this.description = response.description
          // 对比COS版本，提示用户是否升级
          this.compareByFirmwareVersion()
        } else {
          // 检查COS更新失败
          this.changeCode(5)
        }
      })
    },
    cosUpdateWalletAddress () {
      // 发送应用查询请求
      this.$ipcRenderer.send('getInstalledApplets')
      this.$ipcRenderer.on('getInstalledApplets', (installedAppletsResult) => {
        const installedAppletsResponse = installedAppletsResult.result
        if (installedAppletsResult.isSuccess) {
          const appList = installedAppletsResponse.list
          const nameList = []
          for (let i = 0; i < appList.length; i++) {
            nameList.push(appList[i].name)
          }
          // 写wallet地址
          this.$ipcRenderer.send('writeWalletAddress', { name: nameList, filePath: this.$store.state.userPath })
          this.$ipcRenderer.on('writeWalletAddress', (result) => {
            if (result.isSuccess) {
              // wallet地址写入成功，开始再次检查
              this.isCosUpdate = false
              this.cosOldVersionData = this.cosNewVersionData
              this.$store.state.isCosUpdate = false
              this.$store.state.cosOldVersionData = this.cosNewVersionData
              this.$store.state.cosNewVersionData = this.cosNewVersionData
              this.bleOldVersionData = this.bleNewVersionData
              this.$store.state.bleOldVersionData = this.bleNewVersionData
              this.$store.state.bleNewVersionData = this.bleNewVersionData
              this.changeCode(2)
              this.$sa.track('im_setting_firmware$upgrade', { status: 1 })
            } else {
              this.$sa.track('im_setting_firmware$upgrade', { status: 0, message: '固件升级写wallet地址失败：' + result.result })
            }
          })
        } else {
          this.$sa.track('im_setting_firmware$upgrade', { status: 0, message: '固件升级写wallet地址前获取应用失败失败：' + installedAppletsResponse })
        }
      })
    },
    isShowalert () {
      if (this.bleOldVersionData !== this.bleNewVersionData) {
        this.changeCode(6)
        this.$sa.track('im_setting_firmware$upgrade', { status: 3 })
      } else {
        this.updateFirmware()
      }
    },
    updateFirmware () {
      this.changeCode(1)
      this.$ipcRenderer.send('connectDevice')
      this.$ipcRenderer.on('connectDevice', (connectResult) => {
        if (connectResult.isSuccess) {
          this.$ipcRenderer.send('cosUpdate')
          this.$ipcRenderer.on('cosUpdate', (result) => {
            const response = result.result
            if (result.isSuccess) {
              if ((response === constants.RESULT_STATUS_SUCCESS)) {
                // 如果升级cos，需要进行重新绑定和wallet address写入
                if (this.cosOldVersionData !== this.cosNewVersionData) {
                  // 升级完成之后，需要重新绑定设备
                  this.$ipcRenderer.send('deviceBindAcquire', this.bindCode)
                  this.$ipcRenderer.on('deviceBindAcquire', (deviceBindResult) => {
                    // const deviceBindResult = ipcRenderer.sendSync('deviceBindAcquire', bindCode)
                    const response = deviceBindResult.result
                    if (deviceBindResult.isSuccess) {
                      if (response === constants.RESULT_STATUS_SUCCESS) {
                        // 绑定成功后存储绑定码
                        this.$ipcRenderer.send('importBindCode', this.bindCode)
                        this.$ipcRenderer.on('importBindCode', (importBindResult) => {
                          const importBindResponse = importBindResult.result
                          if (importBindResult.isSuccess) {
                            this.cosUpdateWalletAddress()
                          } else {
                            this.errorInfo = importBindResponse
                            this.changeCode(3)
                            this.$sa.track('im_landing_connect$error', { name: 'landingConnectError', message: '绑定码存储失败：' + importBindResponse })
                          }
                        })
                      } else {
                        this.changeCode(3)
                        this.$sa.track('im_landing_connect$error', { name: 'landingConnectError', message: '绑定码验证失败：' + response })
                      }
                    } else {
                      this.changeCode(3)
                      this.$sa.track('im_landing_connect$error', { name: 'landingConnectError', message: '绑定码验证失败：' + response })
                    }
                  })
                }
                if (this.bleOldVersionData !== this.bleNewVersionData) {
                  this.isCosUpdate = false
                  this.bleOldVersionData = this.bleNewVersionData
                  this.$store.state.isCosUpdate = false
                  this.$store.state.installedBleVersion = this.bleNewVersionData
                  this.changeCode(2)
                  this.$sa.track('im_setting_firmware$upgrade', { status: 1 })
                }
              } else {
                this.isCosUpdate = true
                this.changeCode(3)
                this.$sa.track('im_setting_firmware$upgrade', { status: 0, message: '固件升级失败：' + response })
              }
            } else {
              this.isCosUpdate = true
              this.changeCode(3)
              this.$sa.track('im_setting_firmware$upgrade', { status: 0, message: '固件升级失败：' + response })
            }
          })
        } else {
          this.isCosUpdate = true
          this.changeCode(3)
          this.$sa.track('im_setting_firmware$upgrade', { status: 0, message: '固件升级失败：' + connectResult.result })
        }
      })
    },

    downloadAndUpdate () {
      this.status = 5
      // 开始下载
      ipcRenderer.send('downloadUpdate')
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
        this.progress = progressObj.percent.toFixed(0) || 0
        if (progressObj.percent === 100) {
          // 下载完成， 立刻退出并更新
          ipcRenderer.send('isUpdateNow')
        }
      })
    },
    updateNowTip () {
      this.status = 4
      this.progress = 0
    },
    updateNow () {
      // 更新显示进度
      // this.status = 5
      // setTimeout(() => {
      //   this.progress = 20
      // }, 1000)
      // setTimeout(() => {
      //   this.progress = 40
      // }, 2000)
      // setTimeout(() => {
      //   this.progress = 60
      // }, 3000)
      // setTimeout(() => {
      //   this.progress = 80
      // }, 4000)
      // setTimeout(() => {
      //   this.progress = 100
      //   this.status = 6
      // }, 5000)
      // 下载并更新
      this.downloadAndUpdate()
    },
    checkSoftUpdate () {
      // 开始检查
      ipcRenderer.send('checkForUpdate')
      // 添加自动更新事件的监听
      ipcRenderer.on('updateMessage', (event, obj) => {
        // 显示更新
        if (obj.action === 'updateAva') {
          // 显示更新
          this.status = 6
          this.softNewVersionData = obj.updateInfo.version
          this.softUpdateInfo = obj.updateInfo.releaseNotes
        } else if (obj.action === 'error') {
          this.errorInfo = obj.errorInfo
        } else if (obj.action === 'updateNotAva') {
          this.status = 1
        } else {
        }
      })
    },
    openUrl (urlType) {
      let url
      if (urlType === 'support') {
        url = 'https://support.imkey.im/'
      }
      if (urlType === 'buy') {
        url = 'https://imkey.im/'
      }
      if (urlType === 'getStarted') {
        url = 'https://imkey.im/get-started'
      }
      ipcRenderer.send('openUrl', url)
    }
  }
}
</script>

<style>
.exportBindCode:hover,
hover {
  cursor: pointer;
}
.el-icon-copy-document:hover,
hover {
  cursor: pointer;
}
.link5:hover,
hover {
  cursor: pointer;
}
.container{
  padding-left: 38px;
}
.container h2{
  margin-top: 57px;
  font-weight: 600;
  font-size: 24px;
  color: #000000;
}
.container .msg{
  margin-top: 6px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #8189A7;
}
.container h3{
  margin-top: 50px;
  font-weight: 600;
  font-size: 15px;
  color: #0E1019;
}
.equipmentBox{
  margin-top: 20px;
  width: 800px;
  height: 158px;
  border: 1.5px solid #F1F2FA;
  box-sizing: border-box;
  padding: 28px 40px;
}
.equipmentBox .session1{
  display: flex;
  justify-content: space-between;
}
.left p:nth-child(1){
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 21px;
  color: #0E1019;
}
.left p:nth-child(2){
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #8189A7;
}
.left p:nth-child(3){
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #8189A7;
}
.rightNoUpdate p{
  font-size: 15px;
  color: #2E3035;
}
.rightNoUpdate p button{
  width: 62px;
  height: 32px;
  background: #E0E0E0;
  border-radius: 28px;
  font-size: 13px;
  line-height: 18px;
  color: #fff;
  margin-left: 17px;
}
.rightUpdate p{
  font-size: 15px;
  color: #2E3035;
}
.rightUpdate p button{
  width: 62px;
  height: 32px;
  background: #2E3035;
  border-radius: 28px;
  font-size: 13px;
  line-height: 18px;
  color: #fff;
  margin-left: 17px;
}
.session2{
  margin-top: 33px;
}
.session2 p{
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #2E3035;
  margin-right: 66px;
  float: left;
}
.session2 p span{
  color: #B8AC95;
}
.moreBox {
  margin-top: 20px;
  width: 801px;
  height: 142px;
  display: flex;
  justify-content: space-between;
}
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
  top: 23.5%;
  bottom: 42.78%;
  width: 420px;
  height: 240px;
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
  margin-bottom: 30px;
  margin-top: 11px;
  margin-left: 2%;
  margin-right: 2%;
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
  margin-left: 2%;
  margin-right: 2%;
}
.alert2 svg,.alert3 svg{
  margin-top: 34px;
}
.alert2 h5,.alert3 h5,.alert4 h5{
  font-weight: 500;
  font-size: 15px;
  color: #2C2842;
  margin-top: 12px;
}
.alert2 p,.alert3 p,.alert4 p{
  font-weight: 300;
  font-size: 13px;
  color: #2C2842;
  margin-top: 6px;
  margin-left: 2%;
  margin-right: 2%;
}
.alert2 button,.alert3 button,.alert4 button{
  width: 90px;
  height: 36px;
  background: #2E3035;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
  color: #fff;
  margin-top: 30px;
}
.alert4 .codeBox{
  width: 127px;
  height: 36px;
  background: #EBEBEB;
  border-radius: 6px;
  font-weight: 500;
  font-size: 17px;
  text-align: center;
  line-height: 36px;
  margin:36px auto 0;
}

.statusBox{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.statusBox svg{
  margin-bottom: 30px;
}
.statusBox p{
  font-size: 17px;
  color: #0E1019;
}
.status4Alert,.status5Alert{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
}
.status4Alert .status4AlertBox,.status5Alert .status5AlertBox{
  position: absolute;
  left: 50%;
  top: 50%;
  width: 500px;
  height: 288px;
  margin-left:-250px;
  margin-top:-144px;
  background: #FAFBFC;
  border-radius: 12px;
}
.status4AlertBox h4,.status5AlertBox h4{
  font-weight: 500;
  font-size: 18px;
  color: #2C2842;
  margin-top:35px;
  margin-left: 35px;
}
.status4AlertBox p:nth-of-type(1),.status5AlertBox p:nth-of-type(1){
  font-weight: 300;
  font-size: 13px;
  line-height: 30px;
  color: #2C2842;
  margin-top: 6px;
  margin-left: 35px;
  margin-bottom: 20px;
}
.status4AlertBox p:nth-of-type(2), .status4AlertBox p:nth-of-type(3),.status5AlertBox p:nth-of-type(2), .status5AlertBox p:nth-of-type(3){
  font-weight: 300;
  font-size: 13px;
  color: #2C2842;
  padding-left: 35px;
  line-height: 30px;
}
.status4AlertBox p,.status5AlertBox p{
  line-height: 30px;
}
.status4Alert .status4AlertBox p svg,.status5Alert .status5AlertBox p svg{
  margin-right: 13px;
  vertical-align: middle;
  margin-bottom: 0;
}
.status4AlertBox p:nth-of-type(4),status5AlertBox p:nth-of-type(4){
  margin-top: 54px;
}
.later{
  margin-left: 250px;
  width: 100px;
  height: 36px;
  border: 0.5px solid #000000;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
}
.updateNow{
  margin-left: 15px;
  background: #2E3035;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
  width: 100px;
  height: 36px;
  color: #fff;
}
.el-progress{
  width:355px;
  height: 10px;
  margin-left: 32px;
  margin-top: 60px;
  float: left;
}
.el-progress__text{
  display: none !important;
}
.status5AlertBox a{
  float: left;
  margin-top: 53px;
  font-weight: 500;
  font-size: 14px;
  color: #2C2842;
  text-decoration: none;
  margin-left: 10px;
}
.tip6{
  width: 240px;
  height: 100px;
  background: linear-gradient(70.66deg, #1F2421 4.22%, #A4A4A4 96.58%);
  border-radius: 12px;
  position: fixed;
  bottom: 23px;
  left: 30px;
  text-align: center;

}
.tip6 button{
  border: 0.5px solid #E8E8E8;
  border-radius: 27px;
  color: #FFFFFF;
  margin-top: 16px;
  width: 62px;
  height: 32px;
  background: transparent;
}
.tip6 p{
  text-align: center;
  margin-top: 20px;
  font-weight: 600;
  font-size: 13px;
  color: #DED0B6;
}
.moreBox .box{
  width: 239px;
  height: 142px;

  background: #FAFAFA;
  border-radius: 4px;
}
.moreBox .box p{
  font-weight: 300;
  font-size: 13px;
  margin-left: 23px;
  width: 200px;
  height: 25px;
  color: #2E3035
}
.moreBox .box h3{
  margin-top: -23px;
  margin-left: 23px;
}
.moreBox .box span{
  margin-top: 1px;
  margin-left: 23px;
}
.moreBox .box svg{
  margin-top: 13px;
  margin-left: 192px;
}

</style>
