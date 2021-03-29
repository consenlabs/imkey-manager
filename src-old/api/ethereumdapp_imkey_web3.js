
const { contextBridge, ipcRenderer } = require('electron')

// https://chainid.network/ 
// const MAINNET_RPC_URL = "https://mainnet.infura.io/v3/819049aeadbe494c80bdb815cf41242e"
const MAINNET_RPC_URL = "https://mainnet-eth.token.im"
const MAINNET_CHAIN_ID = 1;
const KOVAN_RPC_URL = "https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a"
const KOVAN_CHAIN_ID = 42;

contextBridge.exposeInMainWorld('imKeyManager', {
  accounts: () => {
    const res = ipcRenderer.sendSync('message-from-get-address')
    const allAccounts = res.result
    const ethAccounts = allAccounts
      .filter((x) => x.chain === 'Ethereum')
      .map((x) => x.address)

    return {
      accounts: ethAccounts,
      chainId: MAINNET_CHAIN_ID,
      rpcUrl: MAINNET_RPC_URL,
      headers: {
            agent: "ios:2.4.2:2",
          }
    };
  },
  callNativeApi: async (data) => {
    return await ipcRenderer.sendSync('message-from-get-api', data)
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
