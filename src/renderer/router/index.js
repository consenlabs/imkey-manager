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
        path: '/connectDevice',
        name: 'connectDevice',
        component: require('@/views/connectDevice').default
    },
    {
        path: '/deviceStep',
        name: 'deviceStep',
        component: require('@/views/steps/step').default
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
            },
            {
                path: "/manager/connect",
                name: "manager",
                meta: {
                    activePath: "/manager/connect"
                },
                component: require('@/views/manager/connect').default
            },
            {
                path: "/manager/manager",
                name: "manager",
                meta: {
                    activePath: "/manager/manager"
                },
                component: require('@/views/manager/manager').default
            },
            {
                path: "/setting",
                name: "setting",
                component: require('@/views/setting/setting').default
            },
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router
