<template>
    <div class="appStart">
        <h1>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="14.4964" fill="#181818"/>
                <g clip-path="url(#clip0)">
                    <path d="M40.6383 42.6631C40.6383 47.7117 36.5632 51.8095 31.5372 51.8095C26.5112 51.8095 22.4361 47.7117 22.4361 42.6631C22.4361 40.5803 23.1153 38.6786 24.2699 37.1618C24.2699 37.1618 24.2699 37.1617 24.2699 37.1391C24.3379 37.0486 24.4058 36.958 24.4737 36.8901C24.8812 36.4373 25.4245 35.7581 25.4698 35.7807C25.5151 35.8034 26.6244 36.4146 27.0546 36.6863C27.7111 37.1165 29.0921 38.0673 29.0921 38.09C28.3903 38.9503 28.1639 39.3804 27.8696 39.7426C27.5979 40.1049 27.3715 40.4897 27.1904 40.9199C27.0093 41.418 26.8961 41.9387 26.8735 42.5047C26.8056 44.9497 28.6394 47.1005 31.0618 47.3269C33.8464 47.5985 36.1783 45.4025 36.1783 42.6631C36.1783 41.0557 35.3633 39.6295 34.1407 38.7918H34.1181L33.5748 38.4748L30.7448 36.7995L30.7222 36.7769L27.0999 34.6488L25.6509 33.7885C25.583 33.7432 25.5377 33.7206 25.4698 33.6753C25.2661 33.5621 25.0623 33.4262 24.8812 33.2904C21.8928 31.1849 19.9458 27.7211 19.9458 23.7818C19.9458 17.3749 25.1076 12.1904 31.4919 12.1904C37.8763 12.1904 43.038 17.3749 43.038 23.7818C43.038 27.4721 41.3174 30.7548 38.646 32.8829C38.0121 33.381 37.1291 33.4715 36.4047 33.0414L32.7824 30.9585C32.4881 30.8001 32.3296 30.4831 32.3296 30.1435V25.7741C32.3296 25.6835 32.3975 25.6156 32.4881 25.6156H34.2087V20.9519H32.4881C32.3975 20.9519 32.3296 20.884 32.3296 20.7934V18.4842C32.3296 18.3484 32.2164 18.2125 32.0579 18.2125C31.4466 18.2125 30.043 18.2125 29.4544 18.2125C29.3185 18.2125 29.1827 18.3257 29.1827 18.4842V30.0303C29.1827 30.5058 29.4317 30.9359 29.8392 31.1623L32.3069 32.5886L35.7255 34.5809C35.7708 34.6035 35.8161 34.6261 35.884 34.6714L36.0425 34.762C36.133 34.8072 36.2009 34.8525 36.2915 34.8978C38.9177 36.4826 40.6383 39.3578 40.6383 42.6631Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="23.0922" height="39.619" fill="white" transform="translate(19.9458 12.1904)"/>
                    </clipPath>
                </defs>
            </svg>

        </h1>
        <h2>{{$t('m.imKeyManager.imKey_manager')}}</h2>
        <p>{{$t('m.imKeyManager.your_imKey_manager')}}</p>
        <p>
            <button @click="next()">{{$t('m.imKeyManager.use_now')}}</button>
        </p>
        <p><i></i><span class="link0" @click="openUrl">{{$t('m.imKeyManager.no_have_imKey_pro')}}</span></p>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'appStart',
  data () {
    return {
      connectText: this.$t('m.imKeyManager.use_now')
    }
  },
  mounted () {
    this.$sa.track('im_app$start', { name: 'appStart' })
    // 禁止主页面滑动
    this.noScroll()
  },
  methods: {
    next () {

        // this.$router.push('/home/welcomeHome')
      this.router.replace('/connectDevice')
    },
    openUrl () {
      // this.$sa.track('im_app$buyimkey', { name: 'buyimkey' })
      ipcRenderer.send('openUrl', 'https://imkey.im/')
    }

  }
}
</script>
<style scoped>
    .link0:hover,
    hover {
        cursor: pointer;
    }
    .appStart{
        height: 100%;
        text-align: center;
    }
    .appStart h1{
        /*width: 74px;*/
        /*height: 74px;*/
        /*background: #000;*/
        /*border-radius: 50%;*/
        text-align: center;
        margin: 10% auto 0;
    }
    .appStart h1 svg{
        margin-top: 14px;
    }
    .appStart h2{
        font-family: SF Pro Text;
        font-weight: 600;
        font-size: 41.9294px;
        margin-bottom: 0;
        margin-top: 2%;
    }
    .appStart p{
        margin-top: 1%;
        font-weight: 200;
        font-size: 17.745px;
        line-height: 25px;
    }
    .appStart button{
        width: 400px;
        height: 44px;
        background: #2E3035;
        border-radius: 44px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
        margin-top: 5%;
    }
    .appStart p span{
        font-size: 13px;
        line-height: 18px;
        color: #A8A8A8;
    }
</style>
