<!-- pages/business/w/[wid]/events/[event_id]/holds.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Admin Holds & Issue</h4>
      <div class="btn-group">
        <NuxtLink :to="`/business/w/${wid}/events/${eventId}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Details
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="card p-3 text-muted">Lädt…</div>

    <div v-else class="row g-4">
      <!-- Sidebar -->
      <div class="col-12 col-lg-4 order-1 order-lg-2">
        <EventSummaryCard :wid="wid" :event-id="eventId" :ev="event" />
      </div>

      <!-- Content -->
      <div class="col-12 col-lg-8 order-2 order-lg-1">
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button :class="['nav-link', tab==='ga' && 'active']" @click="tab='ga'">
              <i class="bi bi-people"></i> GA Holds
            </button>
          </li>
          <li class="nav-item">
            <button :class="['nav-link', tab==='seats' && 'active']" @click="tab='seats'">
              <i class="bi bi-grid-3x3-gap"></i> Sitzplatz Holds
            </button>
          </li>
        </ul>

        <AdminHoldsGA v-if="tab==='ga'" :event-id="eventId" />
        <AdminHoldsSeats v-else :event-id="eventId" :seatmap-id="event?.seatmap_id || null" />
      </div>
    </div>
  </div>
</template>

<script setup>
import EventSummaryCard from '~/components/business/workspaces/events/EventSummaryCard.vue'
import AdminHoldsGA from '~/components/business/workspaces/events/AdminHoldsGA.vue'
import AdminHoldsSeats from '~/components/business/workspaces/events/AdminHoldsSeats.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)
const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const event = computed(() => data.value || null)

const tab = ref('ga')
</script>
