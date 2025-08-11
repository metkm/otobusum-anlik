<script setup lang="ts">
import { useMap, type MapRef } from '~/hooks/useMap'

const modelValueIsReady = defineModel<boolean>('ready', {
  required: false,
  default: false,
})

const { mapRef } = useMap()
const config = useRuntimeConfig()

const onGoogleMapsMount = (ref: Element | ComponentPublicInstance | null) => {
  mapRef.value = ref as MapRef
}

const onReady = () => {
  modelValueIsReady.value = true
}
</script>

<template>
  <ScriptGoogleMaps
    :ref="onGoogleMapsMount"
    class="flex grow !w-full !h-full !aspect-auto hide-copy pointer-events-all transition-all"
    :class="[modelValueIsReady ? 'opacity-100 delay-200' : 'opacity-0']"
    :center="{ lat: 40.87, lng: 29.19 }"
    :map-options="{
      zoom: 12,
      disableDefaultUI: true,
      colorScheme: 'DARK',
      mapId: config.public.mapId,
    }"
    trigger="immediate"
    @ready="onReady"
  >
    <template #placeholder>
      <div class="flex items-center justify-center w-full h-full">
        <p class="font-medium text-muted">
          placeholder
        </p>
      </div>
    </template>
  </ScriptGoogleMaps>
</template>
