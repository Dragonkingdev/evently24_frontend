<!-- pages/business/w/[wid]/settings/general.vue -->
<template>
  <div class="container-fluid px-0">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0">Workspace · Allgemeine Einstellungen</h5>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="reload" :disabled="loading">
          <i class="bi bi-arrow-clockwise me-1"></i> Neu laden
        </button>
        <button class="btn btn-primary btn-sm" @click="save" :disabled="saving || loading">
          <i class="bi bi-save me-1"></i> Speichern
        </button>
      </div>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ errorMsg }}
      <div v-if="errorFields.length" class="small mt-1">Felder: {{ errorFields.join(', ') }}</div>
    </div>
    <div v-if="success" class="alert alert-success">
      <i class="bi bi-check2-circle me-1"></i>Einstellungen gespeichert.
    </div>

    <div class="row g-4">
      <!-- Basis -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Basis</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Workspace-Name <span class="text-danger">*</span></label>
                <input class="form-control" v-model.trim="model.name" :class="{ 'is-invalid': v.name }" required minlength="2" placeholder="z. B. Evently" />
                <div v-if="v.name" class="invalid-feedback">{{ v.name }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Unternehmensname (rechtlich)</label>
                <input class="form-control" v-model.trim="model.legal_name" placeholder="z. B. Evently GmbH" />
              </div>
              <div class="col-md-6">
                <label class="form-label">USt-IdNr. / VAT ID</label>
                <input class="form-control" v-model.trim="model.vat_id" placeholder="DE123456789" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Geschäftsführung -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Geschäftsführung</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Geschäftsführer:in / Verantwortliche:r</label>
                <input class="form-control" v-model.trim="model.managing_director" placeholder="Vor- und Nachname" />
              </div>
              <div class="col-md-3">
                <label class="form-label">E-Mail (GF)</label>
                <input type="email" class="form-control" v-model.trim="model.managing_director_email" placeholder="name@domain.tld" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Telefon (GF)</label>
                <input type="tel" class="form-control" v-model.trim="model.managing_director_phone" placeholder="+49…" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rechnungs-/Steueradresse -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Umsatzsteuer-/Rechnungsadresse</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label">Adresse</label>
                <input class="form-control" v-model.trim="model.address_line" placeholder="Straße Hausnr." />
              </div>
              <div class="col-md-4">
                <label class="form-label">PLZ</label>
                <input class="form-control" v-model.trim="model.postal_code" placeholder="z. B. 10115" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Stadt</label>
                <input class="form-control" v-model.trim="model.city" placeholder="z. B. Berlin" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Land (ISO-2)</label>
                <input class="form-control" v-model.trim="model.country" maxlength="2" @input="model.country = (model.country || '').toUpperCase()" placeholder="DE, AT, CH …" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kontakt & Web -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Kontakt &amp; Website</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Allgemeine E-Mail</label>
                <input type="email" class="form-control" v-model.trim="model.email" placeholder="hello@domain.tld" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Allgemeine Telefonnummer</label>
                <input type="tel" class="form-control" v-model.trim="model.phone" placeholder="+49…" />
                <div class="form-text">Server normalisiert auf „+” und Ziffern.</div>
              </div>
              <div class="col-12">
                <label class="form-label">Website</label>
                <input type="url" class="form-control" v-model.trim="model.website" placeholder="https://…" />
                <div class="form-text">„https://” wird falls nötig ergänzt.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Einstellungen -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Einstellungen</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Zeitzone <span class="text-danger">*</span></label>
                <select class="form-select" v-model="model.time_zone" :class="{ 'is-invalid': v.time_zone }">
                  <option value="">— wählen —</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/Vienna">Europe/Vienna</option>
                  <option value="Europe/Zurich">Europe/Zurich</option>
                  <option value="UTC">UTC</option>
                </select>
                <div v-if="v.time_zone" class="invalid-feedback">{{ v.time_zone }}</div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Währung <span class="text-danger">*</span></label>
                <select class="form-select" v-model="model.currency" :class="{ 'is-invalid': v.currency }">
                  <option value="">— wählen —</option>
                  <option value="EUR">EUR</option>
                  <option value="CHF">CHF</option>
                </select>
                <div v-if="v.currency" class="invalid-feedback">{{ v.currency }}</div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Standardsprache</label>
                <select class="form-select" v-model="model.default_language">
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Standardland</label>
                <input class="form-control" v-model.trim="model.default_country" maxlength="2" @input="model.default_country = (model.default_country || '').toUpperCase()" placeholder="DE" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Module / Features</h6></div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="model.features.locations" />
                <span class="form-check-label"><i class="bi bi-geo-alt me-1"></i>Locations</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="model.features.calendar" />
                <span class="form-check-label"><i class="bi bi-calendar3 me-1"></i>Kalender</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="model.features.ticketing" />
                <span class="form-check-label"><i class="bi bi-ticket-perforated me-1"></i>Ticketing</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="model.features.artists" />
                <span class="form-check-label"><i class="bi bi-person-badge me-1"></i>Artists</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="model.features.team" />
                <span class="form-check-label"><i class="bi bi-people me-1"></i>Team</span>
              </label>
            </div>
            <div class="form-text">Kannst du jederzeit umstellen.</div>
          </div>
        </div>
      </div>

      <!-- Branding -->
      <div class="col-12 col-xxl-8">
        <div class="card">
          <div class="card-header"><h6 class="mb-0">Branding</h6></div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Logo-URL</label>
                <input type="url" class="form-control" v-model.trim="model.branding.logo_url" placeholder="https://…/logo.png" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Primärfarbe (HEX)</label>
                <div class="input-group">
                  <span class="input-group-text">#</span>
                  <input type="text" class="form-control" v-model.trim="colorHex" placeholder="0057FF" />
                  <span class="input-group-text p-1">
                    <span class="color-dot rounded" :style="{ background: '#'+(colorHex || '000000') }"></span>
                  </span>
                </div>
                <div class="form-text">Ohne „#“ eingeben.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="col-12 col-xxl-8">
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-outline-secondary" @click="reload" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-1"></i> Verwerfen &amp; neu laden
          </button>
          <button class="btn btn-primary" @click="save" :disabled="saving || loading">
            <i class="bi bi-save me-1"></i> Speichern
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="mt-4">
      <div class="skeleton sk-title mb-3"></div>
      <div class="card mb-3"><div class="card-body"><div class="skeleton sk-line mb-2"></div><div class="skeleton sk-line"></div></div></div>
      <div class="card mb-3"><div class="card-body"><div class="skeleton sk-line mb-2"></div><div class="skeleton sk-line"></div></div></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })

