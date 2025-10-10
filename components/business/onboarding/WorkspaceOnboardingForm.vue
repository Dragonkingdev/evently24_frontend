<!-- components/business/onboarding/WorkspaceOnboardingForm.vue -->
<template>
  <form @submit.prevent="submit">
    <div class="row g-4">

      <!-- 1) Basis -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Basis</h5>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Workspace-Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model.trim="form.name" :class="{ 'is-invalid': v.name }" placeholder="z. B. Evently" />
                <div v-if="v.name" class="invalid-feedback">{{ v.name }}</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Unternehmensname (rechtlich)</label>
                <input type="text" class="form-control" v-model.trim="form.legal_name" placeholder="z. B. Evently GmbH" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">USt-IdNr. / VAT ID</label>
                <input type="text" class="form-control" v-model.trim="form.vat_id" placeholder="z. B. DE123456789" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2) Geschäftsführung -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Geschäftsführung</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Geschäftsführer:in / Verantwortliche:r</label>
                <input type="text" class="form-control" v-model.trim="form.managing_director" placeholder="Vor- und Nachname" />
              </div>
              <div class="col-12 col-md-3">
                <label class="form-label">E-Mail (GF)</label>
                <input type="email" class="form-control" v-model.trim="form.managing_director_email" placeholder="name@domain.tld" />
              </div>
              <div class="col-12 col-md-3">
                <label class="form-label">Telefon (GF)</label>
                <input type="tel" class="form-control" v-model.trim="form.managing_director_phone" placeholder="+49…" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3) Umsatzsteuer-/Rechnungsadresse -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Umsatzsteuer-/Rechnungsadresse</h5>
            <div class="row g-3">
              <div class="col-12 col-md-8">
                <label class="form-label">Adresse</label>
                <input type="text" class="form-control" v-model.trim="form.address_line" placeholder="Straße Hausnr." />
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">PLZ</label>
                <input type="text" class="form-control" v-model.trim="form.postal_code" placeholder="z. B. 10115" />
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">Stadt</label>
                <input type="text" class="form-control" v-model.trim="form.city" placeholder="z. B. Berlin" />
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">Land (ISO-2)</label>
                <input type="text" class="form-control" v-model.trim="form.country" maxlength="2" @input="form.country = (form.country || '').toUpperCase()" placeholder="DE, AT, CH …" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4) Kontakt -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Kontakt</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Allgemeine E-Mail</label>
                <input type="email" class="form-control" v-model.trim="form.email" placeholder="hello@domain.tld" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Allgemeine Telefonnummer</label>
                <input type="tel" class="form-control" v-model.trim="form.phone" placeholder="+49…" />
                <div class="form-text">Server normalisiert auf „+” und Ziffern.</div>
              </div>
              <div class="col-12">
                <label class="form-label">Website</label>
                <input type="url" class="form-control" v-model.trim="form.website" placeholder="https://…" />
                <div class="form-text">„https://” wird falls nötig ergänzt.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5) Einstellungen -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Einstellungen</h5>
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="form-label">Zeitzone <span class="text-danger">*</span></label>
                <select class="form-select" v-model="form.time_zone" :class="{ 'is-invalid': v.time_zone }">
                  <option value="">— wählen —</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/Vienna">Europe/Vienna</option>
                  <option value="Europe/Zurich">Europe/Zurich</option>
                  <option value="UTC">UTC</option>
                </select>
                <div v-if="v.time_zone" class="invalid-feedback">{{ v.time_zone }}</div>
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">Währung <span class="text-danger">*</span></label>
                <select class="form-select" v-model="form.currency" :class="{ 'is-invalid': v.currency }">
                  <option value="">— wählen —</option>
                  <option value="EUR">EUR</option>
                  <option value="CHF">CHF</option>
                </select>
                <div v-if="v.currency" class="invalid-feedback">{{ v.currency }}</div>
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">Standardsprache</label>
                <select class="form-select" v-model="form.default_language">
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label">Standardland</label>
                <input type="text" class="form-control" v-model.trim="form.default_country" maxlength="2" @input="form.default_country = (form.default_country || '').toUpperCase()" placeholder="DE" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6) Module (optional) -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Module / Features (optional)</h5>
            <div class="d-flex flex-wrap gap-2">
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.features.locations" />
                <span class="form-check-label"><i class="bi bi-geo-alt me-1"></i>Locations</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.features.calendar" />
                <span class="form-check-label"><i class="bi bi-calendar3 me-1"></i>Kalender</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.features.ticketing" />
                <span class="form-check-label"><i class="bi bi-ticket-perforated me-1"></i>Ticketing</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.features.artists" />
                <span class="form-check-label"><i class="bi bi-person-badge me-1"></i>Artists</span>
              </label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.features.team" />
                <span class="form-check-label"><i class="bi bi-people me-1"></i>Team</span>
              </label>
            </div>
            <div class="form-text">Kannst du später jederzeit umstellen.</div>
          </div>
        </div>
      </div>

      <!-- 7) Branding (optional) -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Branding (optional)</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Logo-URL</label>
                <input type="url" class="form-control" v-model.trim="form.branding.logo_url" placeholder="https://…/logo.png" />
              </div>
              <div class="col-12 col-md-6">
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

      <!-- Fehlerausgabe -->
      <div v-if="errorMsg" class="col-12">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
          {{ errorMsg }}
          <div v-if="errorFields?.length" class="small mt-1">
            Felder: {{ errorFields.join(', ') }}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div class="small text-muted">
            Mit Klick auf „Workspace erstellen“ akzeptierst du unsere Nutzungsbedingungen.
          </div>
          <button class="btn btn-primary" :disabled="submitting">
            <span v-if="!submitting"><i class="bi bi-check-lg me-1"></i> Workspace erstellen</span>
            <span v-else><i class="bi bi-hourglass-split me-1"></i> Erstelle…</span>
          </button>
        </div>
      </div>

    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  submitting:   { type: Boolean, default: false },
  errorMsg:     { type: String,  default: '' },
  errorFields:  { type: Array,   default: () => [] },
})
const emit = defineEmits(['submit'])

