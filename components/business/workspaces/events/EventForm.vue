<!-- components/business/workspaces/events/EventForm.vue -->
<template>
  <form @submit.prevent="$emit('submit', serialize())" class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <strong>{{ edit ? 'Event bearbeiten' : 'Neues Event' }}</strong>
      <span v-if="edit" class="small text-muted">ID: {{ modelValue?.id }} · Status: {{ modelValue?.status }}</span>
    </div>

    <div class="card-body row g-3">
      <!-- Basis -->
      <div class="col-md-8">
        <label class="form-label">Titel *</label>
        <input class="form-control" v-model="form.title" required />
      </div>
      <div class="col-md-4">
        <label class="form-label">Kategorie</label>
        <input class="form-control" v-model="form.category" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Datum & Uhrzeit *</label>
        <input type="datetime-local" class="form-control" v-model="localDate" required />
      </div>
      <div class="col-md-3">
        <label class="form-label">Stadt</label>
        <input class="form-control" v-model="form.city" />
      </div>
      <div class="col-md-3">
        <label class="form-label">Veranstaltungsort</label>
        <input class="form-control" v-model="form.venue" />
      </div>

      <!-- Listing-Modus -->
      <div class="col-md-4">
        <label class="form-label">Listing-Modus</label>
        <select class="form-select" v-model="form.listing_mode">
          <option value="internal">Intern (Ticketsystem)</option>
          <option value="external">Extern (Ticket-URL)</option>
        </select>
      </div>

      <!-- Extern: Nur Ticket-URL -->
      <template v-if="form.listing_mode === 'external'">
        <div class="col-md-8">
          <label class="form-label">Ticket-Verkaufslink *</label>
          <input class="form-control" v-model="form.external_ticket_url" placeholder="https://…" />
        </div>
      </template>

      <!-- Intern: Ticket-System -->
      <template v-else>
        <div class="col-12">
          <div class="d-flex align-items-center gap-2 mb-2">
            <label class="form-label mb-0">Ticket-System *</label>
            <span v-if="isTicketModeLocked" class="badge bg-secondary">fixiert</span>
          </div>

          <div class="row g-3">
            <!-- GA Card -->
            <div class="col-md-6">
              <div
                class="ticket-card h-100"
                :class="[{ active: ticketMode==='ga', locked: isTicketModeLocked && ticketMode!=='ga' }]"
                @click="!isTicketModeLocked && (ticketMode='ga')"
              >
                <i class="bi bi-tags-fill fs-4 me-2"></i>
                <div>
                  <div class="fw-semibold">Ticket-Kontingente (General Admission)</div>
                  <div class="small text-muted">Preis-Kategorien mit Stückzahlen • Keine Sitzplatzplanung</div>
                </div>
              </div>
            </div>

            <!-- Reserved Card -->
            <div class="col-md-6">
              <div
                class="ticket-card h-100"
                :class="[{ active: ticketMode==='reserved', locked: isTicketModeLocked && ticketMode!=='reserved' }]"
                @click="!isTicketModeLocked && (ticketMode='reserved')"
              >
                <i class="bi bi-grid-3x3-gap-fill fs-4 me-2"></i>
                <div>
                  <div class="fw-semibold">Sitzplätze (Seatmap)</div>
                  <div class="small text-muted">Verkauf über Sitzplan • Seatmap wird separat erstellt/zugewiesen</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-text mt-1" v-if="isTicketModeLocked">
            Die Wahl des Ticket-Systems ist nach Anlage des Events nicht mehr änderbar.
          </div>
        </div>

        <!-- Seatmap-ID nur anzeigen, wenn vorhanden UND Modus reserved -->
        <div class="col-md-4" v-if="ticketMode==='reserved' && !!form.seatmap_id">
          <label class="form-label">Seatmap ID</label>
          <input class="form-control" v-model.number="form.seatmap_id" disabled />
          <div class="form-text">Seatmap bereits verknüpft (Bearbeitung über Seatmap-Verwaltung).</div>
        </div>
      </template>

      <!-- Optional-IDs -->
      <div class="col-md-4">
        <label class="form-label">Location ID (optional)</label>
        <input class="form-control" v-model.number="form.location_id" />
      </div>

      <div class="col-md-4">
        <label class="form-label">Serien-ID (optional)</label>
        <input class="form-control" v-model.number="form.series_id" />
      </div>
    </div>

    <div class="card-footer d-flex gap-2">
      <button v-if="!edit" class="btn btn-primary" type="submit">
        <i class="bi bi-save me-1"></i> Anlegen
      </button>
      <button v-else class="btn btn-primary" type="submit">
        <i class="bi bi-save me-1"></i> Speichern
      </button>
      <slot name="extra"></slot>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  edit: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])

