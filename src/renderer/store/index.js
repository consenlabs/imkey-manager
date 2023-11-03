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
    bleOldVersionData: '',
    bleNewVersionData: '',
    buttonTexts: '',
    userPath: '',
    isFirstGoToManagerPage: true,
    WalletAddress: [],
    isDisplayPromptMsg: true
  },
  mutations: {},
  actions: {},
  modules: {},
  accounts: ['0xa6c82cf246f820f70d3c11b1b518b2d0eaca3258']
})
