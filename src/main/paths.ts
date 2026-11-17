import path from 'node:path'
export function connectorPath(
  packaged: boolean,
  platform: NodeJS.Platform,
  resourcesPath: string,
  projectRoot: string
): string {
  const filename = platform === 'win32' ? 'connector.dll' : 'connector.dylib'
  return packaged
    ? path.join(resourcesPath, platform === 'win32' ? '..' : '.', filename)
    : path.join(projectRoot, filename)
}
export function keyEnvPath(
  packaged: boolean,
  platform: NodeJS.Platform,
  resourcesPath: string,
  projectRoot: string
): string {
  return packaged
    ? path.join(resourcesPath, platform === 'win32' ? '..' : '.', 'key.env')
    : path.join(projectRoot, 'key.env')
}
