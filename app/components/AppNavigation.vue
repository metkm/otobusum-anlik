<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const routes = router.options.routes
  .toReversed()
  .filter(r => r.meta?.icon)
</script>

<template>
  <nav class="pb-[env(safe-area-inset-bottom)]">
    <ol class="flex">
      <li
        v-for="_route in routes"
        :key="_route.path"
        class="flex-1"
      >
        <UButton
          block
          :to="_route.path"
          variant="ghost"
          :icon="route.meta!.icon"
          class="gap-0.5 flex-col items-center text-xs"
          color="neutral"
        >
          <template #leading>
            <div
              class="flex items-center rounded-full px-3 py-0.5"
              :class="{ 'bg-accented': _route.path === route.path }"
            >
              <UIcon
                :name="_route.meta!.icon"
                class="size-4.5"
              />
            </div>
          </template>

          {{ _route.meta!.label }}
        </UButton>
      </li>
    </ol>
  </nav>
</template>
