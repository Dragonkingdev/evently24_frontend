<!-- pages/index.vue -->
<script setup>
import Hero from '~/components/new/Hero.vue'

import SectionReels from '~/components/sections/SectionReels.vue'
import { usePublic } from '~/composables/usePublic'
import { useInViewAutoplay } from '~/composables/useInViewAutoplay'
import { onMounted, watch, computed, nextTick } from 'vue'
import { useRegion } from '~/composables/useRegion'

const api = usePublic()
const { region } = useRegion()
const { setup: setupAutoplay, destroy: destroyAutoplay } = useInViewAutoplay()

// --- Helpers ---
const toArray = (x) => Array.isArray(x) ? x : (x?.items || x?.results || x?.data || x?.events || [])
const getImage = (obj, seed='event') =>
  obj?.image || obj?.poster || obj?.cover || obj?.cover_url || obj?.avatar ||
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/720/1280`
const cityOf = (ev) => ev.city || ev?.location?.city || ev?.venue?.city || ev?.address?.city || ''
const whenOf = (ev) => {
  const d = ev.date || ev.start_date || ev.starts_at || ev.datetime || ev.start || null
  if(!d) return cityOf(ev) || '—'
  const dt = new Date(d)
  const dateStr = dt.toLocaleDateString('de-DE', { weekday:'short', day:'2-digit', month:'short' })
  const timeStr = dt.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' })
  const city = cityOf(ev) || '—'
  return `${city} · ${dateStr} ${timeStr}`
}
const priceOf = (ev) => {
  if (ev.min_price === 0) return 'Gratis'
  if (typeof ev.min_price === 'number') return `ab ${Math.round(ev.min_price)}€`
  return ''
}

// --- Fetch ---
const { data: eventsTrending } = await useAsyncData(
  'public:events:trending',
  () => api.listEvents({ page_size: 12, page: 1 }).then(r => toArray(r.data)),
  { server: true }
)

const { data: eventsNew } = await useAsyncData(
  'public:events:new',
  () => api.listEvents({ page_size: 12, page: 1, date_from: new Date().toISOString() }).then(r => toArray(r.data)),
  { server: true }
)

const { data: locationsRes } = await useAsyncData(
  'public:locations',
  () => api.listLocations({}).then(r => toArray(r.data)),
  { server: true }
)

const { data: artistsRes } = await useAsyncData(
  'public:artists',
  () => api.listArtists({}).then(r => toArray(r.data)),
  { server: true }
)

// --- Map to Reel items ---
const mapEvent = (ev) => {
  const video = ev.video || ev.video_url || ev.trailer || ev.clip_url
  const img = getImage(ev, `event-${ev.id || ev.slug || ev.title || Math.random()}`)
  return {
    media: video ? { type:'video', src:String(video), poster: img } : { type:'image', src: img },
    title: ev.title || ev.name || 'Event',
    subtitle: whenOf(ev),
    priceBadge: priceOf(ev),
    tags: (ev?.festival_title ? [ev.festival_title] : (ev?.tags || [])).slice(0,2),
    to: ev.slug ? `/events/${ev.slug}` : '#',
    cornerBadge: (ev.category || (ev.festival_edition_id ? 'Festival' : 'Event')),
    cornerIcon: (ev.category || '').toLowerCase().includes('festival') || ev.festival_edition_id ? 'bi-stars' : 'bi-calendar-event',
    locationName: ev.venue || ev?.location?.name || ''
  }
}
const mapLocation = (l) => ({
  media: { type:'image', src: l.image_url || `https://picsum.photos/seed/location-${l.id || l.name}/720/1280` },
  title: l.name || 'Location',
  subtitle: l.city || '',
  priceBadge: '',
  tags: [],
  to: l.id ? `/locations/${l.id}` : '#',
  cornerBadge: 'Location',
  cornerIcon: 'bi-geo-alt',
  locationName: l.city || ''
})
const mapArtist = (a) => ({
  media: { type:'image', src: a.image_url || `https://picsum.photos/seed/artist-${a.id || a.stage_name}/720/1280` },
  title: a.stage_name || 'Artist',
  subtitle: a.city || '',
  priceBadge: '',
  tags: [],
  to: a.id ? `/artists/${a.id}` : '#',
  cornerBadge: 'Artist',
  cornerIcon: 'bi-person-music',
  locationName: a.city || ''
})

const trendingItems = computed(() => (eventsTrending.value||[]).map(mapEvent))
const newItems = computed(() => (eventsNew.value||[]).map(mapEvent))
const locationItems = computed(() => (locationsRes.value||[]).slice(0,9).map(mapLocation))
const artistItems = computed(() => (artistsRes.value||[]).slice(0,9).map(mapArtist))

// Autoplay neu initialisieren, wenn Daten / Region wechseln
onMounted(async () => {
  await nextTick()
  setupAutoplay()
})
watch([trendingItems, newItems, locationItems, artistItems, region], async () => {
  await nextTick()
  destroyAutoplay()
  setupAutoplay()
})
</script>

<template>
  <div>
    <main>
      <Hero />

      <SectionReels
        id="trending"
        title="Gerade angesagt"
        subtitle="Reels aus deiner Region"
        :items="trendingItems"
      />
      <SectionReels
        title="Neu veröffentlicht"
        light
        :items="newItems"
      />
      <SectionReels
        title="Beliebte Locations"
        subtitle="Entdecke Bühnen & Clubs"
        :items="locationItems"
        :cta="{ label:'Alle Locations', to:'/locations' }"
      />
      <SectionReels
        title="Artists & DJs"
        subtitle="Wer spielt demnächst?"
        light
        :items="artistItems"
        :cta="{ label:'Alle Artists', to:'/artists' }"
      />
    </main>
  </div>
</template>

<style scoped>
main{ background:#fff; }
</style>
