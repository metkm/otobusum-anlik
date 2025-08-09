<script setup lang="tsx">
import type { SlotsType } from 'vue'
import { useAPI } from '~/hooks/useAPI'
import type { SearchResult } from '~/models/search'

const query = useRouteQuery('q', '')
const queryDebounced = useDebounce(query, 500)

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

const SearchItem = defineComponent((props, { slots }) => {
  return () => {
    return (
      <div class="flex items-center gap-2 p-1 hover:bg-elevated/50 transition-colors rounded-(--ui-radius)">
        <div class="flex items-center justify-center bg-muted rounded-full px-4 py-1.5 min-w-20 aspect-[2/1]">
          {slots.default?.()}
        </div>

        <p>{props.title}</p>
      </div>
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
</script>

<template>
  <div class="flex flex-col max-w-lg w-full mx-auto items-center gap-2 content-padding">
    <UInput
      v-model="query"
      icon="i-lucide-search"
      size="xl"
      class="w-full"
      :ui="{ leading: 'pl-1' }"
      placeholder="Search"
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

    <div class="w-full">
      <ol>
        <li
          v-for="line in data?.lines"
          :key="line.code"
        >
          <SearchItem :title="line.title">
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

        <!-- <div class="bg-muted rounded-full px-4 py-1.5">
          <p>stop</p>
        </div>

        <p>
          {{ stop.stop_name }}
        </p> -->
        </li>
      </ol>
    </div>
  </div>
</template>
