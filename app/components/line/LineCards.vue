<script setup lang="ts">
import { motion } from 'motion-v'

const linesStore = useLinesStore()

const { width } = useWindowSize()

const isOneElement = computed(() => linesStore.lines.length <= 1)

const lineStyle = computed(() => ({
  width: `calc((${width.value}px - var(--spacing) * ${isOneElement.value ? 0 : 4}) - ${isOneElement.value ? 0 : 20}px)`,
}))
</script>

<template>
  <LayoutGroup>
    <ol
      class="flex gap-2 overflow-x-auto invisible-scrollbar max-w-full lg:p-2"
      :class="{ 'p-2 pt-0': !isOneElement }"
    >
      <AnimatePresence>
        <motion.li
          v-for="line in linesStore.lines"
          :key="line"
          class="shrink-0  max-w-lg"
          :style="lineStyle"
          :exit="{ scale: 0.9, opacity: 0 }"
          :initial="{ scale: 0.9, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          layout
        >
          <LineCard
            :code="line"
            :class="{ 'rounded-md': !isOneElement }"
          />
        </motion.li>
      </AnimatePresence>
    </ol>
  </LayoutGroup>
</template>
