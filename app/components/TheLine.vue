<script setup lang="ts">
const props = defineProps<{
  lineCode: string
}>()

const filtersStore = useFiltersStore()

const isInvisible = computed(() => filtersStore.invisibleLines.includes(props.lineCode))
</script>

<template>
  <div class="bg-muted/50 backdrop-blur-3xl rounded-(--ui-radius) p-4 flex items-center gap-4 pointer-events-auto">
    <p class="font-bold">
      {{ props.lineCode }}
    </p>

    <UButton
      :icon="isInvisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
      color="neutral"
      variant="ghost"
      @click="filtersStore.toggleLineVisibility(lineCode)"
    />
  </div>
</template>
