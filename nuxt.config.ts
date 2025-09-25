// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/public/css/main.css'
  ],
  app: {
    head: {
      title: 'Evently – Event & Tickets in deiner Region',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Entdecke Events, Festivals & Locations in deiner Region. Tickets sichern – direkt über Fountain.' }
      ],
        link: [
          { rel: 'icon', type: 'image/png', href: '/favicon.png' },
          { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css' }
      ]
    }
  },
  plugins: [
    { src: '~/plugins/bootstrap.client', mode: 'client' },
    { src: '~/plugins/theme.client', mode: 'client' },
  ],
  imports: {
    dirs: [
      'composables',
    ]
  },
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
