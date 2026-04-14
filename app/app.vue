<script setup lang="ts">
import { App } from '@capacitor/app'

const router = useRouter()

App.addListener('backButton', () => {
  if (window.history.state.back) {
    router.back()
  } else {
    App.exitApp()
  }
})
</script>

<template>
  <main
    data-vaul-drawer-wrapper
    class="w-screen h-screen overflow-hidden"
  >
    <AppMapRoot>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </AppMapRoot>
  </main>
</template>
