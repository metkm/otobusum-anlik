<script setup lang="ts">
definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})

const { lines } = useLinesStore()
const { invisibleLines } = useFiltersStore()

const visibleLines = computed(
  () => lines.filter(lineCode => !invisibleLines.includes(lineCode)),
)

const isReady = ref(false)
</script>

<template>
  <div class="flex-1 relative">
    <TheMap v-model:ready="isReady" />

    <!-- <MarkersStops
        v-for="lineCode in visibleLines"
        :key="lineCode"
        :line-code="lineCode"
      /> -->

    <MapOverlay />
  </div>
</template>

<style>
.hide-copy .gmnoprint {
  display: none;
}

.marker {
  width: 20px;
  height: 20px;
  background-color: red;
}
</style>
