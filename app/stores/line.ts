export const Cities = {
  ISTANBUL: 'istanbul',
  IZMIR: 'izmir',
} as const

export type City = typeof Cities[keyof typeof Cities]

export const useLineStore = defineStore('lines', () => {
  const themeStore = useThemeStore()

  const selectedCity = ref<City>('istanbul')

  const routesByCity = ref<Record<City, Record<string, string>>>({
    istanbul: {},
    izmir: {},
  })

  const routes = computed(() => routesByCity.value[selectedCity.value])

  const linesByCity = ref<Record<City, string[]>>({
    istanbul: ['KM12'],
    izmir: [],
  })

  const lines = computed({
    get() {
      return linesByCity.value[selectedCity.value]
    },
    set(code: string) {
      linesByCity.value[selectedCity.value].push(code)
    },
  })

  const removeLine = (code: string) => {
    const ci = lines.value.indexOf(code)
    if (ci === -1)
      return

    linesByCity.value[selectedCity.value].splice(ci, 1)
    themeStore.removeLine(code)
  }

  const addLine = (code: string) => {
    if (lines.value.includes(code))
      return

    lines.value.push(code)
    themeStore.addTheme(code)
  }

  return {
    lines,
    routes,
    selectedCity,
    routesByCity,
    removeLine,
    addLine,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
