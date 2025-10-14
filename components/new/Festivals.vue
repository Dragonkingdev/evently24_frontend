<!--components/new/Festivals.vue-->
<script setup>
import EventCard from '~/components/new/cards/EventCard.vue'
const festivals = [
  {
    title: 'Forest & Lights',
    whenWhere: 'Stadtwald · 5–7 Jul',
    priceBadge: 'ab 89€',
    tags: ['Electro','Live Acts'],
    media: { type:'image', src:'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop' }
  },
  {
    title: 'Neon Valley',
    whenWhere: 'Messepark · 12–14 Aug',
    priceBadge: '',
    tags: ['EDM','Visuals'],
    media: { type:'video', src:'https://cdn.coverr.co/videos/coverr-the-festival-5518/1080p.mp4', poster:'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop' }
  },
  {
    title: 'Riverside Jazz Days',
    whenWhere: 'Uferpromenade · 2–4 Mai',
    priceBadge: 'Abendkasse',
    tags: ['Jazz','Open Air'],
    media: { type:'image', src:'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop' }
  }
]
</script>

<template>
  <section class="py-5 bg-light">
    <div class="container-fluid container-xxl">
      <div class="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h2 class="section-title mb-0">Große Festivals</h2>
          <p class="subtitle mb-0">Mehrtage-Highlights mit Camping &amp; Special Stages.</p>
        </div>
        <NuxtLink to="#" class="btn btn-outline-secondary btn-sm">Alle Festivals</NuxtLink>
      </div>

      <div class="row g-4">
        <div v-for="(f,i) in festivals" :key="i" class="col-md-6 col-lg-4">
          <EventCard v-bind="f" />
        </div>
      </div>
    </div>
  </section>
</template>
