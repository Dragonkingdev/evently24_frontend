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

    <div v-if="pending" class="card p-3 text-muted">Lädt…</div>

    <div v-else class="row g-4">
      <div class="col-12 col-lg-4 order-1 order-lg-2">
        <EventSummaryCard :wid="wid" :event-id="eventId" :ev="ev" />
      </div>

      <div class="col-12 col-lg-8 order-2 order-lg-1">
        <template v-if="isGA">
          <div class="alert alert-light border">
            <div class="fw-semibold mb-1">General Admission</div>
            <div class="small text-muted">
              Kein Sitzplan aktiv – <strong>keine Seat-Labels nötig</strong>.
              Tickets können direkt <strong>erstellt</strong> werden. Reservierungen sind hier nicht erforderlich.
            </div>
          </div>
          <TicketsManager
            :event-id="eventId"
            mode="ga"
            :fee-mode="ev?.fee_mode || 'included'"
            @update:feeMode="ev.fee_mode = $event"
          />
        </template>

        <template v-else>
          <div class="alert alert-info d-flex align-items-start">
            <i class="bi bi-grid-3x3-gap me-2 mt-1"></i>
            <div>
              <div class="fw-semibold">Sitzplätze (Seatmap)</div>
              <div class="small">
                In <b>Erstellen & Reservieren</b> kannst du Tickets direkt erstellen <em>und</em> Seats reservieren.
                Im Tab <b>Tickets</b> gibt’s zusätzlich den <em>Ticket-Editor</em> zum Seat-Tausch (gleiche Kategorie).
              </div>
            </div>
          </div>
          <TicketsManager
            :event-id="eventId"
            mode="reserved"
            :fee-mode="ev?.fee_mode || 'included'"
            @fee-mode-changed="onFeeModeChanged"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TicketsManager from '~/components/business/workspaces/events/TicketsManager.vue'
import EventSummaryCard from '~/components/business/workspaces/events/EventSummaryCard.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)

const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const ev = computed(() => data.value || null)

const isReserved = computed(() => {
  const tsm = String(ev.value?.ticket_sale_mode || '').toUpperCase()
  if (tsm === 'RESERVED') return true
  if (tsm === 'GENERAL') return false
  return !!ev.value?.seatmap_id
})
const isGA = computed(() => !isReserved.value)

/** Wird vom TicketsManager nach erfolgreichem Patch gefeuert */
function onFeeModeChanged (mode) {
  if (data.value) data.value.fee_mode = mode
}
</script>
