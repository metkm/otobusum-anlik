<script setup lang="ts">
import { motion } from 'motion-v'
import type { DropdownMenuItem } from '@nuxt/ui'

const open = ref(false)

const lineStore = useLineStore()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

const { cssVariableTemplate } = useLineTheme()
const { isFetching, dataUpdatedAt, refetch } = useLineBuses()
const { data: lineStopsData } = useLineStops()
const { code } = useLine()

const { remaining, start } = useCountdown(REFETCH_INTERVAL)
const isDesktop = useIsDesktop()

const isHidden = computed({
  get() {
    return settingsStore.hiddenLines.includes(toValue(code))
  },
  set(val: boolean) {
    if (val) {
      settingsStore.hiddenLines.push(toValue(code))
    }
    else {
      const i = settingsStore.hiddenLines.indexOf(toValue(code))
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
    onSelect: () => themeStore.refreshTheme(toValue(code)),
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
        lineStore.removeLine(toValue(code))
      }, 500)
    },
  },
]
</script>

<template>
  <div
    class="bg-default w-full mt-1 lg:ring-2 lg:ring-muted lg:rounded-md"
    :class="{ 'rounded-md ring-2 ring-muted': lineStore.lines.length > 1 }"
    :style="cssVariableTemplate"
  >
    <div class="flex items-center justify-between p-2 pl-2.5">
      <div class="flex items-center gap-2 overflow-hidden">
        <!-- <div class="size-6 border-4 border-primary rounded-md" /> -->

        <h1 class="font-bold select-none text-lg">
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

      <div class="flex gap-1">
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
              :style="cssVariableTemplate"
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

    <ol class="flex flex-col gap-2 text-sm max-h-36 overflow-y-auto p-2 pt-0">
      <li
        v-for="stop in lineStopsData"
        :key="stop.id"
        class="flex items-center gap-2"
      >
        <div class="border-4 border-muted size-10 rounded-full" />
        <p>{{ stop.stop_name }}</p>
      </li>
    </ol>
  </div>
</template>
