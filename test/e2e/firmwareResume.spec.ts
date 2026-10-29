import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

interface Control {
  mode?: 'normal' | 'bootloader'
  seid?: string
  offer?: boolean
  failNativeApps?: boolean
  failBinding?: boolean
  failAddress?: boolean
  failBindingCheck?: boolean
  binding?: string
  delayNativeMs?: number
  initialCos?: string
  installedCos?: string
  latestCos?: string
  failCaptureRead?: 'once' | 'persistent' | false
  failWallet?: boolean
}
interface DeviceState {
  cosWritten: boolean
  physicalWrites: number
  appsInstalled: boolean
  serverComplete: boolean
  bleDone: boolean
  binding: string
  addressAttempts: number
  addressWrites: number
  bindingAttempts: number
  captureReadFailures: number
  firmwareVersion: string
}
interface Call {
  seid: string
  method: string
}

let application: ElectronApplication | undefined
let page: Page
let directory: string
let control: Control
const publishedMismatch: Control = {
  initialCos: '1.6.03',
  installedCos: '1.9.11',
  latestCos: '1.9.12'
}

async function configure(update: Partial<Control>): Promise<void> {
  control = { ...control, ...update }
  const file = path.join(directory, 'control.json')
  await writeFile(file + '.tmp', JSON.stringify(control))
  await rename(file + '.tmp', file)
}

async function reopen(): Promise<void> {
  await application?.close()
  application = undefined
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/firmware-resume-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_CONTROL: path.join(directory, 'control.json'),
    IMKEY_E2E_STATE: path.join(directory, 'device-state.json'),
    IMKEY_E2E_LOG: path.join(directory, 'calls.jsonl')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}

async function launch(options: Control): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-firmware-resume-'))
  control = {}
  await configure(options)
  await reopen()
}

async function calls(): Promise<Call[]> {
  const log = await readFile(path.join(directory, 'calls.jsonl'), 'utf8').catch(error => {
    // The worker may not have created its call log when initialization is first polled.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return ''
    throw error
  })
  return log
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as Call)
}

async function state(seid = 'RESUMEDEVICEA'): Promise<DeviceState> {
  return (
    JSON.parse(await readFile(path.join(directory, 'device-state.json'), 'utf8')) as Record<
      string,
      DeviceState
    >
  )[seid]
}

async function connect(seed = false): Promise<void> {
  if (await page.locator('.appStart').isVisible()) await page.locator('.appStart button').click()
  if (seed) {
    await expect
      .poll(async () => (await calls()).map(call => call.method))
      .toContain('init_imkey_core_x')
    expect(
      (await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))).isSuccess
    ).toBe(true)
  }
  await page.locator('.connectDevice button').first().click()
}

async function pending(): Promise<void> {
  await expect(page.locator('.tip3')).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('recovery-pending.png'), fullPage: true })
  const files = await readdir(path.join(directory, 'firmware-recovery'))
  expect(files).toEqual(['RESUMEDEVICEA.json'])
  const checkpoint = await readFile(
    path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'),
    'utf8'
  )
  expect(checkpoint).not.toContain('A2345678')
  expect(checkpoint).not.toContain('bindCode')
}

async function retry(): Promise<void> {
  await page.locator('.tip3 button').click()
  await connect()
}

async function completed(expectedWrites = 1): Promise<void> {
  await expect(page.locator('.homeBox')).toBeVisible()
  expect(await state()).toMatchObject({
    cosWritten: true,
    physicalWrites: expectedWrites,
    appsInstalled: true,
    serverComplete: true,
    bleDone: true,
    binding: 'bound_this',
    addressWrites: expectedWrites
  })
  expect((await calls()).map(call => call.method)).toContain('btc_get_xpub')
  await expect.poll(() => readdir(path.join(directory, 'firmware-recovery'))).toEqual([])
}

async function startDeviceUpgrade(fault: Control = {}): Promise<void> {
  await launch({ mode: 'normal', ...publishedMismatch })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('device-info-card')).toContainText('SN-RESUME')
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.6.03')
  await configure({ offer: true, ...fault })
  await page.getByTestId('firmware-check-button').click()
  await page.getByTestId('firmware-upgrade-button').click()
  await page.locator('.alertBox button').click()
}

async function retryDeviceUpgrade(): Promise<void> {
  await page.locator('.alert3 button').click()
  await page.getByTestId('firmware-upgrade-button').click()
}

async function expectActualVersionAndPublishedUpdate(expectedWrites = 1): Promise<void> {
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.11')
  if (await page.getByTestId('firmware-check-button').isVisible())
    await page.getByTestId('firmware-check-button').click()
  // The page offers Upgrade immediately when its published-version comparison
  // remains different. Independently re-read the server to ensure the fixture
  // has not silently changed its publication to match the captured version.
  const published = await page.evaluate(() => window.imkey.device.call('cosCheckUpdate'))
  expect(published).toMatchObject({
    isSuccess: true,
    result: { latestCosVersion: '1.9.12', isLatest: false, isUpdateSuccess: true }
  })
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute(
    'data-status',
    'available'
  )
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.11')
  expect(await state()).toMatchObject({ physicalWrites: expectedWrites, firmwareVersion: '1.9.11' })
  expect(JSON.parse(await readFile(path.join(directory, 'control.json'), 'utf8')).latestCos).toBe(
    '1.9.12'
  )
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(expectedWrites)
}

