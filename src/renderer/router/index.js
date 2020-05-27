import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '/',
        component: require('@/views/connectDevice').default
    },
    {
        path: '/menu',
        name: 'menu',
        component: require('@/views/menu').default
    },
    {
        path: '/connectDevice',
        name: 'connectDevice',
        component: require('@/views/connectDevice').default
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
        component: require('@/views/index').default,
        children: [
            {
                path: "/home",
                name: "home",
                component: require('@/views/home').default
                // component: () => import('../views/home.vue')
            },
            {
                path: "/manager/connect",
                name: "manager",
                meta: {
                    activePath: "/manager/connect"
                },
                component: require('@/views/manager/connect').default
                // component: () => import('../views/manager/connect.vue')
            },
            {
                path: "/manager/manager",
                name: "manager",
                meta: {
                    activePath: "/manager/manager"
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
