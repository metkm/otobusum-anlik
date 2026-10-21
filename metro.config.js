// // Learn more https://docs.expo.io/guides/customizing-metro
// Const { getDefaultConfig } = require('expo/metro-config')
// Const { withUniwindConfig } = require('uniwind/metro')

// /** @type {import('expo/metro-config').MetroConfig} */
// Const config = getDefaultConfig(__dirname)

// Module.exports = withUniwindConfig(config, {
//   // relative path to your global.css file (from previous step)
//   CssEntryFile: './src/global.css',
//   // (optional) path where we gonna auto-generate typings
//   // defaults to project's root
//   DtsFile: './src/uniwind-types.d.ts',
// })

// Metro.config.js

const { getDefaultConfig } = require('expo/metro-config')
const { withBoostConfig } = require('react-native-boost/metro')
const { withUniwindConfig } = require('uniwind/metro')

module.exports = withBoostConfig(
  withUniwindConfig(getDefaultConfig(__dirname), {
    cssEntryFile: './src/global.css',
    dtsFile: './src/uniwind-types.d.ts',
  }),
  {
    integrations: { uniwind: 'on' },
    optimizations: {
      'animated-value-initialization': 'off',
    },
  },
)
