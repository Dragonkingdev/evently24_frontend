<!-- components/new/Hero.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

/* --- Dummy Events --- */
const events = ref([
  { id: 1, title: 'Sunset House @ Riverside', city: 'Köln',        starts_at: '2025-11-02T20:00:00Z', media:{ type:'video', src:'https://www.w3schools.com/html/mov_bbb.mp4', poster:'https://picsum.photos/seed/event-1/720/1280' }, to:'/event/sunset-house' },
  { id: 2, title: 'Techno Night – Warehouse', city: 'Düsseldorf',  starts_at: '2025-11-05T22:00:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-2/720/1280' }, to:'/event/sunset-house' },
  { id: 3, title: 'Indie Live: Midnight Stories', city: 'Bonn',    starts_at: '2025-11-08T19:30:00Z', media:{ type:'video', src:'https://www.w3schools.com/html/movie.mp4', poster:'https://picsum.photos/seed/event-3/720/1280' }, to:'/event/sunset-house' },
  { id: 4, title: 'Open Air @ Stadtpark',       city: 'Leverkusen',starts_at: '2025-11-12T18:00:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-4/720/1280' }, to:'/event/sunset-house' },
  { id: 5, title: 'DJ Set: Night Shift',        city: 'Koblenz',   starts_at: '2025-11-15T23:00:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-5/720/1280' }, to:'/event/sunset-house' },
  { id: 6, title: 'Funk & Soul Evening',        city: 'Aachen',    starts_at: '2025-11-18T20:30:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-6/720/1280' }, to:'/event/sunset-house' },
  { id: 7, title: 'Electro Swing Circus',       city: 'Köln',      starts_at: '2025-11-20T21:00:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-7/720/1280' }, to:'/event/sunset-house' },
  { id: 8, title: 'Lo-Fi Chill Sessions',       city: 'Bonn',      starts_at: '2025-11-22T19:00:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-8/720/1280' }, to:'/event/sunset-house' },
  { id: 9, title: 'Hip-Hop Block Party',        city: 'Düsseldorf',starts_at: '2025-11-24T18:30:00Z', media:{ type:'image', src:'https://picsum.photos/seed/event-9/720/1280' }, to:'/event/sunset-house' }
])

/* --- Left Reel Slider (Tablet/Desktop) --- */
const i = ref(0)
const current = computed(() => events.value[i.value] || null)
const prev = () => { i.value = (i.value - 1 + events.value.length) % events.value.length }
const next = () => { i.value = (i.value + 1) % events.value.length }

let leftTimer
const LEFT_AUTOPLAY_MS = 60000
const startLeft = () => { stopLeft(); leftTimer = window.setInterval(next, LEFT_AUTOPLAY_MS) }
const stopLeft  = () => { if (leftTimer) window.clearInterval(leftTimer); leftTimer = null }

let touchStartX = 0
const onKey = (e) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
const onTouchStart = (e) => { touchStartX = e.changedTouches?.[0]?.clientX || 0 }
const onTouchEnd = (e) => { const dx = (e.changedTouches?.[0]?.clientX || 0) - touchStartX; if (Math.abs(dx) > 40) (dx > 0 ? prev() : next()) }

/* --- Left: 9:16 Größen-Constraint (nur ≥768px sichtbar) --- */
const leftColEl = ref(null)
const mediaStyle = ref({ width: '100%', height: 'auto' })
const reelHeight = ref(520)
let ro

function calcMediaSize() {
  const w = window.innerWidth || 0
  if (w < 768) { reelHeight.value = 0; updateRailViewport(); return }
  if (!leftColEl.value) return
  const colWidth = leftColEl.value.getBoundingClientRect().width
  const vh = Math.max(window.innerHeight || 0, 0)
  const maxH = Math.min(Math.max(vh * 0.78, 420), 880)
  const width = Math.min(colWidth, maxH * (9/16))
  const height = width * (16/9)
  mediaStyle.value = { width: `${width}px`, height: `${height}px` }
  reelHeight.value = Math.round(height)
  nextTick(() => { updateRailViewport() })
}

/* --- Right Rail: FINITE, separates Overlay + Viewport --- */
const railViewport = ref(null)      // NUR dieses Element scrollt jetzt
const tilesPerCol = ref(2)

