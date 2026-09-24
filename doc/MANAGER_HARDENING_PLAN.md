# imKey Manager 安全收敛与 macOS 原生支持方案（待确认）

## 目标与边界

1. 关闭 Manager 的本地 HTTP/RPC 服务及 DApp 调用入口，使外部网页和本地进程无法经 Manager 请求交易签名或伪造设备端展示内容。
2. 保留 Manager 内部的设备管理能力，尤其是 COS 升级后的应用恢复、必要的绑定操作和地址注册。
3. 提供可在 Apple Silicon 上原生运行的 macOS 版本，消除系统的 Intel App 兼容性警告，并继续支持现有 Intel Mac 用户。
4. Manager 使用的 `connector` 来自独立的 `/Users/xiaoguang/Developer/work/imkey-core` 仓库。当前以该仓库的 `develop` 分支（`80ddae2`）构建；原随包二进制对应的具体源码提交未能确定。`token-core-monorepo/imkey-core` 不是 Manager 当时的打包来源。

## 已核实的现状

### 本地服务与绑定

- 原版 `src/main/index.js` 启动 worker；`src/worker/worker.js` 创建 Express 服务并监听 `8081`，其 `/api/imKey` 路由进入 `src/api/apirouter.js`。Router 包含签名与钱包相关方法。本分支已移除这条链路。
- Manager 的内部操作通过 Electron IPC 调用设备管理 API；关闭 `8081` 不要求关闭 IPC。
- imkey-core 的应用安装、更新和 COS 升级动作本身不以绑定为前置条件；但 Manager 在安装/更新后消费返回的 `address_register_list`，COS 升级后也会重新获取应用列表并注册地址。
- 多条链的地址生成依赖由 `bind_check` 加载的本地主机私钥或设备公钥。历史提交 `5c533b7` 曾修复 COS 升级后需重新绑定才能写地址的问题。因此本轮保留绑定检查、绑定码验证/存储和升级后重新绑定能力；设备激活、PIN 设置、创建/恢复钱包仍按此前确认从 Manager 中移除。

### 截图中的 macOS 提示

