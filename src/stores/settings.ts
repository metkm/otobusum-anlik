import { type LngLatBounds } from '@maplibre/maplibre-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ColorSchemeName } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  initialMapBounds?: LngLatBounds
  showMyLocation: boolean
  showTraffic: boolean
  colorScheme?: ColorSchemeName
  clusterStops: boolean
}

export const useSettingsStore = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        initialMapBounds: [26.218823938242565, 36.08430119633523, 30.10080291867854, 42.351104713710356],
        showMyLocation: false,
        showTraffic: true,
        colorScheme: undefined,
        clusterStops: false,
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
