// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'motion-v/nuxt',
  ],
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      viewport: 'viewport-fit=cover, initial-scale=1',
    },
    layoutTransition: {
      name: 'page',
    },
  },
  css: [`~/assets/main.css`],
  runtimeConfig: {
    public: {
      scripts: {
        googleMaps: {
          apiKey: '', // NUXT_PUBLIC_SCRIPTS_GOOGLE_MAPS_API_KEY
        },
      },
      baseUrl: '',
    },
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  icon: {
    clientBundle: {
      icons: [
        'lucide:search',
        'lucide:circle-plus',
        'lucide:trash-2',
        'lucide:loader-circle',
        'lucide:menu',
        'lucide:bus-front',
        'lucide:map',
        'lucide:settings',
        'lucide:clock',
        'lucide:eye',
        'lucide:eye-off',
      ],
    },
  },
})
