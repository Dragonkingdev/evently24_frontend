<!-- components/business/workspaces/events/EventHero.vue -->
<template>
  <section class="ev-hero card mb-4 overflow-hidden">
    <div class="ev-hero-bg"></div>
    <div class="card-body position-relative">
      <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <!-- Left: Icon + Title + Meta -->
        <div class="d-flex align-items-start gap-3">
          <div class="ev-hero-badge">
            <i class="bi bi-music-note-beamed"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="ev-status badge" :class="statusBadgeClass(ev?.status)">
                {{ statusLabel(ev?.status) }}
              </span>
              <span class="ev-mode badge" :class="ev?.listing_mode==='external' ? 'bg-mode-ext' : 'bg-mode-int'">
                {{ ev?.listing_mode==='external' ? 'extern' : 'intern' }}
              </span>
              <span v-if="ev?.id" class="badge bg-light text-dark">ID #{{ ev.id }}</span>
            </div>

            <h1 class="ev-title mt-1 mb-1">{{ ev?.title || 'Event' }}</h1>

            <div class="ev-subtle text-muted">
              <i class="bi bi-calendar-date me-1"></i>
              <strong>{{ formatDate(ev?.date) }}</strong>
              <span v-if="ev?.end_date"> – {{ formatDate(ev?.end_date) }}</span>
              <span v-if="ev?.time_zone" class="ms-2">• {{ ev.time_zone }}</span>

              <!-- Ort -->
              <template v-if="ev?.location_name || ev?.city || ev?.venue || ev?.location_text_city">
                <span class="ms-3">
                  <i class="bi bi-geo-alt me-1"></i>
                  <span v-if="ev?.location_name">{{ ev.location_name }}</span>
                  <template v-else>
                    <span>{{ ev?.location_text_city || ev?.city || '—' }}</span>
                    <span v-if="(ev?.location_text_city||ev?.city) && ev?.venue"> · </span>
                    <span v-if="ev?.venue">{{ ev.venue }}</span>
                  </template>
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="d-flex align-items-center gap-2">
          <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Zurück
          </NuxtLink>

          <!-- Statusabhängige Quick-Actions -->
          <button
            v-if="ev?.status==='draft'"
            class="btn btn-success"
            @click="onPublish"
          >
            <i class="bi bi-megaphone"></i> Veröffentlichen
          </button>

          <button
            v-else-if="ev?.status==='published'"
            class="btn btn-warning"
            @click="onManage"
          >
            <i class="bi bi-tools"></i> Manage-Modus
          </button>

          <button
            v-else-if="ev?.status==='live_manage'"
            class="btn btn-outline-secondary"
            @click="onArchiveToggle(true)"
          >
            <i class="bi bi-archive"></i> Archivieren
          </button>

          <button
            v-else-if="ev?.status==='archived'"
            class="btn btn-warning"
            @click="onArchiveToggle(false)"
          >
            <i class="bi bi-arrow-counterclockwise"></i> Reaktivieren
          </button>
        </div>
      </div>

      <!-- Flash -->
      <div v-if="flash" class="alert mt-3 mb-0" :class="flash.variant">{{ flash.msg }}</div>
    </div>
  </section>
</template>

<script setup>
/**
 * Reusable Event-Hero (Header) für alle Event-Seiten
 * Props:
 *  - wid, eventId, ev (komplette Event-Entity)
 * Emits:
 *  - 'updated' (wenn Statusaktionen evtl. das Event ändern)
 */
import { ref } from 'vue'
const props = defineProps({
  wid: { type: [Number, String], required: true },
  eventId: { type: [Number, String], required: true },
  ev: { type: Object, default: null }
})
const emit = defineEmits(['updated'])

const { publishEvent, manageEvent, archiveEvent, getEvent } = useWorkspaceApi()

const flash = ref(null)
function notify (msg, variant='alert-success') {
  flash.value = { msg, variant }
  setTimeout(() => (flash.value = null), 5000)
}
async function refresh(){
  const { data } = await getEvent(props.eventId)
  emit('updated', data || null)
}

