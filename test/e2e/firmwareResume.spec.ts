import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

interface Control {
  mode?: 'normal' | 'bootloader'
  seid?: string
  offer?: boolean
  failNativeApps?: boolean
  failCosCheck?: boolean
  failIncompleteResponse?: boolean
  failAfterNativeSuccess?: boolean
  failBinding?: boolean
  failAddress?: boolean
  failBindingCheck?: boolean
  binding?: string
  delayNativeMs?: number
  delayAddressMs?: number
  initialCos?: string
  installedCos?: string
  latestCos?: string
  failCaptureRead?: 'once' | 'persistent' | false
  failWallet?: boolean
  failLifeTime?: boolean
  walletMissing?: boolean
  walletDataError?: boolean
  walletState?: string
  failBtcRead?: boolean
  injectNativeIncomplete?: boolean
  resetBindingOnce?: boolean
  postUpdateBinding?: string
  extraApplet?: boolean
  extraAppletUpdate?: boolean
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
interface Diagnostic {
  level: string
  event: string
  operationId?: string
  phase?: string
  stage?: string
  code?: string
  method?: string
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
const unexpectedCosUpdate: Control = {
  initialCos: '1.9.11',
  latestCos: '1.9.11',
  installedCos: '1.9.12'
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

async function expectMissingCodeDiagnostic(): Promise<void> {
  const file = path.join(directory, 'logs/manager.jsonl')
  const records = async (): Promise<Diagnostic[]> =>
    (await readFile(file, 'utf8'))
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))
  await expect.poll(records).toContainEqual(
    expect.objectContaining({
      level: 'warn',
      event: 'device.operation-failed',
      phase: 'failed',
      stage: 'load-code',
      code: 'BINDING_CODE_FILE_MISSING'
    })
  )
  const failure = (await records()).find(
    item => item.event === 'device.operation-failed' && item.code === 'BINDING_CODE_FILE_MISSING'
  )!
  expect(failure.operationId).toMatch(/^[a-z0-9-]{1,64}$/)
  await expect.poll(records).toContainEqual(
    expect.objectContaining({
      event: 'device.operation',
      operationId: failure.operationId,
      phase: 'finished'
    })
  )
  const operation = (await records()).filter(item => item.operationId === failure.operationId)
  const index = (event: string, method?: string) =>
    operation.findIndex(item => item.event === event && (!method || item.method === method))
  const failedAt = index('device.operation-failed')
  expect(index('device.call-queued', 'cosUpdate')).toBeGreaterThanOrEqual(0)
  expect(index('device.call-finished', 'cosUpdate')).toBeGreaterThan(
    index('device.call-queued', 'cosUpdate')
  )
  expect(index('binding.storage-finished', 'exportBindCode')).toBeGreaterThan(
    index('device.call-finished', 'cosUpdate')
  )
  expect(failedAt).toBeGreaterThan(index('binding.storage-finished', 'exportBindCode'))
  expect(operation.at(-1)).toMatchObject({ event: 'device.operation', phase: 'finished' })
  const log = await readFile(file, 'utf8')
  for (const secret of ['A2345678', 'xpub-resumed-wallet', 'RESUMEDEVICEA'])
    expect(log).not.toContain(secret)
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

test('a legacy ambiguous update checkpoint restores safely without reflashing', async () => {
  await launch({ mode: 'normal', initialCos: '1.9.11', latestCos: '1.9.12' })
  const recoveryDirectory = path.join(directory, 'firmware-recovery')
  await mkdir(recoveryDirectory, { recursive: true })
  const checkpointFile = path.join(recoveryDirectory, 'RESUMEDEVICEA.json')
  const checkpoint = {
    version: 1,
    seid: 'RESUMEDEVICEA',
    phase: 'update',
    needsBinding: true,
    expectedCos: '',
    expectedBle: ''
  }
  await writeFile(checkpointFile, JSON.stringify(checkpoint))
  await configure({ failAddress: true })
  await connect(true)
  await pending()
  const methods = (await calls()).map(call => call.method)
  expect(methods).toContain('cos_check_update')
  expect(methods).not.toContain('cos_update')
  expect(methods).not.toContain('bind_acquire')
  expect(methods).toContain('register_address')
  expect((await state()).physicalWrites).toBe(0)
  expect(JSON.parse(await readFile(checkpointFile, 'utf8')).phase).not.toBe('complete')
  await configure({ failAddress: false })
  await retry()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).map(call => call.method)).not.toContain('cos_update')
  expect((await state()).physicalWrites).toBe(0)
  await expect.poll(() => readdir(recoveryDirectory)).toEqual([])
  const marker = 'imkey.firmware-confirmation.v1.RESUMEDEVICEA'
  expect(await page.evaluate(key => localStorage.getItem(key), marker)).not.toBeNull()
  await reopen()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('firmware-confirmation')).toContainText(
    'The result of a previous firmware upgrade could not be confirmed'
  )
  await expect(page.getByTestId('firmware-confirmation')).toContainText(
    'COS and Bluetooth versions'
  )
  await page.locator('.routerBar li').nth(0).click()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('firmware-confirmation')).toBeVisible()
  await expect(page.getByTestId('firmware-confirmation-button')).toBeEnabled()
  await page.getByTestId('firmware-confirmation-button').click()
  await expect(page.getByTestId('firmware-confirmation')).toHaveCount(0)
  expect(await page.evaluate(key => localStorage.getItem(key), marker)).toBeNull()
  await reopen()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('device-info-card')).toContainText('SN-RESUME')
  await expect(page.getByTestId('firmware-confirmation')).toHaveCount(0)
  expect((await calls()).map(call => call.method)).not.toContain('cos_update')
})

