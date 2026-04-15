<script setup lang="ts">
import type { ShallowRef } from 'vue'
import { injectMapRootContext } from './AppMapRoot.vue'

const colorMode = useColorMode()
const settingsStore = useSettingsStore()

const mapRef = useTemplateRef('mapRef')

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

defineExpose({ mapRef })
</script>

<template>
  <ScriptGoogleMaps
    ref="mapRef"
    :key="colorMode.value"
    :map-options="{
      colorScheme: colorMode.value.toUpperCase(),
      center: settingsStore.initialMapCenter,
      zoom: settingsStore.initialMapZoom,
      disableDefaultUI: true,
    }"
    :api-key="apiKey"
    @ready="handleReady"
  >
    <slot />
  </ScriptGoogleMaps>
</template>

<style>
.gm-style-cc {
  display: none;
}
</style>
