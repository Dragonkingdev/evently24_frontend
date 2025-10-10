<!-- components/business/workspaces/events/EditLocationModal.vue -->
<template>
  <BizModal :open="open" title="Location bearbeiten" @close="close">
    <form id="__location_form" @submit.prevent="submit" class="vstack gap-3">
      <!-- Modus: bestehende Location vs. frei -->
      <div>
        <label class="form-label d-block">Eingabeart</label>
        <div class="btn-group" role="group">
          <input type="radio" class="btn-check" id="loc-existing" value="existing" v-model="mode">
          <label class="btn btn-outline-secondary" for="loc-existing">Vorhandene Location</label>

          <input type="radio" class="btn-check" id="loc-free" value="free" v-model="mode">
          <label class="btn btn-outline-secondary" for="loc-free">Frei eintragen</label>
        </div>
      </div>

      <!-- Existing: Suche + Auswahl -->
      <div v-if="mode==='existing'" class="vstack gap-2">
        <div>
          <label class="form-label">Location suchen</label>
          <input
            v-model.trim="search"
            type="text"
            class="form-control"
            placeholder="Mehrere Begriffe (z. B. Berlin Arena). Zeilenumbruch = weiterer Begriff."
            @input="debouncedFetch()"
            @keydown.enter.prevent="debouncedFetch()"
          />
          <div class="form-text">
            Filter: <strong>Alle</strong> eingegebenen Begriffe müssen vorkommen (AND). Trenne mit Leerzeichen oder Zeilenumbruch.
          </div>
        </div>

        <div v-if="loading" class="text-muted small">Suche läuft…</div>
        <div v-else-if="results.length===0" class="text-muted small">Keine Treffer. Probiere einen anderen Begriff.</div>

        <ul v-else class="list-group">
          <li
            v-for="loc in results"
            :key="loc.id"
            class="list-group-item d-flex justify-content-between align-items-center"
            :class="{active: selectedLocationId === loc.id}"
            role="button"
            @click="selectedLocationId = loc.id"
          >
            <div class="me-3">
              <div class="fw-semibold">{{ loc.name || '—' }}</div>
              <div class="small text-muted">
                {{ loc.address || '' }}
                <span v-if="(loc.address && (loc.postal_code || loc.city))"> · </span>
                {{ loc.postal_code || '' }} {{ loc.city || '' }}
              </div>
            </div>
            <i class="bi" :class="selectedLocationId===loc.id ? 'bi-check-circle-fill' : 'bi-circle'"></i>
          </li>
        </ul>
      </div>

      <!-- Free: Freitextfelder -->
      <div v-if="mode==='free'" class="vstack gap-3">
        <div>
          <label class="form-label">Name</label>
          <input v-model.trim="free.name" type="text" class="form-control" placeholder="Venue Name" />
        </div>
        <div>
          <label class="form-label">Adresse</label>
          <input v-model.trim="free.address" type="text" class="form-control" placeholder="Straße Hausnr." />
        </div>
        <div class="row g-3">
          <div class="col-4">
            <label class="form-label">PLZ</label>
            <input v-model.trim="free.zip" type="text" class="form-control" />
          </div>
          <div class="col-8">
            <label class="form-label">Stadt</label>
            <input v-model.trim="free.city" type="text" class="form-control" />
          </div>
        </div>
        <div>
          <label class="form-label">Land</label>
          <input v-model.trim="free.country" type="text" class="form-control" placeholder="z. B. DE oder Deutschland" />
        </div>
        <div>
          <label class="form-label">Hinweis</label>
          <textarea v-model.trim="free.notes" rows="3" class="form-control" placeholder="z. B. Eingang Süd, Parken …"></textarea>
        </div>
      </div>

      <div v-if="err" class="alert alert-danger mt-2">{{ err }}</div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" @click="close">Abbrechen</button>
      <button type="submit" form="__location_form" class="btn btn-primary" :disabled="busy || (mode==='existing' && !selectedLocationId)">
        <span v-if="busy" class="spinner-border spinner-border-sm me-2"></span>Speichern
      </button>
    </template>
  </BizModal>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import BizModal from '~/components/business/workspaces/ui/BizModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  ev: { type: Object, required: true },
  eventId: { type: [Number, String], required: true }
})
const emit = defineEmits(['close','updated'])

const { searchLocations, updateEventLocationExisting, updateEventLocationFree } = useWorkspaceApi()

const busy = ref(false)
const err = ref('')

/** Modus ableiten: wenn ev.location_id vorhanden → existing, sonst free */
const mode = ref(props.ev?.location_id ? 'existing' : 'free')

/** Existing */
const search = ref('')
const results = ref([])
const loading = ref(false)
const selectedLocationId = ref(props.ev?.location_id || null)
let timer = null
function debouncedFetch () {
  if (timer) clearTimeout(timer)
  timer = setTimeout(fetchResults, 250)
}
async function fetchResults () {
  loading.value = true
  try{
    const { data } = await searchLocations(search.value || '')
    results.value = Array.isArray(data) ? data : (data?.items || [])
  } finally {
    loading.value = false
  }
}

/** Free */
const free = reactive({
  name:    props.ev?.location_text_name || props.ev?.location_name || '',
  address: props.ev?.location_text_address || props.ev?.address || '',
  zip:     props.ev?.location_text_zip || props.ev?.postal_code || '',
  city:    props.ev?.location_text_city || props.ev?.city || '',
  country: props.ev?.location_text_country || props.ev?.country || '',
  notes:   props.ev?.location_text_notes || ''
})

watch(() => props.open, v => {
  if (v){
    // State bei jedem Öffnen zurücksetzen
    err.value = ''
    mode.value = props.ev?.location_id ? 'existing' : 'free'
    selectedLocationId.value = props.ev?.location_id || null
    Object.assign(free, {
      name:    props.ev?.location_text_name || props.ev?.location_name || '',
      address: props.ev?.location_text_address || props.ev?.address || '',
      zip:     props.ev?.location_text_zip || props.ev?.postal_code || '',
      city:    props.ev?.location_text_city || props.ev?.city || '',
      country: props.ev?.location_text_country || props.ev?.country || '',
      notes:   props.ev?.location_text_notes || ''
    })
    search.value = ''
    results.value = []
  }
})

function close(){ emit('close') }

/** Robuste Fehlermeldung aus Backend error-shapes extrahieren */
function parseErr(e){
  const raw = e?.data ?? e?.response?.data ?? e
  if (typeof raw === 'string') return raw
  const detail = raw?.detail ?? raw
  if (typeof detail === 'string') return detail
  if (detail?.message) return detail.message
  if (Array.isArray(detail)) {
    return detail[0]?.message || 'Speichern fehlgeschlagen.'
  }
  return 'Speichern fehlgeschlagen.'
}

async function submit(){
  busy.value = true; err.value = ''
  try{
    let res
    if (mode.value === 'existing') {
      if (!selectedLocationId.value) throw new Error('Bitte eine Location auswählen.')
      // setzt location_id und CLEART alle freien Textfelder auf null (siehe Composable)
      res = await updateEventLocationExisting(props.eventId, selectedLocationId.value)
    } else {
      // location_id = null + freie Felder setzen (siehe Composable)
      res = await updateEventLocationFree(props.eventId, { ...free })
    }
    emit('updated', res)
    close()
  }catch(e){
    err.value = parseErr(e)
  }finally{
    busy.value = false
  }
}
</script>
