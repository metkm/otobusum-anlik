import { useFiltersStore } from './filters'

export type City = 'izmir' | 'istanbul'

export const useLinesStore = defineStore('lines', () => {
  const filtersStore = useFiltersStore()

  const allLines = ref<Record<City, string[]>>({
    istanbul: [],
    izmir: [],
  })

  const lines = computed(() => allLines.value[filtersStore.city])

  const addLine = (lineCode: string) => {
    allLines.value[filtersStore.city].push(lineCode)
  }

  return {
    lines,
    addLine,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
