<!-- components/business/workspaces/events/EventCreateWizard.vue -->
<template>
  <form @submit.prevent="onSubmit" class="card overflow-hidden">
    <!-- Header -->
    <div class="card-header">
      <div class="d-flex align-items-center justify-content-between">
        <strong>Neues Event anlegen</strong>
        <span class="text-muted small">Geführter Ablauf</span>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="px-3 pt-3 pb-2 border-bottom bg-light">
      <ul class="nav nav-pills justify-content-between stepper">
        <li class="nav-item flex-fill text-center">
          <span :class="['nav-link', step>=1 ? 'active' : 'disabled']">
            <span class="step-dot me-2">{{ step>=1 ? '1' : '' }}</span>
            Basisdaten
          </span>
        </li>
        <li class="nav-item flex-fill text-center">
          <span :class="['nav-link', step>=2 ? 'active' : 'disabled']">
            <span class="step-dot me-2">{{ step>=2 ? '2' : '' }}</span>
            Listing
          </span>
        </li>
        <li class="nav-item flex-fill text-center">
          <span :class="['nav-link', step>=3 ? 'active' : 'disabled']">
            <span class="step-dot me-2">{{ step>=3 ? '3' : '' }}</span>
            Tickets
          </span>
        </li>
      </ul>
      <div class="progress mt-2" style="height:6px">
        <div class="progress-bar" role="progressbar" :style="{width: progressPct}"></div>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <!-- Step 1: Basis -->
      <div v-show="step === 1" class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Titel *</label>
          <input class="form-control" v-model.trim="form.title" required />
        </div>

        <!-- Kategorie als Dropdown -->
        <div class="col-md-4">
          <label class="form-label">Kategorie</label>
          <select class="form-select" v-model="form.category">
            <option value="" disabled>Bitte wählen …</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Start (Datum & Uhrzeit) *</label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="localDateStart"
            step="600"
            @blur="snapStartToStep"
            required
          />
        </div>

        <!-- Ende (optional) -->
        <div class="col-md-6">
          <label class="form-label">Ende (Datum & Uhrzeit) <span class="text-muted">(optional)</span></label>
          <input
            type="datetime-local"
            class="form-control"
            v-model="localDateEnd"
            :min="localDateStart || undefined"
            step="600"
            @blur="snapEndToStep"
          />
          <div class="invalid-feedback d-block" v-if="showErrors && localDateEnd && !validEndRange">
            Endzeit muss nach der Startzeit liegen.
          </div>
        </div>

        <div class="col-md-3">
          <label class="form-label">Stadt</label>
          <input class="form-control" v-model.trim="form.city" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Veranstaltungsort (Venue)</label>
          <input class="form-control" v-model.trim="form.venue" />
        </div>

        <!-- Location: freier Text mit Vorschlägen -->
        <div class="col-12">
          <label class="form-label">
            Location (Name – freier Text)
            <span class="text-muted small">(wir legen sie an, falls nicht vorhanden)</span>
          </label>
          <input
            class="form-control"
            list="locationSuggestions"
            v-model.trim="locationText"
            placeholder="z. B. Festhalle Frankfurt"
          />
          <datalist id="locationSuggestions">
            <option v-for="opt in locationOptions" :key="opt.id" :value="opt.name" />
          </datalist>
          <div class="form-text">
            Einfach Namen eingeben. Wenn es die Location in deinem Workspace noch nicht gibt,
            wird sie automatisch erstellt.
          </div>
        </div>
      </div>

      <!-- Step 2: Listing -->
      <div v-show="step === 2" class="row g-3">
        <div class="col-12">
          <label class="form-label">Ticket-Verkauf *</label>
          <div class="row g-3">
            <!-- Intern Card -->
            <div class="col-md-6">
              <div
                role="button"
                tabindex="0"
                @click="form.listing_mode = 'internal'"
                @keyup.enter="form.listing_mode = 'internal'"
                :class="['select-card h-100', form.listing_mode==='internal' ? 'active' : '']"
              >
                <div class="d-flex align-items-start">
                  <i class="bi bi-basket2-fill fs-4 me-2"></i>
                  <div>
                    <div class="fw-semibold">Intern (Ticketsystem)</div>
                    <div class="small text-muted">Verkauf auf dieser Plattform • Stripe erforderlich • Auszahlungen direkt an dich</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Extern Card -->
            <div class="col-md-6">
              <div
                role="button"
                tabindex="0"
                @click="form.listing_mode = 'external'"
                @keyup.enter="form.listing_mode = 'external'"
                :class="['select-card h-100', form.listing_mode==='external' ? 'active' : '']"
              >
                <div class="d-flex align-items-start">
                  <i class="bi bi-box-arrow-up-right fs-4 me-2"></i>
                  <div>
                    <div class="fw-semibold">Extern (Ticket-Weiterleitung)</div>
                    <div class="small text-muted">Nur Ticket-Link hinterlegen • Keine Kategorien/Sitzpläne auf dieser Plattform</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Extern: Ticket-URL -->
        <div class="col-12" v-if="form.listing_mode === 'external'">
          <label class="form-label">Externe Ticket-URL *</label>
          <input class="form-control" v-model.trim="form.external_ticket_url" placeholder="https://…" />
          <div class="invalid-feedback d-block" v-if="showErrors && !validExternalUrl">
            Bitte gib eine gültige URL an.
          </div>
        </div>

        <!-- Intern: Hinweis -->
        <div class="col-12" v-if="form.listing_mode === 'internal'">
          <div class="alert alert-info d-flex align-items-start">
            <i class="bi bi-info-circle me-2 mt-1"></i>
            <div>
              <div><strong>Interner Verkauf</strong></div>
              <div class="small">
                Zum Veröffentlichen muss dein Workspace mit Stripe verbunden sein und es müssen Tickets verfügbar sein.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Tickets (nur intern) -->
      <div v-show="step === 3" class="row g-3">
        <div class="col-12" v-if="form.listing_mode === 'external'">
          <div class="alert alert-secondary">
            Bei <strong>externem</strong> Verkauf sind keine weiteren Ticket-Einstellungen nötig.
          </div>
        </div>

        <template v-else>
          <div class="col-12">
            <label class="form-label">Ticket-System *</label>
            <div class="row g-3">
              <!-- GA Card -->
              <div class="col-md-6">
                <div
                  role="button"
                  tabindex="0"
                  @click="ticketMode = 'ga'"
                  @keyup.enter="ticketMode = 'ga'"
                  :class="['select-card h-100', ticketMode==='ga' ? 'active' : '']"
                >
                  <div class="d-flex align-items-start">
                    <i class="bi bi-tags-fill fs-4 me-2"></i>
                    <div>
                      <div class="fw-semibold">Ticket-Kontingente (General Admission)</div>
                      <div class="small text-muted">Preis-Kategorien mit Stückzahlen • Keine Sitzplatzplanung</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reserved Card -->
              <div class="col-md-6">
                <div
                  role="button"
                  tabindex="0"
                  @click="ticketMode = 'reserved'"
                  @keyup.enter="ticketMode = 'reserved'"
                  :class="['select-card h-100', ticketMode==='reserved' ? 'active' : '']"
                >
                  <div class="d-flex align-items-start">
                    <i class="bi bi-grid-3x3-gap-fill fs-4 me-2"></i>
                    <div>
                      <div class="fw-semibold">Sitzplätze (Seatmap)</div>
                      <div class="small text-muted">Sitzplan wird automatisch erzeugt • Preise/Zuordnung später</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="invalid-feedback d-block" v-if="showErrors && !ticketMode">
              Bitte wähle ein Ticket-System.
            </div>
          </div>

          <!-- Hinweise je Modus -->
          <div class="col-12" v-if="ticketMode === 'ga'">
            <div class="alert alert-light border">
              <div class="fw-semibold mb-1">Kontingente</div>
              <div class="small text-muted">
                Nach dem Anlegen kannst du Kategorien (z. B. „Early Bird“, „Standard“) mit Preis & Kontingent hinzufügen.
              </div>
            </div>
          </div>

          <div class="col-12" v-if="ticketMode === 'reserved'">
            <div class="alert alert-light border">
              <div class="fw-semibold mb-1">Sitzplätze</div>
              <div class="small text-muted">
                Beim Anlegen erzeugen wir automatisch eine Seatmap-Vorlage und hängen sie an das Event.
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Footer / Navigation -->
    <div class="card-footer d-flex justify-content-between align-items-center">
      <div class="text-muted small">
        <span v-if="form.listing_mode==='internal'">Modus: Intern · {{ ticketMode==='reserved' ? 'Sitzplätze' : 'Kontingente' }}</span>
        <span v-else>Modus: Extern</span>
      </div>

      <div class="d-flex gap-2">
        <button type="button" class="btn btn-outline-secondary" :disabled="step===1" @click="prev">
          Zurück
        </button>
        <button v-if="step<3" type="button" class="btn btn-primary" @click="next">
          Weiter
        </button>
        <button v-else type="submit" class="btn btn-success">
          <i class="bi bi-check-lg me-1"></i> Event anlegen
        </button>
      </div>
    </div>

    <!-- Hinweis zu Unveränderlichkeiten -->
    <div class="px-3 pb-3 text-muted small">
      <i class="bi bi-shield-exclamation me-1"></i>
      Hinweis: Bestimmte Einstellungen können später <strong>nicht mehr geändert</strong> werden –
      insbesondere die Wahl zwischen <strong>Ticket-Kontingenten</strong> und <strong>Sitzplätzen (Seatmap)</strong>.
      Ein Wechsel von <strong>extern</strong> zu <strong>intern</strong> ist später möglich.
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'
const emit = defineEmits(['submit'])

