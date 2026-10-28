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
async function launch(scenario = 'ready', locale = 'en-US'): Promise<void> {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-flow-'))
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
  application = await electron.launch({ args: [path.resolve('.'), `--lang=${locale}`], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
}
async function calls(): Promise<string[]> {
  return (await readFile(path.join(directory, 'calls.log'), 'utf8')).trim().split('\n')
}
async function screenshot(name: string): Promise<void> {
  await page.screenshot({ path: test.info().outputPath(`flow-${name}.png`), fullPage: true })
}
async function enterCode(code: string): Promise<void> {
  for (const [index, character] of [...code].entries()) {
    await page.locator('.tip5 input').nth(index).fill('')
    await page.locator('.tip5 input').nth(index).press(character)
  }
}
async function connect(seed = true): Promise<void> {
  if (seed) await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
}
async function home(scenario = 'ready'): Promise<void> {
  await launch(scenario)
  await connect()
  await expect(page.locator('.homeBox')).toBeVisible()
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
}
async function settings(): Promise<void> {
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.locator('.equipmentBox')).toContainText('SN123')
}
async function invoke(method: string): Promise<void> {
  await page.locator('.routerView .container').evaluate((element, name) => {
    type Proxy = Record<string, (...args: unknown[]) => unknown> & {
      apps?: unknown[] | { value: unknown[] }
    }
    type VNode = {
      component?: { proxy: Proxy; exposed?: Proxy; subTree: VNode }
      children?: VNode[]
    }
    const root = (document.querySelector('#app') as unknown as { _vnode: VNode })._vnode
    function find(node: VNode): Proxy | undefined {
      if (node.component) {
        const target = node.component.exposed || node.component.proxy
        if (typeof target[name] === 'function') return target
        const nested = find(node.component.subTree)
        if (nested) return nested
      }
      if (Array.isArray(node.children))
        for (const child of node.children) {
          const nested = find(child)
          if (nested) return nested
        }
    }
    const target = find(root)
    if (!target) throw new Error(`Missing existing component method ${name}`)
    const apps = Array.isArray(target.apps) ? target.apps : target.apps?.value
    const args = name === 'deleteApp' ? [apps![0], 0] : []
    target[name](...args)
  }, method)
}
test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
test('a bound_this with local binding enters home directly', async () => {
  await home()
  expect(await calls()).not.toContain('bind_acquire')
  await screenshot('a-bound-this')
})
test('b bound_other rejects wrong binding code and accepts correct code', async () => {
  await launch('bound-other')
  await connect(false)
  await expect(page.locator('.tip5 input')).toHaveCount(8)
  await enterCode('B2345678')
  await expect(page.locator('.bindTip p')).toBeVisible()
  expect(await calls()).toContain('bind_acquire')
  await screenshot('b-wrong-code')
  await enterCode('A2345678')
  await expect(page.locator('.homeBox')).toBeVisible()
  await screenshot('b-bound-other-success')
})
for (const scenario of ['unbound', 'inactive', 'wallet-not-ready']) {
  test(`c ${scenario} preserves setup route`, async () => {
    await launch(scenario)
    await connect()
    await expect(page.locator('.setKeyPage')).toBeVisible()
    await expect(page).toHaveURL(/imKeySetting/)
    await screenshot(`c-${scenario}`)
  })
}
test('d install and existing delete method retain expected app states', async () => {
  await home()
  await page.locator('.routerBar li').nth(1).click()
  await page.locator('.appItem a').last().click()
  await expect(page.locator('.appItem .col')).toBeVisible()
  await screenshot('d-installed')
  await invoke('deleteApp')
  await expect(page.locator('.appItem .col')).toHaveCount(0)
  expect(await calls()).toContain('app_delete')
  await screenshot('d-deleted')
})
test('d app update succeeds', async () => {
  await home('app-update')
  await page.locator('.routerBar li').nth(1).click()
  await page.locator('.appItem a').last().click()
  await expect(page.locator('.appItem .col')).toBeVisible()
  expect(await calls()).toContain('app_update')
  await screenshot('d-updated')
})
test('d registration error permits successful retry', async () => {
  await home('register-failure')
  await page.locator('.routerBar li').nth(1).click()
  await page.locator('.appItem a').last().click()
  await expect(page.locator('.dioBox')).toBeVisible()
  await expect(page.locator('.appItem .col')).toHaveCount(0)
  await screenshot('d-registration-failed')
  await page.locator('.dioBox button').click()
  await page.locator('.appItem a').last().click()
  await expect(page.locator('.appItem .col')).toBeVisible()
  await screenshot('d-registration-retried')
})
for (const scenario of ['cos-success', 'cos-address-failure', 'ble-only']) {
  test(`${scenario === 'cos-success' ? 'e' : scenario === 'cos-address-failure' ? 'f' : 'g'} ${scenario} firmware flow`, async () => {
    await home(scenario)
    await settings()
    await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
    await page.getByTestId('firmware-check-button').click()
    await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
    const before = await calls()
    await page.getByTestId('firmware-upgrade-button').click()
    if (scenario === 'ble-only') await page.locator('.alertBox button').click()
    await expect(
      page.locator(scenario === 'cos-address-failure' ? '.alert3' : '.alert2')
    ).toBeVisible()
    const after = (await calls()).slice(before.length)
    expect(after).toContain('cos_update')
    if (scenario === 'ble-only') {
      expect(after).not.toContain('bind_acquire')
      expect(after).not.toContain('register_address')
    } else {
      expect(after).toContain('bind_acquire')
      expect(after).toContain('check_update')
      expect(after).toContain('register_address')
    }
    await screenshot(
      `${scenario === 'cos-success' ? 'e' : scenario === 'cos-address-failure' ? 'f' : 'g'}-${scenario}`
    )
    await page.locator('.alertBox button').click()
    if (scenario === 'cos-address-failure') {
      await expect(page.getByTestId('firmware-upgrade-button')).toBeVisible()
      await expect(page.locator('.device-info-primary > div').last()).toContainText('1.0.0')
      await screenshot('f-address-pending-recovery')
    } else if (scenario === 'cos-success') {
      await expect(page.locator('.device-info-primary > div').last()).toContainText('2.0.0')
      await expect(page.getByTestId('firmware-upgrade-button')).toHaveCount(0)
      await page.locator('.routerBar li').nth(1).click()
      await expect(page.locator('.appItem .col')).toBeVisible()
      await expect(page.locator('.appItem')).toContainText('Ethereum')
      await screenshot('e-restored-apps')
    } else {
      await expect(page.locator('.device-info-secondary > div').last()).toContainText('2.0.0')
      await screenshot('g-ble-updated')
    }
  })
}
test('h settings version, clipboard, external link and updater events', async () => {
  await home()
  await settings()
  await expect(page.locator('.device-info-primary > div').last()).toContainText('1.0.0')
  expect(await page.evaluate(() => window.imkey.app.getVersion())).toBe('2.1.7-beta')
  await application.evaluate(({ clipboard }) => {
    const record = globalThis as unknown as { copiedText?: string }
    clipboard.writeText = text => {
      record.copiedText = text
    }
  })
  await page.locator('.el-icon-copy-document').click()
  await expect
    .poll(() =>
      application.evaluate(() => (globalThis as unknown as { copiedText?: string }).copiedText)
    )
    .toBe('SN123')
  await application.evaluate(({ shell, app }) => {
    const record = globalThis as unknown as { externalUrl?: string }
    shell.openExternal = async url => {
      record.externalUrl = url
    }
    const nodeRequire = process
      .getBuiltinModule('module')
      .createRequire(app.getAppPath() + '/package.json')
    const updater = nodeRequire('electron-updater').autoUpdater
    updater.checkForUpdates = async () => {
      updater.emit('update-available', { version: '2.1.8', releaseNotes: '' })
      return null
    }
  })
  await page.locator('.routerBar li').first().click()
  await page.getByRole('button', { name: /Tokenlon/ }).click()
  await expect
    .poll(() =>
      application.evaluate(() => (globalThis as unknown as { externalUrl?: string }).externalUrl)
    )
    .toBe('https://tokenlon.im/?locale=en-us')
  await settings()
  await invoke('checkSoftUpdate')
  await expect(page.locator('.tip6')).toBeVisible()
  await page.locator('.tip6 button').click()
  await expect(page.locator('.status4AlertBox')).toContainText('2.1.8')
  await screenshot('h-settings-updater')
})
for (const locale of ['zh-CN', 'en-US']) {
  test(`i ${locale} key screens contain translated text`, async () => {
    await launch('bound-other', locale)
    await expect(page.locator('body')).not.toContainText('m.imKeyManager.')
    await screenshot(`i-${locale}-start`)
    await connect(false)
    await expect(page.locator('.tip5 input')).toHaveCount(8)
    await expect(page.locator('body')).not.toContainText('m.imKeyManager.')
    await screenshot(`i-${locale}-binding`)
    await enterCode('A2345678')
    await expect(page.locator('.homeBox')).toBeVisible()
    for (const [index, name] of ['home', 'manager', 'settings'].entries()) {
      await page.locator('.routerBar li').nth(index).click()
      if (index === 2) await expect(page.locator('.equipmentBox')).toContainText('SN123')
      await expect(page.locator('body')).not.toContainText('m.imKeyManager.')
      await screenshot(`i-${locale}-${name}`)
    }
    await expect(page.locator('.routerView h2')).toContainText(
      locale === 'zh-CN' ? '设备' : 'Device'
    )
  })
  test(`i ${locale} setup screen contains translated text`, async () => {
    await launch('unbound', locale)
    await connect()
    await expect(page.locator('.setKeyPage')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('m.imKeyManager.')
    await screenshot(`i-${locale}-setup`)
  })
}

test('initialization queues the first click and duplicate connection clicks run only once', async () => {
  await launch('slow-init')
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page
    .locator('.connectDevice button')
    .first()
    .evaluate(button => {
      const target = button as HTMLButtonElement
      target.click()
      target.click()
    })
  await expect(page.locator('.homeBox')).toBeVisible()
  await expect(page.getByTestId('secure-check-button')).toBeEnabled()
  const methods = await calls()
  // Home entry is passive; duplicate clicks must still start only one connection flow.
  expect(methods.filter(method => method === 'device_connect')).toHaveLength(1)
  await screenshot('connection-double-click')
})
