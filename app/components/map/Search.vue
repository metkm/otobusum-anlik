<script setup lang="tsx">
import { UButton } from '#components'
import type { SlotsType } from 'vue'
import { useAPI } from '~/hooks/useAPI'
import type { SearchResult } from '~/models/search'
import { motion } from 'motion-v'

const query = useRouteQuery('q', '')
const queryDebounced = useDebounce<string>(query, 500)

const linesStore = useLinesStore()

const { data, execute, status, clear } = useAPI<SearchResult>('/search', {
  query: {
    q: queryDebounced,
  },
  immediate: false,
})

const SearchItem = defineComponent((props, { slots, attrs }) => {
  return () => {
    return (
      <UButton variant="ghost" color="neutral" class="w-full" {...attrs}>
        <div class="flex items-center justify-center bg-muted rounded-full px-4 py-1.5">
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
}

watch(queryDebounced, () => {
  if (queryDebounced.value && queryDebounced.value.length >= 2) {
    execute()
  }

  if (queryDebounced.value.length < 2) {
    clear()
  }
}, {
  immediate: true,
})

const shouldExpand = computed(
  () => (data.value && data.value.lines.length > 1) || status.value === 'pending',
)
</script>

<template>
  <div class="flex w-full max-w-full bg-red-500 overflow-hidden">
    <UInput
      v-model="query"
      size="lg"
      icon="i-lucide-search"
      :loading="status === 'pending'"
      placeholder="Search"
      :class="{ 'w-[calc-size(content,size)] basis-full transition-all': shouldExpand }"
      :ui="{ base: 'focus:calc-size(content,size) focus:basis-full transition-[width]' }"
    />

    <ol
      v-if="data && data.lines.length > 1"
      class="max-h-80 mt-2 bg-default rounded-lg overflow-y-auto"
    >
      <motion.li
        v-for="line in data?.lines"
        :key="line.code"
        layout
      >
        <SearchItem
          :title="line.title"
          @click="onPressLine(line.code)"
        >
          {{ line.code }}
        </SearchItem>
      </motion.li>
    </ol>
  </div>
</template>
