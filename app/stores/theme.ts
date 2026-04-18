import { hexFromArgb } from '@material/material-color-utilities'

interface Scheme {
  'ui-primary': string
  'ui-bg': string
  'ui-bg-muted': string
  'ui-bg-elevated': string
  'ui-text': string
  'ui-text-inverted': string
  'ui-border': string
  'ui-border-muted': string
}

export interface Schemes {
  dark: Scheme
  light: Scheme
}

export const useThemeStore = defineStore('theme', () => {
  const cityStore = useLineStore()

  const themesByCity = ref<Record<City, Record<string, Schemes>>>({
    istanbul: {},
    izmir: {},
  })

  const themes = computed(() => themesByCity.value[cityStore.selectedCity])

  const addTheme = (code: string) => {
    const { schemes, palettes } = createRandomTheme()

    themesByCity.value[cityStore.selectedCity][code] = {
      dark: {
        'ui-primary': hexFromArgb(schemes.dark.primary),
        'ui-bg': hexFromArgb(schemes.dark.surface),
        'ui-bg-muted': hexFromArgb(palettes.neutral.tone(12)),
        'ui-bg-elevated': hexFromArgb(palettes.neutral.tone(17)),
        'ui-text': hexFromArgb(schemes.dark.onSurface),
        'ui-text-inverted': hexFromArgb(schemes.dark.inverseOnSurface),
        'ui-border': hexFromArgb(schemes.dark.outline),
        'ui-border-muted': hexFromArgb(schemes.dark.outlineVariant),
      },
      light: {
        'ui-primary': hexFromArgb(schemes.light.primary),
        'ui-bg': hexFromArgb(schemes.light.surface),
        'ui-bg-muted': hexFromArgb(palettes.neutral.tone(94)),
        'ui-bg-elevated': hexFromArgb(palettes.neutral.tone(92)),
        'ui-text': hexFromArgb(schemes.light.onSurface),
        'ui-text-inverted': hexFromArgb(schemes.light.inverseOnSurface),
        'ui-border': hexFromArgb(schemes.light.outline),
        'ui-border-muted': hexFromArgb(schemes.light.outlineVariant),
      },
    }
  }

  const refreshTheme = (code: string) => addTheme(code)

  const removeLine = (code: string) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete themesByCity.value[cityStore.selectedCity][code]
  }

  return {
    addTheme,
    themes,
    themesByCity,
    refreshTheme,
    removeLine,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
