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
async function launch() {
  directory = await mkdtemp(path.join(os.tmpdir(), 'imkey-app-search-'))
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
  delete env.ELECTRON_RUN_AS_NODE
  Object.assign(env, {
    IMKEY_CONNECTOR_MOCK: path.resolve('test/fixtures/search-connector.cjs'),
    IMKEY_TEST_USER_DATA: directory,
    IMKEY_SEARCH_LOG: path.join(directory, 'search.log')
  })
  application = await electron.launch({ args: [path.resolve('.')], env })
  page = await application.firstWindow()
  await expect(page.locator('.appStart')).toBeVisible()
  await page.evaluate(() => window.imkey.device.call('importBindCode', 'A2345678'))
  await page.locator('.appStart button').click()
  await page.locator('.connectDevice button').first().click()
  await expect(page.locator('.homeBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  await expect(page.locator('.appItem')).toHaveCount(4)
}
async function loggedCalls() {
  return (await readFile(path.join(directory, 'search.log'), 'utf8'))
    .trim()
    .split('\n')
    .map(line => JSON.parse(line) as { method: string; name: string })
}
async function deleteSelected() {
  await page.evaluate(() => {
    type Exposed = {
      apps: unknown[] | { value: unknown[] }
      deleteApp(item: unknown, index: number): void
    }
    type VNode = { component?: { exposed?: Exposed; subTree: VNode }; children?: VNode[] }
    const root = (document.querySelector('#app') as unknown as { _vnode: VNode })._vnode
    function find(node: VNode): Exposed | undefined {
      if (node.component?.exposed?.deleteApp) return node.component.exposed
      if (node.component) {
        const result = find(node.component.subTree)
        if (result) return result
      }
      if (Array.isArray(node.children))
        for (const child of node.children) {
          const result = find(child)
          if (result) return result
        }
    }
    const manager = find(root)!
    const entries = Array.isArray(manager.apps) ? manager.apps : manager.apps.value
    manager.deleteApp(entries[1], 0)
  })
}
test.afterEach(async () => {
  await application?.close()
  if (directory) await rm(directory, { recursive: true, force: true })
})
test('literal app search installs the matching identity and survives route reentry', async () => {
  await launch()
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const search = page.locator('.searchBox input')
  await search.fill('polkadot')
  await expect(page.locator('.appItem')).toHaveCount(1)
  await page.locator('.appItem a').click()
  await expect(page.locator('.appItem .col')).toBeVisible()
  expect(await loggedCalls()).toContainEqual({ method: 'app_download', name: 'Polkadot' })
  await search.fill('[')
  await expect(page.locator('.appItem')).toHaveCount(1)
  await expect(page.locator('.appItem')).toContainText('Beta[+](x)/')
  for (const text of ['(', '+', '/', '[+](x)/']) {
    await search.fill(text)
    await expect(page.locator('.appItem')).toHaveCount(1)
  }
  await page.screenshot({ path: 'test-results/search-literal-identity.png', fullPage: true })
  await page.locator('.routerBar li').nth(2).click()
  await expect(page.locator('.equipmentBox')).toBeVisible()
  await page.locator('.routerBar li').nth(1).click()
  await page.locator('.searchBox input').fill('polkadot')
  await expect(page.locator('.appItem .col')).toBeVisible()
  await page.screenshot({ path: 'test-results/search-route-reentry.png', fullPage: true })
  expect(errors).toEqual([])
})
test('filtered delete failure keeps installed state and a retry deletes the same identity', async () => {
  await launch()
  const search = page.locator('.searchBox input')
  await search.fill('Polkadot')
  await page.locator('.appItem a').click()
  await expect(page.locator('.appItem .col')).toBeVisible()
  await deleteSelected()
  await expect(page.locator('.dioBox')).toBeVisible()
  await expect(page.locator('.appItem .col')).toBeVisible()
  await page.screenshot({ path: 'test-results/search-delete-failure.png', fullPage: true })
  await page.locator('.dioBox button').click()
  await deleteSelected()
  await expect(page.locator('.appItem .col')).toHaveCount(0)
  await expect(page.locator('.appItem a')).toBeVisible()
  expect(
    (await loggedCalls()).filter(entry => entry.method === 'app_delete').map(entry => entry.name)
  ).toEqual(['Polkadot', 'Polkadot'])
  await page.screenshot({ path: 'test-results/search-delete-retry.png', fullPage: true })
})
