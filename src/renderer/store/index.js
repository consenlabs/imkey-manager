import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    agree: true,
    message: '',
    activeStatus: '',
    apps: [],
    isCosUpdate: false,
    cosOldVersionData: '',
    cosNewVersionData: '',
    buttonTexts: '',
    userPath: '',
    isFirstGoToManagerPage:true
  },
  mutations: {},
  actions: {},
  modules: {}
})
