<script setup lang="ts">
import { useLineBuses } from '~/hooks/useLinesBuses'
import { useLineTheme } from '~/hooks/useLineTheme'

const props = defineProps<{
  code: string
}>()

const { data } = useLineBuses(props.code)
const { cssVariableTemplate } = useLineTheme(props.code)
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
