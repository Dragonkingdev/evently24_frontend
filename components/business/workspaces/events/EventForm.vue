<!-- components/business/workspaces/events/EventForm.vue -->
<template>
  <form @submit.prevent="$emit('submit', serialize())" class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <strong>{{ edit ? 'Event bearbeiten' : 'Neues Event' }}</strong>
      <span v-if="edit" class="small text-muted">ID: {{ modelValue?.id }} · Status: {{ modelValue?.status }}</span>
    </div>

    <div class="card-body row g-3">
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
        <label class="form-label">City</label>
        <input class="form-control" v-model="form.city" />
      </div>
      <div class="col-md-3">
        <label class="form-label">Venue</label>
        <input class="form-control" v-model="form.venue" />
      </div>

      <div class="col-md-4">
        <label class="form-label">Listing</label>
        <select class="form-select" v-model="form.listing_mode">
          <option value="internal">internal</option>
          <option value="external">external</option>
        </select>
      </div>
      <div class="col-md-8">
        <label class="form-label">Externe Ticket-URL (optional)</label>
        <input class="form-control" v-model="form.external_ticket_url" />
      </div>

      <div class="col-md-4">
        <label class="form-label">Location ID (optional)</label>
        <input class="form-control" v-model.number="form.location_id" />
      </div>
      <div class="col-md-4">
        <label class="form-label">Seatmap ID (optional)</label>
        <input class="form-control" v-model.number="form.seatmap_id" />
      </div>
      <div class="col-md-4">
        <label class="form-label">Series ID (optional)</label>
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

function normalize(body){
  const b = { ...body }
  // datetime-local -> ISO
  if (localDate.value) {
    const d = new Date(localDate.value)
    b.date = d.toISOString()
  }
  // Leere Strings zu null wo sinnvoll
  for (const k of ['external_ticket_url','category','city','venue']) {
    if (!b[k]) b[k] = null
  }
    for (const k of ['location_id','seatmap_id','series_id']) {
        const v = b[k]
        if (!Number.isFinite(v) || v <= 0) b[k] = null
    }
  return b
}

function serialize(){
  const full = normalize(form)
  if (!props.edit) {
    // CREATE: voller Body
    return full
  }
  // PATCH: nur Änderungen gegenüber modelValue senden
  const base = normalize(props.modelValue || {})
  const patch = {}
  for (const k of Object.keys(full)) {
    const a = full[k]
    const b = base[k]
    // Date-Vergleich robust (beide zu ISO)
    if (k === 'date' && a && b) {
      const ai = new Date(a).toISOString()
      const bi = new Date(b).toISOString()
      if (ai !== bi) patch[k] = a
    } else if (a !== b) {
      patch[k] = a
    }
  }
  // falls nichts geändert, trotzdem leeres Objekt zurück (Aufrufer kann No-Op handeln)
  return patch
}
</script>
