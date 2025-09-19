<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  whenWhere: { type: String, required: true },
  priceBadge: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  media: {
    type: Object,
    required: true,
    validator (v) { return ['video','image'].includes(v?.type) && typeof v?.src === 'string' }
  },
  variant: { type: String, default: 'auto' },
  uniform: { type: Boolean, default: true },
  mediaHeight: { type: [Number, String], default: 220 },

  /* Kategorie-Badge oben links */
  category: { type: String, default: '' },          // z.B. "Festival", "Club", "Theater"
  categoryIcon: { type: String, default: '' },      // z.B. "bi-stars"
  categoryBadgeClass: { type: String, default: 'pill text-bg-light' },

  /* Routing */
  eventSlug: { type: String, default: '' },         // /event/[slug]
  locationName: { type: String, default: '' },
  locationSlug: { type: String, default: '' }       // /location/[slug]
})

const imgEl = ref(null)
const videoEl = ref(null)
const detectedOrientation = ref('landscape')

const effectiveVariant = computed(() => {
  if (props.variant === 'portrait') return 'portrait'
  if (props.variant === 'default') return 'default'
  const orient = props.media.orientation || detectedOrientation.value
  return orient === 'portrait' ? 'portrait' : 'landscape'
})

function detectFromImage (el){
  const w = el?.naturalWidth || 0, h = el?.naturalHeight || 0
  if (w && h) detectedOrientation.value = h > w ? 'portrait' : 'landscape'
}
function detectFromVideo (el){
  const w = el?.videoWidth || 0, h = el?.videoHeight || 0
  if (w && h) detectedOrientation.value = h > w ? 'portrait' : 'landscape'
}

watch(() => props.media, async () => {
  await nextTick()
  if (props.media?.type === 'image' && imgEl.value?.complete) detectFromImage(imgEl.value)
}, { immediate: true, deep: true })

onMounted(() => {
  if (props.media?.orientation) {
    detectedOrientation.value = props.media.orientation === 'portrait' ? 'portrait' : 'landscape'
  }
})

const mediaH = computed(() =>
  typeof props.mediaHeight === 'number' ? `${props.mediaHeight}px` : (props.mediaHeight || '220px')
)

/* route targets */
const eventTo = computed(() =>
  props.eventSlug ? `/event/${encodeURIComponent(props.eventSlug)}` : null
)
const locationTo = computed(() =>
  props.locationSlug ? `/location/${encodeURIComponent(props.locationSlug)}` : ''
)
</script>

