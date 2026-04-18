<script setup lang="ts">
const { query } = useLineRoutes()
const { scheme } = useLineTheme()

const routePath = computed(() => query.data.value?.[0]?.route_path || [])
</script>

<template>
  <ScriptGoogleMapsPolyline
    :options="{
      path: routePath,
      strokeColor: scheme?.['ui-primary'],
      strokeWeight: 5,
    }"
  />
</template>
