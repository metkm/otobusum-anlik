import { themeFromSourceColor, argbFromHex, hexFromArgb, type Theme } from '@material/material-color-utilities'
import type { ColorSchemes } from '~/types/color'

const getHslValues = (): [number, number, number] => {
  return [360 * Math.random(), 25 + 70 * Math.random(), 85 + 10 * Math.random()]
}

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

export const useLinesThemeStore = defineStore('lines-theme', () => {
  const filtersStore = useFiltersStore()

  const allThemes = ref<Record<City, Map<string, ColorSchemes>>>({
    istanbul: new Map(),
    izmir: new Map(),
  })

  const createTheme = (lineCode: string, hex?: string) => {
    let theme: Theme

    if (hex) {
      theme = themeFromSourceColor(argbFromHex(hex))
    }

    const [h, s, l] = getHslValues()
    theme = themeFromSourceColor(
      argbFromHex(
        hslToHex(h, s, l),
      ),
    )

    allThemes.value[filtersStore.city].set(lineCode, {
      dark: {
        primary: hexFromArgb(theme.palettes.primary.tone(38.89)),
        text: hexFromArgb(theme.palettes.primary.tone(90)),
        textInverted: hexFromArgb(theme.palettes.primary.tone(20)),
        // primary50: hexFromArgb(theme.palettes.primary.tone(0)),
        // primary100: hexFromArgb(theme.palettes.primary.tone(5.56)),
        // primary200: hexFromArgb(theme.palettes.primary.tone(16.67)),
        // primary300: hexFromArgb(theme.palettes.primary.tone(27.78)),
        // primary400: hexFromArgb(theme.palettes.primary.tone(38.89)),
        // primary500: hexFromArgb(theme.palettes.primary.tone(50)),
        // primary600: hexFromArgb(theme.palettes.primary.tone(61.11)),
        // primary700: hexFromArgb(theme.palettes.primary.tone(72.22)),
        // primary800: hexFromArgb(theme.palettes.primary.tone(83.33)),
        // primary900: hexFromArgb(theme.palettes.primary.tone(94.44)),
        // primary950: hexFromArgb(theme.palettes.primary.tone(100)),
        bg: hexFromArgb(theme.palettes.neutral.tone(6)),
        bgMuted: hexFromArgb(theme.palettes.neutral.tone(12)),
        bgElevated: hexFromArgb(theme.palettes.neutral.tone(17)),
        bgAccented: hexFromArgb(theme.palettes.neutral.tone(22)),
      },
      light: {
        primary: hexFromArgb(theme.palettes.primary.tone(38.89)),
        text: hexFromArgb(theme.palettes.primary.tone(10)),
        textInverted: hexFromArgb(theme.palettes.primary.tone(95)),
        // primary50: hexFromArgb(theme.palettes.primary.tone(0)),
        // primary100: hexFromArgb(theme.palettes.primary.tone(5.56)),
        // primary200: hexFromArgb(theme.palettes.primary.tone(16.67)),
        // primary300: hexFromArgb(theme.palettes.primary.tone(27.78)),
        // primary400: hexFromArgb(theme.palettes.primary.tone(38.89)),
        // primary500: hexFromArgb(theme.palettes.primary.tone(50)),
        // primary600: hexFromArgb(theme.palettes.primary.tone(61.11)),
        // primary700: hexFromArgb(theme.palettes.primary.tone(72.22)),
        // primary800: hexFromArgb(theme.palettes.primary.tone(83.33)),
        // primary900: hexFromArgb(theme.palettes.primary.tone(94.44)),
        // primary950: hexFromArgb(theme.palettes.primary.tone(100)),
        bg: hexFromArgb(theme.palettes.neutral.tone(98)),
        bgMuted: hexFromArgb(theme.palettes.neutral.tone(94)),
        bgElevated: hexFromArgb(theme.palettes.neutral.tone(92)),
        bgAccented: hexFromArgb(theme.palettes.neutral.tone(90)),
      },
    })
  }

  const deleteTheme = (lineCode: string) => {
    allThemes.value[filtersStore.city].delete(lineCode)
  }

  return {
    createTheme,
    deleteTheme,
    allThemes,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    serializer: {
      serialize: (data) => {
        return JSON.stringify(data, (key, value) => {
          if (!key || (key !== 'istanbul' && key !== 'izmir')) return value

          if (value instanceof Map) {
            return Object.fromEntries(value)
          }

          return value
        })
      },
      deserialize: (data) => {
        return JSON.parse(data, (key, value) => {
          if (!key || (key !== 'istanbul' && key !== 'izmir')) return value

          return new Map(Object.entries(value))
        })
      },
    },
  },
})
