import { createContext, use, useState } from 'react'
import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { ColorSchemes, defaultColorSchemes } from '@/constants/colors'
import { useSettingsStore } from '@/stores/settings'

// type SchemeKeys = {
//   [K in keyof Scheme]: Scheme[K] extends number ? K : never
// }[keyof Scheme]

export const ColorSchemesContext = createContext<ColorSchemes | undefined>(undefined)

// with typescript maybe make it so you have to give 2 parameters if contextscheme is provided
// or make it so it takes a linecoed

export function useTheme(useContextScheme?: boolean) {
  const storedColorScheme = useSettingsStore(useShallow(state => state.colorScheme))
  const systemColorScheme = useColorScheme()

  const colorScheme = storedColorScheme ?? systemColorScheme ?? 'dark'
  const schemeDefault = defaultColorSchemes[colorScheme]

  // const [colorSchemes, setColorScheme] = useState(defaultColorSchemes)

  const contextTheme = use(ColorSchemesContext) ?? defaultColorSchemes
  const schemeColor = useContextScheme ? contextTheme[colorScheme] : defaultColorSchemes[colorScheme]

  // const updateColorTheme = (newPrimaryColor: string) => {
  //   const argbPrimaryColor = argbFromHex(newPrimaryColor)

  //   const newTheme = themeFromSourceColor(argbPrimaryColor)
  //   const { neutral } = newTheme.palettes

  //   setColorScheme({
  //     dark: {
  //       primary: hexFromArgb(newTheme.schemes['dark']['primary']),
  //       onPrimary: hexFromArgb(newTheme.schemes['dark']['primary']),
  //       surface: hexFromArgb(newTheme.schemes['dark']['surface']),
  //       onSurface: hexFromArgb(newTheme.schemes['dark']['onSurface']),
  //       surfaceContainer: hexFromArgb(neutral.tone(12)),
  //       surfaceContainerHigh: hexFromArgb(neutral.tone(17)),
  //     },
  //     light: {
  //       primary: hexFromArgb(newTheme.schemes['light']['primary']),
  //       onPrimary: hexFromArgb(newTheme.schemes['light']['primary']),
  //       surface: hexFromArgb(newTheme.schemes['light']['surface']),
  //       onSurface: hexFromArgb(newTheme.schemes['light']['onSurface']),
  //       surfaceContainer: hexFromArgb(neutral.tone(94)),
  //       surfaceContainerHigh: hexFromArgb(neutral.tone(92)),
  //     }
  //   })
  // }

  return {
    colorScheme,
    schemeDefault,
    schemeColor,
    // updateColorTheme,
  }

  // const systemScheme = useColorScheme()

  // const contextTheme = useContext(ThemeContext)
  // const theme = _theme || contextTheme

  // const mode = useMemo(
  //   () => storedTheme ?? systemScheme ?? 'dark',
  //   [storedTheme, systemScheme],
  // )

  // const scheme = useMemo(
  //   () => {
  //     const th = theme ?? defaultCreatedTheme
  //     return mode === 'dark' ? th?.schemes.dark : th?.schemes.light
  //   },
  //   [mode, theme],
  // )

  // const colorsTheme = colors[mode]

  // const bottomSheetStyle = useMemo(() => ({
  //   handleStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
  //   handleIndicatorStyle: { backgroundColor: colorsTheme.surfaceContainerHighest },
  //   backgroundStyle: { backgroundColor: colorsTheme.surfaceContainerLow },
  // }), [colorsTheme])

  // const getSchemeColorHex = useCallback((key: SchemeKeys) => {
  //   if (!scheme) return
  //   return hexFromArgb(scheme[key])
  // }, [scheme])

  // return {
  //   mode,
  //   scheme,
  //   colorsTheme,
  //   bottomSheetStyle,
  //   getSchemeColorHex,
  //   contextTheme,
  // }
}
