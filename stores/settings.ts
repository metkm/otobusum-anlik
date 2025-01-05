import AsyncStorage from '@react-native-async-storage/async-storage'
import { MapState } from '@rnmapbox/maps'
import { ColorSchemeName } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export interface SettingsStore {
  mapState?: MapState
  showMyLocation: boolean
  showTraffic: boolean
  colorScheme?: ColorSchemeName
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
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)
