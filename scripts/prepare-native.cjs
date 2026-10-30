const fs = require('node:fs/promises')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const version = require('../package.json').dependencies.koffi
const targets = ['darwin-x64', 'darwin-arm64', 'win32-ia32']

async function nativePath (root, target) {
  const triplet = target.replace('-', '_')
  const destination = path.join(root, '.local', 'koffi', version, triplet, 'koffi.node')
  try {
    await fs.access(destination)
    return destination
  } catch {}
  const installed = path.join(root, 'node_modules', '@koromix', `koffi-${target}`)
  try {
    const metadata = JSON.parse(await fs.readFile(path.join(installed, 'package.json'), 'utf8'))
    if (metadata.version === version) {
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.copyFile(path.join(installed, triplet, 'koffi.node'), destination)
      return destination
    }
  } catch {}
  throw new Error(`Missing koffi ${version} ${target}. Run node scripts/prepare-native.cjs ${target} before offline packaging.`)
}

async function prepare (target, online) {
  if (!targets.includes(target)) throw new Error(`Unknown target: ${target}`)
  const root = path.resolve(__dirname, '..')
  try {
    console.log(await nativePath(root, target))
    return
  } catch {}
  const cache = path.join(root, '.local', 'koffi', version, 'archives')
  await fs.mkdir(cache, { recursive: true })
  const args = ['pack', `@koromix/koffi-${target}@${version}`, '--json', '--pack-destination', cache, online ? '--prefer-offline' : '--offline']
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const packed = JSON.parse(execFileSync(npm, args, { cwd: root, encoding: 'utf8' }))[0]
  const extracted = path.join(cache, target)
  await fs.mkdir(extracted, { recursive: true })
  execFileSync('tar', ['-xzf', path.join(cache, packed.filename), '-C', extracted])
  const triplet = target.replace('-', '_')
  const destination = path.join(root, '.local', 'koffi', version, triplet, 'koffi.node')
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.copyFile(path.join(extracted, 'package', triplet, 'koffi.node'), destination)
  console.log(destination)
}

module.exports = { nativePath }
if (require.main === module) {
  const requested = process.argv.slice(2).filter(arg => arg !== '--online')
  Promise.all((requested.length ? requested : targets).map(target => prepare(target, process.argv.includes('--online'))))
    .catch(error => { console.error(error.message); process.exitCode = 1 })
}
