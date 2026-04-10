<script setup lang="ts">
</script>

<template>
  <main class="flex flex-col overflow-hidden w-full h-full">
    <div class="flex flex-1 min-h-0">
      <NuxtPage />
    </div>

    <!-- <ScriptGoogleMaps
      :center="{ lat: -33.8688, lng: 151.2093 }"
      :zoom="12"
      :map-options="{
        colorScheme: 'DARK',
        cameraControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        streetViewControl: false,
        zoomControl: false,
        scaleControl: false,
      }"
      class="w-full! flex-1 min-h-0"
    /> -->

    <AppNavigation />
  </main>
</template>
