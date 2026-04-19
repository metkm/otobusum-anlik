<script setup lang="ts">
import { motion } from 'motion-v'
import type { DropdownMenuItem, SelectMenuItem, SelectMenuValue } from '@nuxt/ui'

const drawerOpen = ref(false)
const dropdownOpen = ref(false)
const menuOpen = ref(false)

const lineStore = useLineStore()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

const { cssVariableTemplate } = useLineTheme()
const { query: lineBusesQuery } = useLineBuses()
const { query: lineRoutesQuery, route, routeCode } = useLineRoutes()
const { query: lineStopsQuery } = useLineStops()
const { code } = useLine()

const { remaining, start } = useCountdown(REFETCH_INTERVAL)
const isDesktop = useIsDesktop()

const routeItems = computed(
  () =>
    lineRoutesQuery.data.value?.map(route => ({
      label: route.name,
      value: route.code,
    })) as SelectMenuItem[] || [],
)

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

watch(
  lineBusesQuery.dataUpdatedAt,
  () => {
    const diff = Date.now() - lineBusesQuery.dataUpdatedAt.value

    start(Math.floor((REFETCH_INTERVAL - diff) / 1000))
  },
  {
    immediate: true,
  },
)

watch(remaining, (count) => {
  if (count !== 0) return

  lineBusesQuery.refetch()
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
      drawerOpen.value = false

      setTimeout(() => {
        lineStore.removeLine(toValue(code))
      }, 500)
    },
  },
]

const isMenuItemObject = (item: SelectMenuItem): item is Exclude<SelectMenuItem, SelectMenuValue> => {
  return typeof item === 'object' && item !== null
}
</script>

<template>
  <div
    class="flex flex-col bg-default w-full mt-1 lg:ring-2 lg:ring-muted lg:rounded-md"
    :class="{ 'rounded-md ring-2 ring-muted': lineStore.lines.length > 1 }"
    :style="cssVariableTemplate"
  >
    <div class="flex justify-between p-2 pl-3">
      <div class="flex items-center gap-2 overflow-hidden">
        <h1 class="font-bold select-none text-lg">
          {{ code }}
        </h1>

        <AnimatePresence mode="wait">
          <Motion
            v-if="lineBusesQuery.isFetching.value"
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
          v-model:open="dropdownOpen"
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
          v-model:open="drawerOpen"
          :set-background-color-on-scale="false"
          should-scale-background
        >
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
          />

          <template #content>
            <div class="flex flex-col gap-2">
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

    <ol
      v-if="lineStopsQuery.data?.value && (lineStopsQuery.data.value?.length > 1)"
      class="flex flex-col gap-2 text-sm max-h-22 overflow-y-auto px-2"
      :style="{
        'mask-image': 'linear-gradient(transparent, black 15%, black 85%, transparent)',
      }"
    >
      <li
        v-for="stop in lineStopsQuery.data.value"
        :key="stop.id"
        class="flex items-center gap-2"
      >
        <div class="flex justify-center items-center border-2 border-muted size-10 rounded-full">
          <UIcon
            v-if="lineBusesQuery.data.value?.find(b => b.closest_stop_code === stop.code)"
            name="i-lucide-bus-front"
            class="bg-primary rounded-full size-5"
          />
        </div>

        <p>{{ stop.name }}</p>
      </li>
    </ol>
    <ol
      v-else-if="lineStopsQuery.isFetching.value"
      class="flex flex-col gap-2 px-2"
    >
      <li
        v-for="i in 2"
        :key="i"
        class="flex items-center gap-2"
      >
        <USkeleton class="size-10" />
        <USkeleton class="h-6 w-1/2" />
      </li>
    </ol>
    <div
      v-else-if="lineStopsQuery.error.value"
      class="h-22 flex items-center justify-center"
    >
      <p class="text-muted text-sm font-medium">
        {{ lineStopsQuery.error.value.message }}
      </p>
    </div>

    <USelectMenu
      v-model="routeCode"
      v-model:open="menuOpen"
      :items="routeItems"
      class="m-2"
      variant="soft"
      value-key="value"
      :search-input="false"
      :disabled="routeItems.length <= 1"
      :portal="false"
    >
      <template #item="{ item }">
        <div
          v-if="isMenuItemObject(item)"
          class="flex items-center max-w-full gap-2"
        >
          <p class="text-center bg-primary text-inverted rounded-md w-20 p-1 shrink-0 truncate text-sm font-medium">
            {{ item.value.split('_').slice(1).join('_') }}
          </p>

          <p class="truncate">
            {{ item.label }}
          </p>
        </div>
      </template>

      <div class="flex items-center justify-center *:truncate w-full max-w-full gap-2">
        <template v-if="route">
          <p>{{ route?.name.split(' - ')[0] }}</p>
          <UIcon
            name="i-lucide-arrow-right"
            class="shrink-0"
          />
          <p>{{ route?.name.split(' - ')[1] }}</p>
        </template>
        <template v-else-if="lineRoutesQuery.isFetching.value">
          <USkeleton class="h-5 w-16" />
          <UIcon
            name="i-lucide-arrow-right"
            class="shrink-0"
          />
          <USkeleton class="h-5 w-16" />
        </template>
        <div v-else-if="lineRoutesQuery.error.value">
          <p>{{ lineRoutesQuery.error.value.message }}</p>
        </div>
      </div>
    </USelectMenu>
  </div>
</template>
