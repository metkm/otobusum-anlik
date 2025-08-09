<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-between absolute inset-0 pointer-events-none content-padding">
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

    <TheLines class="pointer-events-auto" />

    <!-- <ol>
      <li
        v-for="i in 50"
        :key="i"
      >
        <BusStop :index="i" />
      </li>
    </ol> -->
  </div>
</template>
