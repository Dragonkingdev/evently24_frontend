<!-- components/business/workspaces/events/EventSummaryCard.vue -->
<template>
  <aside class="card sticky-top" style="top: 1rem">
    <div class="card-header d-flex align-items-center justify-content-between">
      <strong>Event-Übersicht</strong>
      <span v-if="ev?.id" class="text-muted small">ID: {{ ev.id }}</span>
    </div>

    <div class="card-body">
      <!-- Titel + Status -->
      <div class="d-flex align-items-start justify-content-between">
        <h5 class="mb-1 me-2">{{ ev?.title || 'Event' }}</h5>
        <span class="badge" :class="statusClass(ev?.status)">{{ statusLabel(ev?.status) }}</span>
      </div>

      <!-- Meta -->
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

        <!-- bevorzugt serverseitig angehängter location_name -->
        <div class="mt-1" v-if="ev?.location_name || ev?.city || ev?.venue">
          <i class="bi bi-geo-alt me-1"></i>
          <span v-if="ev?.location_name">{{ ev.location_name }}</span>
          <template v-else>
            <span v-if="ev?.city">{{ ev.city }}</span>
            <span v-if="ev?.city && ev?.venue"> · </span>
            <span v-if="ev?.venue">{{ ev.venue }}</span>
          </template>
        </div>

        <div class="mt-1" v-if="!!ev?.seatmap_id">
          <i class="bi bi-grid-3x3-gap me-1"></i>
          Seatmap ID: {{ ev.seatmap_id }}
        </div>

        <div class="mt-1" v-if="ev?.listing_mode==='external' && ev?.external_ticket_url">
          <i class="bi bi-link-45deg me-1"></i>
          <a :href="ev.external_ticket_url" target="_blank" rel="noopener">Ticket-Link öffnen</a>
        </div>

        <div class="mt-1" v-if="ev?.time_zone">
          <i class="bi bi-globe2 me-1"></i>
          Zeitzone: <span>{{ ev.time_zone }}</span>
        </div>
      </div>

      <!-- Navigation -->
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
          v-if="showSeatmapActions"
          :to="`/business/w/${wid}/events/${eventId}/seating`"
          class="btn btn-outline-primary btn-sm">
          <i class="bi bi-grid-3x3-gap"></i> Seating
        </NuxtLink>

        <NuxtLink
          v-if="showSeatmapActions"
          :to="`/business/w/${wid}/events/${eventId}/seatmap-builder`"
          class="btn btn-outline-primary btn-sm">
          <i class="bi bi-pencil-square"></i> Seatplan Builder
        </NuxtLink>
      </div>

      <!-- Aktionen (Statussteuerung) -->
      <div class="d-grid gap-2 mt-3">
        <!-- DRAFT: Publish -->
        <button
          v-if="ev?.status==='draft'"
          class="btn btn-success btn-sm"
          @click="onPublish"
        >
          <i class="bi bi-megaphone"></i> Event veröffentlichen
        </button>

        <!-- PUBLISHED: Manage + Archivieren -->
        <template v-else-if="ev?.status==='published'">
          <button class="btn btn-warning btn-sm" @click="onManage">
            <i class="bi bi-tools"></i> Manage-Modus
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="onArchiveToggle(true)">
            <i class="bi bi-archive"></i> Archivieren
          </button>
        </template>

        <!-- LIVE_MANAGE: Archivieren -->
        <template v-else-if="ev?.status==='live_manage'">
          <button class="btn btn-outline-secondary btn-sm" @click="onArchiveToggle(true)">
            <i class="bi bi-archive"></i> Archivieren
          </button>
        </template>

        <!-- ARCHIVED: Reaktivieren -->
        <template v-else-if="ev?.status==='archived'">
          <button class="btn btn-warning btn-sm" @click="onArchiveToggle(false)">
            <i class="bi bi-arrow-counterclockwise"></i> Reaktivieren
          </button>
        </template>

        <!-- Löschen: nur wenn nicht published/live_manage -->
        <button
          v-if="ev && ev.status!=='published' && ev.status!=='live_manage'"
          class="btn btn-outline-danger btn-sm"
          @click="onDelete"
        >
          <i class="bi bi-trash"></i> Löschen
        </button>
      </div>

      <!-- Flash/Hint -->
      <div v-if="flash" class="alert mt-3" :class="flash.variant">{{ flash.msg }}</div>

      <!-- Debug (optional) -->
      <pre v-if="debug" class="small mt-3 bg-light p-2 border rounded">{{ debug }}</pre>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  wid: { type: [Number, String], required: true },
  eventId: { type: [Number, String], required: true },
  ev: { type: Object, default: null } // optional: vorab mitgeben
})

