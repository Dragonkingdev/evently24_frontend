<!-- components/business/workspaces/events/EventForm.vue -->
<template>
  <form @submit.prevent="$emit('submit', serialize())" class="d-grid gap-3">
    <!-- Karte 1: Event -->
    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <strong>Event</strong>
        <!-- Nur noch ID, KEIN Status -->
        <span v-if="edit" class="small text-muted">ID: {{ modelValue?.id }}</span>
      </div>

      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Titel *</label>
            <input class="form-control" v-model="form.title" required />
          </div>
          <div class="col-md-4">
            <label class="form-label">Kategorie</label>
            <input class="form-control" v-model="form.category" />
          </div>

          <div class="col-md-6">
            <label class="form-label">Start (Datum & Uhrzeit) *</label>
            <input type="datetime-local" class="form-control" v-model="localDateStart" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Ende (optional)</label>
            <input type="datetime-local" class="form-control" v-model="localDateEnd" :min="localDateStart || undefined" />
          </div>

          <div class="col-md-6">
            <label class="form-label">Zeitzone (IANA)</label>
            <select class="form-select" v-model="timeZone">
              <option v-for="tz in TIMEZONES" :key="tz" :value="tz">{{ tz }}</option>
            </select>
            <div class="form-text">Zusätzlich zu den Zeiten – robust bei DST/IANA-Updates.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Karte 2: Listing-Modus -->
    <div class="card">
      <div class="card-header"><strong>Listing-Modus</strong></div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Modus</label>
            <select class="form-select" v-model="form.listing_mode">
              <option value="internal">Intern (Ticketsystem)</option>
              <option value="external">Extern (Ticket-URL)</option>
            </select>
          </div>

          <!-- Extern: URL -->
          <div class="col-md-8" v-if="form.listing_mode==='external'">
            <label class="form-label">Ticket-Verkaufslink *</label>
            <input class="form-control" v-model="form.external_ticket_url" placeholder="https://…" />
          </div>

          <!-- Intern: Ticket-System (inkl. Lock-Hinweis) -->
          <template v-else>
            <div class="col-12">
              <div class="d-flex align-items-center gap-2 mb-2">
                <label class="form-label mb-0">Ticket-System *</label>
                <span v-if="isTicketModeLocked" class="badge bg-secondary">fixiert</span>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div
                    class="ticket-card h-100"
                    :class="[{ active: ticketMode==='ga', locked: isTicketModeLocked && ticketMode!=='ga' }]"
                    @click="!isTicketModeLocked && (ticketMode='ga')"
                  >
                    <i class="bi bi-tags-fill fs-4 me-2"></i>
                    <div>
                      <div class="fw-semibold">Kontingente (General Admission)</div>
                      <div class="small text-muted">Preiskategorien mit Stückzahlen • ohne Sitzplan</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="ticket-card h-100"
                    :class="[{ active: ticketMode==='reserved', locked: isTicketModeLocked && ticketMode!=='reserved' }]"
                    @click="!isTicketModeLocked && (ticketMode='reserved')"
                  >
                    <i class="bi bi-grid-3x3-gap-fill fs-4 me-2"></i>
                    <div>
                      <div class="fw-semibold">Sitzplätze (Seatmap)</div>
                      <div class="small text-muted">Verkauf über Sitzplan • Seatmap separat zuweisen</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-text mt-1" v-if="isTicketModeLocked">
                Wahl des Ticket-Systems ist nach Anlage nicht mehr änderbar.
              </div>
            </div>

            <div class="col-md-4" v-if="ticketMode==='reserved' && !!form.seatmap_id">
              <label class="form-label">Seatmap ID</label>
              <input class="form-control" v-model.number="form.seatmap_id" disabled />
              <div class="form-text">Seatmap bereits verknüpft (Bearbeitung separat).</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Karte 3: Location -->
    <div class="card">
      <div class="card-header"><strong>Location</strong></div>
      <div class="card-body">
        <label class="form-label d-block mb-1">Quelle</label>
        <div class="btn-group mb-3" role="group" aria-label="Location Modus">
          <input type="radio" class="btn-check" id="loc_existing" value="existing" v-model="locationMode">
          <label class="btn btn-outline-secondary" for="loc_existing">Vorhandene wählen</label>
          <input type="radio" class="btn-check" id="loc_free" value="free" v-model="locationMode">
          <label class="btn btn-outline-secondary" for="loc_free">Freie Adresse</label>
        </div>

        <!-- existing -->
        <div v-if="locationMode==='existing'" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Vorhandene Location</label>
            <select class="form-select" v-model="selectedLocationId">
              <option :value="null">– Bitte wählen –</option>
              <option v-for="opt in locationOptions" :key="opt.id" :value="opt.id">
                {{ opt.name }}<span v-if="opt.city"> · {{ opt.city }}</span>
              </option>
            </select>
            <div class="form-text">Tipp: Tippen zum Filtern.</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Suchen</label>
            <input class="form-control" v-model.trim="locationQuery" @input="debouncedLoadLocations" placeholder="Name, Stadt …">
          </div>
        </div>

        <!-- free -->
        <div v-else class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Location-Name *</label>
            <input class="form-control" v-model.trim="form.location_text_name"
                   :class="{ 'is-invalid': showLocationErrors && !validLocationFree }" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Adresse *</label>
            <input class="form-control" v-model.trim="form.location_text_address"
                   :class="{ 'is-invalid': showLocationErrors && !validLocationFree }" />
          </div>
          <div class="col-md-3">
            <label class="form-label">PLZ</label>
            <input class="form-control" v-model.trim="form.location_text_zip" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Stadt *</label>
            <input class="form-control" v-model.trim="form.location_text_city"
                   :class="{ 'is-invalid': showLocationErrors && !validLocationFree }" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Land</label>
            <input class="form-control" v-model.trim="form.location_text_country" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Hinweis</label>
            <input class="form-control" v-model.trim="form.location_text_notes" placeholder="Eingang B, 2. OG …" />
          </div>

          <div class="invalid-feedback d-block" v-if="showLocationErrors && !validLocationFree">
            <strong>Location-Name</strong>, <strong>Adresse</strong> und <strong>Stadt</strong> sind nötig.
          </div>
        </div>
      </div>
    </div>

    <!-- Aktionen -->
    <div class="card">
      <div class="card-footer d-flex gap-2 justify-content-end">
        <button class="btn btn-primary" type="submit" @click="showLocationErrors=true">
          <i class="bi bi-save me-1"></i> {{ edit ? 'Speichern' : 'Anlegen' }}
        </button>
        <!-- kein Extra-Slot/keine Status-Buttons mehr -->
      </div>
    </div>
  </form>
