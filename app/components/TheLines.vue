<script setup lang="ts">
const linesStore = useLinesStore()
</script>

<template>
  <LayoutGroup>
    <UCarousel
      v-slot="{ item }"
      :items="linesStore.lines"
      class="-mx-2 -mb-2 pointer-events-auto"
      :ui="{
        item: 'max-w-lg basis-[95%] ps-2',
        viewport: 'p-2 overflow-hidden',
        container: 'items-end -ms-2',
      }"
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
  </LayoutGroup>

  <!-- <motion.ol
    layout-scroll
    class="flex items-end gap-2 overflow-x-auto pointer-events-auto -mx-2 -mb-2 p-2"
  >
    <LayoutGroup>
      <AnimatePresence>
        <motion.li
          v-for="lineCode in linesStore.lines"
          :key="lineCode"
          layout
          :exit="{ opacity: 0 }"
        >
          <TheLine :line-code="lineCode" />
        </motion.li>
      </AnimatePresence>
    </LayoutGroup>
  </motion.ol> -->
</template>
