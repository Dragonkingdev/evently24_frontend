<template>
  <div class="container-narrow">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center gap-2">
        <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-arrow-left"></i>
        </NuxtLink>
        <h4 class="mb-0">Location anlegen</h4>
      </div>
      <div class="text-end small text-muted">
        <span><i class="bi bi-info-circle me-1"></i>Pflichtfeld: Name</span>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Quick Preview Badges -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge" :class="form.booking_enabled ? 'bg-success' : 'bg-secondary'">
            <i :class="form.booking_enabled ? 'bi bi-calendar-check me-1' : 'bi bi-calendar-x me-1'"></i>
            {{ form.booking_enabled ? 'Buchbar' : 'Nicht buchbar' }}
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
          <span
            v-for="c in selectedCategoryBadges"
            :key="c.id"
            class="badge text-uppercase"
            :class="`bg-${c.badge}`"
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
                <label
                  v-for="c in categories"
                  :key="c.id"
                  class="form-check form-check-inline badge-like"
                  :title="c.id"
                >
                  <input class="form-check-input me-1" type="checkbox" :value="c.id" v-model="form.categories">
                  <span class="form-check-label">
                    <i v-if="c.meta?.icon" :class="`bi ${c.meta.icon} me-1`"></i>{{ c.label }}
                  </span>
                </label>
              </div>
              <div class="form-text">Wähle passende Events (für Suche & Filter).</div>
            </div>

            <!-- Ausstattung -->
            <div class="col-12">
              <h5 class="mb-2">Ausstattung</h5>
              <div class="d-flex flex-wrap gap-2">
                <label v-for="a in amenities" :key="a.id" class="form-check form-check-inline badge-like" :title="a.id">
                  <input class="form-check-input me-1" type="checkbox" :value="a.id" v-model="form.amenities">
                  <span class="form-check-label">
                    <i v-if="a.meta?.icon" :class="`bi ${a.meta.icon} me-1`"></i>{{ a.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Technik -->
            <div class="col-12">
              <h5 class="mb-2">Technik</h5>
              <div class="d-flex flex-wrap gap-2">
                <label v-for="t in tech" :key="t.id" class="form-check form-check-inline badge-like" :title="t.id">
                  <input class="form-check-input me-1" type="checkbox" :value="t.id" v-model="form.tech">
                  <span class="form-check-label">
                    <i v-if="t.meta?.icon" :class="`bi ${t.meta.icon} me-1`"></i>{{ t.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Services -->
            <div class="col-12">
              <h5 class="mb-2">Catering & Services</h5>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <label v-for="s in services" :key="s.id" class="form-check form-check-inline badge-like" :title="s.id">
                  <input class="form-check-input me-1" type="checkbox" :value="s.id" v-model="form.services">
                  <span class="form-check-label">
                    <i v-if="s.meta?.icon" :class="`bi ${s.meta.icon} me-1`"></i>{{ s.label }}
                  </span>
                </label>
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
                    <label v-for="r in rules" :key="r.id" class="form-check form-check-inline badge-like" :title="r.id">
                      <input class="form-check-input me-1" type="checkbox" :value="r.id" v-model="form.rules">
                      <span class="form-check-label">
                        <i v-if="r.meta?.icon" :class="`bi ${r.meta.icon} me-1`"></i>{{ r.label }}
                      </span>
                    </label>
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

            <!-- Fehler -->
            <div class="col-12">
              <div v-if="errorMsg" class="alert alert-danger mt-2">
                <i class="bi bi-exclamation-triangle-fill me-1"></i>
                {{ errorMsg }}
                <div v-if="errorFields?.length" class="small mt-1">
                  Felder: {{ errorFields.join(', ') }}
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex justify-content-end mt-4">
                <button class="btn btn-primary" :disabled="submitting">
                  <span v-if="!submitting"><i class="bi bi-plus-lg me-1"></i> Anlegen</span>
                  <span v-else><i class="bi bi-hourglass-split me-1"></i> Anlegen…</span>
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const {
  wid,
  createLocation,
  parseApiError,

  // Meta-Optionen
  fetchLocationOptions,
  categories,
  amenities,
  services,
  tech,
  rules,
} = useWorkspaceApi()

const form = reactive({
  // Basis
  name: '',
  address: '',
  postal_code: '',
  city: '',
  country: '',
  email: '',
  phone: '',
  website: '',

  // Status / Verifikation – default draft/none
  status: 'draft',
  verification_status: 'none',

  // Buchung
  booking_enabled: false,
  booking_notes: '',

  // Kapazität & Fläche
  area_sqm: undefined,
  capacity_seated_min: undefined,
  capacity_seated_max: undefined,
  capacity_standing_max: undefined,
  toilets_count: undefined,
  parking_count: undefined,
  rooms_count: undefined,

  // Kategorien / Ausstattung / Technik / Services
  categories: [],
  amenities: [],
  tech: [],
  services: [],

  // Preise
  price_base: undefined,
  price_per_hour: undefined,
  price_notes: '',

  // Regeln
  curfew_time: '',
  min_age: undefined,
  max_noise_level_db: undefined,
  rules: [],

  // Verfügbarkeit / Medien
  availability_notes: '',
  image_urls: [],
})

const v = reactive({ name: '' })
const submitting = ref(false)
const errorMsg = ref('')
const errorFields = ref([])

// Kategorien-Badges Vorschau
const selectedCategoryBadges = computed(() => {
  const byId = new Map(categories.value.map(c => [c.id, c]))
  return (form.categories || []).map(id => {
    const it = byId.get(id) || { id, label: id, meta: {} }
    return {
      id,
      label: it.label,
      badge: it.meta?.badge || 'info',
      icon: it.meta?.icon || null,
    }
  })
})

// Bilder-Input (kommagetrennt)
const imagesInput = computed({
  get: () => (form.image_urls || []).join(', '),
  set: (val) => {
    form.image_urls = (val || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
})

// Normalizer für Create
function normalizeOut (o) {
  return Object.fromEntries(
    Object.entries(o).map(([k, v]) => {
      if (Array.isArray(v)) return [k, v.length ? v : undefined]
      return [k, (v === '' || v === undefined) ? undefined : v]
    })
  )
}

function validate () {
  v.name = !form.name?.trim() ? 'Bitte Name angeben.' : ''
  if (v.name) return false

  if (form.capacity_seated_min && form.capacity_seated_max &&
      Number(form.capacity_seated_min) > Number(form.capacity_seated_max)) {
    errorMsg.value = 'Sitzplatz-Minimum darf nicht größer als Maximum sein.'
    return false
  }
  return true
}

async function submit () {
  errorMsg.value = ''; errorFields.value = []
  if (!validate()) return
  submitting.value = true

  // Body für Create: nur gesetzte Felder senden (Backend normalisiert)
  const body = Object.fromEntries(
    Object.entries(normalizeOut(form)).filter(([, v]) => v !== undefined && v !== null)
  )

  const { data, error } = await createLocation(body)
  submitting.value = false
  if (error) {
    const p = parseApiError(error)
    errorMsg.value = p.message || 'Anlegen fehlgeschlagen.'
    errorFields.value = p.fields || (p.field ? [p.field] : [])
    return
  }
  // Erfolgreich -> Weiterleitung in Detail-Ansicht
  router.push(`/business/w/${wid.value}/locations/${data?.id}`)
}

// Meta laden
onMounted(async () => {
  await fetchLocationOptions().catch(() => {})
})
</script>

<style scoped>
.container-narrow { max-width: 900px; }

/* Optik wie im Edit */
h5 { font-weight: 600; }
.form-check-inline { margin-right: .75rem; }
img.rounded.border { object-fit: cover; }
.badge + .badge { margin-left: .25rem; }

.badge-like {
  padding: .25rem .5rem;
  border: 1px solid var(--bs-border-color);
  border-radius: .5rem;
  background: var(--bs-body-bg);
}
.badge-like .form-check-input {
  transform: translateY(1px);
}
</style>
