<script setup lang="ts">
/// <reference types="google.maps" />

import { App } from '@capacitor/app'
import { SafeArea } from '@capacitor-community/safe-area'

const router = useRouter()

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: '#00000000', // transparent
    statusBarContent: 'light',
    navigationBarColor: '#00000000', // transparent
    navigationBarContent: 'light',
  },
})

App.addListener('backButton', () => {
  router.back()
})
</script>

<template>
  <main class="flex flex-col h-screen">
    <NuxtPage />
  </main>
</template>
