<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isDesktop = useMediaQuery('(min-width: 768px)')

const routes = router.options.routes.filter(route => !!route.meta?.icon)
console.log(routes)

const [DefineNavigationTemplate, ReuseNavigationTemplate] = createReusableTemplate()
</script>

<template>
  <section class="bg-default">
    <DefineNavigationTemplate>
      <ul
        class="flex items-center w-full"
        :class="{ 'flex-col': isDesktop }"
      >
        <li
          v-for="_route in routes"
          :key="_route.name"
          class="flex-1 w-full"
        >
          <UButton
            :icon="(route.meta!.icon as string)"
            color="neutral"
            class="w-full flex-col gap-0 group"
            size="md"
            variant="ghost"
            block
            :ui="{ label: 'text-xs' }"
            :label="(_route.meta?.label as string | undefined)"
            :to="_route.path"
          >
            <template #leading>
              <div
                class="flex items-center justify-center rounded-full px-4 h-5 group-hover:bg-accented"
                :class="{ 'bg-muted': _route.name === route.name }"
              >
                <UIcon
                  :name="(_route.meta?.icon as string)"
                  class="size-5"
                />
              </div>
            </template>
          </UButton>
        </li>
      </ul>
    </DefineNavigationTemplate>

    <ReuseNavigationTemplate v-if="!isDesktop" />
    <Teleport
      v-else
      to="#overlay"
      defer
    >
      <UDrawer
        title="Navigation"
        direction="left"
        should-scale-background
        set-background-color-on-scale
      >
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
        />

        <template #body>
          <ReuseNavigationTemplate />
        </template>
      </UDrawer>
    </Teleport>
  </section>
</template>
