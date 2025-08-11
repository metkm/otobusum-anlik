<script setup lang="ts">
import { motion } from 'motion-v'
import { useLineTheme } from '~/hooks/useLineTheme'

const props = defineProps<{
  lineCode: string
}>()

const { scheme } = useLineTheme(props.lineCode)

const filtersStore = useFiltersStore()
const linesStore = useLinesStore()

const isInvisible = computed(() => filtersStore.invisibleLines.includes(props.lineCode))
</script>

<template>
  <div class="flex flex-col gap-2 p-2 bg-default rounded-lg h-48 max-w-lg theme-colors">
    <motion.div
      layout
      class="flex items-center justify-between"
    >
      <div>
        <p class="font-bold text-xl">
          {{ props.lineCode }}
        </p>
        <p class="text-xs text-muted">
          update in 0 seconds
        </p>
      </div>

      <div class="flex gap-2 items-center">
        <UButton
          :icon="isInvisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          color="neutral"
          variant="soft"
          @click="filtersStore.toggleLineVisibility(lineCode)"
        />
        <!-- variant="ghost" -->

        <UDrawer
          should-scale-background
          set-background-color-on-scale
          :title="props.lineCode"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="soft"
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

<style scoped>
.theme-colors {
  --ui-primary:  v-bind('scheme?.primary');
  --ui-text: v-bind('scheme?.text')
  --ui-text-inverted: v-bind('scheme?.textInverted')
  /* --ui-color-primary-50:  v-bind('scheme?.primary50');
  --ui-color-primary-100: v-bind('scheme?.primary100');
  --ui-color-primary-200: v-bind('scheme?.primary200');
  --ui-color-primary-300: v-bind('scheme?.primary300');
  --ui-color-primary-400: v-bind('scheme?.primary400');
  --ui-color-primary-500: v-bind('scheme?.primary500');
  --ui-color-primary-600: v-bind('scheme?.primary600');
  --ui-color-primary-700: v-bind('scheme?.primary700');
  --ui-color-primary-800: v-bind('scheme?.primary800');
  --ui-color-primary-900: v-bind('scheme?.primary900');
  --ui-color-primary-950: v-bind('scheme?.primary950'); */
  --ui-bg: v-bind('scheme?.bg');
  --ui-bg-muted: v-bind('scheme?.bgMuted');
  --ui-bg-elevated: v-bind('scheme?.bgElevated');
  --ui-bg-accented: v-bind('scheme?.bgAccented');
}
</style>
