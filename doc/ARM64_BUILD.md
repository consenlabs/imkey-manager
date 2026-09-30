# macOS ARM64 开发与构建

Manager 的 Apple Silicon 运行链路包含 Electron、`ffi-napi`、顶层及嵌套的 `ref-napi` 和 `connector.dylib`。不能只替换 dylib 或 Electron 主程序。

## 环境

- Apple Silicon Mac，使用原生 ARM64 Node.js。验证环境为 macOS 27.0.1、Node.js 26.7.0、npm 自带的 node-gyp 12.4.0 和 Python 3.13。
- Xcode Command Line Tools、Python 3，以及带 node-gyp 10 或更新版本的 npm。脚本优先使用运行 npm 自带的 node-gyp；也可设置 `NODE_GYP_PATH` 指向新版 node-gyp 的 `bin/node-gyp.js`。
- 当前锁定依赖安装的是 Electron 11.3.0。脚本根据实际安装的 Electron 版本下载对应 ARM64 运行时及头文件。
- 根目录 `connector.dylib` 必须包含 ARM64。本分支使用 x86_64 + ARM64 Universal 库。
- 通过本地安全渠道提供 `key.env`；签名、公证凭据不放入 Git，`.p8` 已被忽略。

## 本地启动

在当前项目工作目录中安装依赖，避免安装期间旧 postinstall 自动重建原生库或改写源代码：

```bash
npm install --ignore-scripts --package-lock=false
npm run dev:arm64
```

如果仓库使用 Yarn，可用 `yarn install --frozen-lockfile --ignore-scripts` 安装后，仍通过 `npm run dev:arm64` 启动。`node_modules` 不得是另一个工作目录的符号链接，因为原生库重建会改变其中的文件。

脚本缓存 ARM64 Electron 到被 Git 忽略的 `.local/`，重建所有实际使用的 FFI/ref 模块，并使用 Electron 做无设备 FFI 加载检查后启动 Manager。业务配置仍从根目录 `key.env` 加载。

## 构建

```bash
npm run build:mac:arm64
```

此命令先重建及验证原生模块，再执行生产 webpack 构建和 ARM64 electron-builder 打包。打包时关闭二次原生依赖重建，以保留刚验证的目标架构文件；设置 `--publish never`，不会上传发布。

只生成本地未签名测试目录包：

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run build:mac:arm64 -- --dir --config.mac.identity=null
```

正式发布仍使用项目既有签名、公证配置。ARM64 构建应使用独立的依赖目录，不与 x64 构建共用已重建的 `.node` 文件；此命令生成 ARM64 包，不代表已生成 Universal 安装包。

## 发布前验证

本地 ARM64 Electron、FFI、connector 无设备加载检查和后台 worker 启动已通过。正式安装包仍需验证 USB 连接、绑定、应用安装/更新、COS/BLE 升级、升级后的地址恢复，以及签名、公证和自动更新。
