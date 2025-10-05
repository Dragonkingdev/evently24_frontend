<!-- pages/business/w/[wid]/locations/[locationId]/index.vue -->
<template>
  <div class="container-narrow" v-if="ready">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center gap-2">
        <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-arrow-left"></i>
        </NuxtLink>
        <h4 class="mb-0 text-truncate">{{ orig?.name || 'Location' }}</h4>
      </div>
      <div class="text-end small text-muted">
        <div v-if="orig?.created_at"><i class="bi bi-clock-history me-1"></i>Erstellt: {{ fmt(orig.created_at) }}</div>
        <div v-if="orig?.updated_at"><i class="bi bi-pencil me-1"></i>Aktualisiert: {{ fmt(orig.updated_at) }}</div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-body">
        <!-- Quick Facts / Badges -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge" :class="form.booking_enabled ? 'bg-success' : 'bg-secondary'">
            <i :class="form.booking_enabled ? 'bi bi-calendar-check me-1' : 'bi bi-calendar-x me-1'"></i>
            {{ form.booking_enabled ? 'Buchbar' : 'Nicht buchbar' }}
          </span>

          <span v-if="form.status" class="badge" :class="statusBadgeClass">
            <i class="bi bi-circle-fill me-1"></i>{{ form.status }}
          </span>
          <span v-if="form.verification_status" class="badge" :class="verificationBadgeClass">
            <i class="bi bi-shield-check me-1"></i>{{ form.verification_status }}
          </span>

          <span v-if="form.area_sqm" class="badge bg-light text-dark border">
            <i class="bi bi-aspect-ratio me-1"></i>{{ form.area_sqm }} m²
          </span>
          <span v-if="form.capacity_seated_max" class="badge bg-light text-dark border">
            <i class="bi bi-people me-1"></i>{{ form.capacity_seated_max }} Sitzplätze
          </span>
          <span v-if="form.capacity_standing_max" class="badge bg-light text-dark border">
            <i class="bi bi-people-fill me-1"></i>{{ form.capacity_standing_max }} stehend
          </span>

          <!-- bestehende Kategorie-Badges (nur Anzeige) -->
          <span
            v-for="c in selectedCategoryBadges"
            :key="c.id"
            class="badge text-uppercase bg-success"
            :title="c.id"
          >
            <i v-if="c.icon" :class="`bi ${c.icon} me-1`"></i>{{ c.label }}
          </span>
        </div>

        <!-- FORM -->
        <form @submit.prevent="submit">
          <div class="row g-4">

            <!-- Basis -->
            <div class="col-12">
              <h5 class="mb-2">Basis</h5>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Name<span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.name"
                    :class="{ 'is-invalid': v.name }"
                    required
                  />
                  <div class="form-text">Offizieller Venue-Name (eindeutig innerhalb derselben Stadt im Workspace).</div>
                  <div v-if="v.name" class="invalid-feedback">{{ v.name }}</div>
                </div>

                <div class="col-md-8">
                  <label class="form-label">Adresse</label>
                  <input type="text" class="form-control" v-model.trim="form.address" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">PLZ</label>
                  <input type="text" class="form-control" v-model.trim="form.postal_code" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Stadt</label>
                  <input type="text" class="form-control" v-model.trim="form.city" />
                  <div class="form-text">Wichtig für die Duplikatsprüfung (Name + Stadt).</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Land (ISO-2)</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.country"
                    maxlength="2"
                    @input="form.country = form.country?.toUpperCase() || ''"
                  />
                  <div class="form-text">z. B. DE, AT, CH — wird serverseitig validiert.</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">E-Mail</label>
                  <input type="email" class="form-control" v-model.trim="form.email" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Telefon</label>
                  <input type="tel" class="form-control" v-model.trim="form.phone" />
                  <div class="form-text">Server normalisiert auf „+” und Ziffern.</div>
                </div>

                <div class="col-12">
                  <label class="form-label">Website</label>
                  <input type="url" class="form-control" v-model.trim="form.website" />
                  <div class="form-text">„https://” wird falls nötig ergänzt.</div>
                </div>
              </div>
            </div>

            <!-- Buchung -->
            <div class="col-12">
              <h5 class="mb-2">Buchung</h5>
              <div class="row g-3 align-items-center">
                <div class="col-md-4">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="booking_enabled" v-model="form.booking_enabled">
                    <label class="form-check-label" for="booking_enabled">Buchbar</label>
                  </div>
                </div>
                <div class="col-md-8">
                  <label class="form-label">Buchungs-Hinweise</label>
                  <input type="text" class="form-control" v-model.trim="form.booking_notes"
                         placeholder="z. B. nur Wochenenden, Mindestmiete 4 Std., Anfragebestätigung erforderlich…" />
                </div>
              </div>
            </div>

            <!-- Kapazität & Fläche -->
            <div class="col-12">
              <h5 class="mb-2">Kapazität & Fläche</h5>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">Fläche (m²)</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.area_sqm" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Sitzplätze (min)</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.capacity_seated_min" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Sitzplätze (max)</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.capacity_seated_max" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Stehend (max)</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.capacity_standing_max" />
                </div>

                <div class="col-md-3">
                  <label class="form-label">WCs</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.toilets_count" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Parkplätze</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.parking_count" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Räume</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.rooms_count" />
                </div>
              </div>
            </div>

            <!-- Kategorien -->
            <div class="col-12">
              <h5 class="mb-2">Kategorien</h5>
              <div class="d-flex flex-wrap gap-2">
                <template v-for="c in categories" :key="c.id">
                  <input
                    class="btn-check"
                    type="checkbox"
                    :id="`cat-${c.id}`"
                    :value="c.id"
                    v-model="form.categories"
                  />
                  <label
                    class="btn btn-sm"
                    :class="toggleBtnClass(form.categories, c.id)"
                    :for="`cat-${c.id}`"
                    :title="c.id"
                  >
                    <i v-if="isSelected(form.categories, c.id)" class="bi bi-check-lg me-1"></i>
                    <i v-else-if="c.meta?.icon" :class="`bi ${c.meta.icon} me-1`"></i>
                    {{ c.label }}
                  </label>
                </template>
              </div>
              <div class="form-text">Wähle passende Events (für Suche & Filter).</div>
            </div>

            <!-- Ausstattung -->
            <div class="col-12">
              <h5 class="mb-2">Ausstattung</h5>
              <div class="d-flex flex-wrap gap-2">
                <template v-for="a in amenities" :key="a.id">
                  <input
                    class="btn-check"
                    type="checkbox"
                    :id="`amn-${a.id}`"
                    :value="a.id"
                    v-model="form.amenities"
                  />
                  <label
                    class="btn btn-sm"
                    :class="toggleBtnClass(form.amenities, a.id)"
                    :for="`amn-${a.id}`"
                    :title="a.id"
                  >
                    <i v-if="isSelected(form.amenities, a.id)" class="bi bi-check-lg me-1"></i>
                    <i v-else-if="a.meta?.icon" :class="`bi ${a.meta.icon} me-1`"></i>
                    {{ a.label }}
                  </label>
                </template>
              </div>
            </div>

            <!-- Technik -->
            <div class="col-12">
              <h5 class="mb-2">Technik</h5>
              <div class="d-flex flex-wrap gap-2">
                <template v-for="t in tech" :key="t.id">
                  <input
                    class="btn-check"
                    type="checkbox"
                    :id="`tech-${t.id}`"
                    :value="t.id"
                    v-model="form.tech"
                  />
                  <label
                    class="btn btn-sm"
                    :class="toggleBtnClass(form.tech, t.id)"
                    :for="`tech-${t.id}`"
                    :title="t.id"
                  >
                    <i v-if="isSelected(form.tech, t.id)" class="bi bi-check-lg me-1"></i>
                    <i v-else-if="t.meta?.icon" :class="`bi ${t.meta.icon} me-1`"></i>
                    {{ t.label }}
                  </label>
                </template>
              </div>
            </div>

            <!-- Services -->
            <div class="col-12">
              <h5 class="mb-2">Catering & Services</h5>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <template v-for="s in services" :key="s.id">
                  <input
                    class="btn-check"
                    type="checkbox"
                    :id="`svc-${s.id}`"
                    :value="s.id"
                    v-model="form.services"
                  />
                  <label
                    class="btn btn-sm"
                    :class="toggleBtnClass(form.services, s.id)"
                    :for="`svc-${s.id}`"
                    :title="s.id"
                  >
                    <i v-if="isSelected(form.services, s.id)" class="bi bi-check-lg me-1"></i>
                    <i v-else-if="s.meta?.icon" :class="`bi ${s.meta.icon} me-1`"></i>
                    {{ s.label }}
                  </label>
                </template>
              </div>

              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">Grundpreis (€)</label>
                  <input type="number" min="0" step="1" class="form-control" v-model.number="form.price_base" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Stundensatz (€)</label>
                  <input type="number" min="0" step="1" class="form-control" v-model.number="form.price_per_hour" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Preis-Hinweise</label>
                  <input type="text" class="form-control" v-model.trim="form.price_notes"
                         placeholder="z. B. Reinigungspauschale, Kaution…" />
                </div>
              </div>
            </div>

            <!-- Regeln -->
            <div class="col-12">
              <h5 class="mb-2">Regeln</h5>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Sperrstunde</label>
                  <input type="time" class="form-control" v-model="form.curfew_time" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Mindestalter</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.min_age" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Max. Lautstärke (dB)</label>
                  <input type="number" min="0" class="form-control" v-model.number="form.max_noise_level_db" />
                </div>

                <div class="col-12">
                  <div class="d-flex flex-wrap gap-2">
                    <template v-for="r in rules" :key="r.id">
                      <input
                        class="btn-check"
                        type="checkbox"
                        :id="`rule-${r.id}`"
                        :value="r.id"
                        v-model="form.rules"
                      />
                      <label
                        class="btn btn-sm"
                        :class="toggleBtnClass(form.rules, r.id)"
                        :for="`rule-${r.id}`"
                        :title="r.id"
                      >
                        <i v-if="isSelected(form.rules, r.id)" class="bi bi-check-lg me-1"></i>
                        <i v-else-if="r.meta?.icon" :class="`bi ${r.meta.icon} me-1`"></i>
                        {{ r.label }}
                      </label>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Verfügbarkeit -->
            <div class="col-12">
              <h5 class="mb-2">Verfügbarkeit</h5>
              <textarea class="form-control" rows="2" v-model.trim="form.availability_notes"
                        placeholder="z. B. bevorzugt Fr–So, keine Feiertage, Vorlauf min. 14 Tage…"></textarea>
            </div>

            <!-- Medien -->
            <div class="col-12">
              <h5 class="mb-2">Medien</h5>
              <label class="form-label">Bild-URLs (kommagetrennt)</label>
              <input type="text" class="form-control" v-model.trim="imagesInput"
                     placeholder="https://…/1.jpg, https://…/2.jpg" />
              <div class="form-text">Einfacher Start – später durch Upload ersetzen.</div>
              <div class="mt-2 d-flex flex-wrap gap-2">
                <img v-for="(u, i) in form.image_urls" :key="i" :src="u" alt="" style="height:60px" class="rounded border" />
              </div>
            </div>

            <!-- Status / Verifikation -->
            <div class="col-md-6">
              <h5 class="mb-2">Status</h5>
              <select class="form-select" v-model="form.status">
                <option :value="null">—</option>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div class="col-md-6">
              <h5 class="mb-2">Verifizierungsstatus</h5>
              <select class="form-select" v-model="form.verification_status">
                <option :value="null">—</option>
                <option value="none">none</option>
                <option value="pending">pending</option>
                <option value="verified">verified</option>
                <option value="rejected">rejected</option>
              </select>
            </div>

            <!-- Hinweise / Fehler -->
            <div class="col-12">
              <div class="d-flex align-items-center gap-3 mt-3">
                <span
                  class="badge"
                  :class="dirty ? 'bg-warning text-dark' : 'bg-light text-muted border'"
                  title="Zeigt an, ob es ungespeicherte Änderungen gibt"
                >
                  {{ dirty ? 'Änderungen nicht gespeichert' : 'Keine Änderungen' }}
                </span>
                <span class="small text-muted">ID: {{ location_id }}</span>
              </div>

              <div v-if="errorMsg" class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle-fill me-1"></i>
                {{ errorMsg }}
                <div v-if="errorFields?.length" class="small mt-1">
                  Felder: {{ errorFields.join(', ') }}
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-4">
                <button class="btn btn-outline-secondary" type="button" @click="resetToOrig" :disabled="!dirty">
                  <i class="bi bi-arrow-counterclockwise me-1"></i> Änderungen verwerfen
                </button>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" :disabled="submitting || !dirty">
                    <span v-if="!submitting"><i class="bi bi-check-lg me-1"></i> Speichern</span>
                    <span v-else><i class="bi bi-hourglass-split me-1"></i> Speichern…</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Danger Zone -->
      <div class="card-footer bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted small">
            <i class="bi bi-info-circle me-1"></i> Löschen entfernt ggf. verknüpfte Seatmaps (cascade).
          </div>
          <button class="btn btn-outline-danger btn-sm" @click="doDelete">
            <i class="bi bi-trash me-1"></i> Location löschen
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card p-3 text-muted">Lade Location…</div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const location_id = computed(() => {
  const raw = route.params.location_id ?? route.params.locationId
  const num = Number(raw)
  if (Number.isNaN(num)) {
    console.warn('[Location page] Ungültige ID in route.params:', { location_id: route.params.location_id, locationId: route.params.locationId })
  }
  return num
})

