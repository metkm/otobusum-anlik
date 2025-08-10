<script setup lang="ts">
import { useAPI } from '~/hooks/useAPI'
import type { Stop } from '~/models/stop'

const props = defineProps<{
  lineCode: string
}>()

const { data, status } = await useAPI<Stop[]>(`/route-stops/${props.lineCode}`, {
  query: {
    direction: 'G',
  },
  lazy: true,
})
</script>

<template>
  <section class="overflow-y-auto max-h-full h-full fading-edge">
    <div
      v-if="status === 'pending'"
      layout
      class="flex items-center justify-center h-full p-2"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin size-8"
      />
    </div>
    <ol v-else-if="data">
      <li
        v-for="(stop, index) in data"
        :key="stop.stop_code"
        class="flex items-center gap-2 p-1"
      >
        <p class="text-sm font-semibold w-6 text-center">
          {{ index }}
        </p>

        <div class="size-10 border-2 rounded-full shrink-0" />

        <p class="text-sm">
          {{ stop.stop_name }}
        </p>
      </li>
    </ol>
  </section>
</template>
