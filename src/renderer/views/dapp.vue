<template>
    <div class="container">
        <h2>{{$t('m.imKeyManager.welcome_used_imkKey_manager')}}</h2>
        <p class="msg">{{$t('m.imKeyManager.imKey_manager_is_desktop_manager')}}</p>
        <div class="msgList">
            <p>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                </svg>
                <span>{{$t('m.imKeyManager.imKey_wallet_version_manager')}}</span>
            </p>
            <p>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                </svg>
                <span>{{$t('m.imKeyManager.imKey_APP_version_manager')}}</span>
            </p>
            <p>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="3" r="2.5" stroke="#8189A7"/>
                </svg>
                <span>{{$t('m.imKeyManager.fast_connect_desktop_APP')}}</span>
            </p>
        </div>
        <h4>{{$t('m.imKeyManager.used_this_desktop_APP')}}</h4>
        <div class="appBox">
                <a class="link6" @click="openUrl('TokenLon')">

                    <div class="cbox">
                        <svg width="100" height="21" viewBox="0 0 100 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.3035 12.9684C14.8632 12.1456 15.1119 11.1962 15.1119 10.1835C15.1119 7.33544 12.7488 4.99367 9.82587 4.99367C8.58209 4.99367 7.33831 5.43671 6.40547 6.25949L6.34328 6.32279C6.34328 6.32279 6.34328 6.32279 6.28109 6.32279C6.28109 6.32279 6.28109 6.32279 6.2189 6.38608C6.15672 6.38608 6.15672 6.44937 6.09453 6.44937C6.03234 6.51266 5.97015 6.57595 5.97015 6.57595C5.41045 7.20886 5.03731 7.96836 4.78856 8.79114C4.78856 8.79114 4.78856 8.79114 4.78856 8.85443C4.35323 10.2468 4.35323 11.9557 5.22388 13.8544C6.65423 17.019 10.199 18.6646 14.1169 18.6013C14.5522 18.6013 14.7388 19.1709 14.3657 19.4241C12.9975 20.1835 11.4428 20.5633 9.82587 20.5633C4.41542 20.5 0 16.0696 0 10.5C0 5.37342 3.85572 1.06962 8.76866 0.563291C9.14179 0.5 9.51493 0.5 9.82587 0.5C11.8781 0.5 13.9303 1.1962 15.6095 2.39873C16.0448 2.71519 16.4801 3.09494 16.8532 3.47468C17.7861 4.48734 18.2836 5.87975 18.2836 7.33544C18.2836 9.93038 16.6045 12.1456 14.3035 12.9684Z" fill="url(#paint0_linear)"/>
                            <path d="M19.5273 10.4367C19.5273 10.5 19.5273 10.5 19.5273 10.4367C19.5273 13.7278 17.3507 16.5126 14.3656 17.1456C13.9925 17.2088 13.6815 17.2721 13.3084 17.2721C9.70141 17.5886 6.96509 15.8797 5.72131 13.0316C5.59693 12.7152 5.47255 12.3354 5.34817 11.8924C5.28598 11.5759 5.22379 11.2595 5.1616 10.943C5.09942 10.2468 5.1616 9.55062 5.28598 8.85442V8.79112C5.34817 8.60125 5.41036 8.41138 5.53474 8.2215C5.84568 7.71518 6.65414 7.84176 6.77852 8.47467C6.9029 9.10758 7.08947 9.86707 7.33822 10.3101C8.33325 12.0823 10.1989 13.2848 12.3755 13.2848C13.0596 13.2848 13.6815 13.1582 14.3656 12.905C16.6044 12.0823 18.2213 9.86707 18.2213 7.27214C18.2213 5.87973 17.7238 4.48733 16.8531 3.41138C18.3457 4.99366 19.2163 7.01897 19.4651 9.23416C19.5273 9.6772 19.5273 10.0569 19.5273 10.4367Z" fill="url(#paint1_linear)"/>
                            <path d="M77.1768 7.84177H78.3583V13.7278H81.5922V14.8038H77.1768V7.84177Z" fill="#270F34"/>
                            <path d="M47.3882 7.77849H48.632V10.6266L51.0573 7.77849H52.4255L50.3733 10.2468L52.6121 14.6772H51.3683L49.627 11.1962L48.632 12.462V14.6772H47.3882V7.77849Z" fill="#270F34"/>
                            <path d="M99.9998 14.7405H99.1291C98.8804 14.7405 98.6316 14.6139 98.5072 14.3608L96.0197 9.99366V10.943V12.7152V14.7405H94.7759V7.84177H95.7087C95.8953 7.84177 96.0818 7.96835 96.2062 8.09493L98.8182 12.5886V7.84177H100.062L99.9998 14.7405Z" fill="#270F34"/>
                            <path d="M72.2014 14.7405H71.3308C71.082 14.7405 70.8333 14.6139 70.7089 14.3608L68.2213 9.99366V10.943V12.7152V14.7405H66.9775V7.84177H67.9104C68.0969 7.84177 68.2835 7.96835 68.4079 8.09493L71.0198 12.5886V7.84177H72.2636L72.2014 14.7405Z" fill="#270F34"/>
                            <path d="M30.6593 8.79115H28.5449V7.77849H34.0176V8.79115H31.9031V14.6772H30.6593V8.79115Z" fill="#270F34"/>
                            <path d="M61.7536 13.7278V14.7405H57.4004V7.84177H58.582H61.5671V8.85442H58.582V10.5633H61.2561V11.6392H58.582V13.7278H61.7536Z" fill="#270F34"/>
                            <path d="M42.9724 9.67719C42.848 9.23415 42.6615 8.8544 42.4127 8.53794C42.164 8.22149 41.9152 8.03162 41.5421 7.84174C40.858 7.52529 40.0495 7.52529 39.3655 7.84174C39.0545 8.03162 38.7436 8.22149 38.4948 8.53794C38.246 8.8544 38.0595 9.23415 37.9351 9.67719C37.8107 10.1202 37.7485 10.6266 37.7485 11.1962C37.7485 11.7658 37.8107 12.2721 37.9351 12.7152C38.0595 13.1582 38.246 13.5379 38.4948 13.8544C39.3033 14.9303 40.7958 15.1835 41.853 14.3607C42.0396 14.2341 42.2262 14.0443 42.3505 13.8544C42.5993 13.5379 42.7859 13.0949 42.9102 12.7152C43.0346 12.2721 43.0968 11.7658 43.0968 11.1962C43.0968 10.6266 43.0968 10.1202 42.9724 9.67719ZM40.4849 13.7911C39.552 13.7911 39.0545 12.6519 39.0545 11.1962C39.0545 9.74048 39.6142 8.60124 40.4849 8.60124C41.4177 8.60124 41.9152 9.74048 41.9152 11.1962C41.9152 12.6519 41.4177 13.7911 40.4849 13.7911Z" fill="#270F34"/>
                            <path d="M90.2361 9.67719C90.1117 9.23415 89.9251 8.8544 89.6764 8.53794C89.4276 8.22149 89.1789 8.03162 88.8057 7.84174C88.1217 7.52529 87.3132 7.52529 86.6291 7.84174C86.3182 8.03162 86.0072 8.22149 85.7585 8.53794C85.5097 8.8544 85.3232 9.23415 85.1988 9.67719C85.0744 10.1202 85.0122 10.6266 85.0122 11.1962C85.0122 11.7658 85.0744 12.2721 85.1988 12.7152C85.3232 13.1582 85.5097 13.5379 85.7585 13.8544C86.5669 14.9303 88.0595 15.1835 89.1167 14.3607C89.3033 14.2341 89.4898 14.0443 89.6142 13.8544C89.863 13.5379 90.0495 13.0949 90.1739 12.7152C90.2983 12.2721 90.3605 11.7658 90.3605 11.1962C90.3605 10.6266 90.3605 10.1202 90.2361 9.67719ZM87.7485 13.7911C86.8157 13.7911 86.3182 12.6519 86.3182 11.1962C86.3182 9.74048 86.8779 8.60124 87.7485 8.60124C88.6814 8.60124 89.1789 9.74048 89.1789 11.1962C89.1789 12.6519 88.7436 13.7911 87.7485 13.7911Z" fill="#270F34"/>
                            <defs>
                                <linearGradient id="paint0_linear" x1="0" y1="10.5101" x2="18.3063" y2="10.5101" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#2D2D4C"/>
                                    <stop offset="1" stop-color="#1E1E3A"/>
                                </linearGradient>
                                <linearGradient id="paint1_linear" x1="5.17535" y1="10.3945" x2="19.5513" y2="10.3945" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#96A2D4"/>
                                    <stop offset="1" stop-color="#594DA0"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        <p>{{$t('m.imKeyManager.tokenlon_info')}}</p>
                    </div>
                </a>
                <div class="dbox" >
                        <span class="leftLine">——</span>
                        <span class="comingsoon">{{$t('m.imKeyManager.coming_soon')}}</span>
                        <span class="rightLine">——</span>
                </div>
        </div>
        </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'welcomeHome',
  methods: {
    openUrl (urlType) {
      let url
      if (urlType === 'TokenLon') {
        url = 'https://decentraland.org/'
      }
      if (urlType === 'Compound') {
        url = 'https://compound.finance/'
      }
      if (urlType === 'AAVE') {
        url = 'https://aave.com/'
      }
      ipcRenderer.send('openBrowserView', url)
    }
  }
}
</script>

