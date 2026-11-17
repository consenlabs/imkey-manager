import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect, it } from 'vitest'

it('connector verification fails explicitly but build warning mode remains successful', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'imkey-connector-lock-'))
  try {
    mkdirSync(path.join(root, 'scripts'))
    copyFileSync('scripts/verify-connector.mjs', path.join(root, 'scripts/verify-connector.mjs'))
    const library = Buffer.from('fixture connector')
    writeFileSync(path.join(root, 'connector.dll'), library)
    const entry = {
      sha256: createHash('sha256').update(library).digest('hex'),
      architectures: ['i386']
    }
    const lock = path.join(root, 'connector.lock.json')
    writeFileSync(lock, JSON.stringify({ files: { 'connector.dll': entry } }))
    const execute = (...args: string[]) =>
      spawnSync(process.execPath, [path.join(root, 'scripts/verify-connector.mjs'), ...args], {
        encoding: 'utf8'
      })
    expect(execute().status).toBe(0)
    writeFileSync(path.join(root, 'connector.dll'), 'changed')
    expect(execute().status).toBe(1)
    const warning = execute('--warn')
    expect(warning.status).toBe(0)
    expect(warning.stderr).toContain('SHA-256 mismatch')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
