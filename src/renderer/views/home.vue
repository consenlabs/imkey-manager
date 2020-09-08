<template>
    <div class="homeBox">
        <div class="routerBar">
            <h1>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8.15422" fill="#181818"/>
                    <g clip-path="url(#clip0)">
                        <path d="M22.8592 23.9981C22.8592 26.8379 20.567 29.1429 17.7399 29.1429C14.9128 29.1429 12.6205 26.8379 12.6205 23.9981C12.6205 22.8265 13.0026 21.7568 13.6521 20.9035C13.6521 20.9035 13.6521 20.9035 13.6521 20.8908C13.6903 20.8399 13.7285 20.7889 13.7667 20.7507C13.9959 20.496 14.3015 20.114 14.327 20.1267C14.3525 20.1395 14.9765 20.4833 15.2184 20.6361C15.5877 20.8781 16.3645 21.4129 16.3645 21.4257C15.9698 21.9096 15.8424 22.1515 15.6769 22.3553C15.5241 22.5591 15.3967 22.7755 15.2948 23.0175C15.193 23.2977 15.1293 23.5906 15.1165 23.9089C15.0783 25.2843 16.1098 26.4941 17.4725 26.6214C19.0388 26.7742 20.3505 25.539 20.3505 23.9981C20.3505 23.0939 19.8921 22.2916 19.2044 21.8204H19.1916L18.886 21.6422L17.2942 20.6998L17.2814 20.6871L15.2439 19.49L14.4289 19.0061C14.3907 18.9806 14.3652 18.9679 14.327 18.9424C14.2124 18.8787 14.0978 18.8023 13.9959 18.7259C12.3149 17.5416 11.2197 15.5932 11.2197 13.3773C11.2197 9.77342 14.1232 6.85718 17.7144 6.85718C21.3056 6.85718 24.2091 9.77342 24.2091 13.3773C24.2091 15.4531 23.2413 17.2996 21.7386 18.4967C21.382 18.7769 20.8854 18.8278 20.4778 18.5858L18.4403 17.4142C18.2747 17.3251 18.1856 17.1468 18.1856 16.9558V14.498C18.1856 14.4471 18.2238 14.4089 18.2747 14.4089H19.2426V11.7855H18.2747C18.2238 11.7855 18.1856 11.7473 18.1856 11.6964V10.3974C18.1856 10.321 18.1219 10.2446 18.0328 10.2446C17.689 10.2446 16.8994 10.2446 16.5683 10.2446C16.4919 10.2446 16.4155 10.3083 16.4155 10.3974V16.8921C16.4155 17.1595 16.5556 17.4015 16.7848 17.5289L18.1729 18.3311L20.0958 19.4518C20.1213 19.4645 20.1467 19.4773 20.185 19.5027L20.2741 19.5537C20.325 19.5791 20.3632 19.6046 20.4142 19.6301C21.8914 20.5215 22.8592 22.1388 22.8592 23.9981Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect width="12.9894" height="22.2857" fill="white" transform="translate(11.2197 6.85718)"/>
                        </clipPath>
                    </defs>
                </svg>

                {{$t('m.imKeyManager.imKey_manager')}}
            </h1>
            <ul>
                <router-link class="link" to="/home/welcomeHome" tag="li">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3602 15.3758L13.3667 15.3685L13.3729 15.361C13.9635 14.6408 14.3219 13.7195 14.3219 12.7076C14.3219 10.2814 12.2384 8.3275 9.76134 8.49502C7.65507 8.63274 5.94694 10.296 5.77566 12.3831C5.68212 13.5203 6.05727 14.5652 6.70913 15.3608L6.70911 15.3608L6.71216 15.3644C6.82402 15.4983 6.88356 15.6665 6.88356 15.8542V19.2708C6.88356 19.393 6.78541 19.5 6.64384 19.5H1.6888C1.02129 19.4886 0.5 18.9586 0.5 18.3255V9.07495C0.5 8.6449 0.675992 8.24252 0.990035 7.96289L0.990121 7.96298L0.998449 7.95522L8.2842 1.16431C8.75366 0.73614 9.35876 0.5 10 0.5C10.3098 0.5 10.6172 0.556658 10.8988 0.667708L11.0822 0.202566L10.8988 0.667708C11.1897 0.782434 11.4492 0.939627 11.6719 1.1482L11.6719 1.14822L11.6757 1.15168L18.9898 7.86249C18.9899 7.86259 18.99 7.86269 18.9901 7.86279C19.3173 8.16472 19.5 8.57371 19.5 8.99392V18.3255C19.5 18.9609 18.9772 19.4865 18.3151 19.4865H13.4384C13.2968 19.4865 13.1986 19.3795 13.1986 19.2573V15.8406C13.1986 15.6499 13.2597 15.4891 13.3602 15.3758Z" stroke="black"/>
                    </svg>
                    {{$t('m.imKeyManager.home')}}
                </router-link>
                <router-link class="link" to="/home/manager" tag="li">
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1742 7.67325H8.17415L8.17425 7.68033C8.18393 8.36426 7.62085 8.93572 6.89094 8.93572H2.06646C1.35191 8.93572 0.783203 8.36412 0.783203 7.6868V2.95523C0.783203 2.26186 1.35445 1.69275 2.06646 1.69275H6.89094C7.60549 1.69275 8.1742 2.26435 8.1742 2.94167V7.67325Z" stroke="black"/>
                        <path d="M14.3879 9.53971L14.3872 9.539L10.9735 6.20456C10.9734 6.20446 10.9733 6.20437 10.9732 6.20427C10.4846 5.72482 10.4791 4.93375 10.9754 4.43561L14.3879 1.08877C14.8822 0.603977 15.7059 0.598592 16.2194 1.09064L19.6319 4.43748C20.1208 4.9169 20.1264 5.70819 19.63 6.20643L16.2175 9.55327C15.7232 10.038 14.901 10.0429 14.3879 9.53971Z" stroke="black"/>
                        <path d="M8.1742 18.0176H8.17415L8.17425 18.0248C8.18384 18.6925 7.62348 19.2665 6.89094 19.2665H2.06646C1.35191 19.2665 0.783203 18.6949 0.783203 18.0176V13.286C0.783203 12.6087 1.35191 12.0371 2.06646 12.0371H6.89094C7.60549 12.0371 8.1742 12.6087 8.1742 13.286V18.0176Z" stroke="black"/>
                        <path d="M18.9979 18.0176H18.9979L18.998 18.0248C19.0076 18.6925 18.4472 19.2665 17.7147 19.2665H12.8902C12.1756 19.2665 11.6069 18.6949 11.6069 18.0176V13.286C11.6069 12.6087 12.1756 12.0371 12.8902 12.0371H17.7147C18.4292 12.0371 18.9979 12.6087 18.9979 13.286V18.0176Z" stroke="black"/>
                    </svg>
                    {{$t('m.imKeyManager.manager')}}
                </router-link>
                <router-link class="link" to="/home/setting" tag="li">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 13.5C12.3807 13.5 13.5 12.3807 13.5 11C13.5 9.61929 12.3807 8.5 11 8.5C9.61929 8.5 8.5 9.61929 8.5 11C8.5 12.3807 9.61929 13.5 11 13.5Z" stroke="black"/>
                        <path d="M3.41 14.14C3.27108 13.782 3.05217 13.4605 2.77 13.2C2.56518 13.0065 2.33261 12.8448 2.08 12.72C1.64586 12.5187 1.19809 12.3483 0.74 12.21L0.5 12.13V9.87L0.75 9.79C1.2067 9.65303 1.6515 9.47912 2.08 9.27C2.6885 8.989 3.16498 8.48386 3.41 7.86C3.68088 7.24615 3.70594 6.55177 3.48 5.92C3.31413 5.46687 3.11699 5.02581 2.89 4.6L2.78 4.37L4.37 2.78L4.6 2.89C5.02379 3.1211 5.46516 3.31838 5.92 3.48C6.55177 3.70594 7.24615 3.68088 7.86 3.41C8.48386 3.16498 8.989 2.6885 9.27 2.08C9.47912 1.6515 9.65303 1.2067 9.79 0.75C9.82119 0.668182 9.84789 0.584725 9.87 0.5H12.13C12.1521 0.581437 12.1789 0.661564 12.21 0.74C12.3454 1.20372 12.5193 1.65529 12.73 2.09C13.0147 2.69351 13.519 3.16562 14.14 3.41C14.7585 3.67825 15.4562 3.69971 16.09 3.47C16.5405 3.30956 16.9784 3.11569 17.4 2.89L17.63 2.78L19.22 4.37L19.11 4.6C18.883 5.02581 18.6859 5.46687 18.52 5.92C18.2941 6.55177 18.3191 7.24615 18.59 7.86C18.8308 8.48318 19.304 8.98864 19.91 9.27C20.3438 9.47478 20.7916 9.64855 21.25 9.79L21.5 9.87V12.13L21.26 12.21C20.7995 12.3453 20.3512 12.5193 19.92 12.73C19.4598 12.957 19.0713 13.307 18.7978 13.7412C18.5242 14.1754 18.3761 14.6768 18.37 15.19C18.371 15.4961 18.4217 15.8001 18.52 16.09C18.6841 16.5406 18.8813 16.9785 19.11 17.4C19.1426 17.4786 19.1793 17.5553 19.22 17.63L17.63 19.22L17.39 19.1C16.9684 18.8743 16.5305 18.6804 16.08 18.52C15.4522 18.2956 14.7627 18.317 14.15 18.58C13.5245 18.8314 13.0172 19.3101 12.73 19.92C12.5209 20.352 12.347 20.8001 12.21 21.26C12.1789 21.3384 12.1521 21.4186 12.13 21.5H9.87C9.84786 21.4186 9.82115 21.3384 9.79 21.26C9.65289 20.7969 9.479 20.3454 9.27 19.91C8.98525 19.3065 8.48095 18.8344 7.86 18.59C7.24145 18.3244 6.546 18.2994 5.91 18.52C5.46112 18.6884 5.02355 18.8854 4.6 19.11L4.37 19.22L2.78 17.63C2.82072 17.5553 2.85743 17.4786 2.89 17.4C3.1137 16.9809 3.30751 16.5464 3.47 16.1C3.71 15.4508 3.68849 14.7337 3.41 14.1M3.41 14.14L2.77 13.2L3.41 14.14Z" stroke="black"/>
                    </svg>
                    {{$t('m.imKeyManager.setting')}}
                </router-link>
            </ul>
        </div>
        <div class="routerView">
            <router-view></router-view>
        </div>
        <div class="statusBox status4" v-if="status==4">
            <div class="status4Alert">
                <div class="status4AlertBox">
                    <h4>{{$t('m.imKeyManager.found_new_soft_version')}}</h4>
                    <p>{{$t('m.imKeyManager.new_version_is')}}V{{softNewVersionData}}{{$t('m.imKeyManager.current_version_is')}}V{{softOldVersionData}}</p>
                    <div class="update-info-scroller">
                    <div v-for="item in softUpdateInfo" :key="item.id" >
                    <p >
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                        </svg>
                       {{item.info}}
                    </p>
                    </div>
                    </div>

                    <div class="view_button" style="display:inline-block;float: left;">
                        <button class="later" @click="later">{{$t('m.imKeyManager.update_later')}}</button>
                        <button class="updateNow" @click="updateNow">{{$t('m.imKeyManager.update_now')}}</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="statusBox status5" v-else-if="status==5">
            <div class="status5Alert">
                <div class="status5AlertBox">
                    <h4>{{$t('m.imKeyManager.found_new_soft_version')}}</h4>
                    <p>{{$t('m.imKeyManager.update_tip_wait')}}</p>
                    <div class="update-info-scroller">
                        <div v-for="item in softUpdateInfo" :key="item.id" >
                            <p >
                                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                                </svg>
                                {{item.info}}
                            </p>
                        </div>
                    </div>

                    <p>
                        <el-progress color="#000" :percentage="progress" ></el-progress>
                        <a href="javascript:;" @click="later">{{$t('m.imKeyManager.cancel')}}</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="tip6" v-else-if="status==6">
            <p>{{$t('m.imKeyManager.found_imKey_manager_new_version')}}</p>
            <button @click="updateNowTip">{{$t('m.imKeyManager.update')}}</button>
        </div>
    </div>

