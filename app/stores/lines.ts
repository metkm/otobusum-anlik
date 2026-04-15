export const Cities = {
  ISTANBUL: 'istanbul',
  IZMIR: 'izmir',
} as const

type City = typeof Cities[keyof typeof Cities]

export const useLinesStore = defineStore('lines', () => {
  const selectedCity = ref<City>('istanbul')

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
  }

  const addLine = (code: string) => {
    if (lines.value.includes(code))
      return

    lines.value.push(code)
  }

  return {
    lines,
    selectedCity,
    removeLine,
    addLine,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
