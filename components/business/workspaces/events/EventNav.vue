<!-- components/business/workspaces/events/EventNav.vue -->
<template>
  <!-- Kein Card-Wrapper mehr; nur eine schlichte Button-Zeile -->
  <div class="ev-nav mb-4">
    <div class="d-flex flex-wrap gap-2">
      <NuxtLink
        :to="detailsTo"
        class="btn"
        :class="btnClass('details')"
      >
        <i class="bi bi-sliders"></i>
        <span class="ms-1">Details</span>
      </NuxtLink>

      <NuxtLink
        v-if="isInternal"
        :to="ticketsTo"
        class="btn"
        :class="btnClass('tickets')"
      >
        <i class="bi bi-tags"></i>
        <span class="ms-1">Tickets</span>
      </NuxtLink>

      <NuxtLink
        v-if="showSeating"
        :to="seatingTo"
        class="btn"
        :class="btnClass('seating')"
      >
        <i class="bi bi-grid-3x3-gap"></i>
        <span class="ms-1">Seating</span>
      </NuxtLink>

      <NuxtLink
        v-if="showSeatmapBuilder"
        :to="seatmapBuilderTo"
        class="btn"
        :class="btnClass('seatmap-builder')"
      >
        <i class="bi bi-pencil-square"></i>
        <span class="ms-1">Seatplan Builder</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
/**
 * Schlichte Event-Navigation als Button-Zeile (ohne Card/Tab-Styling).
 * Props:
 *  - wid, eventId, ev
 *  - active: 'details' | 'tickets' | 'seating' | 'seatmap-builder'
 */
const props = defineProps({
  wid: { type: [Number, String], required: true },
  eventId: { type: [Number, String], required: true },
  ev: { type: Object, default: null },
  active: { type: String, default: 'details' }
})

const base = computed(() => `/business/w/${props.wid}/events/${props.eventId}`)
const detailsTo = computed(() => base.value)
const ticketsTo = computed(() => `${base.value}/tickets`)
const seatingTo = computed(() => `${base.value}/seating`)
const seatmapBuilderTo = computed(() => `${base.value}/seatmap-builder`)

const isInternal = computed(() => (props.ev?.listing_mode || '') === 'internal')
const showSeating = computed(() =>
  isInternal.value && (props.ev?.ticket_sale_mode === 'reserved') && !!props.ev?.seatmap_id
)
const showSeatmapBuilder = computed(() => showSeating.value)

function isActive(key){ return (props.active || 'details') === key }
function btnClass(key){
  return isActive(key) ? 'btn-primary' : 'btn-outline-secondary'
}
</script>

<style scoped>
/* Dezente, konsistente Optik; nutzt deine Theme-Token/Bootstrap-Vars */
.ev-nav .btn{
  /* Radius & Focus kommen schon aus deinem Theme (.theme-business .btn...) */
  padding: .5rem .75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  line-height: 1.1;
}

/* Optional: leichte Erhöhung der Klickfläche auf Mobile */
@media (max-width: 575.98px){
  .ev-nav .btn{
    padding: .55rem .8rem;
  }
}
</style>
