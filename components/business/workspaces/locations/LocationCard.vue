<template>
  <div class="card loc-wide-card">
    <!-- HEADER -->
    <div
      class="card-header loc-card-header d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-lg-between gap-2"
    >
      <!-- Links: Name + Badges (mobil: gestapelt) -->
      <div class="loc-header-left d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 min-w-0">
        <h5 class="mb-0 text-truncate" :title="loc.name">{{ loc.name }}</h5>

        <!-- Badges in eigener Zeile auf Mobile -->
        <div class="d-flex flex-wrap align-items-center gap-1">
          <!-- STATUS -->
          <span
            v-if="loc.status"
            class="badge d-inline-flex align-items-center"
            :class="statusBadgeClass"
            :title="statusLabel"
          >
            <i v-if="statusIcon" :class="statusIcon + ' me-1'"></i>
            <span class="badge-label">{{ statusLabel }}</span>
          </span>

          <!-- VERIFICATION -->
          <span
            v-if="loc.verification_status"
            class="badge d-inline-flex align-items-center"
            :class="verificationBadgeClass"
            :title="verificationLabel"
          >
            <i v-if="verificationIcon" :class="verificationIcon + ' me-1'"></i>
            <span class="badge-label">{{ verificationLabel }}</span>
          </span>

          <!-- BOOKABLE -->
          <span
            class="badge d-inline-flex align-items-center"
            :class="loc.booking_enabled ? 'bg-success' : 'bg-secondary'"
            :title="loc.booking_enabled ? 'Buchbar' : 'Nicht buchbar'"
          >
            <i :class="loc.booking_enabled ? 'bi bi-calendar-check me-1' : 'bi bi-calendar-x me-1'"></i>
            <span class="badge-label">{{ loc.booking_enabled ? 'Buchbar' : 'Nicht buchbar' }}</span>
          </span>
        </div>
      </div>

      <!-- Rechts: Actions (mobil: unter den Badges) -->
      <div class="loc-header-actions d-flex flex-wrap gap-2">
        <NuxtLink
          :to="`/business/w/${wid}/locations/${loc.id}`"
          class="btn btn-sm btn-outline-secondary"
          title="Bearbeiten"
        >
          <i class="bi bi-pencil-square me-1"></i><span class="d-none d-sm-inline">Bearbeiten</span>
        </NuxtLink>

        <NuxtLink
          :to="`/business/w/${wid}/locations/${loc.id}/inquiries`"
          class="btn btn-sm btn-outline-primary"
          title="Anfragen ansehen"
        >
          <i class="bi bi-inbox me-1"></i><span class="d-none d-sm-inline">Anfragen</span>
          <span v-if="inquiriesTotal !== null" class="badge bg-primary ms-2">{{ inquiriesTotal }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- BODY -->
    <div class="card-body d-flex flex-column flex-lg-row align-items-stretch gap-3">
      <!-- Left: Bild -->
      <div class="loc-thumb-wrap">
        <img
          :src="thumb"
          class="loc-thumb rounded"
          :alt="loc.name"
          loading="lazy"
          @error="onImgError"
        />
      </div>

      <!-- Right: Infos + Charts -->
      <div class="flex-grow-1 d-flex flex-column gap-2 min-w-0">
        <!-- Adresse -->
        <div class="small text-muted">
          <i class="bi bi-geo-alt me-1"></i>
          <template v-if="addrLine">
            {{ addrLine }}
          </template>
          <template v-else>—</template>
        </div>

        <!-- Keyfacts -->
        <div class="d-flex flex-wrap gap-2">
          <span v-if="isFiniteN(loc.area_sqm)" class="badge bg-light text-dark border">
            <i class="bi bi-aspect-ratio me-1"></i>{{ loc.area_sqm }} m²
          </span>
          <span v-if="isFiniteN(loc.capacity_seated_max)" class="badge bg-light text-dark border">
            <i class="bi bi-people me-1"></i>{{ loc.capacity_seated_max }} Sitzplätze
          </span>
          <span v-if="isFiniteN(loc.capacity_standing_max)" class="badge bg-light text-dark border">
            <i class="bi bi-people-fill me-1"></i>{{ loc.capacity_standing_max }} stehend
          </span>
          <span v-if="isFiniteN(loc.rooms_count)" class="badge bg-light text-dark border">
            <i class="bi bi-grid-3x3-gap me-1"></i>{{ loc.rooms_count }} Räume
          </span>
          <span v-if="isFiniteN(loc.parking_count)" class="badge bg-light text-dark border">
            <i class="bi bi-car-front me-1"></i>{{ loc.parking_count }} Parkplätze
          </span>
        </div>

        <!-- Charts Row -->
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-6">
            <div class="metric-tile">
              <div class="tile-header">
                <span class="label"><i class="bi bi-eye me-1"></i>Besucher ({{ daysLabel }})</span>
                <span class="value">Σ {{ visitsTotalDisp }}</span>
              </div>
              <div class="tile-chart">
                <svg v-if="visits.length" :width="sparkW" :height="sparkH" viewBox="0 0 160 40" preserveAspectRatio="none">
                  <polyline
                    :points="sparkPoints(visits)"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="sparkline"
                  />
                </svg>
                <div v-else class="placeholder">Keine Daten</div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="metric-tile">
              <div class="tile-header">
                <span class="label"><i class="bi bi-envelope-open me-1"></i>Anfragen ({{ daysLabel }})</span>
                <span class="value">Σ {{ inquiriesTotalDisp }}</span>
              </div>
              <div class="tile-chart">
                <svg v-if="inquiries.length" :width="sparkW" :height="sparkH" viewBox="0 0 160 40" preserveAspectRatio="none">
                  <polyline
                    :points="sparkPoints(inquiries)"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="sparkline"
                  />
                </svg>
                <div v-else class="placeholder">Keine Daten</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="small text-muted mt-1">
          <i class="bi bi-clock me-1"></i>
          Erstellt: {{ createdAt }} <span v-if="updatedAt">· Aktualisiert: {{ updatedAt }}</span>
          <span class="ms-2">• ID #{{ loc.id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loc: { type: Object, required: true },
  wid: { type: [String, Number], required: true },
  /** gewünschter Zeitraum (Tage) für die kleinen Charts */
  statsDays: { type: Number, default: 14 },
})

