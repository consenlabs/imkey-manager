const allowedDeviceMessages = new Set([
  'initImKeyCore', 'connectDevice', 'getSeid', 'getSn', 'getRamSize',
  'getFirmwareVersion', 'getBleVersion', 'getSdkInfo', 'activeDevice',
  'cosUpdate', 'cosCheckUpdate', 'isBLStatus', 'checkDevice', 'checkUpdate',
  'getInstalledApplets', 'downloadApplet', 'updateApplet', 'deleteApplet',
  'deviceBindCheck', 'deviceBindAcquire', 'deviceBindDisplay', 'getBTCXpub',
  'getUserPath', 'importBindCode', 'exportBindCode', 'isExistBindCodeFile',
  'genWalletAddress', 'writeWalletAddress'
])

function isTrustedSender (event, window) {
  return Boolean(window && !window.isDestroyed() && event.sender === window.webContents)
}

function isAllowedDeviceMessage (event, window, message) {
  return isTrustedSender(event, window) &&
    Boolean(message && Object(message) === message && allowedDeviceMessages.has(message.type))
}

module.exports = { isTrustedSender, isAllowedDeviceMessage }
