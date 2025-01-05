import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Otobüsüm Anlık',
  slug: 'otobusum-anlik',
  version: '1.2.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'otobusum-anlik',
  userInterfaceStyle: 'automatic',
  newArchEnabled: false,
  extra: {
    eas: {
      projectId: '2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    },
  },
  ios: {
    supportsTablet: true,
  },
  updates: {
    url: 'https://u.expo.dev/2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    requestHeaders: {
      'expo-channel-name': 'production',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  androidStatusBar: {
    barStyle: 'light-content',
    translucent: true,
  },
  android: {
    softwareKeyboardLayoutMode: 'pan',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.anonymous.otobusumanlik',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    'expo-location',
    [
      'expo-splash-screen',
      {
        image: './assets/icon.png',
        backgroundColor: '#0a0a0a',
      },
    ],
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAP_API,
        RNMapboxMapsVersion: '11.0.0',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
}

export default config
