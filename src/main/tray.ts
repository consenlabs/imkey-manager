import { app, Menu, shell, Tray, type BrowserWindow } from 'electron'
import path from 'node:path'
import { getExternalLinks } from '../shared/externalLinks'
export function createTray(
  staticPath: string,
  getWindow: () => BrowserWindow | null,
  allowQuit: () => void
): Tray {
  const tray = new Tray(
    path.join(staticPath, process.platform === 'win32' ? 'logo.ico' : 'icon_16x16@2x.png')
  )
  const zh = app.getLocale() === 'zh-CN'
  const links = getExternalLinks(app.getLocale())
  tray.setToolTip(app.getName())
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: zh ? '帮助' : 'Help',
        click: () => {
          void shell.openExternal(links.support)
        }
      },
      {
        label: zh ? '关于imKey' : 'About imKey',
        click: () => {
          void shell.openExternal(links.imkey)
        }
      },
      {
        label: zh ? '退出' : 'Quit',
        click: () => {
          allowQuit()
          setTimeout(() => app.quit(), 3000)
        }
      }
    ])
  )
  tray.on('click', () => {
    const window = getWindow()
    if (window && !window.isDestroyed()) {
      if (window.isVisible()) window.hide()
      else window.show()
    }
  })
  return tray
}
