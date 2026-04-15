<script setup lang="ts">
import { App } from '@capacitor/app'

const router = useRouter()

App.addListener('backButton', () => {
  if (window.history.state.back) {
    router.back()
  }
  else {
    App.exitApp()
  }
})
</script>

<template>
  <main
    data-vaul-drawer-wrapper
    class="flex w-screen h-screen overflow-hidden relative"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition-property: transform;
  transition-duration: 500ms;
  transition-timing-function: var(--default-transition-timing-function);
  position: fixed;
  inset: 0;
}

.page-enter-active {
  z-index: 50;
}

.page-leave-to {
  transform: translateX(-50px) translateZ(0);
}

.page-enter-from {
  transform: translateX(100%) translateZ(0);
}
</style>
