<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-between absolute inset-0 pointer-events-none content-padding">
    <div
      class="pointer-events-auto"
      @click="navigateTo('/search')"
    >
      <Motion
        layout-id="search-bar"
        as-child
      >
        <UInput
          placeholder="Search"
          class="w-full max-w-xl pointer-events-none"
          size="xl"
          icon="i-lucide-search"
          layout-id="search-bar"
        />
      </Motion>
    </div>

    <div class="-mb-2 -mx-2 pointer-events-auto">
      <TheLines />
      <!-- <TheNavigation /> -->
    </div>
  </div>
</template>
