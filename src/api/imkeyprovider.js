const KOVAN_RPC_URL = 'https://kovan.infura.io'
const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'

const { remote } = require('electron')
const { dialog } = require('electron').remote
const provider = remote.app.provider
const apirouter = remote.app.apirouter

const ImKeyProvider = require('../../../imkey-web3-provider').default

const imkeyProvider = new ImKeyProvider({
  rpcUrl: 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a',
  // rpcUrl: 'https://eth-mainnet.token.im',
  chainId: 42,
  // headers: {
  //   agent: 'ios:2.4.2:2',
  // },
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
    // window.ethereum.isImToken = true
    

    // window.top.imToken = imkeyProvider
    // window.imToken = imkeyProvider
    // window.user
    web3.eth.accounts = accounts
    window.ethereum.selectedAddress = accounts[0]
    
    window.ethereum = imkeyProvider
    window.ethereum._isConnected = true
    // ethereum.isMetaMask = true
    ethereum.isMetaMask = true
    ethereum.isConnected = ()=>{return true}

    // web3.currentProvider = imkeyProvider
    web3.currentProvider.selectedAddress = accounts[0]
    web3.currentProvider.address = accounts[0]
    console.log('acc:', accounts)
  } catch (err) {
    console.log(err)
  }
}
test2()

imkeyProvider.on('connect', (error, payload) => {console.log('connected..')})