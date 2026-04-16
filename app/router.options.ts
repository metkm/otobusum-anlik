import type { RouterConfig } from '@nuxt/schema'

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions#routes
  routes: _routes => [
    ..._routes,
    {
      name: 'index',
      path: '/',
      components: {
        default: () => import (`~/pages/index.vue`),
        settings: () => import (`~/pages/settings.vue`),
        timetable: () => import (`~/pages/timetable.vue`),
      },
      // component: () => import('~/pages/home.vue'),
    },
  ],
} satisfies RouterConfig
