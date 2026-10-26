# Windows connector 构建记录

Windows `connector.dll` 使用 `develop` 的 `80ddae2` 加本目录的 SN 校验源码补丁，
与 macOS connector 一致。蓝牙固件升级和外部传入 `server_url` 已在该基础提交中，
本次未修改这两项业务逻辑，也未修改 `Cargo.lock`。产物为 PE32 i386，匹配当前 Manager 的 ia32 目标，
可在对应 Windows 32 位进程中运行；不是跨 macOS/Windows 的通用库。

## 复现

准备 `nightly-2023-06-15` 的 `i686-pc-windows-gnu` 标准库，以及构建记录中固定摘要的
官方 LLVM-MinGW 20230614 UCRT 工具链。在 imkey-core 工作目录执行：

```sh
export IMKEY_LLVM_MINGW_PATH=/path/to/llvm-mingw-20230614-ucrt-macos-universal
export PATH="$IMKEY_LLVM_MINGW_PATH/bin:$PATH"
export CC_i686_pc_windows_gnu=i686-w64-mingw32-clang
export AR_i686_pc_windows_gnu=i686-w64-mingw32-ar
export CARGO_TARGET_I686_PC_WINDOWS_GNU_LINKER=/path/to/imkey-manager/vendor/imkey-core/device-sn-check/windows-linker.py
export CARGO_TARGET_DIR=/path/to/temporary/build-directory
cargo +nightly-2023-06-15 build --locked --offline -p api --target i686-pc-windows-gnu --release
llvm-strip --strip-debug "$CARGO_TARGET_DIR/i686-pc-windows-gnu/release/connector.dll"
```

旧 Rust GNU target 请求 `libgcc_eh` 和 `libgcc`。链接适配器只将二者映射到工具链提供的静态
`libunwind.a` 与 `libclang_rt.builtins-i386.a`，不替换 Rust、HID、加密或升级实现。
最终导入表仅包含 Windows 系统库与 UCRT，不需要额外复制 MinGW 运行库 DLL。
部署系统要求沿用 Manager 的 Windows 10 及以上要求，不从 PE 头的版本字段推断系统兼容性。

## 验证范围

Manager 的单元测试直接检查实际 DLL 的 PE 架构、C ABI 导出、运行库依赖和来源摘要，
并保留 Windows connector 调用顺序及 protobuf 契约测试。`npm run verify:connector` 检查文件和补丁摘要。

在 Windows 的 ia32 Node/Electron 开发环境中运行 `npm run test:connector`，可进一步核对真实 DLL 加载、
外部参数初始化、SDK 读取和未连接设备时的 SN 调用返回。此冒烟测试没有调用 `connectDevice`，
不会进行 USB 通信、固件升级或服务器请求；旧 DLL 缺少 SN 方法时应明确失败。
本次 macOS 主机不能实际执行 Windows DLL，Windows 加载与实机设备验证由用户在测试机完成。
