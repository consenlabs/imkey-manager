import { test, expect, _electron as electron } from '@playwright/test'
import path from 'node:path'
import os from 'node:os'
import { existsSync } from 'node:fs'
import { chmod, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'

const executable = process.env.IMKEY_PACKAGED_APP

test('packaged app loads native connector from Resources and ignores development mock', async () => {
  test.skip(!executable, 'Set IMKEY_PACKAGED_APP to an unsigned packaged executable')
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  env.IMKEY_CONNECTOR_MOCK = path.resolve('test/fixtures/absent-mock.cjs')
  let executablePath = executable!
  let wrapperDirectory: string | undefined
  if (process.env.IMKEY_PACKAGED_ARCH === 'x64') {
    wrapperDirectory = await mkdtemp(path.join(os.tmpdir(), 'imkey-rosetta-smoke-'))
    executablePath = path.join(wrapperDirectory, 'launch')
    const quotedExecutable = `'${executable!.replaceAll("'", "'\\''")}'`
    await writeFile(
      executablePath,
      `#!/bin/sh\nexec /usr/bin/arch -x86_64 ${quotedExecutable} "$@"\n`
    )
    await chmod(executablePath, 0o700)
  }
  const userDataDirectory = await mkdtemp(path.join(os.tmpdir(), 'imkey-packaged-smoke-'))
  const application = await electron.launch({
    executablePath,
    args: [`--user-data-dir=${userDataDirectory}`],
    env
  })
  try {
    const page = await application.firstWindow()
    await expect(page.locator('.appStart')).toBeVisible()
    const applicationInfo = await application.evaluate(({ app }) => ({
      packaged: app.isPackaged,
      userData: app.getPath('userData'),
      resources: process.resourcesPath,
      arch: process.arch
    }))
    expect(applicationInfo.packaged).toBe(true)
    expect(await realpath(applicationInfo.userData)).toBe(await realpath(userDataDirectory))
    if (process.env.IMKEY_PACKAGED_ARCH) {
      expect(applicationInfo.arch).toBe(process.env.IMKEY_PACKAGED_ARCH)
    }
    expect(
      await page.evaluate(() => typeof (window as unknown as { require?: unknown }).require)
    ).toBe('undefined')
    expect(await page.evaluate(() => Object.keys(window.imkey).sort())).toEqual([
      'app',
      'device',
      'updater'
    ])
    expect(existsSync(path.join(applicationInfo.resources, 'connector.dylib'))).toBe(true)
    expect(existsSync(path.join(applicationInfo.resources, 'key.env'))).toBe(true)
    expect(existsSync(path.join(applicationInfo.resources, 'koffi/darwin_x64/koffi.node'))).toBe(
      true
    )
    expect(existsSync(path.join(applicationInfo.resources, 'koffi/darwin_arm64/koffi.node'))).toBe(
      true
    )
    const responses = await page.evaluate(async () => ({
      path: await window.imkey.device.call('getUserPath'),
      init: await window.imkey.device.call('initImKeyCore'),
      device: await window.imkey.device.call('getSeid')
    }))
    expect(responses.path.isSuccess).toBe(true)
    expect(responses.init.isSuccess).toBe(true)
    expect(responses.device.isSuccess).toBe(false)
    if (!responses.device.isSuccess)
      expect(responses.device.result.trim().length).toBeGreaterThan(0)
    console.log(
      'PACKAGED NATIVE SMOKE',
      JSON.stringify({ packaged: true, arch: applicationInfo.arch, ...responses })
    )
  } finally {
    await application.close()
    await rm(userDataDirectory, { recursive: true, force: true })
    if (wrapperDirectory) await rm(wrapperDirectory, { recursive: true, force: true })
  }
})
