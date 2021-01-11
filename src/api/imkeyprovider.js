
const KOVAN_RPC_URL = 'https://kovan.infura.io'
const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'

const { remote } = require('electron')
const { dialog } = require('electron').remote
const provider = remote.app.provider
const apirouter = remote.app.apirouter

const ImKeyProvider = require('../../../imkey-web3-provider').default

const imkeyProvider = new ImKeyProvider({
  rpcUrl: 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a',
  chainId: 42,
  headers: null,
  apirouter,
  dialog
})

var Web3 = require('web3')
const web3Window = new Web3(imkeyProvider)
window.web3 = web3Window
window.ethereum = imkeyProvider
window.eth = imkeyProvider

web3.eth.accounts = ['hhhh', '22']
console.log(web3.eth.accounts)

async function test () {
  return 'ss'
}

const test33 = require('../../../imkey-web3-provider').test33
// console.log(test33)

async function test2 () {
  try {
    console.log('test2:')

    const accounts = await window.ethereum.enable()
    window.ethereum.isMetaMask = true
    web3.eth.accounts = accounts
    console.log('acc:', accounts)
  } catch (err) {
    console.log(err)
  }
}
test2()

// imkeyProvider.on("connect", (connectInfo) => {
//   console.log(
//     `Ethereum Provider connected success, chainId: ${connectInfo.chainId}`
//   );
// });

// imkeyProvider.enable().then((ret) => {
//   console.log('enable then')
//   console.log(ret)
//   // web3.eth.accounts = ret
//   // window.web3.accounts = [ret]
//   window.web3.eth.defaultAccount = ret
//   window.web3.accounts = ['hahaha']
//   console.log(web3.eth.accounts)
// })
//   .catch((error) => {
//     console.log(error)
//   })
