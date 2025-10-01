<!-- pages/business/w/[wid]/events/[event_id]/index.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">{{ ev?.title || 'Event' }}</h4>
      <div class="btn-group">
        <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Zurück
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="card p-3 text-muted">Lädt…</div>

    <div v-else class="row g-4">
      <!-- Sidebar: mobil zuerst, Desktop rechts -->
      <div class="col-12 col-lg-4 order-1 order-lg-2">
        <EventSummaryCard :wid="wid" :event-id="eventId" :ev="ev" />
      </div>

      <!-- Hauptinhalt links -->
      <div class="col-12 col-lg-8 order-2 order-lg-1">
        <EventForm :model-value="ev" edit @submit="onSave" />
        <div v-if="flash" class="alert mt-3" :class="flash.variant">{{ flash.msg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EventForm from '~/components/business/workspaces/events/EventForm.vue'
import EventSummaryCard from '~/components/business/workspaces/events/EventSummaryCard.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)

const { patchEvent, saleReadiness } = useWorkspaceApi()

const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending, refresh } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const ev = computed(() => data.value || null)

const flash = ref(null)
function notify (msg, variant='alert-success') {
  flash.value = { msg, variant }
  setTimeout(() => (flash.value = null), 6000)
}

function readinessMessages(rd){
  const msgs=[]
  if(!rd?.stripe_connected) msgs.push('Stripe ist nicht verbunden.')
  if(!rd?.has_categories) msgs.push('Keine Ticketkategorien angelegt.')
  if((rd?.total_available ?? 0) <= 0) msgs.push('Keine verfügbaren Tickets (Stock ≤ sold + reserved).')
  return msgs
}
function renderReadinessAlert(rd, prefix='Hinweis für internen Verkauf:'){
  const msgs = readinessMessages(rd)
  return msgs.length ? `${prefix}\n• ${msgs.join('\n• ')}` : `${prefix} Unbekannter Hinweis.`
}

async function onSave (payload) {
  try {
    await patchEvent(eventId, payload)
    await refresh()
    notify('Gespeichert.')

    // Wenn auf "internal" gewechselt wurde, gleich die Readiness zeigen
    const changedToInternal =
      (payload?.listing_mode === 'internal') ||
      (payload?.listing_mode === undefined && ev.value?.listing_mode === 'internal')
    if (changedToInternal && ev.value?.status === 'draft') {
      const { data: rd } = await saleReadiness(eventId)
      if (!rd?.ok) {
        notify(renderReadinessAlert(rd), 'alert-warning')
      }
    }
  } catch (e) {
    console.error(e)
    const detail = e?.data?.detail || 'Speichern fehlgeschlagen.'
    notify(String(detail), 'alert-danger')
  }
}
</script>
