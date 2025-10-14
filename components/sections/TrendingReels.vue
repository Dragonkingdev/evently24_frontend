<!-- components/sections/TrendingReels.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import ReelCard from '~/components/cards/ReelCard.vue'
import Modal from '~/components/ui/Modal.vue'
import Drawer from '~/components/ui/Drawer.vue'
import { usePublic } from '~/composables/usePublic'
import { useRegion } from '~/composables/useRegion'

const { listEvents } = usePublic()
const { region } = useRegion()

const items = ref([])
const page = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

const filters = ref({
  q: '',
  city: '',
  category: '',
  date_from: '',
  date_to: '',
})
const drawerOpen = ref(false)
const regionModalOpen = ref(false)

function formatWhenWhere(ev){
  const d = ev.date
  const city = ev.city || ''
  if (!d) return city
  const dt = new Date(d)
  const dateStr = dt.toLocaleDateString('de-DE', { weekday:'short', day:'2-digit', month:'short' })
  const timeStr = dt.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' })
  return `${city} · ${dateStr} ${timeStr}`
}
function toMedia(ev){
  // Falls du Video-URL in ev.video hast, kannst du hier umschalten
  return { type:'image', src: ev.cover_url || ev.image || `https://picsum.photos/seed/${encodeURIComponent(ev.slug||ev.id)}/720/1280` }
}

async function fetchPage(){
  if(isLoading.value || !hasMore.value) return
  isLoading.value = true
  const params = {
    page: page.value,
    page_size: 12,
    q: filters.value.q || undefined,
    city: filters.value.city || region.value || undefined,
    category: filters.value.category || undefined,
    date_from: filters.value.date_from || undefined,
    date_to: filters.value.date_to || undefined,
    only_published: true
  }
  const res = await listEvents(params).then(r => r.data || r)
  const list = Array.isArray(res) ? res : (res?.items || [])
  if (!list.length) { hasMore.value = false; isLoading.value = false; return }
  const mapped = list.map(ev => ({
    id: ev.id,
    title: ev.title,
    subtitle: formatWhenWhere(ev),
    priceBadge: (ev.min_price === 0) ? 'Gratis' : (typeof ev.min_price === 'number' ? `ab ${Math.round(ev.min_price)}€` : ''),
    tags: [ev.category || 'Event'].filter(Boolean),
    media: toMedia(ev),
    to: `/events/${ev.slug || ev.id}`,
    locationName: ev.venue || ''
  }))
  items.value.push(...mapped)
  page.value += 1
  isLoading.value = false
}

function onScroll(){
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 800
  if(nearBottom) fetchPage()
}

onMounted(async ()=>{
  await fetchPage()
  window.addEventListener('scroll', onScroll, { passive:true })
})
</script>

