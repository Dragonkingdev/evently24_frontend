<!-- components/hero/HeroLite.vue-->
<script setup>
import { useRegion } from '~/composables/useRegion'
const { region } = useRegion()
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="copy">
        <div class="eyebrow">Jetzt & demnächst in <span class="accent">{{ region || 'deiner Region' }}</span></div>
        <h1>Entdecke Events im <span>Reels-Format</span></h1>
        <p>Scroll durch 9:16-Previews – finde Konzerte, Festivals, Theater, Nightlife und mehr. Tickets direkt sichern.</p>
        <div class="cta">
          <NuxtLink class="btn primary" to="#reels">Jetzt stöbern</NuxtLink>
          <NuxtLink class="btn ghost" to="/explore"><i class="bi bi-compass"></i> Explore</NuxtLink>
        </div>
      </div>
      <div class="poster"></div>
    </div>
  </section>
</template>

<style scoped>
:root{ --accent:#5b7cfa; --accent-2:#3b57c9; }
.hero{
  padding: 1.25rem 0 0;
  background: radial-gradient(1200px 600px at 0% -10%, rgba(91,124,250,.25), transparent),
              radial-gradient(1200px 600px at 100% -10%, rgba(91,124,250,.25), transparent),
              linear-gradient(180deg, #ffffff 0%, #f9faff 100%);
}
.container{ width:min(1200px, 94vw); margin:0 auto; display:grid; grid-template-columns: 1.1fr .9fr; gap:1rem; align-items:center; }
@media (max-width: 992px){ .container{ grid-template-columns: 1fr; } }
.copy .eyebrow{ font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; color:#6c7a91; }
.accent{ color:var(--accent); }
h1{ font-size: clamp(1.8rem, 3.8vw, 3rem); font-weight:900; }
h1 span{ color:var(--accent); }
p{ color:#475569; }
.cta{ display:flex; gap:.6rem; margin-top:.5rem; }
.btn{ border-radius:12px; padding:.6rem .9rem; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:.4rem; }
.primary{ background:var(--accent); color:#fff; }
.primary:hover{ background:var(--accent-2); }
.ghost{ border:1px solid #e5e7eb; color:#111827; background:#fff; }
.poster{
  aspect-ratio: 9/16; border-radius:20px; background:
    linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.4)),
    url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat;
  box-shadow: 0 10px 30px rgba(2,6,23,.15);
}
</style>
