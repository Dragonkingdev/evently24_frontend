<!-- components/business/workspaces/events/TicketsManager.vue -->
<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>Ticketkategorien</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="load">
          <i class="bi bi-arrow-repeat"></i> Laden
        </button>
        <button class="btn btn-sm btn-outline-info" @click="checkReady">
          <i class="bi bi-clipboard-check"></i> Readiness
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="loadSummary">
          <i class="bi bi-card-checklist"></i> Summary
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- EXISTING CATEGORIES -->
      <h6 class="mb-2">Vorhandene Kategorien</h6>
      <div class="table-responsive mb-4">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th style="width:80px">ID</th>
              <th>Name</th>
              <th style="width:140px">Preis</th>
              <th style="width:120px">Stock</th>
              <th style="width:140px">Code</th>
              <th style="width:140px">Verfügbar</th>
              <th style="width:120px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in existing" :key="c.id">
              <td class="text-muted">{{ c.id }}</td>
              <td><input class="form-control" v-model="c._edit.name" /></td>
              <td><input class="form-control" type="number" min="0" step="0.01" v-model.number="c._edit.price" /></td>
              <td><input class="form-control" type="number" min="0" step="1" v-model.number="c._edit.stock" /></td>
              <td><input class="form-control" v-model="c._edit.code" /></td>
              <td>
                <span class="badge bg-light text-dark">
                  {{ Math.max(0, (c._edit.stock ?? 0) - (c.reserved_count||0) - (c.sold_count||0)) }}
                </span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="saveExisting(c)"><i class="bi bi-save"></i></button>
                  <button class="btn btn-sm btn-outline-danger" @click="delExisting(c)"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="!existing.length">
              <td colspan="7" class="text-muted">Keine Kategorien vorhanden.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- NEW CATEGORIES -->
      <div class="d-flex align-items-center justify-content-between">
        <h6 class="mb-2">Neue Kategorien hinzufügen</h6>
        <button class="btn btn-sm btn-outline-primary" @click="addRow">
          <i class="bi bi-plus-lg"></i> Kategorie
        </button>
      </div>

      <div class="table-responsive mb-3">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Name *</th>
              <th style="width:140px">Preis *</th>
              <th style="width:120px">Stock *</th>
              <th style="width:120px">Mint now</th>
              <th style="width:140px">Code</th>
              <th style="width:60px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r,i) in rows" :key="i">
              <td><input class="form-control" v-model="r.name" placeholder="Stehplatz" required/></td>
              <td><input class="form-control" type="number" min="0" step="0.01" v-model.number="r.price" required/></td>
              <td><input class="form-control" type="number" min="0" step="1" v-model.number="r.stock" required/></td>
              <td><input class="form-control" type="number" min="0" step="1" v-model.number="r.mint_now"/></td>
              <td><input class="form-control" v-model="r.code" placeholder="(optional)"/></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" @click="rows.splice(i,1)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!rows.length">
              <td colspan="6" class="text-muted">Noch keine neuen Kategorien vorbereitet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" :disabled="!rows.length" @click="saveNew">
          <i class="bi bi-save me-1"></i> Kategorien hinzufügen
        </button>
        <button class="btn btn-outline-secondary" @click="resetNew">
          <i class="bi bi-x-circle me-1"></i> Zurücksetzen
        </button>
      </div>

      <hr class="my-4"/>

      <!-- Mint / Publish -->
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Mint: Kategorie-ID</label>
          <input class="form-control" v-model.number="mint.category_id" placeholder="z. B. 101"/>
        </div>
        <div class="col-md-4">
          <label class="form-label">Stückzahl</label>
          <input class="form-control" type="number" min="1" v-model.number="mint.quantity" placeholder="z. B. 50"/>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-primary w-100" @click="mintNow">
            <i class="bi bi-coin"></i> Tickets minten
          </button>
        </div>
      </div>

      <div class="mt-4 d-flex gap-2 flex-wrap">
        <button class="btn btn-success" @click="publish">
          <i class="bi bi-megaphone"></i> Event veröffentlichen
        </button>
        <button class="btn btn-outline-info" @click="checkReady">
          <i class="bi bi-clipboard-check"></i> Sale-Readiness prüfen
        </button>
      </div>

      <pre v-if="debug" class="small mt-3 bg-light p-2 border rounded">{{ debug }}</pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  eventId: { type: [Number, String], required: true }
})
const {
  listTicketCategories, patchTicketCategory, deleteTicketCategory,
  addTicketCategories, mintTickets, publishEvent, saleReadiness, ticketsSummary
} = useWorkspaceApi()

// --- EXISTING
const existing = ref([])
function primeEditable(c){
  return {
    ...c,
    _edit: { name: c.name, price: c.price, stock: c.stock, code: c.code }
  }
}
async function load(){
  const { data, error } = await listTicketCategories(props.eventId)
  if (error) return alert('Fehler beim Laden der Kategorien.')
  existing.value = (data || []).map(primeEditable)
}
async function saveExisting(c){
  const payload = {}
  for (const k of ['name','price','stock','code']) {
    if (c._edit[k] !== c[k]) payload[k] = c._edit[k]
  }
  if (!Object.keys(payload).length) return
  const { data, error } = await patchTicketCategory(props.eventId, c.id, payload)
  if (error) return alert('Speichern fehlgeschlagen.')
  Object.assign(c, primeEditable(data))
}
async function delExisting(c){
  if (!confirm(`Kategorie ${c.name} löschen?`)) return
  const { error } = await deleteTicketCategory(props.eventId, c.id)
  if (error) return alert('Löschen fehlgeschlagen.')
  await load()
}

// --- NEW
const rows = ref([])
function addRow(){ rows.value.push({ name:'', price:0, stock:0, mint_now:0, code:null, seat_label_prefix:null }) }
function resetNew(){ rows.value = [] }
async function saveNew(){
  const payload = rows.value.map(r => ({
    name: r.name, price: Number(r.price||0), stock: Number(r.stock||0),
    mint_now: r.mint_now ? Number(r.mint_now) : 0,
    code: r.code || null, seat_label_prefix: r.seat_label_prefix || null
  }))
  const { data, error } = await addTicketCategories(props.eventId, payload)
  if (error) return alert('Fehler beim Hinzufügen.')
  resetNew()
  await load()
  debug.value = { added: data }
}

// --- MINT / PUBLISH / READINESS / SUMMARY
const debug = ref(null)
const mint = reactive({ category_id: null, quantity: 1 })

async function mintNow(){
  if (!mint.category_id || !mint.quantity) return
  const { data, error } = await mintTickets(props.eventId, {
    category_id: mint.category_id, quantity: mint.quantity
  })
  if (error) return alert('Minting fehlgeschlagen.')
  debug.value = { mint: data }
}
async function publish(){
  const { data, error } = await publishEvent(props.eventId)
  if (error) return alert('Publish fehlgeschlagen.')
  debug.value = { publish: data ?? 'OK' }
}
async function checkReady(){
  const { data, error } = await saleReadiness(props.eventId)
  if (error) return alert('Prüfung fehlgeschlagen.')
  debug.value = { sale_readiness: data ?? 'OK' }
}
async function loadSummary(){
  const { data, error } = await ticketsSummary(props.eventId)
  if (error) return alert('Summary fehlgeschlagen.')
  debug.value = { summary: data }
}

onMounted(load)
</script>
