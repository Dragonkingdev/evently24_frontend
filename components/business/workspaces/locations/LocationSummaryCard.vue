<!-- components/business/workspaces/locations/LocationSummaryCard.vue -->
<template>
  <div class="card location-summary-card">
    <div class="card-body">
      <!-- Header: Name + Status -->
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <h4 class="mb-0 text-truncate">{{ title }}</h4>

          <span v-if="status" class="badge" :class="statusClass">
            <i class="bi bi-circle-fill me-1"></i>{{ status }}
          </span>
          <span v-if="verification" class="badge" :class="verificationClass">
            <i class="bi bi-shield-check me-1"></i>{{ verification }}
          </span>

          <span class="badge" :class="booking ? 'bg-success' : 'bg-secondary'">
            <i :class="booking ? 'bi bi-calendar-check me-1' : 'bi bi-calendar-x me-1'"></i>
            {{ booking ? 'Buchbar' : 'Nicht buchbar' }}
          </span>
        </div>

        <!-- Desktop-Thumbnail (nur ab lg sichtbar) -->
        <img
          v-if="thumb"
          :src="thumb"
          alt="Location Bild"
          class="summary-thumb rounded border d-none d-lg-block"
          loading="lazy"
        />
      </div>

      <!-- Mobile/klein: Vollbreites Bild unter dem Header -->
      <img
        v-if="thumb"
        :src="thumb"
        alt="Location Bild"
        class="summary-thumb-mobile rounded border d-block d-lg-none w-100 mt-3"
        loading="lazy"
      />

      <!-- Key facts -->
      <div class="row g-3 mt-3">
        <div class="col-12">
          <div class="text-muted small mb-2">
            <i class="bi bi-geo-alt me-1"></i>{{ addressLine || '—' }}
          </div>

          <div class="d-flex flex-wrap gap-2">
            <span v-if="area" class="badge bg-light text-dark border">
              <i class="bi bi-aspect-ratio me-1"></i>{{ area }} m²
            </span>
            <span v-if="capSeatMax" class="badge bg-light text-dark border">
              <i class="bi bi-people me-1"></i>{{ capSeatMax }} Sitzplätze
            </span>
            <span v-if="capStandMax" class="badge bg-light text-dark border">
              <i class="bi bi-people-fill me-1"></i>{{ capStandMax }} stehend
            </span>
            <span v-if="rooms" class="badge bg-light text-dark border">
              <i class="bi bi-grid-3x3-gap me-1"></i>{{ rooms }} Räume
            </span>
            <span v-if="parking" class="badge bg-light text-dark border">
              <i class="bi bi-car-front me-1"></i>{{ parking }} Parkplätze
            </span>
            <span v-if="toilets" class="badge bg-light text-dark border">
              <i class="bi bi-droplet me-1"></i>{{ toilets }} WCs
            </span>
          </div>

          <div v-if="bookingNotes" class="small text-muted mt-2">
            <i class="bi bi-journal-text me-1"></i>{{ bookingNotes }}
          </div>

          <div v-if="priceLine" class="small mt-2">
            <i class="bi bi-cash-coin me-1"></i>{{ priceLine }}
          </div>

          <div v-if="availability" class="small text-muted mt-1">
            <i class="bi bi-calendar-event me-1"></i>{{ availability }}
          </div>

          <div class="mt-3 d-flex flex-wrap gap-2">
            <span
              v-for="c in categoryBadges"
              :key="c.id"
              class="badge text-uppercase bg-success"
              :title="c.id"
            >
              <i v-if="c.icon" :class="`bi ${c.icon} me-1`"></i>{{ c.label }}
            </span>
          </div>

          <div class="d-flex flex-column gap-1 small mt-3">
            <div v-if="email">
              <i class="bi bi-envelope me-1"></i>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </div>
            <div v-if="phone">
              <i class="bi bi-telephone me-1"></i>
              <a :href="`tel:${phone}`">{{ phone }}</a>
            </div>
            <div v-if="website">
              <i class="bi bi-globe me-1"></i>
              <a :href="website" target="_blank" rel="noopener">{{ website }}</a>
            </div>
            <div v-if="curfew || minAge || maxDb" class="mt-2">
              <span v-if="curfew" class="badge bg-light text-dark border me-1">
                <i class="bi bi-moon-stars me-1"></i>Sperrstunde {{ curfew }}
              </span>
              <span v-if="minAge" class="badge bg-light text-dark border me-1">
                <i class="bi bi-person-check me-1"></i>ab {{ minAge }}
              </span>
              <span v-if="maxDb" class="badge bg-light text-dark border">
                <i class="bi bi-volume-up me-1"></i>{{ maxDb }} dB
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer mit Timestamps und Delete -->
    <div class="card-footer bg-light small text-muted d-flex justify-content-between align-items-center">
      <div class="d-flex flex-column flex-sm-row gap-2">
        <div v-if="created"><i class="bi bi-clock-history me-1"></i>Erstellt: {{ created }}</div>
        <div v-if="updated"><i class="bi bi-pencil me-1"></i>Aktualisiert: {{ updated }}</div>
      </div>
      <button class="btn btn-outline-danger btn-sm" @click="$emit('delete')">
        <i class="bi bi-trash me-1"></i> Location löschen
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true },
  categoryBadges: { type: Array, default: () => [] },
  createdAt: { type: [String, Date], default: null },
  updatedAt: { type: [String, Date], default: null },
})

