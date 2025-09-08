<script setup>
const props = defineProps({
  ev: { type: Object, required: true }
})

function parts(iso) {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(d)
  const year = d.getFullYear()
  const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(d)
  const time = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(d)
  return { day, month, year, weekday, time }
}
const p = parts(props.ev.date)
</script>

<template>
  <div class="ticket-row ticket mb-3">
    <div class="row g-3 align-items-center">
      <!-- Left: Date -->
      <div class="col-auto">
        <div class="datebox text-center">
          <div class="day">{{ p.day }}</div>
          <div class="month-year">{{ p.month }} {{ p.year }}</div>
          <div class="weekday small text-muted">{{ p.weekday }} • {{ p.time }}</div>
        </div>
      </div>

      <!-- Middle: Details -->
      <div class="col">
        <div class="city h6 mb-1 text-uppercase">{{ ev.city }}</div>
        <div class="subtitle small-muted">{{ ev.title }}</div>
        <div class="venue small text-muted">{{ ev.venue }}</div>
        <div class="addons mt-2 d-flex flex-wrap gap-2">
          <span v-for="a in ev.addons" :key="a" class="badge rounded-pill bg-white border small text-black">
            <i class="bi bi-luggage me-1"></i>{{ a }}
          </span>
        </div>
      </div>

      <!-- Right: Price + CTA -->
      <div class="col-12 col-md-auto ms-md-auto text-md-end">
        <div class="price small-muted mb-1">
          ab <span class="fw-semibold text-body">{{ ev.minPrice.toLocaleString('de-DE',{style:'currency',currency:'EUR'}) }}</span>
        </div>
        <NuxtLink :to="`/tickets/${ev.id}`" class="btn btn-primary px-4">Weiter</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== Ticket Base ========== */
.ticket-row{
  --notch: 12px;               /* Radius der Aussparungen */
  position: relative;
  background: var(--surface);
  border-radius: 1rem;
  border: 2px dashed var(--ring);
  box-shadow: var(--shadow);
  padding: 1rem 1.25rem;
  overflow: hidden;

  /* echte Aussparungen: schneiden Rand + Inhalt aus */
  -webkit-mask:
    radial-gradient(var(--notch) at left 50%, transparent 99%, #000 100%),
    radial-gradient(var(--notch) at right 50%, transparent 99%, #000 100%);
  mask:
    radial-gradient(var(--notch) at left 50%, transparent 99%, #000 100%),
    radial-gradient(var(--notch) at right 50%, transparent 99%, #000 100%);
}

/* dezente Papieroptik (optional) */
.ticket{
  background-image:
    radial-gradient(1200px 200px at 50% 0%, rgba(255,255,255,.35), rgba(255,255,255,0)),
    linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.02));
}

/* Inhalt über etwaige Deko-Layer (falls später ergänzt) */
.ticket > .row{ position: relative; z-index: 1; }

/* Inhalt */
.datebox{ min-width: 110px; }
.datebox .day{ font-size: 1.75rem; line-height: 1; font-weight: 800; }
.datebox .month-year{ font-weight: 600; }
.small-muted{ color: var(--muted); }

@media (max-width: 575.98px){
  .datebox{ min-width: 88px; }
}
</style>
