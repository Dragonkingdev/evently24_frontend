<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import EventCard from '~/components/new/cards/EventCard.vue'

// Region (z. B. "Koblenz")
const region = useState('region')

// API
const api = useApi()
const EVENTS_PATH = '/v1/public/events'

// ---------- Helpers (aus deinem Index, leicht gekürzt) ----------
const toArray = (x) => Array.isArray(x) ? x : (x?.items || x?.results || x?.data || x?.events || [])
const getEventDate = (ev) => ev.date || ev.start_date || ev.starts_at || ev.datetime || ev.start || null
const getMinPrice = (ev) => {
  const cats = ev.ticket_categories || ev.tickets || ev.categories || []
  const vals = cats.map(c => c?.price ?? c?.price_value ?? (c?.price_cents != null ? c.price_cents / 100 : null))
                   .filter(v => typeof v === 'number' && !Number.isNaN(v))
  return vals.length ? Math.min(...vals) : null
}
const getImage = (obj, seed='event') =>
  obj?.image || obj?.poster || obj?.cover || obj?.cover_url || obj?.avatar ||
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1280/800`

const cityOf = (ev) => ev.city || ev?.location?.city || ev?.venue?.city || ev?.address?.city || ''
const hasTag = (ev, needles=[]) => {
  const tags = (ev?.tags || []).map(t => String(t).toLowerCase())
  return needles.some(n => tags.includes(n))
}
const inferCategory = (ev) => {
  if (ev.festival || ev.festival_id || hasTag(ev, ['festival'])) return { label:'Festival', icon:'bi-stars' }
  if (hasTag(ev, ['club','nightlife','techno','party']))          return { label:'Club',     icon:'bi-music-note-beamed' }
  if (hasTag(ev, ['theater','bühne']))                            return { label:'Theater',  icon:'bi-collection-play' }
  if (hasTag(ev, ['comedy','kabarett']))                          return { label:'Comedy',   icon:'bi-emoji-laughing' }
  if (hasTag(ev, ['stadtfest','kultur','kulturfest']))            return { label:'Kulturfest',icon:'bi-people' }
  return { label:'Event', icon:'bi-calendar-event' }
}
const formatWhenWhere = (ev) => {
  const d = getEventDate(ev)
  const city = cityOf(ev) || '—'
  if (!d) return `${city}`
  const dt = new Date(d)
  const dateStr = dt.toLocaleDateString('de-DE', { weekday:'short', day:'2-digit', month:'short' })
  const timeStr = dt.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' })
  return `${city} · ${dateStr} ${timeStr}`
}
const priceBadgeOf = (ev) => {
  const p = getMinPrice(ev)
  if (p === 0) return 'Gratis'
  if (typeof p === 'number') return `ab ${Math.round(p)}€`
  return ''
}


// ---------- Fetch ----------
const { data: eventsRes } = await useAsyncData(
  'public:events:trending',
  () => api.get(EVENTS_PATH, { page_size: 6, page: 1 }).then(r => r.data),
  { server: true }
)
const eventsRaw = computed(() => toArray(eventsRes.value))

// ---------- Mapping: API -> EventCard Items ----------
const mapped = computed(() => {
  return eventsRaw.value.map(ev => {
    const eventSlug = ev.slug || String(ev.id)
    const loc  = ev.location || ev.venue || {}
    const img = getImage(ev, `event-${ev.id || ev.slug || ev.title || Math.random()}`)
    const { label, icon } = inferCategory(ev)

    // Media (Video falls vorhanden, sonst Bild)
    const video = ev.video || ev.video_url || ev.trailer || ev.clip_url
    const media = video
      ? { type:'video', src:String(video), poster: img, orientation: 'landscape' }
      : { type:'image', src: img, orientation: (ev.image_orientation || ev.cover_orientation || 'landscape') }

    // Variant + uniform
    const variant = (media.orientation === 'portrait') ? 'portrait' : 'default'
    const uniform = variant !== 'portrait'

    // NEW: price & category direkt aus API
    const priceBadge =
      ev.min_price === 0
        ? 'Gratis'
        : (typeof ev.min_price === 'number' ? `ab ${Math.round(ev.min_price)}€` : '')

    const catRaw = (ev.category || '').toLowerCase()
    const category = catRaw
      ? catRaw.charAt(0).toUpperCase() + catRaw.slice(1)
      : (ev.festival_edition_id ? 'Festival' : 'Event')

    const iconMap = {
      festival: 'bi-stars',
      club: 'bi-music-note-beamed',
      comedy: 'bi-emoji-laughing',
      kulturfest: 'bi-people',
      theater: 'bi-collection-play',
      event: 'bi-calendar-event'
    }
    const categoryIcon = iconMap[(catRaw || (ev.festival_edition_id ? 'festival' : 'event'))] || 'bi-calendar-event'

    return {
      id: ev.id || ev.slug || cryptoRandomId(),
      eventSlug: eventSlug,

      title: ev.title || ev.name || 'Event',
      whenWhere: formatWhenWhere(ev),
      priceBadge,
      tags: (ev?.festival_title ? [ev.festival_title] : (ev?.tags || [])).slice(0,2),

      category,
      categoryIcon,
      categoryBadgeClass: 'text-bg-light pill',

      locationName: loc.name || loc.title || '',
      locationSlug: loc.slug || '',

      media,
      variant,
      uniform,

      _city: cityOf(ev)
    }
  })
})
function cryptoRandomId(){
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2)
}

// Region-Filter (fallback auf alle, wenn keine Treffer)
const filteredByRegion = computed(() => {
  const r = String(region.value || '').trim().toLowerCase()
  if (!r) return mapped.value
  const list = mapped.value.filter(i => String(i._city || '').toLowerCase().includes(r))
  return list.length ? list : mapped.value
})

// Optional: leichte Sortierung (zuerst mit Datum -> dann günstiger)
const items = computed(() => {
  return [...filteredByRegion.value]
    .sort((a,b) => {
      // parse date aus whenWhere? besser direkt aus raw ev – hier simpel nach Preis dann Titel
      const ap = a.priceBadge?.match(/\d+/)?.[0]
      const bp = b.priceBadge?.match(/\d+/)?.[0]
      const pa = ap ? Number(ap) : Infinity
      const pb = bp ? Number(bp) : Infinity
      return (pa - pb) || a.title.localeCompare(b.title)
    })
})

// ---------- Video Autoplay Observer ----------
let io = null
const mountObserver = () => {
  const vids = Array.from(document.querySelectorAll('video[data-autoplay]'))
  vids.forEach(v => { v.muted = true; v.playsInline = true })
  io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const v = target
      if (isIntersecting) v.play?.().catch(()=>{})
      else v.pause?.()
    })
  }, { threshold: .5 })
  vids.forEach(v => io.observe(v))
}

onMounted(async () => {
  await nextTick()
  mountObserver()
})
watch(items, async () => {
  await nextTick()
  io?.disconnect?.()
  mountObserver()
})
onBeforeUnmount(() => { io?.disconnect?.() })
</script>

<template>
  <section class="py-4">
    <div class="container-fluid container-xxl">
      <div class="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h2 class="section-title mb-0">
            Gerade angesagt in <span class="text-primary">{{ region }}</span>
          </h2>
          <p class="subtitle mb-0">Autoplay-Previews ziehen dich rein – scrolle weiter für mehr.</p>
        </div>
        <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#filters">
          <i class="bi bi-funnel"></i> Mehr Filter
        </button>
      </div>

      <div class="masonry gap-3">
        <div v-for="it in items" :key="it.id" class="masonry-item">
          <EventCard
            :title="it.title"
            :when-where="it.whenWhere"
            :price-badge="it.priceBadge"
            :tags="it.tags"
            :media="it.media"
            :variant="it.variant"
            :uniform="it.uniform"
            :media-height="it.variant==='portrait' ? 360 : 220"
            :category="it.category"
            :category-icon="it.categoryIcon"
            :category-badge-class="it.categoryBadgeClass"
            :eventSlug="it.eventSlug"               
            :location-name="it.locationName"         
            :location-slug="it.locationSlug"       
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-title{font-weight:800;}
.subtitle{color:#64748b;}

/* Masonry: 1/2/3 Spalten */
.masonry{ column-count: 1; column-gap: 1.5rem; }
@media (min-width: 540px){ .masonry{ column-count: 2; } }
@media (min-width: 992px){ .masonry{ column-count: 3; } }

.masonry-item{
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  display:inline-block;
  width:100%;
  margin: 0 0 1.5rem;
}
</style>
