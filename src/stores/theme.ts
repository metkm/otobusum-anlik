import { hexFromArgb } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { City } from '@/types/city'
import { createRandomTheme } from '@/utils/color'

import { useFilterStore } from './filter'

interface Scheme {
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

interface Schemes {
  dark: Scheme
  light: Scheme
}

interface ThemeStore {
  themesByCity: Record<City, Record<string, Schemes>>
  createTheme: (code: string, overwrite?: boolean, hslColor?: [number, number, number]) => void
  deleteTheme: (code: string) => void
  deleteUnusedThemes: (codes: string[]) => void
}

export const useThemeStore = create(
  persist(
    subscribeWithSelector(
      immer<ThemeStore>((set, get) => ({
        createTheme: (code, overwrite, hslColor) => {
          const { schemes, palettes } = createRandomTheme(hslColor)
          const { city } = useFilterStore.getState()

          if (get().themesByCity[city][code] && !overwrite) {
            return
          }

          set((state) => {
            state.themesByCity[city][code] = {
              dark: {
                'ui-bg': hexFromArgb(schemes.dark.surface),
                'ui-bg-muted': hexFromArgb(palettes.neutral.tone(12)),
                'ui-border': hexFromArgb(schemes.dark.outline),
                'ui-border-muted': hexFromArgb(schemes.dark.outlineVariant),
                'ui-error': hexFromArgb(schemes.dark.error),
                'ui-primary': hexFromArgb(schemes.dark.primary),
                'ui-text': hexFromArgb(schemes.dark.onSurface),
                'ui-text-inverted': hexFromArgb(schemes.dark.inverseOnSurface),
                'ui-text-muted': hexFromArgb(palettes.neutral.tone(90)),
              },
              light: {
                'ui-bg': hexFromArgb(schemes.light.surface),
                'ui-bg-muted': hexFromArgb(palettes.neutral.tone(97)),
                'ui-border': hexFromArgb(schemes.light.outline),
                'ui-border-muted': hexFromArgb(schemes.light.outlineVariant),
                'ui-error': hexFromArgb(schemes.light.error),
                'ui-primary': hexFromArgb(schemes.light.primary),
                'ui-text': hexFromArgb(schemes.light.onSurface),
                'ui-text-inverted': hexFromArgb(schemes.light.inverseOnSurface),
                'ui-text-muted': hexFromArgb(palettes.neutral.tone(10)),
              },
            }
          })
        },
        deleteTheme: (code) =>
          set((state) => {
            const { city } = useFilterStore.getState()
            delete state.themesByCity[city][code]
          }),
        deleteUnusedThemes: (codes) =>
          set((state) => {
            const { city } = useFilterStore.getState()
            const themeCodes = Object.keys(state.themesByCity[city])

            for (const code of themeCodes) {
              if (!codes.includes(code)) {
                delete state.themesByCity[city][code]
              }
            }
          }),
        themesByCity: {
          istanbul: {},
          izmir: {},
        },
      })),
    ),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
    },
  ),
)
