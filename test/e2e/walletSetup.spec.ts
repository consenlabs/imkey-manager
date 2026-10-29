import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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
    IMKEY_E2E_SETUP_FAILURE_FILE: path.join(directory, 'setup-failure'),
    IMKEY_E2E_SETUP_CONTROL_FILE: path.join(directory, 'setup-control.json'),
    IMKEY_E2E_LOG: path.join(directory, 'calls.log')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}

async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}

async function control(value: {
  delayMethod?: string
  delayMs?: number
  failMethod?: string
  seid?: string
  bindStatus?: string
}): Promise<void> {
  await writeFile(path.join(directory, 'setup-control.json'), JSON.stringify(value))
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

async function reachWalletInstructions(): Promise<void> {
  await connect()
  await expect(page.locator('.set1')).toBeVisible()
  await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
  const beforeInput = await calls()
  await page.locator('.set1 .nextBtn').click()
  await expect(page.locator('.set2')).toBeVisible()
  expect(await calls()).toEqual(beforeInput)
  await enterCode('.set2 input')
  await expect(page.locator('.set2 .verification-success')).toBeVisible()
  const beforeInstructions = await calls()
  await page.locator('.set2 .nextBtn').click()
  await expect(page.locator('.set3')).toBeVisible()
  expect(await calls()).toEqual(beforeInstructions)
}

const walletCheckCalls = ['device_connect', 'get_seid', 'bind_check', 'btc_get_xpub', 'get_seid']

async function confirmBackup(): Promise<void> {
  await expect(page.locator('.set4 .nextBtn')).toBeDisabled()
  const before = await calls()
  for (let index = 0; index < 3; index++)
    await page.locator('.set4 .step p').nth(index).locator('svg').click()
  await expect(page.locator('.set4 .nextBtn')).toBeEnabled()
  expect(await calls()).toEqual(before)
}

async function completeSetupSteps(): Promise<void> {
  await reachWalletInstructions()
  const before = await calls()
  await page.locator('.set3 .nextBtn').click()
  await expect(page.locator('.set4')).toBeVisible()
  expect((await calls()).slice(before.length)).toEqual(walletCheckCalls)
  await confirmBackup()
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('completing setup checks wallet readiness and enters home without prefetching addresses', async () => {
  await launch()
  await completeSetupSteps()
  const before = await calls()
  await page.locator('.set4 .nextBtn').click()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).slice(before.length)).toEqual(walletCheckCalls)
  expect((await calls()).filter(method => method === 'btc_get_xpub')).toHaveLength(2)
  expect(await calls()).not.toContain('get_address')
  await page.screenshot({ path: 'test-results/wallet-setup-complete.png' })
})

test('binding Previous uses the existing style and preserves a completed binding on return', async () => {
  await launch()
  await connect()
  await page.locator('.set1 .nextBtn').click()
  const previous = page.locator('.set2 .prevBtn')
  const next = page.locator('.set2 .nextBtn')
  await expect(previous).toBeVisible()
  const previousBox = (await previous.boundingBox())!
  const nextBox = (await next.boundingBox())!
  expect(previousBox.x + previousBox.width).toBeLessThan(nextBox.x)
  expect(previousBox.height).toBe(nextBox.height)
  await page.screenshot({ path: 'test-results/setup-binding-previous.png' })
  await previous.click()
  await expect(page.locator('.set1')).toBeVisible()
  expect((await calls()).filter(method => method === 'bind_display_code')).toHaveLength(2)
  await page.locator('.set1 .nextBtn').click()
  await enterCode('.set2 input')
  await expect(page.locator('.set2 .verification-success')).toBeVisible()
  await previous.click()
  await expect(page.locator('.set1')).toBeVisible()
  expect((await calls()).filter(method => method === 'bind_display_code')).toHaveLength(2)
  await page.locator('.set1 .nextBtn').click()
  await expect(page.locator('.set2 .verification-success')).toBeVisible()
  await next.click()
  await expect(page.locator('.set3')).toBeVisible()
})

