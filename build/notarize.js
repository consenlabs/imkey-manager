const dotenv = require('dotenv')

dotenv.config()
process.env.DEBUG = 'electron-notarize*'

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') return
  if (context.packager.platformSpecificBuildOptions.identity === null) return

  const { notarize } = require('@electron/notarize')
  const appName = context.packager.appInfo.productFilename
  await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    teamId: process.env.TEAM_SHORT_NAME,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD
  })
}
