<script setup lang="ts">
const linesStore = useLinesStore()
</script>

<template>
  <ol class="flex gap-4 p-4 overflow-x-auto hide-scrollbar pointer-events-auto -mx-4 -mb-4">
    <li
      v-for="lineCode in linesStore.lines"
      :key="lineCode"
    >
      <TheLine :line-code="lineCode" />
    </li>
  </ol>
</template>
