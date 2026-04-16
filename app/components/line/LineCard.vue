<script setup lang="ts">
import { REFETCH_INTERVAL, useLineBuses } from '~/hooks/useLinesBuses'
import { motion } from 'motion-v'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useIsDesktop } from '~/hooks/useIsDesktop'

const props = defineProps<{
  code: string
}>()

const open = ref(false)

const linesStore = useLinesStore()
const settingsStore = useSettingsStore()

const { isFetching, dataUpdatedAt, refetch } = useLineBuses(props.code)
const { remaining, start } = useCountdown(REFETCH_INTERVAL)
const isDesktop = useIsDesktop()

const isHidden = computed({
  get() {
    return settingsStore.hiddenLines.includes(props.code)
  },
  set(val: boolean) {
    if (val) {
      settingsStore.hiddenLines.push(props.code)
    }
    else {
      const i = settingsStore.hiddenLines.indexOf(props.code)
      settingsStore.hiddenLines.splice(i, 1)
    }
  },
})

watch(dataUpdatedAt, () => {
  const diff = Date.now() - dataUpdatedAt.value

  start(Math.floor((REFETCH_INTERVAL - diff) / 1000))
}, {
  immediate: true,
})

watch(remaining, (count) => {
  if (count !== 0)
    return

  refetch()
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
  <AppTheme :code="code">
    <div
      class="flex items-center bg-default ring-2 ring-muted justify-between gap-2 w-full p-2.5 mt-1 lg:rounded-md"
      :class="{ 'rounded-md': linesStore.lines.length > 1 }"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <div class="bg-primary size-4 rounded-md" />

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

      <div class="flex gap-2">
        <UButton
          :icon="isHidden ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          variant="ghost"
          color="neutral"
          @click="isHidden = !isHidden"
        />

        <UDropdownMenu
          v-if="isDesktop"
          :items="items"
          :portal="false"
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
          :set-background-color-on-scale="false"
          :portal="false"
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
    </div>
  </AppTheme>
</template>
