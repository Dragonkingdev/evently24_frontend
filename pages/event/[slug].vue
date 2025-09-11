<!-- pages/event/[slug].vue -->
<template>
  <!-- 404: wirklich nur dieser Text -->
  <div v-if="is404">Event existiert nicht.</div>

  <!-- Andere Fehler kurz halten -->
  <div v-else-if="isError">Fehler beim Laden.</div>

  <!-- Nur rendern, wenn echte Daten vorhanden sind -->
  <div v-else-if="hasData" class="container py-4">
    <!-- Header -->
    <div class="row g-3 align-items-center mb-3">
      <div class="col-md-7">
        <h1 class="h4 mb-1">{{ ev.city || ev.title }}</h1>
        <div class="small text-muted">
          {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }} — {{ ev.venue || 'Nicht verfügbar' }}
        </div>
      </div>
      <div class="col-md-5 text-md-end">
        <NuxtLink
          :to="backLink"
          class="btn btn-link text-decoration-none"
          @click="handleBackClick"
        >
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
              <div v-if="hasSeatmap" class="btn-group btn-group-sm" role="group">
                <button class="btn" :class="viewMode==='tickets'?'btn-primary':'btn-outline-primary'" @click="viewMode='tickets'">Tickets</button>
                <button class="btn" :class="viewMode==='seatmap'?'btn-primary':'btn-outline-primary'" @click="viewMode='seatmap'">Sitzplan</button>
              </div>
            </div>

            <!-- Ansicht A: GA -->
            <div v-if="viewMode==='tickets'">
              <div v-if="tiers.length" class="list-group list-group-flush mt-3">
                <div v-for="t in tiers" :key="t.id" class="list-group-item d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <div class="fw-semibold">{{ t.name }}</div>
                    <div class="small text-muted">
                      {{ t.stock !== null && t.stock !== undefined ? `verfügbar: ${t.stock}` : 'verfügbar' }}
                      • {{ fmt(t.price_eur) }}
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      style="width:90px"
                      min="0"
                      :max="t.stock ?? undefined"
                      v-model.number="quantities[t.id]"
                    />
                  </div>
                </div>
              </div>
              <div class="text-muted mt-3" v-else>
                Für diesen Termin sind aktuell keine Ticketkategorien angelegt.
              </div>

              <div class="row g-2 mt-3">
                <div class="col-12 col-sm-8">
                  <label class="form-label small">E-Mail für die Tickets</label>
                  <input type="email" v-model="email" class="form-control" placeholder="deine@email.de">
                </div>
                <div class="col-12">
                  <div class="form-check mt-3">
                    <input class="form-check-input" type="checkbox" id="addon" v-model="wantAddon">
                    <label class="form-check-label" for="addon">Ticket + Hotel (Demo) – {{ fmt(25) }} Zuschlag</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ansicht B: Sitzplan -->
            <div v-else class="mt-3">
              <SeatMapPicker v-if="hasSeatmap" :seatmap="seatmap" v-model:selected="selectedSeats" />
              <div v-else class="text-muted">Kein Sitzplan verfügbar.</div>
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
          <img :src="'https://picsum.photos/seed/9323317c/1200/800'" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">Bestellübersicht</h5>
            <div class="small text-muted mb-2">
              {{ ev.city || ev.title }} — {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }}<br>
              {{ ev.venue || 'Nicht verfügbar' }}
            </div>

            <div v-for="row in cartLines" :key="row.key" class="d-flex justify-content-between small mb-1">
              <span>{{ row.label }}</span>
              <span>{{ fmt(row.total) }}</span>
            </div>
            <div class="d-flex justify-content-between small mb-1" v-if="wantAddon && totalGA > 0">
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

            <button class="btn btn-primary w-100 mt-3" :disabled="totalQty===0" @click="goCheckout">
              <i class="bi bi-bag-plus"></i> In den Warenkorb
            </button>
            <div class="small text-muted mt-2">Deine Auswahl wird im nächsten Schritt 15 Min. reserviert.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SeatMapPicker from '~/components/seatmap/SeatMapPicker.vue'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const slug = String(route.params.slug || '')
const { get, post } = useApi() // post wird verwendet!

// Status aus verschiedenen Fehler-Formaten ableiten
function toStatus (e) {
  return Number(
    e?.status ??
    e?.statusCode ??
    e?.response?.status ??
    e?.cause?.statusCode ??
    e?.data?.status ??
    0
  )
}