/* Actions */
async function onPublish () {
  try {
    await publishEvent(props.eventId)
    await refresh()
    notify('Event veröffentlicht.')
  } catch (e) {
    notify(String(e?.data?.detail || 'Veröffentlichen fehlgeschlagen.'), 'alert-danger')
  }
}
async function onManage (){
  try {
    await manageEvent(props.eventId)
    await refresh()
    notify('Manage-Modus aktiviert.')
  } catch (e) {
    notify(String(e?.data?.detail || 'Manage-Modus konnte nicht aktiviert werden.'), 'alert-danger')
  }
}
async function onArchiveToggle (archived) {
  try {
    await archiveEvent(props.eventId, { archived: !!archived })
    await refresh()
    notify(archived ? 'Event archiviert.' : 'Event reaktiviert.')
  } catch (e) {
    notify(String(e?.data?.detail || 'Aktion fehlgeschlagen.'), 'alert-danger')
  }
}

/* UI helpers */
function statusLabel(s){
  switch ((s||'').toLowerCase()){
    case 'draft':       return 'Entwurf'
    case 'published':   return 'Veröffentlicht'
    case 'live_manage': return 'Manage-Modus'
    case 'archived':    return 'Archiviert'
    default:            return '—'
  }
}
function statusBadgeClass(s){
  switch ((s||'').toLowerCase()){
    case 'published':
    case 'live_manage': return 'bg-status-live'
    case 'archived':    return 'bg-status-archived text-dark'
    case 'draft':
    default:            return 'bg-status-draft'
  }
}
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v); if (isNaN(d)) return '—'
  try { return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }
  catch{
    const pad=n=>String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
</script>

<style scoped>
/* Vars (leicht, kompatibel zum Layout-Theme) */
:root, .ev-hero {
  --brand-primary:    #0d6efd;
  --brand-primary-10: rgba(13,110,253,.1);
  --brand-gradient-a: #5a8bff;
  --brand-gradient-b: #7cc2ff;
  --ink-900: #1f2630;
  --ink-700: #556070;
  --status-draft:     #9aa4b2;
  --status-live:      #2fb67c;
  --status-archived:  #e9ecef;
  --mode-int: #e8f1ff;
  --mode-ext: #f1eefc;
}

.ev-hero { border: 0; border-radius: 1rem; }
.ev-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(1200px 400px at -10% -50%, var(--brand-gradient-a), transparent 70%),
              radial-gradient(800px 300px at 120% 10%, var(--brand-gradient-b), transparent 60%),
              linear-gradient(135deg, #fff 0%, #f8fbff 100%);
  opacity: .65;
}
.ev-hero .card-body { padding: 1.25rem 1.25rem; }
@media (min-width: 992px){ .ev-hero .card-body { padding: 1.5rem 1.75rem; } }

.ev-hero-badge{
  width: 52px; height: 52px; border-radius: 12px;
  display: grid; place-items: center;
  background: var(--brand-primary-10);
  color: var(--brand-primary); font-size: 1.25rem;
  box-shadow: 0 8px 22px rgba(13,110,253,.15);
}
.ev-title { font-size: clamp(1.2rem, 1.2rem + 1vw, 1.65rem); color: var(--ink-900); }
.ev-subtle{ color: var(--ink-700); }

.ev-status.badge{ font-weight:600; padding:.45rem .6rem; border-radius:.6rem; letter-spacing:.02em; }
.bg-status-draft { background: var(--status-draft); color: #fff; }
.bg-status-live  { background: var(--status-live);  color: #fff; }
.bg-status-archived { background: var(--status-archived); }

.ev-mode.badge { padding:.4rem .6rem; border-radius:999px; }
.bg-mode-int{ background: var(--mode-int); color:#0b5ed7; border:1px solid rgba(13,110,253,.25); }
.bg-mode-ext{ background: var(--mode-ext); color:#6f42c1; border:1px solid rgba(111,66,193,.25); }
</style>
