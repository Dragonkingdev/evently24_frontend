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

  <!-- Festivals -->
  <section class="container-fluid my-4">
    <div class="d-flex justify-content-between align-items-end mb-2">
      <h2 class="h5 mb-0">Festivals</h2>
      <NuxtLink to="/explore?type=festival" class="text-decoration-none">
        Alle Festivals <i class="bi bi-arrow-right"></i>
      </NuxtLink>
    </div>
    <ScrollRow aria-label="Festivals" :scroll-amount="700">
      <FestivalCard v-for="f in festivalsUi" :key="f.id" :festival="f" />
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
import FestivalCard from '~/components/ui/FestivalCard.vue'
import LocationCard from '~/components/ui/LocationCard.vue'
import ArtistCard from '~/components/ui/ArtistCard.vue'

const api = useApi()

/** -----------------------------------
 * Endpunkte
 * ---------------------------------- */
const EVENTS_PATH     = '/v1/public/events'
const FESTIVALS_PATH  = '/v1/public/festivals'
const LOCATIONS_PATH  = '/v1/public/locations'
const PROFILES_PATH   = '/v1/public/profiles'

/** -----------------------------------
 * Utils
 * ---------------------------------- */
// API-Responses robust in Arrays verwandeln (array | {items|results|data|events})
function toArray(x) {
  if (!x) return []
  if (Array.isArray(x)) return x
  return x.items || x.results || x.data || x.events || []
}