<style scoped>
    .link6:hover,
    hover {
        cursor: pointer;
    }
    .container{
        padding-left: 38px;
        font-family: PingFang SC;
    }
    .container h2{
        height: 34px;
        font-weight: 600;
        font-size: 24px;
        line-height: 34px;
        margin-top: 56px;
    }
    .container .msg{
        width: 801px;
        height: 25px;
        margin-top: 33px;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 21px;
        color: #000000;
    }
    .container .msgList svg{
        margin-right: 13px;
        vertical-align: middle;
    }
    .container .msgList span{
        margin-right: 13px;
        vertical-align: middle;
    }
    .container .msgList{
        margin-top: 25px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 30px;
        color: #8189A7;
    }

    .container .msgList svg{
        margin-right: 13px;
    }
    .container h4{
        margin-top: 68px;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        color: #0E1019;
    }
    .container .appBox{
        margin-top: 20px;
        width: 800px;
        height: 99px;
        display: flex;
    }

    .appBox .cbox{
        width: 240px;
        height: 99px;
        background: #FAFAFA;
        border-radius: 4px;
    }
    .appBox .cbox svg{
        margin-top: 23px;
        margin-left: 20px;
    }
    .appBox .cbox p{
        font-weight: 300;
        font-size: 13px;
        margin-left: 20px;
        width: 200px;
        height: 25px;
        color: #2E3035
    }
    .appBox .dbox{
        display: inline-block;
        margin-left: 40px;
        width: 240px;
        height: 99px;
        background: #FAFAFA;
        border-radius: 4px;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .comingsoon {
        margin-top: 38px;
        margin-left: 10px;
        font-weight: 500;
        font-size: 13px;
        width: 200px;
        height: 25px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .leftLine {
        margin-top: 38px;
        font-size: 10px;
        line-height: 90px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .rightLine {
        margin-top: 38px;
        margin-left: 10px;
        font-size: 10px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
</style>
