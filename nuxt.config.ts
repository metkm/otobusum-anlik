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
      viewport: 'viewport-fit=cover initial-scale=1.0',
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
    },
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  scripts: {
    registry: {
      googleMaps: {},
    },
  },
})
