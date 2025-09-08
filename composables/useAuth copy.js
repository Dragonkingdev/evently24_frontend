// composables/useAuth.js
export const useAuth = () => {
  const sessionKey = useCookie('session_key') // persistente Session
  const emailCookie = useCookie('user_email')  
  const user = useState('user', () => emailCookie.value ? { email: emailCookie.value } : null)

  const authenticated = useState('authenticated', () => false)
  const authReady = useState('auth_ready', () => false)

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
      emailCookie.value = email
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
    if (!sessionKey.value) {
      // trotzdem lokalen Zustand aufräumen
      sessionKey.value = null
      emailCookie.value = null
      user.value = null
      return
    }

    try {
      await $fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        body: {
          email: user.value?.email || emailCookie.value,
          session_key: sessionKey.value,
        },
      })
    } catch {
      // ignorieren/optional toast
    } finally {
      sessionKey.value = null
      emailCookie.value = null
      user.value = null
    }
  }

  // 🔎 CHECK SESSION
  const fetchUser = async () => {
    // Wenn keine Session -> raus
    if (!sessionKey.value) return

    const email = user.value?.email || emailCookie.value || null
    try {
      const data = await $fetch(`${apiBase}/auth/authenticated`, {
        method: 'POST',
        body: {
          // Falls dein Backend Email nicht braucht, entferne die Zeile:
          email,
          session_key: sessionKey.value,
        },
      })

      if (data?.authenticated) {
        if (email) {
          // Email ggf. aus Cookie in State nachziehen
          user.value = { email }
        }
      } else {
        await logout()
      }
    } catch {
      await logout()
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
    authReady,
    isLoggedIn: computed(() => !!user.value && !!sessionKey.value),
  }
}
