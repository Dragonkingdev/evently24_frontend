<!-- pages/checkout/[orderId].vue -->
<template>
  <!-- WICHTIG: kein v-if mehr auf dem Root-Container, damit #payment-element beim Mount existiert -->
  <div class="container py-4">
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

        <!-- Schnellzahlung -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title mb-3">Schnell bezahlen</h5>
            <div class="row g-3 align-items-center">
              <div class="col-12 col-md-6">
                <!-- Payment Request Button nur bei HTTPS + validen Stammdaten -->
                <div v-if="prButtonAvailable">
                  <div id="payment-request-button"></div>
                  <div class="small text-muted mt-2">Bezahlen mit Apple Pay / Google Pay</div>
                </div>
                <div v-else class="text-muted small">
                  Apple/Google Pay ist hier nicht verfügbar (HTTPS & vollständige Rechnungsdaten nötig).
                </div>
              </div>
              <div class="col-12 col-md-6 d-flex gap-2">
                <button class="btn btn-outline-secondary w-100" disabled title="Demnächst">
                  <i class="bi bi-paypal"></i> PayPal (bald)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Rechnungsdaten + Payment Element -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">Rechnungsdaten</h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small">Vorname</label>
                <input v-model.trim="form.first_name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Nachname</label>
                <input v-model.trim="form.last_name" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">E-Mail</label>
                <input v-model.trim="form.email" type="email" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Telefon (optional)</label>
                <input v-model.trim="form.phone" type="tel" class="form-control" />
              </div>

              <div class="col-12">
                <label class="form-label small">Straße und Nr.</label>
                <input v-model.trim="form.address.line1" type="text" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label small">Adresszusatz (optional)</label>
                <input v-model.trim="form.address.line2" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label small">PLZ</label>
                <input v-model.trim="form.address.postal_code" type="text" class="form-control" />
              </div>
              <div class="col-md-5">
                <label class="form-label small">Stadt</label>
                <input v-model.trim="form.address.city" type="text" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label small">Land</label>
                <input v-model.trim="form.address.country" type="text" class="form-control" placeholder="DE" />
              </div>

              <div class="col-12 form-check mt-1">
                <input class="form-check-input" type="checkbox" id="agb" v-model="form.accept_terms" />
                <label class="form-check-label small" for="agb">
                  Ich akzeptiere die AGB und Datenschutzbestimmungen.
                </label>
              </div>

              <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
              <div v-if="kaError" class="alert alert-warning mt-2">{{ kaError }}</div>
            </div>

            <hr class="my-4" />

            <!-- Payment Element Platzhalter IMMER im DOM -->
            <div class="mb-3">
              <div id="payment-element" ref="paymentEl"></div>
              <div v-if="!clientSecret" class="small text-muted mt-2">Zahlungsmodul wird initialisiert …</div>
            </div>

            <button
              class="btn btn-primary w-100 mt-2"
              :disabled="submitting || ttl <= 0 || !canSubmit || !clientSecret"
              @click="confirmPayment"
            >
              <i class="bi bi-credit-card"></i>
              <span v-if="!submitting">Jetzt bezahlen</span>
              <span v-else>Bitte warten…</span>
            </button>

            <div v-if="payMessage" class="alert mt-3" :class="payOk ? 'alert-success' : 'alert-danger'">
              {{ payMessage }}
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
          </div>
        </div>
      </div>
    </div>

    <!-- Optional: Mini-Placeholder solange Order lädt -->
    <div v-else class="text-muted">Bestellung wird geladen …</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { loadStripe } from '@stripe/stripe-js'

definePageMeta({ auth: true })

const config = useRuntimeConfig()
const STRIPE_PK = config.public.stripePk
const APP_URL = config.public.appUrl

const route = useRoute()
const router = useRouter()
const { get, put, post } = useApi()

const orderId = Number(route.params.orderId || 0)

const order = ref(null)
const ttl = ref(0)
const hardTtl = ref(0)

