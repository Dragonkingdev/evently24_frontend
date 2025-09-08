<!-- pages/dashboard/events/[id].vue -->
<template>
  <div class="page-header d-flex justify-content-between align-items-center mb-3">
    <h5 class="m-0">Event bearbeiten</h5>
    <div class="d-flex gap-2">
      <NuxtLink to="/dashboard/events" class="btn btn-outline-secondary btn-sm">Zurück</NuxtLink>
      <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveAll">
        <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : 'bi-check2'"></i>
        Speichern
      </button>
    </div>
  </div>

  <div v-if="pending" class="text-muted">Lade…</div>
  <div v-else-if="error" class="alert alert-danger">Konnte Event nicht laden.</div>

  <div v-else class="d-flex flex-column gap-3">
    <!-- Stammdaten kompakt -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="card-title mb-3">Stammdaten</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Titel</label>
            <input v-model.trim="form.title" type="text" class="form-control" placeholder="Event-Titel">
          </div>
          <div class="col-md-3">
            <label class="form-label">Datum & Zeit</label>
            <input v-model="form.date" type="datetime-local" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="form-label">Stadt</label>
            <input v-model.trim="form.city" type="text" class="form-control" placeholder="z. B. Berlin">
          </div>
          <div class="col-md-6">
            <label class="form-label">Venue</label>
            <input v-model.trim="form.venue" type="text" class="form-control" placeholder="z. B. Columbiahalle">
          </div>
          <div class="col-md-3">
            <label class="form-label">Tour</label>
            <select v-model.number="form.tour_id" class="form-select">
              <option v-for="t in tours" :key="t.id" :value="t.id">{{ t.title }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Location (optional)</label>
            <input v-model.number="form.location_id" type="number" class="form-control" placeholder="Location-ID">
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <button :class="btnStep(1)" @click="step=1"><span class="badge bg-secondary me-2">1</span> Sitzplan erstellen</button>
          <button :class="btnStep(2)" @click="step=2" :disabled="!seating.blocks.length"><span class="badge bg-secondary me-2">2</span> Ticketkategorien</button>
          <button :class="btnStep(3)" @click="step=3" :disabled="!seating.blocks.length || !tickets.length"><span class="badge bg-secondary me-2">3</span> Plätze zuweisen</button>
        </div>

        <div v-if="step===1">
          <SeatingBuilder v-model="seating" mode="layout" />
        </div>

        <div v-else-if="step===2">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="m-0">Ticketkategorien</h6>
            <button class="btn btn-sm btn-outline-primary" @click="tickets.push({ name:'Kategorie', price:0, currency:'EUR', quota:null, desc:'' })">
              <i class="bi bi-plus"></i> Kategorie
            </button>
          </div>
          <TicketCategoriesEditor v-model="tickets" />
          <div class="text-end">
            <button class="btn btn-primary" :disabled="!tickets.length" @click="step=3">Weiter zu Zuweisung</button>
          </div>
        </div>

        <div v-else-if="step===3">
          <SeatingBuilder v-model="seating" mode="assign" :categories="tickets" />
          <div class="text-end mt-2">
            <button class="btn btn-outline-secondary me-2" @click="step=2">Zurück</button>
            <button class="btn btn-primary" @click="saveAll">Speichern</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })

import { ref, computed, watchEffect } from 'vue'
import { useRoute, useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'
import TicketCategoriesEditor from '~/components/dashboard/events/TicketCategoriesEditor.vue'
import SeatingBuilder from '~/components/dashboard/events/SeatingBuilder.vue'

const route = useRoute()
const api = useApi()
const id = Number(route.params.id)

const saving = ref(false)
const step = ref(1)

const btnStep = (n) => `btn btn-sm ${step.value===n?'btn-primary':'btn-outline-secondary'}`

// Load
const { data: eventData, pending, error, refresh } = await useAsyncData(
  () => `event-${id}`,
  () => api.get(`/dashboard/events/${id}`).then(r => r.data)
)
const { data: toursData } = await useAsyncData('tours-lite', () =>
  api.get('/dashboard/tours').then(r => r.data)
)
const tours = computed(() => Array.isArray(toursData.value) ? toursData.value : [])

// State
const form = ref({ title:'', date:'', venue:'', city:'', tour_id:null, location_id:null })
const tickets = ref([])
const seating = ref({
  stage: { x: 50, y: 10, w: 200, h: 40, label: 'Bühne', visible: true },
  exits: [],
  blocks: [],
  tables: [],
  paths: [],
  assignments: {}
})

// Init
const seatingInitialized = ref(false)
watchEffect(() => {
  const ev = eventData.value
  if (!ev) return

  // Stammdaten
  form.value = {
    title: ev.title ?? '',
    date: ev.date ? toLocal(ev.date) : '',
    venue: ev.venue ?? '',
    city: ev.city ?? '',
    tour_id: ev.tour_id ?? tours.value[0]?.id ?? null,
    location_id: ev.location_id ?? null
  }

  // Sitzplan **nur einmal** aus dem Backend initialisieren (kein Überschreiben bei späteren Re-Runs)
  if (!seatingInitialized.value) {
    seating.value = ev.seating
      ? { stage: seating.value.stage, exits: [], blocks: [], tables: [], paths: [], assignments: {}, ...JSON.parse(JSON.stringify(ev.seating)) }
      : seating.value
    // Default-Felder sicherstellen
    seating.value.tables = Array.isArray(seating.value.tables) ? seating.value.tables : []
    seating.value.paths  = Array.isArray(seating.value.paths)  ? seating.value.paths  : []
    seating.value.assignments = seating.value.assignments && typeof seating.value.assignments==='object' ? seating.value.assignments : {}
    seatingInitialized.value = true
  }

  // Tickets
  tickets.value = Array.isArray(ev.ticketCategories) ? JSON.parse(JSON.stringify(ev.ticketCategories)) : []
})

function toLocal(iso) {
  const d = new Date(iso); if (isNaN(d)) return ''
  const pad = (n) => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const payloadEvent = computed(() => ({
  title: form.value.title?.trim(),
  date: form.value.date ? new Date(form.value.date).toISOString() : null,
  venue: form.value.venue?.trim() || null,
  city: form.value.city?.trim() || null,
  tour_id: form.value.tour_id ?? null,
  location_id: form.value.location_id ?? null
}))

async function saveAll() {
  if (!payloadEvent.value.title) return alert('Titel ist erforderlich.')
  if (!payloadEvent.value.date) return alert('Datum/Zeit ist erforderlich.')
  if (!payloadEvent.value.tour_id) return alert('Tour auswählen.')

  try {
    saving.value = true
    await api.put(`/dashboard/events/${id}`, payloadEvent.value)

    // Sitzplan/Config
    await api.put(`/dashboard/events/${id}/config`, {
      seatingMode: 'RESERVED',
      seating: seating.value
    })

    // Tickets
    if (tickets.value.length) {
      await api.post(`/dashboard/events/${id}/tickets/bulk`, {
        items: tickets.value.map(t => ({
          id: t.id,
          name: t.name,
          price: Number(t.price),
          currency: t.currency || 'EUR',
          quota: t.quota ?? null,
          desc: t.desc || null
        }))
      })
    }

    await refresh()
  } catch (e) {
    console.error(e)
    alert('Speichern fehlgeschlagen.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header { background:#fff; border:1px solid #e5e7eb; border-radius:.5rem; padding:.75rem 1rem; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
</style>
