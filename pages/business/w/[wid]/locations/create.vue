<!-- pages/business/w/[wid]/locations/create.vue -->
 <template>
  <div class="container-narrow">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Neue Location</h4>
      <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Zurück
      </NuxtLink>
    </div>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="row g-3">
            <!-- Name (required) -->
            <div class="col-12">
              <label class="form-label">Name<span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                v-model.trim="form.name"
                :class="{ 'is-invalid': v.name }"
                placeholder="z.B. Theater am Ring"
                required
              />
              <div class="form-text">Offizieller Venue-Name. Muss eindeutig innerhalb derselben Stadt im Workspace sein.</div>
              <div v-if="v.name" class="invalid-feedback">{{ v.name }}</div>
            </div>

            <!-- Address -->
            <div class="col-md-8">
              <label class="form-label">Adresse</label>
              <input type="text" class="form-control" v-model.trim="form.address" placeholder="Musterstraße 12" />
            </div>
            <div class="col-md-4">
              <label class="form-label">PLZ</label>
              <input type="text" class="form-control" v-model.trim="form.postal_code" placeholder="12345" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Stadt</label>
              <input type="text" class="form-control" v-model.trim="form.city" placeholder="Berlin" />
              <div class="form-text">Wird für die Duplikatsprüfung zusammen mit dem Namen herangezogen.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Land (ISO-2)</label>
              <input
                type="text"
                class="form-control"
                v-model.trim="form.country"
                maxlength="2"
                placeholder="DE"
                @input="form.country = form.country?.toUpperCase() || ''"
              />
              <div class="form-text">Zwei Buchstaben, z.B. DE, AT, CH.</div>
            </div>

            <!-- Contact -->
            <div class="col-md-6">
              <label class="form-label">E-Mail</label>
              <input type="email" class="form-control" v-model.trim="form.email" placeholder="info@venue.de" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Telefon</label>
              <input type="tel" class="form-control" v-model.trim="form.phone" placeholder="+49 30 1234567" />
              <div class="form-text">Wird serverseitig auf „+“ und Ziffern normalisiert.</div>
            </div>

            <div class="col-12">
              <label class="form-label">Website</label>
              <input type="url" class="form-control" v-model.trim="form.website" placeholder="https://example.com" />
              <div class="form-text">Falls kein Schema angegeben ist, wird „https://“ automatisch ergänzt.</div>
            </div>

            <!-- Statusfelder -->
            <div class="col-md-6">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="form.status">
                <option :value="null">—</option>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
              <div class="form-text">Optionaler Profilstatus (default serverseitig: draft).</div>
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

          <!-- Fehlerbox -->
          <div v-if="errorMsg" class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>
            {{ errorMsg }}
            <div v-if="errorFields?.length" class="small mt-1">
              Felder: {{ errorFields.join(', ') }}
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary">Abbrechen</NuxtLink>
            <button class="btn btn-primary" :disabled="submitting">
              <span v-if="!submitting"><i class="bi bi-check-lg me-1"></i> Anlegen</span>
              <span v-else><i class="bi bi-hourglass-split me-1"></i> Speichern…</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { wid, createLocation, parseApiError } = useWorkspaceApi()

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
  verification_status: null
})

const v = reactive({ name: '' }) // simple client-side validation messages
const errorMsg = ref('')
const errorFields = ref([])
const submitting = ref(false)

function validate () {
  v.name = !form.name?.trim() ? 'Bitte Name angeben.' : ''
  return !v.name
}

async function submit () {
  errorMsg.value = ''; errorFields.value = []
  if (!validate()) return
  submitting.value = true

  // Payload sauber halten: leere Strings -> undefined
  const body = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, (v === '' || v === null) ? undefined : v])
  )

  const { data, error } = await createLocation(body)
  submitting.value = false

  if (error) {
    const p = parseApiError(error)
    errorMsg.value = p.message || 'Es ist ein Fehler aufgetreten.'
    errorFields.value = p.fields || (p.field ? [p.field] : [])
    return
  }

  // Erfolgreich → zurück zur Liste
  router.push(`/business/w/${wid.value}/locations`)
}
</script>

<style scoped>
.container-narrow { max-width: 900px; }
</style>
