// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const needsAuth = to.path.startsWith('/dashboard') || to.meta.auth === true
  if (!needsAuth) return

  if (process.server) {
    // SSR: HttpOnly-Cookies sind hier verfügbar
    const session = useCookie('session_key')
    console.log('Auth Middleware (SSR): session_key=', session.value)
    if (!session.value) return navigateTo('/auth/lookup')
    return
  }

  // Client: HttpOnly ist unsichtbar → kurzer Auth-Ping
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  try {
    await $fetch(`${apiBaseUrl}/auth`, { credentials: 'include', cache: 'no-cache' })
  } catch {
    return navigateTo('/auth/lookup')
  }
})
