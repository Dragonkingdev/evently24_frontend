<template>
  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h4 mb-0">Warenkorb</h1>
      <NuxtLink :to="backLink" class="btn btn-link text-decoration-none">
        <i class="bi bi-arrow-left"></i> Weiter einkaufen
      </NuxtLink>
    </div>

    <div v-if="is404" class="alert alert-warning">Bestellung wurde nicht gefunden.</div>
    <div v-else-if="isError" class="alert alert-danger">Fehler beim Laden der Bestellung.</div>

    <div v-else-if="order" class="row g-4">

      <div class="col-lg-8">
        <div class="alert" :class="ttl > 0 ? 'alert-info' : 'alert-warning'">
          <div class="d-flex justify-content-between align-items-center w-100">
            <div>
              <strong>Reservierung</strong>:
              <template v-if="ttl > 0">
                Noch <span class="fw-bold">{{ ttlText }}</span> reserviert
                <span v-if="hardTtl > 0" class="text-muted"> (max. {{ hardTtlText }})</span>.
              </template>
              <span v-else>Abgelaufen. Bitte neu versuchen.</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="refreshOrder">
                <i class="bi bi-arrow-clockwise"></i> Aktualisieren
              </button>
              <button class="btn btn-sm btn-outline-secondary" :disabled="ttl<=0" @click="pingKeepalive">
                <i class="bi bi-hourglass-split"></i> Verlängern
              </button>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title mb-3">Deine Positionen</h5>

            <div v-if="order.items && order.items.length">
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
                          ID: {{ it.category_id }}
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
              <span class="small text-muted">Erfordert aktives Event (event_id)</span>
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
                <button class="btn btn-outline-primary" :disabled="!canAddExtra || ttl<=0" @click="addExtra">
                  <i class="bi bi-plus-circle"></i> Hinzufügen & reservieren
                </button>
              </div>
              <div class="col-12 small text-muted">
                Alternativ im Event-Detail reservieren und hier nur prüfen.
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

            <NuxtLink
              class="btn btn-primary w-100 mt-3"
              :class="{ disabled: ttl <= 0 || order.items.length === 0 }"
              :to="`/checkout/${orderId}`"
              @click.prevent="goCheckoutIfActive"
            >
              <i class="bi bi-lock"></i> Zur Kasse
            </NuxtLink>

            <div class="small text-muted mt-2">
              Für die Zahlung musst du eingeloggt sein – das prüfen wir im nächsten Schritt.
            </div>

            <div v-if="kaError" class="alert alert-warning mt-3">{{ kaError }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const { get, post } = useApi()

const orderId = Number(route.params.orderId || 0)

const order = ref(null)
const is404 = ref(false)
const isError = ref(false)

const ttl = ref(0)
const hardTtl = ref(0)
let timer = null

const reserveMessage = ref('')
const reserveOk = ref(false)
const kaError = ref('')

const extra = ref({ categoryId: null, quantity: 1 })

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }

const backLink = computed(() => {
  const slug = order.value?.event_slug
  return slug ? `/event/${slug}` : '/'
})

const displayItems = computed(() => {
  const items = Array.isArray(order.value?.items) ? order.value.items : []
  return items.map((it, idx) => {
    const code = it.category_code || ''
    const name = it.category_name || `Kategorie ${it.category_id}`
    return {
      key: `it-${idx}-${it.category_id}`,
      category_id: it.category_id,
      code,
      name,
      quantity: it.quantity || 0,
      unit_price: Number(it.unit_price || 0),
      total: Number(it.unit_price || 0) * (it.quantity || 0),
    }
  })
})

const subtotal = computed(() => displayItems.value.reduce((s, it) => s + it.total, 0))
const serviceFee = computed(() => Math.max(0.29, subtotal.value * 0.08))
const total = computed(() => subtotal.value + serviceFee.value)

const ttlText = computed(() => {
  const s = Math.max(0, Number(ttl.value || 0))
  const m = Math.floor(s / 60); const r = s % 60
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')} Min`
})
const hardTtlText = computed(() => {
  const s = Math.max(0, Number(hardTtl.value || 0))
  const m = Math.floor(s / 60); const r = s % 60
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`
})

const canAddExtra = computed(() =>
  !!extra.value.categoryId && Number(extra.value.quantity || 0) > 0 && !!(order.value?.event_id)
)

async function loadOrder () {
  is404.value = false; isError.value = false; order.value = null
  ttl.value = 0; hardTtl.value = 0
  try {
    const res = await get(`/orders/${orderId}`)
    if (res?.error) {
      const status = Number(res.error?.status || res.status || 500)
      is404.value = status === 404; isError.value = !is404.value
      return
    }
    order.value = res?.data || null
    ttl.value = Math.max(0, Number(order.value?.ttl_seconds || 0))
    hardTtl.value = Math.max(0, Number(order.value?.hard_ttl_seconds || 0))
    startTimer()
  } catch { isError.value = true }
}

function startTimer () {
  stopTimer()
  if (ttl.value > 0) {
    timer = setInterval(() => {
      ttl.value = Math.max(0, ttl.value - 1)
      hardTtl.value = Math.max(0, hardTtl.value - 1)
      if (ttl.value === 0) stopTimer()
    }, 1000)
  }
}
function stopTimer () { if (timer) { clearInterval(timer); timer = null } }

async function refreshOrder () { await loadOrder() }

async function pingKeepalive () {
  kaError.value = ''
  const ka = await post(`/orders/${orderId}/keepalive`, {})
  if (ka?.error) {
    kaError.value = ka.error?.message || 'Reservierung konnte nicht verlängert werden (Hard Cap?).'
    ttl.value = 0
    return
  }
  ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
  hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))
}

async function addExtra () {
  reserveMessage.value = ''; reserveOk.value = false
  if (!order.value?.event_id) {
    reserveMessage.value = 'Kein event_id in Order. Backend muss event_id im GET /orders/{id} mitsenden.'
    return
  }
  try {
    const payload = {
      event_id: order.value.event_id,
      buyer_email: null,
      items: [{ category_id: Number(extra.value.categoryId), quantity: Number(extra.value.quantity || 1) }],
      seat_ids: []
    }
    const res = await post(`/orders/${orderId}/reserve`, payload)
    if (res?.error) {
      reserveMessage.value = res.error?.message || 'Reservierung fehlgeschlagen.'
      reserveOk.value = false
    } else {
      reserveMessage.value = 'Reservierung aktualisiert.'
      reserveOk.value = true
      await loadOrder()
    }
  } catch {
    reserveMessage.value = 'Reservierung fehlgeschlagen.'; reserveOk.value = false
  }
}

async function goCheckoutIfActive (e) {
  e.preventDefault()
  kaError.value = ''
  if (ttl.value > 0 && order.value?.items?.length) {
    const ka = await post(`/orders/${orderId}/keepalive`, {})
    if (ka?.error) {
      kaError.value = 'Reservierung abgelaufen / Hard Cap erreicht. Bitte neu starten.'
      ttl.value = 0
      return
    }
    router.push(`/checkout/${orderId}`)
  }
}

onMounted(loadOrder)
onBeforeUnmount(stopTimer)
</script>

<style scoped>
.table thead th { border-bottom-color: var(--bs-border-color); }
.sticky-top { z-index: 1020; }
</style>
