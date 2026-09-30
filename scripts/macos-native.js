const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')

function run (command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: root, ...options })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`${path.basename(command)} exited with ${result.status}`)
}

function findNodeGyp () {
  const candidates = [process.env.NODE_GYP_PATH]
  if (process.env.npm_execpath) {
    candidates.push(path.resolve(path.dirname(process.env.npm_execpath), '../node_modules/node-gyp/bin/node-gyp.js'))
  }
  try { candidates.push(require.resolve('node-gyp/bin/node-gyp.js')) } catch (error) { /* npm may supply node-gyp instead */ }
  for (const candidate of candidates.filter(Boolean)) {
    if (!fs.existsSync(candidate)) continue
    const metadata = require(path.resolve(path.dirname(candidate), '../package.json'))
    if (Number(metadata.version.split('.')[0]) >= 10) return candidate
  }
  throw new Error('Use a current npm with node-gyp >= 10, or set NODE_GYP_PATH to its bin/node-gyp.js. The legacy project node-gyp cannot build with current Python.')
}

async function prepareNative () {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') {
    throw new Error('This command requires a native ARM64 Node.js on an Apple Silicon Mac.')
  }
  if (fs.lstatSync(path.join(root, 'node_modules')).isSymbolicLink()) {
    throw new Error('Install dependencies locally: node_modules must not point to another checkout, because rebuilding changes its native modules.')
  }
  const nodeGyp = findNodeGyp()
  const version = require('electron/package.json').version
  const runtime = path.join(root, '.local', `electron-${version}-arm64`)
  const executable = path.join(runtime, 'Electron.app/Contents/MacOS/Electron')
  const framework = path.join(runtime, 'Electron.app/Contents/Frameworks/Electron Framework.framework/Electron Framework')
  if (!fs.existsSync(executable) || !fs.existsSync(framework)) {
    const { downloadArtifact } = require('@electron/get')
    const archive = await downloadArtifact({ version, artifactName: 'electron', platform: 'darwin', arch: 'arm64' })
    fs.mkdirSync(runtime, { recursive: true })
    run('ditto', ['-x', '-k', archive, runtime])
  }
  run('lipo', ['-verify_arch', 'arm64', executable])
  run('lipo', ['-verify_arch', 'arm64', path.join(root, 'connector.dylib')])

  const ffi = path.dirname(require.resolve('ffi-napi/package.json'))
  const modules = new Set([
    path.dirname(require.resolve('ref-napi/package.json')),
    path.dirname(require.resolve('ref-napi/package.json', { paths: [ffi] })),
    ffi
  ])
  const headers = path.join(os.homedir(), '.electron-gyp', version)
  const target = fs.existsSync(path.join(headers, 'include/node/node.h'))
    ? [`--nodedir=${headers}`]
    : [`--target=${version}`, '--dist-url=https://electronjs.org/headers']
  for (const module of modules) {
    console.log(`Rebuilding ${path.relative(root, module)} for Electron ${version} / arm64`)
    run(process.execPath, [nodeGyp, 'rebuild', '--arch=arm64', ...target], {
      cwd: module,
      env: {
        ...process.env,
        GYP_DEFINES: [process.env.GYP_DEFINES, 'openssl_fips='].filter(Boolean).join(' '),
        MACOSX_DEPLOYMENT_TARGET: process.env.MACOSX_DEPLOYMENT_TARGET || '11.0'
      }
    })
  }
  const smoke = `
    if (process.arch !== 'arm64') throw new Error('Electron is not ARM64');
    const ffi = require('ffi-napi');
    require('ref-napi');
    const lib = ffi.Library('./connector', {
      imkey_clear_err: ['void', []],
      imkey_get_last_err_message: ['string', []]
    });
    lib.imkey_clear_err();
    if (lib.imkey_get_last_err_message()) throw new Error('Connector error');
    console.log('ARM64 Electron, FFI and connector smoke check passed');
  `
  const electronEnv = { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
  delete electronEnv.NODE_OPTIONS
  run(executable, ['-e', smoke], { env: electronEnv })
  return runtime
}

module.exports = { prepareNative, run, root }
if (require.main === module) {
  prepareNative().catch(error => { console.error(error.message); process.exitCode = 1 })
}
