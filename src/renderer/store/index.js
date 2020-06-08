import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        agree: true,
        message: "",
        activeStatus:"",
        apps: [],
        updateSuccess: false,
        oldVersionData: "",
    },
    mutations: {},
    actions: {},
    modules: {}
})
