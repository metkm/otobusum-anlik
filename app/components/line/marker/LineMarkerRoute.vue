<script setup lang="ts">
const { data } = useLineRoutes()
const { scheme } = useLineTheme()

const routePath = computed(() => data.value?.[0]?.route_path || [])
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
