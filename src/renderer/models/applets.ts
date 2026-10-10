/** Renderer domain data: connector identity and confirmed versions, without UI state. */
export interface DeviceApplet {
  id: string
  name: string
  installedVersion: string | null
  latestVersion: string
  icon: string
}
export interface AppletView extends DeviceApplet {
  displayName: string
  desc: string
  lastVersion: string
  installed: boolean
  installDis: boolean
  updateDis: boolean
  deleteDis: boolean
  installLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}
export type AppOperation = 'install' | 'update' | 'delete'
export function toDeviceApplets(entries: readonly Omit<DeviceApplet, 'id'>[]): DeviceApplet[] {
  return entries.map(entry => ({ ...entry, id: entry.name }))
}
export function appletView(
  applet: DeviceApplet,
  imkeyName: string,
  operation?: AppOperation
): AppletView {
  const present = applet.installedVersion !== null
  const update = present && applet.installedVersion !== applet.latestVersion
  return {
    ...applet,
    displayName: applet.name === 'IMK' ? imkeyName : applet.name,
    desc: present ? `version ${applet.installedVersion}` : '',
    lastVersion: `version ${applet.latestVersion}`,
    installed: present && !update && !operation,
    installDis: present || Boolean(operation),
    updateDis: !update || Boolean(operation),
    deleteDis: !present || update || ['IMK', 'BTC'].includes(applet.name) || Boolean(operation),
    installLoading: operation === 'install',
    updateLoading: operation === 'update',
    deleteLoading: operation === 'delete'
  }
}
export function filterApplets(entries: readonly AppletView[], search: string): AppletView[] {
  const needle = search.toLowerCase()
  return entries.filter(
    entry =>
      entry.name.toLowerCase().includes(needle) || entry.displayName.toLowerCase().includes(needle)
  )
}
