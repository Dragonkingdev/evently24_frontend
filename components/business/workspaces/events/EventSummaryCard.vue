<!-- components/business/workspaces/events/EventSummaryCard.vue -->
<template>
  <aside class="card sticky-top" style="top: 1rem">
    <div class="card-header d-flex align-items-center justify-content-between">
      <strong>Event-Übersicht</strong>
      <span v-if="ev?.id" class="text-muted small">ID: {{ ev.id }}</span>
    </div>

    <div class="card-body">
      <div class="d-flex align-items-start justify-content-between">
        <h5 class="mb-1 me-2">{{ ev?.title || 'Event' }}</h5>
        <span class="badge" :class="statusClass(ev?.status)">{{ ev?.status || '—' }}</span>
      </div>

      <div class="text-muted small">
        <div class="mt-2">
          <i class="bi bi-calendar-date me-1"></i>
          <span>{{ formatDate(ev?.date) }}</span>
        </div>

        <div class="mt-1">
          <i class="bi bi-basket me-1"></i>
          Listing:
          <strong>{{ (ev?.listing_mode === 'external') ? 'extern' : 'intern' }}</strong>
        </div>

        <div class="mt-1" v-if="ev?.city || ev?.venue">
          <i class="bi bi-geo-alt me-1"></i>
          <span v-if="ev?.city">{{ ev.city }}</span>
          <span v-if="ev?.city && ev?.venue"> · </span>
          <span v-if="ev?.venue">{{ ev.venue }}</span>
        </div>

        <div class="mt-1" v-if="!!ev?.seatmap_id">
          <i class="bi bi-grid-3x3-gap me-1"></i>
          Seatmap ID: {{ ev.seatmap_id }}
        </div>

        <div class="mt-1" v-if="ev?.listing_mode==='external' && ev?.external_ticket_url">
          <i class="bi bi-link-45deg me-1"></i>
          <a :href="ev.external_ticket_url" target="_blank" rel="noopener">Ticket-Link öffnen</a>
        </div>
      </div>

      <div class="d-grid gap-2 mt-3">
        <NuxtLink :to="`/business/w/${wid}/events/${eventId}`" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-sliders"></i> Details
        </NuxtLink>

        <NuxtLink
          v-if="ev?.listing_mode==='internal'"
          :to="`/business/w/${wid}/events/${eventId}/tickets`"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-tags"></i> Tickets
        </NuxtLink>

        <NuxtLink
          v-if="!!ev?.seatmap_id"
          :to="`/business/w/${wid}/events/${eventId}/seating`"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-grid-3x3-gap"></i> Seating
        </NuxtLink>

        <NuxtLink
          v-if="!!ev?.seatmap_id"
          :to="`/business/w/${wid}/events/${eventId}/seatmap-builder`"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-pencil-square"></i> Seatplan Builder
        </NuxtLink>
        <!-- ❌ Admin Holds entfernt – alles in Tickets-Manager -->
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  wid: { type: [Number, String], required: true },
  eventId: { type: [Number, String], required: true },
  ev: { type: Object, default: null }
})

const { getEvent } = useWorkspaceApi()
const localEv = ref(props.ev)

onMounted(async () => {
  if (!localEv.value) {
    const { data } = await getEvent(props.eventId)
    localEv.value = data || null
  }
})

const ev = computed(() => localEv.value)

function formatDate(v){
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d)) return '—'
  try {
    return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    const pad = n => String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
function statusClass(s){
  switch ((s||'').toLowerCase()){
    case 'published':
    case 'live_manage': return 'bg-success'   // ✅ neuer Modus: „veröffentlicht & anpassbar“
    case 'archived':    return 'bg-light text-dark'
    case 'draft':
    default:            return 'bg-secondary'
  }
}
</script>
