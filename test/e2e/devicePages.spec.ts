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
  upgradeRecovery?: boolean
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
async function checkFirmware(): Promise<void> {
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
}
async function closeError(): Promise<void> {
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('.el-message-box__headerbtn').click()
  await expect(dialog).not.toBeVisible()
}

async function expectChangedNotice(): Promise<void> {
  await expect(page.locator('.connectDevice')).toHaveCount(0)
  await expect(page.locator('.homeBox')).toBeVisible()
  const dialog = page.locator('.device-recovery-dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Device changed')
  await expect(dialog).toContainText(
    'The device or its binding has changed. Please reconnect the device.'
  )
  await expect(dialog.getByRole('button')).toHaveCount(1)
  await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: /continue|retry|cancel|close/i })).toHaveCount(0)
  await expect(dialog.locator('.el-message-box__headerbtn')).toHaveCount(0)
}

async function expectInitialLoading(): Promise<void> {
  await expect(page.getByTestId('device-page')).toBeVisible()
  await expect(page.locator('.status3')).toHaveCount(0)
  await expect(page.getByTestId('firmware-check-button')).toBeDisabled()
  await expect(page.getByTestId('firmware-check-button')).toHaveText('Check for updates')
  await expect(page.getByTestId('firmware-check-button')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByTestId('firmware-check-button').locator('.fa-spin')).toHaveCount(0)
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
  await expect(page.locator('.serial-number-row dd > span')).toHaveText('—')
  await expect(page.locator('.device-info-primary > div').last().locator('dd')).toHaveText('—')
  await expect(page.locator('.device-info-secondary > div').last().locator('dd')).toHaveText('—')
  await expect(page.locator('.exportBindCode')).toBeDisabled()
  await expect(page.getByTestId('secure-check-button')).toBeDisabled()
  await expect(page.getByTestId('secure-check-button')).toHaveText('Verify device')
  await expect(page.getByTestId('secure-check-button').locator('.fa-spin')).toHaveCount(0)
  expect(await count('device_secure_check')).toBe(0)
  expect(await count('device_sn_check')).toBe(0)
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

for (const gateMethod of ['device_connect', 'get_firmware_version']) {
  test(`initial device loading keeps the page visible with placeholders while ${gateMethod} is pending`, async () => {
    await launch()
    const before = await count(gateMethod)
    const firmwareChecks = await count('cos_check_update')
    await configure({ gate: true, gateMethod, update: true })
    await tab(2)
    await expect.poll(() => count(gateMethod)).toBe(before + 1)
    await expectInitialLoading()
    await page.screenshot({ path: `/private/tmp/imkey-initial-device-${gateMethod}.png` })
    await page.getByTestId('firmware-check-button').evaluate(button => {
      ;(button as HTMLButtonElement).click()
    })
    expect(await count(gateMethod)).toBe(before + 1)
    await configure({ gate: false })
    await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
    await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.05')
    await expect(page.locator('.device-info-secondary > div').last()).toContainText('3.0.03')
    await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
    await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
    await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
    expect(await count('cos_check_update')).toBe(firmwareChecks)
    await expect(page.locator('.exportBindCode')).toBeEnabled()
    await expect(page.getByTestId('secure-check-button')).toBeEnabled()
    expect(await count('device_secure_check')).toBe(0)
    expect(await count('device_sn_check')).toBe(0)
    expect(await count('cos_update')).toBe(0)
  })
}

test('cached manually checked firmware returns immediately without connecting or reading device data', async () => {
  await launch()
  await devicePage()
  await checkFirmware()
  const cached = await calls()
  await tab(0)
  await configure({ gate: true, gateMethod: 'device_connect' })
  await devicePage()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
  await expect(page.locator('.exportBindCode')).toBeEnabled()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  expect(await calls()).toEqual(cached)
  await configure({ gate: false })
})

test('leaving initial loading discards its late response before a fresh device page opens', async () => {
  await launch()
  const checksBeforeEntry = await count('cos_check_update')
  const readsBeforeEntry = await count('get_firmware_version')
  await configure({ gate: true, gateMethod: 'get_firmware_version' })
  await tab(2)
  await expect.poll(() => count('get_firmware_version')).toBe(readsBeforeEntry + 1)
  await expectInitialLoading()
  await tab(0)
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  await configure({ gate: false, sn: 'PAGE-SN-REFRESHED', firmware: '2.0.0' })
  await tab(2)
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-REFRESHED')
  await expect(page.getByTestId('device-info-card')).not.toContainText('PAGE-SN-A')
  await expect(page.locator('.device-info-primary > div').last()).toContainText('2.0.0')
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
  expect(await count('get_firmware_version')).toBe(readsBeforeEntry + 2)
  expect(await count('cos_check_update')).toBe(checksBeforeEntry)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('home entry is passive and repeated device visits read cached metadata without checking updates', async () => {
  await launch()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  expect(await count('device_connect')).toBe(1)
  expect(await count('device_secure_check')).toBe(0)
  expect(await count('device_sn_check')).toBe(0)
  const initialCalls = await calls()
  expect(initialCalls.at(-1)).toBe('btc_get_xpub')
  await expect(page.getByTestId('secure-check-button')).toHaveText('Verify device')
  await expect(page.locator('body')).not.toContainText('Identifying')
  await page.screenshot({ path: '/private/tmp/imkey-home-unverified.png' })
  const firmwareChecks = await count('cos_check_update')
  await devicePage()
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  expect(await count('cos_check_update')).toBe(firmwareChecks)
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  const methods = ['get_sn', 'get_ble_version', 'get_firmware_version', 'cos_check_update']
  const cached = await Promise.all(methods.map(count))
  await page.screenshot({ path: '/private/tmp/imkey-device-unverified.png' })
  const beforeHome = await calls()
  await tab(0)
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  await expect(page.getByTestId('secure-check-button')).toHaveText('Verify device')
  expect(await calls()).toEqual(beforeHome)
  await devicePage()
  expect(await Promise.all(methods.map(count))).toEqual(cached)
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  expect(await calls()).toEqual(beforeHome)
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
  const beforeHome = await calls()
  await tab(0)
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  expect(await count('device_secure_check')).toBe(1)
  expect(await count('device_sn_check')).toBe(1)
  expect(await calls()).toEqual(beforeHome)
})

test('device-page verification is reused when returning home without checking firmware', async () => {
  await launch()
  await devicePage()
  const firmwareChecks = await count('cos_check_update')
  await verify()
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  expect(await count('cos_check_update')).toBe(firmwareChecks)
  const beforeHome = await calls()
  await tab(0)
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  expect(await count('device_secure_check')).toBe(1)
  expect(await count('device_sn_check')).toBe(1)
  expect(await calls()).toEqual(beforeHome)
})

test('the first explicit firmware check is pending without a result until the response arrives', async () => {
  await launch()
  const firmwareChecks = await count('cos_check_update')
  await devicePage()
  expect(await count('cos_check_update')).toBe(firmwareChecks)
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  await configure({ gate: true, gateMethod: 'cos_check_update' })
  await page.getByTestId('firmware-check-button').click()
  await expect.poll(() => count('cos_check_update')).toBe(firmwareChecks + 1)
  await expect(page.getByTestId('firmware-check-button')).toBeDisabled()
  await expect(page.getByTestId('firmware-check-button')).toHaveText('Checking for updates…')
  await expect(page.getByTestId('firmware-check-button')).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await configure({ gate: false })
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
  expect(await count('device_secure_check')).toBe(0)
  expect(await count('device_sn_check')).toBe(0)
})

test('initial metadata failure retries device reads without starting a firmware check', async () => {
  await launch()
  const firmwareChecks = await count('cos_check_update')
  await configure({
    fault: { id: 'serial-failure', method: 'get_sn', error: 'serial_read_failed' }
  })
  await tab(2)
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('serial_read_failed')
  await expect(page.getByTestId('device-page')).toBeVisible()
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  expect(await count('cos_check_update')).toBe(firmwareChecks)
  await dialog.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  expect(await count('cos_check_update')).toBe(firmwareChecks)
})

for (const gateMethod of ['device_connect', 'cos_check_update']) {
  test(`firmware refresh keeps the current page and verification visible while ${gateMethod} is pending`, async () => {
    await launch()
    await devicePage()
    await checkFirmware()
    await verify()
    const firmwareText = await page.getByTestId('firmware-check-result').innerText()
    const firmwareChecks = await count('cos_check_update')
    const serialReads = await count('get_sn')
    const gatedCalls = await count(gateMethod)
    await configure({ gate: true, gateMethod })
    await page.getByTestId('firmware-check-button').evaluate(button => {
      const target = button as HTMLButtonElement
      target.click()
      target.click()
    })
    await expect.poll(() => count(gateMethod)).toBe(gatedCalls + 1)
    await expect(page.getByTestId('firmware-check-button')).toBeDisabled()
    await expect(page.getByTestId('firmware-check-button')).toHaveAttribute('aria-busy', 'true')
    await expect(page.getByTestId('firmware-check-button').locator('.fa-spin')).toBeVisible()
    await expect(page.getByTestId('firmware-check-result')).toHaveText(firmwareText)
    await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
    await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
    await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.05')
    await expect(page.locator('.device-info-secondary > div').last()).toContainText('3.0.03')
    await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
      'data-status',
      'success'
    )
    await expect(page.getByTestId('secure-check-result')).toContainText('2026-10-18')
    await expect(page.locator('.status3')).toHaveCount(0)
    await configure({ gate: false })
    await expect(page.getByTestId('firmware-check-button')).toBeEnabled()
    await expect(page.getByTestId('firmware-check-button')).toHaveAttribute('aria-busy', 'false')
    await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
    expect(await count('cos_check_update')).toBe(firmwareChecks + 1)
    expect(await count('get_sn')).toBe(serialReads)
  })
}

test('device verification preserves firmware information during its connection and server checks', async () => {
  await launch()
  await devicePage()
  await checkFirmware()
  const firmwareChecks = await count('cos_check_update')
  const firmwareText = await page.getByTestId('firmware-check-result').innerText()
  const connections = await count('device_connect')
  const snChecks = await count('device_sn_check')
  await configure({ gate: true, gateMethod: 'device_connect' })
  await page.getByTestId('secure-check-button').click()
  await expect.poll(() => count('device_connect')).toBe(connections + 1)
  await expect(page.getByTestId('secure-check-button')).toBeDisabled()
  await expect(page.getByTestId('secure-check-button')).toHaveText('Verifying…')
  await expect(page.getByTestId('secure-check-button').locator('.fa-spin')).toBeVisible()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('firmware-check-result')).toHaveText(firmwareText)
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  await configure({ gate: true, gateMethod: 'device_sn_check' })
  await expect.poll(() => count('device_sn_check')).toBe(snChecks + 1)
  await expect(page.getByTestId('firmware-check-result')).toHaveText(firmwareText)
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await configure({ gate: false })
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  await expect(page.getByTestId('firmware-check-result')).toHaveText(firmwareText)
  expect(await count('cos_check_update')).toBe(firmwareChecks)
})

test('a failed explicit firmware refresh preserves device and verification data and can retry', async () => {
  await launch()
  await devicePage()
  await verify()
  const serialReads = await count('get_sn')
  await configure({
    fault: { id: 'refresh-failure', method: 'cos_check_update', error: 'firmware_check_failed' }
  })
  await page.getByTestId('firmware-check-button').click()
  await expect(page.locator('.alert3')).toContainText('firmware_check_failed')
  await page.locator('.alert3 button').click()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  await expect(page.getByTestId('secure-check-result')).toContainText('2026-10-18')
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'failed')
  expect(await count('get_sn')).toBe(serialReads)
  const beforeReturn = await calls()
  await tab(0)
  await devicePage()
  expect(await calls()).toEqual(beforeReturn)
  await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
  // Failed update checks keep the confirmed metadata available for later retries.
  expect(await count('get_sn')).toBe(serialReads)
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
  await expectChangedNotice()
  await reconnectWithClearedVerification()
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

test('explicit firmware checking caches an upgrade that reads its binding code when started after returning', async () => {
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
  const cached = await calls()
  await tab(0)
  await devicePage()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
  expect(await calls()).toEqual(cached)
  expect(await count('cos_check_update')).toBe(checked + 1)
  expect(await count('cos_update')).toBe(0)
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert2')).toContainText('Update completed')
  const upgradeCalls = (await calls()).slice(cached.length)
  const preflight = upgradeCalls.slice(0, upgradeCalls.indexOf('cos_update'))
  expect(preflight).toEqual([
    'device_connect',
    'get_seid',
    'bind_check',
    'get_seid',
    'device_connect',
    'get_seid',
    'bind_check'
  ])
  expect(await count('bind_acquire')).toBe(1)
})

test('a failed firmware check stays incomplete until a successful explicit retry is cached', async () => {
  await launch()
  await devicePage()
  await configure({
    fault: { id: 'firmware-failure', method: 'cos_check_update', error: 'firmware_check_failed' }
  })
  await page.getByTestId('firmware-check-button').click()
  await expect(page.locator('.alert3')).toContainText('firmware_check_failed')
  await page.locator('.alert3 button').click()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.9.05')
  await expect(page.locator('.device-info-secondary > div').last()).toContainText('3.0.03')
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

test('firmware checking only reads device identity and versions without binding or authenticity checks', async () => {
  await launch()
  await devicePage()
  await configure({ binding: 'unbound' })
  const before = (await calls()).length
  await checkFirmware()
  expect((await calls()).slice(before)).toEqual([
    'device_connect',
    'get_seid',
    'get_ble_version',
    'get_firmware_version',
    'cos_check_update',
    'device_connect',
    'get_seid'
  ])
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

for (const { changed, action } of [
  { changed: 'identity', action: 'firmware' },
  { changed: 'identity', action: 'verification' },
  { changed: 'binding', action: 'verification' },
  { changed: 'read-failure', action: 'firmware' },
  { changed: 'disconnected', action: 'firmware' }
] as const) {
  test(`${changed} is ignored on cached page entry and detected by explicit ${action}`, async () => {
    await launch()
    await verify()
    await devicePage()
    await checkFirmware()
    await tab(0)
    await expect(page.getByTestId('secure-check-button')).toBeEnabled()
    const serialReads = await count('get_sn')
    const firmwareChecks = await count('cos_check_update')
    const cached = await calls()
    await configure(
      changed === 'identity'
        ? { seid: 'DEVICE-B', sn: 'PAGE-SN-B' }
        : changed === 'binding'
          ? { binding: 'unbound' }
          : changed === 'disconnected'
            ? {
                fault: {
                  id: 'disconnected',
                  method: 'device_connect',
                  error: 'device_not_connected'
                }
              }
            : { fault: { id: 'read-failure', method: 'get_seid', error: 'identity_read_failed' } }
    )
    await devicePage()
    await expect(page.getByTestId('firmware-check-result')).toHaveAttribute('data-status', 'latest')
    await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
      'data-status',
      'success'
    )
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(await calls()).toEqual(cached)
    await page
      .getByTestId(action === 'firmware' ? 'firmware-check-button' : 'secure-check-button')
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('PAGE-SN-A')
    await expect(
      page.locator('[data-testid="device-verification-card"][data-status="success"]')
    ).toHaveCount(0)
    expect(await count('get_sn')).toBe(serialReads)
    expect(await count('cos_check_update')).toBe(firmwareChecks)
    expect(await count('device_secure_check')).toBe(1)
    expect(await count('device_sn_check')).toBe(1)
    if (changed === 'identity' || changed === 'binding') await reconnectWithClearedVerification()
  })
}

async function reconnectWithClearedVerification(): Promise<void> {
  await expectChangedNotice()
  await page.locator('.device-recovery-dialog').getByRole('button', { name: 'Confirm' }).click()
  await expect(page.locator('.device-recovery-dialog')).not.toBeVisible()
  await expect(page.locator('.connectDevice')).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
  // Seed the now-connected device's binding file so this checks the direct home-entry path.
  await configure({ binding: 'bound_this' })
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  const methods = ['device_secure_check', 'device_sn_check', 'get_sn']
  const before = await Promise.all(methods.map(count))
  await page.locator('.connectDevice button').first().click()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  await expect(page.getByTestId('device-details-link')).toHaveCount(0)
  await expect(page.getByTestId('secure-check-result')).not.toContainText('2026-10-18')
  await expect(page.locator('body')).not.toContainText('PAGE-SN-A')
  expect(await Promise.all(methods.map(count))).toEqual(before)
}

for (const changed of ['identity', 'binding'] as const) {
  const replacement: Control =
    changed === 'identity' ? { seid: 'DEVICE-B', sn: 'PAGE-SN-B' } : { binding: 'unbound' }

  test(`${changed} change on app entry prompts before returning to connection without old verification`, async () => {
    await launch()
    await verify()
    await devicePage()
    await checkFirmware()
    await tab(0)
    const appReads = await count('check_update')
    const firmwareChecks = await count('cos_check_update')
    const connections = await count('device_connect')
    await configure(replacement)
    await tab(1)
    await expectChangedNotice()
    expect(await count('check_update')).toBe(appReads)
    expect(await count('cos_check_update')).toBe(firmwareChecks)
    expect(await count('app_download')).toBe(0)
    expect(await count('app_update')).toBe(0)
    if (changed === 'identity') {
      await page.keyboard.press('Escape')
      await page
        .locator('.el-overlay')
        .last()
        .click({ position: { x: 8, y: 8 } })
      await expectChangedNotice()
      await page.screenshot({
        path: '/private/tmp/imkey-device-changed-notice.png',
        animations: 'disabled'
      })
    }
    expect(await count('device_connect')).toBe(connections + 1)
    await reconnectWithClearedVerification()
  })

  test(`${changed} change blocks a cached firmware upgrade and clears the previous device state`, async () => {
    await launch({ update: true })
    await verify()
    await devicePage()
    await page.getByTestId('firmware-check-button').click()
    await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
    await tab(0)
    await devicePage()
    await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
    const upgrades = await count('cos_update')
    await configure(replacement)
    await page.getByTestId('firmware-upgrade-button').click()
    await expectChangedNotice()
    expect(await count('cos_update')).toBe(upgrades)
    await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
    await expect(page.getByTestId('firmware-check-result')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('PAGE-SN-A')
    await reconnectWithClearedVerification()
  })

  test(`${changed} change blocks exporting the previous device binding code`, async () => {
    await launch()
    await verify()
    await devicePage()
    await expect(page.locator('.exportBindCode')).toBeEnabled()
    await configure(replacement)
    await page.locator('.exportBindCode').click()
    await expectChangedNotice()
    await expect(page.locator('.alert4')).toHaveCount(0)
    await expect(page.locator('.codeBox')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('A2345678')
    await reconnectWithClearedVerification()
  })
}

test('binding code export remains available for the same bound device', async () => {
  await launch()
  await verify()
  await devicePage()
  const connections = await count('device_connect')
  await page.locator('.exportBindCode').click()
  await expect(page.locator('.alert4 .codeBox')).toHaveText('A2345678')
  expect(await count('device_connect')).toBeGreaterThan(connections)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.locator('.alert4 button').click()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute(
    'data-status',
    'success'
  )
})

for (const replaced of [false, true]) {
  test(`firmware retry after a failed rebind ${replaced ? 'rejects a replacement device' : 'accepts the same temporarily unbound device'}`, async () => {
    await launch({ update: true })
    await devicePage()
    await page.getByTestId('firmware-check-button').click()
    await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
    await configure({
      fault: { id: 'upgrade-rebind', method: 'bind_acquire', error: 'upgrade_rebind_failed' }
    })
    await page.getByTestId('firmware-upgrade-button').click()
    await expect(page.locator('.alert3')).toContainText('upgrade_rebind_failed')
    expect(await count('cos_update')).toBe(1)
    await page.locator('.alert3 button').click()
    const beforeRetry = (await calls()).length
    await configure({
      binding: 'unbound',
      upgradeRecovery: true,
      ...(replaced ? { seid: 'DEVICE-B' } : {}),
      fault: undefined
    })
    await page.getByTestId('firmware-upgrade-button').click()
    if (replaced) {
      await expectChangedNotice()
      expect(await count('cos_update')).toBe(1)
      expect(await count('bind_acquire')).toBe(1)
      await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
    } else {
      await expect(page.locator('.alert2')).toContainText('Update completed')
      expect(await count('cos_update')).toBe(2)
      expect(await count('bind_acquire')).toBe(2)
      expect(await count('register_address')).toBeGreaterThan(0)
    }
    expect(await count('get_upgrade_seid')).toBe(1)
    const retryCalls = (await calls()).slice(beforeRetry)
    const upgradeStart = retryCalls.indexOf('cos_update')
    const preflight = retryCalls.slice(0, upgradeStart < 0 ? undefined : upgradeStart)
    expect(preflight).toEqual(['device_connect', 'get_upgrade_seid'])
  })
}

test('a temporary connection failure preserves the firmware upgrade action for a successful retry', async () => {
  await launch({ update: true })
  await devicePage()
  await page.getByTestId('firmware-check-button').click()
  await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
  await configure({
    fault: { id: 'upgrade-connect', method: 'device_connect', error: 'device_not_connected' }
  })
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert3')).toBeVisible()
  expect(await count('cos_update')).toBe(0)
  await page.locator('.alert3 button').click()
  await expect(page.getByTestId('device-info-card')).toContainText('PAGE-SN-A')
  await expect(page.getByTestId('firmware-upgrade-button')).toBeEnabled()
  await page.getByTestId('firmware-upgrade-button').click()
  await expect(page.locator('.alert2')).toContainText('Update completed')
  expect(await count('cos_update')).toBe(1)
  expect(await count('bind_acquire')).toBe(1)
})
