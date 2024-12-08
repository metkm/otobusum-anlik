import { Scheme, Theme, hexFromArgb } from '@material/material-color-utilities'
import { useCallback, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { colors } from '@/constants/colors'
import { useSettingsStore } from '@/stores/settings'

type SchemeKeys = {
  [K in keyof Scheme]: Scheme[K] extends number ? K : never
}[keyof Scheme]

export function useTheme(theme?: Theme) {
  const storedTheme = useSettingsStore(useShallow(state => state.colorScheme))
  const systemScheme = useColorScheme()

  const mode = useMemo(() => storedTheme ?? systemScheme ?? 'dark', [storedTheme, systemScheme])
  const scheme = useMemo(() => mode === 'dark' ? theme?.schemes.dark : theme?.schemes.light, [mode, theme?.schemes.dark, theme?.schemes.light])

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
  }
}
