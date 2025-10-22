<!-- components/reels/ReelRail.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ReelCard from '~/components/reels/ReelCard.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  /** Maximale Kartenhöhe (Desktop). Mobile wird automatisch kleiner. */
  maxHeight: { type: Number, default: 520 },
  /** Minimale Kartenhöhe (kleine Screens). */
  minHeight: { type: Number, default: 300 },
  /** Gap zwischen Karten in px */
  gap: { type: Number, default: 12 }
})

const railViewport = ref(null)
const isDown = ref(false)
const dragMoved = ref(false)
let startX = 0, startScroll = 0, activePointerId = null

const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateSizes(){
  const vp = railViewport.value
  if (!vp) return
  const vw = window.innerWidth || 0
  const vh = Math.max(window.innerHeight || 0, 0)
  // Höhe dynamisch zwischen min/max, ungefähr 65–75% der Viewport-Höhe auf Desktop
  const target = Math.min(
    Math.max(vh * 0.72, props.minHeight),
    props.maxHeight
  )
  const mobileTarget = Math.min(Math.max(vh * 0.52, 240), props.maxHeight)
  const h = vw < 768 ? mobileTarget : target
  vp.style.setProperty('--cardH', `${Math.round(h)}px`)
  vp.style.setProperty('--gap', `${props.gap}px`)
  updateScrollState()
}

function updateScrollState(){
  const el = railViewport.value
  if (!el) { canScrollLeft.value = false; canScrollRight.value = false; return }
  const max = Math.max(el.scrollWidth - el.clientWidth, 0)
  const x = Math.max(Math.min(el.scrollLeft, max), 0)
  const EPS = 2
  canScrollLeft.value = x > EPS
  canScrollRight.value = (max - x) > EPS
}

const scrollStep = () => (railViewport.value ? railViewport.value.clientWidth * 0.9 : 400)
function railPrev(){
  const el = railViewport.value; if (!el) return
  el.scrollBy({ left: -scrollStep(), behavior: 'smooth' })
  setTimeout(updateScrollState, 320)
}
function railNext(){
  const el = railViewport.value; if (!el) return
  el.scrollBy({ left:  scrollStep(), behavior: 'smooth' })
  setTimeout(updateScrollState, 320)
}

/* Drag to scroll */
function onPointerDown(e){
  if (e.target?.closest?.('.rail-btn')) return
  const el = railViewport.value; if (!el) return
  isDown.value = true
  dragMoved.value = false
  activePointerId = e.pointerId
  startX = e.clientX
  startScroll = el.scrollLeft
  el.setPointerCapture?.(activePointerId)
}
function onPointerMove(e){
  const el = railViewport.value
  if (!el || !isDown.value || e.pointerId !== activePointerId) return
  const dx = e.clientX - startX
  if (!dragMoved.value && Math.abs(dx) >= 6) dragMoved.value = true
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
function onCardClick(evt){
  if (dragMoved.value || isDown.value) {
    evt.preventDefault()
    evt.stopPropagation()
  }
}

function onResize(){
  updateSizes()
}

onMounted(async () => {
  await nextTick()
  updateSizes()
  railViewport.value?.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  railViewport.value?.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="rail-shell">
    <!-- feste Pfeile -->
    <button class="rail-btn left" :disabled="!canScrollLeft" @click="railPrev" aria-label="nach links">
      <i class="bi bi-chevron-left"></i>
    </button>
    <button class="rail-btn right" :disabled="!canScrollRight" @click="railNext" aria-label="nach rechts">
      <i class="bi bi-chevron-right"></i>
    </button>

    <!-- horizontaler Viewport -->
    <div
      class="rail-viewport"
      ref="railViewport"
      :class="{ 'is-dragging': isDown }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <div class="rail">
        <div
          v-for="(it,idx) in items"
          :key="idx"
          class="card-wrap"
          @click="onCardClick"
          @pointerdown.stop
        >
          <ReelCard v-bind="it" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Schale (nicht scrollend), Pfeile bleiben fix */
.rail-shell{
  position: relative;
}

/* Pfeile */
.rail-btn{
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border: 0; border-radius: 999px;
  background: rgba(17,25,40,0.08); display:grid; place-items:center; z-index: 3;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
}
.rail-btn:hover{ background: rgba(17,25,40,0.14); }
.rail-btn:disabled{ opacity:.35; cursor: not-allowed; }
.rail-btn.left{ left: 8px; }
.rail-btn.right{ right: 8px; }

/* Viewport (scrollt), Scrollbar verstecken */
.rail-viewport{
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  border-radius: 14px;
  cursor: grab;
  touch-action: pan-y;
  /* Größen-Variablen (von JS befüllt) */
  --cardH: 420px;
  --gap: 12px;
  padding: 0px;
}
.rail-viewport.is-dragging{ cursor: grabbing; }
.rail-viewport::-webkit-scrollbar{ display: none; }
.rail-viewport{ scrollbar-width: none; -ms-overflow-style: none; }

/* Horizontale Rail */
.rail{
  display: flex; align-items: stretch;
  gap: var(--gap);
}

/* Karte erhält ihre Größe von der Rail */
.card-wrap{
  flex: 0 0 auto;
  height: var(--cardH);
  width: calc(var(--cardH) * 9 / 16); /* 9:16 Verhältnis */
  /* Optional: minimal/maximal begrenzen */
  max-width: min(380px, calc(var(--cardH) * 9 / 16));
}

/* Bei sehr breiten Screens: Karten etwas größer zulassen (innerhalb maxHeight) */
@media (min-width: 1400px){
  .rail-viewport{
    --cardH: calc(min(var(--cardH), 560px));
  }
}
</style>
