<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})
</script>

<template>
  <div class="flex flex-col flex-1 relative">
    <AppMap>
      <LineMarker
        v-for="code in ['KM12', 'KM13']"
        :key="code"
        :code="code"
      />
    </AppMap>

    <LayoutGroup>
      <motion.div
        layout
        class="flex flex-col absolute bottom-0 inset-x-0"
      >
        <motion.div
          layout
          class="p-2"
        >
          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="soft"
            size="xl"
            to="/search"
            square
          />
        </motion.div>

        <LineCards />
      </motion.div>
    </LayoutGroup>
  </div>
</template>