test('an unavailable server check preserves an ambiguous checkpoint until it can be checked', async () => {
  await launch({ mode: 'normal', failCosCheck: true })
  const recoveryDirectory = path.join(directory, 'firmware-recovery')
  await mkdir(recoveryDirectory, { recursive: true })
  const file = path.join(recoveryDirectory, 'RESUMEDEVICEA.json')
  const checkpoint = {
    version: 1,
    seid: 'RESUMEDEVICEA',
    phase: 'update',
    needsBinding: true,
    expectedCos: '',
    expectedBle: ''
  }
  await writeFile(file, JSON.stringify(checkpoint))
  await connect(true)
  await expect(page.locator('.tip1')).toBeVisible()
  expect(JSON.parse(await readFile(file, 'utf8'))).toEqual(checkpoint)
  expect((await calls()).map(call => call.method)).not.toContain('cos_update')
  expect((await state()).physicalWrites).toBe(0)
  await configure({ failCosCheck: false })
  await page.locator('.tip1 button').click()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await state()).physicalWrites).toBe(0)
  expect((await calls()).map(call => call.method)).not.toContain('cos_update')
  await expect.poll(() => readdir(recoveryDirectory)).toEqual([])
})

test('another device can connect without consuming an ambiguous checkpoint', async () => {
  await launch({ mode: 'normal' })
  const recoveryDirectory = path.join(directory, 'firmware-recovery')
  await mkdir(recoveryDirectory, { recursive: true })
  const file = path.join(recoveryDirectory, 'RESUMEDEVICEA.json')
  const checkpoint = {
    version: 1,
    seid: 'RESUMEDEVICEA',
    phase: 'update',
    needsBinding: true,
    expectedCos: '',
    expectedBle: ''
  }
  await writeFile(file, JSON.stringify(checkpoint))
  await configure({ seid: 'RESUMEDEVICEB' })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  expect(JSON.parse(await readFile(file, 'utf8'))).toEqual(checkpoint)
  expect((await state('RESUMEDEVICEB')).physicalWrites).toBe(0)
  const replacement = (await calls()).filter(call => call.seid === 'RESUMEDEVICEB')
  expect(replacement.map(call => call.method)).not.toContain('cos_update')
  expect(replacement.map(call => call.method)).not.toContain('register_address')

  await configure({ seid: 'RESUMEDEVICEA' })
  await reopen()
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await state('RESUMEDEVICEA')).physicalWrites).toBe(0)
  expect((await calls()).map(call => call.method)).not.toContain('cos_update')
  await expect.poll(() => readdir(recoveryDirectory)).toEqual([])
})

