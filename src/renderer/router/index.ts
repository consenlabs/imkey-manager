import { createRouter, createWebHashHistory } from 'vue-router'
import AppStart from '../views/appStart.vue'
import ConnectDevice from '../views/connectDevice.vue'
import ImKeySetting from '../views/imKeySetting.vue'
import Home from '../views/home.vue'
import WelcomeHome from '../views/welcomeHome.vue'
import Manager from '../views/manager.vue'
import Setting from '../views/setting.vue'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: '/', component: AppStart },
    { path: '/appStart', name: 'appStart', component: AppStart },
    { path: '/connectDevice', name: 'connectDevice', component: ConnectDevice },
    { path: '/imKeySetting', name: 'imKeySetting', component: ImKeySetting },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: 'welcomeHome', name: 'welcomeHome', component: WelcomeHome },
        { path: 'manager', name: 'manager', component: Manager },
        { path: 'setting', name: 'setting', component: Setting }
      ]
    }
  ]
})
