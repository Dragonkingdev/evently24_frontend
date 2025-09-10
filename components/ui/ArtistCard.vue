<template>
  <NuxtLink
    class="artist-card mt-2 text-center text-decoration-none"
    :to="`/artist/${encodeURIComponent(artist.name)}`"
  >
    <div class="poster" :style="{ backgroundImage: `url(${artist.img})` }"></div>
    <div class="info mt-2">
      <h5 class="mb-1 fw-bold text-truncate">{{ artist.name }}</h5>
      <p class="small mb-0 text-muted">{{ artist.subtitle }}</p>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  artist: { type: Object, required: true } // { name, img, subtitle? }
})
</script>

<style scoped>
.artist-card {
  display: block;
  width: 220px;
  flex-shrink: 0;
}
.poster {
  width: 100%;
  aspect-ratio: 1/1; /* quadratisch, wie ein Avatar/Album */
  background-size: cover;
  background-position: center;
  border-radius: 9999px; /* rund */
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
}
@media (max-width: 992px){ .artist-card{ width: 180px } }
@media (max-width: 576px){ .artist-card{ width: 140px } }
</style>