const {
  wid,
  getLocation,
  patchLocation,
  deleteLocation,
  parseApiError,
  fetchLocationOptions,
  categories,
  amenities,
  services,
  tech,
  rules,
} = useWorkspaceApi()

const ready = ref(false)
const orig = ref(null)
const form = reactive({
  name: '',
  address: '',
  postal_code: '',
  city: '',
  country: '',
  email: '',
  phone: '',
  website: '',
  status: null,
  verification_status: null,
  booking_enabled: false,
  booking_notes: '',
  area_sqm: undefined,
  capacity_seated_min: undefined,
  capacity_seated_max: undefined,
  capacity_standing_max: undefined,
  toilets_count: undefined,
  parking_count: undefined,
  rooms_count: undefined,
  categories: [],
  amenities: [],
  tech: [],
  services: [],
  price_base: undefined,
  price_per_hour: undefined,
  price_notes: '',
  curfew_time: '',
  min_age: undefined,
  max_noise_level_db: undefined,
  rules: [],
  availability_notes: '',
  image_urls: [],
})

const v = reactive({ name: '' })
const submitting = ref(false)
const errorMsg = ref('')
const errorFields = ref([])

const statusBadgeClass = computed(() => {
  switch (form.status) {
    case 'published': return 'bg-success'
    case 'draft': return 'bg-warning text-dark'
    case 'archived': return 'bg-dark'
    default: return 'bg-light text-muted border'
  }
})
const verificationBadgeClass = computed(() => {
  switch (form.verification_status) {
    case 'verified': return 'bg-primary'
    case 'pending': return 'bg-secondary'
    case 'rejected': return 'bg-danger'
    case 'none': return 'bg-light text-dark border'
    default: return 'bg-light text-muted border'
  }
})

