<script setup lang="ts">
import { useLineBuses } from '~/hooks/useLinesBuses'

const props = defineProps<{
  code: string
}>()

const { data } = useLineBuses(props.code)

// const { data } = useQuery({
//   queryKey: [`line-${props.code}-buses`],
//   queryFn: () => CapacitorHttp.get({
//     url: `https://otobusum.metkm.win/bus-locations/${props.code}`,
//   }).then(response => response.data),
// })
</script>

<template>
  <ScriptGoogleMapsAdvancedMarkerElement
    v-for="bus in data"
    :key="bus.bus_id"
    :position="{ lng: bus.lng, lat: bus.lat }"
  >
    <template #content>
      <div class="flex size-8 bg-amber-400 rounded-full p-1">
        <UIcon
          name="i-lucide-bus-front"
          class="h-full w-full shrink-0"
        />
      </div>
    </template>
  </ScriptGoogleMapsAdvancedMarkerElement>
</template>
