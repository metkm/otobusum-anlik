import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Theme,
} from '@material/material-color-utilities'

import { ColorSchemes } from '@/constants/colors'

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

const getHslValues = (): [number, number, number] => {
  return [360 * Math.random(), 25 + 70 * Math.random(), 85 + 10 * Math.random()]
}

export const materialThemeToLocalSchemes = (theme: Theme): ColorSchemes => {
  return {
    dark: {
      primary: hexFromArgb(theme.schemes['dark']['primary']),
      onPrimary: hexFromArgb(theme.schemes['dark']['onPrimary']),
      secondaryContainer: hexFromArgb(theme.schemes['dark']['secondaryContainer']),
      onSecondaryContainer: hexFromArgb(theme.schemes['dark']['onSecondaryContainer']),
      secondary: hexFromArgb(theme.schemes['dark']['secondary']),
      onSecondary: hexFromArgb(theme.schemes['dark']['secondary']),
      primaryContainer: hexFromArgb(theme.schemes['dark']['primaryContainer']),
      onPrimaryContainer: hexFromArgb(theme.schemes['dark']['onPrimaryContainer']),
      surface: hexFromArgb(theme.schemes['dark']['surface']),
      onSurface: hexFromArgb(theme.schemes['dark']['onSurface']),
      error: hexFromArgb(theme.schemes['dark']['error']),
      onError: hexFromArgb(theme.schemes['dark']['onError']),
      surfaceContainer: hexFromArgb(theme.palettes.neutral.tone(12)),
      surfaceContainerHigh: hexFromArgb(theme.palettes.neutral.tone(17)),
    },
    light: {
      primary: hexFromArgb(theme.schemes['light']['primary']),
      onPrimary: hexFromArgb(theme.schemes['light']['onPrimary']),
      secondaryContainer: hexFromArgb(theme.schemes['light']['secondaryContainer']),
      onSecondaryContainer: hexFromArgb(theme.schemes['light']['onSecondaryContainer']),
      secondary: hexFromArgb(theme.schemes['light']['secondary']),
      onSecondary: hexFromArgb(theme.schemes['light']['secondary']),
      primaryContainer: hexFromArgb(theme.schemes['light']['primaryContainer']),
      onPrimaryContainer: hexFromArgb(theme.schemes['light']['onPrimaryContainer']),
      surface: hexFromArgb(theme.schemes['light']['surface']),
      onSurface: hexFromArgb(theme.schemes['light']['onSurface']),
      error: hexFromArgb(theme.schemes['light']['error']),
      onError: hexFromArgb(theme.schemes['light']['onError']),
      surfaceContainer: hexFromArgb(theme.palettes.neutral.tone(94)),
      surfaceContainerHigh: hexFromArgb(theme.palettes.neutral.tone(92)),
    },
  }
}

export const createTheme = (hex?: string): ColorSchemes => {
  let theme: Theme

  if (hex) {
    theme = themeFromSourceColor(argbFromHex(hex))
  }

  const [h, s, l] = getHslValues()
  const colorHex = hslToHex(h, s, l)

  theme = themeFromSourceColor(argbFromHex(colorHex))
  return materialThemeToLocalSchemes(theme)
}
