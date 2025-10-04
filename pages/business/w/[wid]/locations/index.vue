<!-- pages/business/w/[wid]/locations/index.vue -->
 <template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Locations</h4>
      <NuxtLink :to="`/business/w/${wid}/locations/create`" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i> Neue Location
      </NuxtLink>
    </div>

    <div class="input-group mb-2">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input
        class="form-control"
        placeholder="Suche in Name/City"
        v-model="q"
        @keyup.enter="load"
      />
      <button class="btn btn-outline-secondary" @click="load">Suchen</button>
    </div>

    <div class="small text-muted mb-3 d-flex align-items-center">
      <span class="me-2">Treffer: {{ rows.length }}</span>
      <button class="btn btn-sm btn-outline-secondary" @click="load">
        <i class="bi bi-arrow-clockwise me-1"></i> Aktualisieren
      </button>
    </div>

    <!-- Grid mit Karten -->
    <div v-if="loading" class="card p-3 text-muted">Lade Locations…</div>
    <div v-else-if="!rows.length" class="card p-4 text-center text-muted">
      <div class="mb-2"><i class="bi bi-geo-alt fs-3"></i></div>
      <div class="mb-2">Keine Locations gefunden.</div>
      <NuxtLink :to="`/business/w/${wid}/locations/create`" class="btn btn-outline-primary btn-sm">
        <i class="bi bi-plus-lg me-1"></i> Erste Location anlegen
      </NuxtLink>
    </div>
    <div v-else class="row g-3">
      <div class="col-12 col-md-6 col-xl-4" v-for="loc in rows" :key="loc.id">
        <LocationCard
          :loc="loc"
          :wid="wid"
          @deleted="onDeleted(loc.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import LocationCard from '~/components/business/workspaces/locations/LocationCard.vue'

const { wid, listLocations } = useWorkspaceApi()

const q = ref('')
const rows = ref([])
const loading = ref(false)

function extractRows(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.items))   return payload.items
    if (Array.isArray(payload.results)) return payload.results
    if (Array.isArray(payload.data))    return payload.data
    if (Array.isArray(payload.locations))  return payload.locations
  }
  return []
}

async function load () {
  if (!wid.value) return
  loading.value = true
  const { data, error } = await listLocations(q.value)
  if (error) console.error('[Locations] error:', error)
  rows.value = extractRows(data)
  loading.value = false
}

function onDeleted (id) {
  rows.value = rows.value.filter(r => r.id !== id)
}

watch(wid, (v) => { if (v) load() }, { immediate: true })
</script>
