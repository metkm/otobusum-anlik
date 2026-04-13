<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})

const linesStore = useLinesStore()
</script>

<template>
  <div class="flex flex-col flex-1 h-full relative">
    <AppMap>
      <LineMarker
        v-for="code in linesStore.lines"
        :key="code"
        :code="code"
      />
    </AppMap>

    <div class="absolute inset-x-0 hidden lg:flex w-full max-w-lg">
      <PageSearchContent class="overflow-hidden max-h-96" />
    </div>

    <LayoutGroup>
      <motion.div
        layout
        class="absolute flex flex-col items-start bottom-0 inset-x-0 max-w-max"
      >
        <motion.div
          layout="position"
          class="lg:hidden"
        >
          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="soft"
            size="xl"
            to="search"
            square
            class="ml-2 mb-2"
          />
        </motion.div>

        <LineCards />
      </motion.div>
    </LayoutGroup>
  </div>
</template>
