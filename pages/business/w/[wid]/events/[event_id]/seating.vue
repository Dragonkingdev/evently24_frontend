<!-- pages/business/w/[wid]/events/[event_id]/seating.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Reserved Seating</h4>
      <div class="btn-group">
        <NuxtLink :to="`/business/w/${wid}/events/${eventId}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Details
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="card p-3 text-muted">Lädt…</div>
    <div v-else>
      <SeatmapManager :event-id="eventId" :seatmap-id="event?.seatmap_id || null" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })
import SeatmapManager from '~/components/business/workspaces/events/SeatmapManager.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)
const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

// Event holen (wegen seatmap_id) – SSR
const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const event = computed(() => data.value || null)
</script>
