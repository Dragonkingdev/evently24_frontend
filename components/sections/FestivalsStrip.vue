<!-- components/sections/FestivalsStrip.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { usePublic } from '~/composables/usePublic'
const { listFestivals } = usePublic()

const items = ref([])
onMounted(async ()=>{
  const res = await listFestivals({ q:'', only_verified: false }).then(r => r.data || r)
  items.value = Array.isArray(res) ? res.slice(0,10) : (res?.items || []).slice(0,10)
})
</script>

<template>
  <section class="strip soft">
    <div class="container">
      <div class="head">
        <h3>Große Festivals</h3>
        <NuxtLink to="/festivals" class="more">Alle Festivals</NuxtLink>
      </div>
      <div class="row">
        <NuxtLink v-for="f in items" :key="f.id" class="tile" :to="`/festivals/${f.slug || f.id}`">
          <div class="thumb" :style="{ backgroundImage:`url(${f.logo_url || `https://picsum.photos/seed/festival-${f.id}/800/800`})` }"></div>
          <div class="meta">
            <strong>{{ f.name }}</strong>
            <small>{{ f.verification_status || '—' }}</small>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.strip{ padding: 1.25rem 0; }
.strip.soft{ background: #f8faff; }
.container{ width:min(1200px, 94vw); margin:0 auto; }
.head{ display:flex; justify-content:space-between; align-items:end; margin-bottom:.35rem; }
.more{ font-weight:700; color:#475569; }
.row{ display:grid; grid-auto-flow:column; grid-auto-columns: 240px; gap:.75rem; overflow:auto; padding-bottom:.5rem; }
.tile{ display:flex; flex-direction:column; gap:.4rem; text-decoration:none; color:inherit; }
.thumb{
  aspect-ratio: 16/9; border-radius:14px; background-size:cover; background-position:center; background-color:#0b0b0b;
  box-shadow: 0 8px 20px rgba(2,6,23,.12);
}
.meta small{ color:#64748b; }
</style>
