import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

interface Control {
  seid?: string
  sn?: string
  binding?: 'bound_this' | 'unbound' | 'bound_other'
  firmware?: string
  ble?: string
  update?: boolean
  snValid?: boolean
  activated?: boolean
  activatedAt?: string
  gate?: boolean
  gateMethod?: string
  fault?: { id: string; method: string; error?: string }
}
let application: ElectronApplication
let page: Page
let directory: string
let control: Control

async function configure(update: Partial<Control>): Promise<void> {
  control = { ...control, ...update }
  const file = path.join(directory, 'control.json')
  await writeFile(file + '.tmp', JSON.stringify(control))
  await rename(file + '.tmp', file)
}
async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).split('\n').filter(Boolean)
}
async function count(method: string): Promise<number> {
  return (await calls()).filter(call => call === method).length
}
async function launch(options: Control = {}): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-device-pages-'))
  control = {}
  await configure(options)
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  delete env.IMKEY_E2E_LOG
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/device-pages-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: 'ready',
    IMKEY_DEVICE_PAGES_CONTROL: path.join(directory, 'control.json'),
    IMKEY_DEVICE_PAGES_LOG: path.join(directory, 'calls.log')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await application.evaluate(({ BrowserWindow }) => {
    BrowserWindow.getAllWindows()[0].setContentSize(1440, 863)
  })
  await expect(page.locator('.appStart')).toBeVisible()
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
  await expect(page.getByTestId('device-verification-card')).toBeVisible()
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
}
async function tab(index: number): Promise<void> {
  await page.locator('.routerBar li').nth(index).click()
}
async function devicePage(): Promise<void> {
  await tab(2)
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(
    page.locator('[data-testid="firmware-check-button"], [data-testid="firmware-upgrade-button"]')
  ).toBeEnabled()
}
async function verify(): Promise<void> {
  await page.getByTestId('secure-check-button').click()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
}
async function closeError(): Promise<void> {
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('.el-message-box__headerbtn').click()
  await expect(dialog).not.toBeVisible()
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('entry is unverified and repeated page visits reuse device information and firmware results', async () => {
  await launch()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  expect(await count('device_secure_check')).toBe(0)
  expect(await count('device_sn_check')).toBe(0)
  await page.screenshot({ path: '/private/tmp/imkey-home-unverified.png' })
  await devicePage()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  const methods = ['get_sn', 'get_ble_version', 'get_firmware_version', 'cos_check_update']
  const cached = await Promise.all(methods.map(count))
  const identities = await count('get_seid')
  await page.screenshot({ path: '/private/tmp/imkey-device-unverified.png' })
  await tab(0)
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  await devicePage()
  expect(await Promise.all(methods.map(count))).toEqual(cached)
  expect(await count('get_seid')).toBeGreaterThan(identities)
  expect(await count('device_secure_check')).toBe(0)
  const before = await calls()
  await page.clock.install()
  await page.clock.fastForward(60000)
  expect(await calls()).toEqual(before)
})

test('home verification shares activation and genuine results with the device page', async () => {
  await launch()
  await verify()
  await expect(page.getByTestId('secure-check-result')).toContainText('2026-10-18')
  const activationLabel = await page.locator('.activation-row dt').boundingBox()
  const activationValue = await page.locator('.activation-row dd').boundingBox()
  expect(activationValue!.x - (activationLabel!.x + activationLabel!.width)).toBeGreaterThanOrEqual(
    8
  )
  await page.screenshot({ path: '/private/tmp/imkey-home-verified.png' })
  await page.getByTestId('device-details-link').click()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  await expect(page.getByTestId('secure-check-result')).toContainText('2026-10-18')
  await page.screenshot({ path: '/private/tmp/imkey-device-verified.png' })
  await tab(0)
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  expect(await count('device_secure_check')).toBe(1)
  expect(await count('device_sn_check')).toBe(1)
})

test('device-page verification is reused when returning home', async () => {
  await launch()
  await devicePage()
  await verify()
  await tab(0)
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  expect(await count('device_secure_check')).toBe(1)
  expect(await count('device_sn_check')).toBe(1)
})

test('a device replacement while verification is in progress cannot publish the old result', async () => {
  await launch({ gate: true, gateMethod: 'device_sn_check' })
  await page.getByTestId('secure-check-button').click()
  await expect.poll(() => count('device_sn_check')).toBe(1)
  await expect(page.getByTestId('secure-check-button')).toBeDisabled()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'checking'
  )
  await configure({ gate: false, seid: 'DEVICE-B', sn: 'PAGE-SN-B' })
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  await expect(page.getByTestId('device-details-link')).toHaveCount(0)
  await expect(page.getByTestId('secure-check-result')).not.toContainText('2026-10-18')
})

