<script setup lang="ts">
const router = useRouter()
const isDesktop = useMediaQuery('(min-width: 768px)')

const routes = router.options.routes.filter(route => !!route.meta?.icon)
</script>

<template>
  <section class="bg-default">
    <ul class="flex items-center w-full">
      <li
        v-for="route in routes"
        :key="route.name"
        class="flex-1"
      >
        <UButton
          :icon="(route.meta!.icon as string)"
          color="neutral"
          class="w-full rounded-none flex-col gap-0"
          variant="ghost"
          size="md"
          block
          :ui="{ label: 'text-xs' }"
          :label="(route.meta?.label as string | undefined)"
          :to="route.path"
        />
      </li>
    </ul>
  </section>
</template>
