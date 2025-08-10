import { useFiltersStore } from './filters'

export type City = 'izmir' | 'istanbul'

export const useLinesStore = defineStore('lines', () => {
  const filtersStore = useFiltersStore()

  const allLines = ref<Record<City, string[]>>({
    istanbul: [],
    izmir: [],
  })

  const lines = computed(
    () => allLines.value[filtersStore.city] || [],
  )

  const addLine = (lineCode: City) => {
    allLines.value[filtersStore.city].push(lineCode)
  }

  const deleteLine = (lineCode: City) => {
    const targetIndex = allLines.value[filtersStore.city]
      .findIndex(line => line === lineCode)

    if (targetIndex !== -1) {
      allLines.value[filtersStore.city].splice(targetIndex, 1)
    }
  }

  return {
    lines,
    allLines,
    addLine,
    deleteLine,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
