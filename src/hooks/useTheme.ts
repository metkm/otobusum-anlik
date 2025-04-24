import { Scheme, hexFromArgb, type Theme } from '@material/material-color-utilities'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { colors } from '@/constants/colors'
import { useSettingsStore } from '@/stores/settings'
import { createTheme } from '@/utils/createTheme'

type SchemeKeys = {
  [K in keyof Scheme]: Scheme[K] extends number ? K : never
}[keyof Scheme]

const defaultCreatedTheme = createTheme(colors.primary)
export const ThemeContext = createContext<Theme | undefined>(undefined)

export function useTheme(_theme?: Theme) {
  const storedTheme = useSettingsStore(useShallow(state => state.colorScheme))
  const systemScheme = useColorScheme()

  const contextTheme = useContext(ThemeContext)
  const theme = _theme || contextTheme

  const mode = useMemo(
    () => storedTheme ?? systemScheme ?? 'dark',
    [storedTheme, systemScheme],
  )

  const scheme = useMemo(
    () => {
      const th = theme ?? defaultCreatedTheme
      return mode === 'dark' ? th?.schemes.dark : th?.schemes.light
    },
    [mode, theme],
  )

  const colorsTheme = colors[mode]

  const bottomSheetStyle = useMemo(() => ({
    handleStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
    handleIndicatorStyle: { backgroundColor: colorsTheme.surfaceContainerHighest },
    backgroundStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
  }), [colorsTheme])

  const getSchemeColorHex = useCallback((key: SchemeKeys) => {
    if (!scheme) return
    return hexFromArgb(scheme[key])
  }, [scheme])

  return {
    mode,
    scheme,
    colorsTheme,
    bottomSheetStyle,
    getSchemeColorHex,
    contextTheme,
  }
}
