<script setup lang="ts">
import { motion } from 'motion-v'

const input = useTemplateRef('input')
const query = ref('')

onMounted(() => {
  input.value?.inputRef?.focus()
})
</script>

<template>
  <div class="flex flex-col max-w-md w-full">
    <UInput
      ref="input"
      v-model="query"
      placeholder="Search"
      icon="i-lucide-search"
      size="xl"
      :ui="{ base: 'ring-0' }"
    />

    <AnimatePresence>
      <motion.ol
        v-if="query"
        class="flex flex-col flex-1 bg-default rounded-md mt-2 p-2 overflow-y-auto lg:max-h-72"
        :exit="{ scale: 0.8, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :initial="{ scale: 0.8, opacity: 0 }"
        layout
      >
        <li
          v-for="i in 50"
          :key="i"
        >
          <p>{{ i }}</p>
        </li>
      </motion.ol>
    </AnimatePresence>
  </div>
</template>
