<template>
  <div>
    <!-- <div>   -->
    <div class="tool-bar" v-if="showToolBar">
      <div class="left-tools">
        <svg
          class="tool-dapp tool"
          @click="showDapps"
          style="margin-left: 17px"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#191C1E"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 12H22"
            stroke="#191C1E"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
            stroke="#191C1E"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          class="tool-line1"
          style="margin-left: 17px"
          width="1"
          height="21"
          viewBox="0 0 1 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.5"
            y1="2.18557e-08"
            x2="0.499999"
            y2="21"
            stroke="#EAECF6"
          />
        </svg>

        <svg
          class="tool-previous tool"
          style="margin-left: 26px"
          @click="goBack"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 20L6 12L14 4"
            stroke="#191C1E"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          class="tool-next tool"
          style="margin-left: 18px"
          @click="goForward"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 20L16 12L8 4"
            stroke="#191C1E"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          class="tool-line2"
          style="margin-left: 26px"
          width="1"
          height="21"
          viewBox="0 0 1 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.5"
            y1="2.18557e-08"
            x2="0.499999"
            y2="21"
            stroke="#EAECF6"
          />
        </svg>

        <div id="container2" class="container2" tabIndex="-1">
          <svg
            class="tool-more tool menu-button"
            style="margin-left: 15px"
            width="17"
            height="3"
            viewBox="0 0 17 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5ZM10 1.5C10 2.32843 9.32843 3 8.5 3C7.67157 3 7 2.32843 7 1.5C7 0.671573 7.67157 0 8.5 0C9.32843 0 10 0.671573 10 1.5ZM15.5 3C16.3284 3 17 2.32843 17 1.5C17 0.671573 16.3284 0 15.5 0C14.6716 0 14 0.671573 14 1.5C14 2.32843 14.6716 3 15.5 3Z"
              fill="#43454F"
            />
          </svg>

          <div class="menu-list">
            <div class="menu" @click="refresh">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 6V10H19"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.2384 15.3312C19.5233 17.3755 18.1695 19.1297 16.3812 20.3295C14.5929 21.5293 12.467 22.1096 10.3237 21.9829C8.18044 21.8563 6.13597 21.0296 4.4984 19.6275C2.86084 18.2253 1.71888 16.3236 1.24462 14.209C0.770363 12.0944 0.989494 9.88138 1.86899 7.90347C2.74849 5.92556 4.24071 4.28991 6.12079 3.243C8.00087 2.19608 10.1669 1.79462 12.2926 2.09912C14.4183 2.40361 16.3883 3.39755 17.906 4.93118L23 9.77562"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p style="padding-left: 19px">Refresh</p>
            </div>

            <div class="menu" @click="copyLink">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p style="padding-left: 19px">Copy Link</p>
            </div>

            <div class="menu" @click="openInSafari">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.24 7.75977L14.12 14.1198L7.76001 16.2398L9.88001 9.87977L16.24 7.75977Z"
                  stroke="#191C1E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p style="padding-left: 19px">Open in Safari</p>
            </div>
          </div>
        </div>

        <svg
          class="tool-line3"
          style="margin-left: 15px; display: none"
          width="1"
          height="21"
          viewBox="0 0 1 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.5"
            y1="2.18557e-08"
            x2="0.499999"
            y2="21"
            stroke="#EAECF6"
          />
        </svg>
      </div>
      <div class="searchBox">
        <el-autocomplete
            :popper-append-to-body="false"
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="true"
            placeholder="请输入DApp网址"
            @keyup.enter.native="serchOpenUrl(DAppUrl)"
            @select="handleSelect"
            @input="changeStyle('block', '.el-autocomplete-suggestion')"
            @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
        >
        </el-autocomplete>

      <el-select v-model="value" placeholder="请选择" @click.native="selectCloseBrowserView" @change="selectChangeChainType">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      </div>
    </div>
    <div style="background: #eaecf6; height: 1px"></div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="ETH" name="ETH"></el-tab-pane>
      <el-tab-pane label="BSC" name="BSC"></el-tab-pane>
      <el-tab-pane label="HECO" name="HECO"></el-tab-pane>
      <el-tab-pane label="Polkadot" name="Polkadot"></el-tab-pane>
    </el-tabs>
    <div v-loading="isLoading" element-loading-background="white" class="container">
