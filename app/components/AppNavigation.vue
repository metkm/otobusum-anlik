<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isDesktop = useIsDesktop()

const routes = router.options.routes
  .toReversed()
  .filter(r => r.meta?.icon && (isDesktop ? r.name !== 'index' : true))

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <nav class="pb-[env(safe-area-inset-bottom)]">
    <DefineTemplate>
      <ol class="flex lg:flex-col items-center">
        <li
          v-for="_route in routes"
          :key="_route.path"
          class="flex-1"
        >
          <UButton
            block
            :to="isDesktop ? { name: 'index', query: { s: _route.name as string } } : { name: route.name }"
            variant="ghost"
            :icon="route.meta!.icon"
            class="gap-0.5 flex-col items-center text-xs"
            color="neutral"
            square
          >
            <template #leading>
              <div
                class="flex items-center rounded-full px-3 py-0.5 lg:py-3"
                :class="{ 'bg-accented': _route.path === route.path }"
              >
                <UIcon
                  :name="_route.meta!.icon"
                  class="size-4.5"
                />
              </div>
            </template>

            <p class="lg:hidden">
              {{ _route.meta!.label }}
            </p>
          </UButton>
        </li>
      </ol>
    </DefineTemplate>

    <ReuseTemplate v-if="!isDesktop" />

    <aside
      v-else
      class="fixed left-page-left top-page-top bg-default rounded-md ring ring-muted"
    >
      <ReuseTemplate />
    </aside>
  </nav>
</template>