// Spalten (FINITE)
const columnsBase = computed(() => {
  const t = tilesPerCol.value || 2
  const out = []
  for (let k = 0; k < events.value.length; k += t) out.push(events.value.slice(k, k + t))
  return out
})

// Scroll-Status (für Pfeil-Disable)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const updateScrollState = () => {
  const el = railViewport.value
  if (!el) { canScrollLeft.value = false; canScrollRight.value = false; return }
  const max = Math.max(el.scrollWidth - el.clientWidth, 0)
  const x = Math.max(Math.min(el.scrollLeft, max), 0)
  const EPS = 2
  canScrollLeft.value = x > EPS
  canScrollRight.value = (max - x) > EPS
}

// Drag-Status
const isDown = ref(false)
const dragMoved = ref(false)
let startX = 0, startScroll = 0, activePointerId = null
const DRAG_THRESHOLD_PX = 6

function updateRailViewport() {
  const w = window.innerWidth || 0
  const vh = Math.max(window.innerHeight || 0, 0)
  const mobileH = Math.min(Math.max(vh * 0.60, 300), 640)
  const leftH   = Math.max(320, Math.min(reelHeight.value || 0, 820))
  const h = (w < 768) ? mobileH : leftH

  if (railViewport.value) {
    railViewport.value.style.height = `${h}px`
    railViewport.value.style.setProperty('--gap', '12px')
    railViewport.value.style.setProperty('--tiles', '2')
  }
  nextTick(updateScrollState)
}

const scrollStep = () => (railViewport.value ? railViewport.value.clientWidth * 0.9 : 400)
function railPrev(){
  const el = railViewport.value
  if (!el) return
  el.scrollBy({ left: -scrollStep(), behavior: 'smooth' })
  setTimeout(updateScrollState, 320)
}
function railNext(){
  const el = railViewport.value
  if (!el) return
  el.scrollBy({ left:  scrollStep(), behavior: 'smooth' })
  setTimeout(updateScrollState, 320)
}

/* Pointer Events – Drag + Click-Gate (FINITE)
   WICHTIG: Buttons nicht abfangen! */
function onPointerDown(e){
  // Wenn Pfeil/Button geklickt wurde, Drag nicht starten
  if (e.target?.closest?.('.rail-btn')) return
  const el = railViewport.value
  if (!el) return
  isDown.value = true
  dragMoved.value = false
  activePointerId = e.pointerId
  startX = e.clientX
  startScroll = el.scrollLeft
  el.setPointerCapture?.(activePointerId)
  // e.preventDefault() NICHT nötig; Drag funktioniert ohne Clicks zu killen
  stopRailAuto()
}
function onPointerMove(e){
  const el = railViewport.value
  if (!el || !isDown.value || e.pointerId !== activePointerId) return
  const dx = e.clientX - startX
  if (!dragMoved.value && Math.abs(dx) >= DRAG_THRESHOLD_PX) dragMoved.value = true
  el.scrollLeft = startScroll - dx
  updateScrollState()
}
function onPointerUp(e){
  const el = railViewport.value
  if (!el || e.pointerId !== activePointerId) return
  isDown.value = false
  activePointerId = null
  el.releasePointerCapture?.(e.pointerId)
  requestAnimationFrame(() => { dragMoved.value = false })
  updateScrollState()
  startRailAuto()
}
function onPointerCancel(e){
  const el = railViewport.value
  if (!el || e.pointerId !== activePointerId) return
  isDown.value = false
  activePointerId = null
  el.releasePointerCapture?.(e.pointerId)
  dragMoved.value = false
  updateScrollState()
}

/* Click-Gate: nur navigieren, wenn KEIN Drag stattfand */
function onTileClick(evt){
  if (dragMoved.value || isDown.value) {
    evt.preventDefault()
    evt.stopPropagation()
  }
}

/* Auto-Scroll (Ping-Pong) */
let rightTimer
const RIGHT_AUTOSCROLL_MS = 4000
let autoDir = 1 // 1 = rechts, -1 = links
function tickAuto(){
  const el = railViewport.value
  if (!el) return
  const max = Math.max(el.scrollWidth - el.clientWidth, 0)
  const atStart = el.scrollLeft <= 2
  const atEnd = el.scrollLeft >= (max - 2)
  if (atEnd) autoDir = -1
  if (atStart) autoDir = 1
  el.scrollBy({ left: autoDir * scrollStep() * 0.75, behavior: 'smooth' })
  setTimeout(updateScrollState, 320)
}
function startRailAuto(){ stopRailAuto(); rightTimer = window.setInterval(tickAuto, RIGHT_AUTOSCROLL_MS) }
function stopRailAuto(){ if (rightTimer) window.clearInterval(rightTimer); rightTimer = null }

