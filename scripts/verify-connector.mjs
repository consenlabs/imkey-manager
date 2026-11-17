import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(path.join(root, 'connector.lock.json'), 'utf8'))
let failures = 0
for (const [filename, entry] of Object.entries(manifest.files)) {
  try {
    const actual = createHash('sha256')
      .update(readFileSync(path.join(root, filename)))
      .digest('hex')
    if (actual !== entry.sha256)
      throw new Error(`SHA-256 mismatch: expected ${entry.sha256}, actual ${actual}`)
    if (entry.sourcePatch) {
      const patchHash = createHash('sha256')
        .update(readFileSync(path.join(root, entry.sourcePatch)))
        .digest('hex')
      if (patchHash !== entry.sourcePatchSha256)
        throw new Error(`Source patch SHA-256 mismatch: ${entry.sourcePatch}`)
    }
    console.log(`${filename}: SHA-256 verified (${entry.architectures.join('+')})`)
  } catch (error) {
    failures++
    console.warn(`Connector warning: ${filename}: ${error.message}`)
  }
}
if (failures && !process.argv.includes('--warn')) process.exitCode = 1
