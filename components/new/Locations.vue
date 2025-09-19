<script setup>
import LocationTile from '~/components/new/tiles/LocationTile.vue'

const locations = [
  { name:'Kulturfabrik', followers:'1.2k Follower', media:{ type:'video', src:'https://cdn.coverr.co/videos/coverr-theatre-stage-8140/1080p.mp4', poster:'https://images.unsplash.com/photo-1576618148419-f11b961d5f1b?q=80&w=1200&auto=format&fit=crop' } },
  { name:'Tunnel Club', followers:'3.8k Follower', media:{ type:'image', src:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop' } },
  { name:'Burg Ehrenfels', followers:'9.1k Follower', media:{ type:'image', src:'https://images.unsplash.com/photo-1520975922203-b91dd6757419?q=80&w=1200&auto=format&fit=crop' } },
  { name:'Riverside Stage', followers:'2.3k Follower', media:{ type:'video', src:'https://cdn.coverr.co/videos/coverr-an-empty-concert-venue-1037/1080p.mp4', poster:'https://images.unsplash.com/photo-1517481705099-9f41bd1f3bbf?q=80&w=1200&auto=format&fit=crop' } },
]
</script>

<template>
  <section class="py-5">
    <div class="container-fluid container-xxl">
      <div class="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h2 class="section-title mb-0">Locations entdecken</h2>
          <p class="subtitle mb-0">Kurzclips &amp; Bilder geben dir direkt das Gefühl vor Ort.</p>
        </div>
        <NuxtLink to="#" class="btn btn-outline-secondary btn-sm">Alle Locations</NuxtLink>
      </div>

      <div class="row g-4">
        <div v-for="(l,i) in locations" :key="i" class="col-md-6 col-lg-3">
          <LocationTile v-bind="l" />
        </div>
      </div>
    </div>
  </section>
</template>
