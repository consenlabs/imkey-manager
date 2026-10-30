# 本地开发环境

## 准备与启动

本项目是 Electron 桌面应用，`npm run dev` 会启动 Vite 和桌面窗口。设备调用在独立 utilityProcess 中运行，本地开发不需要另外启动 HTTP/RPC 服务。

使用仓库 `.nvmrc` 中的 Node `22.21.0` 与 npm，按 `package-lock.json` 安装依赖：

```sh
nvm install
nvm use
npm ci
npm run dev
```

未使用 nvm 时，安装符合 `package.json#engines` 的 Node 版本后，直接执行最后两条命令。停止开发进程使用终端中的 Ctrl+C。

`npm ci` 的 postinstall 会显式下载 Electron 运行时，再准备应用原生依赖。首次安装需要访问 npm registry 与 Electron 的 GitHub 发布下载地址；后续安装可复用本机缓存。

macOS 需要根目录的 `connector.dylib`（当前同时支持 x64 与 arm64）；Windows 需要根目录的 `connector.dll`。根目录还需要维护者提供的 `key.env`；开发启动由主进程读取此文件，不使用 `.env` 替代它。保留现有密钥文件，不在文档、日志或版本库中记录其内容。当前原生库与打包目标支持 macOS 和 Windows。

首次准备环境可以运行：

```sh
npm run verify:connector
npm run typecheck
npm test
npm run test:connector
npm run test:e2e
```

`test:connector` 使用真实本机原生库，验证无设备时的初始化和结构化错误；不执行固件、应用或钱包写入。`test:e2e` 使用设备 mock 启动真实 Electron。没有连接 imKey 时，开发窗口仍应正常打开，设备连接会提示未连接；真机绑定、固件升级等需另外连接设备验收。

## macOS：启动停在原生模块加载

通过 AirDrop 等方式复制整个项目时，文件可能带有 `com.apple.quarantine`。Rollup、koffi 或 Electron 的原生文件因此可能卡在系统加载阶段，表现为 `npm run dev`、构建或测试打印命令后长期没有输出。

先停止本项目正在运行的命令，然后用 `npm ci` 按锁文件重新安装依赖，不复用传输来的 `node_modules`。可以用以下命令检查 connector 的隔离标记：

```sh
xattr -l connector.dylib
npm run verify:connector
```

仅在确认原生库来源可信且 SHA-256 校验通过后，清除此文件的传输标记并重启：

```sh
xattr -d com.apple.quarantine connector.dylib
npm run dev
```

此操作只处理项目中的 connector 文件。依赖安装成功后，无需更改系统安全设置。

## 其他启动排障

- 如果桌面窗口立即退出，先关闭已运行的 imKey Manager；应用使用单实例锁。
- 如果 Electron 被当作 Node 执行，运行 `unset ELECTRON_RUN_AS_NODE` 后重新启动。
- 直接在普通浏览器里打开 Vite 地址没有 Electron preload 提供的 `window.imkey`，应在桌面窗口中操作。
- 主进程诊断日志位于 Electron userData 目录中的 `logs/`，格式与脱敏规则见[诊断说明](diagnostics.md)。
