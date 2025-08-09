<script setup lang="ts">
/// <reference types="google.maps" />

import { useMap } from '~/hooks/useMap'

const props = defineProps<{
  position: google.maps.LatLngLiteral
}>()

const { mapRef } = useMap()
const marker = shallowRef<google.maps.marker.AdvancedMarkerElement>()

const container = document.createElement('div')

watchEffect(async () => {
  console.log(mapRef.value)
  marker.value = await mapRef.value?.createAdvancedMapMarker({
    position: props.position,
    content: container,
  })
})

onUnmounted(() => {
  console.log('removing marker')
  marker.value?.remove()
})
</script>

<template>
  <Teleport :to="container">
    <slot />
    <!-- <div class="w-4 h-4 bg-red-500 rounded-full" /> -->
  </Teleport>
</template>
