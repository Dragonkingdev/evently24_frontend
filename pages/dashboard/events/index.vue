<!-- pages/dashboard/events/index.vue -->
<template>
  <div class="page-header d-flex justify-content-between align-items-center mb-3">
    <h5 class="m-0">Deine Events</h5>
    <NuxtLink to="/dashboard/events/new" class="btn btn-primary btn-sm">
      <i class="bi bi-plus"></i> Event hinzufügen
    </NuxtLink>
  </div>

  <div v-if="pending" class="text-muted">Lade…</div>
  <div v-else-if="error" class="alert alert-danger">Konnte Events nicht laden.</div>

  <div v-else>
    <div class="card border-0 shadow-sm">
      <div class="list-group list-group-flush">
        <div
          v-for="ev in eventsSorted"
          :key="ev.id"
          class="list-group-item d-flex align-items-center justify-content-between gap-3"
        >
          <div class="d-flex align-items-center gap-3">
            <img
              :src="ev.poster || ev.image || ev.tourPoster"
              class="rounded"
              style="width:60px;height:60px;object-fit:cover"
              :alt="ev.tourTitle || ev.city || ev.venue || 'Event'"
            >
            <div>
              <div class="fw-semibold">
                {{ ev.city || '—' }} — {{ formatDate(ev.date) }}
              </div>
              <div class="small text-muted">
                {{ ev.venue || 'Unbekannter Club' }}
                <span v-if="ev.tourTitle">
                  • <NuxtLink :to="`/dashboard/tours/${ev.tourSlug || ev.tour_id}`">{{ ev.tourTitle }}</NuxtLink>
                </span>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="`/dashboard/events/${ev.slug || ev.id}`"
            class="btn btn-outline-secondary btn-sm"
          >
            Bearbeiten
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="!eventsSorted.length" class="text-muted small mt-3">
      Noch keine Events.
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })

import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'

const api = useApi()

// Erwartet: GET /dashboard/events -> Array von Events
// { id, city, date, venue, tour_id, tourTitle?, tourSlug?, tourPoster? }
const { data, pending, error } = await useAsyncData('events', () =>
  api.get('/dashboard/events').then(r => r.data)
)

const events = computed(() => Array.isArray(data.value) ? data.value : [])

// Aufsteigend nach Datum; ungültige Dates nach hinten
const eventsSorted = computed(() => {
  return [...events.value].sort((a, b) => {
    const da = new Date(a?.date || 0).getTime()
    const db = new Date(b?.date || 0).getTime()
    if (isNaN(da) && isNaN(db)) return 0
    if (isNaN(da)) return 1
    if (isNaN(db)) return -1
    return da - db
  })
})

const formatDate = (d) => {
  const dt = new Date(d)
  if (isNaN(dt)) return 'Datum unbekannt'
  return dt.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.page-header {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: .75rem 1rem;
}
</style>
