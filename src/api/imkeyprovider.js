const { remote } = require('electron')
const { dialog } = require('electron').remote
const provider = remote.app.provider
const apirouter = remote.app.apirouter

const {
  web3Enable
} = require('@polkadot/extension-dapp')

const { Decimal } = require('decimal.js')
const { u8aToHex, hexToU8a } = require('@polkadot/util')
const { TypeRegistry } = require('@polkadot/types/create')
const { GenericAccountId, UInt } = require('@polkadot/types')
const { encodeAddress } = require('@polkadot/util-crypto')

let id = 0
class Signer {
  constructor () {
    this.registry = new TypeRegistry()
  }

  async signPayload (payload) {
    console.log('payload:')
    console.log(payload)
    console.log('payload.method:' + payload.method)
    console.log('payload.method hexToU8a:' + hexToU8a(payload.method))
    console.log('payload.address:' + payload.address)

    const rawdata = u8aToHex(this.registry.createType('ExtrinsicPayload', payload, { version: payload.version }).toU8a({ method: true }))
    console.log('rawdata:')
    console.log(rawdata)
    const encodedAddress = new GenericAccountId(this.registry, hexToU8a('0x' + payload.method.substring(6, 70))).toString()
    console.log('payload.method GenericAccountId encodedAddress:' + encodedAddress)
    const toAddress = encodeAddress(encodedAddress, 0)
    console.log('payload.method GenericAccountId to:' + toAddress)
    console.log(toAddress)
    let payment = '0'

    if (payload.method.length === 72) {

    } else {
      payment = new UInt(this.registry, hexToU8a('0x' + payload.method.substring(72, payload.method.length))).toString()
      payment = new Decimal(payment).dividedBy(10000000000)
      console.log('payload.method UInt payment:' + payment)
    }

    console.log(' payload.method.substring(72, payload.method.length)):' + payload.method.substring(72, payload.method.length))
    console.log('payload.method GenericAccountId payment:' + payment)
    console.log(payment)

    const json = {
      jsonrpc: '2.0',
      method: 'dot.signTransaction',
      params: {
        rawdata: rawdata.substring(2, rawdata.length),
        path: "m/44'/354'/0'/0'/0'",
        preview: {
          payment: payment + ' DOT',
          receiver: toAddress,
          sender: payload.address,
          fee: '15.4000 milli DOT'
        }
      },
      id: 24
    }
    const signature = sign(json)
    return {
      id: ++id,
      signature
    }
  }

  async signRaw ({ address, data }) {
    console.log(address)
    console.log(data)
    const json = {
      jsonrpc: '2.0',
      method: 'dot.signTransaction',
      params: {
        rawdata: data,
        path: "m/44'/354'/0'/0'/0'"
      },
      id: 24
    }
    const signature = sign(json)
    return {
      id: ++id,
      signature
    }
  }
}
function sign (json) {
  const request = apirouter.api(json)
  return request.result.signature
}
function getAddress () {
  const json = {
    jsonrpc: '2.0',
    method: 'dot.getAddress',
    params: {
      path: "m/44'/354'/0'/0'/0'"
    },
    id: 25
  }
  const request = apirouter.api(json)
  return transformAccounts([{ address: request.result.address }, { address: '12FcZrcthxtov2cQybpLGcuW2khkNbNy3WgUi2UEYgL5V9j1' }])
}
const accounts = getAddress()

window.injectedWeb3 = {
  imkey: {
    version: '0.1.0',
    enable: async origin => ({
      accounts: {
        get: () => {
          console.log('accounts:' + accounts)
          return accounts
        }
      },
      signer: new Signer()
    })
  }
}
function transformAccounts (accounts) {
  return accounts.map(({
    address,
    name
  }) => ({
    address,
    name
  }))
}

// returns an array of all the injected sources
// (this needs to be called first, before other requests)
const allInjected = web3Enable('imkey')

// returns an array of { address, meta: { name, source } }
// meta.source contains the name of the extension that provides this account
// const allAccounts = web3Accounts()

// the address we use to use for signing, as injected
// const SENDER = '5DgzZQE9FS7G5CJLrLgVq2YNa4LM3oYdPh4DFfpp4cMRcWeM'

// finds an injector for an address
// const injector = web3FromAddress(SENDER)

// sign and send our transaction - notice here that the address of the account
// (as retrieved injected) is passed through as the param to the `signAndSend`,
// the API then calls the extension to present to the user and get it signed.
// Once complete, the api sends the tx + signature via the normal process
// api.tx.balances
//     .transfer('5EAKqFv3izjcjDdNuMLbrEk6Wzo1KEJsUAtWLyrB2zn4kMpT', 123456)
//     .signAndSend(SENDER, { SingleAccountSigner }, (status) => {  });

// const ImKeyProvider = require('../../../imkey-web3-provider').default
//

//
// var Web3 = require('web3')
// const web3Window = new Web3(imkeyProvider)
// window.web3 = web3Window
// window.ethereum = imkeyProvider
// window.eth = imkeyProvider
//
// web3.eth.accounts = ['hhhh', '22']
// console.log(web3.eth.accounts)
//
// async function test () {
//   return 'ss'
// }
//
// const test33 = require('../../../imkey-web3-provider').test33
// // console.log(test33)
//
// async function test2 () {
//   try {
//     console.log('test2:')
//
//     const accounts = await window.ethereum.enable()
//     window.ethereum.isMetaMask = true
//     web3.eth.accounts = accounts
//     console.log('acc:', accounts)
//   } catch (err) {
//     console.log(err)
//   }
// }
// test2()
