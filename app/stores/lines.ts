import { useFiltersStore } from './filters'

export type City = 'izmir' | 'istanbul'

export const useLinesStore = defineStore('lines', () => {
  const filtersStore = useFiltersStore()

  const lines = ref<Record<City, string[]>>({
    istanbul: [],
    izmir: [],
  })

  const currentLines = computed(() => lines.value[filtersStore.city])

  const addLine = (lineCode: string) => {
    lines.value[filtersStore.city].push(lineCode)
  }

  return {
    lines,
    currentLines,
    addLine,
  }
}, {
  persist: true,
})
