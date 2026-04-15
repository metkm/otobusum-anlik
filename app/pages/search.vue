<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <AppSearch
      autofocus
      :autofocus-delay="500"
    />
  </div>
</template>
