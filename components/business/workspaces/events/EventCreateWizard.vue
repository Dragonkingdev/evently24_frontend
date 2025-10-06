<!-- components/business/workspaces/events/EventCreateWizard.vue -->
<template>
  <form @submit.prevent="onSubmit" class="d-grid gap-3">
    <div v-if="serverError" class="alert alert-danger mb-0">
      <div class="fw-semibold">{{ serverError.message }}</div>
      <ul v-if="serverError.fields?.length" class="mb-0 mt-2 small">
        <li v-for="f in serverError.fields" :key="f">{{ prettyField(f) }}</li>
      </ul>
    </div>

    <!-- Karte 1: Event -->
    <div class="card" id="card-event">
      <div class="card-header d-flex align-items-center justify-content-between">
        <strong>Event</strong>
        <span class="text-muted small">Titel, Datum, Kategorie</span>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Titel *</label>
            <input class="form-control" v-model.trim="form.title" required :disabled="busy"
                   :class="{ 'is-invalid': showErrors && !validTitle }"/>
            <div class="invalid-feedback" v-if="showErrors && !validTitle">Bitte Titel angeben.</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Kategorie</label>
            <select class="form-select" v-model="form.category" :disabled="busy">
              <option value="" disabled>Bitte wählen …</option>
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Start (Datum & Uhrzeit) *</label>
            <input type="datetime-local" class="form-control" v-model="localDateStart" step="600" @blur="snapStartToStep"
                   required :disabled="busy" :class="{ 'is-invalid': showErrors && !validStart }"/>
            <div class="invalid-feedback" v-if="showErrors && !validStart">Bitte Startzeit setzen.</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ende (optional)</label>
            <input type="datetime-local" class="form-control" v-model="localDateEnd" :min="localDateStart || undefined"
                   step="600" @blur="snapEndToStep" :disabled="busy"
                   :class="{ 'is-invalid': showErrors && localDateEnd && !validEndRange }"/>
            <div class="invalid-feedback d-block" v-if="showErrors && localDateEnd && !validEndRange">
              Endzeit muss nach der Startzeit liegen.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Karte 2: Listing-Modus (inkl. Ticketsystem für internal) -->
    <div class="card" id="card-listing">
      <div class="card-header d-flex align-items-center justify-content-between">
        <strong>Listing-Modus</strong>
        <span class="text-muted small">Intern vs. Extern</span>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Modus *</label>
            <select class="form-select" v-model="form.listing_mode" :disabled="busy">
              <option value="internal">Intern (Ticketsystem)</option>
              <option value="external">Extern (Weiterleitung)</option>
            </select>
          </div>

          <!-- Extern -->
          <div class="col-md-8" v-if="form.listing_mode==='external'">
            <label class="form-label">Externe Ticket-URL *</label>
            <input class="form-control" v-model.trim="form.external_ticket_url" placeholder="https://…" :disabled="busy"
                   :class="{ 'is-invalid': showErrors && (!validExternalUrl || hasServerFieldError('external_ticket_url')) }"/>
            <div class="invalid-feedback d-block" v-if="showErrors && (!validExternalUrl || hasServerFieldError('external_ticket_url'))">
              Bitte gib eine gültige URL an.
            </div>
          </div>

          <!-- Intern -->
          <template v-else>
            <div class="col-12">
              <div class="row g-3">
                <div class="col-md-6">
                  <div role="button" tabindex="0" @click="ticketMode='ga'" @keyup.enter="ticketMode='ga'"
                       :class="['select-card h-100', ticketMode==='ga' ? 'active' : '']">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-tags-fill fs-4 me-2"></i>
                      <div>
                        <div class="fw-semibold">Kontingente (General Admission)</div>
                        <div class="small text-muted">Preiskategorien mit Stückzahlen</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div role="button" tabindex="0" @click="ticketMode='reserved'" @keyup.enter="ticketMode='reserved'"
                       :class="['select-card h-100', ticketMode==='reserved' ? 'active' : '']">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-grid-3x3-gap-fill fs-4 me-2"></i>
                      <div>
                        <div class="fw-semibold">Sitzplätze (Seatmap)</div>
                        <div class="small text-muted">Seatmap wird bei Bedarf automatisch angelegt.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="invalid-feedback d-block" v-if="showErrors && !ticketMode">
                Bitte Ticket-System wählen.
              </div>

              <!-- ⬇️ NEU: Gebühren-Modus Auswahl -->
              <div class="mt-3">
                <label class="form-label mb-2">Gebühren-Modus</label>
                <div class="row g-2">
                  <div class="col-md-6">
                    <div role="button" tabindex="0"
                         @click="form.fee_mode = 'included'" @keyup.enter="form.fee_mode = 'included'"
                         :class="['select-card h-100', form.fee_mode === 'included' ? 'active' : '']">
                      <div class="d-flex align-items-start">
                        <i class="bi bi-check2-circle fs-4 me-2"></i>
                        <div>
                          <div class="fw-semibold">Ticketpreis ist inklusive aller Gebühren</div>
                          <div class="small text-muted">Kund:innen sehen Endpreise („inkl. Gebühren“).</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div role="button" tabindex="0"
                         @click="form.fee_mode = 'added'" @keyup.enter="form.fee_mode = 'added'"
                         :class="['select-card h-100', form.fee_mode === 'added' ? 'active' : '']">
                      <div class="d-flex align-items-start">
                        <i class="bi bi-plus-square fs-4 me-2"></i>
                        <div>
                          <div class="fw-semibold">Gebühren werden auf den Ticketpreis aufgeschlagen</div>
                          <div class="small text-muted">Kund:innen sehen Basispreis + Gebühren („zzgl. Gebühren“).</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="invalid-feedback d-block" v-if="showErrors && hasServerFieldError('fee_mode')">
                  Bitte einen Gebühren-Modus wählen.
                </div>
              </div>
              <!-- ⬆️ NEU -->

              <div class="alert alert-info d-flex align-items-start mt-3">
                <i class="bi bi-info-circle me-2 mt-1"></i>
                <div>
                  <div><strong>Interner Verkauf</strong></div>
                  <div class="small">Zum Veröffentlichen: Stripe verbinden & Tickets anlegen.</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Karte 3: Location -->
    <div class="card" id="card-location">
      <div class="card-header d-flex align-items-center justify-content-between">
        <strong>Location</strong>
        <span class="text-muted small">Vorhandene wählen oder freie Adresse</span>
      </div>
      <div class="card-body">
        <div class="btn-group mb-3" role="group" aria-label="Location Modus">
          <input type="radio" class="btn-check" id="loc_existing" value="existing" v-model="locationMode" :disabled="busy">
          <label class="btn btn-outline-secondary" for="loc_existing">Vorhandene wählen</label>
          <input type="radio" class="btn-check" id="loc_free" value="free" v-model="locationMode" :disabled="busy">
          <label class="btn btn-outline-secondary" for="loc_free">Freie Adresse</label>
        </div>

        <!-- existing -->
        <div v-if="locationMode==='existing'" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Vorhandene Location</label>
            <select class="form-select" v-model="selectedLocationId" :disabled="busy">
              <option :value="null">– Bitte wählen –</option>
              <option v-for="opt in locationOptions" :key="opt.id" :value="opt.id">
                {{ opt.name }}<span v-if="opt.city"> · {{ opt.city }}</span>
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Suchen</label>
            <input class="form-control" v-model.trim="locationQuery" @input="debouncedLoadLocations" placeholder="Name, Stadt …" :disabled="busy">
          </div>
        </div>

        <!-- free -->
        <div v-else class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Location-Name *</label>
            <input class="form-control" v-model.trim="locationFree.name" :disabled="busy"
                   :class="{ 'is-invalid': showErrors && (!validLocationFree || hasServerFieldError('location_text_name')) }"/>
          </div>
          <div class="col-md-6">
            <label class="form-label">Adresse *</label>
            <input class="form-control" v-model.trim="locationFree.address" :disabled="busy"
                   :class="{ 'is-invalid': showErrors && (!validLocationFree || hasServerFieldError('location_text_address')) }"/>
          </div>
          <div class="col-md-3">
            <label class="form-label">PLZ</label>
            <input class="form-control" v-model.trim="locationFree.zip" :disabled="busy"/>
          </div>
          <div class="col-md-3">
            <label class="form-label">Stadt *</label>
            <input class="form-control" v-model.trim="locationFree.city" :disabled="busy"
                   :class="{ 'is-invalid': showErrors && (!validLocationFree || hasServerFieldError('location_text_city')) }"/>
          </div>
          <div class="col-md-3">
            <label class="form-label">Land</label>
            <input class="form-control" v-model.trim="locationFree.country" :disabled="busy"/>
          </div>
          <div class="col-md-3">
            <label class="form-label">Hinweis</label>
            <input class="form-control" v-model.trim="locationFree.notes" placeholder="Eingang B, 2. OG …" :disabled="busy"/>
          </div>

          <div class="invalid-feedback d-block" v-if="showErrors && (!validLocationFree || hasAnyServerLocationError)">
            <strong>Location-Name</strong>, <strong>Adresse</strong> und <strong>Stadt</strong> sind nötig.
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / Aktion -->
    <div class="card">
      <div class="card-footer d-flex justify-content-end gap-2">
        <button type="submit" class="btn btn-success" :disabled="!canSubmit || busy">
          <i class="bi bi-check-lg me-1"></i> Event anlegen
        </button>
      </div>
      <div class="px-3 pb-3 text-muted small">
        <i class="bi bi-shield-exclamation me-1"></i>
        Hinweis: Wahl <strong>Kontingente vs. Sitzplätze</strong> ist später nicht mehr änderbar.
      </div>
    </div>
  </form>
