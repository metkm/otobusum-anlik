<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})

const linesStore = useLinesStore()
const settingsStore = useSettingsStore()

const linesFiltered = computed(() => linesStore.lines.filter(code => !settingsStore.hiddenLines.includes(code)))
</script>

<template>
  <div class="flex w-full h-full relative">
    <AppMapRoot>
      <AppMap
        ref="map"
        class="flex-1"
      >
        <LineMarkerBuses
          v-for="code in linesFiltered"
          :key="code"
          :code="code"
        />
      </AppMap>

      <PageSearchContent class="absolute m-safe hidden lg:flex" />

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
    </AppMapRoot>
  </div>
</template>