const selectedCategoryBadges = computed(() => {
  const byId = new Map(categories.value.map(c => [c.id, c]))
  return (form.categories || []).map(id => {
    const it = byId.get(id) || { id, label: id, meta: {} }
    return { id, label: it.label, icon: it.meta?.icon || null }
  })
})

// ------ Toggle-Button Helpers (nur grün/grau) ------
function isSelected (arr, id) { return Array.isArray(arr) && arr.includes(id) }
function toggleBtnClass (arr, id) {
  return isSelected(arr, id) ? 'btn-success' : 'btn-outline-secondary'
}
// ---------------------------------------------------

function fmt (iso) { try { return new Date(iso).toLocaleString() } catch { return '—' } }
function copyFrom (src) {
  Object.keys(form).forEach(k => {
    if (Array.isArray(form[k])) {
      form[k] = Array.isArray(src?.[k]) ? [...src[k]] : []
    } else {
      form[k] = (src?.[k] ?? (Array.isArray(form[k]) ? [] : ''))
    }
  })
}
function normalizeOut (o) {
  return Object.fromEntries(
    Object.entries(o).map(([k, v]) => {
      if (Array.isArray(v)) return [k, v.length ? v : undefined]
      return [k, (v === '' || v === undefined) ? undefined : v]
    })
  )
}
function isEqual (a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a ?? []) === JSON.stringify(b ?? [])
  }
  return String(a ?? '') === String(b ?? '')
}
const dirty = computed(() => orig.value && Object.keys(form).some(k => !isEqual(form[k], orig.value[k] ?? '')))
function resetToOrig () { if (orig.value) copyFrom(orig.value) }

