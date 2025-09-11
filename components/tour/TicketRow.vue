<script setup>
const props = defineProps({
  ev: { type: Object, required: true }
})

/** sicheres Datums-Splitting (SSR-fest) */
function parts (iso) {
  if (!iso) return { day:'—', month:'—', year:'', weekday:'', time:'' }
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return { day:'—', month:String(iso), year:'', weekday:'', time:'' }
  const d = new Date(t)
  try {
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(d),
      year: d.getFullYear(),
      weekday: new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(d),
      time: new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(d)
    }
  } catch {
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: String(d.getMonth()+1).padStart(2,'0'),
      year: d.getFullYear(),
      weekday: '',
      time: String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0')
    }
  }
}

/** Preis sicher ermitteln und formatieren */
function getMinPrice (ev) {
  const raw =
    ev?.min_price_eur ??                  // 🔥 neu: vom Backend
    ev?.minPrice ??                       // evtl. CamelCase aus anderer Quelle
    ev?.price_from_eur ??                 // dein alter Fallback
    (Array.isArray(ev?.tiers) && ev.tiers.length
      ? Math.min(...ev.tiers.map(t => +t.price_eur || Infinity))
      : undefined)

  if (raw == null || raw === Infinity) return null

  try {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(raw)
  } catch {
    return `${Number(raw).toFixed(2)} €`
  }
}

const p = computed(() => parts(props.ev?.date))
const priceText = computed(() => getMinPrice(props.ev))
</script>

<template>
  <div class="ticket-row ticket mb-3">
    <div class="row g-3 align-items-center">
      <!-- Left: Date -->
      <div class="col-auto">
        <div class="datebox text-center">
          <div class="day">{{ p.day }}</div>
          <div class="month-year">{{ p.month }} {{ p.year }}</div>
          <div class="weekday small text-muted">
            <span v-if="p.weekday">{{ p.weekday }} • </span>{{ p.time }}
          </div>
        </div>
      </div>

      <!-- Middle: Details -->
      <div class="col">
        <div class="city h6 mb-1 text-uppercase">{{ ev.city || '—' }}</div>
        <div class="subtitle small-muted">{{ ev.title || 'Event' }}</div>
        <div class="venue small text-muted">{{ ev.venue || '—' }}</div>

        <div class="addons mt-2 d-flex flex-wrap gap-2" v-if="Array.isArray(ev.addons) && ev.addons.length">
          <span v-for="a in ev.addons" :key="a" class="badge rounded-pill bg-white border small text-black">
            <i class="bi bi-luggage me-1"></i>{{ a }}
          </span>
        </div>
      </div>

      <!-- Right: Price + CTA -->
      <div class="col-12 col-md-auto ms-md-auto text-md-end">
        <div class="price small-muted mb-1" v-if="priceText">
          ab <span class="fw-semibold text-body">{{ priceText }}</span>
        </div>
        <div class="price small-muted mb-1" v-else>Preise folgen</div>
        <NuxtLink :to="ev?.slug ? { name: 'event-slug', params: { slug: ev.slug } } : `/event/${ev.id}`" class="btn btn-primary px-4">
          Weiter
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== Ticket Base ========== */
.ticket-row{
  --notch: 12px;
  position: relative;
  background: var(--surface);
  border-radius: 1rem;
  border: 2px dashed var(--ring);
  box-shadow: var(--shadow);
  padding: 1rem 1.25rem;
  overflow: hidden;
  -webkit-mask:
    radial-gradient(var(--notch) at left 50%, transparent 99%, #000 100%),
    radial-gradient(var(--notch) at right 50%, transparent 99%, #000 100%);
  mask:
    radial-gradient(var(--notch) at left 50%, transparent 99%, #000 100%),
    radial-gradient(var(--notch) at right 50%, transparent 99%, #000 100%);
}
.ticket{
  background-image:
    radial-gradient(1200px 200px at 50% 0%, rgba(255,255,255,.35), rgba(255,255,255,0)),
    linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.02));
}
.ticket > .row{ position: relative; z-index: 1; }
.datebox{ min-width: 110px; }
.datebox .day{ font-size: 1.75rem; line-height: 1; font-weight: 800; }
.datebox .month-year{ font-weight: 600; }
.small-muted{ color: var(--muted); }
@media (max-width: 575.98px){
  .datebox{ min-width: 88px; }
}
</style>
