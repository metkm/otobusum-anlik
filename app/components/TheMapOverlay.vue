<script setup lang="ts">

</script>

<template>
  <div class="absolute inset-0 pointer-events-none content-padding">
    <div
      class="pointer-events-auto"
      @click="navigateTo('/search')"
    >
      <UInput
        placeholder="Search"
        class="w-full max-w-md pointer-events-none"
        size="xl"
        icon="i-lucide-search"
      />
    </div>

    <ol>
      <li
        v-for="i in 50"
        :key="i"
      >
        <BusStop :index="i" />
      </li>
    </ol>
  </div>
</template>
