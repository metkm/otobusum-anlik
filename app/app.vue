<script setup lang="ts">
/// <reference types="google.maps" />

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
  <main class="flex flex-col h-screen">
    <NuxtPage />

    <!-- <UButton>
      sheet yeah
    </UButton> -->
  </main>
</template>
