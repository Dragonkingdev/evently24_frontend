// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],
   app: {
    head: {
      title: 'KnowPass',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ticket Sytsem für Jederman' }
      ],
        link: [
          { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  plugins: [
    { src: '~/plugins/bootstrap.client', mode: 'client' },
    { src: '~/plugins/theme.client', mode: 'client' },
  ],
  nitro: {
    devProxy: {
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:8000/api'
    }
  },
  compatibilityDate: '2025-09-08',
  devtools: { enabled: true }
})
