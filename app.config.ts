import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Otobüsüm Anlık",
  slug: "otobusum-anlik",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "otobusum-anlik",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0a0a0a",
  },
  ios: {
    supportsTablet: true,
  },
  androidStatusBar: {
    barStyle: "light-content",
    translucent: true,
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAP_API,
      },
    },
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0a0a0a",
    },
    package: "com.anonymous.otobusumanlik",
  },
  plugins: ["expo-router", "expo-localization"],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
