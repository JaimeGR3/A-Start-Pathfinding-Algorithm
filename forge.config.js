const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
module.exports = {
  packagerConfig: {
    icon: './src/images/favicon',
    asar: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://www.dropbox.com/scl/fi/t5akrmlkmihkq3cxmwmwd/favicon.ico?rlkey=lqmvv5pgxjmefoj9rxujm8mh4&st=n7fdd177&dl=0', // Para el ícono en el Panel de Control de Windows
        setupIcon: './src/images/favicon.ico'       // Para el ícono del archivo Setup.exe en Windows
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './src/images/favicon.icns'           // Para el instalador DMG en macOS
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};