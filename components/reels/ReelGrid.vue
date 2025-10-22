<!-- components/reels/ReelGrid.vue -->
<script setup>
import ReelCard from '~/components/reels/ReelCard.vue'
const props = defineProps({
  items: { type: Array, default: () => [] } // [{ media, title, subtitle, priceBadge, tags, to, cornerBadge, cornerIcon, locationName }]
})
</script>

<template>
  <div class="grid">
    <div v-for="(it,i) in items" :key="i" class="col">
      <ReelCard v-bind="it" />
    </div>
  </div>
</template>

<style scoped>
.grid{
  display:grid; gap:1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 540px){ .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 992px){ .grid{ grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.col{ display:flex; }
</style>
