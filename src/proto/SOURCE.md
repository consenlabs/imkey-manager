# Protobuf 来源与再生成

来源为只读仓库 `/Users/xiaoguang/Developer/work/imkey-core` 的固定提交
`80ddae20a2ece117bd443803e9bc6d5de519e575`（develop）。脚本通过 `git show <commit>:proto/src/...`
读取提交对象，不依赖该仓库当前工作区，也不会修改 imkey-core。

| 源文件                   | SHA-256                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `proto/src/api.proto`    | `cba34681246752d5c63c49d68e5eb28460fd86ea88679bf37945fb5510d015af` |
| `proto/src/btc.proto`    | `64c5f1087e821ce9e0cc5091deb3395992d06c3e6f71ed7e7533f20ac35f4a21` |
| `proto/src/device.proto` | `95a042e7dbda3633357fcebd3435d66104ab1df856132feae62e54bff8a44fd8` |

执行 `npm run gen:proto` 生成 `.proto` 与 CommonJS/binary `.js`；执行
`node scripts/gen-proto.mjs --check` 只比较生成结果，不写源码。
默认使用 PATH 中的 `protoc`（本轮验证 `libprotoc 24.4`），可通过 `PROTOC` 指定其他路径；
`IMKEY_CORE_PATH` 可指定同一固定提交所在的只读 checkout。JS 插件为精确依赖 `protoc-gen-js@3.21.4-4`。
上表摘要基于原始 git 对象；复制的 `.proto` 仅规范末尾换行（避免空白 diff），不改语法。
JS 输出使用项目 Prettier 配置格式化，保持无分号、2 空格、单引号且可复现。

与重构前比较，`api.proto` 不变；`btc.proto` 补入上游 Utxo/BtcTxExtra/BtcTxInput/BtcTxOutput 消息；
`device.proto` 补入 BleCheckUpdateRes。既有可达方法的字段编号、编码与解析结果不变，黄金测试逐字节验证。
新增消息仅为 schema 定义；共享方法白名单、preload 与设备服务不开放签名调用。

本轮为 SN 校验增加 `extensions/device-sn-check.proto`，生成脚本在上述固定提交的
`device.proto` 后追加该扩展。扩展 SHA-256 为
`45133175d14077cd1bfd635ac61fe194667b1c5ad4b9d4903b783a3eecab594d`。
`DeviceSnCheckRes` 的字段编号为 `sn_check_result=1`、`is_activate=2`、`activate_time=3`，
与新 connector 的 protobuf 一致，不改变既有消息编码。新开放的 `deviceSnCheck` 仅接受空参数，
由 core 读取当前设备 SN；不会接受调用方提供的任意 SN。core 的未提交补丁及构建记录保存在
`vendor/imkey-core/device-sn-check/`，connector 摘要见根目录 `connector.lock.json`。
当前补丁已编入 macOS Universal connector 和 Windows ia32 DLL，两者采用同一来源补丁。
Windows 构建记录见 `vendor/imkey-core/device-sn-check/windows-build-provenance.json`。

选择 3.21.4-4 的原因是 4.0.3 生成的 `readStringRequireUtf8` 不兼容项目保留的
`google-protobuf@3.15.5`，且升级 runtime 会扩大解码行为变更范围。使用 3.21.4-4 后
68 条旧实现 protobuf 黄金测试全部通过。
