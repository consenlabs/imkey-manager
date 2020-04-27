import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    component: require('@/views/Menu').default
  },
  {
    path: '/menu',
    name: 'Menu',
    component: require('@/views/Menu').default
  },
  {
    path: '/loading',
    name: 'loading',
    component: require('@/views/loading').default
  },
  {
    path: '/deviceStep',
    name: 'deviceStep',
    component: require('@/views/steps/step').default
    // component: () => import('../views/steps/step.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: require('@/views/Index').default,
    children: [
      {
        path: "/home",
        name: "home",
        component: require('@/views/Home').default
        // component: () => import('../views/Home.vue')
      },
      {
        path: "/manager/connect",
        name: "manager",
        meta:{
          activePath:"/manager/connect"
        },
        component: require('@/views/manager/connect').default
        // component: () => import('../views/manager/connect.vue')
      },
      {
        path: "/manager/device",
        name: "manager",
        meta:{
          activePath:"/manager/connect"
        },
        component: require('@/views/manager/manager').default
        // component: () => import('../views/manager/manager.vue')
      },
      {
        path: "/setting",
        name: "setting",
        component: require('@/views/setting/setting').default
        // component: () => import('../views/setting/setting.vue')
      },
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