</template>

<script>
import { ipcRenderer } from 'electron'
const packagejson = require('../../../package.json')
export default {
  name: 'home',
  data () {
    return {
      supportCode: 0, // 0不显示  1升级中  2升级完成  3升级失败  4绑定码
      status: 1, // 1正常状态  2访问错误 3加载中 4发现新版本 5加载新标准 6稍后左下角显示新版本
      progress: 0, // 更新进度
      name: this.$t('m.setting.info'),
      showError: false,
      errorInfo: {},
      softUpdateInfo: [],
      // softUpdateInfo: [{id:1,info:"解决卡死问题"},{id:2,info:"优化UI问题"},{id:3,info:"你可以在「管理」中看到设备内存并进行管理"},{id:4,info:"新增暗黑模式"},{id:5,info:"新增暗黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式黑模式"}],
      // softUpdateInfo: [{id:1,info:"解决卡死问题"},{id:2,info:"优化UI问题"}],
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
    //  软件升级检测
    if (process.env.NODE_ENV === 'production') {
      this.checkSoftUpdate()
    }
  },
  methods: {
    getSoftUpdateInfo () {
      return this.softUpdateInfo
    },
    changeCode (code) {
      this.supportCode = code
    },
    later () {
      // 稍后更新
      this.status = 6
      this.progress = 0
    },
    downloadAndUpdate () {
      this.status = 5
      // 开始下载
      ipcRenderer.send('downloadUpdate')
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
          this.$sa.track('im_setting_version$upgrade', { status: 1 })
        this.progress = progressObj.percent.toFixed(0) || 0
          // if (this.progress  === 100) {
        if (progressObj.percent === 100) {
            setTimeout(() => {
                // 下载完成， 立刻退出并更新
                ipcRenderer.send('isUpdateNow')
            }, 5000)
        }
      })
    },
    updateNowTip () {
      this.status = 4
      this.progress = 0
    },
    updateNow () {
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
          const releaseNotes = obj.updateInfo.releaseNotes
          const arr = []
          const json = eval(releaseNotes)
          for (let i = 0; i < json.length; i++) {
            const temp = {
              id: json[i].id,
              info: json[i].info
            }
            arr.push(temp)
          }
          this.softUpdateInfo = arr
        } else if (obj.action === 'error') {
          this.errorInfo = obj.errorInfo
        } else if (obj.action === 'updateNotAva') {
          this.status = 1
        } else {
        }
      })
    }
  }
}
</script>

