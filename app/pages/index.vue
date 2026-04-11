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

    <LineCards />
  </div>
</template>
