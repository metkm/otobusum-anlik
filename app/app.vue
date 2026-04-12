<script setup lang="ts">
import { App } from '@capacitor/app'

const router = useRouter()

App.addListener('backButton', () => {
  router.back()
})

console.log(router.options.routes)
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
