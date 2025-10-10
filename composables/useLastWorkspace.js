// composables/useLastWorkspace.js
export const useLastWorkspace = () => {
  const KEY = 'last_wid'
  const cookie = useCookie(KEY, { sameSite: 'lax' })

  const lastWid = useState('last_wid', () => {
    let id = null
    if (cookie.value != null) {
      const parsed = parseInt(cookie.value, 10)
      id = Number.isFinite(parsed) ? parsed : null
    }
    if (process.client && id == null) {
      try {
        const raw = localStorage.getItem(KEY)
        const parsed = raw ? parseInt(raw, 10) : null
        id = Number.isFinite(parsed) ? parsed : null
      } catch {}
    }
    return id
  })

  const setLast = (id) => {
    const safe = Number.isFinite(id) ? Number(id) : null
    lastWid.value = safe
    cookie.value = safe != null ? String(safe) : null
    if (process.client) {
      try {
        if (safe != null) localStorage.setItem(KEY, String(safe))
        else localStorage.removeItem(KEY)
      } catch {}
    }
  }

  return { lastWid, setLast }
}
