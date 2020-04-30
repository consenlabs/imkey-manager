import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.router = router;
Vue.use(ElementUI)

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


// this.canScroll()
//主页面可滑动

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
