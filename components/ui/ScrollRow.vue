<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // Wie weit pro Klick gescrollt wird (px)
  scrollAmount: { type: Number, default: 600 },
  // Scrollbar visuell verstecken
  hideScrollbar: { type: Boolean, default: true },
  // ARIA Label für Screenreader
  ariaLabel: { type: String, default: 'Horizontaler Slider' }
})

const wrap = ref(null)
const inner = ref(null)
const canLeft = ref(false)
const canRight = ref(false)

function update() {
  const el = wrap.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  const sl = el.scrollLeft
  canLeft.value = sl > 0
  canRight.value = sl < (maxScroll - 1)
}

function scrollByDir(dir) {
  const el = wrap.value
  if (!el) return
  el.scrollBy({ left: dir * props.scrollAmount, behavior: 'smooth' })
}

let ro
function onScroll(){ requestAnimationFrame(update) }

onMounted(() => {
  update()
  wrap.value?.addEventListener('scroll', onScroll, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(update)
    wrap.value && ro.observe(wrap.value)
    inner.value && ro.observe(inner.value)
  }
  window.addEventListener('resize', update)
})

onBeforeUnmount(() => {
  wrap.value?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', update)
  ro?.disconnect?.()
})
</script>

<template>
  <div class="scroll-row position-relative">
    <!-- Left -->
    <button
      v-show="canLeft"
      class="scroll-btn left btn btn-light rounded-circle shadow-sm"
      type="button"
      @click="scrollByDir(-1)"
      aria-label="Zurück"
    >
      <i class="bi bi-chevron-left"></i>
    </button>

    <!-- Track -->
    <div
      class="scroll-wrap"
      :class="{ 'hide-scrollbar': hideScrollbar }"
      ref="wrap"
      role="region"
      :aria-label="ariaLabel"
    >
      <div class="scroll-inner" ref="inner">
        <slot />
      </div>
    </div>

    <!-- Right -->
    <button
      v-show="canRight"
      class="scroll-btn right btn btn-light rounded-circle shadow-sm"
      type="button"
      @click="scrollByDir(1)"
      aria-label="Weiter"
    >
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>

<style scoped>
/* Track */
.scroll-wrap{
  overflow-x: auto;
  overflow-y: hidden; /* <- kein y-overflow */
  white-space: nowrap;
}
.scroll-inner{
  display: flex;
  gap: 1rem;
  padding-bottom: .5rem;
}

/* Scrollbar verstecken (optional) */
.hide-scrollbar::-webkit-scrollbar{ height: 0px; }
.hide-scrollbar{ scrollbar-width: none; -ms-overflow-style: none; }

/* Buttons */
.scroll-btn{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px; height: 42px;
  display: grid; place-items: center;
  border: 1px solid var(--ring);
  z-index: 10;
}
.scroll-btn.left{ left: .25rem; }
.scroll-btn.right{ right: .25rem; }

/* Pfeile auf kleinsten Screens ausblenden (optional) */
@media (max-width: 575.98px){
  .scroll-btn{ display: none; }
}
</style>
