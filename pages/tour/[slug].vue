<template>
  <div>
    <!-- HERO -->
    <section class="tour-hero">
      <div class="hero-bg" :style="{ backgroundImage: `url(${tour.image})` }"></div>
      <div class="hero-overlay"></div>

      <div class="container-fluid hero-content py-5">
        <div class="row align-items-end">
          <!-- Textlinke Seite -->
          <div class="col-lg-7 text-white">
            <h1 class="display-6 fw-bold mb-2">{{ tour.title }}</h1>
            <p class="lead mb-3">{{ tour.subtitle }}</p>

            <div class="d-flex flex-wrap gap-3 small mb-2">
              <span><i class="bi bi-calendar-week"></i> {{ tour.range }}</span>
              <span>•</span>
              <span>{{ tour.eventsCount }} Events</span>
            </div>

            <div class="d-flex align-items-center gap-2 small mb-3">
              <span>
                <i v-for="(f,i) in stars(tour.rating.value)" :key="i" class="bi" :class="f?'bi-star-fill':'bi-star'"></i>
              </span>
              <span>({{ tour.rating.count }})</span>
            </div>

            <div class="small mb-3">{{ tour.teaser }}</div>

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

          <!-- Plakat rechte Seite -->
          <div class="col-lg-5 d-none d-lg-block">
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

    <!-- Mehr-Infos (aufklappbar) -->
    <section id="tour-more" v-show="showMore" class="bg-body-tertiary border-top border-bottom">
      <div class="container-fluid py-4">
        <div class="row g-4">
          <div class="col-lg-7">
            <h2 class="h5 mb-3">Über die Tour</h2>
            <p class="mb-0" v-if="tour.description">{{ tour.description }}</p>
            <p class="mb-0 text-muted" v-else>Keine weiteren Informationen verfügbar.</p>
          </div>

          <div class="col-lg-5" v-if="(tour.videos && tour.videos.length) || tour.youtube">
            <h3 class="h6 mb-3">Videos</h3>

            <!-- Array aus IDs oder Voll-URLs unterstützen -->
            <div
              v-for="(vid, idx) in videoIds"
              :key="idx"
              class="ratio ratio-16x9 mb-3"
            >
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
      <div class="d-flex flex-wrap justify-content-between align-items-center small-muted">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-telephone"></i>
          <span>Bestell-Hotline: 01806-570070 (0,20 €/Anruf inkl. MwSt aus dem dt. Festnetz; Mobilfunk max. 0,60 €/Anruf) • Mo.–Sa.: 9–18 Uhr</span>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="d-flex align-items-center gap-2">
          <NuxtLink to="/tours" class="text-decoration-none"><i class="bi bi-arrow-left"></i> Alle Touren</NuxtLink>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-calendar3 me-1"></i> Kalender</button>
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-sliders me-1"></i> Filter</button>
        </div>
      </div>

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
import { useCatalog } from '~/composables/useCatalog'

const route = useRoute()
const { getTourBySlug } = useCatalog()

const tour = getTourBySlug(route.params.slug)
if (!tour) throw createError({ statusCode: 404, statusMessage: 'Tour nicht gefunden' })

// Liste direkt aus der Tour ziehen:
const events = tour.events

function stars (n) {
  const full = Math.round(n || 0)
  return Array.from({ length: 5 }).map((_, i) => i < full)
}

// Aufklapp-Status
const showMore = ref(false)

// Video-IDs robust extrahieren (unterstützt IDs oder komplette URLs)
const videoIds = computed(() => {
  const src = Array.isArray(tour.videos) && tour.videos.length
    ? tour.videos
    : (tour.youtube ? [tour.youtube] : [])
  return src
    .map(v => {
      if (!v) return null
      // Voll-URL?
      try {
        const u = new URL(v, 'https://dummy.base') // fallback für nackte IDs
        if (u.hostname.includes('youtube') || u.hostname.includes('youtu.be')) {
          // youtu.be/<id> oder youtube.com/watch?v=<id>
          if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '')
          const params = new URLSearchParams(u.search)
          return params.get('v') || null
        }
      } catch (e) {
        // war wohl eine nackte ID
        return v
      }
      // sonst als ID verwenden
      return v
    })
    .filter(Boolean)
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
