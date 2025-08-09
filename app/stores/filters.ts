import type { City } from './lines'

export const useFiltersStore = defineStore('filter', () => {
  const city = ref<City>('istanbul')

  return {
    city,
  }
}, {
  persist: true,
})
