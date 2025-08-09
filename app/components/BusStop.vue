<script setup lang="ts">
/// <reference types="google.maps" />

import { useMap } from '~/hooks/useMap'

const props = defineProps<{
  index: number
}>()

const { mapRef } = useMap()

const container = document.createElement('div')

watchEffect(async () => {
  await mapRef.value?.createAdvancedMapMarker({
    position: { lat: 0, lng: props.index * 0.9 },
    content: container,
  })
})
</script>

<template>
  <Teleport :to="container">
    <div class="w-4 h-4 bg-red-500 rounded-full" />
  </Teleport>
</template>
