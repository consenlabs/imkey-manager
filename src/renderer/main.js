import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n';

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.router = router;
Vue.use(ElementUI)
Vue.use(VueI18n);
//弹出框禁止滑动
Vue.prototype.noScroll = function () {
    var mo = function (e) { e.preventDefault() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', mo, false)// 禁止页面滑动
}

//弹出框可以滑动
Vue.prototype.canScroll = function () {
    var mo = function (e) {
        e.preventDefault()
    }
    document.body.style.overflow = ''// 出现滚动条
    document.removeEventListener('touchmove', mo, false)
}
//VueI18n
const i18n = new VueI18n({
    // 默认中文
    locale: 'zh-CN',
    // locale: 'en-US',
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
        // 语言包路径
        'zh-CN': require('./common/lang/zh'),
        'en-US': require('./common/lang/en')
    }
})
// this.canScroll()
//主页面可滑动

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