const form = reactive({
  // Basis
  name: '',
  legal_name: '',
  vat_id: '',
  // Geschäftsführung
  managing_director: '',
  managing_director_email: '',
  managing_director_phone: '',
  // Rechnungs-/Steueradresse
  address_line: '',
  postal_code: '',
  city: '',
  country: '',
  // Kontakt & Web
  email: '',
  phone: '',
  website: '',
  // Einstellungen
  time_zone: guessTz(),
  currency: 'EUR',
  default_language: 'de',
  default_country: '',
  // Features (optional)
  features: {
    locations: true,
    calendar:  true,
    ticketing: true,
    artists:   true,
    team:      true,
  },
  // Branding (optional)
  branding: {
    logo_url: '',
    color_primary: '', // hex without '#'
  },
})

const v = reactive({ name: '', time_zone: '', currency: '' })

const colorHex = computed({
  get: () => form.branding.color_primary?.replace(/^#/, '') || '',
  set: (val) => { form.branding.color_primary = (val || '').replace(/^#/, '').toUpperCase() }
})

function guessTz () {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin' }
  catch { return 'Europe/Berlin' }
}
function normalizeWebsite (url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}
function isEmpty (s) { return !s || !String(s).trim() }

function validate () {
  v.name      = isEmpty(form.name)      ? 'Bitte Namen angeben.' : ''
  v.time_zone = isEmpty(form.time_zone) ? 'Bitte Zeitzone wählen.' : ''
  v.currency  = isEmpty(form.currency)  ? 'Bitte Währung wählen.' : ''
  return !v.name && !v.time_zone && !v.currency
}

function submit () {
  if (!validate()) return
  const payload = {
    // Basis
    name: form.name.trim(),
    legal_name: form.legal_name?.trim() || null,
    vat_id: form.vat_id?.trim() || null,
    // Geschäftsführung (flach halten – Backend-freundlich)
    managing_director: form.managing_director?.trim() || null,
    managing_director_email: form.managing_director_email?.trim() || null,
    managing_director_phone: form.managing_director_phone?.trim() || null,
    // Rechnungs-/Steueradresse
    address_line: form.address_line?.trim() || null,
    postal_code: form.postal_code?.trim() || null,
    city: form.city?.trim() || null,
    country: form.country?.trim().toUpperCase() || null,
    // Kontakt & Web
    email: form.email?.trim() || null,
    phone: form.phone?.trim() || null,
    website: normalizeWebsite(form.website?.trim() || ''),
    // Einstellungen
    time_zone: form.time_zone,
    currency: form.currency,
    default_language: form.default_language,
    default_country: form.default_country?.trim().toUpperCase() || null,
    // Optionales
    features: { ...form.features },
    branding: {
      logo_url: form.branding.logo_url?.trim() || null,
      color_primary: colorHex.value || null,
    },
  }
  // KEINE Location-Erstellung hier.
  emit('submit', payload)
}
</script>

<style scoped>
.color-dot{
  width: 22px; height: 22px; display: inline-block;
  border: 1px solid var(--bs-border-color);
}
</style>
