<script setup lang="tsx">
import { UButton } from '#components'
import type { SlotsType } from 'vue'
import { useAPI } from '~/hooks/useAPI'
import type { SearchResult } from '~/models/search'

const query = useRouteQuery('q', '')
const queryDebounced = useDebounce(query, 500)

const linesStore = useLinesStore()

const { data, execute, status } = useAPI<SearchResult>('/search', {
  query: {
    q: queryDebounced,
  },
  immediate: false,
})

watch(queryDebounced, () => {
  if (queryDebounced.value) {
    execute()
  }
}, {
  immediate: true,
})

const SearchItem = defineComponent((props, { slots, attrs }) => {
  return () => {
    return (
      <UButton variant="ghost" color="neutral" class="w-full" {...attrs}>
        <div class="flex items-center justify-center bg-muted rounded-full px-4 py-1.5 min-w-20 aspect-[2/1]">
          {slots.default?.()}
        </div>

        <p>{props.title}</p>
      </UButton>
    )
  }
}, {
  props: {
    title: String,
  },
  slots: Object as SlotsType<{
    default?: () => unknown
  }>,
})

const onPressLine = async (lineCode: string) => {
  const message = linesStore.addLine(lineCode)

  if (message) {
    console.log(message)
    return
  }

  await navigateTo('/')
}
</script>

<template>
  <div class="flex flex-col max-w-xl w-full mx-auto items-center gap-2 content-padding">
    <Motion
      layout-id="search-bar"
      as-child
    >
      <UInput
        v-model="query"
        icon="i-lucide-search"
        size="xl"
        class="w-full"
        placeholder="Search"
        autofocus
        :ui="{ leading: 'ps-2' }"
      >
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            :loading="status === 'pending'"
            to="/"
          />
        </template>
      </UInput>
    </Motion>

    <div class="w-full">
      <ol>
        <li
          v-for="line in data?.lines"
          :key="line.code"
        >
          <SearchItem
            :title="line.title"
            @click="onPressLine(line.code)"
          >
            {{ line.code }}
          </SearchItem>
        </li>
      </ol>

      <ol>
        <li
          v-for="stop in data?.stops"
          :key="stop.stop_code"
        >
          <SearchItem :title="stop.stop_name">
            <UIcon name="i-lucide-flag" />
          </SearchItem>
        </li>
      </ol>
    </div>
  </div>
</template>