</template>

<script setup>
/* basiert 1:1 auf deiner aktuellen Wizard-Logik – nur in Karten gegliedert */
import { onMounted, ref, reactive, computed, watch, nextTick } from 'vue'

const emit = defineEmits(['submit'])
const props = defineProps({
  initialLocations: { type: Array, default: () => [] },
  wid: { type: Number, required: true },
  api: { type: Object, required: true },
  busy: { type: Boolean, default: false },
  serverError: { type: Object, default: null }
})

const CATEGORIES = [
  'Party','Konzert','Festival','Theater','Comedy','Musical/Show','Kino/Film',
  'Sport','Lesung','Vortrag','Konferenz','Messe/Expo','Workshop','Kurs/Schulung',
  'Networking/Meetup','Business','Tech/IT','Gaming/Esports','Kunst/Kultur','Ausstellung',
  'Familie/Kids','Tanz','Fitness','Wellness/Spiritual','Food & Drink','Fashion',
  'Charity','Oper/Klassik','Open Air','Aftershow','Launch/Opening','Award/Gala',
  'Webinar/Online','Community','Sonstiges'
]

const form = reactive({ title: '', category: '', listing_mode: 'internal', external_ticket_url: '', fee_mode: 'included' })
const showErrors = ref(false)
const ticketMode = ref('ga')
const localDateStart = ref(''); const localDateEnd = ref('')