const emit = defineEmits(['updated']) // optional: Eltern informieren

const {
  getEvent,
  publishEvent,
  manageEvent,
  archiveEvent,
  deleteEvent,
  saleReadiness
} = useWorkspaceApi()

const localEv = ref(props.ev)
const flash = ref(null)
const debug = ref(null)

function notify (msg, variant='alert-success') {
  flash.value = { msg, variant }
  setTimeout(() => (flash.value = null), 6000)
}

async function reload(){
  const { data } = await getEvent(props.eventId)
  localEv.value = data || null
  emit('updated', localEv.value)
}

onMounted(async () => {
  if (!localEv.value) {
    await reload()
  }
})

const ev = computed(() => localEv.value)

const showSeatmapActions = computed(() =>
  ev.value?.listing_mode === 'internal' &&
  ev.value?.ticket_sale_mode === 'reserved' &&
  !!ev.value?.seatmap_id
)

/* ---------- Status-Aktionen ---------- */

function readinessMessages(rd){
  const msgs=[]
  if(!rd?.stripe_connected) msgs.push('Stripe ist nicht verbunden.')
  if(!rd?.has_categories) msgs.push('Keine Ticketkategorien angelegt.')
  if((rd?.total_available ?? 0) <= 0) msgs.push('Keine verfügbaren Tickets (Stock ≤ sold + reserved).')
  return msgs
}
function renderReadinessAlert(rd, prefix='Veröffentlichen nicht möglich:'){
  const msgs = readinessMessages(rd)
  return msgs.length ? `${prefix}\n• ${msgs.join('\n• ')}` : `${prefix} Unbekannter Fehler.`
}

async function onPublish () {
  try {
    await publishEvent(props.eventId)
    await reload()
    notify('Event veröffentlicht.')
  } catch (e) {
    const rd = e?.data?.detail?.readiness
    if (rd) {
      notify(renderReadinessAlert(rd), 'alert-danger')
    } else {
      const detail = e?.data?.detail || 'Veröffentlichen fehlgeschlagen.'
      notify(String(detail), 'alert-danger')
    }
  }
}

async function onManage (){
  try {
    await manageEvent(props.eventId)
    await reload()
    notify('Manage-Modus aktiviert.')
  } catch (e) {
    const detail = e?.data?.detail || 'Manage-Modus konnte nicht aktiviert werden.'
    notify(String(detail), 'alert-danger')
  }
}

async function onArchiveToggle (archived) {
  try {
    await archiveEvent(props.eventId, { archived: !!archived })
    await reload()
    notify(archived ? 'Event archiviert.' : 'Event reaktiviert.')
  } catch (e) {
    const detail = e?.data?.detail || 'Aktion fehlgeschlagen.'
    notify(String(detail), 'alert-danger')
  }
}

async function onDelete () {
  if (!confirm('Event wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return
  try {
    await deleteEvent(props.eventId)
    notify('Event gelöscht.')
    // optional: Weiterleitung könnte hier passieren; lieber Eltern-Komponente handeln lassen
  } catch (e) {
    const detail = e?.data?.detail || 'Löschen fehlgeschlagen.'
    notify(String(detail), 'alert-danger')
  }
}

/* ---------- UI-Helpers ---------- */

function statusLabel(s){
  switch ((s||'').toLowerCase()){
    case 'draft':       return 'Entwurf'
    case 'published':   return 'Veröffentlicht'
    case 'live_manage': return 'Manage-Modus'
    case 'archived':    return 'Archiviert'
    default:            return '—'
  }
}

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
    case 'live_manage': return 'bg-success'
    case 'archived':    return 'bg-light text-dark'
    case 'draft':
    default:            return 'bg-secondary'
  }
}
</script>
