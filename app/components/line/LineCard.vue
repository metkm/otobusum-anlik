<script setup lang="ts">
import { REFETCH_INTERVAL, useLineBuses } from '~/hooks/useLinesBuses'
import { motion } from 'motion-v'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  code: string
}>()

const open = ref(false)

const linesStore = useLinesStore()

const { isFetching, dataUpdatedAt } = useLineBuses(props.code)
const { remaining, start } = useCountdown(REFETCH_INTERVAL)

const isDesktop = useMediaQuery('(min-width: 768px)')

watch(dataUpdatedAt, () => {
  const diff = Date.now() - dataUpdatedAt.value

  start(Math.floor((REFETCH_INTERVAL - diff) / 1000))
}, {
  immediate: true,
})

const items: DropdownMenuItem[] = [
  {
    label: 'Add To Group',
    icon: 'i-lucide-circle-plus',
  },
  {
    label: 'Delete Line',
    icon: 'i-lucide-trash-2',
    color: 'error',
    onSelect: () => {
      open.value = false

      setTimeout(() => {
        linesStore.removeLine(props.code)
      }, 500)
    },
  },
]
</script>

<template>
  <div class="flex items-center justify-between gap-2 w-full bg-default p-2.5 lg:rounded-md">
    <div class="flex items-center gap-2 overflow-hidden">
      <h1 class="font-medium">
        {{ code }}
      </h1>

      <AnimatePresence mode="wait">
        <Motion
          v-if="isFetching"
          :initial="{ translateY: -50 }"
          :animate="{ translateY: 0 }"
          :exit="{ translateY: -50 }"
          as-child
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="animate-spin size-4"
          />
        </Motion>

        <motion.p
          v-else
          class="text-xs text-muted"
          :initial="{ translateY: 50 }"
          :animate="{ translateY: 0 }"
          :exit="{ translateY: 50 }"
        >
          {{ remaining }} sec to update
        </motion.p>
      </AnimatePresence>
    </div>

    <UDropdownMenu
      v-if="isDesktop"
      :items="items"
    >
      <UButton
        icon="i-lucide-menu"
        variant="ghost"
        color="neutral"
        size="sm"
      />
    </UDropdownMenu>

    <UDrawer
      v-else
      v-model:open="open"
      should-scale-background
      :set-background-color-on-scale="false"
    >
      <UButton
        icon="i-lucide-menu"
        variant="ghost"
        color="neutral"
      />

      <template #content>
        <div class="flex flex-col gap-2">
          <UButton
            v-for="item in items"
            :key="item.label!"
            :color="item.color ?? 'neutral'"
            :icon="item.icon"
            square
            block
            size="lg"
            class="py-4"
            variant="soft"
            @click="item.onSelect"
          >
            {{ item.label }}
          </UButton>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