</template>

<script setup>
/* identisch zur vorherigen, kartengetrennten Version mit Location-Dropdown/Free.
   -> beinhaltet TIMEZONES/defaultTZ, form-state, ticketMode/isTicketModeLocked,
      locationMode/selectedLocationId/locationOptions + debounced search,
      normalize()/serialize() mit mutual-exclusive Location-Payload, etc. */

import { ref, reactive, onMounted, computed, watchEffect, watch } from 'vue'
const { listLocations } = useWorkspaceApi()

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  edit: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])

const TIMEZONES = (() => {
  try { return Intl.supportedValuesOf?.('timeZone') || ['Europe/Berlin','UTC'] }
  catch { return ['Europe/Berlin','UTC'] }
})()
const defaultTZ = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin' }
  catch { return 'Europe/Berlin' }
})()

const form = reactive({
  title: props.modelValue?.title || '',
  category: props.modelValue?.category || '',
  listing_mode: props.modelValue?.listing_mode || 'internal',
  external_ticket_url: props.modelValue?.external_ticket_url || '',
  location_id: props.modelValue?.location_id ?? null,
  location_text_name: props.modelValue?.location_text_name ?? '',
  location_text_address: props.modelValue?.location_text_address ?? '',
  location_text_zip: props.modelValue?.location_text_zip ?? '',
  location_text_city: props.modelValue?.location_text_city ?? '',
  location_text_country: props.modelValue?.location_text_country ?? '',
  location_text_notes: props.modelValue?.location_text_notes ?? '',
  seatmap_id: props.modelValue?.seatmap_id ?? null,
  series_id: props.modelValue?.series_id ?? null,
  date: props.modelValue?.date || '',
  end_date: props.modelValue?.end_date || null,
  time_zone: props.modelValue?.time_zone || defaultTZ
})