test.afterEach(async () => {
  await application?.close()
  application = undefined
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('COS downgrade retries native application installation in the same session without rewriting COS', async () => {
  await launch({ mode: 'bootloader', failNativeApps: true })
  await connect(true)
  await pending()
  expect(await state()).toMatchObject({
    physicalWrites: 1,
    appsInstalled: false,
    serverComplete: false
  })
  await configure({ failNativeApps: false })
  await retry()
  await completed()
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(2)
})

test('Device-page downgrade survives closing Electron after COS write and resumes native apps before normal update checking', async () => {
  await launch({ mode: 'normal' })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('device-info-card')).toContainText('SN-RESUME')
  await configure({ offer: true, failNativeApps: true, delayNativeMs: 1500 })
  await page.getByTestId('firmware-check-button').click()
  await page.getByTestId('firmware-upgrade-button').click()
  await page.locator('.alertBox button').click()
  await expect(page.locator('.firmware-progress-dialog')).toBeVisible()
  await page.screenshot({
    path: test.info().outputPath('device-downgrade-progress.png'),
    fullPage: true
  })
  await expect(page.locator('.alert3')).toBeVisible()
  expect(await state()).toMatchObject({
    physicalWrites: 1,
    appsInstalled: false,
    serverComplete: false
  })
  const beforeRestart = (await calls()).length
  await configure({ failNativeApps: false })
  await reopen()
  await connect()
  await expect(page.locator('.tip4')).toBeVisible()
  await page.screenshot({
    path: test.info().outputPath('reopened-recovery-progress.png'),
    fullPage: true
  })
  await completed()
  await page.screenshot({ path: test.info().outputPath('restored-home.png'), fullPage: true })
  const resumed = (await calls()).slice(beforeRestart).map(call => call.method)
  expect(resumed.indexOf('cos_update')).toBeGreaterThanOrEqual(0)
  expect(resumed.indexOf('check_update')).toBeGreaterThan(resumed.indexOf('cos_update'))
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(2)
})

for (const failure of ['failNativeApps', 'failBinding', 'failAddress'] as const) {
  test(`a persisted ${failure} checkpoint resumes after closing and reopening Electron`, async () => {
    await launch({ mode: 'bootloader', ...publishedMismatch, [failure]: true })
    await connect(true)
    await pending()
    const failed = await state()
    expect(failed.physicalWrites).toBe(1)
    await configure({ [failure]: false })
    await reopen()
    await connect()
    await completed()
    const restored = await state()
    expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(
      failure === 'failNativeApps' ? 2 : 1
    )
    if (failure === 'failAddress') {
      expect(restored.bindingAttempts).toBe(failed.bindingAttempts)
      expect(restored.addressAttempts).toBe(failed.addressAttempts + 1)
    }
  })
}

for (const rejection of ['error', 'unknown'] as const) {
  test(`${rejection} binding checks never grant home access, including direct navigation`, async () => {
    await launch({
      mode: 'normal',
      ...(rejection === 'error' ? { failBindingCheck: true } : { binding: 'unknown' })
    })
    await connect(true)
    await expect(page.locator('.tip1')).toBeVisible()
    await expect(page.locator('.homeBox')).toHaveCount(0)
    await page.screenshot({ path: test.info().outputPath('binding-denied.png'), fullPage: true })
    await page.evaluate(() => {
      window.location.hash = '#/home'
    })
    await expect(page).not.toHaveURL(/#\/home/)
    await expect(page.locator('.homeBox')).toHaveCount(0)
    expect((await calls()).map(call => call.method)).not.toContain('btc_get_xpub')
  })
}

test('a replacement SEID cannot consume or clear the original device recovery checkpoint', async () => {
  await launch({ mode: 'bootloader', failAddress: true })
  await connect(true)
  await pending()
  const checkpoint = await readFile(
    path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'),
    'utf8'
  )
  await configure({ mode: 'normal', seid: 'RESUMEDEVICEB', failAddress: false })
  await reopen()
  await connect()
  await expect(page.locator('.tip5')).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
  expect(await readFile(path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'), 'utf8')).toBe(
    checkpoint
  )
  const replacementCalls = (await calls())
    .filter(call => call.seid === 'RESUMEDEVICEB')
    .map(call => call.method)
  expect(replacementCalls).not.toContain('cos_update')
  expect(replacementCalls).not.toContain('bind_acquire')
  expect(replacementCalls).not.toContain('register_address')
  await configure({ mode: 'bootloader', seid: 'RESUMEDEVICEA' })
  await reopen()
  await connect()
  await completed()
})

test('native success displays captured COS 1.9.11 while the unchanged published 1.9.12 remains available', async () => {
  await startDeviceUpgrade()
  await expect(page.locator('.alert2')).toBeVisible()
  await completed()
  await page.locator('.alert2 button').click()
  await expectActualVersionAndPublishedUpdate()
  await page.screenshot({
    path: test.info().outputPath('actual-version-and-published-update.png'),
    fullPage: true
  })
  // A later explicit upgrade is a new operation: it must not inherit a stale
  // busy flag or skip the fresh binding and wallet checks needed for home access.
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert2')).toBeVisible()
  await completed(2)
  await page.locator('.alert2 button').click()
  await expectActualVersionAndPublishedUpdate(2)
  await page.locator('.routerBar li').first().click()
  await expect(page.locator('.homeBox')).toBeVisible()
  await expect(page).toHaveURL(/home\/welcomeHome/)
})

for (const failure of ['once', 'persistent'] as const) {
  test(`a ${failure} capture read failure retries the same unbound device without repeating native update`, async () => {
    await startDeviceUpgrade({ failCaptureRead: failure })
    await expect(page.locator('.alert3')).toBeVisible()
    expect(await state()).toMatchObject({
      physicalWrites: 1,
      binding: 'unbound',
      captureReadFailures: 1,
      firmwareVersion: '1.9.11'
    })
    const saved = JSON.parse(
      await readFile(path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'), 'utf8')
    )
    expect(saved.phase).toBe('capture-versions')
    await page.screenshot({
      path: test.info().outputPath('capture-read-failed.png'),
      fullPage: true
    })
    if (failure === 'persistent') {
      await retryDeviceUpgrade()
      await expect(page.locator('.alert3')).toBeVisible()
      expect(await state()).toMatchObject({
        binding: 'unbound',
        captureReadFailures: 2,
        physicalWrites: 1
      })
      await configure({ failCaptureRead: false })
    }
    await retryDeviceUpgrade()
    await expect(page.locator('.alert2')).toBeVisible()
    await completed()
    await page.locator('.alert2 button').click()
    await expectActualVersionAndPublishedUpdate()
  })
}

for (const checkpointKind of ['current', 'legacy-v1'] as const) {
  test(`reopening resumes a ${checkpointKind} capture checkpoint despite the different published version`, async () => {
    await startDeviceUpgrade({ failCaptureRead: 'persistent' })
    await expect(page.locator('.alert3')).toBeVisible()
    const file = path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json')
    expect(JSON.parse(await readFile(file, 'utf8')).phase).toBe('capture-versions')
    await application!.close()
    application = undefined
    if (checkpointKind === 'legacy-v1') {
      // Old Manager persisted the published target as expectedCos before it had
      // captured the actual version. This is the same device and completed native update.
      await writeFile(
        file,
        JSON.stringify({
          version: 1,
          seid: 'RESUMEDEVICEA',
          phase: 'capture-versions',
          needsBinding: true,
          expectedCos: '1.9.12',
          expectedBle: '1.1.0'
        })
      )
    }
    await configure({ failCaptureRead: false })
    await reopen()
    await connect()
    await completed()
    await page.locator('.routerBar li').nth(2).click()
    await expectActualVersionAndPublishedUpdate()
  })
}

for (const recoveryPath of ['direct-retry', 'reopen'] as const) {
  test(`wallet read failure after mismatched published-version recovery stays outside home through ${recoveryPath} without native writes`, async () => {
    await launch({ mode: 'bootloader', ...publishedMismatch, failWallet: true })
    await connect(true)
    await expect(page.locator('.tip1')).toBeVisible()
    await expect(page.locator('.homeBox')).toHaveCount(0)
    expect(await state()).toMatchObject({
      physicalWrites: 1,
      binding: 'bound_this',
      firmwareVersion: '1.9.11',
      serverComplete: true
    })
    expect(await readdir(path.join(directory, 'firmware-recovery'))).toEqual([])
    await page.screenshot({
      path: test.info().outputPath('wallet-read-denied.png'),
      fullPage: true
    })
    if (recoveryPath === 'reopen') {
      const beforeRestart = (await calls()).length
      await reopen()
      await connect()
      await expect(page.locator('.tip1')).toBeVisible()
      await expect(page.locator('.homeBox')).toHaveCount(0)
      const resumed = (await calls()).slice(beforeRestart).map(call => call.method)
      expect(resumed).toContain('cos_check_update')
      expect(resumed).toContain('bind_check')
      expect(resumed).toContain('btc_get_xpub')
      expect(resumed.indexOf('bind_check')).toBeLessThan(resumed.indexOf('btc_get_xpub'))
      expect(resumed).not.toContain('cos_update')
      expect(await readdir(path.join(directory, 'firmware-recovery'))).toEqual([])
      await page.screenshot({
        path: test.info().outputPath('reopened-wallet-read-denied.png'),
        fullPage: true
      })
    }
    expect(await page.evaluate(() => window.imkey.device.call('cosCheckUpdate'))).toMatchObject({
      isSuccess: true,
      result: { latestCosVersion: '1.9.12', isLatest: false, isUpdateSuccess: true }
    })
    await configure({ failWallet: false })
    await page.locator('.tip1 button').click()
    await connect()
    await completed()
    expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  })
}
