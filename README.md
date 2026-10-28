# imKey Manager

imKey 桌面设备管理工具，保留设备连接、绑定、钱包初始化、固件升级、应用管理与软件更新流程。Windows 与 macOS 当前统一版本为 `2.2.0`（无 beta 后缀）。

运行底座为 Electron 43、electron-vite、TypeScript；界面使用 Vue 3、Pinia、Vue Router 4、vue-i18n 与 Element Plus。原生设备调用由独立 `utilityProcess` 中的 koffi 封装同步执行，渲染进程通过有限 preload API 访问设备和应用能力。

## 环境与启动

使用 npm 与仓库中的 `package-lock.json`。Node 范围以 `package.json#engines` 为准：`^22.12.0 || ^24.0.0 || >=26.0.0`，即 Node 22.12 起的 22.x、24.x 或 26 及以上版本。使用受支持的 Node 版本。

仓库的 `.nvmrc` 固定开发版本为 Node `22.21.0`。已安装 nvm 时，先运行 `nvm install && nvm use`，再执行下面的安装与启动命令。平台依赖、验证步骤和 macOS 启动排障见[开发环境说明](docs/development.md)。

开发运行需要项目根目录中与平台匹配的 `connector.dylib` 或 `connector.dll`，以及由维护者配置的 `key.env`。不要把密钥文件写入日志或提交到仓库。

```sh
npm ci
npm run dev
```

Electron 固定为 `43.7.9`：重构时最新稳定版 `44.7.0` 未提供 Windows ia32 产物，43 仍提供 ia32，并支持 macOS x64/arm64。最低系统要求为 macOS Monterey 12、Windows 10；Electron 43 官方支持日程的 EOL 为 **2027-01-05**。版本依据及打包限制见[打包说明](docs/packaging.md)。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件安装；postinstall 安装 Electron 运行时与应用原生依赖，不改写源码 |
| `npm run dev` | electron-vite 开发环境与界面 HMR |
| `npm run build` | 校验 connector（不匹配仅警告）、构建 `out/` 并通过 electron-builder 打包 |
| `npm run build:dir` | 构建并生成未制作安装器的应用目录 |
| `npm test` | Vitest 单元、安全与旧实现黄金数据回归测试 |
| `npm run typecheck` | strict TypeScript 与 Vue SFC 类型检查 |
| `npm run lint` | main、preload、service、shared、renderer、common 与测试的 ESLint 检查 |
| `npm run test:e2e` | 先构建，再通过 Playwright 启动真实 Electron；使用设备 mock 与临时 userData |
| `npm run verify:connector` | 严格核验根目录 connector 与 `connector.lock.json` 的 SHA-256 |
| `npm run gen:proto` | 从固定 imkey-core 提交再生成 protobuf（见 `src/proto/SOURCE.md`） |
| `npm run test:connector` | 先构建，再运行真实 utilityProcess 与根目录 connector 的无设备冒烟 |

真实 connector 冒烟按顺序调用 `getUserPath`、`initImKeyCore`、`getSeid`，要求在无设备时返回结构化失败且服务不崩溃。该脚本不加载 `key.env`，不执行固件写入、应用安装或钱包初始化操作。E2E 的 mock 成功不能替代真实硬件验收。

## 目录

| 路径 | 内容 |
| --- | --- |
| `src/main/` | 窗口、托盘、更新、应用/设备 IPC、服务生命周期与绑定码存储 |
| `src/preload/` | `contextBridge` 暴露的 `window.imkey` |
| `src/service/` | utilityProcess 设备业务、FIFO 队列与同步 connector 封装 |
| `src/shared/deviceContract.ts` | 唯一设备方法集合、参数与结果契约 |
| `src/renderer/` | Vue 3 页面、Pinia 状态、路由与语言包 |
| `src/proto/` | 保持兼容的 protobuf 生成模块 |
| `test/` | Vitest、Playwright 与黄金 fixture |
| `scripts/connector-smoke.cjs` | 真实 connector 冒烟入口 |
| `electron.vite.config.ts` | main、service、preload 与 renderer 的构建入口 |
| `out/` | electron-vite 构建结果，不作为源码维护 |
| `build/` | 安装器、图标、签名配置及 electron-builder 输出 |

[历史加固计划](docs/MANAGER_HARDENING_PLAN.md)保留原问题分析；[protobuf 来源](src/proto/SOURCE.md)记录固定提交与源文件摘要。

[架构与 preload 契约](docs/architecture.md)说明进程边界与绑定码兼容；[打包说明](docs/packaging.md)说明安装路径、离线专用机和现有签名流程。HTTP/RPC 8081、DApp 与签名调用入口不在当前产品范围内。

[错误与诊断日志](docs/diagnostics.md)说明原生错误格式、日志位置、诊断 ID、脱敏规则与流程恢复。
