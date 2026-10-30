import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const configuration = require('../../package.json').build
const packageNative = require('../../scripts/package-native.cjs')

describe('native packaging contract', () => {
  it('always targets universal macOS DMG and ZIP independently of the host architecture', () => {
    expect(configuration.mac.target).toEqual([
      { target: 'dmg', arch: ['universal'] },
      { target: 'zip', arch: ['universal'] }
    ])
    expect(configuration.mac.mergeASARs).toBe(true)
    expect(configuration.mac.files).toEqual(['out/**/*', '!node_modules/@koromix/**/*'])
    expect(configuration.win.target).toEqual([{ target: 'nsis', arch: ['ia32'] }])
  })

  it('places the cached Windows ia32 module at the official koffi Resources fallback', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'imkey-native-package-'))
    try {
      const binary = Buffer.alloc(128)
      binary.write('MZ')
      binary.writeUInt32LE(64, 60)
      binary.write('PE\0\0', 64)
      binary.writeUInt16LE(0x14c, 68)
      const native = path.join(root, '.local/koffi/3.3.2/win32_ia32/koffi.node')
      await mkdir(path.dirname(native), { recursive: true })
      await writeFile(native, binary)
      const appOutDir = path.join(root, 'app')
      await packageNative({
        electronPlatformName: 'win32',
        appOutDir,
        packager: { projectDir: root }
      })
      expect(await readFile(path.join(appOutDir, 'resources/koffi/win32_ia32/koffi.node'))).toEqual(
        binary
      )
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
