<script setup lang="ts">
/// <reference types="google.maps" />

import { useMap } from '~/hooks/useMap'

const props = defineProps<{
  index: number
}>()

// const element = useTemplateRef('element')
const { mapRef } = useMap()

const element = document.createElement('div')
element.className = 'marker'

watchEffect(async () => {
  const marker = await mapRef.value?.createAdvancedMapMarker({
    position: { lat: 0, lng: props.index * 0.9 },
    content: element,
  })
})
</script>
