
const KOVAN_RPC_URL = 'https://kovan.infura.io';
const ETHEREUM_MAIN_NET = 'https://kovan.infura.io';
var  ImKeyProvider = require('@imkey/web3-provider');
var  Web3 = require('web3');

const imkeyProvider = new ImKeyProvider({
    rpcUrl: "https://eth-mainnet.token.im",
    chainId: 1,
    headers: {
        agent: "ios:2.4.2:2",
    },
});
imkeyProvider.enable();
const web3Window = new Web3(imkeyProvider)
window.web3 = web3Window
if (require('electron').remote) {
    window.web3 = web3Window
    console.log(window.web3)
}
