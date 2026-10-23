# 错误与诊断日志

macOS connector 的 `imkey_get_last_err_message()` 返回普通错误字符串；Windows `_win` 变体返回 protobuf ErrorResponse 的 hex。
服务兼容这两种格式，只在完整合法 hex 且能解出非空错误字段时做 protobuf 解码；未知错误保留原文。
失败不能再变成空字符串或应用列表转换产生的 JavaScript TypeError。

页面显示已有错误提示、失败阶段和原因。已知原生错误使用中英文语言包，未知错误显示原文。
末尾 `[operationId]` 对应日志中的同名字段，可以将一次连接、应用安装或升级的多个请求串起来。
每个请求另有 `requestId`，用于区分 FIFO 中的单次调用。

## 日志位置

主进程创建 `app.getPath('userData')/logs/manager.jsonl`，终端输出同一份 JSONL。
macOS 通常为 `~/Library/Application Support/imKeyManager/logs/manager.jsonl`，实际以 Electron userData 为准。
单文件达到 1 MiB 后轮转，最多保留 3 份备份。磁盘或终端写入失败不影响设备业务。

日志记录应用/Electron 版本、平台架构、connector 路径和 SHA-256、服务启动/退出/重启、操作 ID、请求方法、阶段、耗时和安全错误码。
示例（ID 仅为示意）：

```json
{"level":"warn","event":"device.call-finished","requestId":42,"operationId":"example-1","method":"getSeid","stage":"getSeid","success":false,"durationMs":10,"code":"GET_SEID_ERROR"}
```

定位时先按页面给出的 operationId 查完整流程，再按 requestId 查看单次调用。
`device.execution-started`/`finished` 的时长反映服务执行，`device.call-finished` 包含等待服务和排队时间。
服务退出会拒绝全部挂起请求，自动重启采用 250 ms 起步、最多 30 秒的指数退避。
每个新服务进程在首次业务前重新初始化 core；初始化失败后，下一次用户操作会重新尝试初始化。
普通请求从服务实际开始执行时计时：读取 120 秒、设备连接 330 秒、写入 600 秒；服务启动等待 30 秒。
长时间无响应时终止该代服务并返回失败，挂起请求不会自动重放。若终止失败，则隔离旧服务，直到确认其退出后才允许新设备请求。
`cosUpdate`、IMK 固件更新及同一操作中的后续绑定、地址恢复步骤不受这些时限影响，继续使用原恢复流程。

## 信息范围

不记录调用参数、完整 protobuf hex、结果 payload、绑定码、钱包地址、APDU、环境变量或密钥内容。
原生 stdout/stderr 由主进程收集，仅保存 panic/backtrace 分类、已知错误码及 Rust 文件名/行号；未知正文丢弃。
错误码使用精确白名单，不能因为字符串符合某个正则就写入日志。
原生输出与 IPC trace 的到达顺序不保证相同，原生行的请求归属是当时活跃请求；最终返回事件按请求表精确关联。

## 流程与恢复

渲染层对整段设备业务排队，重复点击同一运行中的流程不会重复执行。
页面卸载后，当前 native 调用继续完成，但不再启动该页面的后续设备步骤或导航。
固件、绑定和地址恢复失败保留错误及待恢复状态；不把部分地址注册失败报告为成功。
设备身份和绑定状态仅在用户触发设备业务时检查，不做后台连接轮询。设备更换或绑定状态变化时，可以通过弹窗返回连接页重新识别；不会删除绑定文件或重置设备。
设置失败提供当前步骤重试或返回连接；绑定验证执行中禁止退出。连接过程的临时通信错误保留重试入口，只有明确的钱包未创建错误才进入设置流程。
应用列表保留 connector 的原始名称和确认版本，翻译名、按钮状态与 loading 只在页面派生。
搜索是普通字符串匹配；安装/更新/删除以稳定应用标识定位，不使用过滤列表下标。

## 回归验证

`npm test` 覆盖 macOS 明文、Windows hex、未知/损坏响应、日志脱敏/轮转/故障、整流程互斥与卸载、新错误分支和应用身份。
`npm run test:e2e` 覆盖真实 Electron 下的基础流程、错误展示、更新错误重试、过滤列表操作及页面再进入。
`npm run test:connector` 使用 Electron utilityProcess 和真实本机 connector；无设备时 getSeid 应失败并保留非空原因。
