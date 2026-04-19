<script setup lang="ts">
const { query } = useLineBuses()
const { routeCode } = useLineRoutes()

const { cssVariableTemplate } = useLineTheme()

const busesFiltered = computed(
  () => (query.data.value || [])
    .filter(b => b.route_code == routeCode.value),
)
</script>

<template>
  <ScriptGoogleMapsMarker
    v-for="bus in busesFiltered"
    :key="bus.bus_id"
    :position="{ lng: bus.lng, lat: bus.lat }"
  >
    <template #content>
      <div
        class="flex size-8 bg-primary rounded-full p-2 ring-2 ring-muted"
        :style="cssVariableTemplate"
      >
        <UIcon
          name="i-lucide-bus-front"
          class="h-full w-full shrink-0 text-inverted"
        />
      </div>
    </template>
  </ScriptGoogleMapsMarker>
</template>
