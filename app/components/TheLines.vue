<script setup lang="ts">
const linesStore = useLinesStore()
</script>

<template>
  <ol class="flex gap-4 p-4 overflow-x-auto hide-scrollbar -mx-4 -mb-4">
    <li
      v-for="line in linesStore.currentLines"
      :key="line"
      class="bg-muted rounded-(--ui-radius) p-4"
    >
      <p class="font-bold">
        {{ line }}
      </p>
    </li>
  </ol>
</template>
