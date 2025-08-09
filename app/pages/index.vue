<script setup lang="ts">
</script>

<template>
  <div class="-m-2 no-top-margin flex-1">
    <ScriptGoogleMaps
      class="flex grow !w-full !h-full !aspect-auto hide-copy"
      :center="{ lat: 0, lng: 0 }"
      :map-options="{
        zoom: 4,
        disableDefaultUI: true,
      }"
    />
  </div>
</template>

<style>
.hide-copy .gmnoprint {
  display: none;
}

.no-top-margin {
  margin-top: calc((var(--safe-area-inset-top) + var(--spacing)) * 2 * -1) !important;
}
</style>
