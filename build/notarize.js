const { notarize } = require('electron-notarize');
process.env.DEBUG = 'electron-notarize*'
exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    console.log("appName:"+appName)
    const password = '@keychain:serv@imkey.im';
    console.log("password:"+password)
    console.log("appName:"+appOutDir)
    return await notarize({
        appBundleId: 'com.imkey.imkey-manager',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: '',
        appleIdPassword: '',
    });
}