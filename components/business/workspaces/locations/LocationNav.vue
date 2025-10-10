<!-- components/business/workspaces/locations/LocationNav.vue -->
<template>
  <!-- Schlichte Button-Zeile wie bei Events -->
  <div class="loc-nav mb-4">
    <div class="d-flex flex-wrap gap-2">
      <NuxtLink
        :to="detailsTo"
        class="btn"
        :class="btnClass('details')"
      >
        <i class="bi bi-sliders"></i>
        <span class="ms-1">Details</span>
      </NuxtLink>

      <!-- Platzhalter für zukünftige Tabs (Medien, Belegung, …) -->
      <NuxtLink
        v-if="false"
        :to="`${base}/media`"
        class="btn"
        :class="btnClass('media')"
      >
        <i class="bi bi-images"></i>
        <span class="ms-1">Medien</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  wid: { type: [Number, String], required: true },
  locationId: { type: [Number, String], required: true },
  active: { type: String, default: 'details' }
})

const base = computed(() => `/business/w/${props.wid}/locations/${props.locationId}`)
const detailsTo = computed(() => base.value)

function isActive(key){ return (props.active || 'details') === key }
function btnClass(key){ return isActive(key) ? 'btn-primary' : 'btn-outline-secondary' }
</script>

<style scoped>
.loc-nav .btn{
  padding: .5rem .75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  line-height: 1.1;
}
@media (max-width: 575.98px){
  .loc-nav .btn{ padding: .55rem .8rem; }
}
</style>
