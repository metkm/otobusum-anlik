<script setup lang="ts">

</script>

<template>
  <div class="absolute inset-0 pointer-events-none content-padding">
    <UInput
      placeholder="Search"
      class="w-full max-w-md pointer-events-auto"
      size="xl"
      :ui="{ base: 'rounded-full' }"
      icon="i-lucide-search"
    />

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