for (const method of ['device_secure_check', 'device_sn_check']) {
  test(`failed reverification at ${method} clears the previous success across pages`, async () => {
    await launch()
    await verify()
    await configure({ fault: { id: method, method, error: 'verification_test_failed' } })
    await page.getByTestId('secure-check-button').click()
    await expect(page.getByRole('dialog')).toContainText('verification_test_failed')
    await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
      'data-status',
      'idle'
    )
    await expect(page.getByTestId('secure-check-result')).not.toContainText('2026-10-18')
    await closeError()
    await devicePage()
    await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
      'data-status',
      'idle'
    )
    await expect(page.getByTestId('secure-check-result')).not.toContainText('2026-10-18')
  })
}

test('a missing first-activation date stays unknown instead of using verification time', async () => {
  await launch({ activatedAt: '' })
  await verify()
  await page.getByTestId('device-details-link').click()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('secure-check-result')).toContainText('—')
  await expect(page.getByTestId('secure-check-result')).not.toContainText('2026-10-18')
})

test('an unrecognized SN cannot produce a successful verification result', async () => {
  await launch({ snValid: false })
  await page.getByTestId('secure-check-button').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  await expect(page.getByTestId('device-details-link')).toHaveCount(0)
  expect(await count('device_secure_check')).toBe(1)
  expect(await count('device_sn_check')).toBe(1)
})

test('a genuine device with an inactive SN displays its actual activation status', async () => {
  await launch({ activated: false, activatedAt: '' })
  await verify()
  await expect(page.getByTestId('secure-check-result')).toContainText(/not activated/i)
  await expect(page.getByTestId('secure-check-result')).toContainText('—')
})

test('explicit firmware checking refreshes the cached result and exposes the upgrade action', async () => {
  await launch()
  await devicePage()
  const checked = await count('cos_check_update')
  const serialReads = await count('get_sn')
  await configure({ update: true })
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  expect(await count('cos_check_update')).toBe(checked + 1)
  expect(await count('get_sn')).toBe(serialReads)
  await page.screenshot({ path: '/private/tmp/imkey-device-update-available.png' })
  await tab(0)
  await devicePage()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  expect(await count('cos_check_update')).toBe(checked + 1)
  expect(await count('cos_update')).toBe(0)
})

test('a failed firmware check stays incomplete until a successful explicit retry is cached', async () => {
  await launch()
  await configure({
    fault: { id: 'firmware-failure', method: 'cos_check_update', error: 'firmware_check_failed' }
  })
  await tab(2)
  await expect(page.locator('.alert3')).toContainText('firmware_check_failed')
  await page.locator('.alert3 button').click()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'failed')
  await expect(page.getByTestId('firmware-check-result')).toContainText(/incomplete/i)
  await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
  const before = await count('cos_check_update')
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  expect(await count('cos_check_update')).toBe(before + 1)
  await tab(0)
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  await devicePage()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  expect(await count('cos_check_update')).toBe(before + 1)
})

for (const changed of ['identity', 'binding', 'read-failure'] as const) {
  test(`${changed} change invalidates old device and verification data on page entry`, async () => {
    await launch()
    await verify()
    await devicePage()
    await tab(0)
    await expect(page.getByTestId('secure-check-button')).toBeEnabled()
    const serialReads = await count('get_sn')
    const firmwareChecks = await count('cos_check_update')
    await configure(
      changed === 'identity'
        ? { seid: 'DEVICE-B', sn: 'PAGE-SN-B' }
        : changed === 'binding'
          ? { binding: 'unbound' }
          : { fault: { id: 'read-failure', method: 'get_seid', error: 'identity_read_failed' } }
    )
    await tab(2)
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('PAGE-SN-A')
    await expect(
      page.locator('[data-testid="device-verification-card"][data-status="success"]')
    ).toHaveCount(0)
    expect(await count('get_sn')).toBe(serialReads)
    expect(await count('cos_check_update')).toBe(firmwareChecks)
  })
}