for (const fault of ['beforeNativeWrite', 'afterNativeSuccess'] as const) {
  test(`an incomplete response ${fault} resumes without another COS write`, async () => {
    await startDeviceUpgrade(
      fault === 'beforeNativeWrite'
        ? { failIncompleteResponse: true }
        : { failAfterNativeSuccess: true }
    )
    const failure = page.locator('.alert3')
    await expect(failure).toContainText('Update failed')
    await expect(failure).toContainText('The firmware upgrade response was incomplete')
    await expect(failure).not.toContainText('missing field')
    await expect(failure).not.toContainText('USB connection or network connection')
    const file = path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json')
    expect(JSON.parse(await readFile(file, 'utf8')).phase).toBe('update')
    const beforeState = await state()
    expect(beforeState.physicalWrites).toBe(fault === 'beforeNativeWrite' ? 0 : 1)
    expect(beforeState.serverComplete).toBe(true)
    const beforeRestart = (await calls()).length
    await configure({
      failIncompleteResponse: false,
      failAfterNativeSuccess: false,
      failAddress: true
    })
    await application!.close()
    application = undefined
    await reopen()
    await connect()
    await pending()
    const resumed = (await calls()).slice(beforeRestart).map(call => call.method)
    expect(resumed).not.toContain('cos_update')
    expect(resumed).toContain('register_address')
    expect((await state()).physicalWrites).toBe(beforeState.physicalWrites)
    expect(JSON.parse(await readFile(file, 'utf8')).phase).not.toBe('complete')
    await configure({ failAddress: false })
    await retry()
    await expect(page.locator('.homeBox')).toBeVisible()
    expect((await state()).physicalWrites).toBe(beforeState.physicalWrites)
    expect((await state()).firmwareVersion).toBe(
      fault === 'beforeNativeWrite' ? '1.6.03' : '1.9.11'
    )
    expect((await calls()).slice(beforeRestart).map(call => call.method)).not.toContain(
      'cos_update'
    )
    await expect.poll(() => readdir(path.dirname(file))).toEqual([])
  })
}

test('same-session retry after a lost native success does not repeat the COS write', async () => {
  await startDeviceUpgrade({ failAfterNativeSuccess: true })
  await expect(page.locator('.alert3')).toBeVisible()
  const file = path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json')
  expect(JSON.parse(await readFile(file, 'utf8')).phase).toBe('update')
  expect((await state()).physicalWrites).toBe(1)
  await configure({ failAfterNativeSuccess: false })
  await retryDeviceUpgrade()
  await expect(page.locator('.alert2')).toBeVisible()
  await expect(page.locator('.alert2')).toContainText('Device recovery completed')
  await expect(page.locator('.alert2')).toContainText('Check the current firmware version')
  await expect(page.locator('.alert2')).not.toContainText('Update completed')
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  expect((await state()).physicalWrites).toBe(1)
  await expect.poll(() => readdir(path.dirname(file))).toEqual([])
})

test('a missing wallet prevents starting a new firmware upgrade', async () => {
  await startDeviceUpgrade({ walletMissing: true })
  await expect(page.locator('.alert3')).toContainText('No wallet has been created')
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(0)
  expect((await calls()).filter(call => call.method === 'register_address')).toHaveLength(0)
})

test('HID lifecycle failure does not block a connected wallet or firmware upgrade', async () => {
  await launch({ mode: 'normal', ...publishedMismatch, failLifeTime: true })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('device-info-card')).toContainText('SN-RESUME')
  await configure({ offer: true })
  await page.getByTestId('firmware-check-button').click()
  await page.getByTestId('firmware-upgrade-button').click()
  await page.locator('.alertBox button').click()
  await expect(page.locator('.alert2')).toBeVisible()
  const methods = (await calls()).map(call => call.method)
  expect(methods).not.toContain('get_life_time')
  expect(methods).toContain('btc_get_xpub')
  expect(methods).toContain('cos_update')
  expect(methods).toContain('register_address')
  expect((await state()).physicalWrites).toBe(1)
})

test('an ambiguous wallet command error keeps its cause and gives conditional reset guidance', async () => {
  await startDeviceUpgrade({ walletDataError: true })
  const failure = page.locator('.alert3')
  await expect(failure).toContainText('command data error')
  await expect(failure).toContainText('If the device was reset')
  await expect(failure).not.toContainText('The device wallet is not ready')
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(0)
})

