
<!--pages/business/dashboard.vue-->
<template>
  <div class="container-fluid py-3">

    <!-- Head -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <h1 class="h4 mb-0">Dashboard</h1>

      <div class="d-flex flex-wrap gap-2">
        <NuxtLink v-if="hasWid" :to="`/business/w/${wid}/events/create`" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-lg me-1"></i> Neues Event
        </NuxtLink>
        <NuxtLink v-if="hasWid" :to="`/business/w/${wid}/locations/create`" class="btn btn-outline-primary btn-sm">
          <i class="bi bi-geo-alt me-1"></i> Neue Location
        </NuxtLink>
        <NuxtLink v-if="!hasWid" to="/business/onboarding" class="btn btn-primary btn-sm">
          <i class="bi bi-rocket-takeoff me-1"></i> Workspace anlegen
        </NuxtLink>
      </div>
    </div>

    <!-- No workspace info -->
    <div v-if="!hasWid" class="alert alert-warning">
      <i class="bi bi-info-circle me-1"></i>
      Du hast noch keinen Workspace. Starte das <NuxtLink to="/business/onboarding">Onboarding</NuxtLink>.
    </div>

    <template v-else>
      <!-- KPI Row -->
      <div class="row g-3 mb-3">
        <div class="col-12 col-md-6 col-xl-3" v-for="card in kpiCards" :key="card.key">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="fw-semibold">{{ card.title }}</div>
                <i :class="`bi ${card.icon}`"></i>
              </div>

              <div class="display-6" v-if="!loadingStats">{{ card.value }}</div>
              <div v-else class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>

              <div class="mt-2">
                <Sparkline :points="card.series" :height="40" />
              </div>

              <div class="small text-muted mt-1" v-if="card.subtitle">{{ card.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2up: Top Locations + Bevorstehende Events -->
      <div class="row g-3 mb-3">
        <!-- Top Locations -->
        <div class="col-12 col-xl-7">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-semibold"><i class="bi bi-building me-1"></i>Top Locations (letzte 14 Tage)</span>
              <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-sm btn-outline-secondary">Alle ansehen</NuxtLink>
            </div>
            <div class="card-body p-0">
              <div v-if="loadingLocations" class="p-3">
                <div class="placeholder-glow"><span class="placeholder col-12 mb-2"></span></div>
                <div class="placeholder-glow"><span class="placeholder col-10 mb-2"></span></div>
                <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
              </div>
              <div v-else-if="!topLocations.length" class="p-3 text-muted">Noch keine Locations.</div>
              <div v-else class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead class="small text-muted">
                    <tr>
                      <th>Location</th>
                      <th class="text-end">Besuche</th>
                      <th class="text-end">Anfragen</th>
                      <th class="text-end">Trend</th>
                      <th style="width:1%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in topLocations" :key="row.id">
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="row.thumb"
                            class="rounded border"
                            style="width:48px;height:32px;object-fit:cover"
                            :alt="row.name"
                            @error="e => e.target.src = fallbackImg"
                          />
                          <div class="text-truncate">
                            <div class="fw-semibold text-truncate" :title="row.name">{{ row.name }}</div>
                            <div class="small text-muted text-truncate">{{ row.cityLine }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-end">{{ row.visitsTotal.toLocaleString() }}</td>
                      <td class="text-end">{{ row.inquiriesTotal.toLocaleString() }}</td>
                      <td class="text-end">
                        <div style="width:120px">
                          <Sparkline :points="row.inquiries" :height="24" />
                        </div>
                      </td>
                      <td class="text-end">
                        <NuxtLink :to="`/business/w/${wid}/locations/${row.id}`" class="btn btn-sm btn-outline-secondary">
                          Details
                        </NuxtLink>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="col-12 col-xl-5">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-semibold"><i class="bi bi-calendar-event me-1"></i>Bevorstehende Events</span>
              <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-sm btn-outline-secondary">Alle Events</NuxtLink>
            </div>
            <div class="card-body">
              <div v-if="loadingEvents">
                <div class="placeholder-glow mb-2"><span class="placeholder col-12"></span></div>
                <div class="placeholder-glow mb-2"><span class="placeholder col-10"></span></div>
                <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
              </div>
              <div v-else-if="!upcoming.length" class="text-muted">Keine kommenden Events.</div>
              <ul v-else class="list-unstyled mb-0">
                <li v-for="ev in upcoming" :key="ev.id" class="py-2 border-bottom">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <div class="min-w-0">
                      <div class="fw-semibold text-truncate" :title="ev.title">{{ ev.title }}</div>
                      <div class="small text-muted">
                        <i class="bi bi-clock me-1"></i>{{ ev.dateLabel }}
                        <span v-if="ev.city" class="ms-2"><i class="bi bi-geo-alt me-1"></i>{{ ev.city }}</span>
                      </div>
                    </div>
                    <NuxtLink :to="`/business/w/${wid}/events/${ev.id}`" class="btn btn-sm btn-outline-secondary">Öffnen</NuxtLink>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact revenue spark -->
      <div class="card">
        <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div class="fw-semibold mb-1"><i class="bi bi-cash-coin me-1"></i>Umsatz (Rolling 30)</div>
            <div class="text-muted small">Vorsteuer, gerundet</div>
          </div>
          <div class="flex-grow-1" />
          <div style="width: 280px; max-width: 100%;">
            <Sparkline :points="revSpark" :height="48" />
          </div>
          <div class="display-6 mb-0 ms-2" v-if="!loadingStats">{{ revenueTotalLabel }}</div>
          <div v-else class="placeholder-glow"><span class="placeholder col-6"></span></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import Sparkline from '~/components/ui/Sparkline.vue'

const { wid } = useWorkspaceApi()
const hasWid = computed(() => !!wid.value)

const {
  fetchStats,        // returns aggregated workspace stats
  listEvents,        // GET events
  listLocations      // GET locations
} = useWorkspaceApi()

/* ------------ STATE ------------ */
const loadingStats     = ref(false)
const loadingEvents    = ref(false)
const loadingLocations = ref(false)

const stats = ref({})
const kpiCards = ref([])

const upcoming = ref([])
const topLocations = ref([])

const fallbackImg = 'https://picsum.photos/seed/location-fallback/600/400'

/* ------------ LOADERS ------------ */
async function loadStats() {
  if (!hasWid.value) return
  loadingStats.value = true
  try {
    const data = await fetchStats()   // your composable returns raw {…} or {}
    stats.value = data || {}
    buildKpis()
  } finally {
    loadingStats.value = false
  }
}

function buildKpis() {
  const s = stats.value || {}
  kpiCards.value = [
    {
      key: 'revenue', title: 'Umsatz', icon: 'bi-cash-coin',
      value: formatMoney(s.revenue_total),
      series: s.revenue_spark || [],
      subtitle: s.revenue_period_label || 'letzte 30 Tage'
    },
    {
      key: 'tickets', title: 'Tickets', icon: 'bi-ticket-perforated',
      value: toLabel(s.tickets_sold),
      series: s.tickets_spark || [],
      subtitle: 'verkauft'
    },
    {
      key: 'events', title: 'Events aktiv', icon: 'bi-calendar2-check',
      value: toLabel(s.events_active),
      series: s.events_spark || [],
      subtitle: 'aktuell aktiv'
    },
    {
      key: 'conv', title: 'Conversion', icon: 'bi-graph-up',
      value: s.conversion != null ? `${s.conversion}%` : '–',
      series: s.conv_spark || [],
      subtitle: 'Website → Anfrage'
    },
  ]
}

async function loadUpcomingEvents() {
  if (!hasWid.value) return
  loadingEvents.value = true
  try {
    const { data } = await listEvents('', true)
    const arr = Array.isArray(data?.items) ? data.items
            : Array.isArray(data?.results) ? data.results
            : Array.isArray(data) ? data
            : []
    // Filter: künftige Events & sortiert
    const now = new Date()
    upcoming.value = arr
      .map(e => ({
        id: e.id,
        title: e.title || 'Unbenannt',
        date: e.date ? new Date(e.date) : null,
        dateLabel: e.date ? new Date(e.date).toLocaleString() : '—',
        city: e.location?.city || e.location_text_city || null
      }))
      .filter(e => !e.date || e.date >= now)
      .sort((a,b) => (a.date?.getTime?.() ?? 0) - (b.date?.getTime?.() ?? 0))
      .slice(0, 6)
  } finally {
    loadingEvents.value = false
  }
}

async function loadTopLocations() {
  if (!hasWid.value) return
  loadingLocations.value = true
  try {
    const { data } = await listLocations({})  // no q → zeige alle (dein Backend liefert sortiert id desc)
    const rows = Array.isArray(data?.items) ? data.items
              : Array.isArray(data?.results) ? data.results
              : Array.isArray(data) ? data
              : []
    // Score nach (inquiries_total, visits_total)
    const scored = rows.map(r => {
      const m = r.metrics || {}
      const visits = Array.isArray(m.visits) ? m.visits : []
      const inquiries = Array.isArray(m.inquiries) ? m.inquiries : []
      const visitsTotal = Number.isFinite(m.visits_total) ? m.visits_total : visits.reduce((a,b)=>a+(+b||0),0)
      const inquiriesTotal = Number.isFinite(m.inquiries_total) ? m.inquiries_total : inquiries.reduce((a,b)=>a+(+b||0),0)
      const cityLine = [r.postal_code, r.city].filter(Boolean).join(' ') || r.city || ''
      const thumb = Array.isArray(r.image_urls) && r.image_urls[0] ? r.image_urls[0] : fallbackImg
      return {
        id: r.id, name: r.name, cityLine, thumb,
        visits, inquiries, visitsTotal, inquiriesTotal,
        score: inquiriesTotal * 5 + visitsTotal // simple heuristic
      }
    })
    topLocations.value = scored
      .sort((a,b) => b.score - a.score)
      .slice(0, 6)
  } finally {
    loadingLocations.value = false
  }
}

/* ------------ DERIVED ------------ */
const revSpark = computed(() => stats.value?.revenue_spark || [])
const revenueTotalLabel = computed(() => formatMoney(stats.value?.revenue_total))

/* ------------ HELPERS ------------ */
function toLabel(v) {
  if (v == null) return '–'
  const n = Number(v)
  return Number.isFinite(n) ? n.toLocaleString() : String(v)
}
function formatMoney(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '–'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `${n.toLocaleString()} €`
  }
}

/* ------------ BOOTSTRAP ------------ */
watch(() => wid.value, async (id) => {
  if (!id) return
  await Promise.all([
    loadStats(),
    loadUpcomingEvents(),
    loadTopLocations()
  ])
}, { immediate: true })
</script>

<style scoped>
.placeholder { display:inline-block; background-color: var(--bs-secondary-bg); height:1.2rem; border-radius:.25rem; }
.placeholder-glow .placeholder { animation: glow 1.2s ease-in-out infinite; }
@keyframes glow { 50% { opacity: .5; } }

.table td, .table th { vertical-align: middle; }
</style>
