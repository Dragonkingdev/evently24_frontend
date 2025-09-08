<template>
  <div class="loc-card mt-2">
    <div class="poster" :style="{ backgroundImage: `url(${loc.img})` }"></div>
    <div class="info mt-2">
      <h5 class="mb-1 fw-bold text-truncate">{{ loc.name }}</h5>
      <p class="small mb-0"><i class="bi bi-geo-alt me-1"></i>{{ loc.city }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loc: { type: Object, required: true }
})
</script>

<style scoped>
.loc-card{ width: 260px; flex-shrink: 0; }
.poster{
  width: 100%; aspect-ratio: 2/3;
  background-size: cover; background-position: center;
  border-radius: .75rem; box-shadow: 0 4px 10px rgba(0,0,0,.1);
  transition: transform .2s ease, box-shadow .2s ease;
}
.poster:hover{ box-shadow: 0 8px 20px rgba(0,0,0,.25); }
@media (max-width: 992px){ .loc-card{ width: 200px } }
@media (max-width: 576px){ .loc-card{ width: 150px } }
</style>
