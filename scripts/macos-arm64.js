const fs = require('fs')
const path = require('path')
const { prepareNative, run, root } = require('./macos-native')

async function main () {
  const mode = process.argv[2]
  if (!['dev', 'build'].includes(mode)) throw new Error('Expected dev or build')
  const runtime = await prepareNative()
  const env = {
    ...process.env,
    ELECTRON_OVERRIDE_DIST_PATH: runtime,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--openssl-legacy-provider'].filter(Boolean).join(' '),
    NODE_ENV: mode === 'dev' ? 'development' : 'production'
  }
  delete env.ELECTRON_RUN_AS_NODE
  if (mode === 'dev') {
    fs.mkdirSync(path.join(root, 'dist/electron'), { recursive: true })
    run(process.execPath, [path.join(root, '.electron-vue/dev-runner.js')], { env })
  } else {
    run(process.execPath, [path.join(root, '.electron-vue/build.js')], { env })
    const builder = require.resolve('electron-builder/cli.js')
    run(process.execPath, [builder, '--mac', '--arm64', '--publish', 'never',
      '--config.npmRebuild=false', `--config.electronDist=${runtime}`, ...process.argv.slice(3)], { env })
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