<style scoped>
    .link:hover,
    hover {
        cursor: pointer;
    }
    .homeBox{
        height: 100%;
        display: flex;
    }
    .homeBox .routerBar{
        width: 300px;
        min-width: 300px;
    }
    .homeBox .routerView{
        flex: 1;
        box-shadow: 3px 0px 20px rgba(0, 0, 0, 0.06);
    }
    .homeBox .routerBar h1{
        font-family: SF Pro Text;
        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
        margin-top: 64px;
    }
    .homeBox .routerBar h1 svg{
        width: 36px;
        height: 36px;
        margin-left: 44px;
        margin-right: 12px;
        vertical-align: middle;
    }
    .homeBox .routerBar ul{
        margin-top: 57px;
        min-width: 12px;
    }
    .homeBox .routerBar ul li{
        height: 48px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        list-style: none;
        line-height: 48px;

    }
    .homeBox .routerBar ul li svg{
        margin-right: 16px;
        vertical-align: middle;
        margin-left: 46px;

    }
    .router-link-exact-active,.router-link-active{
        background: rgba(0, 0, 0, 0.03);
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
        margin-bottom: 5px;
        justify-content: center;
    }
    .status4AlertBox p:nth-of-type(2), .status4AlertBox p:nth-of-type(3),.status5AlertBox p:nth-of-type(2), .status5AlertBox p:nth-of-type(3){
        font-weight: 300;
        font-size: 13px;
        color: #2C2842;
        padding-left: 35px;
        line-height: 30px;
        justify-content: center;
    }
    .status4AlertBox p,.status5AlertBox p{
        line-height: 30px;
        justify-content: center;
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
        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
    }
    .updateNow{
        margin-left: 15px;
        background: #2E3035;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        width: 100px;
        height: 36px;
        color: #fff;
        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
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
    .update-info-scroller {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        height: 70px;
        overflow: scroll;
    }
    .view_button{
        margin-top: 30px;
    }
</style>