const props = defineProps({
  initialLocations: { type: Array, default: () => [] },
  wid: { type: Number, required: true },
  api: { type: Object, required: true }
})

/** Fixe Event-Kategorien (Dropdown) */
const CATEGORIES = [
  'Party', 'Konzert', 'Festival', 'Theater', 'Comedy', 'Musical/Show', 'Kino/Film',
  'Sport', 'Lesung', 'Vortrag', 'Konferenz', 'Messe/Expo', 'Workshop', 'Kurs/Schulung',
  'Networking/Meetup', 'Business', 'Tech/IT', 'Gaming/Esports', 'Kunst/Kultur', 'Ausstellung',
  'Familie/Kids', 'Tanz', 'Fitness', 'Wellness/Spiritual', 'Food & Drink', 'Fashion',
  'Charity', 'Oper/Klassik', 'Open Air', 'Aftershow', 'Launch/Opening', 'Award/Gala',
  'Webinar/Online', 'Community', 'Sonstiges'
]

const form = reactive({
  title: '',
  category: '',
  city: '',
  venue: '',
  listing_mode: 'internal',          // internal | external
  external_ticket_url: '',
  date: ''                           // ISO (nicht mehr genutzt, bleibt kompatibel)
})

const step = ref(1)
const showErrors = ref(false)
const ticketMode = ref('ga')          // 'ga' | 'reserved'

