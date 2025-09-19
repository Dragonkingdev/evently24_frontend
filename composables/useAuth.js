// composables/useAuth.js
export const useAuth = () => {
  const user = useState('user', () => null)
  const authReady = useState('auth_ready', () => false)
  const apiBase = useRuntimeConfig().public.apiBaseUrl

  const ssrHeaders = () =>
    process.server ? { cookie: useRequestHeaders(['cookie']).cookie || '' } : undefined

  // 🔎 Lookup (existiert E-Mail?)
  const lookup = async (email) => {
    try {
      const data = await $fetch(`${apiBase}/v1/auth/check-email`, {
        method: 'POST',
        body: { email },
        credentials: 'include',
        headers: ssrHeaders(),
        cache: 'no-store'
      })
      return !!data?.email_taken
    } catch {
      throw new Error('Fehler bei der E-Mail-Prüfung')
    }
  }

  // 🔐 Login – Server setzt HttpOnly-Cookie
  const login = async ({ email, password }) => {
    await $fetch(`${apiBase}/v1/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
      headers: ssrHeaders(),
      cache: 'no-store'
    })
    await fetchUser()
  }

  // 🆕 Register
  const register = async ({ email, password, firstName, lastName }) => {
    await $fetch(`${apiBase}/v1/auth/register`, {
      method: 'POST',
      body: { email, password, firstName, lastName },
      credentials: 'include',
      headers: ssrHeaders(),
      cache: 'no-store'
    })
    await fetchUser()
  }

  // 🚪 Logout
  const logout = async () => {
    try {
      await $fetch(`${apiBase}/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: ssrHeaders(),
        cache: 'no-store'
      })
    } finally {
      user.value = null
    }
  }

  // 👤 Me
  const fetchUser = async () => {
    try {
      const data = await $fetch(`${apiBase}/v1/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: ssrHeaders(),
        cache: 'no-store'
      })
      user.value = data?.user || null
    } catch {
      user.value = null
    } finally {
      authReady.value = true
    }
  }

  return {
    lookup,
    login,
    register,
    logout,
    fetchUser,
    user,
    authReady,
    isLoggedIn: computed(() => !!user.value)
  }
}
