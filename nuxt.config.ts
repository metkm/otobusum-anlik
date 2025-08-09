// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/scripts'],
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      scripts: {
        googleMaps: {
          apiKey: '',
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
})