// Datums-Helper (nimmt das erstbeste vorhandene Feld)
function getEventDate(ev) {
  return ev.date || ev.start_date || ev.starts_at || ev.datetime || ev.start || null
}
// Preis-Helper (unterstützt price, price_cents, amount, value, etc.)
function getMinPrice(ev) {
  const cats = ev.ticket_categories || ev.tickets || ev.categories || []
  const vals = cats
    .map(c => c?.price ?? c?.price_value ?? (c?.price_cents != null ? c.price_cents / 100 : null))
    .filter(v => typeof v === 'number' && !Number.isNaN(v))
  return vals.length ? Math.min(...vals) : null
}
// Bild-Helper
function getImage(obj, seed) {
  return (
    obj?.image ||
    obj?.poster ||
    obj?.cover ||
    obj?.cover_url ||
    obj?.avatar ||
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/400`
  )
}
const fmt = (d) => new Date(d).toLocaleDateString('de-DE',{ day:'2-digit', month:'long' })

/** -----------------------------------
 * Fetch (SSR-tauglich)
 * ---------------------------------- */
const { data: eventsRes } = await useAsyncData(
  'public:events',
  () => api.get(EVENTS_PATH, { page_size: 48, page: 1 }).then(r => r.data),
  { server: true }
)

const { data: festivalsRes } = await useAsyncData(
  'public:festivals',
  () => api.get(FESTIVALS_PATH, { page_size: 24, page: 1 /* , year: new Date().getFullYear() */ }).then(r => r.data),
  { server: true }
)

const { data: locationsRes } = await useAsyncData(
  'public:locations',
  () => api.get(LOCATIONS_PATH, { page_size: 48, page: 1 }).then(r => r.data),
  { server: true }
)

const { data: profilesRes } = await useAsyncData(
  'public:profiles',
  () => api.get(PROFILES_PATH, { page_size: 48, page: 1 }).then(r => r.data),
  { server: true }
)

/** -----------------------------------
 * Normalisierte Collections
 * ---------------------------------- */
const eventsRaw    = computed(() => toArray(eventsRes.value))
const festivalsRaw = computed(() => toArray(festivalsRes.value))
const locations    = computed(() => toArray(locationsRes.value))
const profiles     = computed(() => toArray(profilesRes.value)) // -> Artists

/** -----------------------------------
 * Mapping: Events -> UI
 * ---------------------------------- */
const mapEventCard = (ev) => {
  const minPrice = getMinPrice(ev)
  const img = getImage(ev, `event-${ev.id || ev.slug || ev.title || Math.random()}`)
  const date = getEventDate(ev)
  const city = ev.city || ev?.location?.city || ev?.venue?.city || '—'
  const href = `/event/${ev.slug || ev.id}`

  return {
    id: ev.id || ev.slug || cryptoRandomId(),
    title: ev.title || ev.name || 'Event',
    city,
    date,
    price: minPrice,
    img,
    tags: ev?.festival_title ? [ev.festival_title] : (ev?.tags || []).slice(0, 2),
    href
  }
}

// Fallback-ID-Generator (nur falls id/slug fehlt)
function cryptoRandomId(){
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2)
}

const events = computed(() => eventsRaw.value.map(mapEventCard))

// Featured: nimm die nächsten 6 kommenden Events
const featured = computed(() => {
  const items = [...events.value]
    .filter(e => e.date) // nur mit Datum
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6)
    .map(e => ({
      id: e.id,
      title: e.title,
      subtitle: (e.city && e.date) ? `${e.city} • ${fmt(e.date)}` : '',
      img: e.img,
      href: e.href,
      secondary: { label: 'Mehr Infos', href: e.href }
    }))
  return items
})

const upcoming = computed(() => {
  const now = Date.now()
  return [...events.value]
    .filter(e => e.date && new Date(e.date).getTime() >= now)
    .sort((a,b)=> new Date(a.date)-new Date(b.date))
    .slice(0,12)
})

const popular = computed(() => {
  return [...events.value]
    .sort((a,b)=> (a.price ?? Infinity)-(b.price ?? Infinity) || a.title.localeCompare(b.title))
    .slice(0,12)
})

/** -----------------------------------
 * Mapping: Festivals -> UI
 * ---------------------------------- */
function getFestivalDates(f) {
  // versucht sinnvolle Felder in richtige Reihenfolge
  const start = f.start_date || f.starts_at || f.start || null
  const end   = f.end_date   || f.ends_at   || f.end   || null
  const year  = f.year || (start ? new Date(start).getFullYear() : null)
  return { start, end, year }
}
function formatRange(start, end, locale = 'de-DE') {
  if (!start && !end) return ''
  const d1 = start ? new Date(start) : null
  const d2 = end   ? new Date(end)   : null
  if (d1 && d2) {
    const sameMonth = d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    if (sameMonth) {
      // z.B. 05–07. Juni 2025
      return `${d1.toLocaleDateString(locale,{ day:'2-digit' })}–${d2.toLocaleDateString(locale,{ day:'2-digit', month:'long', year:'numeric' })}`
    }
    // z.B. 28. Mai – 02. Juni 2025
    return `${d1.toLocaleDateString(locale,{ day:'2-digit', month:'long' })} – ${d2.toLocaleDateString(locale,{ day:'2-digit', month:'long', year:'numeric' })}`
  }
  const one = d1 || d2
  return one.toLocaleDateString(locale, { day:'2-digit', month:'long', year:'numeric' })
}

const festivalsUi = computed(() => {
  return festivalsRaw.value.map(f => {
    const { start, end, year } = getFestivalDates(f)
    const city = f.city || f?.location?.city || f?.venue?.city || f?.address?.city || '—'
    const img  = getImage(f, `festival-${f.id || f.slug || f.title}`)
    const href = `/festival/${f.slug || f.id || encodeURIComponent(f.title || '')}`
    return {
      id: f.id || f.slug || cryptoRandomId(),
      title: f.title || f.name || 'Festival',
      city,
      dateLabel: start || end ? formatRange(start, end) : (year ? String(year) : ''),
      img,
      tags: [city].filter(Boolean),
      href
    }
  })
})


/** -----------------------------------
 * Mapping: Locations -> UI
 * ---------------------------------- */
const locationsUi = computed(() => {
  return locations.value.map(l => ({
    id: l.id || l.slug,
    name: l.name || l.title || 'Location',
    city: l.city || l?.address?.city || '—',
    img: getImage(l, `location-${l.id || l.slug || l.name}`),
    href: `/explore?type=location&city=${encodeURIComponent(l.city || '')}`
  }))
})

/** -----------------------------------
 * Mapping: Artists (aus PROFILES)
 * ---------------------------------- */
const artistsUi = computed(() => {
  // Primär: Profiles-API
  const fromProfiles = profiles.value.map(p => ({
    name: p.name || p.title || p.slug || 'Artist',
    img: getImage(p, `artist-${p.id || p.slug || p.name}`),
    subtitle: p.tagline || p.city || 'Live',
    href: `/artist/${encodeURIComponent(p.slug || p.name)}`
  }))

  if (fromProfiles.length) return fromProfiles

  // Fallback: heuristisch aus Festivals
  const map = new Map()
  for (const f of festivalsRaw.value) {
    const title = f.title || f.name
    if (!title) continue
    const parts = title.split('–')
    const left = (parts[0] || title).split('-')[0].trim()
    const key = left.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        name: left,
        img: getImage(f, `artist-${left}`),
        subtitle: f.subtitle || 'Live'
      })
    }
  }
  return Array.from(map.values())
})
</script>
