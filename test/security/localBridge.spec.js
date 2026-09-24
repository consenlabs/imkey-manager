const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { isTrustedSender, isAllowedDeviceMessage } = require('../../src/main/ipcPolicy')

const webContents = {}
const trustedWindow = { isDestroyed: () => false, webContents }
const trustedEvent = { sender: webContents }
const otherEvent = { sender: {} }

assert.strictEqual(isTrustedSender(trustedEvent, trustedWindow), true)
assert.strictEqual(isTrustedSender(otherEvent, trustedWindow), false)
assert.strictEqual(isTrustedSender(trustedEvent, null), false)
assert.strictEqual(isTrustedSender(trustedEvent, { isDestroyed: () => true, webContents }), false)
assert.strictEqual(isAllowedDeviceMessage(trustedEvent, trustedWindow, { type: 'cosUpdate' }), true)
assert.strictEqual(isAllowedDeviceMessage(trustedEvent, trustedWindow, { type: 'writeWalletAddress' }), true)
assert.strictEqual(isAllowedDeviceMessage(otherEvent, trustedWindow, { type: 'cosUpdate' }), false)
assert.strictEqual(isAllowedDeviceMessage(trustedEvent, trustedWindow, { type: 'api' }), false)
assert.strictEqual(isAllowedDeviceMessage(trustedEvent, trustedWindow, null), false)
assert.strictEqual(isAllowedDeviceMessage(trustedEvent, trustedWindow, 'cosUpdate'), false)

const root = path.resolve(__dirname, '../..')
for (const file of ['src/main/index.js', 'src/worker/worker.js']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8')
  assert(!source.includes('start-http-server'), `${file} still starts the HTTP bridge`)
  assert(!source.includes('8081'), `${file} still references the HTTP bridge port`)
  assert(!source.includes('message-from-main-api'), `${file} still exposes the JSON-RPC path`)
}
assert(!fs.existsSync(path.join(root, 'src/api/apirouter.js')), 'JSON-RPC dispatcher still exists')
assert(!fs.readFileSync(path.join(root, 'src/main/index.js'), 'utf8').includes('openBrowserView'), 'DApp BrowserView IPC still exists')

for (const file of ['.electron-vue/webpack.renderer.config.js', '.electron-vue/webpack.web.config.js']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8')
  assert(!source.includes('polkadotdapp'), `${file} still bundles a DApp preload`)
  assert(!source.includes('ethereumdapp'), `${file} still bundles a DApp preload`)
}

for (const file of [
  'src/renderer/store/dapps.js', 'src/renderer/store/url.js',
  'src/api/ethereumdapp.js', 'src/api/ethereumdapp_imkey_web3.js',
  'src/api/imkey_web3_provider.js', 'src/api/polkadotdapp.js'
]) {
  assert(!fs.existsSync(path.join(root, file)), `${file} still contains DApp code`)
}

const walletApi = fs.readFileSync(path.join(root, 'src/api/walletapi.js'), 'utf8')
assert(!/export function \w*(?:Sign|sign)\w*\s*\(/.test(walletApi), 'wallet API still exports signing methods')
for (const method of ['getBTCXpub', 'getETHAddress', 'getDOTAddress', 'getKSMAddress',
  'registerBTCAddress', 'registerETHAddress', 'registerEOSPubKey', 'registerCOSMOSAddress',
  'registerFILECOINAddress', 'registerDOTAddress', 'registerKSMAddress', 'registerTRONAddress']) {
  assert(walletApi.includes(`export function ${method} (`), `wallet API lost ${method}`)
}

console.log('Local bridge security checks passed')
