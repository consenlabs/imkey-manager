import Vue from 'vue'
import sa from 'sa-sdk-javascript'
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
// 神策埋点
Vue.prototype.$sa = sa
sa.init({
  server_url: 'https://imtoken.datasink.sensorsdata.cn/sa?project=production&token=27d69b3e7fd25949', // 替换成自己的神策地址
  heatmap: {
    // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    clickmap: 'not_collect',
    show_log: true, // 打印console，自己配置，可以看到自己是否踩点成功，以及
    // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    scroll_notice_map: 'not_collect'
  }
})
sa.login('imkey-manager')
// sa.track("im_app$start",{name:"appStart",DataType:"NUMBER",data:0})
let callbackCache
Vue.prototype.$ipcRenderer = {
  send: (msgType, msgData) => {
    ipcRenderer.send('message-from-renderer', {
      type: msgType,
      data: msgData
    })
  },
  on: (type, callback) => {
    callbackCache = {
      type,
      callback
    }
  }
}
ipcRenderer.on('message-to-renderer', (sender, msg) => {
  if (callbackCache.type === msg.type) {
    callbackCache.callback(msg.data)
  }
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
// vue 项目在路由切换的时候调用
router.beforeEach(function (to, from, next) {
  next()
  let eventName = ''
  let toName = ''
  if (from.name === 'welcomeHome') {
    if (to.name === 'manager') {
      eventName = 'im_homepage$manage'
      toName = '指向im_manage'
    }
    if (to.name === 'setting') {
      eventName = 'im_homepage$setting'
      toName = '指向im_setting'
    }
  }
  if (from.name === 'manager') {
    if (to.name === 'welcomeHome') {
      eventName = 'im_manage$homepage'
      toName = '指向im_homepage'
    }
    if (to.name === 'setting') {
      eventName = 'im_manage$setting'
      toName = '指向im_setting'
    }
  }
  if (from.name === 'setting') {
    if (to.name === 'welcomeHome') {
      eventName = 'im_setting$homepage'
      toName = '指向im_homepage'
    }
    if (to.name === 'manager') {
      eventName = 'im_setting$manage'
      toName = '指向im_manage'
    }
  }
  if (eventName !== '' && toName !== '') {
    sa.track(eventName, { to: toName }) // after the next(); statement
  }
})
