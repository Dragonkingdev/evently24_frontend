<!-- pages/business/w/[wid]/locations/[location_id]/index.vue -->
<template>
  <div class="location-view">
    <!-- HERO im Event-Stil -->
    <section class="ev-hero card mb-4 overflow-hidden">
      <div class="ev-hero-bg"></div>
      <div class="card-body position-relative">
        <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div class="d-flex align-items-start gap-3">
            <div class="ev-hero-badge">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="ev-status badge" :class="statusBadgeClass(loc?.status)">
                  {{ statusLabel(loc?.status) }}
                </span>
                <span v-if="loc?.verification_status" class="ev-mode badge" :class="verificationBadgeClass(loc?.verification_status)">
                  {{ verificationLabel(loc?.verification_status) }}
                </span>
                <span v-if="loc?.id" class="badge bg-light text-dark">ID #{{ loc.id }}</span>
              </div>

              <h1 class="ev-title mt-1 mb-1">{{ loc?.name || 'Location' }}</h1>

              <div class="ev-subtle text-muted">
                <i class="bi bi-geo me-1"></i>
                <strong>{{ loc?.city || '—' }}</strong>
                <span v-if="loc?.country"> • {{ loc.country }}</span>

                <template v-if="loc?.created_at || loc?.updated_at">
                  <span class="ms-3">
                    <i class="bi bi-clock-history me-1"></i>
                    <span v-if="loc?.created_at">Erstellt: {{ fmt(loc.created_at) }}</span>
                    <span v-if="loc?.created_at && loc?.updated_at"> • </span>
                    <span v-if="loc?.updated_at">Akt.: {{ fmt(loc.updated_at) }}</span>
                  </span>
                </template>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left"></i> Zurück
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- NAV im Event-Stil (optional einfaches Dummy-Navi – kannst du erweitern) -->
    <div class="ev-nav mb-4">
      <div class="d-flex flex-wrap gap-2">
        <NuxtLink :to="`/business/w/${wid}/locations/${locationId}`" class="btn btn-primary">
          <i class="bi bi-sliders"></i><span class="ms-1">Details</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="row g-4">
      <div class="col-12">
        <div class="card p-3">
          <div class="skeleton skeleton-title mb-3"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line w-75"></div>
        </div>
      </div>
    </div>

    <!-- CONTENT: einzelne Blöcke (Karten) -->
    <div v-else class="row g-4">
      <div class="col-12">

        <!-- BASIS -->
        <div class="card loc-section">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Basis</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.basis=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-type me-2"></i>Name</div><div class="kv-value">{{ loc?.name || '—' }}</div></div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-globe2 me-2"></i>Land</div><div class="kv-value">{{ loc?.country || '—' }}</div></div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-building me-2"></i>PLZ / Stadt</div>
                  <div class="kv-value">
                    {{ loc?.postal_code || '' }}
                    <span v-if="(loc?.postal_code && loc?.city)"> · </span>
                    {{ loc?.city || '' }}
                    <span v-if="loc?.country"> · {{ loc.country }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-signpost-2 me-2"></i>Adresse</div><div class="kv-value">{{ loc?.address || '—' }}</div></div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-envelope me-2"></i>E-Mail</div>
                  <div class="kv-value">
                    <a v-if="loc?.email" :href="`mailto:${loc.email}`">{{ loc.email }}</a><span v-else>—</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-telephone me-2"></i>Telefon</div><div class="kv-value">{{ loc?.phone || '—' }}</div></div>
              </div>
              <div class="col-md-6">
                <div class="kv"><div class="kv-label"><i class="bi bi-link-45deg me-2"></i>Website</div>
                  <div class="kv-value">
                    <a v-if="loc?.website" :href="loc.website" target="_blank" rel="noopener" class="truncate-link">{{ loc.website }}</a>
                    <span v-else>—</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BUCHUNG -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Buchung</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.booking=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="kv">
              <div class="kv-label"><i class="bi bi-calendar-check me-2"></i>Buchbar</div>
              <div class="kv-value">
                <span class="badge" :class="loc?.booking_enabled ? 'bg-success' : 'bg-secondary'">
                  {{ loc?.booking_enabled ? 'Ja' : 'Nein' }}
                </span>
              </div>
            </div>
            <div class="kv mt-2" v-if="loc?.booking_notes">
              <div class="kv-label"><i class="bi bi-info-circle me-2"></i>Hinweise</div>
              <div class="kv-value">{{ loc.booking_notes }}</div>
            </div>
          </div>
        </div>

        <!-- KAPAZITÄT & FLÄCHE -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Kapazität & Fläche</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.capacity=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span v-if="has(loc?.area_sqm)" class="badge bg-light text-dark border">
                <i class="bi bi-aspect-ratio me-1"></i>{{ loc.area_sqm }} m²
              </span>
              <span v-if="has(loc?.capacity_seated_min) || has(loc?.capacity_seated_max)" class="badge bg-light text-dark border">
                <i class="bi bi-people me-1"></i>
                Sitzplätze {{ loc?.capacity_seated_min ?? '—' }}–{{ loc?.capacity_seated_max ?? '—' }}
              </span>
              <span v-if="has(loc?.capacity_standing_max)" class="badge bg-light text-dark border">
                <i class="bi bi-people-fill me-1"></i>Stehend {{ loc.capacity_standing_max }}
              </span>
              <span v-if="has(loc?.rooms_count)" class="badge bg-light text-dark border">
                <i class="bi bi-grid-3x3-gap me-1"></i>{{ loc.rooms_count }} Räume
              </span>
              <span v-if="has(loc?.parking_count)" class="badge bg-light text-dark border">
                <i class="bi bi-car-front me-1"></i>{{ loc.parking_count }} Parkplätze
              </span>
              <span v-if="has(loc?.toilets_count)" class="badge bg-light text-dark border">
                <i class="bi bi-droplet me-1"></i>{{ loc.toilets_count }} WCs
              </span>
            </div>
          </div>
        </div>

        <!-- KATALOGE -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Kataloge</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.catalogs=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="mb-2" v-if="(loc?.categories||[]).length">
              <div class="small text-muted mb-1">Kategorien</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="c in renderList(loc?.categories)" :key="'cat-'+c" class="badge bg-success text-uppercase">{{ labelOf('categories', c) }}</span>
              </div>
            </div>
            <div class="mb-2" v-if="(loc?.amenities||[]).length">
              <div class="small text-muted mb-1">Ausstattung</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="a in renderList(loc?.amenities)" :key="'am-'+a" class="badge bg-light text-dark border">{{ labelOf('amenities', a) }}</span>
              </div>
            </div>
            <div class="mb-2" v-if="(loc?.tech||[]).length">
              <div class="small text-muted mb-1">Technik</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="t in renderList(loc?.tech)" :key="'tech-'+t" class="badge bg-light text-dark border">{{ labelOf('tech', t) }}</span>
              </div>
            </div>
            <div class="mb-2" v-if="(loc?.services||[]).length">
              <div class="small text-muted mb-1">Catering & Services</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="s in renderList(loc?.services)" :key="'srv-'+s" class="badge bg-light text-dark border">{{ labelOf('services', s) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- REGELN -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Regeln</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.rules=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span v-if="loc?.curfew_time" class="badge bg-light text-dark border">
                <i class="bi bi-moon-stars me-1"></i>Sperrstunde {{ loc.curfew_time }}
              </span>
              <span v-if="has(loc?.min_age)" class="badge bg-light text-dark border">
                <i class="bi bi-person-check me-1"></i>ab {{ loc.min_age }}
              </span>
              <span v-if="has(loc?.max_noise_level_db)" class="badge bg-light text-dark border">
                <i class="bi bi-volume-up me-1"></i>{{ loc.max_noise_level_db }} dB
              </span>
            </div>
            <div class="d-flex flex-wrap gap-2 mt-2" v-if="(loc?.rules||[]).length">
              <span v-for="r in renderList(loc.rules)" :key="'rule-'+r" class="badge bg-light text-dark border">{{ labelOf('rules', r) }}</span>
            </div>
          </div>
        </div>

        <!-- VERFÜGBARKEIT -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Verfügbarkeit</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.availability=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="kv">
              <div class="kv-label"><i class="bi bi-calendar-event me-2"></i>Hinweise</div>
              <div class="kv-value">{{ loc?.availability_notes || '—' }}</div>
            </div>
          </div>
        </div>

        <!-- MEDIEN -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Medien</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.media=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div v-if="(loc?.image_urls||[]).length" class="d-flex flex-wrap gap-2">
              <img v-for="(u,i) in loc.image_urls" :key="i" :src="u" alt="" class="rounded border" style="height:60px; object-fit:cover;">
            </div>
            <div v-else class="text-muted">—</div>
          </div>
        </div>

        <!-- PREISE & POLICIES -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Preise & Tarife</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.pricing=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="ev-tile">
                  <div class="ev-tile-icon"><i class="bi bi-cash-coin"></i></div>
                  <div class="ev-tile-body">
                    <div class="ev-tile-label">Tagesrate (netto)</div>
                    <div class="ev-tile-value">{{ money(loc?.day_rate_base) }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="ev-tile">
                  <div class="ev-tile-icon"><i class="bi bi-percent"></i></div>
                  <div class="ev-tile-body">
                    <div class="ev-tile-label">MwSt.</div>
                    <div class="ev-tile-value">{{ percent(loc?.vat_percent) }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="ev-tile">
                  <div class="ev-tile-icon"><i class="bi bi-basket"></i></div>
                  <div class="ev-tile-body">
                    <div class="ev-tile-label">Überstunde (netto)</div>
                    <div class="ev-tile-value">{{ money(loc?.extra_hour_rate) }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="ev-tile">
                  <div class="ev-tile-icon"><i class="bi bi-shield-check"></i></div>
                  <div class="ev-tile-body">
                    <div class="ev-tile-label">Kaution (netto)</div>
                    <div class="ev-tile-value">{{ money(loc?.deposit) }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="loc?.pricing_notes">
                <div class="kv mt-2">
                  <div class="kv-label"><i class="bi bi-clipboard-check me-2"></i>Preis-Hinweise</div>
                  <div class="kv-value">{{ loc.pricing_notes }}</div>
                </div>
              </div>
              <div class="col-12" v-if="loc?.cancellation_policy">
                <div class="kv mt-2">
                  <div class="kv-label"><i class="bi bi-journal-text me-2"></i>Stornoregeln</div>
                  <div class="kv-value">{{ loc.cancellation_policy }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STATUS -->
        <div class="card loc-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Status</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="modals.status=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="badge" :class="statusBadgeClass(loc?.status)">{{ statusLabel(loc?.status) }}</span>
              <span v-if="loc?.verification_status" class="badge" :class="verificationBadgeClass(loc?.verification_status)">
                {{ verificationLabel(loc?.verification_status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- KARTE -->
        <div class="card loc-section mt-3">
          <div class="card-header"><strong>Karte</strong></div>
          <div class="card-body">
            <div class="ev-map card h-100">
              <div class="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                <i class="bi bi-map fs-1 mb-2"></i>
                <div>Map-Preview</div>
                <div class="small">Hier könnte später eine Karte eingebunden werden</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- EDIT-MODALS (pro Block genau ein Modal) -->
    <EditLocationBasisModal
      :open="modals.basis" :location-id="locationId" :loc="loc"
      @close="modals.basis=false" @updated="applyUpdated"
    />
    <EditLocationBookingModal
      :open="modals.booking" :location-id="locationId" :loc="loc"
      @close="modals.booking=false" @updated="applyUpdated"
    />
    <EditLocationCapacityModal
      :open="modals.capacity" :location-id="locationId" :loc="loc"
      @close="modals.capacity=false" @updated="applyUpdated"
    />
    <EditLocationCatalogsModal
      :open="modals.catalogs" :location-id="locationId" :loc="loc"
      @close="modals.catalogs=false" @updated="applyUpdated"
    />
    <EditLocationRulesModal
      :open="modals.rules" :location-id="locationId" :loc="loc"
      @close="modals.rules=false" @updated="applyUpdated"
    />
    <EditLocationAvailabilityModal
      :open="modals.availability" :location-id="locationId" :loc="loc"
      @close="modals.availability=false" @updated="applyUpdated"
    />
    <EditLocationMediaModal
      :open="modals.media" :location-id="locationId" :loc="loc"
      @close="modals.media=false" @updated="applyUpdated"
    />
    <EditLocationPricingModal
      :open="modals.pricing" :location-id="locationId" :loc="loc"
      @close="modals.pricing=false" @updated="applyUpdated"
    />
    <EditLocationStatusModal
      :open="modals.status" :location-id="locationId" :loc="loc"
      @close="modals.status=false" @updated="applyUpdated"
    />
  </div>
</template>

<script setup>
import EditLocationBasisModal from '~/components/business/workspaces/locations/modals/EditLocationBasisModal.vue'
import EditLocationBookingModal from '~/components/business/workspaces/locations/modals/EditLocationBookingModal.vue'
import EditLocationCapacityModal from '~/components/business/workspaces/locations/modals/EditLocationCapacityModal.vue'
import EditLocationCatalogsModal from '~/components/business/workspaces/locations/modals/EditLocationCatalogsModal.vue'
import EditLocationRulesModal from '~/components/business/workspaces/locations/modals/EditLocationRulesModal.vue'
import EditLocationAvailabilityModal from '~/components/business/workspaces/locations/modals/EditLocationAvailabilityModal.vue'
import EditLocationMediaModal from '~/components/business/workspaces/locations/modals/EditLocationMediaModal.vue'
import EditLocationPricingModal from '~/components/business/workspaces/locations/modals/EditLocationPricingModal.vue'
import EditLocationStatusModal from '~/components/business/workspaces/locations/modals/EditLocationStatusModal.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const locationId = Number(route.params.location_id)

const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl
const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/locations/${locationId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending, refresh } = await useAsyncData(`location-${wid}-${locationId}`, fetcher)
const loc = computed(() => data.value || null)

const { fetchLocationOptions, optionMaps, labelOf } = useWorkspaceApi()
await fetchLocationOptions().catch(()=>{})

const modals = reactive({
  basis:false, booking:false, capacity:false, catalogs:false,
  rules:false, availability:false, media:false, pricing:false, status:false
})

async function applyUpdated(updated){
  if (updated) data.value = updated
  try { await refresh() } catch {}
}

/* Anzeige-Helpers */
function has(v){ return v !== undefined && v !== null && v !== '' }
function renderList(arr){ return Array.isArray(arr) ? arr : [] }
function money(v){ if(!has(v)) return '—'; const n=Number(v); return Number.isFinite(n)? new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n) : '—' }
function percent(v){ if(!has(v)) return '—'; const n=Number(v); return Number.isFinite(n)? `${n}%` : '—' }
function fmt(iso){ try{ return new Date(iso).toLocaleString('de-DE', { dateStyle:'medium', timeStyle:'short' }) }catch{ return '—' } }

function statusLabel(s){
  switch((s||'').toLowerCase()){
    case 'draft': return 'Entwurf'
    case 'published': return 'Veröffentlicht'
    case 'archived': return 'Archiviert'
    default: return '—'
  }
}
function statusBadgeClass(s){
  switch((s||'').toLowerCase()){
    case 'published': return 'bg-status-live'
    case 'archived':  return 'bg-status-archived text-dark'
    case 'draft':
    default:          return 'bg-status-draft'
  }
}
function verificationLabel(s){
  switch((s||'').toLowerCase()){
    case 'verified': return 'Verifiziert'
    case 'pending':  return 'Ausstehend'
    case 'rejected': return 'Abgelehnt'
    case 'none':     return '—'
    default:         return '—'
  }
}
function verificationBadgeClass(s){
  switch((s||'').toLowerCase()){
    case 'verified': return 'bg-mode-int'
    case 'pending':  return 'bg-mode-ext'
    case 'rejected': return 'bg-danger'
    default:         return 'bg-light text-dark'
  }
}
</script>

<style scoped>
/* Hero – wie bei Events */
.ev-hero { border: 0; border-radius: 1rem; }
.ev-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(1200px 400px at -10% -50%, #5a8bff, transparent 70%),
              radial-gradient(800px 300px at 120% 10%, #7cc2ff, transparent 60%),
              linear-gradient(135deg, #fff 0%, #f8fbff 100%);
  opacity: .65;
}
.ev-hero .card-body { padding: 1.25rem 1.25rem; }
@media (min-width: 992px){ .ev-hero .card-body { padding: 1.5rem 1.75rem; } }
.ev-hero-badge{ width:52px; height:52px; border-radius:12px; display:grid; place-items:center; background: rgba(13,110,253,.1); color:#0d6efd; font-size:1.25rem; box-shadow:0 8px 22px rgba(13,110,253,.15); }
.ev-title{ font-size: clamp(1.2rem, 1.2rem + 1vw, 1.65rem); }
.ev-subtle{ color:#556070; }
.ev-status.badge{ font-weight:600; padding:.45rem .6rem; border-radius:.6rem; letter-spacing:.02em; }
.bg-status-draft{ background:#9aa4b2; color:#fff; }
.bg-status-live{ background:#2fb67c; color:#fff; }
.bg-status-archived{ background:#e9ecef; }

.ev-mode.badge{ padding:.4rem .6rem; border-radius:999px; }
.bg-mode-int{ background:#e8f1ff; color:#0b5ed7; border:1px solid rgba(13,110,253,.25); }
.bg-mode-ext{ background:#f1eefc; color:#6f42c1; border:1px solid rgba(111,66,193,.25); }

/* Nav (wie EventNav-Stil) */
.ev-nav .btn{ padding:.5rem .75rem; font-weight:600; display:inline-flex; align-items:center; line-height:1.1; }

/* Karten & Inhalt */
.loc-section { border-radius: 1rem; overflow: hidden; }
.loc-section .card-header { background:#fff; border-bottom:1px solid #eef2f6; }

.kv{ display:grid; grid-template-columns: 180px 1fr; gap:.5rem .75rem; align-items:start; }
.kv-label{ color: var(--biz-ink-700, #556070); font-weight:600; }
.kv-value{ color: var(--biz-ink-900, #1f2630); }

.ev-tile{ display:flex; gap:.85rem; padding:.9rem 1rem; border:1px solid #eef1f6; border-radius:.8rem; background:linear-gradient(180deg,#fff,#fbfcff); }
.ev-tile-icon{ width:42px; height:42px; border-radius:.75rem; display:grid; place-items:center; background: rgba(13,110,253,.12); color:#0d6efd; }

.ev-map{ border:1px dashed #e6e9ef; border-radius:.9rem; background: repeating-linear-gradient(45deg,#fafbfe,#fafbfe 10px,#f6f8fd 10px,#f6f8fd 20px); }

/* Skeleton */
.skeleton { display:block; height:12px; border-radius:8px; background:linear-gradient(90deg,#f2f4f8 0%,#e9edf3 50%,#f2f4f8 100%); background-size:200% 100%; animation: sk 1.2s infinite; }
.skeleton-title{ height:22px; width:60%; }
.skeleton-line{ height:12px; width:90%; }
@keyframes sk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.truncate-link{ display:inline-block; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:bottom; }
</style>
