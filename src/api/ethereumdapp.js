// const KOVAN_RPC_URL = 'https://kovan.infura.io'
// const ETHEREUM_MAIN_NET = 'https://kovan.infura.io'

const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'imToken',
  {
    callPromisifyAPI: async (data) => {
      console.log('call Native Api before ipcRender')
      return await ipcRenderer.invoke('imkey-api', data)
    }
  }
)
/**
 * EIP 1102 and EIP 1193
 */

const createEthereumProviderScript = function () {
  const imToken = window.top.imToken

  if (window.__inTokenSDKInjecked) return

  function createJsonrpcResponse (payload, result) {
    const response = payload
    response.result = result
    return response
  }

  // function createJsonrpcError (payload, error) {
  //   const response = payload
  //   response.error = error
  //   response.result = null
  //   return response
  // }

  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
  }

  // only alert one time
  _alerted = false

  function _showEnableTip () {
    // !_alerted && imToken.callAPI('native.toastInfo', 'you should call ethereum.enable() first to access web3.eth.defaultAccount and web3.eth.accounts')
    // _alerted = true
  }

  let accounts = __accounts__

  function EthereumProvider () {
    EventEmitter.call(this)
    /**
     * https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#properties
     */
    this.networkVersion = __netVersion__
    this.chainId = __chainId__
    this.selectedAddress = accounts[0]
    this.isImToken = true
    this._isConnected = true
    this._nextJsonrpcId = 10000

    this._connect()
  }

  /**
   * https://github.com/ethereum/web3.js/blob/v1.0.0-beta.11/packages/web3-core-requestmanager/src/givenProvider.js#L38-L40
   * Note: We must use prototype inherit here,  cannot use ES6 class extends,  otherwise sendAsync method will be delete in web3.js 1.0 version
   */
  inherits(EthereumProvider, EventEmitter)

  // https://github.com/ensdomains/ens-app/pull/296
  EthereumProvider.prototype.supportsSubscriptions = () => false

  EthereumProvider.prototype.enable = function (payload) {
    if (imToken.addressAccessDenied) {
      return Promise.reject(new Error('user_canceled'))
    }
    return imToken.callPromisifyAPI('ethereum.enable', payload).then(_accounts => {
      accounts = _accounts
      window.ethereum.selectedAddress = accounts[0]
      return _accounts
    }).catch(err => {
      imToken.addressAccessDenied = true
      throw err
    })
  }

  EthereumProvider.prototype._connect = function () {
    this.emit('connect', {
      chainId: __chainId__
    })
    this.once('close', this._connect.bind(this))
  }

  EthereumProvider.prototype.isConnected = function () {
    return this._isConnected
  }

  /**
   * Events
   */
  EthereumProvider.prototype._emitNotification = function (result) {
    this.emit('notification', result)
  }

  EthereumProvider.prototype._emitConnect = function () {
    this._isConnected = true
    this.emit('connect')
  }

  EthereumProvider.prototype._emitClose = function (code, reason) {
    this._isConnected = false
    this.emit('close', code, reason)
  }

  EthereumProvider.prototype._emitNetworkChanged = function (networkId) {
    this.emit('networkChanged', networkId)
  }

  EthereumProvider.prototype._emitAccountsChanged = function (accounts) {
    this.emit('accountsChanged', accounts)
  }

  /**
   * EIP1103 send
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#send-1
   */
  EthereumProvider.prototype._eip1193Send = function (method, params) {
    const id = this._nextJsonrpcId++

    const payload = {
      jsonrpc: '2.0',
      id,
      method,
      params
    }

    if (payload.method === 'eth_requestAccounts') {
      return this.enable()
    }

    // https://tower.im/teams/349901/todos/16653/
    if (payload.method === 'eth_subscribe') {
      // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#error-object-and-codes
      // https://github.com/ethereum/web3.js/blob/a5a739b7d1834b53b7268c57f791db5d07b720da/packages/web3-core-method/src/index.js#L559-L560
      // https://github.com/ethereum/web3.js/issues/3669
      const error = new Error('eth_subscribe is not supported')
      error.code = 4200
      return Promise.reject(error)
    }

    return imToken.callPromisifyAPI('ethereum.sendAsync', payload)
      .then(response => {
        /**
         * return jsonrpc result.result
         */
        if (response.jsonrpc && response.hasOwnProperty('result')) {
          return response.result
        }

        if (!response.id) {
          if (response.method && response.method.indexOf('_subscription') > -1) {
            // Emit subscription notification
            this._emitNotification(message.params)
          }
        }

        return response
      })
  }

  /**
   * EIP1193 request
   */
  EthereumProvider.prototype.request = function (payload) {
    /**
     * because a web3.js bug  https://github.com/ethereum/web3.js/pull/3649#issuecomment-695200876
     * we can't use `this._eip1193Send` here.
     * use `prototype` instead `this` can't solve this miss of `this` context.
     * it only fixed the problem that can't found `this._eip1193Send` method.
     * luckly we didn't use any `this` inside the `_eip1193Send` method.
     */
    return EthereumProvider.prototype._eip1193Send(payload.method, payload.params)
  }

  /**
   * case1: eip1193 send
   * case2: web3.js 0.1x send
   * case3 web3.js 1.x send
   */
  EthereumProvider.prototype.send = function (method, params) {
    return this._send(method, params)
  }

  EthereumProvider.prototype.sendAsync = function (payload, callback) {
    return this._sendAsync(payload, callback)
  }

  EthereumProvider.prototype._send = function (method, params) {
    if (!method) {
      return new Error('method is null')
    }

    /**
     * web3 httpProvider sync send， need return jsonrpc response
     */
    if (typeof method === 'object' && typeof method.method === 'string') {
      const payload = method
      cb = params

      /**
       * treat as web3 sendAsync, return by callback
       */
      if (typeof cb === 'function') {
        return this._sendAsync(payload, cb)
      } else {
        /**
         * return result
         */
        return this._sendSync(payload)
      }
    } else if (typeof method === 'string') {
      return this._eip1193Send(method, params)
    }
  }

  /**
   * web3.js Provider send Backwards Compatibility
   */
  EthereumProvider.prototype._sendSync = function (payload) {
    switch (payload.method) {
      case 'net_version':
        return createJsonrpcResponse(payload, __netVersion__)
      case 'eth_chainId':
        return createJsonrpcResponse(payload, __chainId__)

      case 'eth_accounts':
        if (!accounts[0]) {
          _showEnableTip()
        }
        return createJsonrpcResponse(payload, accounts)

      case 'eth_uninstallFilter':
        this._sendAsync(payload)
        return createJsonrpcResponse(payload, true)

      case 'eth_coinbase':
        return createJsonrpcResponse(payload, accounts[0])
      default:
        console.error('The imToken Web3 object does not support synchronous methods like  ' + payload.method + ' without a callback parameter.')
        return this._eip1193Send(payload.method, payload.params)
    }
  }

  /**
   * web3.js Provider sendAsync Backwards Compatibility
   */
  EthereumProvider.prototype._sendAsync = function (payload, callback) {
    if (imToken.addressAccessDenied) {
      return Promise.reject(new Error('user_canceled'))
    }
    /**
     * https://github.com/ethereum/web3.js/blob/v1.0.0-beta.11/packages/web3-core-requestmanager/src/givenProvider.js#L38-L40
     * cause web3.js 1.0 delete sendAsync and set sendAsync to send, this is incompatible with EIP1193
     */
    if (typeof payload === 'string') {
      return this._eip1193Send(payload, callback)
    }

    // for batch payload
    if (Array.isArray(payload)) {
      return imToken.callPromisifyAPI('ethereum.sendAsync', payload)
        .then((response) => {
          return callback(null, response)
        }).catch((err) => {
          callback(err, null)
          console.error('Error from EthereumProvider sendAsync ' + JSON.stringify(payload) + ': ' + (err.message || err.toString()))
        })
    }

    /**
     * normal web3 sendAsync
     * payload: {method, params, id, jsonrpc}
     */
    return this._eip1193Send(payload.method, payload.params).then(r => {
      callback(null, createJsonrpcResponse(payload, r))
    }).catch(err => {
      const approveMethods = ['eth_requestAccounts', 'personal_listAccounts', 'eth_accounts']
      if (approveMethods.indexOf(payload.method) !== -1) {
        imToken.addressAccessDenied = true
      }
      callback(err, null)
      console.error('Error from EthereumProvider sendAsync ' + JSON.stringify(payload) + ': ' + (err.message || err.toString()))
    })
  }

  const web3EthProxyHandler = {
    get: function (obj, prop) {
      switch (prop) {
        case 'defaultAccount':
          if (accounts[0]) {
            return accounts[0]
          } else {
            _showEnableTip()
            return undefined
          }
        case 'accounts':
          // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html
          if (typeof obj[prop] === 'object' && obj[prop].create) {
            return obj[prop]
            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethaccounts
          } else {
            if (accounts[0]) {
              return accounts
            } else {
              _showEnableTip()
              return []
            }
          }
        default:
          return obj[prop]
      }
    }
  }

  // https://github.com/ethereum/web3.js/blob/v1.2.6/packages/web3-core-requestmanager/src/givenProvider.js#L36
  window.ethereum = window.ethereumProvider = new EthereumProvider()

  // inject web3 as default
  if (typeof Web3 !== 'undefined') {
    window.web3 = new Web3(window.ethereum)

    window.web3.eth.defaultAccount = accounts[0]

    // for web3.js 1.0 givenProvider
    window.web3.givenProvider = window.ethereum
    window.web3.eth.givenProvider = window.ethereum

    const _oldWe3Eth = window.web3.eth
    window.web3.eth = new Proxy(_oldWe3Eth, web3EthProxyHandler)
  }

  window.__inTokenSDKInjecked = true
}

export default (dappUrl, needInjectWeb3) => {
  const isApproved = needInjectWeb3 || selectIsApproved(dappUrl)

  const _accounts = isApproved ? getEthereumAccounts() : []
  // https://eips.ethereum.org/EIPS/eip-695  hex string
  const _chainId = `0x${parseInt(16)}`
  // number
  const _netVersion = parseInt(10)

  const template = `;(${createEthereumProviderScript.toString()}());`
  return template
    .replace(/__accounts__/g, JSON.stringify(_accounts))
    .replace(/__netVersion__/g, JSON.stringify(_netVersion))
    .replace(/__chainId__/g, JSON.stringify(_chainId))
}
