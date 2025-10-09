<!-- components/business/workspaces/events/SeatmapManager.vue -->
<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>Reserved Seating · Zuweisungen</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="load" :title="t.load">
          <i class="bi bi-arrow-repeat"></i> Laden
        </button>
        <button class="btn btn-sm btn-outline-primary" @click="save" :title="t.save">
          <i class="bi bi-save"></i> Speichern
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="alert alert-warning d-flex gap-2 align-items-start" v-if="!seatmapId">
        <i class="bi bi-exclamation-triangle mt-1"></i>
        <div>Für Seating brauchst du eine <strong>Seatmap ID</strong> am Event.</div>
      </div>

      <div class="alert alert-light border small d-flex gap-2 align-items-start">
        <i class="bi bi-info-circle mt-1"></i>
        <div>
          <strong>Zuweisungen (Kategorie → Sitz-Labels)</strong><br>
          Lege fest, welche Sitze zu welcher Kategorie gehören.
          Beim „Tickets erzeugen“ werden für diese Sitzlabels konkrete Tickets erstellt (Status: noch nicht verkauft).
        </div>
      </div>

      <p class="small text-muted mb-1">
        JSON-Struktur:
        <code>{ "&lt;category_id&gt;": ["A-1","A-2", ...] }</code>
      </p>

      <textarea class="form-control" rows="8" v-model="jsonText"></textarea>

      <div class="mt-3 d-flex gap-2 flex-wrap">
        <button class="btn btn-outline-primary" @click="mint" :disabled="!seatmapId" :title="t.generateFromAssignments">
          <i class="bi bi-coin"></i> Tickets aus Zuweisungen erzeugen
        </button>
        <button class="btn btn-success" @click="publishReserved" :title="t.publishReserved">
          <i class="bi bi-megaphone"></i> Reserved-Seating Event veröffentlichen
        </button>
        <NuxtLink
          class="btn btn-outline-secondary"
          :to="`/business/w/${wid}/events/${eventId}/seatmap-builder`">
          <i class="bi bi-vector-pen"></i> Seatmap Builder öffnen
        </NuxtLink>
      </div>

      <div class="alert alert-light border small mt-3">
        <i class="bi bi-lightbulb"></i>
        <strong>Admin-Holds:</strong> Du kannst einzelne Sitze befristet reservieren (ohne Zahlung),
        z.&nbsp;B. für Partner oder Presse. Das geht in deiner Sitzplatz-Hold-Verwaltung.
      </div>

      <hr class="my-4"/>

      <h6 class="mb-2">Auto-Assign (Zonen → Kategorien)</h6>
      <p class="small text-muted">
        Weist Sitze automatisch zu: ordnet alle Sitze einer Zone der gewünschten Kategorie zu.
        Optional kannst du pro Zone Reihen einschränken.
      </p>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Mapping (zone_key → category_id)</label>
          <textarea class="form-control" rows="5" v-model="autoAssign.mappingText"
            placeholder='{"FLOOR":101,"BALCONY":102}'></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Rows (optional) pro Zone</label>
          <textarea class="form-control" rows="5" v-model="autoAssign.rowsText"
            placeholder='{"FLOOR":["A","B"],"BALCONY":["1","2"]}'></textarea>
        </div>
        <div class="col-12 d-flex align-items-center gap-3">
          <div class="form-check">
            <input id="aa-replace" class="form-check-input" type="checkbox" v-model="autoAssign.replace">
            <label for="aa-replace" class="form-check-label">Vorherige Zuweisungen überschreiben</label>
          </div>
          <button class="btn btn-outline-secondary" @click="doAutoAssign" :title="t.autoAssign">
            <i class="bi bi-magic"></i> Auto-Assign ausführen
          </button>
        </div>
      </div>

      <pre v-if="debug" class="small mt-3 bg-light p-2 border rounded">{{ debug }}</pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  eventId: { type: [Number, String], required: true },
  seatmapId: { type: [Number, String, null], default: null }
})

const route = useRoute()
const wid = Number(route.params.wid)

const {
  getSeatingAssignments, setSeatingAssignments,
  mintFromAssignments, publishReservedEvent, seatingAutoAssign
} = useWorkspaceApi()

const t = {
  load: 'Aktuelle Zuweisungen laden',
  save: 'Zuweisungen speichern',
  generateFromAssignments: 'Erzeugt konkrete Tickets für alle zugewiesenen Sitzlabels',
  publishReserved: 'Event mit Sitzplatzverkauf veröffentlichen',
  autoAssign: 'Zonen schnell Kategorien zuweisen (optional mit Reihenfilter)'
}

const jsonText = ref('{\n  "101": ["A-1","A-2"],\n  "102": ["B-1"]\n}')
const debug = ref(null)

async function load(){
  const { data, error } = await getSeatingAssignments(props.eventId)
  if (error) return alert('Fehler beim Laden.')
  const assignments = data?.assignments || {}
  jsonText.value = JSON.stringify(assignments, null, 2)
  debug.value = { assignments }
}
async function save(){
  let assignments = {}
  try { assignments = JSON.parse(jsonText.value || '{}') }
  catch { return alert('Ungültiges JSON in Assignments.') }
  const { data, error } = await setSeatingAssignments(props.eventId, { assignments })
  if (error) return alert('Fehler beim Speichern.')
  debug.value = { saved: data }
}
async function mint(){
  const { data, error } = await mintFromAssignments(props.eventId)
  if (error) return alert('Erzeugen fehlgeschlagen.')
  debug.value = { erzeugt: data }
}
async function publishReserved(){
  const { data, error } = await publishReservedEvent(props.eventId)
  if (error) return alert('Publish fehlgeschlagen.')
  debug.value = { publish_reserved: data ?? 'OK' }
}

// Auto-Assign
const autoAssign = reactive({
  mappingText: '{\n  "FLOOR": 101\n}',
  rowsText: '',
  replace: false
})
async function doAutoAssign(){
  let mapping = {}, rows = undefined
  try { mapping = JSON.parse(autoAssign.mappingText || '{}') } catch { return alert('Mapping JSON ungültig') }
  if (autoAssign.rowsText && autoAssign.rowsText.trim()){
    try { rows = JSON.parse(autoAssign.rowsText) } catch { return alert('Rows JSON ungültig') }
  }
  const { data, error } = await seatingAutoAssign(props.eventId, { mapping, rows, replace: !!autoAssign.replace })
  if (error) return alert('Auto-Assign fehlgeschlagen.')
  debug.value = { auto_assign: data ?? 'OK' }
  await load()
}

onMounted(load)
</script>
