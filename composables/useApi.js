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
    try {
      const data = await $fetch(path, {
        method,
        baseURL,
        headers: { ...headers(), ...(opts.headers || {}) },
        params: opts.params,
        body: opts.body,
        credentials: 'include'
      })
      // optionales Dev-Logging
      if (process.dev && import.meta.client) {
        console.debug(`[API ${method}] ${baseURL}${path}`, { params: opts.params, body: opts.body })
      }
      return { data, error: null }
    } catch (error) {
      if (process.dev && import.meta.client) {
        console.error(`[API ${method} ERROR] ${baseURL}${path}`, error)
      }
      return { data: null, error }
    }
  }

  const get  = (path, params, opts={}) => request('GET', path, { ...opts, params })
  const post = (path, body,   opts={}) => request('POST', path, { ...opts, body })
  const put  = (path, body,   opts={}) => request('PUT', path, { ...opts, body })
  const del  = (path, params, opts={}) => request('DELETE', path, { ...opts, params })
  const $    = (path, opts={}) => $fetch(path, { baseURL, headers: headers(), credentials: 'include', ...opts })

  return { $, get, post, put, del }
}
