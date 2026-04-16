<script setup lang="ts">
const { data } = useLineBuses()
const { cssVariableTemplate } = useLineTheme()
</script>

<template>
  <ScriptGoogleMapsMarker
    v-for="bus in data"
    :key="bus.bus_id"
    :position="{ lng: bus.lng, lat: bus.lat }"
  >
    <template #content>
      <div
        :style="cssVariableTemplate"
        class="flex size-8 bg-primary rounded-full p-2 ring-2 ring-muted"
      >
        <UIcon
          name="i-lucide-bus-front"
          class="h-full w-full shrink-0 text-inverted"
        />
      </div>
    </template>
  </ScriptGoogleMapsMarker>
</template>
