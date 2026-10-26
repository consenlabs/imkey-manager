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
  gate?: boolean
  failConnect?: boolean
  addresses?: string[]
}
interface NativeCall {
  method: string
  name?: string
  chain?: string
  path?: string
  network?: string
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
async function calls(): Promise<NativeCall[]> {
  return (await readFile(path.join(directory, 'calls.jsonl'), 'utf8'))
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as NativeCall)
}
async function launch(): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-install-feedback-'))
  control = {}
  await configure({})
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/install-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_E2E_SCENARIO: 'ready',
    IMKEY_INSTALL_CONTROL: path.join(directory, 'control.json'),
    IMKEY_INSTALL_LOG: path.join(directory, 'calls.jsonl')
  })
  application = await electron.launch({ args: [path.resolve('.'), '--lang=en-US'], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  await expect(page.locator('.appItem')).toHaveCount(5)
  // The list is populated before the final firmware-version read has finished.
  await expect.poll(async () => (await calls()).at(-1)?.method).toBe('cos_check_update')
}
function applet(name: string) {
  return page.locator('.appItem').filter({ has: page.getByText(name, { exact: true }) })
}

test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})

test('install immediately shows busy feedback while connection is pending and ignores duplicate clicks', async () => {
  await launch()
  await configure({ gate: true })
  const before = (await calls()).length
  const selected = applet('Nervos')
  await selected.getByRole('link', { name: 'Install', exact: true }).evaluate(anchor => {
    ;(anchor as HTMLAnchorElement).click()
    ;(anchor as HTMLAnchorElement).click()
  })
  await expect(selected.locator('.fa-spin')).toBeVisible()
  await expect(page.getByRole('tooltip')).toContainText(/processing installation/i)
  await expect(selected.getByRole('link', { name: 'Install', exact: true })).toHaveCount(0)
  await expect
    .poll(async () =>
      (await calls()).slice(before).filter(call => call.method === 'device_connect')
    )
    .toHaveLength(1)
  expect((await calls()).slice(before).map(call => call.method)).not.toContain('app_download')
  await configure({ gate: false })
  await expect(selected.locator('.col')).toBeVisible()
  const completed = (await calls()).slice(before)
  expect(completed.filter(call => call.method === 'device_connect')).toHaveLength(1)
  expect(completed.filter(call => call.method === 'app_download')).toEqual([
    { method: 'app_download', name: 'Nervos' }
  ])
})

test('a failed pre-install connection removes busy feedback and allows an explicit retry', async () => {
  await launch()
  await configure({ gate: true })
  const before = (await calls()).length
  const selected = applet('Nervos')
  await selected.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(selected.locator('.fa-spin')).toBeVisible()
  await expect
    .poll(async () =>
      (await calls()).slice(before).filter(call => call.method === 'device_connect')
    )
    .toHaveLength(1)
  await configure({ gate: false, failConnect: true })
  await expect(page.locator('.dioBox')).toBeVisible()
  await expect(selected.locator('.fa-spin')).toHaveCount(0)
  await expect(selected.getByRole('link', { name: 'Install', exact: true })).toBeVisible()
  expect((await calls()).slice(before).map(call => call.method)).not.toContain('app_download')
  await configure({ failConnect: false })
  await page.locator('.dioBox button').click()
  await selected.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(selected.locator('.col')).toBeVisible()
  expect((await calls()).slice(before).filter(call => call.method === 'app_download')).toHaveLength(
    1
  )
})

for (const name of ['Nervos', 'Tezos', 'Bitcoin Cash', 'IMK']) {
  test(`connector ${name} address-list identity passes IPC without introducing address registration`, async () => {
    await launch()
    const before = (await calls()).length
    const selected = applet(name === 'IMK' ? 'imKey soft' : name)
    await selected.getByRole('link', { name: 'Install', exact: true }).click()
    await expect(selected.locator('.col')).toBeVisible()
    await expect(page.locator('.dioBox')).toHaveCount(0)
    const completed = (await calls()).slice(before)
    expect(completed.filter(call => call.method === 'app_download')).toEqual([
      { method: 'app_download', name }
    ])
    expect(completed.map(call => call.method)).toContain('bind_check')
    expect(completed.map(call => call.method)).not.toContain('register_address')
    expect(completed.map(call => call.method)).not.toContain('register_pub_key')
  })
}

test('a mixed connector address list retains the existing Ethereum registration parameters', async () => {
  await launch()
  await configure({ addresses: ['Ethereum', 'Nervos'] })
  const before = (await calls()).length
  const selected = applet('Nervos')
  await selected.getByRole('link', { name: 'Install', exact: true }).click()
  await expect(selected.locator('.col')).toBeVisible()
  const completed = (await calls()).slice(before)
  expect(completed.filter(call => call.method === 'register_address')).toEqual([
    {
      method: 'register_address',
      chain: 'ETHEREUM',
      path: "m/44'/60'/0'/0/0",
      network: ''
    }
  ])
  expect(completed.map(call => call.method)).not.toContain('register_pub_key')
})