// --- Location State (wie gehabt) ---
const locationMode = ref('existing')
const selectedLocationId = ref(null)
const locationFree = reactive({ name: '', address: '', zip: '', city: '', country: '', notes: '' })
const locationOptions = ref(props.initialLocations || [])
const locationQuery = ref('')

/* Server-Error Helfer */
const serverErr = computed(() => props.serverError || null)
const serverFieldSet = computed(() => {
  const s = new Set()
  if (serverErr.value?.field) s.add(serverErr.value.field)
  if (Array.isArray(serverErr.value?.fields)) for (const f of serverErr.value.fields) s.add(f)
  return s
})
const hasServerFieldError = (name) => serverFieldSet.value.has(name)
const LOC_FIELDS = ['location_text_name','location_text_address','location_text_city']
const hasAnyServerLocationError = computed(() => LOC_FIELDS.some(hasServerFieldError))
function prettyField (f) { return ({ external_ticket_url:'Externe Ticket-URL', location_text_name:'Location-Name', location_text_address:'Location-Adresse', location_text_city:'Location-Stadt', fee_mode:'Gebühren-Modus' })[f] || f }

/* Locations laden (debounced) */
let locTimer = null
const debouncedLoadLocations = () => { if (locTimer) clearTimeout(locTimer); locTimer = setTimeout(loadLocationOptions, 250) }
async function loadLocationOptions () {
  try { const { listLocations } = props.api; const res = await listLocations(locationQuery.value || ''); locationOptions.value = Array.isArray(res?.data) ? res.data : [] }
  catch { locationOptions.value = [] }
}
onMounted(() => { loadLocationOptions() })

