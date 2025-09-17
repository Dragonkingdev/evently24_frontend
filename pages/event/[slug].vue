<!-- pages/event/[slug].vue -->
<template>
  <div v-if="is404">Event existiert nicht.</div>
  <div v-else-if="isError">Fehler beim Laden.</div>

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

            <!-- Ansicht B: Sitzplan (UI-only) -->
            <div v-else class="mt-3">
              <SeatMapPicker v-if="hasSeatmap" :seatmap="uiSeatmap" v-model:selected="selectedSeats" />
              <div v-else class="text-muted">Kein Sitzplan verfügbar.</div>
              <div class="small text-muted mt-2">
                Ausgewählt: {{ selectedSeats.length }} Platz{{ selectedSeats.length===1?'':'e' }} – Hinweis: Sitzplätze werden aktuell noch nicht im Warenkorb reserviert.
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
            <div class="small text-muted mt-2">Deine Auswahl wird im nächsten Schritt reserviert (Login erforderlich).</div>
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
const { get, post } = useApi()

function toStatus (e) {
  return Number(
    e?.status ?? e?.statusCode ?? e?.response?.status ?? e?.cause?.statusCode ?? e?.data?.status ?? 0
  )
}

const { data: state } = await useAsyncData(
  `event-bundle:${slug}`,
  async () => {
    try {
      const res = await get(`/v1/public/events/${slug}/bundle`)
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

const is404  = computed(() => state.value?.status === 404)
const hasData= computed(() => state.value?.status === 200 && !!state.value?.data?.event)
const isError= computed(() => !!state.value && state.value.status !== 200 && state.value.status !== 404)

const ev = computed(() => state.value?.data?.event)

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

const tiers = computed(() => {
  const fromBundle = (state.value?.data?.tickets || [])
  const fromEvent  = (state.value?.data?.event?.ticket_categories || [])
  const raw = fromBundle.length ? fromBundle : fromEvent
  return raw.map(t => ({
    id: t.id,
    name: t.name || t.code || 'Kategorie',
    price_eur: Number(t.price ?? 0),
    stock: t.stock ?? null
  }))
})

const backLink = computed(() => ev.value?.tour_slug ? `/v1/tour/${ev.value.tour_slug}` : '/')
function handleBackClick(e) { if (!backLink.value || backLink.value === '#') { e.preventDefault(); router.back() } }

const quantities = reactive({})
watchEffect(() => {
  const init = {}
  tiers.value.forEach(t => { init[t.id] = quantities[t.id] || 0 })
  Object.assign(quantities, init)
})

const uiSeatmap = computed(() => {
  const sm = state.value?.data?.seatmap
  if (!sm?.enabled) return null

  const layout = sm.layout || {}
  const ticketsRaw = (state.value?.data?.tickets || state.value?.data?.event?.ticket_categories || [])
  const categories = ticketsRaw.map((t, i) => ({
    id: t.id,
    name: t.name || t.code || `Kategorie ${i+1}`,
    price_eur: Number(t.price ?? 0),
    color: autoColor(i)
  }))

  if (layout?.plan?.zones) return { categories, plan: layout.plan }

  const blocks = Array.isArray(layout.blocks) ? layout.blocks : []
  const zones = blocks.map((b, bi) => {
    const rows = []
    const rowCount = Number(b.rows ?? 0)
    const perRow  = Number(b.seats_per_row ?? 0)
    const catId   = categories[0]?.id
    for (let r = 0; r < rowCount; r++) {
      const seats = []
      for (let s = 0; s < perRow; s++) seats.push({ id: `${b.id||`B${bi+1}`}-R${r+1}-S${s+1}`, n: s+1, status: 'free', catId })
      rows.push({ index: r+1, seats })
    }
    return { id: b.id || `Block ${bi+1}`, name: b.id || `Block ${bi+1}`, catId, rows }
  })

  return { categories, plan: { zones } }
})

const hasSeatmap = computed(() => {
  const plan = uiSeatmap.value?.plan
  return !!(plan?.zones?.some(z => (z.rows || []).some(r => (r.seats || []).length)))
})
const viewMode = ref('tickets')
watchEffect(() => { viewMode.value = hasSeatmap.value ? 'seatmap' : 'tickets' })
const selectedSeats = ref([])

const wantAddon = ref(false)
const email = ref('')

// Preise/Cart (nur GA – Seats noch nicht im Backend)
const totalGA = computed(() =>
  tiers.value.reduce((sum, t) => sum + (quantities[t.id] || 0) * (t.price_eur || 0), 0)
)
const addonFee = computed(() => wantAddon.value && totalGA.value > 0 ? 25 : 0)
const subtotal = computed(() => totalGA.value)
const serviceFee = computed(() => Math.max(0.29, subtotal.value * 0.08))
const total = computed(() => subtotal.value + addonFee.value + serviceFee.value)
const totalQty = computed(() =>
  Object.values(quantities).reduce((a,b)=>a+(b||0),0)
)
const cartLines = computed(() => {
  const lines = []
  tiers.value.forEach(t => {
    const q = quantities[t.id] || 0
    if (q > 0) lines.push({ key:`ga-${t.id}`, label: `${t.name} × ${q}`, total: q * (t.price_eur || 0) })
  })
  return lines
})

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }
function autoColor(i) { const p = ['#4e79a7','#59a14f','#f28e2b','#e15759','#edc948','#b07aa1','#76b7b2']; return p[i % p.length] }

function handleAuthRedirect () {
  const ret = encodeURIComponent(`/event/${slug}`)
  router.push(`/auth/lookup?redirect=${ret}`)
}

async function goCheckout () {
  const items = Object.entries(quantities)
    .map(([ticket_category_id, quantity]) => ({
      ticket_category_id: Number(ticket_category_id),
      quantity: Number(quantity)
    }))
    .filter(x => x.quantity > 0)

  if (!items.length) return

  // 1) Cart anlegen
  const created = await post('/v1/carts', {})
  if (created?.error) {
    const st = toStatus(created.error)
    if (st === 401 || st === 403) return handleAuthRedirect()
    alert(created.error?.message || 'Warenkorb konnte nicht erstellt werden.')
    return
  }
  const cartId = created.data?.cart_id ?? created.cart_id
  if (!cartId) { alert('Warenkorb-ID fehlt.'); return }

  // 2) GA-Items hinzufügen
  for (const it of items) {
    const r = await post(`/v1/carts/${cartId}/items`, it)
    if (r?.error) { alert(r.error?.message || 'Artikel konnte nicht hinzugefügt werden.'); return }
  }

  // 3) Buyer-Email merken
  try {
    if (email.value) {
      const t = useCookie('BUYER_EMAIL', { sameSite: 'lax', path: '/' })
      t.value = email.value
    }
  } catch {}

  // 4) Weiter zum Warenkorb
  router.push(`/cart/${cartId}`)
}
</script>
