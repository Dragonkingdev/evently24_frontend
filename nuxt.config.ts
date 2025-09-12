// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],
   app: {
    head: {
      title: 'Evently - Ticket System',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ticket System für Jedermann' }
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
    // PROD & DEV: RouteRules-Proxy (funktioniert in beiden Umgebungen)
    routeRules: {
      // /api/... -> http://localhost:8000/api/...
      '/api/**': { proxy: 'http://localhost:8000/api/**' }
    }
  },
  runtimeConfig: {
    public: {
      // WICHTIG: gleiche Origin nutzen → kein CORS, Cookies funktionieren
      apiBaseUrl: '/api',
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      stripePk: process.env.NUXT_PUBLIC_STRIPE_PK,
    }
  },
  compatibilityDate: '2025-09-08',
  devtools: { enabled: true }
})