<!--    d0d9dd  <h2>{{ $t("m.dapp.newest_launched") }}</h2>-->
      <el-scrollbar style="height:650px;" :wrapStyle="[{'overflow-x':'hidden'}]">
      <div v-for="item in getDApps(activeName)" :key="item.id" class="appBox">
            <a class="dapp" @click="openUrl(item.urlType,item.url,item.title,item.iconUrl)">
              <img :src="item.iconUrl"  />
              <div class="dapp-info">
                <p class="dapp-name">{{item.title}}</p>
                <p class="dapp-desc">{{ $t(item.desc)}}</p>
              </div>
            </a>
      </div>
      </el-scrollbar>
      <div class="tip1 tip" v-if="status==1">
        <div class="tipBox">
          <h3>{{$t('m.imKeyManager.found_dapp_access')}}</h3>
          <p>{{$t('m.imKeyManager.installing_dot_ksm_coin')}}</p>
          <button @click="changeState(0)">{{$t('m.imKeyManager.ok')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { DAPPS_ETH, DAPPS_BSC, DAPPS_HECO, DAPPS_Polkadot, DAPPS_Config } from '../store/dapps'
import { urls } from '../store/url'
const { dialog } = require('electron').remote
let url

export default {
  name: 'welcomeHome',
  data () {
    return {
      status: 0, // 0显示 1不显示
      name: this.$t('m.setting.info'),
      viewInfo: '正在访问你的地址请确认,注意财产安全',
      showToolBar: true,
      iconUrl: '',
      title: '',
      showRightTools: true,
      isLoading: false,
      activeName: 'ETH',
      options: [{
        value: 'ETH',
        label: 'ETH'
      }, {
        value: 'BSC',
        label: 'BSC'
      }, {
        value: 'HECO',
        label: 'HECO'
      }, {
        value: 'Polkadot',
        label: 'Polkadot'
      }],
      value: 'ETH',
      DAppUrl: '',
      DAppUrls: [],
      state: '',
      timeout: null
    }
  },
  mounted: function () {
    this.DAppUrls = this.loadAll()
    this.getDApps('ETH')
    ipcRenderer.on('loading-status', (event, isLoading) => {
      this.isLoading = isLoading
    })
  },
  methods: {
    // 根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle (status, className) {
      const dom = document.querySelectorAll(className)
      dom[0].style.display = status
    },
    loadAll () {
      const urlArr = []
      for (let i = 0; i < urls.result.length; i++) {
        for (let y = 0; y < urls.result[i].dapps.length; y++) {
          urlArr.push({ value: urls.result[i].dapps[y].url })
        }
      }
      return urlArr
    },
    querySearchAsync (queryString, cb) {
      ipcRenderer.send('openBrowserView', 'url', true)
      this.DAppUrl = queryString
      const DAppUrls = this.DAppUrls
      const results = queryString ? DAppUrls.filter(this.createStateFilter(queryString)) : DAppUrls

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().search(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.DAppUrl = item.value
    },
    selectChangeChainType (value) {
      this.DAppUrl=this.state
      this.getDApps(value)
      this.serchOpenUrl(this.DAppUrl)
    },
    selectCloseBrowserView(){
      ipcRenderer.send('openBrowserView', 'url', true)
    },
    handleClick (tab) {
      this.state=''
      this.changeChain(tab.label)
      this.getDApps(tab.label)
    },
    changeChain (label) {
      if (label === 'ETH') {
        this.value = label
      }
      if (label === 'HECO') {
        this.value = label
      }
      if (label === 'BSC') {
        this.value = label
      }
      if (label === 'Polkadot') {
        this.value = label
      }
    },
    getDApps (label) {
      let res
      if (label === 'ETH') {
        res = ipcRenderer.sendSync('message-from-set-address', DAPPS_Config.ETH)
        return DAPPS_ETH
      }
      if (label === 'BSC') {
        res = ipcRenderer.sendSync('message-from-set-address', DAPPS_Config.BSC)
        return DAPPS_BSC
      }
      if (label === 'HECO') {
        res = ipcRenderer.sendSync('message-from-set-address', DAPPS_Config.HECO)
        return DAPPS_HECO
      }
      if (label === 'Polkadot') {
        res = ipcRenderer.sendSync('message-from-set-address', DAPPS_Config.Polkadot)
        return DAPPS_Polkadot
      }
    },
    changeState (index) {
      this.status = index
    },
    ShowMessageDialog () {
      dialog
        .showMessageBox({
          type: 'info',
          title: '访问说明',
          message: '你正在访问第三方DAPP',
          buttons: ['OK', 'Cancel']
        })
        .then((result) => {
          console.log('您的选择:', result.response)
          console.log(result)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    init () {

    },
    cancel () {
      this.status = 1
    },
    confirm () {
      this.status = 1
    },
    openUrl (urlType, url, title, iconUrl) {
      this.state=url
      if (urlType === 'PolkadotJS') {
        // 判断是否有dot地址没有提示下载应用
        let addressKSM
        let addressDOT
        const walletAddressArray = this.$store.state.WalletAddress
        if (walletAddressArray.length === 0) {
          // 提示安装DOT和KSM应用
          this.changeState(1)
          return
        }
        console.log(walletAddressArray)
        for (let i = 0; i < walletAddressArray.length; i++) {
          if (walletAddressArray[i].chain === 'Polkadot') {
            addressDOT = walletAddressArray[i].address
          }
          if (walletAddressArray[i].chain === 'Kusama') {
            addressKSM = walletAddressArray[i].address
          }
        }
        console.log('addressDOT:')
        console.log(addressDOT)
        console.log('addressKSM:')
        console.log(addressKSM)
        if (addressKSM === '' || addressDOT === '' ||
            typeof addressKSM === 'undefined' || typeof addressDOT === 'undefined' ||
           addressKSM == null || addressDOT == null) {
          // 提示安装DOT和KSM应用
          this.changeState(1)
          return
        } else {
          url = 'https://polkadot.js.org/apps/#/accounts'
          this.title = 'PolkadotJS'
          this.iconUrl = 'https://polkadot.js.org/favicon.ico'
        }
        this.isLoading = true
        ipcRenderer.send('openBrowserView', url, false)
        this.showToolBar = true
        this.showRightTools = true
        return
      }
      this.isLoading = true
      // const dapp = DAPPS.find(x => x.urlType.toLowerCase() === urlType.toLowerCase())
      this.title = title
      this.iconUrl = iconUrl
      ipcRenderer.send('openBrowserView', url, false)
      this.showToolBar = true
      this.showRightTools = true
    },
    serchOpenUrl (url) {
      this.changeStyle('none', '.el-autocomplete-suggestion')

      if (url !== '') {
        if(url.indexOf('https://') === -1){
          url = "https://"+url
          this.state=url
        }
        this.isLoading = true
        ipcRenderer.send('openBrowserView', url, false)
        this.showToolBar = true
        this.showRightTools = true
      }
    },
    closeDapp () {
      ipcRenderer.send('openBrowserView', 'close', true)
      this.showRightTools = false
    },
    showDapps () {
      ipcRenderer.send('openBrowserView', 'close', true)
      this.showToolBar = true
    },
    goForward () {
      ipcRenderer.send('goForward')
    },
    goBack () {
      ipcRenderer.send('goBack')
    },
    refresh () {
      ipcRenderer.send('refresh')
      document.getElementById('container2').blur()
    },
    copyLink () {
      ipcRenderer.send('copyLink', url)
      document.getElementById('container2').blur()
    },
    openInSafari () {
      ipcRenderer.send('openInSafari', url)
      document.getElementById('container2').blur()
    }
  }
}
</script>

<style scoped>
/deep/ .el-autocomplete-suggestion{
  width: 490px!important;
}
/deep/ .el-autocomplete{
  width: 490px!important;
}
.tip {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
}
.tipBox {
  background: #FAFBFC;
  border-radius: 12px;
  width: 400px;
  height: 217px;
  position: absolute;
  top: 45%;
  left: 50%;
  margin-left: -240px;
  margin-top: -140px;
  text-align: center;
  padding: 0 44px;
}
.tipBox {
  background: #FAFBFC;
  border-radius: 12px;
  width: 400px;
  height: 217px;
  position: absolute;
  top: 45%;
  left: 50%;
  margin-left: -240px;
  margin-top: -140px;
  text-align: center;
  padding: 0 44px;
}

.tipBox h3 {
  margin-top: 40px;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 30px;
  color: #2C2842;
}

.tipBox p {
  margin-top: 14px;
  font-style: normal;
  font-weight: 300;
  font-size: 13px;
  line-height: 20px;
  color: #2C2842;
  margin-left: 2%;
  margin-right: 2%;
}

.tipBox button {
  background: #2E3035;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
  width: 90px;
  height: 36px;
  color: #fff;
  margin-top: 30px;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
}
.tool-bar {
  display: flex;
  background: #f7f7f7;
  height: 61px;
  width: calc(100vw - 300px);
  justify-content: space-between;
  /* visibility: hidden; */
}
.tool-bar .left-tools {
  display: flex;
  width: calc(100vw - 500px);
  align-items: center;
}
.container2 {
  position: relative;
  /* width: 120px;
  margin: 100px auto; */
  display: none;
}
.container2:focus {
  outline: none;
}
.menu-list {
  width: 282px;
  display: none;
  background: #f4f5f6;
  position: absolute;
  left: 0;
  right: 0;
  line-height: 2;
  text-align: center;
  padding: 10px 0;
  border-radius: 26.5px;
  box-shadow: 0px 2px 20px rgba(46, 48, 53, 0.15);
}
.container2:focus .menu-list {
  display: block;
}
.menu-button {
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.menu {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 29px;
}
.menu:hover {
  background: #eee;
  cursor: pointer;
  user-selct: none;
  /* padding: 0 4px; */
}
.tool-bar .right-tools {
  display: flex;
  align-items: center;
  width: 200px;
  background-image: url("data:image/svg+xml;utf8,<svg width='197' height='62' viewBox='0 0 197 62' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 12C0 5.37258 5.37258 0 12 0H185C191.627 0 197 5.37258 197 12V62H0V12Z' fill='white'/></svg>");
}
.right-tools p {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
  margin-left: 15px;

  /* Secondary text */
  color: #43454f;
}
.searchBox {
  display: flex;
  align-items: center;
  width: calc(100vw - 10px);
  /*margin-right:300px;*/
  /*margin-top: 15px;*/
}
.searchBox i {
  position: absolute;
  left: 16px;
  top: 9px;
}
.searchBox input {
  border: none;
  width: 400px;
  height: 40px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  /*border-radius: 147px;*/
  padding-left: 38px;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #c8cad0;
}
.selectBox{
  display: flex;
  align-items: center;
}
.buttondiv button {
  width: 100px;
  height: 40px;
  background: #2E3035;
  border-radius: 44px;
  color: #fff;
  margin-top: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
/*.el-select{*/
/*  border-radius: 147px;*/
/*  font-family: PingFang SC;*/
/*  color: #C8CAD0;*/
/*}*/
.container {
  padding-left: 38px;
  font-family: PingFang SC;
  bottom: 0;
}
.container h2 {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 21px;
  display: flex;
  align-items: center;

  color: #0e1019;
}
.container .appBox {
  margin-top: 33px;
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  float: left;
}
 .appBox img {
   height:64px;
   width:64px;
   border-radius:10px ;
   background-color:white;
   border:1px solid #d0d9dd;
}

.appBox .dapp {
  width: 400px;
  height: 64px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;

}
.dapp:hover {
  cursor: pointer;
}
.tool:hover {
  cursor: pointer;
}
.dapp .dapp-info {
  width: 280px;
  padding: 0 21px;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
}
.dapp .dapp-name {
  height: 20px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 23px;
  color: #11293b;
}
.dapp .dapp-desc {
  font-family: PingFang SC;
  font-size: 13px;
  line-height: 18px;
  color: #949ea6;
  margin-top: 7px;
}
/* .appBox .cbox{
        width: 240px;
        height: 99px;
        background: #5a3e3e;
        border-radius: 4px;
    }
    .appBox .cbox svg{
        margin-top: 23px;
        margin-left: 20px;
    }
    .appBox .cbox p{
        font-weight: 300;
        font-size: 13px;
        margin-left: 20px;
        width: 200px;
        height: 25px;
        color: #2E3035
    }
    .appBox .dbox{
        display: inline-block;
        margin-left: 40px;
        width: 240px;
        height: 99px;
        background: #FAFAFA;
        border-radius: 4px;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .comingsoon {
        margin-top: 38px;
        margin-left: 10px;
        font-weight: 500;
        font-size: 13px;
        width: 200px;
        height: 25px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .leftLine {
        margin-top: 38px;
        font-size: 10px;
        line-height: 90px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .rightLine {
        margin-top: 38px;
        margin-left: 10px;
        font-size: 10px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    } */
.statusBox {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.statusBox svg {
  margin-bottom: 30px;
}
.statusBox p {
  font-size: 17px;
  color: #0e1019;
}
.status5Alert {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
}
.status5Alert .status5AlertBox {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 500px;
  height: 288px;
  margin-left: -250px;
  margin-top: -144px;
  background: #fafbfc;
  border-radius: 12px;
}
.status5AlertBox h4 {
  font-weight: 500;
  font-size: 18px;
  color: #2c2842;
  margin-top: 35px;
  margin-left: 35px;
}
.status5AlertBox p:nth-of-type(1) {
  font-weight: 300;
  font-size: 13px;
  line-height: 30px;
  color: #2c2842;
  margin-top: 6px;
  margin-left: 35px;
  margin-bottom: 5px;
  justify-content: center;
}
.status5AlertBox p:nth-of-type(2),
.status5AlertBox p:nth-of-type(3) {
  font-weight: 300;
  font-size: 13px;
  color: #2c2842;
  padding-left: 35px;
  line-height: 30px;
  justify-content: center;
}
.status5AlertBox p {
  line-height: 30px;
  justify-content: center;
}
.status5Alert .status5AlertBox p svg {
  margin-right: 13px;
  vertical-align: middle;
  margin-bottom: 0;
}
.status5AlertBox p:nth-of-type(4) {
  margin-top: 54px;
}
.cancel {
  margin-left: 250px;
  margin-top: 30px;
  width: 100px;
  height: 36px;
  border: 0.5px solid #000000;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
}
.ok {
  margin-left: 15px;
  margin-top: 30px;
  background: #2e3035;
  box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
  border-radius: 26.5px;
  width: 100px;
  height: 36px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
