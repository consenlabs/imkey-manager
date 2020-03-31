import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: require('@/views/Login/Login').default
        },
        {
            path: '/',
            name: 'home',
            redirect: '/home',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'home',
                component: require('@/views/Home/Home').default
            }]
        },
        {
            path: '/Device',
            name: 'Device',
            redirect: '/Device/Device',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'Device',
                component: require('@/views/Device/Device').default
            }]
        },
        {
            path: '/App',
            name: 'App',
            redirect: '/App/App',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'App',
                component: require('@/views/App/App').default
            }]
        },
        {
            path: '/settings',
            name: 'settings',
            redirect: '/settings/settings',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'settings',
                component: require('@/views/Settings/Settings').default
            }]
        },
        {
            path: '/notes',
            name: 'notes',
            redirect: '/notes/notes',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'notes',
                component: require('@/views/Notes/Notes').default
            }]
        },
        {
            path: '/help',
            name: 'help',
            redirect: '/help/help',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'help',
                component: require('@/views/Help/Help').default
            }]
        },
        {
            path: '/password',
            name: 'password',
            redirect: '/password/password',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'password',
                component: require('@/views/Password/Password').default
            }]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
