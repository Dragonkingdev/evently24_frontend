// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const needsAuth = to.path.startsWith('/dashboard') || to.meta.auth === true
  if (!needsAuth) return

  if (process.server) {
    // SSR: HttpOnly-Cookies sind hier verfügbar
    const session = useCookie('session_key')
    if (!session.value) return navigateTo('/user/lookup')
    return
  }

  // Client: HttpOnly ist unsichtbar → kurzer Auth-Ping
  try {
    await $fetch('/api/user/auth', { credentials: 'include', cache: 'no-cache' })
  } catch {
    return navigateTo('/user/lookup')
  }
})
