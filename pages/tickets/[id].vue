<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="row g-3 align-items-center mb-3">
      <div class="col-md-7">
        <h1 class="h4 mb-1">{{ ev.city }}</h1>
        <div class="small text-muted">{{ dp.weekday }}, {{ dp.date }} • {{ dp.time }} — {{ ev.venue }}</div>
      </div>
      <div class="col-md-5 text-md-end">
        <NuxtLink to="/tours" class="btn btn-link text-decoration-none">
          <i class="bi bi-arrow-left"></i> Zurück zur Übersicht
        </NuxtLink>
      </div>
    </div>

    <div class="row g-4">
      <!-- LEFT -->
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="card-title mb-0">Wähle deine Tickets</h5>
              <div v-if="ev.seatmap?.enabled" class="btn-group btn-group-sm" role="group">
                <button class="btn"
                        :class="viewMode==='tickets'?'btn-primary':'btn-outline-primary'"
                        @click="viewMode='tickets'">Tickets</button>
                <button class="btn"
                        :class="viewMode==='seatmap'?'btn-primary':'btn-outline-primary'"
                        @click="viewMode='seatmap'">Sitzplan</button>
              </div>
            </div>

            <!-- Ansicht A: Nur Tickets / GA -->
            <div v-if="viewMode==='tickets'">
              <div v-if="tiers.length" class="list-group list-group-flush mt-3">
                <div v-for="t in tiers" :key="t.id"
                     class="list-group-item d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <div class="fw-semibold">{{ t.name }}</div>
                    <div class="small text-muted">
                      {{ t.stock !== null ? `verfügbar: ${t.stock}` : 'verfügbar' }}
                      • {{ fmt(t.price_eur) }}
                    </div>
                  </div>
                  <div>
                    <input type="number"
                           class="form-control form-control-sm"
                           style="width:90px"
                           min="0"
                           :max="t.stock ?? undefined"
                           v-model.number="quantities[t.id]" />
                  </div>
                </div>
              </div>
              <div v-else class="text-muted mt-3">
                Für diesen Termin sind aktuell keine Ticketkategorien angelegt.
              </div>

              <div class="row g-2 mt-3">
                <div class="col-12 col-sm-8">
                  <label class="form-label small">E-Mail für die Tickets</label>
                  <input type="email" v-model="email" class="form-control">
                </div>
                <div class="col-12">
                  <div class="form-check mt-3">
                    <input class="form-check-input" type="checkbox" id="addon" v-model="wantAddon">
                    <label class="form-check-label" for="addon">
                      Ticket + Hotel (Demo) – {{ fmt(25) }} Zuschlag
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ansicht B: Sitzplan -->
            <div v-else class="mt-3">
              <SeatMapPicker
                :seatmap="ev.seatmap"
                v-model:selected="selectedSeats"
              />
              <div class="small text-muted mt-2">
                Ausgewählt: {{ selectedSeats.length }} Platz{{ selectedSeats.length===1?'':'e' }}
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="mb-2">Gut zu wissen</h6>
            <ul class="small text-muted mb-0">
              <li>Mobile-Tickets sofort per E-Mail.</li>
              <li>Check-in mit QR-Code (kein Ausdruck nötig).</li>
              <li>Servicegebühr 8 % (min. 0,29 € pro Bestellung).</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm sticky-top" style="top:1rem">
          <img :src="ev.img" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">Bestellübersicht</h5>
            <div class="small text-muted mb-2">
              {{ ev.city }} — {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }}<br>
              {{ ev.venue }}
            </div>

            <div v-for="row in cartLines" :key="row.key"
                 class="d-flex justify-content-between small mb-1">
              <span>{{ row.label }}</span>
              <span>{{ fmt(row.total) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-1"
                 v-if="wantAddon && totalGA > 0">
              <span>Ticket + Hotel</span>
              <span>{{ fmt(addonFee) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-2">
              <span>Servicegebühr</span>
              <span>{{ fmt(serviceFee) }}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">Gesamt</div>
              <div class="fw-bold fs-5">{{ fmt(total) }}</div>
            </div>

            <button class="btn btn-primary w-100 mt-3"
                    :disabled="totalQty===0"
                    @click="toCheckout">
              <i class="bi bi-lock"></i> Zur Kasse
            </button>
            <div class="small text-muted mt-2">
              Sicherer Checkout • Apple/Google Pay, Karte, SEPA
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCatalog } from '~/composables/useCatalog'
import { useCart } from '~/composables/useCart'
import SeatMapPicker from '~/components/seatmap/SeatMapPicker.vue'

const { save: saveCart } = useCart()

const route = useRoute()
const { getEventById, getTicketsByEvent } = useCatalog()

const ev = getEventById(route.params.id)
if (!ev) throw createError({ statusCode: 404, statusMessage: 'Event nicht gefunden' })

const tiers = getTicketsByEvent(route.params.id)

// GA: Mengen pro Tier
const quantities = reactive(Object.fromEntries(tiers.map(t => [t.id, 0])))

// Sitzplan-Modus
const viewMode = ref(ev.seatmap?.enabled ? 'seatmap' : 'tickets')
const selectedSeats = ref([])

const wantAddon = ref(false)
const email = ref('')

// Preisberechnung
const totalGA = computed(() =>
  tiers.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price_eur, 0)
)
const totalSeats = computed(() =>
  selectedSeats.value.reduce((sum, s) => sum + (s.price || 0), 0)
)
const addonFee = computed(() => wantAddon.value && totalGA.value > 0 ? 25 : 0)
const subtotal = computed(() => totalGA.value + totalSeats.value)
const serviceFee = computed(() => Math.max(0.29, subtotal.value * 0.08))
const total = computed(() => subtotal.value + addonFee.value + serviceFee.value)
const totalQty = computed(() =>
  Object.values(quantities).reduce((a,b)=>a+(b||0),0) + selectedSeats.value.length
)

// Positionen für Übersicht
const cartLines = computed(() => {
  const lines = []
  tiers.forEach(t => {
    const q = quantities[t.id] || 0
    if (q > 0) lines.push({ key:`ga-${t.id}`, label: `${t.name} × ${q}`, total: q * t.price_eur })
  })
  if (selectedSeats.value.length) {
    const byCat = selectedSeats.value.reduce((acc, s) => {
      const key = s.catId || 'seat'
      acc[key] ??= { qty:0, total:0, label: s.catName || 'Sitzplatz' }
      acc[key].qty += 1
      acc[key].total += s.price || 0
      return acc
    }, {})
    Object.values(byCat).forEach(x => {
      lines.push({ key:`seat-${x.label}`, label: `${x.label} × ${x.qty}`, total: x.total })
    })
  }
  return lines
})

function fmt (n) {
  return (n || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}
function dparts (iso) {
  const d = new Date(iso)
  return {
    date: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month:'long', year:'numeric' }).format(d),
    time: new Intl.DateTimeFormat('de-DE', { hour:'2-digit', minute:'2-digit' }).format(d),
    weekday: new Intl.DateTimeFormat('de-DE', { weekday:'long' }).format(d)
  }
}
const dp = dparts(ev.date)

// toCheckout
function toCheckout () {
  const orderId = String(Date.now())

  const gaItems = tiers
    .map(t => ({ name: t.name, unit: t.price_eur, qty: (quantities[t.id] || 0) }))
    .filter(x => x.qty > 0)
    .map(x => ({ kind: 'ga', label: x.name, qty: x.qty, unit: x.unit, total: x.qty * x.unit }))

  const seatByCat = selectedSeats.value.reduce((acc, s) => {
    const k = s.catId || 'seat'
    acc[k] ??= { label: s.catName || 'Sitzplatz', qty: 0, total: 0, unit: s.price || 0, seats: [] }
    acc[k].qty += 1
    acc[k].total += s.price || 0
    acc[k].seats.push(s.label)
    return acc
  }, {})
  const seatItems = Object.values(seatByCat).map(x => ({ kind: 'seat', ...x }))

  const payload = {
    orderId,
    createdAt: Date.now(),
    event: { id: ev.id, title: ev.title, city: ev.city, venue: ev.venue, dateISO: ev.date, img: ev.img },
    items: [...gaItems, ...seatItems],
    fees: { addonHotel: addonFee.value, service: serviceFee.value },
    sum: { subtotal: subtotal.value, total: total.value },
    meta: { email: email.value || '', reserveUntil: Date.now() + 20 * 60 * 1000 } // 20 Min
  }

  saveCart(orderId, payload)        // 1) speichern
  navigateTo(`/dev-pay/${orderId}`) // 2) dann erst navigieren
}
</script>
