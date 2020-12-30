
const KOVAN_RPC_URL = 'https://kovan.infura.io'
const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'

const { remote } = require('electron')
const apirouter = remote.app.apirouter
const json = {
  jsonrpc: '2.0',
  method: 'btc.getXpub',
  params: {
    network: 'MAINNET',
    path: "m/44'/0'/0'/0/0"
  },
  id: 5
}
const res = apirouter.api(json)
if (res !== null || typeof (res) !== 'undefined') {
  const { dialog } = require('electron').remote
  dialog.showMessageBox({
    type: 'info',
    title: '访问说明',
    message: '你正在访问第三方DAPP' + res.result.xpub,
    buttons: ['OK', 'Cancel']
  }).then(result => {
    console.log('您的选择:', res.result.xpub)
    console.log(result)
  }).catch(err => {
    console.log(err)
  })
}
// ipcRenderer.send('message-from-provider', {
//     type: "getSeid",
//     data: ""
//   })
// ipcRenderer.on('message-to-provider', (sender, msg) => {
//  console.log("hhhhhhh:"+msg.data)
//     // ipcRenderer.send('viewMessage',"你正在访问第三方DAPP")
//
// })

// var ImKeyProvider = require('@imkey/web3-provider').default
// var Web3 = require('web3')
// const deviceManger = require('../api/devicemanagerapi')
// const walletApi = require('../api/walletapi')
// console.log('provider: ', JSON.stringify(ImKeyProvider))
//
// const imkeyProvider = new ImKeyProvider({
//   rpcUrl: 'https://eth-mainnet.token.im',
//   chainId: 1,
//   headers: {
//     agent: 'ios:2.4.2:2'
//   }
// })
// imkeyProvider.enable()
// const web3Window = new Web3(imkeyProvider)
// window.web3 = web3Window
//
// if (require('electron').remote) {
//   window.web3 = web3Window
//   console.log(window.web3)
// }
