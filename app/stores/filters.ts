import type { City } from './lines'

export const useFiltersStore = defineStore('filter', () => {
  const city = ref<City>('istanbul')
  const invisibleLines = ref<string[]>([])

  const toggleLineVisibility = (lineCode: string) => {
    const index = invisibleLines.value.indexOf(lineCode)

    if (index !== -1) {
      invisibleLines.value.splice(index, 1)
    }
    else {
      invisibleLines.value.push(lineCode)
    }
  }

  return {
    city,
    toggleLineVisibility,
    invisibleLines,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
