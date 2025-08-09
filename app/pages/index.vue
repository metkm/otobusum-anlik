<script setup lang="ts">
</script>

<template>
  <div class="-m-2 flex-1">
    <ScriptGoogleMaps
      class="flex grow !w-full !h-full !aspect-auto"
      :center="{ lat: 0, lng: 0 }"
      :map-options="{
        zoom: 4,
        disableDefaultUI: true,
      }"
    />
  </div>
</template>
