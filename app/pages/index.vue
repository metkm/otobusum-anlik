<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})

// const isDesktop = useMediaQuery('(min-width: 768px)')
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

    <UInput
      placeholder="Search"
      class="absolute max-w-lg left-page-left right-page-right top-page-top"
      icon="i-lucide-search"
      size="xl"
    />

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
            to="/search"
            square
            class="ml-2 mb-2"
          />
        </motion.div>

        <LineCards />
      </motion.div>
    </LayoutGroup>
    <!-- </di v> -->
  </div>
</template>
