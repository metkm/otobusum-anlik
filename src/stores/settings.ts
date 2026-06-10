import { type LngLatBounds } from '@maplibre/maplibre-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { requestForegroundPermissionsAsync } from 'expo-location'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { type MapStyle } from '@/constants/mapStyles'

export type ColorScheme = 'light' | 'dark'

export interface SettingsStore {
  initialMapBounds: LngLatBounds
  bearing: number
  pitch: number
  showMyLocation: boolean
  expandStopsWhenScrolled: boolean
  // showTraffic: boolean
  mapStyle?: MapStyle
  colorScheme?: ColorScheme
  showOnBoarding: boolean
  hideMap: boolean
  lineCardExpanded?: boolean
  toggleMyLocation: () => void
}

export const useSettingsStore = create(
  persist(
    subscribeWithSelector(
      immer<SettingsStore>((set, get) => ({
        initialMapBounds: [26.218823938242565, 36.08430119633523, 30.10080291867854, 42.351104713710356],
        bearing: 0,
        pitch: 0,
        showMyLocation: false,
        expandStopsWhenScrolled: false,
        // showTraffic: true,
        mapStyle: undefined,
        colorScheme: undefined,
        showOnBoarding: true,
        hideMap: false,
        lineCardExpanded: false,
        toggleMyLocation: async () => {
          let showLocation = get().showMyLocation

          if (!showLocation) {
            const { granted } = await requestForegroundPermissionsAsync()
            if (granted) {
              showLocation = true
            }
          } else {
            showLocation = false
          }

          return set((state) => {
            state.showMyLocation = showLocation
          })
        },
      })),
    ),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate: () => {},
      version: 4,
    },
  ),
)
