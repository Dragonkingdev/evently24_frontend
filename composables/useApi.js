// composables/useApi.js
export function useApi () {
  const { public: { apiBase, apiBaseUrl } } = useRuntimeConfig()
  const baseURL = apiBase || apiBaseUrl || 'http://localhost:8000/api'

  const sessionKey = useCookie('session_key') // statt token

  function headers () {
    const h = {}
    if (process.server) Object.assign(h, useRequestHeaders(['cookie']))
    // Öffentliche Endpunkte brauchen das nicht; schadet aber nicht:
    if (sessionKey.value) h.Authorization = `Bearer ${sessionKey.value}`
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
            headers: { ...headers(), ...(opts.headers||{}) },
            params: opts.params, 
            body: opts.body, 
            credentials: 'include',
            timeout: opts.timeout ?? 15000
          })
        return { data: payload, error: null }
      } catch (error) {
        lastErr = error
        if (shouldThrow) {
          throw error
        }
        if (attempt++ >= maxRetries) break
        await new Promise(r => setTimeout(r, 300 * attempt))
      }
    }
    return { data: null, error: lastErr }
  }

  const get  = (path, params, opts={}) => request('GET', path, { ...opts, params })
  const post = (path, body,   opts={}) => request('POST', path, { ...opts, body })
  const put  = (path, body,   opts={}) => request('PUT', path, { ...opts, body })
  const del  = (path, params, opts={}) => request('DELETE', path, { ...opts, params })
  const patch = (path, body, opts={}) => request('PATCH', path, { ...opts, body })
  const $    = (path, opts={}) => $fetch(path, { baseURL, headers: headers(), credentials: 'include', ...opts })

  return { $, get, post, put, del, patch }
}
