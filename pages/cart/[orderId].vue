<!-- pages/cart/[orderId].vue -->
<template>
  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h4 mb-0">Warenkorb</h1>
      <NuxtLink :to="backLink" class="btn btn-link text-decoration-none">
        <i class="bi bi-arrow-left"></i> Weiter einkaufen
      </NuxtLink>
    </div>

    <div v-if="is404" class="alert alert-warning">Warenkorb wurde nicht gefunden.</div>
    <div v-else-if="isError" class="alert alert-danger">Fehler beim Laden des Warenkorbs.</div>

    <div v-else-if="cart" class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title mb-3">Deine Positionen</h5>

            <div v-if="cart.items && cart.items.length">
              <div class="table-responsive">
                <table class="table align-middle">
                  <thead>
                    <tr class="small text-muted">
                      <th style="width:50%">Artikel</th>
                      <th class="text-end" style="width:15%">Einzel</th>
                      <th class="text-end" style="width:15%">Menge</th>
                      <th class="text-end" style="width:20%">Summe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="it in displayItems" :key="it.key">
                      <td>
                        <div class="fw-semibold">{{ it.name }}</div>
                        <div class="small text-muted">
                          <span v-if="it.code">Code: {{ it.code }} · </span>
                          <span v-if="it.seat_label">Sitz: {{ it.seat_label }} · </span>
                          <span v-if="it.seat_id">Seat-ID: {{ it.seat_id }} · </span>
                          <span v-if="it.category_id">Cat-ID: {{ it.category_id }}</span>
                        </div>
                      </td>
                      <td class="text-end">{{ fmt(it.unit_price) }}</td>
                      <td class="text-end">{{ it.quantity }}</td>
                      <td class="text-end fw-semibold">{{ fmt(it.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-muted">Noch keine Artikel im Warenkorb.</div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="card-title mb-0">Extras hinzufügen</h5>
              <span class="small text-muted">Nur wenn verfügbar</span>
            </div>

            <div class="row g-2 mt-2">
              <div class="col-12 col-md-6">
                <label class="form-label small">Ticketkategorie (ID)</label>
                <input type="number" class="form-control" v-model.number="extra.categoryId" min="1" placeholder="z. B. 10">
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label small">Menge</label>
                <input type="number" class="form-control" v-model.number="extra.quantity" min="1" placeholder="z. B. 1">
              </div>
              <div class="col-12">
                <button class="btn btn-outline-primary" :disabled="!canAddExtra" @click="addExtra">
                  <i class="bi bi-plus-circle"></i> Hinzufügen & reservieren
                </button>
              </div>
              <div class="col-12 small text-muted">
                Alternativ direkt im Event-Detail auswählen.
              </div>
            </div>

            <div v-if="reserveMessage" class="alert mt-3" :class="reserveOk ? 'alert-success' : 'alert-warning'">
              {{ reserveMessage }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm sticky-top" style="top:1rem">
          <div class="card-body">
            <h5 class="card-title">Zusammenfassung</h5>

            <div class="d-flex justify-content-between small mb-1">
              <span>Zwischensumme</span>
              <span>{{ fmt(subtotal) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-1">
              <span>Servicegebühr</span>
              <span>{{ fmt(serviceFee) }}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">Gesamt</div>
              <div class="fw-bold fs-5">{{ fmt(total) }}</div>
            </div>

            <button class="btn btn-primary w-100 mt-3" :disabled="!cart.items?.length" @click="toCheckout">
              <i class="bi bi-lock"></i> Zur Kasse
            </button>

            <div class="small text-muted mt-2">
              Für die Zahlung musst du eingeloggt sein – im nächsten Schritt prüfen wir das.
            </div>

            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const { get, post } = useApi()

const cartId = Number(route.params.orderId || 0)

const cart = ref(null)
const is404 = ref(false)
const isError = ref(false)
const error = ref('')

const reserveMessage = ref('')
const reserveOk = ref(false)

const extra = ref({ categoryId: null, quantity: 1 })

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }

const backLink = computed(() => {
  const slug = cart.value?.event_slug
  return slug ? `/event/${slug}` : '/'
})

const displayItems = computed(() => {
  const items = Array.isArray(cart.value?.items) ? cart.value.items : []
  return items.map((it, idx) => {
    const name = it.category_name || it.name || (it.seat_label ? it.seat_label : (it.ticket_category_id ? `Kategorie ${it.ticket_category_id}` : 'Artikel'))
    return {
      key: `it-${idx}-${it.id || it.seat_id || it.ticket_category_id}`,
      category_id: it.ticket_category_id || null,
      code: it.category_code || '',
      name,
      quantity: Number(it.quantity || (it.seat_id ? 1 : 0)),
      unit_price: Number(it.unit_price || 0),
      total: Number(it.unit_price || 0) * Number(it.quantity || (it.seat_id ? 1 : 0)),
      seat_id: it.seat_id || null,
      seat_label: it.seat_label || null
    }
  })
})

const subtotal = computed(() => displayItems.value.reduce((s, it) => s + it.total, 0))
const serviceFee = computed(() => Math.max(0.29, subtotal.value * 0.08))
const total = computed(() => subtotal.value + serviceFee.value)

const canAddExtra = computed(() => !!extra.value.categoryId && Number(extra.value.quantity || 0) > 0)

async function loadCart () {
  is404.value = false; isError.value = false; cart.value = null
  try {
    const res = await get(`/v1/carts/${cartId}`)
    if (res?.error) {
      const status = Number(res.error?.status || res.status || 500)
      is404.value = status === 404; isError.value = !is404.value
      return
    }
    cart.value = res?.data || null
  } catch { isError.value = true }
}

async function addExtra () {
  reserveMessage.value = ''; reserveOk.value = false; error.value = ''
  try {
    const payload = { ticket_category_id: Number(extra.value.categoryId), quantity: Number(extra.value.quantity || 1) }
    const res = await post(`/v1/carts/${cartId}/items`, payload)
    if (res?.error) {
      reserveMessage.value = res.error?.message || 'Reservierung fehlgeschlagen.'
      reserveOk.value = false
    } else {
      reserveMessage.value = 'Reservierung aktualisiert.'
      reserveOk.value = true
      await loadCart()
    }
  } catch {
    reserveMessage.value = 'Reservierung fehlgeschlagen.'; reserveOk.value = false
  }
}

async function toCheckout () {
  error.value = ''
  const res = await post(`/v1/orders/from-cart/${cartId}`, {})
  if (res?.error) {
    const st = Number(res.error?.status || 0)
    if (st === 401 || st === 403) {
      const ret = encodeURIComponent(`/cart/${cartId}`)
      router.push(`/auth/lookup?redirect=${ret}`)
      return
    }
    error.value = res.error?.message || 'Bestellung konnte nicht angelegt werden.'
    return
  }
  const orderId = res.data?.id || res.data?.order_id || res.order_id
  if (!orderId) {
    error.value = 'Order-ID fehlt.'
    return
  }
  router.push(`/checkout/${orderId}`)
}

onMounted(loadCart)
</script>

<style scoped>
.table thead th { border-bottom-color: var(--bs-border-color); }
.sticky-top { z-index: 1020; }
</style>