const form = reactive({
  title: props.modelValue?.title || '',
  category: props.modelValue?.category || '',
  listing_mode: props.modelValue?.listing_mode || 'internal',
  external_ticket_url: props.modelValue?.external_ticket_url || '',
  city: props.modelValue?.city || '',
  venue: props.modelValue?.venue || '',
  location_id: props.modelValue?.location_id ?? null,
  seatmap_id: props.modelValue?.seatmap_id ?? null,
  series_id: props.modelValue?.series_id ?? null,
  date: props.modelValue?.date || ''
})

const localDate = ref('')
onMounted(() => {
  if (form.date) {
    const d = new Date(form.date)
    if (!isNaN(d)) {
      const pad = n => String(n).padStart(2,'0')
      localDate.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
  }
})

const initialMode =
  (props.modelValue?.ticket_sale_mode
    ? String(props.modelValue.ticket_sale_mode).toLowerCase()
    : (props.modelValue?.seatmap_id ? 'reserved' : 'ga'))

const ticketMode = ref(initialMode === 'reserved' ? 'reserved' : 'ga')

const isTicketModeLocked = computed(() => {
  if (!props.edit) return false
  const hasTsm = !!props.modelValue?.ticket_sale_mode
  const hasSeatmap = !!props.modelValue?.seatmap_id
  return hasTsm || hasSeatmap
})

watch(() => form.listing_mode, (m) => {
  if (m === 'internal') {
    form.external_ticket_url = ''
  }
})

function normalize(body){
  const b = { ...body }
  if (localDate.value) {
    const d = new Date(localDate.value)
    b.date = isNaN(d) ? null : d.toISOString()
  }
  for (const k of ['external_ticket_url','category','city','venue']) {
    if (!b[k]) b[k] = null
  }
  for (const k of ['location_id','seatmap_id','series_id']) {
    const v = b[k]
    if (!Number.isFinite(v) || v <= 0) b[k] = null
  }
  if (b.listing_mode !== 'external') {
    b.external_ticket_url = null
  }
  if (b.listing_mode === 'internal') {
    if (!isTicketModeLocked.value) {
      if (ticketMode.value === 'ga') {
        b.seatmap_id = null
      }
    }
  } else {
    b.seatmap_id = null
  }
  return b
}

function serialize(){
  const full = normalize(form)
  if (!props.edit) {
    return full
  }
  const base = normalize(props.modelValue || {})
  const patch = {}
  for (const k of Object.keys(full)) {
    const a = full[k]
    const b = base[k]
    if (k === 'date' && a && b) {
      const ai = new Date(a).toISOString()
      const bi = new Date(b).toISOString()
      if (ai !== bi) patch[k] = a
    } else if (a !== b) {
      patch[k] = a
    }
  }
  return patch
}
</script>

<style scoped>
.ticket-card {
  border: 1px solid #e9ecef;
  border-radius: .75rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  cursor: pointer;
  transition: all .15s ease-in-out;
  background: #fff;
}
.ticket-card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,.06);
}
.ticket-card.active {
  border-color: #0d6efd;
  box-shadow: 0 6px 18px rgba(13,110,253,.12);
}
.ticket-card.locked {
  opacity: .5;
  cursor: not-allowed;
}
</style>
