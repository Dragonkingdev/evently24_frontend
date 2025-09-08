// composables/useCart.js
import { useState } from '#imports'

const STORAGE_KEY = 'demo_cart'

// in-memory Fallback für SSR
function useMemoryStore () {
  return useState('cartMemory', () => ({})) // global per Nuxt state
}

export function useCart () {
  const memory = useMemoryStore()

  function loadAll () {
    // Browser?
    if (process.client) {
      try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      } catch {
        return {}
      }
    }
    // SSR -> Memory
    return memory.value || {}
  }

  function saveAll (obj) {
    memory.value = obj
    if (process.client) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
    }
  }

  function save (orderId, payload) {
    const all = loadAll()
    all[orderId] = payload
    saveAll(all)
  }

  function get (orderId) {
    const all = loadAll()
    return all[orderId] || null
  }

  function remove (orderId) {
    const all = loadAll()
    delete all[orderId]
    saveAll(all)
  }

  return { save, get, remove }
}
