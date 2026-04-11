<script setup lang="ts">
</script>

<template>
  <main
    class="flex flex-col overflow-hidden w-full h-full"
    data-vaul-drawer-wrapper
  >
    <AppMapRoot>
      <div class="flex flex-1 min-h-0">
        <NuxtPage />
      </div>

      <AppNavigation />
    </AppMapRoot>
  </main>
</template>