/* helpers */
const whenOf = (ev) => {
  const d = ev?.starts_at ? new Date(ev.starts_at) : null
  if (!d) return ev?.city || '—'
  const dateStr = d.toLocaleDateString('de-DE', { weekday:'short', day:'2-digit', month:'short' })
  const timeStr = d.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' })
  return `${ev?.city || '—'} · ${dateStr} ${timeStr}`
}

function onResize(){
  calcMediaSize()
  updateRailViewport()
  updateScrollState()
}

onMounted(() => {
  startLeft()
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  ro = new ResizeObserver(calcMediaSize)
  if (leftColEl.value) ro.observe(leftColEl.value)
  calcMediaSize()
  updateRailViewport()
  startRailAuto()
  nextTick(updateScrollState)
  // Scroll-Listener
  railViewport.value?.addEventListener('scroll', updateScrollState, { passive: true })
})
onBeforeUnmount(() => {
  stopLeft()
  stopRailAuto()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  if (ro && leftColEl.value) ro.unobserve(leftColEl.value)
  railViewport.value?.removeEventListener('scroll', updateScrollState)
})
</script>

<template>
  <section class="hero-reels py-3 py-lg-4">
    <div class="container-xxl">
      <div class="hero-flex">
        <!-- LEFT -->
        <div class="left d-none d-md-block" ref="leftColEl">
          <div
            class="reel position-relative rounded-4 overflow-hidden"
            :style="mediaStyle"
            @mouseenter="stopLeft" @mouseleave="startLeft"
            @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
          >
            <NuxtLink :to="current?.to || '#'" class="d-block text-decoration-none w-100 h-100">
              <div class="w-100 h-100">
                <video
                  v-if="current?.media?.type === 'video'"
                  class="w-100 h-100 object-fit-cover"
                  :poster="current?.media?.poster || ''"
                  :key="'vid-' + current?.id"
                  autoplay muted playsinline loop
                >
                  <source :src="current?.media?.src" type="video/mp4" />
                </video>
                <img
                  v-else
                  class="w-100 h-100 object-fit-cover"
                  :src="current?.media?.src"
                  :alt="current?.title"
                  :key="'img-' + current?.id"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            </NuxtLink>

            <div class="overlay-info p-3 p-lg-4 text-white">
              <div class="badge bg-black-50 fw-semibold mb-2">Reel</div>
              <h2 class="h4 fw-bold mb-1">{{ current?.title }}</h2>
              <p class="small opacity-90 mb-0">{{ whenOf(current) }}</p>
            </div>

            <button class="nav-btn prev" aria-label="Vorheriges Reel" @click="prev"><i class="bi bi-chevron-left"></i></button>
            <button class="nav-btn next" aria-label="Nächstes Reel" @click="next"><i class="bi bi-chevron-right"></i></button>
          </div>
        </div>

        <!-- RIGHT: FINITE -->
        <div class="right">
          <div class="rail-shell position-relative rounded-4 w-100">
            <!-- Feste Overlay-Pfeile (bewegen sich NICHT mit) -->
            <button
              class="rail-btn left"
              :disabled="!canScrollLeft"
              @click="railPrev"
              @pointerdown.stop
              aria-label="Scroll nach links"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <button
              class="rail-btn right"
              :disabled="!canScrollRight"
              @click="railNext"
              @pointerdown.stop
              aria-label="Scroll nach rechts"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

            <!-- Separater Scroll-Viewport -->
            <div
              class="rail-viewport"
              ref="railViewport"
              :class="{ 'is-dragging': isDown }"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerCancel"
              @mouseenter="stopRailAuto"
              @mouseleave="startRailAuto"
            >
              <div class="rail">
                <div
                  v-for="(col, cIdx) in columnsBase"
                  :key="'col-' + cIdx"
                  class="col-stack"
                >
                  <NuxtLink
                    v-for="e in col"
                    :key="e.id + '-in-' + cIdx"
                    :to="e.to"
                    class="tile-9x16 d-block text-decoration-none position-relative rounded-4 overflow-hidden"
                    @pointerdown.stop="onPointerDown"
                    @click="onTileClick"
                  >
                    <div class="w-100 h-100">
                      <img
                        v-if="e.media?.type !== 'video'"
                        :src="e.media?.src"
                        :alt="e.title"
                        class="w-100 h-100 object-fit-cover"
                        loading="lazy"
                        draggable="false"
                      />
                      <video
                        v-else
                        class="w-100 h-100 object-fit-cover"
                        muted
                        playsinline
                        :poster="e.media?.poster"
                        draggable="false"
                      >
                        <source :src="e.media?.src" type="video/mp4" />
                      </video>
                    </div>
                    <div class="tile-info small">
                      <div class="fw-bold text-truncate">{{ e.title }}</div>
                      <div class="opacity-90 text-truncate">{{ whenOf(e) }}</div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- /rail-viewport -->
          </div>
        </div>
      </div> <!-- /hero-flex -->
    </div>
  </section>
