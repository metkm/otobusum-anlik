<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-between absolute inset-0 pointer-events-none content-padding">
    <div class="flex items-center w-full pointer-events-auto">
      <div
        id="overlay"
        class="has-first:mr-2"
      />
      <!-- <UButton
        icon="i-lucide-menu"
        variant="soft"
        color="neutral"
      /> -->

      <div
        class="pointer-events-auto w-full max-w-xl"
        @click="navigateTo('/search')"
      >
        <Motion
          layout-id="search-bar"
          as-child
        >
          <UInput
            placeholder="Search"
            class="w-full pointer-events-none"
            size="xl"
            icon="i-lucide-search"
            layout-id="search-bar"
          />
        </Motion>
      </div>
    </div>

    <div class="-mb-2 -mx-2 pointer-events-auto">
      <TheLines />
      <!-- <TheNavigation /> -->
    </div>
  </div>
</template>
