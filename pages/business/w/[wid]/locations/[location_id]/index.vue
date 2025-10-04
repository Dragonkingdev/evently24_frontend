<!-- pages/business/w/[wid]/locations/[locationId]/index.vue -->
 <template>
  <div class="container-narrow" v-if="ready">
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

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="row g-3">
            <!-- Name -->
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

            <!-- Address -->
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
              <div class="form-text">z.B. DE, AT, CH — wird serverseitig validiert.</div>
            </div>

            <!-- Contact -->
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

            <!-- Status -->
            <div class="col-md-6">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="form.status">
                <option :value="null">—</option>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Verifizierungsstatus</label>
              <select class="form-select" v-model="form.verification_status">
                <option :value="null">—</option>
                <option value="none">none</option>
                <option value="pending">pending</option>
                <option value="verified">verified</option>
              </select>
            </div>
          </div>

          <!-- Hinweise / Fehler -->
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

          <!-- Actions -->
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
        </form>
      </div>

      <!-- Optional: Danger Zone (Löschen) -->
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

// ROBUST: liest bevorzugt "location_id", fällt zurück auf "locationId"
const location_id = computed(() => {
  const raw = route.params.location_id ?? route.params.locationId
  const num = Number(raw)
  if (Number.isNaN(num)) {
    console.warn('[Location page] Ungültige ID in route.params:', { location_id: route.params.location_id, locationId: route.params.locationId })
  }
  return num
})

const { wid, getLocation, patchLocation, deleteLocation, parseApiError } = useWorkspaceApi()

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
})
const v = reactive({ name: '' })
const submitting = ref(false)
const errorMsg = ref('')
const errorFields = ref([])

function fmt (iso) { try { return new Date(iso).toLocaleString() } catch { return '—' } }
function copyFrom (src) { Object.keys(form).forEach(k => form[k] = (src?.[k] ?? '')) }
function normalizeOut (o) { return Object.fromEntries(Object.entries(o).map(([k,v]) => [k, (v === '' || v === undefined) ? undefined : v])) }
function isEqual (a, b) { return String(a ?? '') === String(b ?? '') }
const dirty = computed(() => orig.value && Object.keys(form).some(k => !isEqual(form[k], orig.value[k] ?? '')))

function resetToOrig () { if (orig.value) copyFrom(orig.value) }
function validate () { v.name = !form.name?.trim() ? 'Bitte Name angeben.' : ''; return !v.name }
function buildPatchBody () {
  const out = {}
  const norm = normalizeOut(form)
  for (const [k, v] of Object.entries(norm)) {
    const prev = orig.value?.[k]
    const prevNorm = (prev === null || prev === undefined) ? undefined : prev
    if (v !== prevNorm) out[k] = v
  }
  return out
}

async function load () {
  ready.value = false
  if (!wid.value) { return } // watchEffect triggert erneut
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

// lädt, sobald beide bereit sind
watchEffect(() => { if (wid.value && Number.isFinite(location_id.value)) load() })
onMounted(() => { if (wid.value && Number.isFinite(location_id.value)) load() })
</script>



<style scoped>
.container-narrow { max-width: 900px; }
</style>