const localDateStart = ref('')
const localDateEnd = ref('')
const timeZone = ref(form.time_zone || defaultTZ)
onMounted(() => {
  const pad = n => String(n).padStart(2,'0')
  if (form.date) {
    const d = new Date(form.date)
    if (!isNaN(d)) localDateStart.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  if (form.end_date) {
    const e = new Date(form.end_date)
    if (!isNaN(e)) localDateEnd.value = `${e.getFullYear()}-${pad(e.getMonth()+1)}-${pad(e.getHours())}:${pad(e.getMinutes())}`
  }
})

const initialMode = (props.modelValue?.ticket_sale_mode
  ? String(props.modelValue.ticket_sale_mode).toLowerCase()
  : (props.modelValue?.seatmap_id ? 'reserved' : 'ga'))
const ticketMode = ref(initialMode === 'reserved' ? 'reserved' : 'ga')
const isTicketModeLocked = computed(() => !!props.edit && (!!props.modelValue?.ticket_sale_mode || !!props.modelValue?.seatmap_id))

watchEffect(() => {
  if (form.listing_mode === 'internal') {
    if (!props.edit || props.modelValue?.listing_mode !== 'internal') form.external_ticket_url = ''
  }
})

/* Location: existing vs free */
const locationOptions = ref([])
const locationQuery = ref('')
const selectedLocationId = ref(props.modelValue?.location_id ?? null)
const hasFreeAddress = computed(() =>
  !!(props.modelValue?.location_text_name?.trim() ||
     props.modelValue?.location_text_address?.trim() ||
     props.modelValue?.location_text_city?.trim())
)
const locationMode = ref(props.modelValue?.location_id ? 'existing' : (hasFreeAddress.value ? 'free' : 'existing'))

const validLocationFree = computed(() => {
  if (locationMode.value !== 'free') return true
  return !!form.location_text_name?.trim()
      && !!form.location_text_address?.trim()
      && !!form.location_text_city?.trim()
})
const showLocationErrors = ref(false)

let locTimer = null
const debouncedLoadLocations = () => { clearTimeout(locTimer); locTimer = setTimeout(loadLocationOptions, 250) }
async function loadLocationOptions () {
  try { const res = await listLocations(locationQuery.value || ''); locationOptions.value = Array.isArray(res?.data) ? res.data : [] }
  catch { locationOptions.value = [] }
}
onMounted(() => { loadLocationOptions() })

watch(locationMode, (m) => {
  if (m === 'existing') {
    form.location_text_name = ''
    form.location_text_address = ''
    form.location_text_zip = ''
    form.location_text_city = ''
    form.location_text_country = ''
    form.location_text_notes = ''
  } else {
    selectedLocationId.value = null
  }
})

function toISO (dtLocal) { if (!dtLocal) return null; const d = new Date(dtLocal); return isNaN(d) ? null : d.toISOString() }

function normalize(body){
  const b = { ...body }
  b.date = toISO(localDateStart.value)
  b.end_date = toISO(localDateEnd.value)

  for (const k of ['external_ticket_url','category']) if (!b[k]) b[k] = null
  for (const k of ['seatmap_id','series_id']) { const v = Number(b[k]); b[k] = (Number.isFinite(v) && v > 0) ? v : null }

  if (b.listing_mode !== 'external') b.external_ticket_url = null
  if (b.listing_mode === 'internal') {
    if (!isTicketModeLocked.value) b.ticket_sale_mode = (ticketMode.value === 'ga') ? 'general' : 'reserved'
    if (ticketMode.value === 'ga') b.seatmap_id = null
  } else { b.seatmap_id = null; b.ticket_sale_mode = null }

  b.time_zone = timeZone.value || null

  if (locationMode.value === 'existing') {
    b.location_id = Number.isFinite(Number(selectedLocationId.value)) ? Number(selectedLocationId.value) : null
    for (const k of ['location_text_name','location_text_address','location_text_zip','location_text_city','location_text_country','location_text_notes']) b[k] = null
  } else {
    b.location_id = null
    for (const k of ['location_text_name','location_text_address','location_text_zip','location_text_city','location_text_country','location_text_notes']) if (!b[k] || !String(b[k]).trim()) b[k] = null
  }

  return b
}

function serialize(){
  showLocationErrors.value = true
  const full = normalize(form)
  if (!props.edit) return full

  const base = normalize(props.modelValue || {})
  const patch = {}
  for (const k of Object.keys(full)) {
    const a = full[k], b = base[k]
    if (k === 'date' || k === 'end_date') {
      const ai = a ? new Date(a).toISOString() : null
      const bi = b ? new Date(b).toISOString() : null
      if (ai !== bi) patch[k] = a
      continue
    }
    if (a !== b) patch[k] = a
  }
  return patch
}
</script>

<style scoped>
.ticket-card{border:1px solid #e9ecef;border-radius:.75rem;padding:1rem;display:flex;align-items:flex-start;gap:.75rem;cursor:pointer;transition:.15s all;background:#fff;}
.ticket-card:hover{box-shadow:0 6px 16px rgba(0,0,0,.06)}
.ticket-card.active{border-color:#0d6efd;box-shadow:0 6px 18px rgba(13,110,253,.12)}
.ticket-card.locked{opacity:.5;cursor:not-allowed}
</style>