</template>

<style scoped>
.hero-reels{
  background:
    radial-gradient(1200px 600px at 0% -10%, rgba(91,124,250,.10), transparent),
    radial-gradient(1200px 600px at 100% -10%, rgba(91,124,250,.10), transparent),
    linear-gradient(180deg, #ffffff 0%, #f7f8ff 100%);
}

/* --- Flex-Layout --- */
.hero-flex{ display: flex; gap: 12px; align-items: stretch; }
.left{ flex: 0 0 auto; }
.right{ flex: 1 1 auto; min-width: 0; }

@media (max-width: 767.98px){
  .hero-flex{ flex-direction: column; }
}

/* --- Left reel --- */
.reel .overlay-info{
  position: absolute; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.65) 75%);
}
.bg-black-50{ background: rgba(18, 24, 40, .5); }

.nav-btn{
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border: 0; border-radius: 999px;
  background: rgba(255,255,255,.9); display:grid; place-items:center;
  box-shadow: 0 6px 18px rgba(0,0,0,.15);
  z-index: 2;
}
.nav-btn.prev{ left: .5rem; } .nav-btn.next{ right: .5rem; }

/* --- Right Rail Shell (NICHT scrollend) --- */
.rail-shell{
  position: relative;
}

/* Feste Pfeile oben drauf */
.rail-btn{
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 999px; border: 0;
  background: rgba(17,25,40,0.08); display:grid; place-items:center; z-index: 3;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
}
.rail-btn:hover{ background: rgba(17,25,40,0.14); }
.rail-btn:disabled{ opacity: .35; cursor: not-allowed; }
.rail-btn.left{ left: 6px; } .rail-btn.right{ right: 6px; }

/* Scroll-Viewport (nur hier scrollt es) */
.rail-viewport{
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;                    /* echte Höhe via JS */
  --gap: 12px;
  --tiles: 2;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  cursor: grab;
  touch-action: pan-y;
  border-radius: 0.75rem;          /* gleiche Rundung wie Shell */
}

/* Scrollbar komplett verstecken */
.rail-viewport::-webkit-scrollbar{ display: none; }
.rail-viewport{ scrollbar-width: none; }          /* Firefox */
.rail-viewport{ -ms-overflow-style: none; }       /* IE/Edge Legacy */

.rail-viewport.is-dragging{ cursor: grabbing; }

/* Rail-Inhalt */
.rail{
  height: 100%;
  display: flex; align-items: stretch;
  gap: var(--gap);
}

/* Spalte */
.col-stack{
  height: 100%;
  display: flex; flex-direction: column; gap: var(--gap);
  flex: 0 0 auto;
  scroll-snap-align: start;
}

/* 9:16-Kachel */
.tile-9x16{
  height: calc((100% - (var(--gap) * (var(--tiles) - 1))) / var(--tiles));
  aspect-ratio: 9 / 16;
  background: #f3f5ff;
  box-shadow: 0 6px 16px rgba(0,0,0,.06);
  position: relative;
  transition: box-shadow .15s ease;
}

/* Info-Badge */
.tile-info{
  width: 100%;
  position: absolute; bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 85%);
  color: #fff; padding: .90rem 1.10rem; border-radius: .6rem;
}

/* Snap (optional) */
.rail-viewport{ scroll-snap-type: x proximity; }

/* Media-Fit */
.object-fit-cover{ object-fit: cover; }
</style>
