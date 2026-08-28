import { ConfigContext } from 'expo/config'
import buildProperties from 'expo-build-properties/plugin'
import font from 'expo-font/plugin'
import image from 'expo-image/plugin'
import localization from 'expo-localization/plugin'
import location from 'expo-location/plugin'
import router from 'expo-router/plugin'
import splashScreen from 'expo-splash-screen/plugin'
import statusBar from 'expo-status-bar/plugin'

export default ({ config }: ConfigContext) => ({
  ...config,
  name: 'Otobüsüm Anlık',
  slug: 'otobusum-anlik',
  version: '1.4.19',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  scheme: 'otobusum-anlik',
  userInterfaceStyle: 'automatic',
  extra: {
    eas: {
      projectId: '2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    },
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
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.anonymous.otobusumanlik',
  },
  plugins: [
    router(),
    localization(),
    location(),
    buildProperties({
      android: {
        usePrecompiledHeaders: true,
      },
    }),
    splashScreen({
      image: './src/assets/icon.png',
      backgroundColor: '#0a0a0a',
    }),
    font({
      fonts: [
        './src/assets/fonts/Inter-Medium.ttf',
        './src/assets/fonts/Inter-Regular.ttf',
        './src/assets/fonts/Inter-SemiBold.ttf',
      ],
    }),
    image(),
    statusBar(),
    '@maplibre/maplibre-react-native',
  ],
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
} satisfies ConfigContext['config'])
