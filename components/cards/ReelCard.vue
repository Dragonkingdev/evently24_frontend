<!-- components/cards/ReelCard.vue -->
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  priceBadge: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  media: { type: Object, default: () => ({ type:'image', src:'', poster:'' }) },
  to: { type: [String, Object], default: '#' },
  locationName: { type: String, default: '' },
  actionPrimaryLabel: { type: String, default: 'Tickets' },
  onPrimary: { type: Function, default: null },
  onSave: { type: Function, default: null }
})

const el = ref(null)
let io = null

function handleIntersect(entries){
  const v = el.value?.querySelector('video')
  if(!v) return
  entries.forEach(({ isIntersecting }) => {
    if(isIntersecting) { v.muted = true; v.playsInline = true; v.play?.().catch(()=>{}) }
    else v.pause?.()
  })
}

onMounted(()=>{
  const v = el.value?.querySelector('video')
  if(v){
    io = new IntersectionObserver(handleIntersect, { threshold: .65 })
    io.observe(el.value)
  }
})
onBeforeUnmount(()=> io?.disconnect?.())

function clickPrimary(e){
  e.preventDefault()
  if (props.onPrimary) props.onPrimary()
}
function clickSave(e){
  e.preventDefault()
  if (props.onSave) props.onSave()
}
</script>

<template>
  <div class="reel-card" ref="el">
    <component :is="to ? 'NuxtLink' : 'div'" :to="to" class="reel-media">
      <template v-if="media?.type === 'video' && media?.src">
        <video preload="metadata" loop playsinline :poster="media.poster || ''"></video>
        <source :src="media.src" type="video/mp4" />
      </template>
      <img v-else :src="media?.src" alt="" />
    </component>

    <div class="reel-overlay">
      <div class="reel-top">
        <span v-if="priceBadge" class="pill">{{ priceBadge }}</span>
        <div class="tags" v-if="tags?.length">
          <span class="tag" v-for="(t,i) in tags.slice(0,2)" :key="i">{{ t }}</span>
        </div>
      </div>

      <div class="reel-bottom">
        <div class="meta">
          <h5 class="title">{{ title }}</h5>
          <p class="subtitle">{{ subtitle }}</p>
          <p v-if="locationName" class="location"><i class="bi bi-geo"></i> {{ locationName }}</p>
        </div>
        <div class="actions">
          <button class="app-btn app-btn-primary" @click="clickPrimary"><i class="bi bi-ticket-perforated"></i> {{ actionPrimaryLabel }}</button>
          <button class="app-btn app-btn-ghost" @click="clickSave"><i class="bi bi-bookmark"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root{
  --app-brand:#5b7cfa; --app-brand-2:#3b57c9;
  --app-soft:#f5f7ff; --app-ink:#0f172a; --app-ink-2:#475569; 
  --app-surface:#fff; --app-border:#e5e7eb;
}
.reel-card{
  position: relative;
  width: 100%;
  aspect-ratio: 9/16; /* 9:16 */
  border-radius: 20px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 10px 30px rgba(2,6,23,.15);
}
.reel-media, .reel-media > img, .reel-media > video{
  display:block; width:100%; height:100%; object-fit: cover;
}
.reel-overlay{
  position:absolute; inset:0; display:flex; flex-direction:column; justify-content:space-between; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,.35) 35%, rgba(0,0,0,.6) 75%);
}
.reel-top{ display:flex; justify-content:space-between; align-items:center; gap:.5rem; padding:.75rem .75rem 0 .75rem; }
.pill{
  pointer-events: auto; background: rgba(255,255,255,.9); color:#111827; padding:.25rem .5rem; border-radius: 999px; font-weight:700; font-size:.8rem;
}
.tags{ display:flex; gap:.35rem; }
.tag{ pointer-events:auto; background: rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.25); color:#fff; padding:.1rem .45rem; border-radius:999px; font-weight:600; font-size:.75rem; }
.reel-bottom{ padding: .75rem; pointer-events: none; }
.meta{ color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.4); }
.title{ margin:0 0 .15rem 0; font-size:1.05rem; font-weight:800; }
.subtitle{ margin:0 0 .25rem 0; font-size:.9rem; color:rgba(255,255,255,.85);}
.location{ margin:0 0 .5rem 0; font-size:.85rem; color:rgba(255,255,255,.85);}
.actions{ display:flex; align-items:center; gap:.5rem; }
.app-btn{ pointer-events:auto; border:1px solid var(--app-border); border-radius:12px; padding:.45rem .7rem; background:#fff; font-weight:700; }
.app-btn-primary{ background:var(--app-brand); color:#fff; border-color:transparent; }
.app-btn-ghost{ background: rgba(255,255,255,.15); color:#fff; border-color:rgba(255,255,255,.25); }
.app-btn-primary:hover{ background:var(--app-brand-2); }
</style>
