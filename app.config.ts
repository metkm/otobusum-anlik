import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Otobüsüm Anlık',
  slug: 'otobusum-anlik',
  version: '1.2.5',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  scheme: 'otobusum-anlik',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: '2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    },
  },
  web: {
    favicon: './assets/icon.png',
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
    edgeToEdgeEnabled: true,
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAP_API,
      },
    },
    softwareKeyboardLayoutMode: 'pan',
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
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
        image: './src/assets/icon.png',
        backgroundColor: '#0a0a0a',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
}

export default config