test('a missing Bitcoin applet blocks a new firmware upgrade without starting a write', async () => {
  await startDeviceUpgrade({ failBtcRead: true })
  await expect(page.locator('.alert3')).toBeVisible()
  const methods = (await calls()).map(call => call.method)
  expect(methods).not.toContain('get_life_time')
  expect(methods).toContain('btc_get_xpub')
  expect(methods).not.toContain('cos_update')
  expect(methods).not.toContain('register_address')
})

test('an interrupted COS upgrade finishes native recovery but waits for a missing wallet before addresses', async () => {
  await launch({ mode: 'bootloader', ...publishedMismatch, walletMissing: true })
  await connect(true)
  await pending()
  await expect(page.locator('.tip3')).toContainText('No wallet has been created')
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  expect((await calls()).filter(call => call.method === 'register_address')).toHaveLength(0)
  const checkpoint = JSON.parse(
    await readFile(path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'), 'utf8')
  )
  expect(checkpoint.phase).toBe('apps')
  expect(checkpoint).not.toHaveProperty('pendingAddresses')
  await configure({ walletMissing: false })
  await retry()
  await completed()
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
})

test('a missing BTC applet during recovery retains the checkpoint after restoring other addresses', async () => {
  await launch({ mode: 'bootloader', ...publishedMismatch, failBtcRead: true })
  await connect(true)
  await pending()
  await expect(page.locator('.tip3')).toContainText('applet not exist')
  const methods = (await calls()).map(call => call.method)
  expect(methods).not.toContain('get_life_time')
  expect(methods).toContain('cos_update')
  expect(methods).toContain('register_address')
  expect(
    JSON.parse(await readFile(path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'), 'utf8'))
      .phase
  ).not.toBe('complete')
  expect((await state()).physicalWrites).toBe(1)
  await configure({ failBtcRead: false })
  await retry()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await state()).physicalWrites).toBe(1)
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  await expect.poll(() => readdir(path.join(directory, 'firmware-recovery'))).toEqual([])
})

async function prepareBleOnlyUpgrade(fault: Control = {}): Promise<void> {
  await launch({ mode: 'normal', ...unexpectedCosUpdate })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.getByTestId('device-info-card')).toContainText('SN-RESUME')
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.11')
  await configure({ offer: true, ...fault })
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
  expect(await page.evaluate(() => window.imkey.device.call('cosCheckUpdate'))).toMatchObject({
    isSuccess: true,
    result: { latestCosVersion: '1.9.11', latestBleVersion: '1.1.0', isUpdateSuccess: true }
  })
}

