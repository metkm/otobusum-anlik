<script setup lang="ts">
import type { ShallowRef } from 'vue'

definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})

const colorMode = useColorMode()

const handleReady = ({ map }: { map: ShallowRef<google.maps.Map | undefined> }) => {
  map.value?.addListener('center_changed', () => {
    console.log('new center', map.value?.getCenter())
  })
}
</script>

<template>
  <ScriptGoogleMaps
    :key="colorMode.value"
    :center="{ lat: -33.8688, lng: 151.2093 }"
    :zoom="12"
    :map-options="{
      colorScheme: colorMode.value.toUpperCase(),
      cameraControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false,
      scaleControl: false,
    }"
    class="w-full! flex-1 min-h-0"
    @ready="handleReady"
  />
</template>
