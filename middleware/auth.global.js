// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const { authReady, isLoggedIn, fetchUser } = useAuth()
  if (!authReady.value) await fetchUser()

  // Seiten-Flags
  const needsAuth = to.meta.auth === true
    || to.path.startsWith('/w/')
    || to.path.startsWith('/business')
    || to.path.startsWith('/checkout')
    
  const guestOnly = to.meta.guest === true || to.path.startsWith('/auth')

  // Redirect säubern (kein externes Ziel, kein /auth/*)
  const sanitizeRedirect = (q, fallback = '/') => {
    if (!q || typeof q !== 'string') return fallback
    try { q = decodeURIComponent(q) } catch {}
    if (!q.startsWith('/') || q.startsWith('//')) return fallback
    if (q.startsWith('/auth')) return fallback
    return q
  }

  // Eingeloggt + Gast-Seite? → weg
  if (guestOnly && isLoggedIn.value) {
    const safe = sanitizeRedirect(to.query.redirect, '/')
    return navigateTo(safe)
  }

  // Geschützte Seite + nicht eingeloggt? → zur Lookup inkl. Rücksprung
  if (needsAuth && !isLoggedIn.value) {
    const wanted = sanitizeRedirect(to.fullPath, '/') // z.B. /business
    return navigateTo(`/auth/lookup?redirect=${encodeURIComponent(wanted)}`)
  }
})