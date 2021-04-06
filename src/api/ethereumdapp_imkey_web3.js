
const { contextBridge, ipcRenderer } = require('electron')

// https://chainid.network/
// const MAINNET_RPC_URL = "https://mainnet.infura.io/v3/819049aeadbe494c80bdb815cf41242e"
const MAINNET_RPC_URL = 'https://mainnet-eth.token.im'
const MAINNET_CHAIN_ID = 1
// const KOVAN_RPC_URL = 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a'
// const KOVAN_CHAIN_ID = 42

contextBridge.exposeInMainWorld('imKeyManager', {
  accounts: () => {
    const res = ipcRenderer.sendSync('message-from-get-address')
    const allAccounts = res.result
    const account = allAccounts.find((x) => x.chain === 'Ethereum')
    return {
      accounts: [account.address],
      chainId: account.chainId,
      rpcUrl: account.rpcUrl,
      headers: {
        agent: 'ios:2.4.2:2'
      },
      symbol: account.symbol
    }
  },
  callNativeApi: async (data) => {
    const ret = ipcRenderer.sendSync('showMessageBoxSync', JSON.stringify(data))
    if (ret === 0) {
      return await ipcRenderer.sendSync('message-from-get-api', data)
    } else {

    }
  }
})

const scriptContent = ipcRenderer.sendSync('read-file')

process.on('document-start', () => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.text = scriptContent
  document.documentElement.appendChild(script)
})

// process.on('document-start', () => {
//   var script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = "http://localhost:8000/main.imkey-web3-provider.js";
//   document.documentElement.appendChild(script);
//   var script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = "http://localhost:8000/imkey-web3-provider.js";
//   document.documentElement.appendChild(script);
// })
