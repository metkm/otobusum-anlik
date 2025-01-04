import AsyncStorage from '@react-native-async-storage/async-storage'
import { MapState } from '@rnmapbox/maps'
import { ColorSchemeName } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  // initialMapLocation?: Region
  mapState?: MapState
  showMyLocation: boolean
  showTraffic: boolean
  colorScheme?: ColorSchemeName
  clusterStops: boolean
}

export const useSettingsStore = create(
  subscribeWithSelector(
    persist<SettingsStore>(
      () => ({
        // initialMapLocation: undefined,
        mapState: undefined,
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