const { data: state } = await useAsyncData(
  `event-bundle:${slug}`,
  async () => {
    try {
      const res = await get(`/events/${slug}/bundle`)
      if (res?.error) {
        const status = toStatus(res.error) || Number(res?.status || 0) || 500
        if (status === 404) return { status: 404 }
        return { status }
      }
      const status = Number(res?.status ?? 200)
      if (status === 404) return { status: 404 }
      if (status !== 200) return { status }
      return { status: 200, data: res?.data ?? null }
    } catch (e) {
      const status = toStatus(e) || 500
      if (status === 404) return { status: 404 }
      return { status }
    }
  },
  { server: true, watch: false }
)

// Flags
const is404  = computed(() => state.value?.status === 404)
const hasData= computed(() => state.value?.status === 200 && !!state.value?.data?.event)
const isError= computed(() => !!state.value && state.value.status !== 200 && state.value.status !== 404)

// Daten
const ev = computed(() => state.value?.data?.event)

// Datumsteile
function dparts (iso) {
  const d = iso ? new Date(iso) : null
  if (!d || isNaN(d.getTime())) return { date: '—', time: '—', weekday: '—' }
  return {
    date: new Intl.DateTimeFormat('de-DE',{ day:'2-digit', month:'long', year:'numeric' }).format(d),
    time: new Intl.DateTimeFormat('de-DE',{ hour:'2-digit', minute:'2-digit' }).format(d),
    weekday: new Intl.DateTimeFormat('de-DE',{ weekday:'long' }).format(d)
  }
}
const dp = computed(() => dparts(ev.value?.date))

// Tickets
const tiers = computed(() =>
  (state.value?.data?.tickets || []).map(t => ({
    id: t.id,
    name: t.name || t.code || 'Kategorie',
    price_eur: Number(t.price ?? 0),
    stock: t.stock ?? null
  }))
)

// Back-Link: bevorzugt Tour, sonst Startseite
const backLink = computed(() => {
  const tslug = ev.value?.tour_slug
  if (tslug) return `/tour/${tslug}`
  return '/'
})
function handleBackClick(e) {
  if (!backLink.value || backLink.value === '#') {
    e.preventDefault()
    router.back()
  }
}

// Mengen/Seatmap/UI
const quantities = reactive({})
watchEffect(() => {
  const init = {}
  tiers.value.forEach(t => { init[t.id] = quantities[t.id] || 0 })
  Object.assign(quantities, init)
})

const seatmap = computed(() => state.value?.data?.seatmap?.layout || null)
const hasSeatmap = computed(() => !!(state.value?.data?.seatmap?.enabled && seatmap.value))
const viewMode = ref('tickets')
watchEffect(() => { viewMode.value = hasSeatmap.value ? 'seatmap' : 'tickets' })
const selectedSeats = ref([])

const wantAddon = ref(false)
const email = ref('')

// Preise/Cart
const totalGA = computed(() =>
  tiers.value.reduce((sum, t) => sum + (quantities[t.id] || 0) * (t.price_eur || 0), 0)
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
const cartLines = computed(() => {
  const lines = []
  tiers.value.forEach(t => {
    const q = quantities[t.id] || 0
    if (q > 0) lines.push({ key:`ga-${t.id}`, label: `${t.name} × ${q}`, total: q * (t.price_eur || 0) })
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
  const num = Number.isFinite(n) ? n : 0
  return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

async function goCheckout () {
  // 1) Items aus GA
  const items = Object.entries(quantities)
    .map(([catId, qty]) => ({ category_id: Number(catId), quantity: Number(qty) }))
    .filter(x => x.quantity > 0)

  // 2) Seats (falls Seatmap genutzt)
  const seat_ids = selectedSeats.value.map(s => Number(s.id)).filter(Boolean)

  if (!items.length && !seat_ids.length) return

  // WICHTIG: Nur nicht-leere Felder mitsenden (sonst 422 wegen min_length=1)
  const payload = {
    event_id: ev.value.id,
    buyer_email: email.value || null,
    ...(items.length ? { items } : {}),
    ...(seat_ids.length ? { seat_ids } : {})
  }

  const res = await post('/orders', payload)
  if (res?.error) {
    alert(res.error?.message || 'Reservierung fehlgeschlagen')
    return
  }

  // DEV-Only: Falls Proxy Set-Cookie killt, legen wir es sichtbar (nicht-HttpOnly) ab.
  try {
    if (process.dev && res?.data?.access_token) {
      const t = useCookie('ORDER_TOKEN', { sameSite: 'lax', path: '/' })
      if (!t.value) t.value = res.data.access_token
    }
  } catch {/* ignore */}

  const { order_id } = res.data
  await navigateTo(`/cart/${order_id}`)
}
</script>
