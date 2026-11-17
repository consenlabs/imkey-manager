const fs = require('node:fs/promises')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { nativePath } = require('./prepare-native.cjs')

// No network access during packaging: preparation uses installed or explicitly cached prebuilds.
module.exports = async function packageNative (context) {
  const root = context.packager.projectDir
  if (context.electronPlatformName === 'darwin') {
    const resources = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`, 'Contents', 'Resources')
    const inputs = await Promise.all(['darwin-x64', 'darwin-arm64'].map(target => nativePath(root, target)))
    const x64 = path.join(resources, 'koffi', 'darwin_x64', 'koffi.node')
    const arm64 = path.join(resources, 'koffi', 'darwin_arm64', 'koffi.node')
    await fs.mkdir(path.dirname(x64), { recursive: true })
    await fs.mkdir(path.dirname(arm64), { recursive: true })
    execFileSync('lipo', ['-create', ...inputs, '-output', x64])
    const architectures = execFileSync('lipo', ['-archs', x64], { encoding: 'utf8' }).trim().split(/\s+/)
    if (!['x86_64', 'arm64'].every(arch => architectures.includes(arch))) {
      throw new Error(`Expected universal koffi, found: ${architectures.join(' ')}`)
    }
    await fs.copyFile(x64, arm64)
  } else if (context.electronPlatformName === 'win32') {
    const native = await nativePath(root, 'win32-ia32')
    const header = await fs.readFile(native)
    const peOffset = header.length >= 64 ? header.readUInt32LE(60) : header.length
    if (header.toString('ascii', 0, 2) !== 'MZ' || peOffset + 6 > header.length ||
        header.toString('ascii', peOffset, peOffset + 4) !== 'PE\0\0' || header.readUInt16LE(peOffset + 4) !== 0x14c) {
      throw new Error('Expected koffi win32_ia32 PE32 Intel 80386 binary')
    }
    const destination = path.join(context.appOutDir, 'resources', 'koffi', 'win32_ia32', 'koffi.node')
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.copyFile(native, destination)
  }
}
