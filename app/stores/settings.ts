export const useSettingsStore = defineStore('settings', () => {
  const hiddenLines = ref<string[]>([])

  const initialMapCenter = ref({
    lat: 41.01354203681039,
    lng: 28.969362785019918,
  })

  const initialMapZoom = ref(10)

  return {
    initialMapCenter,
    initialMapZoom,
    hiddenLines,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
