<script setup lang="ts">
import { SafeArea } from '@capacitor-community/safe-area'

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: '#00000000', // transparent
    statusBarContent: 'light',
    navigationBarColor: '#00000000', // transparent
    navigationBarContent: 'light',
  },
})

// StatusBar.setOverlaysWebView({ overlay: true })
</script>

<template>
  <main class="main p-2 flex flex-col h-screen">
    <NuxtPage />

    <!-- <UButton>
      sheet yeah
    </UButton> -->
  </main>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

.main {
  padding-top: calc(var(--safe-area-inset-top) + (var(--spacing) * 2));
}
</style>
