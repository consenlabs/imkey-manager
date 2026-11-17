const { app, utilityProcess } = require('electron')
const path = require('node:path')
const { mkdtempSync } = require('node:fs')
const os = require('node:os')
// No key.env is loaded and no hardware-mutating operations are used.
app.whenReady().then(() => {
  const service = utilityProcess.fork(path.resolve('out/main/service.js'), [], {
    serviceName: 'imKey connector smoke',
    stdio: 'pipe'
  })
  const userDataPath = mkdtempSync(path.join(os.tmpdir(), 'imkey-connector-smoke-'))
  const libraryPath = path.resolve(
    process.platform === 'win32' ? 'connector.dll' : 'connector.dylib'
  )
  let id = 0
  // No connect call is made, so both identity reads must fail before any USB or server I/O.
  // The SN probe also distinguishes the new dispatcher from an old unsupported_method DLL.
  const methods = ['getUserPath', 'initImKeyCore', 'getSdkInfo', 'getSeid', 'deviceSnCheck']
  const results = []
  const deadline = setTimeout(() => {
    console.error('SMOKE FAIL: utility process did not finish')
    service.kill()
    app.exit(1)
  }, 60000)
  service.stdout?.on('data', chunk => process.stdout.write(chunk))
  service.stderr?.on('data', chunk => process.stderr.write(chunk))
  service.on('exit', code => {
    if (results.length !== methods.length) {
      clearTimeout(deadline)
      console.error(`SMOKE FAIL: service exited (${code})`)
      app.exit(1)
    }
  })
  service.on('message', message => {
    if (message.type === 'connector-load-failed') {
      console.error(JSON.stringify(message))
      clearTimeout(deadline)
      service.kill()
      app.exit(1)
      return
    }
    if (message.type === 'ready') {
      console.log(
        JSON.stringify({
          electron: process.versions.electron,
          arch: process.arch,
          libraryPath,
          loaded: true
        })
      )
      service.postMessage({ id: ++id, method: methods[id - 1] })
    } else if (typeof message.id === 'number' && message.result) {
      console.log(JSON.stringify({ method: methods[message.id - 1], ...message }))
      results.push(message.result)
      if (id < methods.length) service.postMessage({ id: ++id, method: methods[id - 1] })
      else {
        clearTimeout(deadline)
        const ok =
          results.slice(0, 3).every(result => result.isSuccess) &&
          typeof results[2].result === 'string' &&
          results[2].result.length > 0 &&
          !results[3].isSuccess &&
          ['get_seid_error', 'device_connect_interface_not_called'].includes(results[3].result) &&
          !results[4].isSuccess &&
          results[4].result === 'device_connect_interface_not_called'
        service.kill()
        console.log(ok ? 'SMOKE PASS' : 'SMOKE FAIL')
        app.exit(ok ? 0 : 1)
      }
    }
  })
  service.postMessage({
    type: 'init',
    userDataPath,
    libraryPath,
    platform: process.platform,
    isPackaged: true
  })
})
