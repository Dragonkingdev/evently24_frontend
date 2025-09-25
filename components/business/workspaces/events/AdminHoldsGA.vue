<!-- pages/business/w/[wid]/events/AdminHoldsGA.vue -->
<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>GA Holds (ohne Zahlung)</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="loadCats">
          <i class="bi bi-arrow-repeat"></i> Kategorien laden
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Create Hold -->
      <h6 class="mb-2">Hold anlegen</h6>
      <div class="alert alert-info small">
        Du reservierst Kontingente je Kategorie für einen Zeitraum (z. B. 30 Tage) – ohne Checkout.
      </div>

      <div class="table-responsive mb-3">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th style="width:90px">Cat.ID</th>
              <th>Kategorie</th>
              <th style="width:120px">Verfügbar</th>
              <th style="width:140px">Hold (Qty)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td class="text-muted">{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>
                <span class="badge bg-light text-dark">
                  {{ Math.max(0, (c.stock||0) - (c.sold_count||0) - (c.reserved_count||0)) }}
                </span>
              </td>
              <td>
                <input class="form-control" type="number" min="0" step="1" v-model.number="c._holdQty" />
              </td>
            </tr>
            <tr v-if="!categories.length">
              <td colspan="4" class="text-muted">Keine Kategorien gefunden.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row g-2 align-items-end">
        <div class="col-md-3">
          <label class="form-label">TTL (Tage)</label>
          <input class="form-control" type="number" min="1" max="365" v-model.number="ttlDays" />
        </div>
        <div class="col-md-9">
          <button class="btn btn-outline-primary w-100" @click="createHold">
            <i class="bi bi-shield-lock"></i> Hold erstellen
          </button>
        </div>
      </div>

      <hr class="my-4" />

      <!-- Release / Issue -->
      <h6 class="mb-2">Hold verwalten</h6>
      <div class="row g-2 align-items-end">
        <div class="col-md-6">
          <label class="form-label">Cart/Hold ID</label>
          <input class="form-control" v-model.number="hold.cart_id" placeholder="z. B. 1234" />
        </div>
        <div class="col-md-6 d-flex gap-2">
          <button class="btn btn-outline-danger flex-fill" @click="releaseAll">
            <i class="bi bi-unlock"></i> Hold freigeben (alle)
          </button>
          <button class="btn btn-outline-success flex-fill" @click="issue">
            <i class="bi bi-gift"></i> Tickets ausstellen (gratis)
          </button>
        </div>
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
  listTicketCategories, adminCreateGAHold, adminReleaseHold, adminIssueFromGAHold
} = useWorkspaceApi()

const categories = ref([])
const ttlDays = ref(30)
const hold = reactive({ cart_id: null })
const debug = ref(null)

function prime(c){
  return { ...c, _holdQty: 0 }
}
async function loadCats(){
  const { data, error } = await listTicketCategories(props.eventId)
  if (error) return alert('Fehler beim Laden der Kategorien.')
  categories.value = (data || []).map(prime)
}
onMounted(loadCats)

async function createHold(){
  const items = categories.value
    .filter(c => Number(c._holdQty) > 0)
    .map(c => ({ category_id: c.id, qty: Number(c._holdQty) }))
  if (!items.length) return alert('Keine Mengen eingetragen.')
  const body = { event_id: Number(props.eventId), items, ttl_days: Number(ttlDays.value || 30) }
  const { data, error } = await adminCreateGAHold(props.eventId, body)
  if (error) return alert('Hold konnte nicht erstellt werden.')
  debug.value = { hold_created: data }
  hold.cart_id = data?.cart_id ?? null
}

async function releaseAll(){
  if (!hold.cart_id) return alert('Cart/Hold ID fehlt.')
  const { error } = await adminReleaseHold(props.eventId, Number(hold.cart_id))
  if (error) return alert('Hold freigeben fehlgeschlagen.')
  debug.value = { hold_released: Number(hold.cart_id) }
}

async function issue(){
  if (!hold.cart_id) return alert('Cart/Hold ID fehlt.')
  const { data, error } = await adminIssueFromGAHold(props.eventId, Number(hold.cart_id), { note: 'Comp via backoffice' })
  if (error) return alert('Ausstellen fehlgeschlagen.')
  debug.value = { issued: data }
}
</script>
