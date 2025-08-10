<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
  lineCode: string
}>()

const filtersStore = useFiltersStore()
const linesStore = useLinesStore()

const isInvisible = computed(() => filtersStore.invisibleLines.includes(props.lineCode))
</script>

<template>
  <div
    class="flex flex-col gap-2 p-2 bg-(--ui-bg) rounded-lg h-48 max-w-lg"
  >
    <motion.div
      layout
      class="flex items-center justify-between"
    >
      <p class="font-bold text-xl">
        {{ props.lineCode }}
      </p>

      <div class="flex gap-2 items-center">
        <UButton
          :icon="isInvisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          color="neutral"
          variant="ghost"
          @click="filtersStore.toggleLineVisibility(lineCode)"
        />

        <UDrawer>
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
          />

          <template #body>
            <div class="flex flex-col gap-4">
              <UButton
                icon="i-lucide-circle-plus"
                variant="soft"
                color="neutral"
              >
                Add to group
              </UButton>
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="soft"
                @click="linesStore.deleteLine(lineCode)"
              >
                Delete line
              </UButton>
            </div>
          </template>
        </UDrawer>
      </div>
    </motion.div>

    <LineStops :line-code="lineCode" />
  </div>
</template>
