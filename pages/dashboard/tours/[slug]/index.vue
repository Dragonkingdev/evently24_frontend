<template>
  <NuxtLayout name="dashboard">
    <template #title>Tour</template>

    <div v-if="pending" class="text-muted">Lade…</div>
    <div v-else-if="error" class="alert alert-danger">Konnte Tour oder Events nicht laden.</div>

    <div v-else-if="tour" class="row g-3">
      <div class="col-lg-8">
        <!-- Tour Card (links Infos, rechts KPIs + Status speichern) -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <!-- LEFT -->
              <div class="me-3">
                <h5 class="mb-1">{{ tour.title }}</h5>
                <div class="text-muted mb-1">{{ tour.subtitle }}</div>
                <div class="small text-muted mb-2">Slug: <code>{{ tour.slug }}</code></div>

                <p class="mb-1" v-if="tour.teaser">{{ tour.teaser }}</p>
                <p class="mb-0" v-if="tour.description">{{ tour.description }}</p>

                <!-- Shop-Info NUR Anzeige (keine globale Ticket-URL/Preise) -->
                <div class="small text-muted mt-3" v-if="tour.shopListingName || tour.shopInfoUrl">
                  <div v-if="tour.shopListingName"><strong>Im Shop gelistet als:</strong> {{ tour.shopListingName }}</div>
                  <div v-if="tour.shopInfoUrl">
                    <strong>Info-URL:</strong> <a :href="tour.shopInfoUrl" target="_blank" rel="noopener">{{ tour.shopInfoUrl }}</a>
                  </div>
                </div>
              </div>

              <!-- RIGHT -->
              <div class="text-end" style="min-width:260px;">
                <!-- KPIs -->
                <div class="d-flex flex-wrap gap-2 justify-content-end mb-3">
                  <div class="kpi"><div class="kpi-num">{{ kpis.total }}</div><div class="kpi-label">Events</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.upcoming }}</div><div class="kpi-label">Bevorstehend</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.onSale }}</div><div class="kpi-label">On&nbsp;Sale</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.soldOut }}</div><div class="kpi-label">Ausverkauft</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.canceled }}</div><div class="kpi-label">Abgesagt</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.cities }}</div><div class="kpi-label">Städte</div></div>
                  <div class="kpi"><div class="kpi-num">{{ kpis.countries }}</div><div class="kpi-label">Länder</div></div>
                </div>

                <!-- Edit-Link auf eigene Seite -->
                <NuxtLink class="btn btn-sm btn-outline-secondary w-100 mt-2"
                          :to="`/dashboard/tours/${tour.slug}/edit`">
                  Tour bearbeiten
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Events -->
        <div class="card border-0 shadow-sm mt-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="m-0">Events</h6>
              <button class="btn btn-sm btn-outline-primary" @click="openCreateEvent()">+ Event hinzufügen</button>
            </div>

            <div v-if="events && events.length" class="list-group list-group-flush">
              <div v-for="ev in sortedEvents" :key="ev.id"
                   class="list-group-item d-flex align-items-center justify-content-between">
                <div class="me-3">
                  <div class="fw-semibold">
                    {{ ev.city }} — {{ formatDateTime(ev.date) }}
                    <span class="badge ms-2" :class="statusBadgeClass(ev.status)">{{ statusLabel(ev.status) }}</span>
                  </div>
                  <div class="small text-muted">
                    {{ ev.venue }}
                    <span v-if="ev.address"> · {{ ev.address }}</span>
                    <span v-if="ev.countryCode"> · {{ ev.countryCode }}</span>
                  </div>
                  <div class="small" v-if="ev.ticketsUrl">
                    Tickets: <a :href="ev.ticketsUrl" target="_blank" rel="noopener">{{ ev.ticketsUrl }}</a>
                  </div>
                  <div class="small text-muted" v-if="ev.priceMin || ev.priceMax">
                    Preis: {{ ev.priceMin }}–{{ ev.priceMax }} {{ ev.currency || 'EUR' }}
                  </div>
                </div>

                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" @click="openEditEvent(ev)">Bearbeiten</button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDeleteEvent(ev)">Löschen</button>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small">Keine Events.</div>
          </div>
        </div>

        <!-- Internes -->
        <div class="card border-0 shadow-sm mt-3" v-if="tour.internalNotes || tour.supportActs?.length || tour.organizer">
          <div class="card-body">
            <h6 class="m-0 mb-2">Interne Infos</h6>
            <div v-if="tour.organizer" class="small"><strong>Veranstalter:</strong> {{ tour.organizer }}</div>
            <div v-if="tour.supportActs?.length" class="small"><strong>Support:</strong> {{ tour.supportActs.join(', ') }}</div>
            <div v-if="tour.internalNotes" class="small text-muted"><strong>Notizen:</strong> {{ tour.internalNotes }}</div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <!-- Status Dropdown + Speichern -->
            <div class="mb-2">
              <label class="form-label small mb-1">Tour-Status</label>
              <select class="form-select form-select-sm" v-model="tourStatusLocal">
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <button class="btn btn-sm btn-primary w-100" :disabled="actionLoading" @click="saveTourStatus">
              Speichern
            </button>
          </div>
        </div>

        <div class="card border-0 shadow-sm mt-3">
          <img :src="tour.poster || tour.image" class="card-img-top" alt="">
          <div class="card-body small text-muted">Poster/Hero Vorschau</div>
        </div>

        <div class="card border-0 shadow-sm mt-3">
          <div class="card-body">
            <h6 class="m-0 mb-2">SEO</h6>
            <div class="small"><strong>Meta Title:</strong> {{ tour.metaTitle || '—' }}</div>
            <div class="small"><strong>Meta Description:</strong> {{ tour.metaDescription || '—' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted">Tour nicht gefunden.</div>

    <!-- Event Modal (Create/Edit) -->
    <div class="modal fade" tabindex="-1" ref="eventModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title">{{ eventForm.id ? 'Event bearbeiten' : 'Event hinzufügen' }}</h5>
            <button type="button" class="btn-close" @click="closeEventModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-7">
                <label class="form-label">Datum/Zeit</label>
                <input type="datetime-local" class="form-control" v-model="eventForm.date">
              </div>
              <div class="col-md-5">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="eventForm.status">
                  <option v-for="s in eventStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Stadt</label>
                <input class="form-control" v-model="eventForm.city">
              </div>
              <div class="col-md-6">
                <label class="form-label">Venue</label>
                <input class="form-control" v-model="eventForm.venue">
              </div>
              <div class="col-md-12">
                <label class="form-label">Adresse</label>
                <input class="form-control" v-model="eventForm.address" placeholder="Straße Hausnr., PLZ Ort">
              </div>
              <div class="col-md-6">
                <label class="form-label">Land (ISO)</label>
                <input class="form-control" v-model="eventForm.countryCode" placeholder="DE, AT, CH …">
              </div>
              <div class="col-md-6">
                <label class="form-label">Tickets URL</label>
                <input class="form-control" v-model="eventForm.ticketsUrl">
              </div>
              <div class="col-md-6">
                <label class="form-label">Preis min</label>
                <input type="number" class="form-control" v-model.number="eventForm.priceMin" min="0" step="1">
              </div>
              <div class="col-md-6">
                <label class="form-label">Preis max</label>
                <input type="number" class="form-control" v-model.number="eventForm.priceMax" min="0" step="1">
              </div>
              <div class="col-md-12">
                <label class="form-label">Notizen (intern)</label>
                <textarea class="form-control" rows="2" v-model="eventForm.internalNotes"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" @click="closeEventModal">Abbrechen</button>
            <button class="btn btn-primary" :disabled="actionLoading" @click="saveEvent">
              {{ eventForm.id ? 'Speichern' : 'Anlegen' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.message" class="toast align-items-center text-bg-dark border-0 show position-fixed bottom-0 end-0 m-3" role="alert">
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.message=''"></button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: "dashboardlayout", auth: true })

import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'

const api = useApi()
const route = useRoute()
const slug = computed(() => encodeURIComponent(route.params.slug))

// Loaders
const { data: tourData, pending: tourPending, error: tourError, refresh: refreshTour } = await useAsyncData(
  () => `tour:${slug.value}`,
  () => api.get(`/dashboard/tours/${slug.value}`).then(r => r.data),
  { server: true }
)
const { data: eventsData, pending: evPending, error: evError, refresh: refreshEvents } = await useAsyncData(
  () => `tour:${slug.value}:events`,
  () => api.get(`/dashboard/tours/${slug.value}/events`).then(r => r.data),
  { server: true }
)
const tour = computed(() => tourData.value)
const events = computed(() => eventsData.value ?? tourData.value?.events ?? [])
const sortedEvents = computed(() => [...(events.value || [])].sort((a,b)=> new Date(a.date) - new Date(b.date)))
const pending = computed(() => tourPending.value || evPending.value)
const error = computed(() => tourError.value || evError.value)

// Status/KPIs
const statuses = [
  { value: 'draft',       label: 'Entwurf' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'published',   label: 'Veröffentlicht' },
  { value: 'finished',    label: 'Beendet' },
  { value: 'archived',    label: 'Archiviert' },
]
const eventStatuses = [
  { value: 'scheduled',   label: 'Geplant' },
  { value: 'onsale',      label: 'On Sale' },
  { value: 'soldout',     label: 'Ausverkauft' },
  { value: 'canceled',    label: 'Abgesagt' },
  { value: 'done',        label: 'Vorbei' },
]
const statusLabel = (v) => statuses.find(s=>s.value===v)?.label || v
const statusBadgeClass = (v) => ({
  'draft':'text-bg-secondary',
  'in_progress':'text-bg-info',
  'published':'text-bg-success',
  'finished':'text-bg-dark',
  'archived':'text-bg-light text-dark',
  'scheduled':'text-bg-secondary',
  'onsale':'text-bg-primary',
  'soldout':'text-bg-warning',
  'canceled':'text-bg-danger',
  'done':'text-bg-dark',
})[v] || 'text-bg-secondary'

const tourStatusLocal = ref('draft')
onMounted(()=> { tourStatusLocal.value = tour.value?.status || 'draft' })

const kpis = computed(() => {
  const list = events.value || []
  const now = new Date()
  const total = list.length
  const upcoming = list.filter(e => new Date(e.date) >= now && e.status !== 'canceled').length
  const onSale = list.filter(e => e.status === 'onsale').length
  const soldOut = list.filter(e => e.status === 'soldout').length
  const canceled = list.filter(e => e.status === 'canceled').length
  const cities = new Set(list.map(e => (e.city || '').trim()).filter(Boolean)).size
  const countries = new Set(list.map(e => (e.countryCode || '').trim()).filter(Boolean)).size
  return { total, upcoming, onSale, soldOut, canceled, cities, countries }
})

// UI/Modal
const actionLoading = ref(false)
const toast = reactive({ message: '' })
let bsEventModal = null
const eventModal = ref(null)
onMounted(async () => {
  const { Modal } = await import('bootstrap')
  bsEventModal = new Modal(eventModal.value)
})
const openCreateEvent = () => { resetEventForm(); bsEventModal?.show() }
const openEditEvent = (ev) => { Object.assign(eventForm, toEventForm(ev)); bsEventModal?.show() }
const closeEventModal = () => bsEventModal?.hide()

// Helpers
const formatDateTime = (iso) => { try { return new Date(iso).toLocaleString('de-DE') } catch { return iso } }

// Status speichern
const saveTourStatus = async () => {
  actionLoading.value = true
  try {
    await api.patch(`/dashboard/tours/${slug.value}/status`, { status: tourStatusLocal.value })
    await refreshTour()
    toast.message = 'Status gespeichert.'
  } catch (e) {
    console.error(e)
    toast.message = 'Konnte Status nicht speichern.'
  } finally {
    actionLoading.value = false
  }
}

// Event Form (inkl. Preise & Ticket-URL pro Event)
const eventForm = reactive({
  id: null, date: '', city: '', venue: '', address: '', countryCode: '',
  ticketsUrl: '', priceMin: null, priceMax: null, currency: 'EUR',
  status: 'scheduled', internalNotes: '',
})
const toEventForm = (ev) => ({
  id: ev?.id ?? null,
  date: ev?.date ? ev.date.slice(0,16) : '',
  city: ev?.city ?? '',
  venue: ev?.venue ?? '',
  address: ev?.address ?? '',
  countryCode: ev?.countryCode ?? '',
  ticketsUrl: ev?.ticketsUrl ?? '',
  priceMin: ev?.priceMin ?? null,
  priceMax: ev?.priceMax ?? null,
  currency: ev?.currency ?? 'EUR',
  status: ev?.status ?? 'scheduled',
  internalNotes: ev?.internalNotes ?? '',
})
const resetEventForm = () => Object.assign(eventForm, toEventForm(null))
const saveEvent = async () => {
  actionLoading.value = true
  try {
    const payload = { ...eventForm, date: eventForm.date ? new Date(eventForm.date).toISOString() : null }
    if (eventForm.id) {
      await api.put(`/dashboard/tours/${slug.value}/events/${eventForm.id}`, payload)
      toast.message = 'Event gespeichert.'
    } else {
      await api.post(`/dashboard/tours/${slug.value}/events`, payload)
      toast.message = 'Event angelegt.'
    }
    await refreshEvents()
    closeEventModal()
  } catch (e) {
    console.error(e)
    toast.message = 'Fehler beim Speichern des Events.'
  } finally {
    actionLoading.value = false
  }
}
const confirmDeleteEvent = async (ev) => {
  if (!confirm(`Event in ${ev.city} am ${formatDateTime(ev.date)} löschen?`)) return
  actionLoading.value = true
  try {
    await api.delete(`/dashboard/tours/${slug.value}/events/${ev.id}`)
    await refreshEvents()
    toast.message = 'Event gelöscht.'
  } catch (e) {
    console.error(e)
    toast.message = 'Konnte Event nicht löschen.'
  } finally {
    actionLoading.value = false
  }
}
</script>

<style scoped>
.kpi { padding:.4rem .6rem; border-radius:.5rem; background:var(--bs-light); text-align:right; min-width:80px; }
.kpi-num { font-weight:700; line-height:1; }
.kpi-label { font-size:.75rem; color:var(--bs-secondary-color); }
.modal-backdrop { opacity:.2 !important; }
</style>
