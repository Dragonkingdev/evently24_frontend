<template>
  <div class="container py-4">

    <!-- DESKTOP-HEADER: Backlink + Preis + CTA -->
    <div class="d-none d-lg-flex justify-content-between align-items-center mb-3">
      <NuxtLink to="/tours" class="small text-decoration-none d-inline-flex align-items-center gap-1">
        <i class="bi bi-arrow-left"></i> Zurück zum Shop
      </NuxtLink>

      <div class="d-flex align-items-center gap-3">
        <div class="h6 m-0 text-nowrap">{{ fmt(sumTotal) }}</div>
        <button class="btn btn-primary" :disabled="expired" @click="pay">
          Weiter zur Kasse
        </button>
      </div>
    </div>

    <!-- MOBILE-STICKY-BAR: Preis + CTA ganz oben -->
    <div class="checkout-mobilebar d-lg-none">
      <div class="container px-3 py-2 d-flex justify-content-between align-items-center">
        <NuxtLink to="/tours" class="small text-decoration-none d-inline-flex align-items-center gap-1 me-2">
          <i class="bi bi-arrow-left"></i> Shop
        </NuxtLink>
        <div class="ms-auto d-flex align-items-center gap-3">
          <div class="fw-semibold text-nowrap">{{ fmt(sumTotal) }}</div>
          <button class="btn btn-primary btn-sm" :disabled="expired" @click="pay">
            Zur Kasse
          </button>
        </div>
      </div>
    </div>

    <div class="row gx-4 mt-3 mt-lg-0">
      <!-- LEFT: Warenkorb & Upsells -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body">
            <div class="d-flex gap-3">
              <img :src="cart.event.img" alt="" class="thumb">
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="h6 mb-1">{{ titleLine }}</div>
                    <div class="small text-muted">
                      {{ cart.event.city }} — {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }}<br>
                      {{ cart.event.venue }}
                    </div>
                  </div>
                  <div class="fw-semibold d-none d-sm-block">{{ fmt(sumSubtotal) }}</div>
                </div>

                <details class="mt-2">
                  <summary class="small">Details anzeigen</summary>
                  <ul class="list-unstyled small mt-2 mb-0">
                    <li v-for="it in cart.items" :key="it.kind + it.label" class="d-flex justify-content-between">
                      <span>
                        <span class="text-muted">{{ it.kind === 'seat' ? 'Sitz' : 'Ticket' }}:</span>
                        {{ it.label }}
                        <template v-if="it.kind==='seat' && it.seats?.length">
                          <span class="text-muted">—</span>
                          <span class="text-muted"> {{ it.seats.join(', ') }}</span>
                        </template>
                        × {{ it.qty }}
                      </span>
                      <span>{{ fmt(it.total) }}</span>
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>

        <!-- Upsell: Ticketversicherung -->
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body p-0">
            <div class="form-check p-3 bg-light border-bottom">
              <input class="form-check-input" type="checkbox" id="ins" v-model="insurance.enabled">
              <label for="ins" class="form-check-label fw-semibold">Ticketversicherung</label>
              <span class="float-end fw-semibold">{{ fmt(insurance.price) }}</span>
            </div>
            <div class="p-3 small text-muted">
              Wir empfehlen die Ticketversicherung. Erhalte den Ticketpreis zurück, wenn du nicht teilnehmen kannst.
              Beachte die Bedingungen des Versicherers. (Demo)
            </div>
          </div>
        </div>

        <!-- Upsell: Geschenkverpackung -->
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body p-0">
            <div class="form-check p-3">
              <input class="form-check-input" type="checkbox" id="gift" v-model="gift.enabled">
              <label for="gift" class="form-check-label fw-semibold">Geschenkverpackung</label>
              <span class="float-end fw-semibold">{{ fmt(gift.price) }}</span>
            </div>
            <div class="px-3 pb-3 small text-muted">8 Motive (Demo). Option ohne echte Logik.</div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Summary, Timer, Coupon, Zahlarten -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 sticky-top" style="top:3.5rem"><!-- etwas tiefer wegen Mobilebar -->
          <div class="card-body">
            <div class="alert alert-success py-2 d-flex align-items-center gap-2">
              <i class="bi bi-clock-history"></i>
              <div>
                <div class="small m-0">Deine Tickets sind noch erhältlich</div>
                <div class="fw-semibold">Reservierungszeit: {{ timerText }}</div>
              </div>
            </div>

            <h6 class="mb-2">Bestellübersicht</h6>
            <div class="small text-muted mb-3">
              {{ titleLine }}<br>
              {{ cart.event.city }} — {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }}
            </div>

            <div class="d-flex justify-content-between small mb-1">
              <span>Zwischensumme</span>
              <span>{{ fmt(sumSubtotal) }}</span>
            </div>
            <div v-if="cart.fees.addonHotel > 0" class="d-flex justify-content-between small mb-1">
              <span>Ticket + Hotel</span>
              <span>{{ fmt(cart.fees.addonHotel) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-1">
              <span>Servicegebühr</span>
              <span>{{ fmt(cart.fees.service) }}</span>
            </div>
            <div v-if="insurance.enabled" class="d-flex justify-content-between small mb-1">
              <span>Ticketversicherung</span>
              <span>{{ fmt(insurance.price) }}</span>
            </div>
            <div v-if="gift.enabled" class="d-flex justify-content-between small mb-1">
              <span>Geschenkverpackung</span>
              <span>{{ fmt(gift.price) }}</span>
            </div>
            <div v-if="discount.value" class="d-flex justify-content-between small mb-1 text-success">
              <span>Gutschein ({{ discount.code }})</span>
              <span>-{{ fmt(discount.value) }}</span>
            </div>

            <hr class="my-2">
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">Gesamt</div>
              <div class="fw-bold fs-5">{{ fmt(sumTotal) }}</div>
            </div>

            <button class="btn btn-primary w-100 mt-3" :disabled="expired" @click="pay">
              Weiter zur Kasse
            </button>

            <!-- Coupon -->
            <div class="mt-3">
              <label class="form-label small">Gutschein</label>
              <div class="input-group">
                <input v-model.trim="coupon" class="form-control" placeholder="Code eingeben">
                <button class="btn btn-outline-secondary" @click="applyCoupon">Einlösen</button>
              </div>
              <div v-if="couponMsg" class="small mt-1" :class="couponOk?'text-success':'text-danger'">{{ couponMsg }}</div>
            </div>

            <!-- Zahlarten (Demo) -->
            <div class="mt-3">
              <div class="small text-muted mb-2">Zahlungsmöglichkeiten</div>
              <div class="d-flex flex-wrap gap-2 align-items-center">
                <span class="pay-badge">SEPA</span>
                <span class="pay-badge">VISA</span>
                <span class="pay-badge">Mastercard</span>
                <span class="pay-badge">Klarna</span>
                <span class="pay-badge">PayPal</span>
                <span class="pay-badge">Google Pay</span>
                <span class="pay-badge">Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="expired" class="alert alert-warning mt-3">
          Deine Reservierung ist abgelaufen. Gehe zurück und wähle die Tickets erneut.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { useCart } from '~/composables/useCart'

const route = useRoute()
const { get } = useCart()
const cart = reactive(get(route.params.orderId) || { event:{}, items:[], fees:{service:0, addonHotel:0}, sum:{subtotal:0,total:0}, meta:{} })

if (!cart.items?.length) {
  // Wenn du SSR-Probleme hast, nimm stattdessen clientseitiges Laden (wie ich dir vorher gezeigt habe).
  throw createError({ statusCode: 400, statusMessage: 'Warenkorb leer oder abgelaufen' })
}

// Datumsteile
function dparts (iso) {
  const d = new Date(iso)
  return {
    date: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month:'long', year:'numeric' }).format(d),
    time: new Intl.DateTimeFormat('de-DE', { hour:'2-digit', minute:'2-digit' }).format(d),
    weekday: new Intl.DateTimeFormat('de-DE', { weekday:'long' }).format(d)
  }
}
const dp = dparts(cart.event.dateISO)
const titleLine = computed(() => {
  const qty = cart.items.reduce((a,b)=>a+(b.qty||0),0)
  return `${qty}× ${cart.event.title || 'Tickets'}`
})

