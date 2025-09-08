// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const needsAuth = to.meta.auth === true || to.path.startsWith('/dashboard')
  if (!needsAuth) return

  const { authReady, isLoggedIn, fetchUser } = useAuth()
  if (!authReady.value) await fetchUser()

  if (!isLoggedIn.value) {
    return navigateTo(`/auth/lookup?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
