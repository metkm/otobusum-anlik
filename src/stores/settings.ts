import { type LngLatBounds } from '@maplibre/maplibre-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { requestForegroundPermissionsAsync } from 'expo-location'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { type MapStyle } from '@/constants/mapStyles'

export type ColorScheme = 'light' | 'dark'

export interface SettingsStoreV4 {
  initialMapBounds: LngLatBounds
  bearing: number
  pitch: number
  showMyLocation: boolean
  expandStopsWhenScrolled: boolean
  mapStyle?: MapStyle
  colorScheme?: ColorScheme
  showOnBoarding: boolean
  hideMap: boolean
  lineCardExpanded?: boolean
  mapButtonsPlacement: 'left' | 'right'
  toggleMyLocation: () => void
}

export const useSettingsStore = create(
  persist(
    subscribeWithSelector(
      immer<SettingsStoreV4>((set, get) => ({
        bearing: 0,
        colorScheme: undefined,
        expandStopsWhenScrolled: false,
        hideMap: false,
        initialMapBounds: [
          26.218823938242565, 36.08430119633523, 30.10080291867854, 42.351104713710356,
        ],
        lineCardExpanded: false,
        mapButtonsPlacement: 'right',
        mapStyle: undefined,
        pitch: 0,
        showMyLocation: false,
        showOnBoarding: true,
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
      migrate: (persistedStore: unknown, version: number) => {
        const store = persistedStore as SettingsStoreV4

        // @ts-ignore
        if (version === 4 && store.mapStyle === 'bright') {
          store.mapStyle = 'liberty'
        }

        return store
      },
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4.1,
    },
  ),
)
