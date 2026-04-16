<script setup lang="ts">
const route = useRoute()

const s = computed(() => route.query.s as string | undefined)

const open = ref(false)

watch(s, (s) => {
  open.value = !!s
})

watch(open, (o) => {
  if (s.value && !o) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <NuxtPage class="flex-1" />

    <USlideover
      v-model:open="open"
      inset
      :ui="{ content: 'max-w-1/3' }"
    >
      <template #content>
        <div />

        <RouterView
          v-if="s"
          :name="s"
          class="pl-2!"
        />
      </template>
    </USlideover>

    <AppNavigation />
  </div>
</template>
