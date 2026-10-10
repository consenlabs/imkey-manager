# 架构与设备契约

## 进程边界

`src/main/index.ts` 创建主窗口和设备服务，窗口使用 `contextIsolation: true`、`nodeIntegration: false`、`sandbox: true`。窗口导航、新窗口和 webview 被限制；macOS 的 Cmd+A/C/V 与 Windows 关闭到托盘行为由主进程管理。生产 CSP 使用 `default-src 'self'`，脚本仅允许自身资源；Element Plus 的运行时样式允许内联样式，图片与字体允许所需的 data URL。开发构建为 Vite HMR 放开 WebSocket 与开发入口脚本。

`src/preload/index.ts` 通过 `contextBridge` 暴露 `window.imkey`，不暴露 `ipcRenderer`、任意通道、`remote` 或 Node API。Vue 页面通过这个对象调用 main；设备状态由 `src/renderer/store/device.ts` 管理（应用列表、COS/BLE 版本、绑定状态与升级标志），应用状态由 `src/renderer/store/app.ts` 管理（用户目录与钱包地址）；`store/index.ts` 仅统一导出。

`src/main/serviceClient.ts` 启动 `utilityProcess.fork(out/main/service.js)`，首条初始化消息传入 userData、connector 路径、平台和是否打包。后续请求为 `{ id, method, params }`，响应为 `{ id, result }`。主进程用请求 id 与 Map 关联响应，可同时等待多个请求；服务通过 `DeviceQueue` FIFO 串行执行设备操作。生产调用没有会打断固件升级的短超时。服务异常退出使所有挂起请求以错误结束，并自动重启服务。

设备 IPC 在转发前校验调用者是主窗口 webContents、方法位于白名单且参数形状合法。方法集合与参数唯一来源为 `src/shared/deviceContract.ts`，服务的 `Record<DeviceMethod, Handler>` 注册表复用该契约。

## preload API

设备方法、参数与结果类型来自 shared 契约；完整 TypeScript 接口见 `src/preload/index.ts`。

```ts
window.imkey.device.call<M extends DeviceMethod>(
  method: M,
  params?: DeviceParams[M]
): Promise<DeviceResult>

window.imkey.app.getVersion(): Promise<string>
window.imkey.app.getLocale(): Promise<string>
window.imkey.app.openExternal(url: string): Promise<void>
window.imkey.app.copyText(text: string): Promise<void>
window.imkey.app.isOnline(): Promise<boolean>

window.imkey.updater.check(): Promise<unknown>
window.imkey.updater.download(): Promise<unknown>
window.imkey.updater.quitAndInstall(): Promise<void>
window.imkey.updater.onMessage(cb: (value: unknown) => void): () => void
window.imkey.updater.onProgress(cb: (value: unknown) => void): () => void
```

`openExternal` 在主进程再次校验，只接受 HTTPS。`getLocale` 返回系统语言；渲染层保持旧规则，`zh-CN` 使用中文，其余使用 `en-US`。两种 updater 订阅返回取消函数，页面卸载时必须调用。下载百分比只更新界面；等待 `download()` 完成后才执行延迟安装。升级说明使用 JSON5 解析历史 `{id,info}` 数据，不执行字符串中的 JavaScript。

设备结果保持页面可消费的联合结构：

```ts
{ isSuccess: true, result }
{ isSuccess: false, result: string, code?: string }
```

钱包地址恢复写入失败会额外返回 `failed` 链集合；页面保留失败/待恢复状态，不把部分失败展示为完成。应用安装失败关闭 loading 并允许重试。

## connector 与绑定码

`src/service/connector/ConnectorClient.ts` 是唯一原生调用入口。`clear_err → call_imkey_api → get_last_err_message` 必须在同一线程同步执行，因为 connector 的 LAST_ERROR 是 thread_local；禁止 koffi async 调用。Windows 使用 `_win` 错误函数并传入空字符串参数。库加载失败上报 `{ message, libraryPath }`，主进程保留缺失文件、Win32 126、其他错误分支和 VC++ 下载按钮，所有设备调用返回结构化失败。

仅未打包应用允许通过 `IMKEY_CONNECTOR_MOCK=<JS模块路径>` 使用 mock；打包后此开关失效。测试中的临时 userData 隔离不会改变正式应用的数据路径。

`BindCodeStore` 在主进程调用设备服务获取 seid，文件保持 `${userData}/${seid}bindCode.json`。safeStorage 可用时写入 `{"version":2,"bindCode":"<base64密文>"}`；不可用时继续使用 `key.env` 中的旧密钥和带 IV 的 AES-256-CBC 格式。读入支持 v2、带 IV 的旧格式，以及无 IV 的最早格式；最早格式通过无盐、一轮 MD5 的 EVP_BytesToKey 推导 key/iv，再调用 `createDecipheriv`。成功读取旧格式且 safeStorage 可用时迁移至 v2。写入使用同目录临时文件与 rename，等待成功后才返回成功。

## 回归证据

`test/fixtures/golden-api.json` 在修改旧 API 前采集，固定旧实现的请求 hex 与响应解析结果。单测用它逐字节检查新 protobuf 编解码，并明确断言约定的缺陷修复差异。旧 API、worker 和临时生成器已清理；该 fixture 是历史基线，不能声称可从当前源码重新生成。

Vitest 同时覆盖绑定码三种格式与迁移、写失败、非主窗口/非法方法拒绝、并发响应关联、FIFO、服务异常退出与重启、打包 mock 禁用、有限 preload 订阅，以及无 8081/DApp/签名入口。Playwright 在真实 Electron 中使用 mock 验证页面流程；真实 connector 冒烟验证 utilityProcess 可以加载本机原生库并返回无设备错误。这些验证不等同于真机固件升级或跨平台签名验收。

## 渲染层职责

四个设备业务页面保留原路由、DOM 与交互，页面仅组合展示组件；`imKeySetting` 保留未绑定、未激活和钱包未就绪入口。
`src/renderer/composables/` 的 strict TypeScript 组合式函数处理连接、绑定、应用管理、固件与地址恢复、设置及软件更新；
`src/renderer/components/` 用 `<script setup lang="ts">` 展示状态并发出 UI 操作。设备流程按 Promise 顺序调用，不用定时器错开请求。
复制提示、动画或轮询确需的定时器在卸载时清理，更新事件订阅也取消。语言包通过 vue-i18n composition 模式读取，
保留全局 `$t` 注入以兼容原页的模板文案。
