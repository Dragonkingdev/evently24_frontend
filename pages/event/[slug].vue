<!-- pages/event/[slug].vue -->
<template>
  <div v-if="is404" class="container py-5">Event existiert nicht.</div>
  <div v-else-if="isError" class="container py-5">Fehler beim Laden.</div>

  <div v-else-if="hasData" class="container py-4 page-event">
    <!-- HERO / HEADER (kompakt) -->
    <div class="card border-0 shadow-sm mb-4 overflow-hidden">
      <div class="row g-0 align-items-stretch">
        <div class="col-md-5">
          <div class="hero-media h-100">
            <img :src="heroImg" class="w-100 h-100 object-fit-cover" alt="">
          </div>
        </div>
        <div class="col-md-7">
          <div class="p-3 p-md-4">
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span class="badge bg-secondary-subtle text-secondary">{{ ev.category || 'Event' }}</span>
              <span class="badge bg-info-subtle text-info" v-if="ev.city">{{ ev.city }}</span>
              <span class="badge bg-light text-muted border" v-if="ev.venue">{{ ev.venue }}</span>
            </div>
            <h1 class="h3 fw-bold mb-2">{{ ev.title }}</h1>
            <div class="text-muted">
              {{ dp.weekday }}, {{ dp.date }} • {{ dp.time }}
            </div>

            <div class="d-flex align-items-center gap-3 mt-3 flex-wrap">
              <div class="d-flex align-items-start gap-2 flex-column flex-sm-row">
                <div class="d-flex align-items-baseline gap-2">
                  <span class="small text-muted">ab</span>
                  <span class="fs-4 fw-semibold">{{ ev.min_price != null ? fmt(ev.min_price) : '—' }}</span>
                </div>
                <div class="small text-muted">
                  <span v-if="feeIncluded">inkl. Service- & Zahlungsgebühren</span>
                  <span v-else>zzgl. Service- & Zahlungsgebühren</span>
                </div>
              </div>
              <div class="vr d-none d-md-inline"></div>
              <div class="small text-muted d-flex align-items-center gap-2">
                <i class="bi bi-shield-check"></i> Mobile-Tickets • QR Check-in
              </div>
            </div>

            <div class="mt-3 d-none d-md-block">
              <a href="#tickets" class="btn btn-primary">
                <i class="bi bi-ticket-perforated"></i> Tickets auswählen
              </a>
              <NuxtLink
                :to="backLink"
                class="btn btn-link text-decoration-none ms-2"
                @click="handleBackClick"
              >
                <i class="bi bi-arrow-left"></i> Zurück zur Übersicht
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GRID -->
    <div class="row g-4">
      <!-- LEFT -->
      <div class="col-lg-7">
        <!-- Tickets / Seatmap -->
        <div id="tickets" class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="card-title mb-0">Wähle deine Tickets</h5>
              <div v-if="hasSeatmap" class="btn-group btn-group-sm d-none d-md-inline-flex" role="group">
                <button class="btn" :class="viewMode==='tickets'?'btn-primary':'btn-outline-primary'" @click="viewMode='tickets'">Tickets</button>
                <button class="btn" :class="viewMode==='seatmap'?'btn-primary':'btn-outline-primary'" @click="viewMode='seatmap'">Sitzplan</button>
              </div>
            </div>

            <!-- Ansicht A: GA -->
            <div v-if="viewMode==='tickets'">
              <div v-if="tiers.length" class="list-group list-group-flush mt-3">
                <div v-for="t in tiers" :key="t.id" class="list-group-item d-flex align-items-center justify-content-between gap-3">
                  <div class="flex-grow-1">
                    <div class="fw-semibold">{{ t.name }}</div>
                    <div class="small text-muted">
                      {{ t.stock !== null && t.stock !== undefined ? `verfügbar: ${t.stock}` : 'verfügbar' }}
                      • {{ fmt(t.price_eur) }}
                      <span class="text-muted" v-if="feeIncluded">(inkl. Gebühren)</span>
                      <span class="text-muted" v-else>(zzgl. Gebühren)</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" @click="dec(t.id)" :disabled="(quantities[t.id]||0)===0">−</button>
                    <input
                      type="number"
                      class="form-control form-control-sm text-center qty-input"
                      min="0"
                      :max="t.stock ?? undefined"
                      v-model.number="quantities[t.id]"
                    />
                    <button class="btn btn-sm btn-outline-secondary" @click="inc(t.id, t.stock)">+</button>
                  </div>
                </div>
              </div>
              <div class="text-muted mt-3" v-else>
                Für diesen Termin sind aktuell keine Ticketkategorien angelegt.
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

        <!-- FAQ & Hinweise (aufklappbar, alles in einer Card) -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">FAQ & Hinweise</h5>

            <div class="accordion" id="faqAccordion">
              <!-- Versandmöglichkeiten -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="head-shipping">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#col-shipping" aria-expanded="true" aria-controls="col-shipping">
                    Versandmöglichkeiten
                  </button>
                </h2>
                <div id="col-shipping" class="accordion-collapse collapse show" aria-labelledby="head-shipping" data-bs-parent="#faqAccordion">
                  <div class="accordion-body small text-muted">
                    <ul class="mb-0">
                      <li><strong>Standardversand (Deutschland):</strong> Zustellung i.d.R. innerhalb von 2–4 Werktagen.</li>
                      <li><strong>Standardversand exkl. für eventimcard-Inhaber (DE):</strong> Zustellung i.d.R. innerhalb von 2–4 Werktagen.</li>
                      <li><strong>Expressversand (Deutschland):</strong> Zustellung am nächsten Werktag bei Bestellung bis 14 Uhr (Mo–Fr).</li>
                      <li><strong>World:</strong> Zustellung i.d.R. innerhalb von 6–7 Werktagen.</li>
                    </ul>
                    <p class="mt-2 mb-0">Deine gewünschte Versandoption ist nicht aufgeführt? Prüfe bitte, ob sie im Warenkorb verfügbar ist.</p>
                  </div>
                </div>
              </div>

              <!-- Informationen zur Buchung -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="head-booking">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#col-booking" aria-expanded="false" aria-controls="col-booking">
                    Informationen zur Buchung
                  </button>
                </h2>
                <div id="col-booking" class="accordion-collapse collapse" aria-labelledby="head-booking" data-bs-parent="#faqAccordion">
                  <div class="accordion-body small text-muted">
                    <p><strong>Rollstuhlfahrer und Schwerbehinderte:</strong> Prüfe zuerst, ob im Webshop passende Kategorien/Rabatte angeboten werden. Falls nicht, wende dich an den Kundenservice: <strong>0421&nbsp;353&nbsp;638</strong> (nur Anfragen/Buchungen für Rollstuhlfahrende &amp; Menschen mit Schwerbehinderung).</p>
                    <p>Je nach Veranstalter erfolgt die Buchung direkt oder nach Rückfrage. Plätze können abhängig vom Event begrenzt sein.</p>
                    <p>Bei Begleitperson (Merkzeichen B) halte bitte am Einlass den Schwerbehindertenausweis als Nachweis für das Begleiter-Ticket bereit.</p>

                    <p class="mb-1"><strong>Bestplatzbuchung:</strong> Du wählst die Kategorie und Stückzahl – die besten verfügbaren Plätze werden automatisch zugeteilt (nummerierte Sitzplätze in der Regel nebeneinander).</p>
                    <p class="mb-1"><strong>Saalplanbuchung:</strong> Du wählst Plätze im grafischen Saalplan. Wird nicht bei allen Events angeboten.</p>
                    <p class="mb-1"><strong>Freie Platzwahl:</strong> Du suchst dir vor Ort einen Platz gemäß Gegebenheiten (Sitz/Steh/teilbestuhlt).</p>
                    <p class="mb-1"><strong>Sitz- oder Stehplatz je nach Verfügbarkeit:</strong> Überwiegend (nicht garantiert) Sitzplätze. Stehplatzkarten zum gleichen Preis möglich. Wunsch bzgl. Sitz/Steh nicht erfüllbar, Umtausch ausgeschlossen.</p>

                    <p class="mb-1"><strong>Zurzeit nicht verfügbar:</strong> Kontingent erschöpft – ggf. später neue Kontingente.</p>
                    <p class="mb-1"><strong>Nicht mehr zustellbar:</strong> Event steht kurz bevor – ggf. Mobile Ticket, Ticketdirect oder Abholung an der Kasse möglich.</p>
                    <p class="mb-1"><strong>Nur 1 Ticket auswählbar / Einzelsitzplatz:</strong> Über Bestplatzbuchung nur einzelne, nicht zusammenhängende Restplätze verfügbar; über Saalplan ggf. zusammenhängende Plätze vorhanden.</p>

                    <p class="mb-1"><strong>Ermäßigte Karten:</strong> ggf. für Kinder/Studierende/Senioren verfügbar – Nachweis am Einlass bereithalten. Call-Center: <strong>01806&nbsp;570&nbsp;070</strong> (0,20 €/Anruf inkl. MwSt. aus allen dt. Netzen).</p>
                  </div>
                </div>
              </div>

              <!-- Informationen zum Veranstalter -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="head-promoter">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#col-promoter" aria-expanded="false" aria-controls="col-promoter">
                    Informationen zum Veranstalter
                  </button>
                </h2>
                <div id="col-promoter" class="accordion-collapse collapse" aria-labelledby="head-promoter" data-bs-parent="#faqAccordion">
                  <div class="accordion-body small text-muted">
                    <p><strong>Hinweis:</strong> Die CTS EVENTIM AG &amp; Co. KGaA ist nicht selbst Veranstalter; der Verkauf erfolgt im Auftrag des Veranstalters.</p>
                    <p class="mb-0"><strong>Veranstalter:</strong> BIG THING GmbH, Overstolzenstr. 21, 50677 Köln, Deutschland</p>
                  </div>
                </div>
              </div>
            </div> <!-- /accordion -->
          </div>
        </div>

        <!-- Weitere Termine -->
        <div v-if="(ev.occurrences || []).length > 1" class="card border-0 shadow-sm mt-4">
          <div class="card-body">
            <h6 class="mb-2">Weitere Termine</h6>
            <ul class="list-unstyled mb-0 small">
              <li v-for="o in ev.occurrences" :key="o.id">
                <span>{{ fmtDate(o.date) }}</span>
                <span v-if="o.city"> • {{ o.city }}</span>
                <span v-if="o.venue"> • {{ o.venue }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- RIGHT (Desktop: sticky) -->
      <div class="col-lg-5 d-none d-lg-block">
        <div class="card border-0 shadow-sm sticky-top" style="top:1rem">
          <img :src="heroImg" class="card-img-top" alt="">
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

            <!-- Gebühren-Zusammenfassung -->
            <template v-if="feeAdded">
              <div class="d-flex justify-content-between small mb-1">
                <span>Plattform (4% + 0,25 €/Ticket)</span>
                <span>{{ fmt(platformFee) }}</span>
              </div>
              <div class="d-flex justify-content-between small mb-1">
                <span>Zahlung (Stripe 1,4% + 0,25 €)</span>
                <span>{{ fmt(stripeFee) }}</span>
              </div>
              <div class="d-flex justify-content-between small mb-2 border-top pt-2">
                <span>Servicepauschale gesamt</span>
                <span>{{ fmt(serviceFeeTotal) }}</span>
              </div>
              <div class="small text-muted mb-2">
                Weitere Zahlungsarten (z. B. PayPal/Amex) können Zuschläge verursachen – transparent im Checkout.
              </div>
            </template>
            <template v-else>
              <div class="small text-muted mb-2">
                Service- & Zahlungsgebühren sind im Ticketpreis bereits enthalten.
              </div>
            </template>

            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-semibold">
                Gesamt <span v-if="feeAdded">(inkl. Servicepauschale)</span><span v-else>(inkl. aller Gebühren)</span>
              </div>
              <div class="fw-bold fs-5">{{ fmt(total) }}</div>
            </div>

            <button class="btn btn-primary w-100 mt-3" :disabled="totalQty===0" @click="goCheckout">
              <i class="bi bi-bag-plus"></i> In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE STICKY BUYBAR (sticky, endet vor Footer) -->
    <div class="buybar-wrap d-lg-none">
      <div class="buybar" :class="{ 'is-disabled': totalQty===0 }">
        <div class="buybar-inner container">
          <div class="d-flex align-items-center justify-content-between gap-3">
            <div class="flex-grow-1">
              <div class="small text-muted lh-1">
                <span v-if="feeAdded">Gesamt (inkl. Servicepauschale)</span>
                <span v-else>Gesamt (inkl. aller Gebühren)</span>
              </div>
              <div class="fw-bold fs-5">{{ fmt(total) }}</div>
            </div>
            <button class="btn btn-primary btn-lg flex-shrink-0" :disabled="totalQty===0" @click="goCheckout">
              <i class="bi bi-bag-plus"></i> Bestellen
            </button>
          </div>
          <div class="small text-muted mt-1" v-if="feeAdded">
            Zuschläge für PayPal/Amex (falls gewählt) erscheinen transparent im Checkout.
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
import { useUserPublic } from '~/composables/userPublic'

const route = useRoute()
const router = useRouter()
const slug = String(route.params.slug || '')

const { post } = useApi()
const { getEventBySlug, getSeatingOverview } = useUserPublic()

function toStatus (e) {
  return Number(
    e?.status ?? e?.statusCode ?? e?.response?.status ?? e?.cause?.statusCode ?? e?.data?.status ?? 0
  )
}

const { data: state } = await useAsyncData(
  `event-detail:${slug}`,
  async () => {
    try {
      // 1) Event lesen
      const res = await getEventBySlug(slug)
      if (res?.error) {
        const st = toStatus(res.error) || Number(res?.status || 0) || 500
        if (st === 404) return { status: 404 }
        return { status: st }
      }
      const event = res?.data
      if (!event) return { status: 404 }

      // 2) Optionale Sitzübersicht (falls seatmap_id)
      let seating = null
      if (event?.seatmap_id) {
        const so = await getSeatingOverview(event.id)
        seating = so?.data || null
      }

      return { status: 200, data: { event, seating } }
    } catch (e) {
      const st = toStatus(e) || 500
      if (st === 404) return { status: 404 }
      return { status: st }
    }
  },
  { server: true, watch: false }
)

const is404  = computed(() => state.value?.status === 404)
const hasData= computed(() => state.value?.status === 200 && !!state.value?.data?.event)
const isError= computed(() => !!state.value && state.value.status !== 200 && state.value.status !== 404)

const ev = computed(() => state.value?.data?.event)
const heroImg = computed(() => 'https://picsum.photos/seed/9323317c/1200/800') // Platzhalter/Banner

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
  const raw = (ev.value?.ticket_categories || [])
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

function inc (id, stock) {
  const cur = Number(quantities[id] || 0)
  const max = Number.isFinite(stock) ? Number(stock) : Infinity
  if (cur < max) quantities[id] = cur + 1
}
function dec (id) {
  const cur = Number(quantities[id] || 0)
  quantities[id] = Math.max(0, cur - 1)
}

// --- Seatmap Platzhalter ---
const hasSeatmap = computed(() => false)
const viewMode = ref('tickets')
const selectedSeats = ref([])

// ==== Gebühren-Logik (neu) ====
// Backend liefert ev.fee_mode: 'included' | 'added'
const feeMode = computed(() => (ev.value?.fee_mode || 'included').toLowerCase())
const feeIncluded = computed(() => feeMode.value === 'included')
const feeAdded = computed(() => feeMode.value === 'added')

// Preise/Cart
const subtotal = computed(() =>
  tiers.value.reduce((sum, t) => sum + (quantities[t.id] || 0) * (t.price_eur || 0), 0)
)
const totalQty = computed(() =>
  Object.values(quantities).reduce((a,b)=>a+(b||0),0)
)

// Plattformgebühr: 4% vom Warenwert + 0,25 € je Ticket (nur wenn feeAdded)
const platformFee = computed(() => {
  if (feeIncluded.value || subtotal.value <= 0) return 0
  const pct = subtotal.value * 0.04
  const perTicket = totalQty.value * 0.25
  return roundMoney(pct + perTicket)
})

// Stripe-Gebühr: 1,4% vom Warenwert + 0,25 € pro Bestellung (nur wenn feeAdded)
const stripeFee = computed(() => {
  if (feeIncluded.value || subtotal.value <= 0) return 0
  const pct = subtotal.value * 0.014
  const fixed = 0.25
  return roundMoney(pct + fixed)
})

// Servicepauschale gesamt = Plattform + Stripe
const serviceFeeTotal = computed(() => roundMoney(platformFee.value + stripeFee.value))

// Gesamtpreis
const total = computed(() => roundMoney(subtotal.value + serviceFeeTotal.value))

const cartLines = computed(() => {
  const lines = []
  tiers.value.forEach(t => {
    const q = quantities[t.id] || 0
    if (q > 0) lines.push({ key:`ga-${t.id}`, label: `${t.name} × ${q}`, total: q * (t.price_eur || 0) })
  })
  return lines
})

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }
function fmtDate (iso) {
  const d = iso ? new Date(iso) : null
  if (!d || isNaN(d.getTime())) return '—'
  const date = new Intl.DateTimeFormat('de-DE',{ day:'2-digit', month:'long', year:'numeric' }).format(d)
  const time = new Intl.DateTimeFormat('de-DE',{ hour:'2-digit', minute:'2-digit' }).format(d)
  return `${date} • ${time}`
}
function roundMoney(n) { return Math.round((Number(n||0) + Number.EPSILON) * 100) / 100 }

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

  // 3) Weiter zum Warenkorb
  router.push(`/cart/${cartId}`)
}
</script>

<style scoped>
.page-event {
  /* Bei sticky Buybar (nicht fixed) i.d.R. kein extra Bottom-Spacing nötig. */
}

/* Hero Bild */
.hero-media { min-height: 220px; background: #f8f9fa; }
.object-fit-cover { object-fit: cover; }

/* Menge-Input kompakt */
.qty-input { width: 64px; }

/* Mobile Sticky Buybar (sticky; bleibt vor Footer stehen) */
.buybar-wrap {
  position: sticky;
  bottom: 0;
  z-index: 1030;
}
.buybar {
  background: rgba(255,255,255,0.98);
  border-top: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 -6px 20px rgba(0,0,0,0.08);
  padding: .5rem 0;
  backdrop-filter: saturate(180%) blur(8px);
}
.buybar .btn { min-width: 160px; }
.buybar.is-disabled { opacity: 0.9; }

/* Subtle badges */
.badge.bg-secondary-subtle { background: #eef1f5; color: #5b6b7b; }
.badge.bg-info-subtle { background: #e6f5ff; color: #0b6ea8; }
</style>