/* 10-Min-Raster */
function snapTo10(dt){ if (!dt) return ''; const d = new Date(dt); if (isNaN(d)) return ''; const m = d.getMinutes(); d.setMinutes(Math.round(m/10)*10,0,0); const p = n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}` }
function snapStartToStep(){ if (localDateStart.value) localDateStart.value = snapTo10(localDateStart.value) }
function snapEndToStep(){ if (localDateEnd.value) localDateEnd.value = snapTo10(localDateEnd.value) }

/* Validation */
const validTitle = computed(() => !!form.title?.trim())
const validStart = computed(() => !!localDateStart.value)
const validEndRange = computed(() => { if (!localDateEnd.value) return true; const s = new Date(localDateStart.value), e = new Date(localDateEnd.value); return !(isNaN(s)||isNaN(e)) && e.getTime() >= s.getTime() })
const validExternalUrl = computed(() => { if (form.listing_mode !== 'external') return true; const v = String(form.external_ticket_url || '').trim(); if (!v) return false; try { const u = new URL(v); return !!u.protocol && !!u.host } catch { return false } })
const validLocationFree = computed(() => locationMode.value !== 'free' || (!!locationFree.name?.trim() && !!locationFree.address?.trim() && !!locationFree.city?.trim()))
const canSubmit = computed(() => validTitle.value && validStart.value && validEndRange.value && validLocationFree.value && (form.listing_mode === 'external' ? validExternalUrl.value : !!ticketMode.value))

/* Scroll-API für Parent (IDs an Karten angepasst) */
function scrollToAnchor(id){ const el=document.getElementById(id); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}) }
function goToStep(n){ const map = {1:'card-event', 2:'card-listing', 3:'card-location'}; scrollToAnchor(map[n] || 'card-event') }
defineExpose({ goToStep })

/* Serialize / Submit */
const toISO = (dt) => { if (!dt) return null; const d = new Date(dt); return isNaN(d) ? null : d.toISOString() }
function buildApiPayload(){
  const base = {
    title: form.title || '',
    category: form.category || null,
    listing_mode: form.listing_mode || 'internal',
    external_ticket_url: form.listing_mode==='external' ? (form.external_ticket_url || null) : null,
    date: toISO(localDateStart.value),
    end_date: toISO(localDateEnd.value)
  }

  // Location
  if (locationMode.value === 'existing') {
    base.location_id = Number.isFinite(selectedLocationId.value) ? Number(selectedLocationId.value) : null
  } else {
    base.location_text_name = locationFree.name || null
    base.location_text_address = locationFree.address || null
    base.location_text_zip = locationFree.zip || null
    base.location_text_city = locationFree.city || null
    base.location_text_country = locationFree.country || null
    base.location_text_notes = locationFree.notes || null
  }

  if (base.listing_mode === 'internal') {
    base.ticket_sale_mode = (ticketMode.value === 'reserved') ? 'reserved' : 'general'
    // ⬇️ NEU: Gebührenmodus nur bei internem Verkauf senden
    base.fee_mode = form.fee_mode || 'included'
  } else {
    base.ticket_sale_mode = null
    base.seatmap_id = null
    // Bei externem Listing fee_mode nicht mitsenden
  }
  return base
}
async function onSubmit(){ showErrors.value = true; if (!canSubmit.value) return; emit('submit', buildApiPayload()) }
</script>

<style scoped>
.select-card{border:1px solid #e9ecef;border-radius:.75rem;padding:1rem;transition:.15s all;cursor:pointer;background:#fff;}
.select-card:hover{box-shadow:0 6px 16px rgba(0,0,0,.06);transform:translateY(-1px)}
.select-card.active{border-color:#0d6efd;box-shadow:0 6px 18px rgba(13,110,253,.12)}
</style>
