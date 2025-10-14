<!-- components/new/Hero.vue -->
<script setup>
import { useRegion } from '~/composables/useRegion'
const { region } = useRegion()

const openRegion = useState('regionModalOpen')
const openFilters = useState('filtersOpen')
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <div class="content">
        <div class="eyebrow">Jetzt & demnächst in <span>{{ region }}</span></div>
        <h1>Entdecke Events im <span>Reels-Format</span>.</h1>
        <p>Scroll wie durch Stories: 9:16 Video-/Bild-Reels für Events, Locations & Artists. Tickets direkt sichern.</p>

        <div class="actions">
          <NuxtLink to="#trending" class="btn brand"><i class="bi bi-ticket-perforated"></i> Jetzt stöbern</NuxtLink>
          <button class="btn ghost" @click="openRegion=true"><i class="bi bi-geo"></i> Region ändern</button>
          <button class="btn ghost" @click="openFilters=true"><i class="bi bi-funnel"></i> Filter</button>
        </div>

        <div class="chips">
          <span class="chip active">Heute Abend</span>
          <span class="chip">Dieses Wochenende</span>
          <span class="chip">Für dich</span>
          <span class="chip">Open Air</span>
          <span class="chip">Nightlife</span>
        </div>
      </div>
      <div class="art">
        <div class="card"></div>
        <div class="card b"></div>
        <div class="card c"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:root{
  --brand:#5b7cfa; --brand-dark:#3b57c9; --soft:#f5f7ff;
}
.hero{
  background:
    radial-gradient(1200px 600px at 0% -10%, rgba(91,124,250,.25), transparent),
    radial-gradient(1200px 600px at 100% -10%, rgba(91,124,250,.25), transparent),
    linear-gradient(180deg, #ffffff 0%, #f9faff 100%);
  padding: 1.5rem 0 1rem;
}
.wrap{ max-width:1320px; margin:0 auto; padding:0 1rem; display:grid; gap:2rem; grid-template-columns: 1.1fr .9fr; align-items:center; }
@media (max-width: 992px){ .wrap{ grid-template-columns: 1fr; } }
.eyebrow{font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; color:#6c7a91;}
h1{ font-size: clamp(1.8rem, 2.2vw + 1rem, 3rem); font-weight:900; letter-spacing:-.01em; }
h1 span{ color:var(--brand); }
p{ color:#475467; max-width:52ch; }
.actions{ display:flex; gap:.5rem; flex-wrap:wrap; margin:.75rem 0; }
.btn{ border-radius:12px; padding:.65rem .9rem; border:1px solid transparent; font-weight:800; }
.btn.brand{ background:var(--brand); border-color:var(--brand); color:#fff;}
.btn.brand:hover{ background:var(--brand-dark); border-color:var(--brand-dark);}
.btn.ghost{ background:#fff; border-color:#e9ecf5; }
.btn.ghost:hover{ background:#f8faff; border-color:#dfe6ff; }
.chips{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.25rem; }
.chip{ border-radius:999px; padding:.35rem .8rem; border:1px solid #e9ecf5; background:#fff; font-weight:700; }
.chip.active{ background:var(--soft); border-color:#dfe6ff; color:#2e3a8c; }

.art{ position:relative; height: 420px; }
@media (max-width: 992px){ .art{ height: 300px; } }
.card{
  position:absolute; width: 210px; aspect-ratio:9/16; border-radius:18px;
  background: linear-gradient(180deg,#a5b4fc 0%,#6366f1 100%); box-shadow:0 30px 60px rgba(37, 99, 235, .25);
  top:40px; right:20%; transform: rotate(-8deg);
}
.card.b{ background: linear-gradient(180deg,#fbcfe8 0%,#f472b6 100%); top:80px; right:0; transform: rotate(6deg); }
.card.c{ background: linear-gradient(180deg,#6ee7b7 0%,#10b981 100%); top:160px; right:12%; transform: rotate(-2deg); }
</style>
