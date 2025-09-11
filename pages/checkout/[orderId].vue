<template>
  <div class="container py-4" v-if="loaded">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h4 mb-0">Kasse</h1>
      <NuxtLink :to="`/cart/${orderId}`" class="btn btn-link text-decoration-none">
        <i class="bi bi-arrow-left"></i> Zurück zum Warenkorb
      </NuxtLink>
    </div>

    <div v-if="order" class="row g-4">
      <div class="col-lg-8">
        <div class="alert" :class="ttl > 0 ? 'alert-info' : 'alert-warning'">
          <strong>Reservierung</strong>:
          <template v-if="ttl > 0">
            Noch <span class="fw-bold">{{ ttlText }}</span>
            <span v-if="hardTtl>0" class="text-muted"> (max. {{ hardTtlText }})</span>.
          </template>
          <span v-else>Abgelaufen. Bitte gehe zurück zum Warenkorb.</span>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">Rechnungsdaten</h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small">Vorname</label>
                <input v-model="form.first_name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Nachname</label>
                <input v-model="form.last_name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">E-Mail</label>
                <input v-model="form.email" type="email" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Telefon (optional)</label>
                <input v-model="form.phone" type="tel" class="form-control" />
              </div>

              <div class="col-12">
                <label class="form-label small">Straße und Nr.</label>
                <input v-model="form.address.line1" type="text" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label small">Adresszusatz (optional)</label>
                <input v-model="form.address.line2" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label small">PLZ</label>
                <input v-model="form.address.postal_code" type="text" class="form-control" />
              </div>
              <div class="col-md-5">
                <label class="form-label small">Stadt</label>
                <input v-model="form.address.city" type="text" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label small">Land</label>
                <input v-model="form.address.country" type="text" class="form-control" placeholder="DE" />
              </div>

              <div class="col-12 form-check mt-1">
                <input class="form-check-input" type="checkbox" id="agb" v-model="form.accept_terms" />
                <label class="form-check-label small" for="agb">
                  Ich akzeptiere die AGB und Datenschutzbestimmungen.
                </label>
              </div>

              <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
              <div v-if="kaError" class="alert alert-warning mt-2">{{ kaError }}</div>

              <div class="col-12">
                <button
                  class="btn btn-primary w-100 mt-2"
                  :disabled="submitting || ttl <= 0 || !canSubmit"
                  @click="submitAndPay"
                >
                  <i class="bi bi-credit-card"></i>
                  <span v-if="!submitting">Zahlung abschließen</span>
                  <span v-else>Bitte warten…</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm sticky-top" style="top:1rem">
          <div class="card-body">
            <h6 class="card-title">Zusammenfassung</h6>

            <ul class="list-group list-group-flush mb-3" v-if="order.items?.length">
              <li v-for="it in displayItems" :key="it.key" class="list-group-item d-flex justify-content-between">
                <span>{{ it.label }} <span class="text-muted">× {{ it.quantity }}</span></span>
                <span class="fw-semibold">{{ fmt(it.total) }}</span>
              </li>
            </ul>

            <div class="d-flex justify-content-between small mb-1">
              <span>Zwischensumme</span><span>{{ fmt(subtotal) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-1">
              <span>Servicegebühr</span><span>{{ fmt(serviceFee) }}</span>
            </div>
            <hr />
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">Gesamt</div>
              <div class="fw-bold fs-5">{{ fmt(total) }}</div>
            </div>

            <div class="small text-muted mt-3">
              Reservierung gültig: <strong>{{ ttlText }}</strong>
              <span v-if="hardTtl>0"> (max. {{ hardTtlText }})</span>
            </div>

            <div v-if="payMessage" class="alert mt-3" :class="payOk ? 'alert-success' : 'alert-danger'">
              {{ payMessage }}
            </div>
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

definePageMeta({ auth: true })

const route = useRoute()
const router = useRouter()
const { get, put, post } = useApi()

const orderId = Number(route.params.orderId || 0)
const loaded = ref(false)

const order = ref(null)
const ttl = ref(0)
const hardTtl = ref(0)

const submitting = ref(false)
const error = ref('')
const kaError = ref('')
const payMessage = ref('')
const payOk = ref(false)

let tickTimer = null
let keepAliveTimer = null

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: { line1: '', line2: '', postal_code: '', city: '', country: 'DE' },
  accept_terms: false,
})

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }

