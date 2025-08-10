<script setup lang="ts">
import { useAPI } from '~/hooks/useAPI'
import type { Stop } from '~/models/stop'

const props = defineProps<{
  lineCode: string
}>()

const routeCode = `${props.lineCode}_G_D0`

const { data } = await useAPI<Stop[]>(`/route-stops/${props.lineCode}`, {
  query: {
    direction: 'G',
  },
})
</script>

<template>
  <MapMarker
    v-for="stop in data"
    :key="stop.stop_code"
    :position="{ lat: stop.y_coord, lng: stop.x_coord }"
  >
    <div class="w-4 h-4 rounded-full bg-elevated border border-muted" />
  </MapMarker>
</template>
