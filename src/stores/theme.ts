import { hexFromArgb } from '@material/material-color-utilities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { useFilterStore } from './filter'
import { LineStoreV3 } from './line'

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
  getThemes: () => Record<string, Schemes>
  createTheme: (code: string) => void
  deleteTheme: (code: string) => void
  deleteUnusedThemes: (codes: string[]) => void
}

const migrate = async (persistedState: unknown, version: number) => {
  const store = persistedState as ThemeStore

  if (version === undefined) {
    const raw = await AsyncStorage.getItem('temp_line_theme_migration')
    if (!raw)
      return

    const lineThemesParsed = JSON.parse(raw) as LineStoreV3['lineTheme']

    for (const value of Object.values(lineThemesParsed)) {
      for (const code of Object.keys(value)) {
        store.createTheme(code)
      }
    }
  }
}

export const useThemeStore = create(
  persist(
    subscribeWithSelector(
      immer<ThemeStore>((set, get) => ({
        themesByCity: {
          istanbul: {},
          izmir: {},
        },
        getThemes: () => get().themesByCity[useFilterStore.getState().city],
        createTheme: (code: string) => {
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
                'ui-bg-muted': hexFromArgb(palettes.neutral.tone(97)),
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
        deleteUnusedThemes: codes => set((state) => {
          const city = useFilterStore.getState().city
          const themeCodes = Object.keys(state.getThemes())

          for (let index = 0; index < themeCodes.length; index++) {
            const code = themeCodes[index]
            if (!code)
              continue

            if (codes.includes(code))
              continue

            delete state.themesByCity[city][code]
          }
        }),
      })),
    ),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate,
      version: 4,
    },
  ),
)