const displayItems = computed(() => {
  const items = Array.isArray(order.value?.items) ? order.value.items : []
  return items.map((it, idx) => ({
    key: `it-${idx}-${it.category_id}`,
    label: `Kategorie ${it.category_id}`,
    quantity: it.quantity || 0,
    unit_price: Number(it.unit_price || 0),
    total: Number(it.unit_price || 0) * (it.quantity || 0),
  }))
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

const canSubmit = computed(() => {
  const f = form.value
  return (
    !!f.first_name && !!f.last_name && !!f.email &&
    !!f.address.line1 && !!f.address.postal_code && !!f.address.city && !!f.address.country &&
    !!f.accept_terms
  )
})

function startTick () {
  stopTick()
  if (ttl.value > 0) {
    tickTimer = setInterval(() => {
      ttl.value = Math.max(0, ttl.value - 1)
      hardTtl.value = Math.max(0, hardTtl.value - 1)
      if (ttl.value === 0) stopTick()
    }, 1000)
  }
}
function stopTick () { if (tickTimer) { clearInterval(tickTimer); tickTimer = null } }

function startKeepAlive () {
  stopKeepAlive()
  keepAliveTimer = setInterval(async () => {
    if (document.hidden) return
    if (ttl.value <= 0) return
    const ka = await post(`/orders/${orderId}/keepalive`, {})
    if (ka?.error) {
      kaError.value = 'Reservierung konnte nicht verlängert werden (Hard Cap erreicht).'
      ttl.value = 0
      stopKeepAlive()
      return
    }
    ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
    hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))
  }, 45000)
}
function stopKeepAlive () { if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null } }

async function loadOrder () {
  const res = await get(`/orders/${orderId}`)
  if (res?.error) {
    await router.replace(`/cart/${orderId}`)
    return
  }
  order.value = res.data
  ttl.value = Math.max(0, Number(res.data?.ttl_seconds || 0))
  hardTtl.value = Math.max(0, Number(res.data?.hard_ttl_seconds || 0))

  if (res.data?.buyer_email) form.value.email = res.data.buyer_email
  if (res.data?.buyer_first_name) form.value.first_name = res.data.buyer_first_name
  if (res.data?.buyer_last_name) form.value.last_name = res.data.buyer_last_name
  if (res.data?.buyer_phone) form.value.phone = res.data.buyer_phone
  if (res.data?.address) {
    form.value.address = {
      line1: res.data.address.line1 || '',
      line2: res.data.address.line2 || '',
      postal_code: res.data.address.postal_code || '',
      city: res.data.address.city || '',
      country: res.data.address.country || 'DE'
    }
  }
}

async function submitAndPay () {
  error.value = ''; kaError.value = ''; payMessage.value = ''; payOk.value = false
  if (ttl.value <= 0) { error.value = 'Reservierung abgelaufen. Bitte gehe zurück zum Warenkorb.'; return }
  if (!canSubmit.value) { error.value = 'Bitte fülle alle Pflichtfelder aus und akzeptiere die AGB.'; return }

  submitting.value = true
  try {
    // 1) Checkout-Daten speichern
    const payload = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      address: form.value.address,
      accept_terms: form.value.accept_terms
    }
    if (form.value.phone && form.value.phone.trim()) {
      payload.phone = form.value.phone.trim()
    }
    const up = await put(`/orders/${orderId}/checkout`, payload)
    if (up?.error) throw new Error(up.error?.message || 'Checkout-Daten konnten nicht gespeichert werden.')

    // 2) Einmal explizit verlängern – capped
    const ka = await post(`/orders/${orderId}/keepalive`, {})
    if (ka?.error) {
      kaError.value = 'Reservierung konnte nicht verlängert werden (Hard Cap erreicht).'
      ttl.value = 0
      return
    }
    ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
    hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))

    // 3) Stripe-Checkout-Session anfordern → Redirect
    const start = await post(`/orders/${orderId}/pay`, { provider: 'stripe' })
    if (start?.error) {
      payMessage.value = start.error?.message || 'Stripe-Checkout konnte nicht gestartet werden.'
      payOk.value = false
      return
    }
    const checkoutUrl = start.data?.url || start.url || ''
    if (!checkoutUrl) {
      payMessage.value = 'Keine Checkout-URL erhalten.'
      payOk.value = false
      return
    }
    window.location.href = checkoutUrl
  } catch (e) {
    error.value = e?.message || 'Fehler beim Abschluss.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadOrder()
  if (ttl.value > 0) {
    const ka = await post(`/orders/${orderId}/keepalive`, {})
    if (!ka?.error) {
      ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
      hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))
    }
  }
  startTick()
  startKeepAlive()
  loaded.value = true
})

onBeforeUnmount(() => { stopTick(); stopKeepAlive() })
</script>

<style scoped>
.table thead th { border-bottom-color: var(--bs-border-color); }
.sticky-top { z-index: 1020; }
</style>
