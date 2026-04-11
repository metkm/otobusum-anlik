export const useSettingsStore = defineStore('settings', () => {
  const initialMapCenter = ref({
    lat: 41.01354203681039,
    lng: 28.969362785019918,
  })

  const initialMapZoom = ref(10)

  // const initialMapBounds = ref<google.maps.LatLngBoundsLiteral>({
  //   south: 40.56683313799393,
  //   west: 28.686864943441908,
  //   north: 41.46106517763899,
  //   east: 29.252660841879408,
  // })

  return {
    initialMapCenter,
    initialMapZoom,
  }
})
