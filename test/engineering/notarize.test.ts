import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const hook = require('../../build/notarize.js').default

describe('notarization hook', () => {
  it('skips unsigned macOS builds without requesting credentials or upload', async () => {
    await expect(
      hook({
        electronPlatformName: 'darwin',
        packager: { platformSpecificBuildOptions: { identity: null } }
      })
    ).resolves.toBeUndefined()
  })
  it('skips platforms other than macOS', async () => {
    await expect(hook({ electronPlatformName: 'win32' })).resolves.toBeUndefined()
  })
})
