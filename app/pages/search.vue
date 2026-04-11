<script setup lang="ts">
definePageMeta({
  layout: false,
})

const input = useTemplateRef('input')

onMounted(() => {
  input.value?.inputRef?.focus()
})
</script>

<template>
  <div class="flex-1 flex p-content">
    <UInput
      ref="input"
      placeholder="Search"
      size="xl"
      icon="i-lucide-search"
      class="w-full mt-auto"
      variant="soft"
    />
  </div>
</template>
