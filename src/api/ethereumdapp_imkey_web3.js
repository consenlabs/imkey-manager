// const KOVAN_RPC_URL = 'https://kovan.infura.io'
// const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'

// const { remote } = require('electron')
// const { dialog } = require('electron').remote
// const provider = remote.app.provider
// const apirouter = remote.app.apirouter
// const Web3 = remote.app.web3
// const Web3 = require('web3');
// import Web3 from 'web3';
// const Web3 = require('/Users/xyz/Code/imkey-manager/node_modules/web3/dist/web3.min.js')
// import ImKeyProvider from '@imkey/web3-provider';
// const ImKeyProvider = require('/Users/xyz/Code/imkey-web3-provider/dist/index').default
const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'imKeyManager',
  {
    accounts: () => {
      const res = ipcRenderer.sendSync('message-from-get-address')
      const walletAddressArray = res.result
      for (let i = 0; i < walletAddressArray.length; i++) {
        if (walletAddressArray[i].chain === 'Ethereum') {
          return [walletAddressArray[i].address]
        }
      }
    },
    callNativeApi: async (data) => {
      // return await ipcRenderer.invoke('imkey-api', data)
      return await ipcRenderer.sendSync('message-from-get-api', data)
    }
  }
)

// window.callNativeApi = async (data) => {
//   return await ipcRenderer.invoke("imkey-api", data);
// };

const scriptContent = ipcRenderer.sendSync('read-file')
console.log(scriptContent)
// let pathToInjectScript = `file://${imkeyWeb3ProviderSrc}`

// window.accounts = store.accounts;
process.on('document-start', () => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.text = scriptContent
  // script.src = pathToInjectScript;
  document.documentElement.appendChild(script)
  // var script = document.createElement("script");
  // script.type = "text/javascript";
  // script.src = "http://localhost:8000/imkey-web3-provider.js";
  // document.documentElement.appendChild(script);
})

// process.on('document-start', () => {
//   // var script = document.createElement("script");
//   // script.type = "text/javascript";
//   // script.src = "http://localhost:8000/main.imkey-web3-provider.js";
//   // document.documentElement.appendChild(script);
//   var script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = "http://localhost:8000/imkey-web3-provider.js";
//   document.documentElement.appendChild(script);
// })

// document.addEventListener(
//   "DOMContentLoaded",
//   function() {
//     var script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "http://localhost:8000/imkey-web3-provider.js";
//     document.appendChild(script);
//     var script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "http://localhost:8000/main.imkey-web3-provider.js";
//     document.appendChild(script);
//     // document.removeEventListener("DOMContentLoaded", arguments.callee, false);
//   },
//   false
// );

// observer.disconnect();

// window.onload = function() {
//   window.callNativeApi = async (data) => {
//         return await ipcRenderer.invoke('imkey-api', data)
//   }

// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'https://cdn.jsdelivr.net/npm/web3@1.3.4/dist/web3.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);

// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'http://localhost:8000/imkey-web3-provider.js';
// document.getElementsByTagName('head')[0].appendChild(script);
// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'http://localhost:8000/main.imkey-web3-provider.js';
// document.getElementsByTagName('head')[0].appendChild(script);

// const imkeyProvider = new ImKeyProvider({
//   rpcUrl: 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a',
//   // rpcUrl: 'https://eth-mainnet.token.im',
//   chainId: 42,
//   // headers: {
//   //   agent: 'ios:2.4.2:2',
//   // },
//   headers: null
// })

// // const Web3 = require('web3')
// const web3Window = new Web3(imkeyProvider)
// window.web3 = web3Window
// window.ethereum = imkeyProvider
// window.eth = imkeyProvider

// }

// const imkeyProvider = new ImKeyProvider({
//   rpcUrl: 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a',
//   // rpcUrl: 'https://eth-mainnet.token.im',
//   chainId: 42,
//   // headers: {
//   //   agent: 'ios:2.4.2:2',
//   // },
//   headers: null
// })

// // const Web3 = require('web3')
// const web3Window = new Web3(imkeyProvider)
// window.web3 = web3Window
// window.ethereum = imkeyProvider
// window.eth = imkeyProvider

// web3.eth.accounts = ['hhhh', '22']
// console.log(web3.eth.accounts)

// async function test () {
//   return 'ss'
// }

// const test33 = require('../../../imkey-web3-provider').test33
// console.log(test33)

// async function test2 () {
//   try {
//     console.log('test2:')

//     const accounts = await window.ethereum.enable()
//     window.ethereum.isImToken = true

//     // window.top.imToken = imkeyProvider
//     // window.imToken = imkeyProvider
//     // window.user
//     web3.eth.accounts = accounts
//     window.ethereum.selectedAddress = accounts[0]
//     window.web3.eth.defaultAccount = accounts[0]

//     window.ethereum = imkeyProvider
//     window.ethereum._isConnected = true
//     // ethereum.isMetaMask = true
//     // ethereum.isMetaMask = true
//     ethereum.isConnected = () => { return true }

//     // web3.currentProvider = imkeyProvider
//     web3.currentProvider.selectedAddress = accounts[0]
//     web3.currentProvider.address = accounts[0]
//     console.log('acc:', accounts)
//   } catch (err) {
//     console.log(JSON.stringify(err))
//   }
// }
// test2()

// imkeyProvider.on('connect', (error, payload) => { console.log('connected..') })
