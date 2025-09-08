export const useAuth = () => {
  const sessionKey = useCookie('session_key') // persistente Session
  const user = useState('user', () => null)
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  // 📧 CHECK EMAIL (Identifikation)
  const lookup = async (email) => {
    try {
      const data = await $fetch(`${apiBase}/auth/check-email`, {
        method: 'POST',
        body: { email },
      })
      return data.email_taken
    } catch (err) {
      throw new Error('Fehler bei der E-Mail-Prüfung')
    }
  }

  // 🔐 LOGIN
  const login = async ({ email, password }) => {
    try {
      const data = await $fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })

      console.log('Login response:', data)

      if (!data?.session_key) {
        throw new Error('Login fehlgeschlagen')
      }

      sessionKey.value = data.session_key
      user.value = { email }

    } catch (err) {
      throw new Error('Login fehlgeschlagen')
    }
  }

  // 🆕 REGISTER
  const register = async ({ email, password }) => {
    try {
      await $fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        body: { email, password },
      })

      // Optional: auto-login
      await login({ email, password })
    } catch (err) {
      throw new Error('Registrierung fehlgeschlagen')
    }
  }

  // 🚪 LOGOUT
  const logout = async () => {
    if (!user.value || !sessionKey.value) return

    try {
      await $fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        body: {
          email: user.value.email,
          session_key: sessionKey.value,
        },
      })
    } catch (err) {
      // ignorieren oder anzeigen
    } finally {
      sessionKey.value = null
      bearer.value = null
      user.value = null
    }
  }

  // 🔎 CHECK SESSION
  const fetchUser = async () => {
    if (!sessionKey.value || !user.value?.email) return

    try {
      const data = await $fetch(`${apiBase}/auth/authenticated`, {
        method: 'POST',
        body: {
          email: user.value.email,
          session_key: sessionKey.value,
        },
      })

      if (!data?.authenticated) {
        logout()
      }
    } catch (err) {
      logout()
    }
  }

  return {
    lookup,
    login,
    register,
    logout,
    fetchUser,
    user,
    sessionKey,
    isLoggedIn: computed(() => !!user.value && !!sessionKey.value),
  }
}
