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
  binding?: 'unbound' | 'bound_this' | 'bound_other'
  generation?: number
  seid?: string
  sn?: string
  fault?: { id: string; method: string; kind: 'error' | 'crash' | 'hang'; error?: string }
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

async function launch(options: Control = {}, extraEnv: Record<string, string> = {}): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-recovery-'))
  control = {}
  await configure(options)
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/recovery-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: 'ready',
    IMKEY_E2E_CONTROL: path.join(directory, 'control.json'),
    IMKEY_E2E_LOG: path.join(directory, 'calls.log'),
    ...extraEnv
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}

async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}

async function serviceReadyCount(): Promise<number> {
  const entries = await readFile(path.join(directory, 'logs/manager.jsonl'), 'utf8')
  return entries
    .split('\n')
    .filter(Boolean)
    .filter(line => (JSON.parse(line) as { event: string }).event === 'service.ready').length
}

async function connect(seed = false): Promise<void> {
  if (await page.locator('.appStart').isVisible()) await page.locator('.appStart button').click()
  if (seed) {
    await expect.poll(calls).toContain('init_imkey_core_x')
    const imported = await page.evaluate(() =>
      window.imkey.device.call('importBindCode', 'A2345678')
    )
    expect(imported.isSuccess).toBe(true)
  }
  await page.locator('.connectDevice button').first().click()
}

async function enterCode(selector = '.set2 input'): Promise<void> {
  for (const [index, character] of [...'A2345678'].entries()) {
    await page.locator(selector).nth(index).fill('')
    await page.locator(selector).nth(index).press(character)
  }
}

async function setupPage(target: 2 | 3 | 4): Promise<void> {
  await connect()
  await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
  await page.locator('.set1 .nextBtn').click()
  await expect(page.locator('.set2')).toBeVisible()
  await expect(page.locator('.set2 input').first()).toBeEnabled()
  if (target === 2) return
  await enterCode()
  await expect(page.locator('.set2 .verification-success')).toBeVisible()
  await page.locator('.set2 .nextBtn').click()
  await expect(page.locator('.set3')).toBeVisible()
  if (target === 3) return
  await page.locator('.set3 .nextBtn').click()
  await expect(page.locator('.set4')).toBeVisible()
  for (let index = 0; index < 3; index++)
    await page.locator('.set4 .step p').nth(index).locator('svg').click()
}

async function recoverToConnection(): Promise<void> {
  const dialog = page.locator('.device-recovery-dialog')
  await expect(dialog).toBeVisible()
  await dialog
    .getByRole('button', { name: /back to connection|return to connect|reconnect/i })
    .click()
  await expect(page.locator('.connectDevice')).toBeVisible()
  await expect(page.locator('.device-recovery-dialog')).not.toBeVisible()
}

async function acknowledgeDeviceChanged(): Promise<void> {
  await expect(page.locator('.connectDevice')).toHaveCount(0)
  const dialog = page.locator('.device-changed-dialog')
  await expect(dialog).toContainText('Device changed')
  await expect(dialog).toContainText(
    'The device or its binding has changed. Please reconnect the device.'
  )
  await expect(dialog.getByRole('button')).toHaveCount(1)
  await expect(dialog.getByRole('button', { name: /continue|retry|cancel|close/i })).toHaveCount(0)
  await expect(dialog.locator('.el-message-box__headerbtn')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('.connectDevice')).toBeVisible()
  await expect(page.locator('.homeBox')).toHaveCount(0)
  await expect(page.locator('.setKeyPage')).toHaveCount(0)
}

async function retryRecovery(): Promise<void> {
  const dialog = page.locator('.device-recovery-dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /retry/i }).click()
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('failed binding-code generation disables Next and dialog retry generates the code', async () => {
  await launch({
    binding: 'unbound',
    fault: { id: 'display-error', method: 'bind_display_code', kind: 'error' }
  })
  await connect()
  await expect(page.locator('.set1 .nextBtn')).toBeDisabled()
  await expect(page.locator('.set2')).toHaveCount(0)
  await retryRecovery()
  await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
  await page.locator('.set1 .nextBtn').click()
  await expect(page.locator('.set2')).toBeVisible()
  expect((await calls()).filter(method => method === 'bind_display_code')).toHaveLength(2)
})

for (const step of [2, 3, 4] as const) {
  test(`device reset during setup page ${step} can return to connection and generate a new code`, async () => {
    await launch({ binding: 'unbound' })
    await setupPage(step)
    await configure({ binding: 'unbound', generation: 1 })
    if (step === 2) {
      await enterCode()
      await expect(page.locator('.set2 .codeTit')).toBeVisible()
      await page.locator('.set2 .nextBtn').click()
    } else await page.locator(`.set${step} .nextBtn`).click()
    if (step === 2) await recoverToConnection()
    else await acknowledgeDeviceChanged()
    await connect()
    await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
    expect((await calls()).filter(method => method === 'bind_display_code')).toHaveLength(2)
    await page.locator('.set1 .nextBtn').click()
    for (const input of await page.locator('.set2 input').all()) await expect(input).toHaveValue('')
    await enterCode()
    await expect(page.locator('.set2 .verification-success')).toBeVisible()
  })
}

test('an idle binding-code entry can return to connection with Escape after a device reset', async () => {
  await launch({ binding: 'unbound' })
  await setupPage(2)
  await configure({ binding: 'unbound', generation: 1 })
  await page.keyboard.press('Escape')
  await recoverToConnection()
  await connect()
  await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
  expect((await calls()).filter(method => method === 'bind_display_code')).toHaveLength(2)
})

test('bound device transient wallet error retries connection without entering setup', async () => {
  await launch({
    fault: { id: 'xpub-error', method: 'btc_get_xpub', kind: 'error' }
  })
  await connect(true)
  await expect(page.locator('.setKeyPage')).toHaveCount(0)
  await expect(page.locator('.tip1')).toBeVisible()
  await page.locator('.tip1 button').click()
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).filter(method => method === 'btc_get_xpub')).toHaveLength(2)
  expect(await calls()).not.toContain('bind_acquire')
})

