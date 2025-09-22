<!-- pages/business/w/[wid]/events/[event_id]/tickets.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Tickets verwalten</h4>
      <div class="btn-group">
        <NuxtLink :to="`/business/w/${wid}/events/${eventId}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Details
        </NuxtLink>
      </div>
    </div>

    <div class="row g-4">
      <!-- Sidebar: mobil zuerst, Desktop rechts -->
      <div class="col-12 col-lg-4 order-1 order-lg-2">
        <EventSummaryCard :wid="wid" :event-id="eventId" />
      </div>

      <!-- Hauptinhalt -->
      <div class="col-12 col-lg-8 order-2 order-lg-1">
        <TicketsManager :event-id="eventId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TicketsManager from '~/components/business/workspaces/events/TicketsManager.vue'
import EventSummaryCard from '~/components/business/workspaces/events/EventSummaryCard.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)
</script>
