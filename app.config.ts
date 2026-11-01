import buildProperties from 'expo-build-properties/plugin'
import font from 'expo-font/plugin'
import image from 'expo-image/plugin'
import localization from 'expo-localization/plugin'
import location from 'expo-location/plugin'
import navigationBar from 'expo-navigation-bar/plugin'
import router from 'expo-router/plugin'
import splashScreen from 'expo-splash-screen/plugin'
import statusBar from 'expo-status-bar/plugin'
import type { ConfigContext } from 'expo/config'

const isWindows = process.platform === 'win32'

export default ({ config }: ConfigContext) =>
  ({
    ...config,
    android: {
      adaptiveIcon: {
        backgroundColor: '#0a0a0a',
        foregroundImage: './src/assets/adaptive-icon.png',
      },
      package: 'com.anonymous.otobusumanlik',
    },
    experiments: {
      reactCompiler: true,
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
      },
    },
    icon: './src/assets/icon.png',
    ios: {
      bundleIdentifier: 'com.anonymous.otobusumanlik',
    },
    name: 'Otobüsüm Anlık',
    orientation: 'portrait',
    plugins: [
      router(),
      localization(),
      location(),
      buildProperties({
        android: {
          cmakeVersion: isWindows ? '3.31.6' : undefined,
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          usePrecompiledHeaders: true,
        },
      }),
      splashScreen({
        backgroundColor: '#0a0a0a',
        image: './src/assets/icon.png',
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
      navigationBar({
        enforceContrast: false,
      }),
      '@maplibre/maplibre-react-native',
    ],
    runtimeVersion: {
      policy: 'appVersion',
    },
    scheme: 'otobusum-anlik',
    slug: 'otobusum-anlik',
    updates: {
      requestHeaders: {
        'expo-channel-name': 'production',
      },
      url: 'https://u.expo.dev/2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    },
    userInterfaceStyle: 'automatic',
    version: '1.5.4',
  }) satisfies ConfigContext['config']
