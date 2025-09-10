<template>
  <AnnouncementBar :items="['🌟 Neu!', '⚡ Sonderangebote!', '🚀 Kostenloser Versand ab 50€']" :speed="80" :repeatCount="8" backgroundColor="#f9cfe4" textColor="#fff" />

  <!-- HERO -->
  <section class="container-fluid px-0 my-3">
    <HeroSlider :items="featured" :autoplayMs="6000" />
  </section>

  <!-- Trending -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Trending</h2>
      <NuxtLink to="/explore" class="text-decoration-none">Alle anzeigen <i class="bi bi-arrow-right"></i></NuxtLink>
    </div>
    <ScrollRow aria-label="Trending Events">
      <EventCard v-for="ev in popular" :key="ev.id" :ev="ev" />
    </ScrollRow>
  </section>

  <!-- Für dich -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Für dich</h2>
      <span class="small small-muted">Basierend auf beliebten Kategorien</span>
    </div>
    <ScrollRow aria-label="Empfehlungen" :scroll-amount="700">
      <EventCard v-for="ev in events" :key="ev.id" :ev="ev" />
    </ScrollRow>
  </section>

  <!-- Demnächst -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Demnächst</h2>
      <NuxtLink to="/explore?sort=date" class="text-decoration-none">Kalender</NuxtLink>
    </div>
    <ScrollRow aria-label="Demnächst">
      <EventCard v-for="ev in upcoming" :key="ev.id" :ev="ev" />
    </ScrollRow>
  </section>

  <!-- Locations -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Locations</h2>
      <NuxtLink to="/explore?type=location" class="text-decoration-none">Alle Locations <i class="bi bi-arrow-right"></i></NuxtLink>
    </div>
    <ScrollRow aria-label="Locations" :scroll-amount="600">
      <LocationCard v-for="loc in locationsUi" :key="loc.id" :loc="loc" />
    </ScrollRow>
  </section>

  <!-- Künstler -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Künstler</h2>
      <NuxtLink to="/explore?type=artist" class="text-decoration-none">Alle Künstler <i class="bi bi-arrow-right"></i></NuxtLink>
    </div>
    <ScrollRow aria-label="Künstler" :scroll-amount="700">
      <ArtistCard v-for="a in artistsUi" :key="a.name" :artist="a" />
    </ScrollRow>
  </section>
</template>

<script setup>
import AnnouncementBar from "~/components/AnnouncementBar.vue";
import ScrollRow from '~/components/ui/ScrollRow.vue'
import EventCard from '~/components/ui/EventCard.vue'
import HeroSlider from '~/components/ui/HeroSlider.vue'
import LocationCard from '~/components/ui/LocationCard.vue'
import ArtistCard from '~/components/ui/ArtistCard.vue'

const api = useApi()

// Endpunkte
const EVENTS_PATH    = '/events'     // ggf. '/events/' je nach Router
const TOURS_PATH     = '/tours'      // ggf. '/tours/'
const LOCATIONS_PATH = '/locations'  // ggf. '/locations/'

// Client-only fetch zum Debuggen (du kannst später server:true setzen)
const { data: toursRes } = await useAsyncData(
  'public:tours',
  () => api.get(TOURS_PATH, { page_size: 24, only_with_upcoming: true }).then(r => r.data),
  { server: false }
)
const { data: eventsRes } = await useAsyncData(
  'public:events',
  () => api.get(EVENTS_PATH, { page_size: 48 }).then(r => r.data),
  { server: false }
)
const { data: locationsRes } = await useAsyncData(
  'public:locations',
  () => api.get(LOCATIONS_PATH).then(r => r.data),
  { server: false }
)

// Fallbacks
const tours      = computed(() => toursRes.value ?? [])
const eventsRaw  = computed(() => eventsRes.value ?? [])
const locations  = computed(() => locationsRes.value ?? [])

// Helpers
const fmt = (d) => new Date(d).toLocaleDateString('de-DE',{ day:'2-digit', month:'long' })

// Events → UI
const mapEventCard = (ev) => {
  const catPrices = ev.ticket_categories?.map(c => c.price) ?? []
  const minPrice = catPrices.length ? Math.min(...catPrices) : null
  const img = ev?.tour?.poster || ev?.tour?.image || `https://picsum.photos/seed/event-${ev.id}/640/400`
  const city = ev.city || ev?.location?.city || '—'
  const href = `/event/${ev.slug || ev.id}` // Route definieren

  return {
    id: ev.id,
    title: ev.title,
    city,
    date: ev.date,
    price: minPrice,
    img,
    tags: ev?.tour?.subtitle ? [ev.tour.subtitle] : [],
    href
  }
}
const events    = computed(() => eventsRaw.value.map(mapEventCard))
const featured  = computed(() => tours.value.slice(0, 6).map(t => ({
  id: t.id,
  title: t.title,
  subtitle: t.next_event_date ? `${(t.cities?.[0] ?? '')} • ${fmt(t.next_event_date)}` : t.subtitle || '',
  img: t.poster || t.image || `https://picsum.photos/seed/tour-${t.id}/1200/600`,
  href: `/tour/${t.slug}`,
  secondary: { label: 'Mehr Infos', href: `/tour/${t.slug}` }
})))
const upcoming  = computed(() => [...events.value].sort((a,b)=> new Date(a.date)-new Date(b.date)).slice(0,12))
const popular   = computed(() => [...events.value].sort((a,b)=> (a.price ?? Infinity)-(b.price ?? Infinity) || a.title.localeCompare(b.title)).slice(0,12))

// Locations → UI
const locationsUi = computed(() => {
  return locations.value.map(l => ({
    id: l.id,
    name: l.name,
    city: l.city || '—',
    img: `https://picsum.photos/seed/location-${l.id}/640/400`, // Platzhalter
    href: `/explore?city=${encodeURIComponent(l.city || '')}`
  }))
})

// Künstler (aus Tour-Titeln abgeleitet, bis ein Artist-Model existiert)
// Heuristik: alles vor dem ersten ' – ' oder '-' ist der Künstlername.
function extractArtist(title) {
  if (!title) return null
  const parts = title.split('–') // En-Dash
  const left = (parts[0] || title).split('-')[0]
  return left.trim()
}
const artistsUi = computed(() => {
  const map = new Map()
  for (const t of tours.value) {
    const name = extractArtist(t.title)
    if (!name) continue
    if (!map.has(name)) {
      map.set(name, {
        name,
        img: t.poster || t.image || `https://picsum.photos/seed/artist-${encodeURIComponent(name)}/640/400`,
        subtitle: t.subtitle || 'Live'
      })
    }
  }
  return Array.from(map.values())
})
</script>
