<script setup lang="ts">
const linesStore = useLinesStore()
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="linesStore.lines"
    class="-mx-4 -mb-4 pointer-events-auto"
    :ui="{ item: 'max-w-lg basis-[90%]', viewport: 'p-4' }"
    contain-scroll="keepSnaps"
  >
    <Motion
      :key="item"
      layout
      :layout-id="item"
    >
      <TheLine :line-code="item" />
    </Motion>
  </UCarousel>
</template>
