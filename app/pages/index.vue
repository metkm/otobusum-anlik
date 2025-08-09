<script setup lang="ts">
const isReady = ref(false)
</script>

<template>
  <div class="flex-1">
    <TheMap v-model:ready="isReady" />

    <template v-if="isReady">
      <TheMapOverlay />
    </template>
  </div>
</template>

<style>
.hide-copy .gmnoprint {
  display: none;
}

.marker {
  width: 20px;
  height: 20px;
  background-color: red;
}
</style>
