<script setup lang="ts">
import { App } from '@capacitor/app'

const router = useRouter()

App.addListener('backButton', () => {
  router.back()
})
</script>

<template>
  <main
    data-vaul-drawer-wrapper
    class="flex flex-col h-full w-full flex-1"
  >
    <AppMapRoot>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </AppMapRoot>
  </main>
</template>
