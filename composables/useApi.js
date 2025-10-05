// composables/useApi.js
export function useApi () {
  const { public: { apiBase, apiBaseUrl } } = useRuntimeConfig()
  const baseURL = apiBase || apiBaseUrl || 'http://localhost:8000/api'

  // Wird in setup/SSR sicher gelesen
  const ssrCookieHeader = process.server ? (useRequestHeaders(['cookie']).cookie || undefined) : undefined

  // Session-Key (als Bearer)
  const sessionKey = useCookie('session_key')

  // Header-Builder: keine Composables mehr zur Laufzeit!
  const buildHeaders = (extra = {}) => {
    const h = { ...(extra || {}) }
    // SSR: eingehende Cookies an Backend durchreichen (falls gebraucht)
    if (process.server && ssrCookieHeader) {
      h.cookie = ssrCookieHeader
    }
    // Auth über Session-Key (Cookie wird auch im Browser mitgeschickt via credentials)
    if (sessionKey.value) {
      h.Authorization = `Bearer ${sessionKey.value}`
    }
    return h
  }

  async function request (method, path, opts = {}) {
    const shouldThrow = opts.throw === true
    const maxRetries = opts.retries ?? 0
    let attempt = 0, lastErr = null

    while (attempt <= maxRetries) {
      try {
        const payload = await $fetch(path, {
          method,
          baseURL,
          headers: buildHeaders(opts.headers),
          params: opts.params,
          body: opts.body,
          // Browser: Cookies mitsenden. Server: irrelevant, da wir cookie-Header direkt setzen.
          credentials: process.client ? 'include' : 'same-origin',
          timeout: opts.timeout ?? 15000
        })
        return { data: payload, error: null }
      } catch (error) {
        lastErr = error
        if (shouldThrow) throw error
        if (attempt++ >= maxRetries) break
        await new Promise(r => setTimeout(r, 300 * attempt))
      }
    }
    return { data: null, error: lastErr }
  }

  const get   = (path, params, opts = {}) => request('GET', path,   { ...opts, params })
  const post  = (path, body,   opts = {}) => request('POST', path,  { ...opts, body })
  const put   = (path, body,   opts = {}) => request('PUT', path,   { ...opts, body })
  const del   = (path, params, opts = {}) => request('DELETE', path,{ ...opts, params })
  const patch = (path, body,   opts = {}) => request('PATCH', path, { ...opts, body })

  // Roh-$fetch mit gleichen Default-Headern
  const $ = (path, opts = {}) =>
    $fetch(path, {
      baseURL,
      headers: buildHeaders(opts.headers),
      credentials: process.client ? 'include' : 'same-origin',
      ...opts
    })

  return { $, get, post, put, del, patch }
}