<template>
  <!-- FULL-CARD LINK nur wenn eventSlug vorhanden -->
  <NuxtLink v-if="eventTo" :to="eventTo" custom v-slot="{ navigate, href }">
    <article
      class="card event-card"
      :class="[{ 'is-portrait': effectiveVariant==='portrait', 'is-uniform': uniform }]"
      :style="uniform ? {'--card-media-h': mediaH} : null"
      role="link"
      :aria-label="`Zum Event: ${title}`"
      :href="href"
      tabindex="0"
      @click="navigate"
      @keydown.enter.prevent="navigate"
      @keydown.space.prevent="navigate"
    >
      <!-- MEDIA -->
      <div class="media-wrap" :class="{ 'ratio-portrait': !uniform && effectiveVariant==='portrait' }">
        <video
          v-if="media.type==='video'"
          ref="videoEl"
          data-autoplay
          muted playsinline preload="metadata"
          :poster="media.poster"
          @loadedmetadata="detectFromVideo($event.target)"
        >
          <source :src="media.src" type="video/mp4">
        </video>
        <img v-else ref="imgEl" :src="media.src" :alt="title" @load="detectFromImage($event.target)" />

        <!-- KATEGORIE-BADGE: oben links -->
        <div v-if="category" class="media-badge" aria-hidden="true">
          <span class="badge" :class="categoryBadgeClass" :title="`Kategorie: ${category}`">
            <i v-if="categoryIcon" class="bi" :class="categoryIcon"></i>
            <span class="ms-1" v-if="categoryIcon">{{ category }}</span>
            <span v-else>{{ category }}</span>
          </span>
        </div>

        <!-- leichte Abdunklung unten -->
        <div class="overlay-grad"></div>

        <!-- CTA (Tickets) – Click stoppt den Full-Card-Link -->
        <div class="card-cta">
          <NuxtLink :to="eventTo" class="btn btn-sm btn-light" @click.stop>
            <i class="bi bi-ticket-perforated"></i> Tickets
          </NuxtLink>
          <button class="btn btn-sm btn-outline-light" aria-label="Teilen" @click.stop>
            <i class="bi bi-share"></i>
          </button>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="card-body">
        <h5 class="card-title" :class="{ 'line-clamp-2': uniform || effectiveVariant==='portrait' }">
          {{ title }}
        </h5>

        <p class="card-text text-secondary mb-2 d-flex align-items-center gap-1 small">
          <i class="bi bi-geo-alt"></i>
          <template v-if="locationSlug && locationName">
            <NuxtLink :to="locationTo" class="text-reset fw-semibold location-link" @click.stop>
              {{ locationName }}
            </NuxtLink>
            <span class="text-body-secondary">•</span>
            <span class="small">{{ whenWhere }}</span>
          </template>
          <template v-else>
            {{ whenWhere }}
          </template>
        </p>

        <div class="d-flex flex-wrap gap-2 mt-auto">
          <span v-if="priceBadge" class="badge rounded-pill text-bg-primary">{{ priceBadge }}</span>
          <span v-for="(t,i) in tags" :key="i" class="badge rounded-pill text-bg-light text-secondary">{{ t }}</span>
        </div>
      </div>
    </article>
  </NuxtLink>

  <!-- Fallback ohne Full-Card-Link -->
  <article v-else
    class="card event-card"
    :class="[{ 'is-portrait': effectiveVariant==='portrait', 'is-uniform': uniform }]"
    :style="uniform ? {'--card-media-h': mediaH} : null"
    aria-label="Eventkarte"
  >
    <div class="media-wrap" :class="{ 'ratio-portrait': !uniform && effectiveVariant==='portrait' }">
      <video
        v-if="media.type==='video'"
        ref="videoEl"
        data-autoplay
        muted playsinline preload="metadata"
        :poster="media.poster"
        @loadedmetadata="detectFromVideo($event.target)"
      >
        <source :src="media.src" type="video/mp4">
      </video>
      <img v-else ref="imgEl" :src="media.src" :alt="title" @load="detectFromImage($event.target)" />

      <!-- KATEGORIE-BADGE: oben links -->
      <div v-if="category" class="media-badge" aria-hidden="true">
        <span class="badge" :class="categoryBadgeClass" :title="`Kategorie: ${category}`">
          <i v-if="categoryIcon" class="bi" :class="categoryIcon"></i>
          <span class="ms-1" v-if="categoryIcon">{{ category }}</span>
          <span v-else>{{ category }}</span>
        </span>
      </div>

      <div class="overlay-grad"></div>
    </div>

    <div class="card-body">
      <h5 class="card-title" :class="{ 'line-clamp-2': uniform || effectiveVariant==='portrait' }">
        {{ title }}
      </h5>

      <p class="card-text text-secondary mb-2 d-flex align-items-center gap-1 small">
        <i class="bi bi-geo-alt"></i>
        <template v-if="locationSlug && locationName">
          <NuxtLink :to="locationTo" class="text-reset fw-semibold location-link">
            {{ locationName }}
          </NuxtLink>
          <span class="text-body-secondary">•</span>
          <span class="small">{{ whenWhere }}</span>
        </template>
        <template v-else>
          {{ whenWhere }}
        </template>
      </p>

      <div class="d-flex flex-wrap gap-2 mt-auto">
        <span v-if="priceBadge" class="badge rounded-pill text-bg-primary">{{ priceBadge }}</span>
        <span v-for="(t,i) in tags" :key="i" class="badge rounded-pill text-bg-light text-secondary">{{ t }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Card */
.event-card{
  position: relative;
  cursor: pointer;
  border:0; border-radius:1rem; overflow:hidden; background:#fff;
  box-shadow:0 12px 40px rgba(0,0,0,.08);
  transition: transform .25s ease, box-shadow .25s ease;
  height:100%;
  display:flex; flex-direction:column;
}
.event-card:hover{ transform: translateY(0px); box-shadow:0 20px 60px rgba(0,0,0,.12); }

/* Media */
.media-wrap{ position:relative; overflow:hidden; aspect-ratio:16/9; }
.media-wrap.ratio-portrait{ aspect-ratio:3/4; }
.is-uniform .media-wrap{ aspect-ratio:auto; height: var(--card-media-h); }
.media-wrap img, .media-wrap video{ width:100%; height:100%; object-fit:cover; display:block; }

/* Kategorie-Badge – oben links */
.media-badge{
  position:absolute;  
  top:.6rem;
  left:.6rem;
  z-index:3;
}  

.pill{
  backdrop-filter: blur(6px);
  background: rgba(255,255,255,.85);
  border:1px solid rgba(255,255,255,.6);
  border-radius: 999px;
  padding: .35rem .65rem;
  font-weight: 600;
}

/* Overlay & CTA */
.overlay-grad{
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%);
  z-index:1;           
}
.card-cta{ position:absolute; bottom:.75rem; left:.75rem; display:flex; gap:.5rem; z-index:3; }

/* Portrait-Variante & Truncation */
.event-card.is-portrait .card-body{ padding:.9rem .9rem 1rem; }
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

/* Elemente über der Full-Card-Link-Ebene halten */
.card-cta > *,
.location-link{ position: relative; z-index: 3; }
</style>