async function confirmBleOnlyUpgrade(): Promise<void> {
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alertBox')).toContainText('Bluetooth')
  await page.locator('.alertBox button').click()
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

test('an advertised BLE-only update restores binding and addresses when native COS actually changes', async () => {
  await prepareBleOnlyUpgrade()
  const before = (await calls()).length
  await confirmBleOnlyUpgrade()
  await expect(page.locator('.alert2')).toBeVisible()
  await completed()
  const upgraded = (await calls()).slice(before).map(call => call.method)
  expect(upgraded.filter(method => method === 'cos_update')).toHaveLength(1)
  expect(upgraded.filter(method => method === 'bind_acquire')).toHaveLength(1)
  expect(upgraded.indexOf('get_firmware_version')).toBeGreaterThan(upgraded.indexOf('cos_update'))
  expect(upgraded.indexOf('bind_acquire')).toBeGreaterThan(upgraded.indexOf('get_firmware_version'))
  expect(upgraded.indexOf('register_address')).toBeGreaterThan(upgraded.indexOf('bind_acquire'))
  expect(upgraded.lastIndexOf('btc_get_xpub')).toBeGreaterThan(upgraded.indexOf('register_address'))
  await page.locator('.alert2 button').click()
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.12')
  await page.screenshot({ path: test.info().outputPath('ble-only-actual-cos-recovered.png') })
})

for (const recoveryPath of ['direct-retry', 'reopen'] as const) {
  test(`an unexpected COS update during BLE-only upgrade resumes a failed rebind through ${recoveryPath}`, async () => {
    await prepareBleOnlyUpgrade({ failBinding: true })
    await confirmBleOnlyUpgrade()
    await expect(page.locator('.alert3')).toContainText('imkey_tsm_bind_acquire_fail')
    expect(await state()).toMatchObject({
      physicalWrites: 1,
      firmwareVersion: '1.9.12',
      binding: 'unbound',
      bindingAttempts: 1,
      addressWrites: 0
    })
    const saved = JSON.parse(
      await readFile(path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'), 'utf8')
    )
    expect(saved).toMatchObject({ phase: 'bind', needsBinding: true, expectedCos: '1.9.12' })
    expect(JSON.stringify(saved)).not.toContain('A2345678')
    const beforeRetry = (await calls()).length
    await configure({ failBinding: false })
    if (recoveryPath === 'direct-retry') {
      await retryDeviceUpgrade()
      await expect(page.locator('.alert2')).toBeVisible()
    } else {
      await reopen()
      await connect()
    }
    await completed()
    expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
    const resumed = (await calls()).slice(beforeRetry).map(call => call.method)
    expect(resumed.filter(method => method === 'bind_acquire')).toHaveLength(1)
    expect(resumed.indexOf('register_address')).toBeGreaterThan(resumed.indexOf('bind_acquire'))
    expect(resumed).not.toContain('get_life_time')
    expect(resumed.indexOf('btc_get_xpub')).toBeGreaterThan(resumed.indexOf('bind_acquire'))
    expect(resumed.indexOf('btc_get_xpub')).toBeLessThan(resumed.indexOf('register_address'))
    expect(resumed.lastIndexOf('btc_get_xpub')).toBeGreaterThan(resumed.indexOf('register_address'))
    await page.screenshot({
      path: test.info().outputPath(`ble-only-${recoveryPath}-completed.png`)
    })
  })
}

for (const rejection of ['missing-code', 'unknown-binding'] as const) {
  test(`an unexpected COS update during BLE-only upgrade cannot succeed with ${rejection}`, async () => {
    await prepareBleOnlyUpgrade(
      rejection === 'unknown-binding' ? { postUpdateBinding: 'unknown' } : {}
    )
    if (rejection === 'missing-code') await rm(path.join(directory, 'RESUMEDEVICEAbindCode.json'))
    const before = (await calls()).length
    await confirmBleOnlyUpgrade()
    if (rejection === 'missing-code') await expect(page.locator('.alert3')).toBeVisible()
    else await expect(page.locator('.device-recovery-dialog')).toBeVisible()
    await expect(page.locator('.alert2')).toHaveCount(0)
    expect(await state()).toMatchObject({ physicalWrites: 1, addressWrites: 0, bindingAttempts: 0 })
    const rejected = (await calls()).slice(before).map(call => call.method)
    expect(rejected.filter(method => method === 'cos_update')).toHaveLength(1)
    expect(rejected).not.toContain('bind_acquire')
    expect(rejected).not.toContain('register_address')
    expect(rejected).not.toContain('get_life_time')
    expect(rejected.indexOf('btc_get_xpub')).toBeGreaterThanOrEqual(0)
    expect(rejected.indexOf('btc_get_xpub')).toBeLessThan(rejected.indexOf('cos_update'))
    expect(await readdir(path.join(directory, 'firmware-recovery'))).toEqual(['RESUMEDEVICEA.json'])
    if (rejection === 'missing-code') {
      await expectMissingCodeDiagnostic()
      const dialog = await page.locator('.alertBox.alert3').boundingBox()
      const button = await page.locator('.alertBox.alert3 button').boundingBox()
      expect(dialog).not.toBeNull()
      expect(button).not.toBeNull()
      expect(button!.x).toBeGreaterThanOrEqual(dialog!.x)
      expect(button!.y).toBeGreaterThanOrEqual(dialog!.y)
      expect(button!.x + button!.width).toBeLessThanOrEqual(dialog!.x + dialog!.width)
      expect(button!.y + button!.height).toBeLessThanOrEqual(dialog!.y + dialog!.height)
    }
    await page.screenshot({ path: test.info().outputPath(`ble-only-${rejection}-denied.png`) })
    await page.evaluate(() => {
      window.location.hash = '#/home/welcomeHome'
    })
    await expect(page).not.toHaveURL(/#\/home/)
    await expect(page.locator('.homeBox')).toHaveCount(0)
  })
}

test('a legacy BLE-only verify checkpoint restores lost binding before wallet authorization', async () => {
  await prepareBleOnlyUpgrade({ failCaptureRead: 'persistent' })
  await confirmBleOnlyUpgrade()
  await expect(page.locator('.alert3')).toBeVisible()
  expect(await state()).toMatchObject({ physicalWrites: 1, binding: 'unbound' })
  await application!.close()
  application = undefined
  await writeFile(
    path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json'),
    JSON.stringify({
      version: 1,
      seid: 'RESUMEDEVICEA',
      phase: 'verify',
      needsBinding: false,
      expectedCos: '1.9.12',
      expectedBle: '1.1.0'
    })
  )
  const beforeRestart = (await calls()).length
  await configure({ failCaptureRead: false })
  await reopen()
  await connect()
  await completed()
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  const resumed = (await calls()).slice(beforeRestart).map(call => call.method)
  expect(resumed.indexOf('bind_acquire')).toBeGreaterThanOrEqual(0)
  expect(resumed.indexOf('register_address')).toBeGreaterThan(resumed.indexOf('bind_acquire'))
  expect(resumed).not.toContain('get_life_time')
  expect(resumed.indexOf('btc_get_xpub')).toBeGreaterThan(resumed.indexOf('bind_acquire'))
  expect(resumed.indexOf('btc_get_xpub')).toBeLessThan(resumed.indexOf('register_address'))
  expect(resumed.lastIndexOf('btc_get_xpub')).toBeGreaterThan(resumed.indexOf('register_address'))
  await page.screenshot({ path: test.info().outputPath('legacy-ble-only-verify-recovered.png') })
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

test('a failed address recovery remains a recovery on reconnect without reflashing', async () => {
  await launch({
    mode: 'bootloader',
    ...publishedMismatch,
    failAddress: true,
    delayAddressMs: 1500
  })
  await connect(true)
  await expect(page.locator('.tip4')).toContainText('firmware')
  await pending()
  await expect(page.locator('.tip3')).toContainText('Firmware upgrade')
  expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)

  await reopen()
  const beforeReconnect = (await calls()).length
  await connect()
  await expect(page.locator('.tip4')).toContainText('firmware')
  await pending()
  await expect(page.locator('.tip3')).toContainText('Firmware upgrade')
  const resumed = (await calls()).slice(beforeReconnect).map(call => call.method)
  expect(resumed).toContain('register_address')
  expect(resumed).not.toContain('cos_update')
})

test('a reset binding and missing wallet during address recovery can resume without reflashing', async () => {
  await startDeviceUpgrade({ failAddress: true })
  await expect(page.locator('.alert3')).toBeVisible()
  const file = path.join(directory, 'firmware-recovery/RESUMEDEVICEA.json')
  expect(JSON.parse(await readFile(file, 'utf8')).phase).toBe('restore')
  const before = (await calls()).length
  await configure({ failAddress: false, resetBindingOnce: true, walletMissing: true })
  await reopen()
  await connect()
  await pending()
  await expect(page.locator('.tip3')).toContainText('No wallet has been created')
  const pendingMethods = (await calls()).slice(before).map(call => call.method)
  expect(pendingMethods).toContain('bind_acquire')
  expect(pendingMethods).not.toContain('cos_update')
  expect(pendingMethods).not.toContain('register_address')
  expect((await state()).physicalWrites).toBe(1)
  expect(JSON.parse(await readFile(file, 'utf8')).phase).not.toBe('complete')
  await configure({ walletMissing: false })
  await retry()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await state()).physicalWrites).toBe(1)
  expect((await calls()).slice(before).map(call => call.method)).not.toContain('cos_update')
  await expect.poll(() => readdir(path.dirname(file))).toEqual([])
})

test('device-page recovery no longer promises another restart', async () => {
  await startDeviceUpgrade({ failAddress: true, delayAddressMs: 1500 })
  const progress = page.locator('dialog.firmware-progress-dialog')
  await expect(progress).toHaveAttribute('data-phase', 'restore')
  await expect(progress).toContainText('Do not disconnect the USB cable')
  await expect(progress).not.toContainText('automatically restart')
  await expect(page.locator('.alert3')).toBeVisible()
  await expect(page.locator('.alert3')).toContainText('Update failed')
})

test('app-page address recovery failure has a firmware upgrade title', async () => {
  await launch({ mode: 'normal', extraApplet: true, initialCos: '1.9.11', latestCos: '1.9.12' })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
  await expect(applet.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
  await configure({ injectNativeIncomplete: true, failAddress: true })
  await applet.getByRole('link', { name: 'Install', exact: true }).click()
  const failure = page.locator('.alert3')
  await expect(failure).toContainText('Update failed')
  await expect(failure).toContainText('imkey_address_registration_fail')
})

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
    await pending()
    await expect(page.locator('.homeBox')).toHaveCount(0)
    expect(await state()).toMatchObject({
      physicalWrites: 1,
      binding: 'bound_this',
      firmwareVersion: '1.9.11',
      serverComplete: true
    })
    expect((await calls()).map(call => call.method)).not.toContain('register_address')
    await page.screenshot({
      path: test.info().outputPath('wallet-read-denied.png'),
      fullPage: true
    })
    if (recoveryPath === 'reopen') {
      const beforeRestart = (await calls()).length
      await reopen()
      await connect()
      await pending()
      await expect(page.locator('.homeBox')).toHaveCount(0)
      const resumed = (await calls()).slice(beforeRestart).map(call => call.method)
      expect(resumed).toContain('cos_check_update')
      expect(resumed).toContain('bind_check')
      expect(resumed).not.toContain('get_life_time')
      expect(resumed).toContain('btc_get_xpub')
      expect(resumed.indexOf('bind_check')).toBeLessThan(resumed.indexOf('btc_get_xpub'))
      expect(resumed).not.toContain('cos_update')
      expect(resumed).not.toContain('register_address')
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
    await retry()
    await completed()
    expect((await calls()).filter(call => call.method === 'cos_update')).toHaveLength(1)
  })
}

for (const operation of ['install', 'update'] as const) {
  test(`app ${operation} succeeds when HID lifecycle reads fail but xpub is available`, async () => {
    await launch({
      mode: 'normal',
      extraApplet: true,
      extraAppletUpdate: operation === 'update',
      failLifeTime: true
    })
    await connect(true)
    await expect(page.locator('.homeBox')).toBeVisible()
    await page.locator('.routerBar li').nth(1).click()
    const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
    const action = applet.getByRole('link', {
      name: operation === 'update' ? 'Update' : 'Install',
      exact: true
    })
    await expect(action).toBeVisible()
    const before = (await calls()).length
    await action.click()
    await expect(applet.locator('.col')).toBeVisible()
    const expected = operation === 'update' ? 'app_update' : 'app_download'
    await expect
      .poll(async () => (await calls()).slice(before).map(call => call.method))
      .toContain(expected)
    const methods = (await calls()).slice(before).map(call => call.method)
    expect(methods).not.toContain('get_life_time')
    expect(methods).not.toContain('cos_update')
    expect(methods.indexOf('btc_get_xpub')).toBeLessThan(methods.indexOf(expected))
    expect(methods.lastIndexOf('btc_get_xpub')).toBeGreaterThan(methods.indexOf(expected))
    expect(methods.indexOf('register_address')).toBeGreaterThan(methods.indexOf(expected))
  })
}

for (const incomplete of [false, true]) {
  test(`app installation ${incomplete ? 'resumes a pending upgrade first' : 'does not start an available upgrade'}`, async () => {
    await launch({
      mode: 'normal',
      offer: true,
      extraApplet: true,
      initialCos: '1.9.11',
      latestCos: '1.9.12'
    })
    await connect(true)
    await expect(page.locator('.homeBox')).toBeVisible()
    await page.locator('.routerBar li').nth(1).click()
    const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
    await expect(applet.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
    if (incomplete) await configure({ injectNativeIncomplete: true })
    const before = (await calls()).length
    await applet.getByRole('link', { name: 'Install', exact: true }).click()
    await expect(applet.locator('.col')).toBeVisible()
    // The page can settle before the mock call log has been observed. Wait for
    // the actual download rather than sampling the log immediately.
    await expect
      .poll(async () => (await calls()).slice(before).map(call => call.method))
      .toContain('app_download')
    const methods = (await calls()).slice(before).map(call => call.method)
    expect(methods.filter(method => method === 'cos_update')).toHaveLength(incomplete ? 1 : 0)
    expect(methods).toContain('app_download')
    if (incomplete)
      expect(methods.indexOf('cos_update')).toBeLessThan(methods.indexOf('app_download'))
  })
}

test('app installation reconciles an ambiguous checkpoint without reflashing COS', async () => {
  await launch({ mode: 'normal', extraApplet: true, initialCos: '1.9.11', latestCos: '1.9.12' })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
  await expect(applet.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
  const recoveryDirectory = path.join(directory, 'firmware-recovery')
  await mkdir(recoveryDirectory, { recursive: true })
  await writeFile(
    path.join(recoveryDirectory, 'RESUMEDEVICEA.json'),
    JSON.stringify({
      version: 1,
      seid: 'RESUMEDEVICEA',
      phase: 'update',
      needsBinding: true,
      expectedCos: '',
      expectedBle: ''
    })
  )
  const before = (await calls()).length
  await applet.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(applet.locator('.col')).toBeVisible()
  await expect
    .poll(async () => (await calls()).slice(before).map(call => call.method))
    .toContain('app_download')
  const methods = (await calls()).slice(before).map(call => call.method)
  expect(methods).not.toContain('cos_update')
  expect(methods.indexOf('register_address')).toBeGreaterThanOrEqual(0)
  expect(methods.indexOf('register_address')).toBeLessThan(methods.indexOf('app_download'))
  expect((await state()).physicalWrites).toBe(0)
  await expect.poll(() => readdir(recoveryDirectory)).toEqual([])
})

test('the recovery retry banner is hidden while firmware is updating and shown after a failure', async () => {
  await launch({ mode: 'normal', extraApplet: true, initialCos: '1.9.11', latestCos: '1.9.12' })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
  await expect(applet.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
  await configure({ injectNativeIncomplete: true, failNativeApps: true, delayNativeMs: 2000 })
  const banner = page.getByTestId('firmware-recovery-entry')
  const progress = page.locator('dialog.firmware-progress-dialog')
  await applet.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(progress).toBeVisible()
  await expect(banner).toHaveCount(0)
  await expect(page.locator('.alert3')).toBeVisible()
  await expect(banner).toHaveCount(0)
  await page.locator('.alert3 button').click()
  await expect(banner).toBeVisible()
  await configure({ failNativeApps: false, failCosCheck: true })
  await banner.getByRole('button').click()
  await expect(page.locator('.dioBox')).toContainText('firmware_check_unavailable')
  await expect(banner).toHaveCount(0)
  await page.locator('.dioBox button').click()
  await expect(banner).toBeVisible()
  expect((await calls()).filter(call => call.method === 'app_download')).toHaveLength(0)
  await configure({ failCosCheck: false })
  await banner.getByRole('button').click()
  await expect(progress).toBeVisible()
  await expect(banner).toHaveCount(0)
  await expect(progress).toHaveCount(0)
  await expect(banner).toHaveCount(0)
  await expect(applet.locator('.col')).toBeVisible()
  const resumed = (await calls()).map(call => call.method)
  expect(resumed.filter(method => method === 'app_download')).toHaveLength(1)
  expect(resumed.lastIndexOf('check_update')).toBeLessThan(resumed.indexOf('app_download'))
})

test('a bound device with a missing local binding code cannot start native recovery', async () => {
  await launch({ mode: 'normal', extraApplet: true })
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  const applet = page.locator('.appItem').filter({ hasText: 'Polkadot' })
  await expect(applet.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
  await configure({ injectNativeIncomplete: true })
  await rm(path.join(directory, 'RESUMEDEVICEAbindCode.json'))
  const before = (await calls()).length
  await applet.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(page.locator('.dioBox')).toBeVisible()
  const attempted = (await calls()).slice(before).map(call => call.method)
  expect(attempted).toContain('bind_check')
  expect(attempted).not.toContain('cos_update')
  expect(attempted).not.toContain('app_download')
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.dioBox button').click()
  const banner = page.getByTestId('firmware-recovery-entry')
  await expect(banner).toBeVisible()
  await banner.getByRole('button').click()
  await expect(applet.locator('.col')).toBeVisible()
  expect((await calls()).filter(call => call.method === 'app_download')).toHaveLength(1)
})
