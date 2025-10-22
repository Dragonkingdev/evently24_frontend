<!-- components/reels/ReelCard.vue -->
<script setup>
const props = defineProps({
  media: { type: Object, required: true }, // { type:'image'|'video', src, poster? }
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  priceBadge: { type: String, default: '' },
  tags: { type: Array, default: () => [] },
  to: { type: String, default: '#' },
  cornerBadge: { type: String, default: '' },
  cornerIcon: { type: String, default: '' },
  locationName: { type: String, default: '' },
})
</script>

<template>
  <NuxtLink :to="to" class="reel">
    <div class="media">
      <img v-if="media.type==='image'" class="ph" :src="media.src" :alt="title">
      <video v-else class="ph" preload="metadata" :poster="media.poster||''" muted loop playsinline data-autoplay>
        <source :src="media.src" type="video/mp4">
      </video>

      <div v-if="cornerBadge" class="corner">
        <i v-if="cornerIcon" :class="['bi', cornerIcon]" />
        <span>{{ cornerBadge }}</span>
      </div>

      <div class="grad">
        <div class="line1">{{ title }}</div>
        <div class="line2">{{ subtitle }}</div>
        <div class="meta">
          <span v-if="priceBadge" class="pill">{{ priceBadge }}</span>
          <span v-for="(t,i) in (tags||[]).slice(0,2)" :key="i" class="pill alt">{{ t }}</span>
          <span v-if="locationName" class="pill alt"><i class="bi bi-geo-alt"></i> {{ locationName }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.reel{
  display:block; position:relative; width:100%; height:100%;
  border-radius: 18px; overflow:hidden;
  background:#fff; box-shadow: 0 8px 28px rgba(2,6,23,.08);
  transform: translateZ(0);
}
.media{ position:relative; width:100%; height:100%; }
.ph{
  width:100%; height:100%; object-fit:cover; display:block;
  transition: transform .45s cubic-bezier(.2,.8,.2,1);
}
.reel:hover .ph{ transform: scale(1.035); }
.grad{
  position:absolute; left:0; right:0; bottom:0; padding: .9rem .9rem 1rem;
  color:#fff;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(2,6,23,.65) 65%, rgba(2,6,23,.85) 100%);
}
.line1{ font-weight:800; font-size:1.05rem; line-height:1.2; margin-bottom:.1rem; }
.line2{ opacity:.9; margin-bottom:.4rem; font-size:.9rem;}
.meta{ display:flex; flex-wrap:wrap; gap:.35rem; }
.pill{
  display:inline-flex; align-items:center; gap:.35rem;
  background:#fff; color:#111827; border-radius:999px; padding:.25rem .5rem; font-weight:700; font-size:.75rem;
}
.pill.alt{ background:rgba(255,255,255,.85); }
.corner{
  position:absolute; top:.55rem; left:.55rem; display:flex; align-items:center; gap:.35rem;
  background:rgba(17,24,39,.7); color:#fff; border-radius:999px; padding:.25rem .5rem; font-weight:700; font-size:.75rem;
  backdrop-filter: blur(4px);
}
</style>