for (const replacement of ['reset', 'different-device'] as const) {
  test(`home ${replacement} is discovered by the next business operation and can reconnect`, async () => {
    await launch()
    await connect(true)
    await expect(page.locator('.homeBox')).toBeVisible()
    await expect(page.getByTestId('secure-check-button')).toBeEnabled()
    const before = await calls()
    await configure({
      binding: 'unbound',
      generation: 1,
      ...(replacement === 'different-device' ? { seid: 'E2EREPLACEMENT', sn: 'SN456' } : {})
    })
    expect(await calls()).toEqual(before)
    await page.locator('.routerBar li').nth(1).click()
    await acknowledgeDeviceChanged()
    expect(await calls()).not.toContain('app_download')
    await connect()
    await expect(page.locator('.set1 .nextBtn')).toBeEnabled()
    expect(await calls()).toContain('bind_display_code')
  })
}

test('a worker crash recovers by user retry with core reinitialized', async () => {
  await launch()
  await connect(true)
  await expect(page.locator('.homeBox')).toBeVisible()
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  const connections = (await calls()).filter(method => method === 'device_connect').length
  await configure({ fault: { id: 'crash-once', method: 'device_connect', kind: 'crash' } })
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.locator('.device-recovery-dialog')).toBeVisible()
  await expect.poll(serviceReadyCount).toBe(2)
  expect((await calls()).filter(method => method === 'device_connect')).toHaveLength(
    connections + 1
  )
  await retryRecovery()
  await expect(page.locator('.equipmentBox')).toContainText('SN123')
  expect((await calls()).filter(method => method === 'init_imkey_core_x').length).toBeGreaterThan(1)
  expect(await calls()).not.toContain('imkey_core_not_initialized')
})

test('a hung native read releases the operation and retries only after explicit user action', async () => {
  await launch(
    { fault: { id: 'hang-once', method: 'btc_get_xpub', kind: 'hang' } },
    { IMKEY_TEST_DEVICE_TIMEOUT_MS: '500' }
  )
  await connect(true)
  await expect(page.locator('.device-recovery-dialog')).toBeVisible()
  await expect(page.locator('.device-recovery-dialog')).toContainText('stopped responding')
  await expect.poll(serviceReadyCount).toBe(2)
  expect((await calls()).filter(method => method === 'btc_get_xpub')).toHaveLength(1)
  await expect(page.locator('.homeBox')).toHaveCount(0)
  await retryRecovery()
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).filter(method => method === 'btc_get_xpub')).toHaveLength(2)
  expect((await calls()).filter(method => method === 'init_imkey_core_x')).toHaveLength(2)
  expect(await calls()).not.toContain('cos_update')
})

for (const fileState of ['deleted', 'corrupted'] as const) {
  for (const tab of [1, 2]) {
    test(`${fileState} local binding file can recover from ${tab === 1 ? 'management' : 'settings'} without restarting Manager`, async () => {
      await launch()
      await connect(true)
      await expect(page.locator('.homeBox')).toBeVisible()
      const bindingFiles = (await readdir(directory)).filter(name => name.endsWith('bindCode.json'))
      expect(bindingFiles).toHaveLength(1)
      const file = path.join(directory, bindingFiles[0])
      if (fileState === 'deleted') await rm(file)
      else await writeFile(file, '{invalid-json')
      await page.locator('.routerBar li').nth(tab).click()
      if (tab === 2) {
        await expect(page.getByTestId('device-info-card')).toContainText('SN123')
        await expect(page.locator('.device-recovery-dialog')).not.toBeVisible()
        await page.locator('.exportBindCode').click()
      }
      await recoverToConnection()
      await connect()
      await expect(page.locator('.tip5 input')).toHaveCount(8)
      await enterCode('.tip5 input')
      await expect(page.locator('.homeBox')).toBeVisible()
      const exported = await page.evaluate(() => window.imkey.device.call('exportBindCode'))
      expect(exported.isSuccess).toBe(true)
      expect((await calls()).filter(method => method === 'bind_acquire')).toHaveLength(1)
    })
  }
}

test('failed initial core initialization retries successfully on the next explicit connection', async () => {
  await launch({
    fault: {
      id: 'init-error',
      method: 'init_imkey_core_x',
      kind: 'error',
      error: 'imkey_core_init_failed'
    }
  })
  await page.locator('.appStart button').click()
  await expect(page.locator('.tip1')).toBeVisible()
  expect((await calls()).filter(method => method === 'init_imkey_core_x')).toHaveLength(1)
  await page.locator('.tip1 button').click()
  await connect()
  await expect(page.locator('.tip5 input')).toHaveCount(8)
  await enterCode('.tip5 input')
  await expect(page.locator('.homeBox')).toBeVisible()
  expect((await calls()).filter(method => method === 'init_imkey_core_x')).toHaveLength(2)
  expect(await calls()).not.toContain('imkey_core_not_initialized')
})
