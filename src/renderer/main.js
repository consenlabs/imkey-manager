import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
const { remote, ipcRenderer } = require('electron') // Renderer process modules
const { screen } = remote // Main process modules
const devInnerHeight = 1080.0 // 开发时的InnerHeight
const devDevicePixelRatio = 1.0// 开发时的devicepixelratio
const devScaleFactor = 1.3 // 开发时的ScaleFactor
const scaleFactor = screen.getPrimaryDisplay().scaleFactor
const zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)
ipcRenderer.send('zoomIn', zoomFactor)
let callbackCache
Vue.prototype.$ipcRenderer = {
  send: (msgType, msgData) => {
    ipcRenderer.send('message-from-renderer', {
      type: msgType,
      data: msgData
    })
  },
  on: (type, callback) => {
    callbackCache={
      type,
      callback
    }
  }
}
ipcRenderer.on('message-to-renderer', (sender, msg) => {
  callbackCache.callback(msg.data)
}) // 监听主进程的消息
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.router = router
Vue.use(ElementUI)
Vue.use(VueI18n)
// 弹出框禁止滑动
Vue.prototype.noScroll = function () {
  var mo = function (e) {
    e.preventDefault()
  }
  document.body.style.overflow = 'hidden'
  // 禁止页面滑动
  document.addEventListener('touchmove', mo, false)
}

// 弹出框可以滑动
Vue.prototype.canScroll = function () {
  var mo = function (e) {
    e.preventDefault()
  }
  // 出现滚动条
  document.body.style.overflow = ''
  document.removeEventListener('touchmove', mo, false)
}
// 获取系统语言，根据系统语言来切换语言
const app = require('electron').remote.app
let sysLocale = app.getLocale()
if (sysLocale !== 'zh-CN') {
  sysLocale = 'en-US'
}

// VueI18n
const i18n = new VueI18n({
  // 默认中文
  // locale: 'zh-CN',
  // locale: 'en-US',
  // this.$i18n.locale // 通过切换locale的值来实现语言切换
  // 获取系统语言，根据系统语言来切换语言
  locale: sysLocale,
  messages: {
    // 语言包路径
    'zh-CN': require('./common/lang/zh'),
    'en-US': require('./common/lang/en')
  }
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