const { wid, patchWorkspace } = useWorkspaceApi()
const { get } = useApi()
const { parseApiError } = useWorkspaceApi()

/** ---------- STATE ---------- */
const loading = ref(false)
const saving  = ref(false)
const success = ref(false)
const errorMsg = ref('')
const errorFields = ref([])

const model = reactive({
  // Basis
  name: '', legal_name: '', vat_id: '',
  // Geschäftsführung
  managing_director: '', managing_director_email: '', managing_director_phone: '',
  // Rechnungs-/Steueradresse
  address_line: '', postal_code: '', city: '', country: '',
  // Kontakt & Web
  email: '', phone: '', website: '',
  // Einstellungen
  time_zone: '', currency: '', default_language: 'de', default_country: '',
  // Features
  features: { locations: true, calendar: true, ticketing: true, artists: true, team: true },
  // Branding
  branding: { logo_url: '', color_primary: '' },
})

/** ---------- VALIDATION ---------- */
const v = reactive({ name: '', time_zone: '', currency: '' })
function isEmpty (s) { return !s || !String(s).trim() }
function validate () {
  v.name      = isEmpty(model.name)      ? 'Bitte Namen angeben.' : ''
  v.time_zone = isEmpty(model.time_zone) ? 'Bitte Zeitzone wählen.' : ''
  v.currency  = isEmpty(model.currency)  ? 'Bitte Währung wählen.' : ''
  return !v.name && !v.time_zone && !v.currency
}

