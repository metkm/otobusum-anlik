import { createContext, use } from 'react'
import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { ColorSchemes, defaultColorSchemes } from '@/constants/colors'
import { getTheme, useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'

export const ColorSchemesContext = createContext<ColorSchemes | undefined>(undefined)

export function useTheme(lineCode?: string) {
  const storedColorScheme = useSettingsStore(useShallow(state => state.colorScheme))
  const storedTheme = useLinesStore(useShallow(() => lineCode ? getTheme(lineCode) : undefined))

  const systemColorScheme = useColorScheme()

  const colorScheme = storedColorScheme ?? systemColorScheme ?? 'dark'
  const schemeDefault = defaultColorSchemes[colorScheme]

  const contextTheme = use(ColorSchemesContext) ?? defaultColorSchemes

  const schemeColor = lineCode
    ? storedTheme
      ? storedTheme[colorScheme]
      : schemeDefault
    : contextTheme[colorScheme]

  return {
    colorScheme,
    schemeDefault,
    schemeColor,
    storedTheme,
    contextTheme,
  }
}
