<script setup lang="ts">
definePageMeta({
  icon: 'i-lucide-map',
  label: 'Map',
})
</script>

<template>
  <div class="flex flex-col flex-1 relative">
    <AppMap>
      <LineMarker
        v-for="code in ['KM12', 'KM13']"
        :key="code"
        :code="code"
      />
    </AppMap>

    <div class="flex flex-col absolute bottom-0 inset-x-0">
      <div class="p-4 ml-auto">
        <UButton
          icon="i-lucide-search"
          color="neutral"
          variant="soft"
          size="lg"
          to="/search"
        />
      </div>

      <LineCards />
    </div>
  </div>
</template>
