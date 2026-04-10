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
        initialMapBounds: undefined,
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
