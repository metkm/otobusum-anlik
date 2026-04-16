<script setup lang="ts">
import { motion } from 'motion-v'

const lineStore = useLineStore()

const container = useTemplateRef('container')

const { width: windowWidth } = useWindowSize()
const { width: containerWidth } = useElementSize(container)

const x = useMotionValue(0)

const constraintLeft = computed(() => {
  const pad = lineStore.lines.length > 1 ? 8 * 2 : 0
  const l = containerWidth.value - windowWidth.value + pad

  return -Math.max(0, l)
})

watch(constraintLeft, (l) => {
  x.set(l)
})

const isOneElement = computed(() => lineStore.lines.length <= 1)

const lineStyle = computed(() => ({
  width: `calc((${windowWidth.value}px - var(--spacing) * ${isOneElement.value ? 0 : 4}) - ${isOneElement.value ? 0 : 20}px)`,
}))
</script>

<template>
  <LayoutGroup>
    <motion.ol
      ref="container"
      class="flex gap-2 invisible-scrollbar lg:p-2"
      :class="{ 'p-2 pt-0': !isOneElement }"
      layout
      drag="x"
      :drag-constraints="{ left: constraintLeft, right: 0 }"
      :drag-elastic="0.1"
      :while-drag="{ cursor: 'grabbing' }"
      :style="{ x }"
    >
      <AnimatePresence>
        <motion.li
          v-for="code in lineStore.lines"
          :key="code"
          class="shrink-0  max-w-lg"
          :style="lineStyle"
          :exit="{ scale: 0.9, opacity: 0 }"
          :initial="{ scale: 0.9, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          layout
        >
          <LineContext :code="code">
            <LineCard :class="{ 'rounded-md': !isOneElement }" />
          </LineContext>
        </motion.li>
      </AnimatePresence>
    </motion.ol>
  </LayoutGroup>
</template>
