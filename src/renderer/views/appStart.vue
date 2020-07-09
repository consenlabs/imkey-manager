<template>
    <div class="appStart">
        <h1>
            <svg width="26" height="45" viewBox="0 0 26 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.5015 32.2491C25.5015 39.612 19.1385 45.4297 11.5938 44.6115C6.04883 43.9752 1.50381 39.612 0.685706 34.0671C-0.132398 28.3404 2.77642 23.6135 7.13964 21.341C7.41234 21.2501 7.68504 21.341 7.77594 21.6137C8.32135 22.9772 9.23035 23.9771 10.1394 25.0679C10.3212 25.2497 10.2303 25.6134 9.95755 25.7952C7.50324 26.9769 5.86703 29.4312 5.86703 32.34C5.86703 36.6123 9.59395 40.0665 13.9572 39.5211C17.2296 39.1575 19.8657 36.5214 20.2293 33.3399C20.6838 29.8857 18.684 26.886 15.8661 25.7043C15.7752 25.6134 14.5935 25.0679 13.7754 24.6134C10.8666 22.9772 8.95765 19.7957 8.95765 16.4324V0.615719C8.95765 0.524819 8.95765 0.524819 9.04855 0.433918C9.04855 0.433918 9.13945 0.343018 9.23035 0.343018H14.5026C14.6844 0.343018 14.8662 0.524819 14.8662 0.70662V6.34245V16.2506C14.8662 18.0686 15.8661 19.7048 17.5023 20.5229L18.5022 21.0683L18.7749 21.2501C22.6836 23.159 25.5015 27.3405 25.5015 32.2491Z"
                      fill="white"/>
                <path d="M21.6839 0.70654V8.61488C21.6839 8.79668 21.593 8.88758 21.4112 8.88758H17.1389C16.9571 8.88758 16.8662 8.79668 16.8662 8.61488V0.70654C16.8662 0.524739 16.9571 0.433838 17.1389 0.433838H21.4112C21.5021 0.433838 21.6839 0.524739 21.6839 0.70654Z"
                      fill="white"/>
            </svg>

        </h1>
        <h2>imKey Manager</h2>
        <p>你的imKey Pro桌面管理工具</p>
        <p>
            <button @click="next()">立刻使用</button>
        </p>
        <p><i></i><span @click="openUrl">还未拥有imKey Pro?</span></p>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'

export default {
  name: 'appStart',
  data () {
    return {
      connectText: this.$t('m.appStart.use_now')
    }
  },
  mounted () {
    // 禁止主页面滑动
    this.noScroll()
  },
  methods: {
    // next() {
    //     ipcRenderer.send('importBindCode', 'T52MKBA3')
    //     ipcRenderer.on('importBindCodeResult', (event, result) => {
    //         event.sender.removeAllListeners('importBindCodeResult')
    //         if (result.isSuccess) {
    //             ipcRenderer.send('exportBindCode')
    //             ipcRenderer.on('exportBindCodeResult', (event, result) => {
    //                 event.sender.removeAllListeners('exportBindCodeResult')
    //                 const response = result.result
    //                 if (result.isSuccess) {
    //                     console.log('bindCode:' + response)
    //                 }
    //             })
    //         }
    //     })
    //     //
    //     // //跳转到下一个连接界面
    //     // const response = deviceManager.importBindCode("T52MKBA3")
    //     // if (response.isSuccess) {
    //     //     const response = deviceManager.exportBindCode()
    //     //     if (response.isSuccess) {
    //     //         console.log("bindCode:"+response.result)
    //     //     }
    //     // }
    // },
    next () {
      this.router.replace('/connectDevice')
    },
    openUrl () {
        ipcRenderer.send('openUrl', 'https://imkey.im/')
    }

  }
}
</script>
<style scoped>
    .appStart{
        height: 100%;
        text-align: center;
    }
    .appStart h1{
        width: 74px;
        height: 74px;
        background: #000;
        border-radius: 50%;
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
