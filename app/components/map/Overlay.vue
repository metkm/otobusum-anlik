<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-between absolute inset-0 pointer-events-none content-padding">
    <div class="flex w-full pointer-events-auto">
      <div
        id="overlay"
        class="has-first:mr-2 mt-0.5"
      />

      <MapSearch />

      <!-- <div
        class="pointer-events-auto w-full max-w-lg"
        @click="navigateTo('/search')"
      >
        <Motion
          layout-id="search-bar"
          as-child
        >
          <UInput
            placeholder="Search"
            class="w-full pointer-events-none"
            size="lg"
            icon="i-lucide-search"
            layout-id="search-bar"
            :ui="{ base: 'ring-0 shadow bg-default/80 border border-dashed border-muted' }"
          />
        </Motion>
      </div> -->
    </div>

    <div class="-mb-2 -mx-2 pointer-events-auto">
      <TheLines />
      <!-- <TheNavigation /> -->
    </div>
  </div>
</template>
