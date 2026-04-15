<script setup lang="ts">
import { motion } from 'motion-v'
import { isStop, SEARCH_KEY_LIMIT, useSearch } from '~/hooks/useSearch'

defineProps<{
  autofocus?: boolean
  autofocusDelay?: number
}>()

const inputRef = useTemplateRef('inputRef')

const query = ref('')

const { data, error, isFetching } = useSearch(query)
const linesStore = useLinesStore()

const merged = computed(() => [
  ...(data.value?.lines || []),
  ...(data.value?.stops || []),
])

defineExpose({
  inputRef,
})
</script>

<template>
  <div class="flex flex-col max-w-md w-full">
    <UInput
      ref="inputRef"
      v-model="query"
      placeholder="Search"
      icon="i-lucide-search"
      size="xl"
      :loading="isFetching"
      :autofocus="autofocus"
      :autofocus-delay="autofocusDelay"
    />

    <p
      v-if="SEARCH_KEY_LIMIT - query.length >= 0"
      class="bg-default rounded-md py-1.5 px-3 w-max text-sm text-muted font-medium mt-1"
    >
      {{ SEARCH_KEY_LIMIT - query.length }} keys are needed for search
    </p>

    <AnimatePresence>
      <motion.ol
        v-if="data"
        class="flex flex-col flex-1 bg-default rounded-md mt-2 overflow-y-auto lg:max-h-72 text-sm"
        :exit="{ scale: 0.9, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :initial="{ scale: 0.9, opacity: 0 }"
      >
        <template v-if="merged.length > 0">
          <li
            v-for="item in merged"
            :key="isStop(item) ? item.id : item.code"
            class="flex items-center gap-2"
          >
            <UButton
              variant="ghost"
              color="neutral"
              class="gap-4 w-full"
              square
              @click="() => {
                if (isStop(item))
                  return

                linesStore.addLine(item.code)
              }"
            >
              <template v-if="isStop(item)">
                <p>{{ item.stop_name }}</p>
              </template>
              <template v-else>
                <p class="font-medium bg-muted rounded-md px-3 py-2">
                  {{ item.code }}
                </p>
                <p class="text-center w-full">
                  {{ item.title }}
                </p>
              </template>
            </UButton>
          </li>
        </template>
        <p
          v-else-if="error"
          class="p-2 m-auto"
        >
          Error! {{ error.message }}
        </p>
        <p
          v-else-if="merged.length === 0"
          class="p-2 m-auto"
        >
          No results found.
        </p>
      </motion.ol>
    </AnimatePresence>
  </div>
</template>
