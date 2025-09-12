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

        <!-- Schnellzahlung -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title mb-3">Schnell bezahlen</h5>
            <div class="row g-3 align-items-center">
              <div class="col-12 col-md-6">
                <!-- Stripe Payment Request Button (Apple/Google Pay) -->
                <div v-if="prButtonAvailable">
                  <div id="payment-request-button"></div>
                  <div class="small text-muted mt-2">Bezahlen mit Apple Pay / Google Pay</div>
                </div>
                <div v-else class="text-muted small">
                  Apple/Google Pay wird in deinem Browser/Gerät nicht unterstützt.
                </div>
              </div>
              <div class="col-12 col-md-6 d-flex gap-2">
                <!-- PayPal Stub -->
                <button class="btn btn-outline-secondary w-100" disabled title="Demnächst">
                  <i class="bi bi-paypal"></i> PayPal (bald)
                </button>
              </div>
            </div>
            <div class="small text-muted mt-2">
              Hinweis: Die Schnellzahlung erscheint erst, wenn die Rechnungsdaten vollständig sind und du die AGB akzeptiert hast.
            </div>
          </div>
        </div>

        <!-- Rechnungsdaten + Karten/SEPA etc. -->
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

            <!-- Payment Element -->
            <div v-if="clientSecret" class="mb-3">
              <div id="payment-element"></div>
            </div>
            <div v-else class="alert alert-info">
              Zahlungsmodul wird initialisiert … (Form ausfüllen & AGB akzeptieren)
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

// Stripe
let stripe = null
let elements = null
let paymentElement = null
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
      country: (res.data.address.country || 'DE').toUpperCase()
    }
  }
}

async function initStripeAndElements () {
  if (!STRIPE_PK) { error.value = 'Stripe Publishable Key fehlt.'; return }
  if (!clientSecret.value) return
  if (!stripe) stripe = await loadStripe(STRIPE_PK)
  if (!stripe) { error.value = 'Stripe konnte nicht geladen werden.'; return }
  if (!elements) {
    elements = stripe.elements({ clientSecret: clientSecret.value, appearance: { theme: 'stripe' } })
  }
  // Payment Element
  if (!paymentElement) {
    paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')
  }

  // Payment Request Button (Apple/Google Pay)
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
      prButton.mount('#payment-request-button')
      prButtonAvailable.value = true

      paymentRequest.on('paymentmethod', async (ev) => {
        // Bestätige PaymentIntent ohne Action-Handling (3DS folgt ggf. danach)
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
          // Falls 3DS/SCA nötig:
          if (paymentIntent && paymentIntent.status === 'requires_action') {
            const { error: actionError } = await stripe.confirmCardPayment(clientSecret.value)
            if (actionError) {
              payMessage.value = actionError.message || 'Authentifizierung fehlgeschlagen.'
              payOk.value = false
              return
            }
          }
          // Erfolgreich → Weiterleitung wie beim Karten-Flow
          window.location.href = `${APP_URL}/orders/success?order_id=${orderId}`
        }
      })
    } else {
      prButtonAvailable.value = false
    }
  } catch (e) {
    // Nicht kritisch – Element einfach nicht anzeigen
    prButtonAvailable.value = false
  }
}

async function ensurePaymentIntent () {
  // 1) Checkout-Daten speichern (jetzt sicher: canSubmit == true)
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
    // phone optional
  }
  if (form.value.phone && form.value.phone.trim()) payload.phone = form.value.phone.trim()

  const up = await put(`/orders/${orderId}/checkout`, payload)
  if (up?.error) throw new Error(up.error?.message || 'Checkout-Daten konnten nicht gespeichert werden.')

  // 2) Verlängern (capped)
  const ka = await post(`/orders/${orderId}/keepalive`, {})
  if (ka?.error) {
    kaError.value = 'Reservierung konnte nicht verlängert werden (Hard Cap erreicht).'
    ttl.value = 0
    throw new Error('Reservation keepalive failed')
  }
  ttl.value = Math.max(0, Number(ka.data?.ttl_seconds || 0))
  hardTtl.value = Math.max(0, Number(ka.data?.hard_ttl_seconds || 0))

  // 3) PaymentIntent holen
  const start = await post(`/orders/${orderId}/pay-intent`, {})
  if (start?.error) throw new Error(start.error?.message || 'PaymentIntent konnte nicht erstellt werden.')
  clientSecret.value = start.data?.client_secret || start.client_secret
  await nextTick()
  await initStripeAndElements()
}

async function confirmPayment () {
  error.value = ''; payMessage.value = ''; payOk.value = false
  if (ttl.value <= 0) { error.value = 'Reservierung abgelaufen.'; return }
  if (!canSubmit.value) { error.value = 'Bitte Pflichtfelder ausfüllen & AGB akzeptieren.'; return }

  // Wenn das PaymentIntent / Elements noch nicht bereit ist, jetzt sicherstellen
  if (!clientSecret.value || !elements) {
    try { await ensurePaymentIntent() } catch (e) { error.value = e?.message || 'Fehler beim Initialisieren der Zahlung.'; return }
  }

  submitting.value = true
  try {
    // Elements ggf. eigene Validierung triggern
    const { error: submitErr } = await elements.submit()
    if (submitErr) throw submitErr

    const returnUrl = `${APP_URL}/orders/success?order_id=${orderId}`
    const { error: confErr } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      // redirect: "if_required" // Standard: auto bei 3DS/SCA
    })

    if (confErr) {
      payMessage.value = confErr.message || 'Zahlung konnte nicht bestätigt werden.'
      payOk.value = false
      return
    }
    // Bei 3DS macht Stripe Redirect. Wenn nicht nötig, geht’s direkt weiter (Webhook setzt Order auf paid).
  } catch (e) {
    error.value = e?.message || 'Fehler beim Bezahlen.'
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

// Wenn Formular vollständig & AGB akzeptiert → Intent/ELE/PR-Button initialisieren
watch(
  () => ({ ok: canSubmit.value, ttl: ttl.value, total: total.value }),
  async ({ ok, ttl }) => {
    if (ok && ttl > 0 && !clientSecret.value) {
      try { await ensurePaymentIntent() } catch (e) { error.value = e?.message || 'Fehler beim Initialisieren.' }
    }
  },
  { deep: true }
)

onBeforeUnmount(() => { stopTick(); stopKeepAlive() })
</script>

<style scoped>
.table thead th { border-bottom-color: var(--bs-border-color); }
.sticky-top { z-index: 1020; }
</style>
