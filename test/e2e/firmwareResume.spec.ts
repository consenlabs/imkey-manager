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
}
interface Call {
  seid: string
  method: string
}

let application: ElectronApplication | undefined
let page: Page
let directory: string
let control: Control

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
  return (await readFile(path.join(directory, 'calls.jsonl'), 'utf8'))
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

async function completed(): Promise<void> {
  await expect(page.locator('.homeBox')).toBeVisible()
  expect(await state()).toMatchObject({
    cosWritten: true,
    physicalWrites: 1,
    appsInstalled: true,
    serverComplete: true,
    bleDone: true,
    binding: 'bound_this',
    addressWrites: 1
  })
  expect((await calls()).map(call => call.method)).toContain('btc_get_xpub')
  await expect.poll(() => readdir(path.join(directory, 'firmware-recovery'))).toEqual([])
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
    await launch({ mode: 'bootloader', [failure]: true })
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
