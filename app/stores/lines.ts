export const Cities = {
  ISTANBUL: 'istanbul',
  IZMIR: 'izmir',
} as const

type City = typeof Cities[keyof typeof Cities]

export const useLinesStore = defineStore('lines', () => {
  const selectedCity = ref<City>('istanbul')

  const linesByCity = ref<Record<City, string[]>>({
    istanbul: ['KM12', 'KM13'],
    izmir: [],
  })

  const lines = computed(() => linesByCity.value[selectedCity.value])

  const removeLine = (code: string) => {
    const ci = linesByCity.value[selectedCity.value].indexOf(code)
    if (ci === -1)
      return

    linesByCity.value[selectedCity.value].splice(ci, 1)
  }

  return {
    lines,
    selectedCity,
    removeLine,
  }
}, {
  persist: true,
})
