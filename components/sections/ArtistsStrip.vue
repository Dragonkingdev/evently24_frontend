<!-- components/sections/ArtistsStrip.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { usePublic } from '~/composables/usePublic'
const { listArtists } = usePublic()

const items = ref([])
onMounted(async ()=>{
  const res = await listArtists({ q:'' }).then(r => r.data || r)
  items.value = Array.isArray(res) ? res.slice(0,12) : (res?.items || []).slice(0,12)
})
</script>

<template>
  <section class="strip">
    <div class="container">
      <div class="head">
        <h3>Künstler & DJs</h3>
        <NuxtLink to="/artists" class="more">Alle Artists</NuxtLink>
      </div>
      <div class="row">
        <NuxtLink v-for="a in items" :key="a.id" class="tile" :to="`/artists/${a.id}`">
          <div class="avatar" :style="{ backgroundImage:`url(https://picsum.photos/seed/artist-${a.id}/512/512)` }"></div>
          <div class="meta">
            <strong>{{ a.stage_name }}</strong>
            <small>{{ a.city || a.country }}</small>
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
.row{ display:grid; grid-auto-flow:column; grid-auto-columns: 160px; gap:.75rem; overflow:auto; padding-bottom:.5rem; }
.tile{ display:flex; flex-direction:column; gap:.4rem; text-decoration:none; color:inherit; align-items:center; }
.avatar{
  width:100%; aspect-ratio:1/1; border-radius:999px; background-size:cover; background-position:center; background-color:#0b0b0b;
  box-shadow: 0 8px 20px rgba(2,6,23,.12);
}
.meta{ text-align:center; }
.meta small{ color:#64748b; }
</style>