- 截图是 macOS 对依赖 Rosetta 的 Intel 专用 App 的兼容性通知，不是 8081 服务或设备绑定错误。
- 原随包的 `connector.dylib` 和生成目录中的 `dist/electron/connector.dylib` 均只有 `x86_64` 架构。本轮已将根目录（macOS 打包所用）的 `connector.dylib` 替换为同一源码构建的 `x86_64` + `arm64` Universal 库，生成目录仍是旧产物。`ffi-napi`、`ref-napi` 的当前安装包仍缺 macOS arm64 可用的原生模块。项目使用 Electron `11.3.0`，它本身已有 Apple Silicon 构建，但现有原生依赖和打包链尚未形成可用的 arm64 应用。
- Apple 已发布 [Rosetta 支持变更说明](https://developer.apple.com/cn/news/?id=w5ngl9k2)：macOS 26.4 起可能出现此类提示，通用 Rosetta 支持计划在 macOS 27 之后结束。因此仅隐藏提示或只调整打包标记都无法解决问题。

## 实施方案

### A. 移除外部调用面

1. 停止创建与监听 `8081` HTTP 服务；移除 Express/CORS/body-parser 的运行时依赖和 `/api/imKey` 路由接线。
2. 移除 DApp BrowserView、preload/Web3 provider 与对外钱包 API 的入口及不可再使用的路由、页面、测试和依赖。将 `walletapi` 收敛为 Manager 内部地址读取/注册所需的方法，移除不再可达的签名方法。
3. 收紧内部 IPC 的可调用消息列表：仅允许来自 Manager 自身窗口/worker、且业务确实需要的设备管理与升级消息；删除外部 RPC 透传和不再使用的签名消息。
4. 清理所有 `localhost:8081` 文案、配置和启动路径。发布说明明确告知旧版外部客户端的 8081 接口将停止工作。

### B. 保留升级后的恢复链路

1. 对已激活设备保留绑定检查、绑定码输入与本地绑定数据读写；未激活设备提示使用移动端完成激活和钱包初始化。移除现有 `imKeySetting` 的完整初始化路由，在连接流程中保留必要的绑定交互，避免升级恢复中断。
2. 保留应用安装和更新后按 `address_register_list` 注册地址的处理，以及 COS 升级后重新安装应用、恢复绑定和按已安装应用写入地址的处理。
3. 修正现有 `writeWalletAddress` 的错误传播：当前 worker 即使某链注册失败，末尾也可能覆盖为 `isSuccess: true`。按链记录错误并中止/提示，使“升级成功”和“地址恢复完成”状态可区分；避免把未完成恢复的设备呈现为完全成功。
4. 对 COS 更新与仅 BLE 更新分别回归，避免只更新 BLE 时触发不必要的重新绑定或地址注册。

### C. Apple Silicon 原生支持

1. 已从 `/Users/xiaoguang/Developer/work/imkey-core` 的 `develop` 分支构建 `aarch64-apple-darwin` 和 `x86_64-apple-darwin` 库并合并替换根目录 dylib；两架构公开函数导出与原库一致，均通过无设备的 FFI/错误码冒烟测试。protobuf 业务方法、设备通信和固件升级仍需真机回归，不能据此宣称完整兼容。
2. 为 macOS arm64 重新编译或升级 `ffi-napi`、`ref-napi` 及其他实际加载的 `.node` 模块，确保它们与目标 Electron 版本的 ABI 和架构匹配。检查 Electron 11 与目标 macOS 的运行情况；如不兼容，再升级 Electron，并同步替换已废弃的 `electron.remote` 调用。
3. 先分别构建并验证 x64 与 arm64 App，再合并为 Universal 发行包。`connector.dylib` 与所有加载的 `.node` 模块必须同时包含对应架构切片，或由打包规则为不同架构分别选择；只把主程序做成 Universal 不足以完成迁移。
4. 重新签名、公证和发布 macOS 包。核对自动更新是否能向现有 Intel 安装和 Apple Silicon 安装交付正确的新版本；Windows 构建保持独立。

## 验收

- 启动 Manager 后无进程监听 `8081`；从浏览器和本地客户端访问旧 `/api/imKey` 不再得到 RPC 响应；Manager 内部设备连接、应用管理与固件升级继续可用。
- 已激活设备的绑定检查和绑定码流程仍可用；应用安装/更新后按返回清单写入地址，COS 升级后应用、绑定和地址可恢复。模拟地址注册失败时界面展示失败或待恢复状态，不假报完成。
- Apple Silicon 上安装并启动正式签名包，主进程运行架构为 `arm64`，不再出现 Intel App 提示；USB 连接、绑定、COS 升级、应用安装/更新和地址注册通过真机回归。
- Intel Mac 上 x64 架构继续通过同一批关键功能。用 `lipo -info`/`file` 核查 App 可执行文件、`connector.dylib` 和所有加载的 `.node` 模块架构。
- 打包产物通过签名、公证与更新链路检查。无法在当前开发机完成的 Intel 真机与升级真机测试须在发布前的 CI/验收环境执行。

## 风险与依赖

- 已有 arm64 `connector.dylib`，但当前本机 arm64 Node 加载 `ffi-napi/ref-napi` 会因缺少原生构建而失败；仍需完成原生依赖适配及设备业务回归。
- Electron 11 与旧版原生模块的构建链较老，可能需要联动升级。应把依赖升级和业务链路回归视为同一发布门槛。
- 关闭 8081 是对外接口的有意不兼容变更；不提供兼容开关。
- 本分支已替换根目录 `connector.dylib`，移除 8081 HTTP/RPC 服务、DApp 页面数据、预加载/Web3 provider、签名 API 与 IPC 转发，并为内部设备 IPC 加入发送者校验和消息白名单；绑定流程未改动。`walletapi.js` 保留 Manager 地址读取和注册所需的方法；未被这些链路引用的交易签名 protobuf 及生成脚本条目已清理。安全测试、钱包地址 API 模拟回归和 JS 静态检查通过。唯一的 SCSS 标记实际只包含普通 CSS，现已改为 CSS 并移除 `node-sass`/`sass-loader`；隔离临时副本中的正式主进程和渲染进程 webpack 构建均通过。未经签名、公证且跳过原生依赖重建的 x64 目录包可生成；arm64 目录包仍卡在 `ffi-napi` 的原生模块重建，尚未完成整包与真机回归。当前工作区未提供打包配置引用的 `key.env`，发布时需由安全的构建流程提供。