for (const direction of ['previous', 'display'] as const) {
  test(`binding ${direction} failure can cancel in place and retry the original navigation`, async () => {
    await launch()
    await connect()
    await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
    await page.locator('.set1 .nextBtn').click()
    const current = '.set2'
    const destination = '.set1'
    const action = page.locator(`${current} .prevBtn`)
    const failurePath = path.join(directory, 'setup-failure')
    await writeFile(failurePath, direction === 'display' ? 'bind_display_code' : 'device_connect')
    await action.click()
    const dialog = page.locator('.device-recovery-dialog')
    await expect(dialog).toBeVisible()
    await expect(page.locator(current)).toBeVisible()
    await expect(page.locator(destination)).toHaveCount(0)
    if (direction !== 'display') await expect(dialog).toContainText('Connection failed')
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
    await expect(dialog).toBeHidden()
    await expect(page.locator(current)).toBeVisible()
    await expect(action).toBeEnabled()
    await action.click()
    await expect(dialog).toBeVisible()
    await rm(failurePath)
    await dialog.getByRole('button', { name: 'Retry', exact: true }).click()
    await expect(page.locator(destination)).toBeVisible()
    await expect(page.locator('.setup-error')).toHaveCount(0)
    await page.locator('.set1 .nextBtn').click()
    await enterCode('.set2 input')
    await expect(page.locator('.set2 .verification-success')).toBeVisible()
    await page.locator('.set2 .nextBtn').click()
    await expect(page.locator('.set3')).toBeVisible()
  })
}

test('wallet checks show loading, disable navigation and perform one binding check each', async () => {
  await launch()
  await reachWalletInstructions()
  await control({ delayMethod: 'btc_get_xpub', delayMs: 1600 })
  for (const step of ['.set3', '.set4']) {
    const before = await calls()
    const next = page.locator(`${step} .nextBtn`)
    await next.click()
    await expect(next).toBeDisabled()
    await expect(next).toHaveAttribute('aria-busy', 'true')
    await expect(next).toContainText(/checking wallet/i)
    await expect(next.locator('.setup-button-spinner')).toBeVisible()
    await expect(page.locator(`${step} .prevBtn`)).toBeDisabled()
    // A disabled button must not enqueue another check, even with repeated input.
    await next.evaluate(button => (button as HTMLButtonElement).click())
    if (step === '.set3') {
      await page.screenshot({ path: 'test-results/setup-wallet-check-loading.png' })
      await expect(page.locator('.set4')).toBeVisible()
      expect((await calls()).slice(before.length)).toEqual(walletCheckCalls)
      await confirmBackup()
    } else {
      await expect(page.locator('.homeBox')).toBeVisible()
      expect((await calls()).slice(before.length)).toEqual(walletCheckCalls)
    }
  }
})

test('local instruction navigation still validates identity before submitting a binding code', async () => {
  await launch()
  await connect()
  await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
  await control({ seid: 'REPLACEMENT-SEID' })
  const before = await calls()
  await page.locator('.set1 .nextBtn').click()
  await expect(page.locator('.set2')).toBeVisible()
  expect(await calls()).toEqual(before)
  await enterCode('.set2 input')
  await expect(page.locator('.device-changed-dialog')).toBeVisible()
  await expect(page.locator('.set2')).toBeVisible()
  expect((await calls()).slice(before.length)).toEqual(['device_connect', 'get_seid'])
})

for (const boundary of ['wallet', 'completion'] as const) {
  for (const change of ['identity', 'unbound', 'bound_other'] as const) {
    test(`${boundary} revalidates ${change} and blocks xpub access after a device change`, async () => {
      await launch()
      if (boundary === 'wallet') await reachWalletInstructions()
      else await completeSetupSteps()
      await control(change === 'identity' ? { seid: 'REPLACEMENT-SEID' } : { bindStatus: change })
      const before = await calls()
      const current = boundary === 'wallet' ? '.set3' : '.set4'
      await page.locator(`${current} .nextBtn`).click()
      await expect(page.locator('.device-changed-dialog')).toBeVisible()
      await expect(page.locator(current)).toBeVisible()
      await expect(page.locator('.homeBox')).toHaveCount(0)
      expect((await calls()).slice(before.length)).toEqual(
        change === 'identity'
          ? ['device_connect', 'get_seid']
          : ['device_connect', 'get_seid', 'bind_check']
      )
    })
  }
}

test('wallet instructions recheck a disconnected device and resume through the retry action', async () => {
  await launch()
  await reachWalletInstructions()
  await control({ failMethod: 'device_connect' })
  const before = await calls()
  await page.locator('.set3 .nextBtn').click()
  const dialog = page.locator('.device-recovery-dialog')
  await expect(dialog).toBeVisible()
  await expect(page.locator('.set3')).toBeVisible()
  await expect(page.locator('.set4')).toHaveCount(0)
  expect((await calls()).slice(before.length)).toEqual(['device_connect'])
  await control({})
  const beforeRetry = await calls()
  await dialog.getByRole('button', { name: /retry/i }).click()
  await expect(page.locator('.set4')).toBeVisible()
  expect((await calls()).slice(beforeRetry.length)).toEqual(walletCheckCalls)
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
