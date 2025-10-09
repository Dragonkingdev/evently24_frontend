<!-- pages/business/w/[wid]/events/[event_id]/seating.vue -->
<template>
  <div class="event-view">
    <!-- HERO + NAV -->
    <EventHero :wid="wid" :event-id="eventId" :ev="ev" @updated="onUpdated" />
    <EventNav :wid="wid" :event-id="eventId" :ev="ev" active="seating" />

    <!-- Loading Skeleton -->
    <div v-if="pending" class="row g-4">
      <div class="col-12">
        <div class="card p-3">
          <div class="skeleton skeleton-title mb-3"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line w-75"></div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div v-else class="row g-4">
      <div class="col-12">
        <!-- Hinweis-Kacheln -->
        <div class="row g-3 mb-1">
          <div class="col-md-4">
            <div class="ev-tile">
              <div class="ev-tile-icon"><i class="bi bi-tags-fill"></i></div>
              <div class="ev-tile-body">
                <div class="ev-tile-label">Ticket-System</div>
                <div class="ev-tile-value">
                  {{ ev?.ticket_sale_mode === 'reserved' ? 'Sitzplätze (Seatmap)' : 'Kontingente (GA)' }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4" v-if="ev?.seatmap_id">
            <div class="ev-tile">
              <div class="ev-tile-icon"><i class="bi bi-grid-3x3-gap"></i></div>
              <div class="ev-tile-body">
                <div class="ev-tile-label">Seatmap</div>
                <div class="ev-tile-value">ID {{ ev.seatmap_id }}</div>
              </div>
            </div>
          </div>
          <div class="col-md-4" v-if="!ev?.seatmap_id && ev?.ticket_sale_mode === 'reserved'">
            <div class="ev-tile">
              <div class="ev-tile-icon"><i class="bi bi-exclamation-triangle"></i></div>
              <div class="ev-tile-body">
                <div class="ev-tile-label">Seatmap fehlt</div>
                <div class="ev-tile-value">Bitte Seatmap anlegen/zuweisen.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manager -->
        <SeatmapManager :event-id="eventId" :seatmap-id="ev?.seatmap_id || null" />
      </div>
    </div>
  </div>
</template>

<script setup>
import EventHero from '~/components/business/workspaces/events/EventHero.vue'
import EventNav from '~/components/business/workspaces/events/EventNav.vue'
import SeatmapManager from '~/components/business/workspaces/events/SeatmapManager.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)
const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending, refresh } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const ev = computed(() => data.value || null)

function onUpdated(val){ if (val) data.value = val }
</script>

<style scoped>
.skeleton { display:block; height:12px; border-radius:8px; background:linear-gradient(90deg,#f2f4f8 0%,#e9edf3 50%,#f2f4f8 100%); background-size:200% 100%; animation: sk 1.2s infinite; }
.skeleton-title{ height:22px; width:60%; }
.skeleton-line{ height:12px; width:90%; }
@keyframes sk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
