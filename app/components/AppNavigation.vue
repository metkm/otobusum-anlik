<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const routes = router.options.routes.toReversed()
</script>

<template>
  <nav class="pb-[env(safe-area-inset-bottom)]">
    <ol class="flex">
      <div
        class="fixed rounded-full bg-accented will-change-transform transition-all"
        :style="{
          positionAnchor: '--this',
          top: 'anchor(top)',
          bottom: 'anchor(bottom)',
          left: 'anchor(left)',
          right: 'anchor(right)',
        }"
      />

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
              :style="{ anchorName: _route.path == route.path ? '--this' : '--nope' }"
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
