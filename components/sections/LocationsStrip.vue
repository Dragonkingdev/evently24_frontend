<!-- components/sections/LocationsStrip.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { usePublic } from '~/composables/usePublic'
import { useRegion } from '~/composables/useRegion'

const { listLocations } = usePublic()
const { region } = useRegion()

const items = ref([])

onMounted(async ()=>{
  const res = await listLocations({ q:'', city: region.value || undefined }).then(r => r.data || r)
  items.value = Array.isArray(res) ? res : (res?.items || [])
})
</script>

<template>
  <section class="strip">
    <div class="container">
      <div class="head">
        <h3>Locations entdecken</h3>
        <NuxtLink to="/locations" class="more">Alle Locations</NuxtLink>
      </div>
      <div class="row">
        <NuxtLink v-for="l in items" :key="l.id" class="tile" :to="`/locations/${l.id}`">
          <div class="thumb" :style="{ backgroundImage:`url(https://picsum.photos/seed/loc-${l.id}/600/800)` }"></div>
          <div class="meta">
            <strong>{{ l.name }}</strong>
            <small>{{ l.city }}</small>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.strip{ padding: 1.25rem 0; }
.container{ width:min(1200px, 94vw); margin:0 auto; }
.head{ display:flex; justify-content:space-between; align-items:end; margin-bottom:.35rem; }
.more{ font-weight:700; color:#475569; }
.row{ display:grid; grid-auto-flow:column; grid-auto-columns: 200px; gap:.75rem; overflow:auto; padding-bottom:.5rem; }
.tile{
  display:flex; flex-direction:column; gap:.4rem; text-decoration:none; color:inherit;
}
.thumb{
  aspect-ratio: 3/4; border-radius:14px; background-size:cover; background-position:center; background-color:#0b0b0b;
  box-shadow: 0 8px 20px rgba(2,6,23,.12);
}
.meta small{ color:#64748b; }
</style>
