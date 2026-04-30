import { type LngLatBounds } from '@maplibre/maplibre-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { requestForegroundPermissionsAsync } from 'expo-location'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { mapStyles, MapStyleValue, type MapStyle } from '@/constants/mapStyles'

export type ColorScheme = 'light' | 'dark'

export interface SettingsStore {
  initialMapBounds: LngLatBounds
  showMyLocation: boolean
  showTraffic: boolean
  mapStyle?: MapStyle
  colorScheme?: ColorScheme
  toggleMyLocation: () => void
  getMapStyle: (colorScheme: 'light' | 'dark') => { scheme: MapStyle, style: MapStyleValue }
}

export const useSettingsStore = create(
  persist(
    subscribeWithSelector(
      immer<SettingsStore>((set, get) => ({
        initialMapBounds: [26.218823938242565, 36.08430119633523, 30.10080291867854, 42.351104713710356],
        showMyLocation: false,
        showTraffic: true,
        mapStyle: undefined,
        colorScheme: undefined,
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
        getMapStyle: (colorScheme) => {
          const prefferedMapStyle = get().mapStyle
          const scheme = prefferedMapStyle ?? (colorScheme === 'dark' ? 'night' : 'light')

          return {
            scheme,
            style: mapStyles[scheme],
          }
        },
      })),
    ),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