const submitting = ref(false)
const error = ref('')
const kaError = ref('')
const payMessage = ref('')
const payOk = ref(false)

// Stripe
let stripe = null
let elements = null
let paymentElement = null
const paymentMounted = ref(false)
const paymentEl = ref(null)
const clientSecret = ref('')
const prButtonAvailable = ref(false)
let paymentRequest = null
let prButton = null

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
    key: `it-${idx}-${it.ticket_category_id ?? it.sku ?? idx}`,
    label: it.ticket_category_id ? `Kategorie ${it.ticket_category_id}` : (it.name || 'Artikel'),
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
let tickTimer = null

function startKeepAlive () {
  stopKeepAlive()
  keepAliveTimer = setInterval(async () => {
    if (document.hidden) return
    if (ttl.value <= 0) return
    const ka = await post(`/v1/orders/${orderId}/keepalive`, {})
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
let keepAliveTimer = null

async function loadOrder () {
  const res = await get(`/v1/orders/${orderId}`)
  if (res?.error) {
    await router.replace(`/v1/cart/${orderId}`)
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
      country: (res.data.address.country || 'DE').toUpperCase()
    }
  }
}

/** Payment Element früh initialisieren – aber erst mounten, wenn DOM-Node existiert */
async function initPaymentElementEarly () {
  if (typeof window === 'undefined') return
  if (!STRIPE_PK) { error.value = 'Stripe Publishable Key fehlt.'; return }

  // 1) PaymentIntent erzeugen
  const start = await post(`/v1/orders/${orderId}/pay-intent`, {})
  if (start?.error) { error.value = start.error?.message || 'PaymentIntent konnte nicht erstellt werden.'; return }
  clientSecret.value = start.data?.client_secret || start.client_secret
  if (!clientSecret.value) { error.value = 'Client Secret fehlt.'; return }

  // 2) Stripe + Elements
  if (!stripe) stripe = await loadStripe(STRIPE_PK)
  if (!stripe) { error.value = 'Stripe konnte nicht geladen werden.'; return }
  if (!elements) {
    elements = stripe.elements({ clientSecret: clientSecret.value, appearance: { theme: 'stripe' } })
  }

  // 3) Mount erst, wenn der Platzhalter im DOM ist
  await nextTick()
  await mountPaymentElement()
}

async function mountPaymentElement () {
  if (paymentMounted.value) return
  if (!paymentEl.value) return
  if (!elements || !clientSecret.value) return

  paymentElement = elements.create('payment')
  paymentElement.mount(paymentEl.value)
  paymentMounted.value = true
}

/** Vor Confirm: Käuferdaten speichern + TTL erneuern + Stripe bereitstellen */
async function ensureReadyBeforeConfirm () {
  const payload = {
    first_name: form.value.first_name,
    last_name: form.value.last_name,
    email: form.value.email,
    address: {
      line1: form.value.address.line1,
      line2: form.value.address.line2 || undefined,
      postal_code: form.value.address.postal_code,
      city: form.value.address.city,
      country: (form.value.address.country || 'DE').toUpperCase(),
    },
  }
  if (form.value.phone?.trim()) payload.phone = form.value.phone.trim()

  const up = await put(`/v1/orders/${orderId}/checkout`, payload)
  if (up?.error) throw new Error(up.error?.message || 'Checkout-Daten konnten nicht gespeichert werden.')

  const ka = await post(`/v1/orders/${orderId}/keepalive`, {})
  if (ka?.error) {
    kaError.value = 'Reservierung konnte nicht verlängert werden (Hard Cap erreicht).'
    ttl.value = 0
    throw new Error('Reservation keepalive failed')
  }
  ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
  hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))

  if (!paymentMounted.value) await mountPaymentElement()
}

