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

    <TicketsManager :event-id="eventId" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })
import TicketsManager from '~/components/business/workspaces/events/TicketsManager.vue'
const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)
</script>