defineEmits(['delete'])

function fmt(iso) {
  try { return new Date(iso).toLocaleString() } catch { return null }
}

const d = computed(() => props.data || {})

const title        = computed(() => d.value.name || 'Location')
const status       = computed(() => d.value.status || null)
const verification = computed(() => d.value.verification_status || null)
const booking      = computed(() => !!d.value.booking_enabled)
const bookingNotes = computed(() => d.value.booking_notes || '')

const addressLine = computed(() => {
  const parts = [d.value.address, d.value.postal_code, d.value.city].filter(Boolean)
  return parts.length ? parts.join(', ') + (d.value.country ? ` (${d.value.country})` : '') : ''
})

const area        = computed(() => d.value.area_sqm || null)
const capSeatMax  = computed(() => d.value.capacity_seated_max || null)
const capStandMax = computed(() => d.value.capacity_standing_max || null)
const rooms       = computed(() => d.value.rooms_count || null)
const parking     = computed(() => d.value.parking_count || null)
const toilets     = computed(() => d.value.toilets_count || null)

const priceLine = computed(() => {
  const base = d.value.price_base
  const hr   = d.value.price_per_hour
  const notes = d.value.price_notes?.trim()
  const parts = []
  if (Number.isFinite(base)) parts.push(`Grundpreis €${base}`)
  if (Number.isFinite(hr)) parts.push(`€${hr}/Std.`)
  let s = parts.join(' · ')
  if (notes) s = s ? `${s} — ${notes}` : notes
  return s || ''
})

const availability = computed(() => d.value.availability_notes || '')

const email   = computed(() => d.value.email || '')
const phone   = computed(() => d.value.phone || '')
const website = computed(() => d.value.website || '')

const curfew = computed(() => d.value.curfew_time || '')
const minAge = computed(() => d.value.min_age || null)
const maxDb  = computed(() => d.value.max_noise_level_db || null)

const thumb = computed(() => Array.isArray(d.value.image_urls) && d.value.image_urls[0] ? d.value.image_urls[0] : '')

const created = computed(() => props.createdAt ? fmt(props.createdAt) : null)
const updated = computed(() => props.updatedAt ? fmt(props.updatedAt) : null)

const statusClass = computed(() => {
  switch (status.value) {
    case 'published': return 'bg-success'
    case 'draft':     return 'bg-warning text-dark'
    case 'archived':  return 'bg-dark'
    default:          return 'bg-light text-muted border'
  }
})
const verificationClass = computed(() => {
  switch (verification.value) {
    case 'verified': return 'bg-primary'
    case 'pending':  return 'bg-secondary'
    case 'rejected': return 'bg-danger'
    case 'none':     return 'bg-light text-dark border'
    default:         return 'bg-light text-muted border'
  }
})
</script>

<style scoped>
/* Desktop/LG+: kleines Thumb rechts im Header */
.summary-thumb {
  width: 120px;
  height: 90px;
  object-fit: cover;
}

/* Unter LG: Vollbreites Bild */
.summary-thumb-mobile {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 320px;
}
</style>