async function confirmPayment () {
  error.value = ''; payMessage.value = ''; payOk.value = false
  if (ttl.value <= 0) { error.value = 'Reservierung abgelaufen.'; return }
  if (!canSubmit.value) { error.value = 'Bitte Pflichtfelder ausfüllen & AGB akzeptieren.'; return }

  submitting.value = true
  try {
    await ensureReadyBeforeConfirm()
    const { error: submitErr } = await elements.submit()
    if (submitErr) throw submitErr

    const returnUrl = `${APP_URL}/orders/success?order_id=${orderId}`
    const { error: confErr } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })
    if (confErr) {
      payMessage.value = confErr.message || 'Zahlung konnte nicht bestätigt werden.'
      payOk.value = false
      return
    }
  } catch (e) {
    error.value = e?.message || 'Fehler beim Bezahlen.'
  } finally {
    submitting.value = false
  }
}

async function setupPaymentRequestButton () {
  // PR-Button nur bei HTTPS + validen Stammdaten
  if (!window.isSecureContext || !canSubmit.value || !stripe || !elements) {
    prButtonAvailable.value = false
    return
  }

  try {
    const amountCents = Math.round(Number(total.value || 0) * 100)
    paymentRequest = stripe.paymentRequest({
      country: (form.value.address.country || 'DE').toUpperCase(),
      currency: 'eur',
      total: { label: 'Evently Tickets', amount: amountCents },
      requestPayerName: true,
      requestPayerEmail: true
    })
    const result = await paymentRequest.canMakePayment()
    if (result) {
      prButton = elements.create('paymentRequestButton', { paymentRequest })
      await nextTick()
      prButton.mount('#payment-request-button')
      prButtonAvailable.value = true

      paymentRequest.on('paymentmethod', async (ev) => {
        if (!canSubmit.value) {
          ev.complete('fail')
          payMessage.value = 'Bitte Rechnungsdaten vervollständigen & AGB akzeptieren.'
          payOk.value = false
          return
        }
        try {
          await ensureReadyBeforeConfirm()
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret.value,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          )
          if (confirmError) {
            ev.complete('fail')
            payMessage.value = confirmError.message || 'Zahlung konnte nicht bestätigt werden.'
            payOk.value = false
            return
          } else {
            ev.complete('success')
            if (paymentIntent?.status === 'requires_action') {
              const { error: actionError } = await stripe.confirmCardPayment(clientSecret.value)
              if (actionError) {
                payMessage.value = actionError.message || 'Authentifizierung fehlgeschlagen.'
                payOk.value = false
                return
              }
            }
            window.location.href = `${APP_URL}/orders/success?order_id=${orderId}`
          }
        } catch (e) {
          ev.complete('fail')
          payMessage.value = e?.message || 'Fehler beim Bezahlen.'
          payOk.value = false
        }
      })
    } else {
      prButtonAvailable.value = false
    }
  } catch {
    prButtonAvailable.value = false
  }
}

onMounted(async () => {
  await loadOrder()
  // Payment Element SOFORT initialisieren (Client Secret holen & Elements erzeugen)
  await initPaymentElementEarly()

  if (ttl.value > 0) {
    const ka = await post(`/v1/orders/${orderId}/keepalive`, {})
    if (!ka?.error) {
      ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
      hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))
    }
  }
  startTick()
  startKeepAlive()
})

// PR-Button erst anzeigen, wenn Form vollständig + HTTPS + Elements vorhanden
watch(
  () => ({ ok: canSubmit.value, secret: clientSecret.value }),
  async ({ ok, secret }) => {
    if (ok && secret) {
      await setupPaymentRequestButton()
    } else {
      prButtonAvailable.value = false
    }
  },
  { deep: true }
)

onBeforeUnmount(() => { stopTick(); stopKeepAlive() })
</script>

<style scoped>
.table thead th { border-bottom-color: var(--bs-border-color); }
.sticky-top { z-index: 1020; }
/* optional: cloak, um Flackern zu vermeiden */
/* [v-cloak] { display: none; } */
</style>
