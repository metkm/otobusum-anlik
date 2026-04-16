<script setup lang="ts">
import { REFETCH_INTERVAL, useLineBuses } from '~/hooks/useLineBuses'
import { motion } from 'motion-v'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useIsDesktop } from '~/hooks/useIsDesktop'

const props = defineProps<{
  code: string
}>()

const open = ref(false)

const lineStore = useLineStore()
const themeStore = useThemeStore()
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
    label: 'Add to group',
    icon: 'i-lucide-circle-plus',
  },
  {
    label: 'Refresh theme',
    icon: 'i-lucide-palette',
    onSelect: () => themeStore.refreshTheme(props.code),
  },
  {
    type: 'separator',
  },
  {
    label: 'Delete line',
    icon: 'i-lucide-trash-2',
    color: 'error',
    onSelect: () => {
      open.value = false

      setTimeout(() => {
        lineStore.removeLine(props.code)
      }, 500)
    },
  },
]
</script>

<template>
  <LineTheme
    v-slot="{ cssVariables }"
    :code="code"
  >
    <div
      class="flex items-center bg-default justify-between gap-2 w-full p-2.5 mt-1 lg:ring-2 lg:ring-muted lg:rounded-md"
      :class="{ 'rounded-md ring-2 ring-muted': lineStore.lines.length > 1 }"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <div class="bg-primary size-4 rounded-md" />

        <h1 class="font-medium select-none">
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
          should-scale-background
        >
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
          />

          <template #content>
            <div
              class="flex flex-col gap-2"
              :style="cssVariables"
            >
              <template
                v-for="item in items"
                :key="item.label!"
              >
                <UButton
                  v-if="item.label"
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
              </template>
            </div>
          </template>
        </UDrawer>
      </div>
    </div>
  </LineTheme>
</template>