function validate () {
  v.name = !form.name?.trim() ? 'Bitte Name angeben.' : ''
  if (form.capacity_seated_min && form.capacity_seated_max &&
      Number(form.capacity_seated_min) > Number(form.capacity_seated_max)) {
    errorMsg.value = 'Sitzplatz-Minimum darf nicht größer als Maximum sein.'
    return false
  }
  return !v.name
}

function buildPatchBody () {
  const out = {}
  const norm = normalizeOut(form)
  for (const [k, v] of Object.entries(norm)) {
    const prev = orig.value?.[k]
    const prevNorm = (prev === null || prev === undefined || (Array.isArray(prev) && prev.length === 0) || prev === '') ? undefined : prev
    if (Array.isArray(v) || Array.isArray(prevNorm)) {
      const a = JSON.stringify(v ?? [])
      const b = JSON.stringify(prev ?? [])
      if (a !== b) out[k] = v
    } else if (v !== prevNorm) {
      out[k] = v
    }
  }
  return out
}

const imagesInput = computed({
  get: () => (form.image_urls || []).join(', '),
  set: (val) => {
    form.image_urls = (val || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
})

async function load () {
  ready.value = false
  await fetchLocationOptions().catch(() => {})
  if (!wid.value) { return }
  if (!Number.isFinite(location_id.value)) {
    ready.value = true
    errorMsg.value = 'Ungültige Location-ID in der URL.'
    return
  }
  const { data, error } = await getLocation(location_id.value)
  if (error) {
    ready.value = true
    const p = parseApiError(error)
    errorMsg.value = p.message || 'Location konnte nicht geladen werden.'
    console.error('[Location get] error:', error)
    return
  }
  orig.value = data
  copyFrom(data)
  ready.value = true
}

async function submit () {
  errorMsg.value = ''; errorFields.value = []
  if (!validate() || !dirty.value) return
  submitting.value = true
  const body = buildPatchBody()
  const { data, error } = await patchLocation(location_id.value, body)
  submitting.value = false
  if (error) {
    const p = parseApiError(error)
    errorMsg.value = p.message || 'Speichern fehlgeschlagen.'
    errorFields.value = p.fields || (p.field ? [p.field] : [])
    return
  }
  orig.value = data
  copyFrom(data)
}

async function doDelete () {
  if (!confirm(`Location „${orig.value?.name || ''}“ wirklich löschen?`)) return
  const { error } = await deleteLocation(location_id.value)
  if (error) { alert('Löschen fehlgeschlagen.'); return }
  router.push(`/business/w/${wid.value}/locations`)
}

watchEffect(() => { if (wid.value && Number.isFinite(location_id.value)) load() })
onMounted(() => { if (wid.value && Number.isFinite(location_id.value)) load() })
</script>

<style scoped>
.container-narrow { max-width: 900px; }

h5 { font-weight: 600; }
img.rounded.border { object-fit: cover; }

.badge + .badge { margin-left: .25rem; }

/* Toggle-Chips: rund & kompakt */
.btn.btn-sm { border-radius: .5rem; }
.btn-check + .btn { margin-right: .25rem; margin-bottom: .25rem; }
</style>
