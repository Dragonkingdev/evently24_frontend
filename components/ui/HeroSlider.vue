<template>
  <section class="hero-banner" @mouseenter="pause" @mouseleave="play" aria-label="Featured Events">
    <div class="slides" :style="trackStyle" ref="track">
      <article
        v-for="(it, i) in items"
        :key="it.id || i"
        class="slide"
        role="group"
        :aria-roledescription="'slide ' + (i+1) + ' von ' + items.length"
        :aria-label="it.title"
      >
        <!-- Bild / Video -->
        <div class="media">
          <!-- Optional: Video-Hero -->
          <video
            v-if="it.video"
            :src="it.video"
            class="media-el"
            :poster="it.img"
            loop muted playsinline preload="metadata"
            ref="videoEls"
          ></video>
          <!-- Fallback: Bild -->
          <img
            v-else
            class="media-el"
            :src="it.img"
            :alt="it.title"
            loading="eager"
            decoding="async"
          />
          <!-- Overlay/Gradient -->
          <div class="overlay"></div>

          <!-- Text-Block -->
          <div class="caption container-fluid">
            <div class="caption-inner">
              <h2 class="display-6 display-md-5 fw-bold mb-2">{{ it.title }}</h2>
              <p v-if="it.subtitle" class="lead mb-3">{{ it.subtitle }}</p>
              <div class="d-flex gap-2 flex-wrap">
                <NuxtLink :to="it.href || `/event/${it.id}`" class="btn btn-light btn-lg">
                  Tickets sichern
                </NuxtLink>
                <NuxtLink v-if="it.secondary"
                          :to="it.secondary.href"
                          class="btn btn-outline-light btn-lg">
                  {{ it.secondary.label }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Navigation -->
    <button class="nav prev" @click="prev" aria-label="Zurück"><i class="bi bi-chevron-left"></i></button>
    <button class="nav next" @click="next" aria-label="Weiter"><i class="bi bi-chevron-right"></i></button>

    <!-- Dots -->
    <div class="dots" role="tablist">
      <button
        v-for="(it, i) in items"
        :key="'dot-'+(it.id || i)"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
        :aria-label="'Gehe zu Slide ' + (i+1)"
        role="tab"
        :aria-selected="i === index"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true }, // [{id,title,subtitle,img,href,secondary?,video?}]
  autoplayMs: { type: Number, default: 6000 },
  aspect: { type: String, default: '21/9' } // '21/9' | '16/9'
})

const index = ref(0)
let timer = null
const track = ref(null)
const videoEls = ref([])

const trackStyle = computed(() => ({
  transform: `translateX(-${index.value * 100}%)`
}))

function next(){ index.value = (index.value + 1) % props.items.length }
function prev(){ index.value = (index.value - 1 + props.items.length) % props.items.length }
function go(i){ index.value = i }

function play(){
  stop()
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (props.items.length > 1 && !prefersReduced) {
    timer = setInterval(() => next(), props.autoplayMs)
  }
}
function pause(){ stop() }
function stop(){ if (timer) { clearInterval(timer); timer = null } }

function handleKey(e){
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => {
  play()
  window.addEventListener('keydown', handleKey)

  // Touch/Drag für Mobile
  let sx = 0, dx = 0, dragging = false
  const el = track.value
  const onDown = (e) => { dragging = true; sx = (e.touches?.[0]?.clientX ?? e.clientX); dx = 0; pause() }
  const onMove = (e) => {
    if (!dragging) return
    const x = (e.touches?.[0]?.clientX ?? e.clientX)
    dx = x - sx
    el.style.transition = 'none'
    el.style.transform = `translateX(calc(-${index.value * 100}% + ${dx}px))`
  }
  const onUp = () => {
    if (!dragging) return
    el.style.transition = ''
    if (Math.abs(dx) > 80) { dx < 0 ? next() : prev() }
    el.style.transform = ''
    dragging = false
    play()
  }
  el.addEventListener('mousedown', onDown)
  el.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  el.addEventListener('touchstart', onDown, { passive: true })
  el.addEventListener('touchmove', onMove, { passive: true })
  el.addEventListener('touchend', onUp)

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('keydown', handleKey)
    el.removeEventListener('mousedown', onDown)
    el.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    el.removeEventListener('touchstart', onDown)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('touchend', onUp)
  })
})

watch(index, (i) => {
  // Video-Steuerung: aktives Video spielen, andere pausieren
  const vids = videoEls.value || []
  vids.forEach((v, idx) => {
    if (!v) return
    if (idx === i) v.play?.().catch(()=>{})
    else v.pause?.()
  })
})

watch(() => props.items, () => { index.value = 0; play() })
</script>

<style scoped>
.hero-banner{
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 1rem;
}

.slides{
  display: flex;
  transition: transform .5s ease;
  will-change: transform;
}

.slide{
  width: 100%;
  flex-shrink: 0;
}

.media{
  position: relative;
  width: 100%;
  /* großes Banner-Format, anpassbar: */
  aspect-ratio: var(--hero-aspect, 21 / 9);
  background: #000;
  overflow: hidden;
}

.media-el{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}

.overlay{
  position: absolute; inset: 0;
  background: linear-gradient( to right, rgba(0,0,0,.55) 0%, rgba(0,0,0,.25) 35%, rgba(0,0,0,0) 60%),
              linear-gradient( to top,   rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 30%, rgba(0,0,0,0) 60%);
  pointer-events: none;
}

.caption{
  position: absolute; inset: 0;
  display: grid; align-items: center;
  padding-left: clamp(16px, 6vw, 72px); padding-right: clamp(12px, 4vw, 48px);
}
.caption-inner{
  max-width: min(820px, 92vw);
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,.35);
}

.nav{
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px;
  border-radius: 999px; border: none;
  display: grid; place-items: center;
  background: rgba(17,17,17,.5); color:#fff;
  backdrop-filter: blur(4px);
}
.nav:hover{ background: rgba(17,17,17,.75); }
.prev{ left: 10px; }
.next{ right: 10px; }

.dots{
  position: absolute; left:0; right:0; bottom: 10px;
  display: flex; gap: 8px; justify-content: center;
}
.dot{
  width: 8px; height: 8px; border-radius: 999px; border: 0;
  background: rgba(255,255,255,.45);
}
.dot.active{
  background: #fff; width: 18px; border-radius: 6px; transition: width .2s ease;
}

/* Aspect ratio prop -> CSS var */
:host, .hero-banner { --hero-aspect: 21 / 9; }
</style>
