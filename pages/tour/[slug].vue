<template>
  <div v-if="tour">
    <!-- HERO -->
    <section class="tour-hero">
      <div
        class="hero-bg"
        :style="tour.image ? { backgroundImage: `url(${tour.image})` } : {}"
      ></div>
      <div class="hero-overlay"></div>

      <div class="container-fluid hero-content py-5">
        <div class="row align-items-end">
          <!-- linke Seite -->
          <div class="col-lg-7 text-white">
            <h1 class="display-6 fw-bold mb-2">{{ tour.title }}</h1>
            <p class="lead mb-3">{{ tour.subtitle }}</p>

            <div class="d-flex flex-wrap gap-3 small mb-2" v-if="tour.range || tour.eventsCount">
              <span v-if="tour.range"><i class="bi bi-calendar-week"></i> {{ tour.range }}</span>
              <span v-if="tour.range && tour.eventsCount">•</span>
              <span v-if="tour.eventsCount">{{ tour.eventsCount }} Events</span>
            </div>

            <div class="d-flex align-items-center gap-2 small mb-3" v-if="tour.rating">
              <span>
                <i v-for="(f,i) in stars(tour.rating?.value)" :key="i" class="bi" :class="f?'bi-star-fill':'bi-star'"></i>
              </span>
              <span>({{ tour.rating?.count || 0 }})</span>
            </div>

            <div class="small mb-3" v-if="tour.teaser">{{ tour.teaser }}</div>

            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-primary btn-lg">Termine ansehen</button>
              <button
                class="btn btn-outline-light btn-lg"
                @click="showMore = !showMore"
                :aria-expanded="showMore.toString()"
                aria-controls="tour-more"
              >
                <i class="bi" :class="showMore ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                {{ showMore ? 'Weniger' : 'Mehr' }} Informationen
              </button>
            </div>
          </div>

          <!-- Plakat rechts -->
          <div class="col-lg-5 d-none d-lg-block" v-if="tour.poster || tour.image">
            <div class="hero-poster-wrap">
              <img
                class="hero-poster"
                :src="tour.poster || tour.image"
                :alt="`${tour.title} – Plakat`"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mehr-Infos -->
    <section id="tour-more" v-show="showMore" class="bg-body-tertiary border-top border-bottom">
      <div class="container-fluid py-4">
        <div class="row g-4">
          <div class="col-lg-7">
            <h2 class="h5 mb-3">Über die Tour</h2>
            <p class="mb-0" v-if="tour.description">{{ tour.description }}</p>
            <p class="mb-0 text-muted" v-else>Keine weiteren Informationen verfügbar.</p>
          </div>

          <div class="col-lg-5" v-if="videoIds.length">
            <h3 class="h6 mb-3">Videos</h3>
            <div v-for="(vid, idx) in videoIds" :key="idx" class="ratio ratio-16x9 mb-3">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${vid}`"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TOOLBAR -->
    <div class="container-fluid py-3">
      <!-- ... unverändert ... -->
      <div class="small-muted mt-4">{{ events.length }} Events</div>
    </div>

    <!-- LISTE -->
    <div class="container-fluid pb-5">
      <TicketRow v-for="ev in events" :key="ev.id" :ev="ev" />
    </div>
  </div>
</template>

<script setup>
import TicketRow from '~/components/tour/TicketRow.vue'
import { createError } from 'h3'
import { useToursApi } from '~/composables/useToursApi'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { getTourBySlug } = useToursApi()

// SSR + CSR: lädt Tour + Events, wirft 404 sauber
const { data, error } = await useAsyncData(
  () => `tour:${slug.value}`,
  async () => {
    if (!slug.value) return null
    const { data, error } = await getTourBySlug(slug.value, { withEvents: true })
    if (error?.statusCode === 404 || error?.status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Tour nicht gefunden' })
    }
    if (error) throw error
    return data
  },
  { watch: [slug] }
)

// VON API empfangenes Tour-Objekt (oder null)
//const tour = computed(() => data.value || null)
//mit dummy daten zum Testen
const tour = computed(() => {
  const t = data.value
  if (!t) return null
  return {
    ...t,
    rating: t.rating ?? { value: 4.8, count: 19 },
    range: t.range ?? 'Mai 2024 – Dez 2024',
    eventsCount: t.eventsCount ?? (Array.isArray(t.events) ? t.events.length : 0),
    teaser: t.teaser ?? 'Erleben Sie unvergessliche Momente mit unserer exklusiven Tour!',
    poster: t.poster ?? t.image,
  }
})

const events = computed(() => {
  const list = Array.isArray(tour.value?.events) ? tour.value.events : []
  return list.filter(e => e && typeof e === 'object')
})

// Sterne sicher
function stars (n) {
  const full = Math.round(n || 0)
  return Array.from({ length: 5 }).map((_, i) => i < full)
}

const showMore = ref(false)

const videoIds = computed(() => {
  const t = tour.value
  const src = Array.isArray(t?.videos) && t.videos.length ? t.videos : (t?.youtube ? [t.youtube] : [])
  return src.map(v => {
    if (!v) return null
    try {
      const u = new URL(v, 'https://dummy.base')
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '')
      if (u.hostname.includes('youtube')) {
        const params = new URLSearchParams(u.search)
        return params.get('v') || null
      }
    } catch { return v }
    return v
  }).filter(Boolean)
})
</script>

<style scoped>
/* Hero */
.tour-hero{ position: relative; background: #000; }
.hero-bg{
  position:absolute; inset:0; background-size:cover; background-position:center;
  filter: saturate(1.1) contrast(1.05);
}
.hero-overlay{
  position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.2) 100%);
}
.hero-content{ position: relative; color: #fff; }
.small-muted{ color: var(--muted); }

/* Poster rechts im Hero */
.hero-poster-wrap{
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
  padding: 1rem 0;
}
.hero-poster{
  width: min(380px, 90%);
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: .5rem;
  box-shadow:
    0 8px 30px rgba(0,0,0,.45),
    0 2px 6px rgba(0,0,0,.35);
  /* „stehend“ Look, leicht angewinkelt (dezent) */
  transform: rotate(-1.2deg);
  background: #111;
}

/* Mehr-Infos Bereich smooth ein-/ausblenden */
#tour-more{
  transition: opacity .25s ease;
}
#tour-more[style*="display: none"]{
  opacity: 0;
}
</style>
