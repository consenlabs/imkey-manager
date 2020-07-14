import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    component: require('@/views/appStart').default
  },
  {
    path: '/appStart',
    name: 'appStart',
    component: require('@/views/appStart').default
  },
  {
    path: '/connectDevice',
    name: 'connectDevice',
    component: require('@/views/connectDevice').default
  },
  {
    path: '/imKeySetting',
    name: 'imKeySetting',
    component: require('@/views/imKeySetting').default
  },
  {
    path: '/home',
    name: 'home',
    component: require('@/views/home').default,
    children: [
      {
        path: 'welcomeHome',
        name: 'welcomeHome',
        component: require('@/views/welcomeHome').default
      },
      {
        path: 'manager',
        name: 'manager',
        component: require('@/views/manager').default
      },
      {
        path: 'setting',
        name: 'setting',
        component: require('@/views/setting').default
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

export default router
