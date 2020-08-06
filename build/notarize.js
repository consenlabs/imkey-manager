const { notarize } = require('electron-notarize');
process.env.DEBUG = 'electron-notarize*'
exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    const password = '@keychain:serv@imkey.im';
    return await notarize({
        appBundleId: 'com.imkey.imkey-manager',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: '',
        appleIdPassword: '',
    });
}