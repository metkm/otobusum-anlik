<script setup lang="ts">
const { data } = useLineStops()
const { cssVariableTemplate } = useLineTheme()
</script>

<template>
  <ScriptGoogleMapsMarker
    v-for="stop in data"
    :key="stop.id"
    :position="{ lat: stop.y_coord, lng: stop.x_coord }"
  >
    <template #content>
      <div
        class="size-3 bg-muted ring-2 ring-muted rounded-lg"
        :style="cssVariableTemplate"
      />
    </template>
  </ScriptGoogleMapsMarker>
</template>
