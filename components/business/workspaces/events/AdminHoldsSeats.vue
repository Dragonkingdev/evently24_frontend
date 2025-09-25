<!-- pages/business/w/[wid]/events/AdminHoldsSeats.vue -->
<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>Sitzplatz Holds (ohne Zahlung)</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="checkStatus">
          <i class="bi bi-search"></i> Status prüfen
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="alert alert-warning" v-if="!seatmapId">
        <i class="bi bi-exclamation-triangle"></i>
        Dieses Event hat keine Seatmap-ID. Für Sitzplatz-Holds wird eine Seatmap benötigt.
      </div>

      <!-- Create Seat Hold -->
      <h6 class="mb-2">Hold anlegen</h6>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Kategorie-ID *</label>
          <input class="form-control" v-model.number="form.category_id" placeholder="z. B. 101"/>
        </div>
        <div class="col-md-4">
          <label class="form-label">TTL (Tage)</label>
          <input class="form-control" type="number" min="1" max="365" v-model.number="form.ttl_days" />
        </div>
        <div class="col-md-12">
          <label class="form-label">Seat-Labels (je Zeile)</label>
          <textarea class="form-control" rows="5" v-model="form.labelsText" placeholder="A-1\nA-2\nA-3"></textarea>
          <div class="form-text">Die Sitze müssen zur angegebenen Kategorie gehören.</div>
        </div>
        <div class="col-md-12">
          <button class="btn btn-outline-primary" @click="createHold">
            <i class="bi bi-shield-lock"></i> Hold erstellen
          </button>
        </div>
      </div>

      <hr class="my-4"/>

      <!-- Release / Issue -->
      <h6 class="mb-2">Hold verwalten</h6>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Cart/Hold ID</label>
          <input class="form-control" v-model.number="hold.cart_id" placeholder="z. B. 1234" />
        </div>
        <div class="col-md-8">
          <label class="form-label">Sitze zum Freigeben (optional, je Zeile)</label>
          <textarea class="form-control" rows="4" v-model="hold.releaseText" placeholder="A-1&#10;A-2"></textarea>
        </div>
        <div class="col-12 d-flex gap-2">
          <button class="btn btn-outline-danger flex-fill" @click="releaseSeats">
            <i class="bi bi-unlock"></i> Markierte/alle Sitze freigeben
          </button>
          <button class="btn btn-outline-success flex-fill" @click="issueSeats">
            <i class="bi bi-gift"></i> Tickets ausstellen (gratis)
          </button>
        </div>
      </div>

      <hr class="my-4"/>

      <!-- Status Check -->
      <h6 class="mb-2">Sitz-Status prüfen</h6>
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Seat-Labels (je Zeile)</label>
          <textarea class="form-control" rows="4" v-model="status.labelsText" placeholder="A-1&#10;A-2"></textarea>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="checkStatus">
            <i class="bi bi-search"></i> Status abrufen
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
const {
  adminSeatsStatus, adminCreateSeatHold, adminReleaseSeatHold, adminIssueFromSeatHold
} = useWorkspaceApi()

const form = reactive({
  category_id: null,
  ttl_days: 30,
  labelsText: ''
})
const hold = reactive({
  cart_id: null,
  releaseText: ''
})
const status = reactive({
  labelsText: ''
})
const debug = ref(null)

function parseLabels(txt){
  return (txt || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
}

async function createHold(){
  const seat_labels = parseLabels(form.labelsText)
  if (!seat_labels.length) return alert('Keine Seat-Labels angegeben.')
  if (!form.category_id) return alert('Kategorie-ID fehlt.')
  const body = {
    event_id: Number(props.eventId),
    items: [{ category_id: Number(form.category_id), seat_labels }],
    ttl_days: Number(form.ttl_days || 30)
  }
  const { data, error } = await adminCreateSeatHold(props.eventId, body)
  if (error) return alert('Seat-Hold konnte nicht erstellt werden.')
  debug.value = { seat_hold_created: data }
  hold.cart_id = data?.cart_id ?? null
}

async function releaseSeats(){
  if (!hold.cart_id) return alert('Cart/Hold ID fehlt.')
  const labels = parseLabels(hold.releaseText)
  const body = { cart_id: Number(hold.cart_id), seat_labels: labels.length ? labels : null }
  const { data, error } = await adminReleaseSeatHold(props.eventId, Number(hold.cart_id), body)
  if (error) return alert('Freigabe fehlgeschlagen.')
  debug.value = { seat_hold_released: data }
}

async function issueSeats(){
  if (!hold.cart_id) return alert('Cart/Hold ID fehlt.')
  const { data, error } = await adminIssueFromSeatHold(props.eventId, Number(hold.cart_id), { note: 'Comp seats via backoffice' })
  if (error) return alert('Ausstellen fehlgeschlagen.')
  debug.value = { seat_hold_issued: data }
}

async function checkStatus(){
  const labels = parseLabels(status.labelsText || form.labelsText)
  if (!labels.length) return alert('Keine Seat-Labels zum Prüfen.')
  const { data, error } = await adminSeatsStatus(props.eventId, labels)
  if (error) return alert('Status-Prüfung fehlgeschlagen.')
  debug.value = { seats_status: data }
}
</script>
