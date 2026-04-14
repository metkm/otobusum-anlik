<script setup lang="ts">
import { useLineBuses } from '~/hooks/useLinesBuses'

const props = defineProps<{
  code: string
}>()

const { data } = useLineBuses(props.code)
</script>

<template>
  <ScriptGoogleMapsAdvancedMarkerElement
    v-for="bus in data"
    :key="bus.bus_id"
    :position="{ lng: bus.lng, lat: bus.lat }"
  >
    <template #content>
      <div class="flex size-8 bg-muted rounded-full p-2 ring-2 ring-muted shadow shadow-black">
        <UIcon
          name="i-lucide-bus-front"
          class="h-full w-full shrink-0"
        />
      </div>
    </template>
  </ScriptGoogleMapsAdvancedMarkerElement>
</template>
