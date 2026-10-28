import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

let application: ElectronApplication
let page: Page
let directory: string

async function launch(scenario = 'unbound', failure = ''): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-wallet-setup-'))
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/wallet-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: scenario,
    IMKEY_E2E_WALLET_FAILURE: failure,
    IMKEY_E2E_LOG: path.join(directory, 'calls.log')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}

async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}

async function enterCode(selector: string): Promise<void> {
  for (const [index, character] of [...'A2345678'].entries()) {
    await page.locator(selector).nth(index).fill('')
    await page.locator(selector).nth(index).press(character)
  }
}

async function connect(): Promise<void> {
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
}

async function completeSetupSteps(): Promise<void> {
  await connect()
  await expect(page.locator('.set1')).toBeVisible()
  await expect(page.locator('.set1 .nextBtn')).not.toHaveClass(/noFinish/)
  await page.locator('.set1 .nextBtn').click()
  await enterCode('.set2 input')
  await expect(page.locator('.set2 .verification-success')).toBeVisible()
  await page.locator('.set2 .nextBtn').click()
  await expect(page.locator('.set3')).toBeVisible()
  await page.locator('.set3 .nextBtn').click()
  await expect(page.locator('.set4')).toBeVisible()
  for (let index = 0; index < 3; index++)
    await page.locator('.set4 .step p').nth(index).locator('svg').click()
  await expect(page.locator('.set4 .nextBtn')).not.toHaveClass(/noFinish/)
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('completing setup checks wallet readiness and enters home without prefetching addresses', async () => {
  await launch()
  await completeSetupSteps()
  await page.locator('.set4 .nextBtn').click()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).filter(method => method === 'btc_get_xpub')).toHaveLength(2)
  expect(await calls()).not.toContain('get_address')
  await page.screenshot({ path: 'test-results/wallet-setup-complete.png' })
})

for (const failure of ['not-ready', 'disconnected']) {
  test(`setup completion ${failure} stays in setup and can retry without prefetching addresses`, async () => {
    await launch('unbound', failure)
    await completeSetupSteps()
    await page.locator('.set4 .nextBtn').click()
    await expect(page.locator('.setup-error')).toBeVisible()
    await expect(page.locator('.set4')).toBeVisible()
    await expect(page.locator('.homeBox')).toHaveCount(0)
    expect(await calls()).toContain('wallet:' + failure)
    expect(await calls()).not.toContain('get_address')
    await page.screenshot({ path: `test-results/wallet-setup-${failure}.png` })
    await page.locator('.device-recovery-dialog').getByRole('button', { name: /retry/i }).click()
    await expect(page.locator('.homeBox')).toBeVisible()
    expect(await calls()).not.toContain('get_address')
  })
}

test('setup completion binding failure returns to connection before a fresh unverified home entry', async () => {
  await launch('unbound', 'binding-failure')
  await completeSetupSteps()
  await page.locator('.set4 .nextBtn').click()
  await expect(page.locator('.connectDevice')).toHaveCount(0)
  await expect(page.locator('.set4')).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
  const dialog = page.locator('.device-changed-dialog')
  await expect(dialog).toContainText('Device changed')
  await expect(dialog).toContainText(
    'The device or its binding has changed. Please reconnect the device.'
  )
  await expect(dialog.getByRole('button')).toHaveCount(1)
  await expect(dialog.getByRole('button', { name: /continue|retry|cancel|close/i })).toHaveCount(0)
  await expect(dialog.locator('.el-message-box__headerbtn')).toHaveCount(0)
  expect(await calls()).toContain('wallet:binding-failure')
  await dialog.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(page.locator('.connectDevice')).toBeVisible()
  await expect(page.locator('.set4')).toHaveCount(0)
  const before = await calls()
  const verificationMethods = ['device_secure_check', 'device_sn_check', 'get_sn']
  await page.locator('.connectDevice button').first().click()
  await expect(page.getByTestId('device-verification-card')).toHaveAttribute('data-status', 'idle')
  await expect(page.getByTestId('device-details-link')).toHaveCount(0)
  const after = await calls()
  for (const method of verificationMethods)
    expect(after.filter(value => value === method)).toEqual(
      before.filter(value => value === method)
    )
  expect(after).not.toContain('get_address')
})

for (const scenario of ['ready', 'bound-other']) {
  test(`${scenario} connection enters home without prefetching wallet addresses`, async () => {
    await launch(scenario)
    if (scenario === 'ready')
      await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
    await connect()
    if (scenario === 'bound-other') {
      await expect(page.locator('.tip5')).toBeVisible()
      await enterCode('.tip5 input')
    }
    await expect(page.locator('.homeBox')).toBeVisible()
    expect(await calls()).toContain('btc_get_xpub')
    expect(await calls()).not.toContain('get_address')
  })
}