// Upsells
const insurance = reactive({ enabled:false, price: 12.90 })
const gift      = reactive({ enabled:false, price: 3.90 })

// Coupon
const coupon = ref('')
const discount = reactive({ code:'', value:0 })
const couponMsg = ref('')
const couponOk = ref(false)
function applyCoupon () {
  const code = coupon.value.toUpperCase()
  const map = { TEST10: 10, VIP20: 20 }
  if (map[code]) {
    discount.code = code
    discount.value = map[code]
    couponOk.value = true
    couponMsg.value = `Gutschein ${code} angewendet.`
  } else {
    discount.code = ''
    discount.value = 0
    couponOk.value = false
    couponMsg.value = 'Ungültiger Code.'
  }
}

// Summen
const sumSubtotal = computed(() => cart.sum.subtotal)
const sumTotal = computed(() => {
  const upsells = (insurance.enabled ? insurance.price : 0) + (gift.enabled ? gift.price : 0)
  const couponVal = discount.value || 0
  return Math.max(0, cart.sum.total + upsells - couponVal)
})

// Timer
const now = ref(Date.now())
let timer
onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
const expired = computed(() => (cart.meta?.reserveUntil || 0) <= now.value)
const remainingMs = computed(() => Math.max(0, (cart.meta?.reserveUntil || 0) - now.value))
const timerText = computed(() => {
  const m = Math.floor(remainingMs.value / 60000)
  const s = Math.floor((remainingMs.value % 60000) / 1000)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} Min.`
})

function fmt (n) {
  return (n || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

function pay () {
  if (expired.value) return
  // Demo: Weiter zur "Kasse"
  navigateTo('/tours') // hier würdest du Payment starten
}
</script>

<style scoped>
/* Mobile Topbar */
.checkout-mobilebar{
  position: sticky;
  top: 0;
  z-index: 1030;
  background: #fff;
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  box-shadow: 0 4px 16px rgba(0,0,0,.04);
}

.thumb{ width:120px; height:120px; object-fit:cover; border-radius:.5rem; }
.pay-badge{ display:inline-block; padding:.35rem .6rem; border:1px solid var(--bs-border-color,#dee2e6); border-radius:.35rem; font-size:.8rem; background:#fff; }
</style>
