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

async function home(scenario = 'ready'): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-secure-check-'))
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/e2e-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: scenario,
    IMKEY_E2E_LOG: path.join(directory, 'calls.log')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
  await expect(page.locator('.homeBox')).toBeVisible()
}

async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('home secure check reconnects through the existing device and displays success', async () => {
  await home()
  const before = (await calls()).length
  const button = page.getByTestId('secure-check-button')
  await button.click()
  await expect(page.getByTestId('secure-check-result')).toContainText(
    /设备校验通过|Device verification passed/i
  )
  await expect(button).toBeEnabled()
  expect((await calls()).slice(before)).toEqual(['device_connect', 'device_secure_check'])
})

test('home secure check displays the translated failure and permits retry', async () => {
  await home('secure-check-failure')
  const button = page.getByTestId('secure-check-button')
  await button.click()
  await expect(page.getByTestId('secure-check-result')).toContainText('device illegal')
  await expect(page.getByTestId('secure-check-result')).not.toContainText(
    'imkey_tsm_device_illegal'
  )
  await expect(button).toBeEnabled()
  expect((await calls()).filter(method => method === 'device_secure_check')).toHaveLength(1)
  await button.click()
  await expect(page.getByTestId('secure-check-result')).toContainText('device illegal')
  await expect(button).toBeEnabled()
  expect((await calls()).filter(method => method === 'device_secure_check')).toHaveLength(2)
})
