# 构建、安装路径与签名

## 版本与平台

Windows 与 macOS 的发布版本统一为 `2.2.0`，不带预发布后缀，两平台均从 `package.json` 读取版本号；Electron、electron-builder 与 koffi 使用精确版本号，依赖由 `package-lock.json` 锁定。Node 开发工具范围为 `^22.12.0 || ^24.0.0 || >=26.0.0`，与应用自带的 Electron Node 运行时分开管理。

2026-10-09 重构版本选择：Electron 最新稳定版 `44.7.0` 的发布资产没有 Windows ia32，而现有 connector.dll 是 i386。因此选择仍受支持、且提供 ia32 的最高稳定主版本 `43`，固定为 `43.7.9`。43.7.9 同时提供 macOS x64/arm64 产物，最低系统为 macOS Monterey 12、Windows 10。Electron 43 的官方 EOL 为 **2027-01-05**；后续升级需要先解决 Windows connector 的架构兼容。

核验来源：[44.7.0 发布资产](https://github.com/electron/electron/releases/expanded_assets/v44.7.0)、[43.7.9 发布资产](https://github.com/electron/electron/releases/expanded_assets/v43.7.9)、[43.7.9 系统要求](https://github.com/electron/electron/blob/v43.7.9/README.md)、[官方支持日程](https://releases.electronjs.org/schedule)。

Windows 安装器目标仍是 NSIS ia32，macOS connector.dylib 为 x64/arm64 universal。存在平台配置不代表已经在所有硬件上通过验证；实际安装包、UI、签名与原生测试结果以该次验收报告为准。

## 构建命令与离线机器

### 技术栈版本

以下版本对应当前 `package-lock.json`；打包机用 `npm ci` 安装，无需全局安装 Vue、TypeScript、Electron 或构建工具。更新依赖时以随代码交付的锁文件为准。

| 工具 / 技术栈 | 当前版本 / 要求 |
| --- | --- |
| Node.js | 建议固定 24 LTS；允许范围见上节 |
| npm | 使用所选 Node.js 随附的 npm，保留 `package-lock.json` |
| Electron | 43.7.9 |
| electron-builder / electron-vite | 26.15.3 / 5.0.0 |
| Vite / TypeScript | 7.3.7 / 5.9.3 |
| Vue / Pinia / Element Plus | 3.5.43 / 4.0.3 / 2.14.7 |
| koffi | 3.3.2 |
| @electron/notarize | 3.1.2 |
| Vitest / Playwright | 5.0.3 / 1.64.0 |
| protoc / protoc-gen-js（仅重新生成 proto 时） | 24.4 / 3.21.4-4 |

### 安装、验证与编译打包

在项目根目录执行。先用 `node --version`、`npm --version` 确认工具环境，准备根目录 connector 与 `key.env`，签名工具和凭据位置见下文。

```sh
npm ci
node scripts/prepare-native.cjs
npm test
npm run typecheck
npm run lint
npm run test:e2e
npm run test:connector
npm run build
```

`npm run build` 仍是对外打包入口，先执行 connector 摘要校验（不匹配仅警告），再执行 electron-vite 构建 `out/` 与 electron-builder。`npm run build:dir` 可只生成应用目录。构建输出进入 `build/`，这里也保留安装器源文件、图标和签名配置。

只编译 main / preload / service / renderer、不生成安装包，可执行 `npx electron-vite build`；日常开发启动命令为 `npm run dev`。完成上面的安装与验证后，按打包机平台执行：

```sh
# macOS：正式 Universal DMG + ZIP，沿用打包机签名与公证配置
npm run build -- --mac --publish never

# Windows：ia32 NSIS 安装包，硬件 key 签名沿用外部流程
npm run build -- --win --ia32 --publish never
```

macOS 未签名验收命令及产物架构检查见「Universal 产物与自动更新校验」。以上命令不上传产物；发布仍使用维护者既有流程。

保留专用打包机的离线流程和既有签名方式，不引入 CI。离线机器应预先准备锁文件对应的 npm 依赖、Electron 与 electron-builder 所需平台工具缓存，以及匹配目标平台的原生库；缺少缓存时构建工具仍可能尝试下载。`npm ci` 的 postinstall 仅为 `electron-builder install-app-deps`，不会 lint 或修改源码。

koffi 使用自身提供的原生二进制，通过 Node-API 与 Electron 集成，不需要原 ffi-napi/ref-napi 的 Electron ABI 重建流程。
准备阶段运行 `node scripts/prepare-native.cjs`，从已安装模块或 npm 离线缓存准备 darwin-x64、darwin-arm64、win32-ia32；
缓存不足时，在联网准备机显式使用 `node scripts/prepare-native.cjs --online`，把 `.local/koffi/3.3.2/` 随工具缓存带到离线机。
打包阶段不下载：afterPack 合并两份 Darwin 原生模块，并分别放入 `Contents/Resources/koffi/darwin_x64/` 与 `darwin_arm64/`；
两份 `koffi.node` 均是 x86_64+arm64 Universal。Windows 仅复制 ia32 模块到 `resources/koffi/win32_ia32/`。
这些位置由 koffi 官方 loader 的 resources 回退路径加载；包内排除 `node_modules/@koromix`，macOS 不包含 Linux/Windows 二进制，
Windows 包仍保留 win32_ia32。缺少准备缓存时明确失败，不在离线打包时偷偷联网。

## 资源位置

| 环境 | connector | key.env |
| --- | --- | --- |
| 开发 | 项目根 `connector.dylib` 或 `connector.dll` | 项目根 `key.env` |
| macOS 打包 | `Contents/Resources/connector.dylib` | `Contents/Resources/key.env` |
| Windows 打包 | 安装根 `connector.dll`，即 `resources` 的上一级 | 同一安装根 `key.env` |

主进程计算上述路径后传给服务；`key.env` 只由主进程通过 dotenv 加载。不要打印、提交或复制密钥内容到验收报告。

## 安装器、更新与签名

保持 `appId: com.imkey.imkey-manager`、`productName: imKey Manager` 和更新源 `https://files.imkey.im/downloads/imKeyManager`。NSIS 的非 one-click、per-machine、可提权、可选安装位置、桌面快捷方式与安装后运行配置保留。`build/installer.nsh` 的 VC++ redistributable 安装逻辑保持原样。

macOS 保留 hardened runtime、现有 entitlements 和 `build/notarize.js` afterSign hook。hook 使用精确依赖 `@electron/notarize@3.1.2` 的 `notarytool`，由既有签名环境提供 `TEAM_SHORT_NAME`、`APPLE_ID`、`APPLE_ID_PASSWORD`；这些凭据不属于源码或验证输出。显式 `identity: null` 的本地未签名构建跳过公证，用于检查应用目录；它不能作为签名/公证通过的证据。

本次重构没有授权发布。构建与本地验证不会构成上传授权，`publish` 更新源配置保持原样；专用机器若需隔离上传行为，可在既有打包入口追加 `--publish never`。上传、签名发布和更新源替换必须沿用维护者授权的发布流程。

## 打包机工具与凭据

建议专用打包机固定 Node 24 LTS，并使用锁文件安装；工具最低要求是 Node 22.12.0。
macOS 应使用满足 Electron 43 最低运行要求的 macOS 12 或更新系统，以及该系统可运行的 Xcode 13 或更新版本。
安装完整 Xcode、选择正确的 Developer 目录并接受许可，确认 `xcrun --find notarytool`、`xcrun --find stapler`、
`xcrun --find lipo` 可用；Command Line Tools 缺少公证工具时需切换到完整 Xcode。
这里使用官方 Electron 预编译包，不从源码编译 Electron；不需要重新构建旧 ffi 模块。
公证的 Xcode 要求见 [@electron/notarize 官方说明](https://github.com/electron/notarize/blob/main/README.md)。

`key.env` 放在项目根目录，由构建配置复制到上表规定位置。
公证仍沿用 `TEAM_SHORT_NAME`、`APPLE_ID`、`APPLE_ID_PASSWORD`，由打包机进程环境或项目根 `.env` 提供，
afterSign hook 通过 dotenv 加载；不把凭据内容写进文档、日志或仓库。
`identity=null` 跳过公证，既有证书签名与 entitlements 保持不变。
Windows 硬件 key 签名在专用打包机的外部流程完成；本地跨平台构建不会访问硬件 key。
签名后的发布需另行授权，未签名验收包不能替代签名/公证验证。

## Connector 与 protobuf 溯源

`connector.lock.json` 记录根目录两份原生库的 SHA-256、架构和来源。
当前 dylib 对应 imkey-core `80ddae20a2ece117bd443803e9bc6d5de519e575`，包含 x86_64 和 arm64；
DLL 为 PE32 i386，来源提交待确认，不以 dylib 提交推断 DLL 来源。
`npm run verify:connector` 严格检查，不匹配返回非零；`npm run build` 与 `build:dir`
使用 `--warn`，摘要变化或文件缺失仅警告，不额外阻断打包机操作（缺失的实际资源仍可能由 builder 拒绝）。

替换库后，先由维护者核实库的构建提交与架构，再运行 `shasum -a 256 connector.dll connector.dylib`、
`file connector.dll connector.dylib`，用结果更新 `connector.lock.json` 对应条目；来源未知时继续标记待确认。
随后运行严格校验、真实 connector 冒烟与目标平台打包冒烟，随代码审阅库和溯源记录；不要自动接受摘要变化。

protobuf 的固定提交、每个源文件摘要与生成器版本见 [SOURCE.md](../src/proto/SOURCE.md)。
旧 `protobuild.sh` 已由 `npm run gen:proto` 替代；脚本只读指定 imkey-core 提交，生成后执行项目格式化。
使用 `node scripts/gen-proto.mjs --check` 核验可复现结果，修改源版本后必须重跑黄金数据测试。
离线打包不需再生成 proto；再生成机器必须具备 protoc 和 `protoc-gen-js@3.21.4-4` 的本机插件缓存。

## 常见故障

- Windows 加载失败代码 126：检查安装根 connector.dll 是否存在、目标是否 ia32，以及 VC++ redistributable。
  沿用应用中的 VC++ 下载入口和 `build/installer.nsh` 安装逻辑，不把 DLL 移到 resources 内。
- `makensis` 退出 `-86`（Bad CPU type）：macOS 构建 Windows 安装器时检查工具架构与 Rosetta。
  使用 electron-builder 支持的工具集版本（本轮 Intel 旧工具可用 `--config.toolsets.nsis=1.2.1`），
  或回到现有 Windows 打包机；离线机器提前准备匹配工具缓存，不修改 NSIS 安装行为。
- `notarytool` 不存在或认证失败：检查 Xcode 选择及现有公证变量是否配置，不输出变量值；
  未签名验收使用 `--config.mac.identity=null --publish never`，正式包保持签名与公证流程。
- connector 摘要警告：按上节核对来源再更新记录；警告不表示新库已通过硬件兼容验证。

## Universal 产物与自动更新校验

`build.mac.target` 固定为 `dmg` 与 `zip`，两项 `arch` 都是 `universal`，不依赖打包机 CPU。
`mergeASARs: true` 合并两份应用代码；afterPack 先把 koffi Darwin 预编译文件变成两架构相同的 fat binary，
避免合并时出现独有或内容冲突的单架构原生文件。不通过 `--x64`/`--arm64` 把正式产物改成单架构。

```sh
npm ci
node scripts/prepare-native.cjs
npm run build -- --mac --publish never --config.mac.identity=null
```

默认产物在 `build/`：`mac-universal/imKey Manager.app`、Universal DMG、Universal `*-universal-mac.zip`、
对应 blockmap 以及正式渠道清单 `latest-mac.yml`。Windows 仍输出 ia32 NSIS 安装器、blockmap 与正式渠道清单 `latest.yml`。
`generateUpdatesFilesForAllChannels: true` 让构建器同时生成 beta 和 alpha 兼容清单，清单中的版本同样为 `2.2.0`。
发布时将 `beta-mac.yml` / `beta.yml` 与对应的正式渠道清单一起更新，使仍读取 beta 渠道的旧客户端也能发现本次正式版；
这些清单必须指向同一批正式安装包，不能继续沿用旧 beta 包的文件名、大小或摘要。
公证签名包与未签名本地验收包需分目录保存，不把本地验收的更新 metadata 上传。

```sh
TASK_APP='build/mac-universal/imKey Manager.app'
lipo -info "$TASK_APP/Contents/MacOS/imKey Manager"
find "$TASK_APP/Contents/Frameworks" -path '*/Contents/MacOS/*' -type f -exec lipo -info {} \;
lipo -info "$TASK_APP/Contents/Resources/connector.dylib"
find "$TASK_APP/Contents/Resources/koffi" -name koffi.node -exec lipo -info {} \;
```

主程序、所有 Helper、connector 和两份 koffi.node 应均显示 `x86_64 arm64`。
再解开更新 ZIP，重复相同检查，确认 ZIP 内的应用本身也是 Universal；仅文件名含 universal 不足以证明。
检查 `latest-mac.yml` 及兼容渠道清单的 ZIP 条目及 `path` 指向 Universal ZIP，`sha512`、`size` 与该 ZIP 一致；
DMG 主要用于手工安装，自动更新必须同时提供 ZIP 与 metadata。

同一份 Universal ZIP 包含两架构，Intel 与 Apple Silicon 安装均可使用。
当前 `electron-updater@6.8.9` 的 `MacUpdater.filterFilesForArch` 在无单独 arm64 命名条目时，
为 Intel、arm64 原生及 Rosetta 保留这一 Universal ZIP。
保持现有 appId、更新源与签名身份，正式自动更新沿用专用打包机的签名和公证流程；
本轮静态 metadata/ZIP 架构检查和打包态冒烟不代表执行过生产更新。

打包态原生冒烟通过 `IMKEY_PACKAGED_APP` 指定上述主可执行文件运行 Playwright `packaged.spec.ts`，
确认打包后开发 mock 开关无效、原生 connector 加载与无设备错误返回。
Apple Silicon 上还可使用 `arch -x86_64` 运行同一 Universal 可执行文件验证 Rosetta；
是否安装 Rosetta、实际执行结果与对应产物摘要写入该次报告，不据构建成功推断运行成功。
