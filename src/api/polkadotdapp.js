const {
  web3Enable
} = require('@polkadot/extension-dapp')

const { Decimal } = require('decimal.js')
const { u8aToHex, hexToU8a } = require('@polkadot/util')
const { TypeRegistry } = require('@polkadot/types/create')
const { GenericAccountId, UInt } = require('@polkadot/types')
const { encodeAddress } = require('@polkadot/util-crypto')

const { remote } = require('electron')
const { dialog } = require('electron').remote
const locale = remote.app.locale
const apirouter = remote.app.apirouter
let title
let message
let buttons
console.log('locale:' + locale)
if (locale !== 'zh-CN') {
  title: 'Tips'
  message = 'Please confirm on imkey'
  buttons = ['OK', 'Cancel']
} else {
  title = '提示'
  message = '请在imkey上确认'
  buttons = ['确认', '取消']
}
const PolkadotGenesisHash = '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
const KusamaGenesisHash = '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
const PolkadotPath = "m/44'/354'/0'/0'/0'"
const KusamaPath = "m/44'/434'/0'/0'/0'"

const REGISTRY = (() => {
  // kusama runtime is 28
  const ADDRESS_TYPES_KUSAMA = {
    Address: 'MultiAddress',
    LookupSource: 'MultiAddress'
  }
  const ADDRESS_TYPES_POLKADOT = ADDRESS_TYPES_KUSAMA

  const registryKSM = new TypeRegistry()
  const registryDOT = new TypeRegistry()
  registryKSM.register(ADDRESS_TYPES_KUSAMA)
  registryDOT.register(ADDRESS_TYPES_POLKADOT)
  return {
    KUSAMA: registryKSM,
    POLKADOT: registryDOT
  }
})()

let id = 0

class Signer {
  constructor () {
    this.registry = REGISTRY.KUSAMA
  }

  async signPayload (payload) {
    // const registry = REGISTRY[params.chainType]
    console.log('payload:')
    console.log(payload)
    console.log('payload.method:' + payload.method)
    console.log('payload.method hexToU8a:' + hexToU8a(payload.method))
    console.log('payload.address:' + payload.address)

    // let extrinsicPayload = this.registry.createType('ExtrinsicPayload', payload, {version: payload.version});

    this.registry.setSignedExtensions(payload.signedExtensions)

    const extrinsicPayload = this.registry
      .createType('ExtrinsicPayload', payload, { version: payload.version })
    console.log('extrinsicPayload: ', extrinsicPayload)
    const rawdata = u8aToHex(extrinsicPayload.toU8a(true))
    console.log('rawdata:')
    console.log(rawdata)
    const encodedAddress = new GenericAccountId(this.registry, hexToU8a('0x' + payload.method.substring(6, 70))).toString()
    console.log('payload.method GenericAccountId encodedAddress:' + encodedAddress)
    const toAddress = encodeAddress(encodedAddress, 0)
    console.log('payload.method GenericAccountId to:' + toAddress)
    console.log(toAddress)
    let payment = '0'

    if (payload.method.length === 72) {
      console.log('none')
    } else {
      payment = new UInt(this.registry, hexToU8a('0x' + payload.method.substring(72, payload.method.length))).toString()
      payment = new Decimal(payment).dividedBy(10000000000)
      console.log('payload.method UInt payment:' + payment)
    }

    console.log(' payload.method.substring(72, payload.method.length)):' + payload.method.substring(72, payload.method.length))
    console.log('payload.method GenericAccountId payment:' + payment)
    console.log(payment)

    let json = {
      jsonrpc: '2.0',
      method: 'ksm.signTransaction',
      params: {
        rawdata: rawdata.substring(2, rawdata.length),
        path: KusamaPath,
        preview: {
          payment: payment + ' DOT',
          receiver: toAddress,
          sender: payload.address,
          fee: '15.4000 milli DOT'
        }
      },
      id: 24
    }
    if (payload.address === addressDOT.result.address) {
      console.log('dotdotdotdotdotdotdotdotdotdotdotdot11111')
      json = {
        jsonrpc: '2.0',
        method: 'dot.signTransaction',
        params: {
          rawdata: rawdata.substring(2, rawdata.length),
          path: PolkadotPath,
          preview: {
            payment: payment + ' DOT',
            receiver: toAddress,
            sender: payload.address,
            fee: '15.4000 milli DOT'
          }
        },
        id: 24
      }
    }
    const signature = sign(json)

    // const extrinsicSig = new GenericExtrinsicSignatureV4(this.registry, undefined);
    // console.log("before addSignature");
    // extrinsicSig.addSignature(
    //   payload.address,
    //   signature,
    //   extrinsicPayload.toU8a(true)
    // )
    // let sig = u8aToHex(extrinsicSig.toU8a(true));
    // console.log("sig: ", sig);
    return {
      id: ++id,
      signature: signature
    }
  }

  async signRaw ({ address, data }) {
    console.log(address)
    console.log(data)

    let json = {
      jsonrpc: '2.0',
      method: 'ksm.signTransaction',
      params: {
        rawdata: data,
        path: KusamaPath
      },
      id: 24
    }
    if (address === addressDOT.result.address) {
      console.log('dotdotdotdotdotdotdotdotdotdotdotdot2222')
      json = {
        jsonrpc: '2.0',
        method: 'dot.signTransaction',
        params: {
          rawdata: data,
          path: PolkadotPath
        },
        id: 24
      }
    }
    const signature = sign(json)
    return {
      id: ++id,
      signature
    }
  }
}

function sign (json) {
  const ret = dialog.showMessageBoxSync({
    type: 'info',
    title: title,
    message: message,
    buttons: buttons
  })
  console.log('ret:' + ret)
  if (ret === 0) {
    const request = apirouter.api(json)
    return request.result.signature
  } else {

  }
}
let addressKSM
let addressDOT
function getAddress () {
  const jsonKSM = {
    jsonrpc: '2.0',
    method: 'ksm.getAddress',
    params: {
      path: KusamaPath
    },
    id: 28
  }
  const jsonDOT = {
    jsonrpc: '2.0',
    method: 'dot.getAddress',
    params: {
      path: PolkadotPath
    },
    id: 25
  }
  addressKSM = apirouter.api(jsonKSM)
  addressDOT = apirouter.api(jsonDOT)
  return transformAccounts([{
    address: addressKSM.result.address,
    name: 'imKey KSM',
    genesisHash: KusamaGenesisHash
  }, {
    address: addressDOT.result.address,
    name: 'imKey DOT',
    genesisHash: PolkadotGenesisHash
  }])
}
// { address: 'J7Jnbiv5EZSTcD5qf2UdFcZVUY3x3S5r1VXNU3avaP4pqwE', name: 'Menglong', genesisHash: KusamaGenesisHash }]

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
    name,
    genesisHash
  }) => ({
    address,
    name,
    genesisHash
  }))
}

// returns an array of all the injected sources
// (this needs to be called first, before other requests)
web3Enable('imkey')

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