<template>
  <section class="reels-section">
    <div class="container">
      <div class="reels-header">
        <div>
          <div class="eyebrow">Jetzt & demnächst in <span class="accent">{{ region || 'deiner Region' }}</span></div>
          <h2 class="title">Scroll die Highlights</h2>
          <p class="subtitle">9:16 Reels – Events, Locations, Artists. Direkt Tickets sichern oder merken.</p>
        </div>
        <div class="tools">
          <button class="tool-btn" @click="drawerOpen = true"><i class="bi bi-sliders"></i> Filter</button>
          <button class="tool-btn" @click="regionModalOpen = true"><i class="bi bi-geo"></i> Region</button>
        </div>
      </div>

      <div class="reels-grid">
        <ReelCard
          v-for="it in items"
          :key="it.id"
          v-bind="it"
          :on-primary="()=>{}"
          :on-save="()=>{}"
        />
      </div>

      <div class="load-more" v-if="isLoading">
        <span class="spinner"></span> Lädt …
      </div>
      <div class="load-more" v-else-if="!hasMore">
        <small>Keine weiteren Ergebnisse</small>
      </div>
    </div>

    <!-- Drawer: Filter -->
    <Drawer v-model="drawerOpen" side="right" aria-label="Filter">
      <template #title><h5 class="m-0">Filter</h5></template>
      <div class="form">
        <label>Suche</label>
        <input v-model="filters.q" type="text" placeholder="Artist / Event / Location" />
        <label>Stadt</label>
        <input v-model="filters.city" type="text" placeholder="z. B. Koblenz" />
        <label>Kategorie</label>
        <select v-model="filters.category">
          <option value="">Alle</option>
          <option value="concert">Konzert</option>
          <option value="festival">Festival</option>
          <option value="theater">Theater</option>
          <option value="nightlife">Nightlife</option>
          <option value="comedy">Comedy</option>
        </select>
        <div class="row2">
          <div>
            <label>Von</label>
            <input v-model="filters.date_from" type="datetime-local" />
          </div>
          <div>
            <label>Bis</label>
            <input v-model="filters.date_to" type="datetime-local" />
          </div>
        </div>
        <button class="apply" @click="items=[]; page=1; hasMore=true; fetchPage(); drawerOpen=false"><i class="bi bi-check2-circle"></i> Anwenden</button>
      </div>
    </Drawer>

    <!-- Region-Modal -->
    <Modal v-model="regionModalOpen" aria-label="Region wählen">
      <template #title><h5 class="m-0"><i class="bi bi-geo"></i> Region wählen</h5></template>
      <div class="form">
        <label>Stadt / Region</label>
        <RegionPicker @applied="regionModalOpen=false; items=[]; page=1; hasMore=true; fetchPage()" />
      </div>
    </Modal>
  </section>
</template>

<script>
import RegionPicker from '~/components/ui/RegionPicker.vue'
export default { components:{ RegionPicker } }
</script>

<style scoped>
:root{
  --app-accent:#5b7cfa; --app-accent-2:#3b57c9;
  --app-ink:#0f172a; --app-ink-2:#475569; --app-soft:#f6f7fb;
}
.reels-section{ padding: 1.5rem 0 2rem; background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%); }
.container{ width:min(1200px, 94vw); margin:0 auto; }
.reels-header{ display:flex; align-items:end; justify-content:space-between; gap:1rem; margin-bottom: .75rem; }
.eyebrow{ font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; color:#6c7a91; }
.eyebrow .accent{ color:var(--app-accent); }
.title{ margin:.15rem 0 .25rem; font-weight:900; }
.subtitle{ margin:0; color:var(--app-ink-2); }
.tools{ display:flex; gap:.5rem; }
.tool-btn{ border:1px solid #e5e7eb; background:#fff; padding:.5rem .7rem; border-radius:10px; font-weight:700; }
.reels-grid{
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}
@media(min-width: 540px){ .reels-grid{ grid-template-columns: repeat(2, 1fr); } }
@media(min-width: 992px){ .reels-grid{ grid-template-columns: repeat(3, 1fr); } }
.load-more{ display:flex; justify-content:center; align-items:center; padding:1rem 0; color:#64748b; }
.spinner{
  width:16px; height:16px; border-radius:999px; border:2px solid #cbd5e1; border-top-color:#64748b; margin-right:.5rem; animation:spin 1s linear infinite;
}
@keyframes spin{ to { transform: rotate(360deg); } }

.form{ display:flex; flex-direction:column; gap:.65rem; }
.form label{ font-weight:700; font-size:.85rem; color:#334155; }
.form input, .form select{
  border:1px solid #e5e7eb; border-radius:10px; padding:.55rem .7rem; outline:none; background:#fff;
}
.row2{ display:grid; grid-template-columns:1fr 1fr; gap:.65rem; }
.apply{ margin-top:.5rem; border-radius:10px; border:0; padding:.6rem .9rem; background:var(--app-accent); color:#fff; font-weight:800; }
.apply:hover{ background:var(--app-accent-2); }
</style>