/** ---------- HELPERS ---------- */
function normalizeWebsite (url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}
function _txtOrNull (v) {
  if (v === null) return null
  if (typeof v === 'string') {
    const t = v.trim()
    return t ? t : null
  }
  return undefined
}
function _stripUndefined (obj) {
  const o = {}
  for (const [k, v] of Object.entries(obj || {})) if (v !== undefined) o[k] = v
  return o
}

/** color hex helper binding (keine # im Feld speichern) */
const colorHex = computed({
  get: () => (model.branding?.color_primary || '').replace(/^#/, ''),
  set: (val) => { model.branding.color_primary = (val || '').replace(/^#/, '').toUpperCase() }
})

/** ---------- LOAD ---------- */
async function load() {
  if (!wid.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await get(`/v1/workspace/${wid.value}`)
    const d = data || {}

    // defensive defaults
    const feats = d.features || {}
    const brand = d.branding || {}

    Object.assign(model, {
      name: d.name || '',
      legal_name: d.legal_name || '',
      vat_id: d.vat_id || '',

      managing_director: d.managing_director || '',
      managing_director_email: d.managing_director_email || '',
      managing_director_phone: d.managing_director_phone || '',

      address_line: d.address_line || '',
      postal_code: d.postal_code || '',
      city: d.city || '',
      country: (d.country || '').toUpperCase(),

      email: d.email || '',
      phone: d.phone || '',
      website: d.website || '',

      time_zone: d.time_zone || '',
      currency: d.currency || '',
      default_language: d.default_language || 'de',
      default_country: (d.default_country || '').toUpperCase(),

      features: {
        locations: feats.locations !== false,
        calendar:  feats.calendar  !== false,
        ticketing: feats.ticketing !== false,
        artists:   feats.artists   !== false,
        team:      feats.team      !== false,
      },
      branding: {
        logo_url: brand.logo_url || '',
        color_primary: (brand.color_primary || '').replace(/^#/, '').toUpperCase(),
      },
    })
  } catch (e) {
    errorMsg.value = 'Workspace konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}
onMounted(load)
function reload(){ load() }

/** ---------- SAVE ---------- */
async function save () {
  success.value = false
  errorMsg.value = ''
  errorFields.value = []
  if (!validate()) return

  // Payload aufräumen & normalisieren (Trim, Uppercase-Country, https://, null-clears)
  const payload = _stripUndefined({
    name: _txtOrNull(model.name),
    legal_name: _txtOrNull(model.legal_name),
    vat_id: _txtOrNull(model.vat_id),

    managing_director: _txtOrNull(model.managing_director),
    managing_director_email: _txtOrNull(model.managing_director_email),
    managing_director_phone: _txtOrNull(model.managing_director_phone),

    address_line: _txtOrNull(model.address_line),
    postal_code: _txtOrNull(model.postal_code),
    city: _txtOrNull(model.city),
    country: _txtOrNull((model.country || '').toUpperCase()),

    email: _txtOrNull(model.email),
    phone: _txtOrNull(model.phone),
    website: _txtOrNull(normalizeWebsite(model.website || '')),

    time_zone: _txtOrNull(model.time_zone),
    currency: _txtOrNull(model.currency),
    default_language: _txtOrNull(model.default_language),
    default_country: _txtOrNull((model.default_country || '').toUpperCase()),

    features: {
      locations: !!model.features.locations,
      calendar:  !!model.features.calendar,
      ticketing: !!model.features.ticketing,
      artists:   !!model.features.artists,
      team:      !!model.features.team,
    },
    branding: {
      logo_url: _txtOrNull(model.branding.logo_url),
      color_primary: _txtOrNull(colorHex.value), // ohne '#'
    },
  })

  saving.value = true
  try {
    const { error } = await patchWorkspace(payload)
    saving.value = false
    if (error) {
      const p = parseApiError(error)
      errorMsg.value = p.message || 'Speichern fehlgeschlagen.'
      errorFields.value = p.fields || (p.field ? [p.field] : [])
      return
    }
    success.value = true
  } catch (e) {
    saving.value = false
    errorMsg.value = 'Speichern fehlgeschlagen.'
  }
}
</script>

<style scoped>
.color-dot{
  width: 22px; height: 22px; display: inline-block;
  border: 1px solid var(--bs-border-color);
  border-radius: .35rem;
}
</style>
