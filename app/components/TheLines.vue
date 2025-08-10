<script setup lang="ts">
const linesStore = useLinesStore()
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="linesStore.lines"
    class="-mx-4 -mb-4"
    :ui="{ item: 'max-w-lg basis-[90%]', viewport: 'p-4' }"
    contain-scroll="keepSnaps"
  >
    <TheLine
      :line-code="item"
    />
  </UCarousel>
</template>