// Start/End
const localDateStart = ref('')
const localDateEnd = ref('')

// Location (Freitext + Vorschläge)
const locationText = ref('')
const locationOptions = ref(props.initialLocations || [])

const progressPct = computed(() => `${(step.value-1)/2*100}%`)

// Vorschläge laden (Workspace-Locations)
async function loadLocationOptions () {
  try {
    const { listLocations } = props.api
    const res = await listLocations('')
    locationOptions.value = Array.isArray(res?.data) ? res.data : []
  } catch {
    locationOptions.value = []
  }
}

onMounted(() => {
  loadLocationOptions()
})

/* ---------- Helpers: 10-Minuten-Raster ---------- */
function snapTo10(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  if (isNaN(d)) return ''
  const minutes = d.getMinutes()
  const snapped = Math.round(minutes / 10) * 10
  d.setMinutes(snapped, 0, 0)
  // format YYYY-MM-DDTHH:MM for datetime-local
  const pad = n => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function snapStartToStep() {
  if (localDateStart.value) {
    localDateStart.value = snapTo10(localDateStart.value)
  }
}
function snapEndToStep() {
  if (localDateEnd.value) {
    localDateEnd.value = snapTo10(localDateEnd.value)
  }
}

/* ---------- Validation ---------- */
const validTitle = computed(() => !!form.title?.trim())
const validStart = computed(() => !!localDateStart.value)

// Ende ist optional; wenn gesetzt, muss es >= Start sein.
const validEndRange = computed(() => {
  if (!localDateEnd.value) return true
  const s = new Date(localDateStart.value)
  const e = new Date(localDateEnd.value)
  if (isNaN(s) || isNaN(e)) return false
  return e.getTime() >= s.getTime()
})

const validExternalUrl = computed(() => {
  if (form.listing_mode !== 'external') return true
  const v = String(form.external_ticket_url || '').trim()
  if (!v) return false
  try { const u = new URL(v); return !!u.protocol && !!u.host } catch { return false }
})

// Schritt-Checks
const canNextFrom1 = computed(() => validTitle.value && validStart.value && validEndRange.value)
const canNextFrom2 = computed(() => (form.listing_mode === 'external' ? validExternalUrl.value : true))
const canSubmit   = computed(() => canNextFrom1.value && canNextFrom2.value && (form.listing_mode === 'external' || !!ticketMode.value))

/* ----- Reaktionen: Start -> End-Constraints ----- */
watch(localDateStart, (newStart) => {
  if (!newStart) return
  // Snap Start auf 10er-Raster
  localDateStart.value = snapTo10(newStart)
  // Ende ggf. anheben, wenn es vor dem Start liegt
  if (localDateEnd.value) {
    const s = new Date(localDateStart.value)
    const e = new Date(localDateEnd.value)
    if (!isNaN(s) && !isNaN(e) && e.getTime() < s.getTime()) {
      // setze Ende auf Start (gleichzeitig auf Raster)
      localDateEnd.value = localDateStart.value
    }
  }
})

function next () {
  showErrors.value = true
  if (step.value === 1 && !canNextFrom1.value) return
  if (step.value === 2 && !canNextFrom2.value) return
  step.value = Math.min(3, step.value + 1)
}
function prev () { step.value = Math.max(1, step.value - 1) }

/* ---------- Serialize / Submit ---------- */
function toISO (dtLocal) {
  if (!dtLocal) return null
  const d = new Date(dtLocal)
  return isNaN(d) ? null : d.toISOString()
}

function baseBody () {
  return {
    title: form.title || '',
    category: form.category || null,
    city: form.city || null,
    venue: form.venue || null,
    listing_mode: form.listing_mode || 'internal',
    external_ticket_url: form.listing_mode === 'external' ? (form.external_ticket_url || null) : null,
    date: toISO(localDateStart.value),
    end_date: toISO(localDateEnd.value), // optional
    location_name: locationText.value?.trim() ? locationText.value.trim() : null
  }
}

async function onSubmit () {
  showErrors.value = true
  if (!canSubmit.value) return

  const body = baseBody()

  // Intern + Sitzplätze => Seatmap vorab erzeugen, dann seatmap_id setzen
  if (form.listing_mode === 'internal' && ticketMode.value === 'reserved') {
    try {
      const { createSeatmap } = props.api
      const smRes = await createSeatmap({
        name: `${form.title || 'Event'} – Seatmap`,
        layout: { seats: [], meta: { auto: true } }
      })
      const seatmapId = smRes?.data?.id
      if (seatmapId) body.seatmap_id = seatmapId
    } catch {
      alert('Seatmap konnte nicht vorbereitet werden.')
      return
    }
  }

  emit('submit', body)
}
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.border-200 { border-color: #e9ecef !important; }

/* Stepper */
.stepper .nav-link {
  background: transparent;
  color: #6c757d;
  border: 1px solid #e9ecef;
  margin: 0 .25rem;
}
.stepper .nav-link.active {
  color: #0d6efd;
  border-color: #0d6efd33;
  background: #0d6efd0d;
}
.step-dot {
  display:inline-flex; align-items:center; justify-content:center;
  width:22px; height:22px; border-radius:50%;
  background:#0d6efd; color:#fff; font-size:12px;
}

/* Auswahl-Kacheln */
.select-card {
  border:1px solid #e9ecef; border-radius:.75rem; padding:1rem;
  transition: all .15s ease-in-out; cursor: pointer; background:#fff;
}
.select-card:hover { box-shadow: 0 6px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
.select-card.active { border-color:#0d6efd; box-shadow: 0 6px 18px rgba(13,110,253,.12); }
</style>
