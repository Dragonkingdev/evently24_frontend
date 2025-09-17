<!-- pages/orders/success.vue -->
<template>
  <div class="container py-5">
    <div class="text-center">
      <h1 class="h3 mb-3">Danke für deine Bestellung 🙌</h1>
      <p class="text-muted">Deine Zahlung wurde erfolgreich verarbeitet.</p>

      <div v-if="order" class="card border-0 shadow-sm mx-auto my-4" style="max-width: 720px;">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div class="text-start">
              <p class="mb-1"><strong>Order-ID:</strong> <code>{{ order.id }}</code></p>
              <p class="mb-1"><strong>Status:</strong> <span class="badge bg-success" v-if="order.status==='paid'">bezahlt</span><span v-else class="badge bg-secondary">{{ order.status }}</span></p>
              <p class="mb-1"><strong>Event:</strong> {{ order.event_title || '—' }}</p>
              <p class="mb-1"><strong>E-Mail:</strong> {{ order.buyer_email || '—' }}</p>
            </div>
            <div class="text-end">
              <div class="fw-semibold">Gesamt</div>
              <div class="fs-4">{{ fmt(order.total_price) }} <small class="text-muted">{{ order.currency }}</small></div>
            </div>
          </div>

          <hr>
          <h6>Gekaufte Tickets</h6>
          <ul class="list-group list-group-flush">
            <li v-for="(it, idx) in displayItems" :key="`it-${idx}-${it.ticket_category_id ?? it.sku ?? idx}`" class="list-group-item d-flex justify-content-between">
              <span>
                {{ it.name }}
                <span class="text-muted">· ID {{ it.category_id }}</span>
                <span class="text-muted"> · × {{ it.quantity }}</span>
              </span>
              <span class="fw-semibold">{{ fmt(it.total) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-center mt-3">
        <NuxtLink class="btn btn-primary" :to="order ? `/orders/${order.id}` : '/'">Bestellung ansehen</NuxtLink>
        <NuxtLink class="btn btn-outline-secondary" to="/">Zur Startseite</NuxtLink>
      </div>

      <div v-if="debug && sessionId" class="mt-4 text-start mx-auto" style="max-width: 720px;">
        <h6>Debug</h6>
        <p class="small mb-1"><strong>Session-ID:</strong> <code>{{ sessionId }}</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const debug = false
const route = useRoute()
const router = useRouter()
const { get, post } = useApi()

const sessionId = route.query.session_id ? String(route.query.session_id) : ''
const orderId = route.query.order_id ? Number(route.query.order_id) : null

const order = ref(null)
const polling = ref(false)
const maxPollMs = 120000   // 2 Minuten
const intervalMs = 3000

function fmt (n) { const num = Number(n || 0); return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }

async function fetchOrder() {
  if (!orderId) return
  const res = await get(`/v1/orders/${orderId}`)
  if (!res?.error) order.value = res.data
}

async function pollUntilPaid() {
  if (!orderId) return
  polling.value = true
  const started = Date.now()
  while (Date.now() - started < maxPollMs) {
    await fetchOrder()
    if (order.value?.status === 'paid') break
    await new Promise(r => setTimeout(r, intervalMs))
  }
  polling.value = false
}

const displayItems = computed(() => {
  const items = Array.isArray(order.value?.items) ? order.value.items : []
    return items.map(it => ({
      ticket_category_id: it.ticket_category_id ?? null,
      name: it.name || (it.ticket_category_id ? `Kategorie ${it.ticket_category_id}` : (it.sku || 'Artikel')),
      quantity: Number(it.quantity || 0),
      unit_price: Number(it.unit_price || 0),
      total: Number(it.unit_price || 0) * Number(it.quantity || 0),
  }))
})

onMounted(async () => {
  // 1) Order laden (wir gehen davon aus, dass der User noch eingeloggt ist;
  //    sonst optional 401/403 behandeln und auf /login leiten)
  if (orderId) {
    await fetchOrder()
    if (order.value && order.value.status !== 'paid') {
      // Webhook braucht kurz: pollen bis paid
      pollUntilPaid()
    }
  }
  // 2) ORDER_TOKEN (HttpOnly) serverseitig löschen – keine DB-Änderung
  await post('/v1/orders/clear-token', {})
})
</script>
