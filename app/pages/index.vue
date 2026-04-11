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

    <!-- <div class="flex flex-col justify-between absolute inset-0 pointer-events-none"> -->
    <!-- <div class="absolute w-full max-w-lg"> -->
    <UInput
      placeholder="Search"
      class="absolute max-w-lg left-page-left right-page-right top-page-top"
      icon="i-lucide-search"
      size="xl"
      variant="soft"
    />
    <!-- </div> -->
    <!-- class="absolute mt-page-top ml-page-left mr-page-right w-full max-w-lg" -->

    <LayoutGroup>
      <motion.div
        layout
        class="absolute flex flex-col bottom-0 inset-x-0 max-w-max"
      >
        <!-- <motion.div layout>
          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="soft"
            size="xl"
            to="/search"
            square
          />
        </motion.div> -->

        <LineCards />
      </motion.div>
    </LayoutGroup>
    <!-- </di v> -->
  </div>
</template>
