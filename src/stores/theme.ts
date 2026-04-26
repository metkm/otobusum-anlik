import { hexFromArgb } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { useFilterStore } from './filter'

import { City } from '@/types/city'
import { createRandomTheme } from '@/utils/color'

export interface Scheme {
  'ui-bg': string
  'ui-bg-muted': string
  'ui-text-muted': string
  'ui-text': string
  'ui-text-inverted': string
  'ui-primary': string
  'ui-error': string
  'ui-border': string
  'ui-border-muted': string
}

export interface Schemes {
  dark: Scheme
  light: Scheme
}

interface ThemeStore {
  themesByCity: Record<City, Record<string, Schemes>>
  themes: () => Record<string, Schemes>
  addTheme: (code: string) => void
  deleteTheme: (code: string) => void
}

export const useThemeStore = create(
  persist(
    immer<ThemeStore>((set, get) => ({
      themesByCity: {
        istanbul: {},
        izmir: {},
      },
      themes: () => get().themesByCity[useFilterStore.getState().city],
      addTheme: (code: string) => {
        const { schemes, palettes } = createRandomTheme()
        const city = useFilterStore.getState().city

        set((state) => {
          state.themesByCity[city][code] = {
            dark: {
              'ui-bg': hexFromArgb(schemes.dark.surface),
              'ui-bg-muted': hexFromArgb(palettes.neutral.tone(12)),
              'ui-text-muted': hexFromArgb(palettes.neutral.tone(90)),
              'ui-text': hexFromArgb(schemes.dark.onSurface),
              'ui-text-inverted': hexFromArgb(schemes.dark.inverseOnSurface),
              'ui-primary': hexFromArgb(schemes.dark.primary),
              'ui-error': hexFromArgb(schemes.dark.error),
              'ui-border': hexFromArgb(schemes.dark.outline),
              'ui-border-muted': hexFromArgb(schemes.dark.outlineVariant),
            },
            light: {
              'ui-bg': hexFromArgb(schemes.light.surface),
              'ui-bg-muted': hexFromArgb(palettes.neutral.tone(94)),
              'ui-text-muted': hexFromArgb(palettes.neutral.tone(10)),
              'ui-text': hexFromArgb(schemes.light.onSurface),
              'ui-text-inverted': hexFromArgb(schemes.light.inverseOnSurface),
              'ui-primary': hexFromArgb(schemes.light.primary),
              'ui-error': hexFromArgb(schemes.light.error),
              'ui-border': hexFromArgb(schemes.light.outline),
              'ui-border-muted': hexFromArgb(schemes.light.outlineVariant),
            },
          }
        })
      },
      deleteTheme: code => set((state) => {
        const city = useFilterStore.getState().city
        delete state.themesByCity[city][code]
      }),
    })),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
    },
  ),
)
