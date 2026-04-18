<script setup lang="ts">
const { query } = useLineStops()
const { cssVariableTemplate } = useLineTheme()
</script>

<template>
  <ScriptGoogleMapsMarker
    v-for="stop in query.data.value"
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
