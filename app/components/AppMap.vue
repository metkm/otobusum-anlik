<script setup lang="ts">
import type { ShallowRef } from 'vue'
import { injectMapRootContext } from './AppMapRoot.vue'

const colorMode = useColorMode()
const settingsStore = useSettingsStore()

const mapRootContext = injectMapRootContext()

const apiKey = import.meta.env.NUXT_PUBLIC_SCRIPTS_GOOGLE_MAPS_API_KEY

const debouncedMapCenterChange = useDebounceFn(() => {
  const map = mapRootContext.map.value
  if (!map)
    return

  const center = map.getCenter()
  const zoom = map.getZoom()

  if (center) {
    settingsStore.initialMapCenter = center.toJSON()
  }

  if (zoom) {
    settingsStore.initialMapZoom = zoom
  }
}, 250)

const handleReady = ({ map }: { map: ShallowRef<google.maps.Map | undefined> }) => {
  mapRootContext.map.value = map.value

  if (!map.value)
    return

  map.value.addListener('center_changed', debouncedMapCenterChange)
}
</script>

<template>
  <ScriptGoogleMaps
    :key="colorMode.value"
    :map-options="{
      colorScheme: colorMode.value.toUpperCase(),
      cameraControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false,
      scaleControl: false,
      center: settingsStore.initialMapCenter,
      zoom: settingsStore.initialMapZoom,
    }"
    class="w-full! flex-1 min-h-0"
    :api-key="apiKey"
    @ready="handleReady"
  >
    <slot />
  </ScriptGoogleMaps>
</template>