/* ------------------------- Thumb / Address ------------------------- */
const thumb = computed(() => {
  const arr = Array.isArray(props.loc?.image_urls) ? props.loc.image_urls : []
  return arr?.[0] || 'https://picsum.photos/seed/location-fallback/600/400'
})
function onImgError(e){ e.target.src = 'https://picsum.photos/seed/location-fallback/600/400' }

const addrLine = computed(() => {
  const p = props.loc || {}
  const parts = [p.address, p.postal_code, p.city].filter(Boolean)
  const s = parts.join(', ')
  return p.country ? (s ? `${s} (${p.country})` : `(${p.country})`) : s
})

/* ------------------------- Dates ------------------------- */
function fmt(iso){ try{ return new Date(iso).toLocaleString() } catch{ return '—' } }
const createdAt = computed(() => props.loc?.created_at ? fmt(props.loc.created_at) : '—')
const updatedAt = computed(() => props.loc?.updated_at ? fmt(props.loc.updated_at) : '')

/* ------------------------- Badges ------------------------- */
const toKey = (v) => String(v || '').trim().toLowerCase()
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const statusKey = computed(() => toKey(props.loc?.status))
const statusBadgeClass = computed(() => {
  switch (statusKey.value) {
    case 'pending':   return 'bg-warning text-dark'
    case 'published': return 'bg-success'
    case 'active':    return 'bg-success'
    case 'disabled':
    case 'inactive':  return 'bg-secondary'
    case 'rejected':
    case 'failed':    return 'bg-danger'
    default:          return 'bg-light text-dark border'
  }
})
const statusIcon = computed(() => {
  switch (statusKey.value) {
    case 'pending':   return 'bi bi-hourglass-split'
    case 'published':
    case 'active':    return 'bi bi-check-circle'
    case 'disabled':
    case 'inactive':  return 'bi bi-slash-circle'
    case 'rejected':
    case 'failed':    return 'bi bi-x-circle'
    default:          return ''
  }
})
const statusLabel = computed(() => {
  const map = { pending: 'Pending', published: 'Published', active: 'Active', disabled: 'Disabled', inactive: 'Inactive', rejected: 'Rejected', failed: 'Failed' }
  return map[statusKey.value] || capitalize(props.loc?.status)
})

