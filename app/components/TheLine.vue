<script setup lang="ts">
const props = defineProps<{
  lineCode: string
}>()

const filtersStore = useFiltersStore()
const linesStore = useLinesStore()

const isInvisible = computed(() => filtersStore.invisibleLines.includes(props.lineCode))
</script>

<template>
  <div class="bg-muted/50 backdrop-blur-3xl rounded-(--ui-radius) p-4 flex items-center justify-between gap-2 pointer-events-auto">
    <p class="font-bold">
      {{ props.lineCode }}
    </p>

    <div class="flex items-center">
      <UButton
        :icon="isInvisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        color="neutral"
        variant="ghost"
        @click="filtersStore.toggleLineVisibility(lineCode)"
      />

      <UButton
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        @click="linesStore.deleteLine(lineCode)"
      />
    </div>
  </div>
</template>
