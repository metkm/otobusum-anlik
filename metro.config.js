// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config')
// const { withUniwindConfig } = require('uniwind/metro')

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname)

// module.exports = withUniwindConfig(config, {
//   // relative path to your global.css file (from previous step)
//   cssEntryFile: './src/global.css',
//   // (optional) path where we gonna auto-generate typings
//   // defaults to project's root
//   dtsFile: './src/uniwind-types.d.ts',
// })

// metro.config.js

const { getDefaultConfig } = require('expo/metro-config')
const { withBoostConfig } = require('react-native-boost/metro')
const { withUniwindConfig } = require('uniwind/metro')

module.exports = withBoostConfig(
  withUniwindConfig(getDefaultConfig(__dirname), {
    cssEntryFile: './src/global.css',
    // (optional) path where we gonna auto-generate typings
    // defaults to project's root
    dtsFile: './src/uniwind-types.d.ts',
  }),
  {
    integrations: { uniwind: 'on' },
    optimizations: {
      'animated-value-initialization': 'off',
    },
  },
)
