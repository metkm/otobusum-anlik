<script setup lang="ts">
import { useLineRoutes } from '~/hooks/useLineRoutes'
import { useLineTheme } from '~/hooks/useLineTheme'

const props = defineProps<{
  code: string
}>()

const { data } = useLineRoutes(props.code)
const { scheme } = useLineTheme(props.code)

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
