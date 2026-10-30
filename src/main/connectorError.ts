import { app, dialog, shell } from 'electron'
import { existsSync } from 'node:fs'
import path from 'node:path'
let shown = false
export async function showConnectorLoadError(error: {
  message: string
  libraryPath: string
}): Promise<void> {
  if (shown) return
  shown = true
  const zh = app.getLocale() === 'zh-CN'
  const file = path.extname(error.libraryPath)
    ? error.libraryPath
    : error.libraryPath + (process.platform === 'win32' ? '.dll' : '.dylib')
  const missing = !existsSync(file)
  const runtime =
    process.platform === 'win32' && !missing && /Win32 error 126(?:\D|$)/.test(error.message)
  const detail = missing
    ? zh
      ? `找不到 ${file}，可能已被杀毒软件隔离或删除。请将 imKey Manager 加入杀毒软件白名单后重新安装。`
      : `${file} is missing. It may have been quarantined by antivirus software. Please whitelist imKey Manager and reinstall it.`
    : runtime
      ? zh
        ? '可能缺少 Microsoft Visual C++ 运行库（x86）或其他系统依赖。请下载安装运行库后重新启动 imKey Manager；如仍无法启动，请重新安装 imKey Manager。'
        : 'The Microsoft Visual C++ Redistributable (x86) or another system dependency may be missing. Please install the redistributable and restart imKey Manager. If the problem persists, reinstall imKey Manager.'
      : zh
        ? '请尝试重新安装 imKey Manager。'
        : 'Please try reinstalling imKey Manager.'
  const buttons = runtime
    ? zh
      ? ['下载运行库', '关闭']
      : ['Download', 'Close']
    : zh
      ? ['关闭']
      : ['Close']
  const { response } = await dialog.showMessageBox({
    type: 'error',
    title: 'imKey Manager',
    message: zh ? '设备通信组件加载失败' : 'Failed to load the device connector',
    detail: `${detail}\n\n${error.message}`,
    buttons,
    defaultId: 0,
    cancelId: buttons.length - 1
  })
  if (runtime && response === 0)
    await shell.openExternal('https://aka.ms/vs/17/release/vc_redist.x86.exe')
}