const verificationKey = computed(() => toKey(props.loc?.verification_status))
const verificationBadgeClass = computed(() => {
  switch (verificationKey.value) {
    case 'verified':     return 'bg-success'
    case 'pending':
    case 'in_review':    return 'bg-info'
    case 'unverified':
    case 'needs_action': return 'bg-warning text-dark'
    case 'rejected':     return 'bg-danger'
    default:             return 'bg-secondary'
  }
})
const verificationIcon = computed(() => {
  switch (verificationKey.value) {
    case 'verified':     return 'bi bi-patch-check'
    case 'pending':
    case 'in_review':    return 'bi bi-hourglass-split'
    case 'unverified':
    case 'needs_action': return 'bi bi-exclamation-triangle'
    case 'rejected':     return 'bi bi-x-circle'
    default:             return ''
  }
})
const verificationLabel = computed(() => {
  const map = { verified: 'Verified', pending: 'Pending', in_review: 'In review', unverified: 'Unverified', needs_action: 'Needs action', rejected: 'Rejected' }
  return map[verificationKey.value] || capitalize(props.loc?.verification_status)
})

/* ------------------------- Metrics & Sparkline ------------------------- */
const daysLabel = computed(() => `letzte ${props.statsDays} Tage`)

const rawMetrics = computed(() => props.loc?.metrics || null)
const visits = computed(() => Array.isArray(rawMetrics.value?.visits) ? rawMetrics.value.visits : [])
const inquiries = computed(() => Array.isArray(rawMetrics.value?.inquiries) ? rawMetrics.value.inquiries : [])
const visitsTotal = computed(() => {
  if (Number.isFinite(rawMetrics.value?.visits_total)) return rawMetrics.value.visits_total
  return visits.value.reduce((a,b)=>a+(Number(b)||0),0)
})
const inquiriesTotal = computed(() => {
  if (Number.isFinite(rawMetrics.value?.inquiries_total)) return rawMetrics.value.inquiries_total
  return inquiries.value.reduce((a,b)=>a+(Number(b)||0),0)
})

const visitsTotalDisp = computed(() => visitsTotal.value?.toLocaleString?.() ?? (visitsTotal.value ?? '—'))
const inquiriesTotalDisp = computed(() => inquiriesTotal.value?.toLocaleString?.() ?? (inquiriesTotal.value ?? '—'))

const sparkW = 160
const sparkH = 40

function sparkPoints(arr){
  const n = arr.length
  if (!n) return ''
  const max = Math.max(...arr.map(v => Number(v) || 0), 1)
  const stepX = n > 1 ? (sparkW / (n - 1)) : 0
  const points = arr.map((v,i) => {
    const x = Math.round(i * stepX)
    const y = Math.round(sparkH - (Number(v||0) / max) * (sparkH - 4) - 2) // padding 2px
    return `${x},${y}`
  })
  return points.join(' ')
}

/* ------------------------- Utils ------------------------- */
function isFiniteN(v){ return Number.isFinite(Number(v)) }
</script>

<style scoped>
.loc-wide-card{
  overflow: hidden;
}

/* Header */
.loc-card-header {
  background: var(--bs-light);
}

/* Grid: Bild links fixbreit, rechts flexibel */
.loc-thumb-wrap{
  flex: 0 0 240px;
  max-width: 240px;
}
.loc-thumb{
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

/* Metric Tiles */
.metric-tile{
  border: 1px solid var(--bs-border-color);
  border-radius: .6rem;
  padding: .5rem .75rem;
  background: #fff;
}
.metric-tile .tile-header{
  display: flex; align-items: center; justify-content: space-between;
  font-weight: 600;
}
.metric-tile .tile-header .label{ color: var(--biz-ink-700, #556070); font-weight: 600; }
.metric-tile .tile-header .value{ color: var(--biz-ink-900, #1f2630); }

.metric-tile .tile-chart{
  margin-top: .25rem;
  min-height: 40px;
  display: flex; align-items: center; justify-content: center;
}
.metric-tile .placeholder{ color: #9aa4b2; font-size: .9rem; }
.sparkline{ opacity: .9; }

/* Responsive: Stack auf Mobile, Bild oben */
@media (max-width: 991.98px){
  .loc-thumb-wrap{ flex: 0 0 100%; max-width: none; }
  .loc-thumb{ height: 200px; }
}

/* Ab >=1200px NUR Icons in den Badges (Text ausblenden) */
@media (max-width: 1200px){
  .badge .badge-label { display: none; }
}
</style>
