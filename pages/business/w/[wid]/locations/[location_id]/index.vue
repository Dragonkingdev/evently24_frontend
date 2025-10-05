<!-- pages/business/w/[wid]/locations/[location_id]/index.vue -->
<template>
  <div class="container-fluid" v-if="ready">
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

    <!-- 2-spaltiges Layout -->
    <div class="row g-4">
      <!-- RIGHT on lg (col-4) / TOP on mobile: Summary -->
      <div class="col-12 col-lg-4 order-1 order-lg-2">
        <LocationSummaryCard
          :data="form"
          :categoryBadges="selectedCategoryBadges"
          :createdAt="orig?.created_at"
          :updatedAt="orig?.updated_at"
          @delete="doDelete"
        />
      </div>

      <!-- LEFT on lg (col-8) / BELOW on mobile: Form -->
      <div class="col-12 col-lg-8 order-2 order-lg-1">
        <div class="card">
          <div class="card-body">
            <LocationForm
              :form="form"
              :categories="categories"
              :amenities="amenities"
              :services="services"
              :tech="tech"
              :rules="rules"
              :status-badge-class="statusBadgeClass"
              :verification-badge-class="verificationBadgeClass"
              :selected-category-badges="selectedCategoryBadges"
              :v="v"
              :submitting="submitting"
              :dirty="dirty"
              :error-msg="errorMsg"
              :error-fields="errorFields"
              :location-id="location_id"
              @submit="submit"
              @reset="resetToOrig"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card p-3 text-muted">Lade Location…</div>
</template>

<script setup>
import LocationSummaryCard from '~/components/business/workspaces/locations/LocationSummaryCard.vue'
import LocationForm from '~/components/business/workspaces/locations/LocationForm.vue'

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
img.rounded.border { object-fit: cover; }

/* Toggle-Chips: rund & kompakt (Form-Komponente nutzt diese Klassen) */
.btn.btn-sm { border-radius: .5rem; }
.btn-check + .btn { margin-right: .25rem; margin-bottom: .25rem; }
</style>
