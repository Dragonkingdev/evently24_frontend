<template>
  <NuxtLink
    class="festival-card mt-2 text-decoration-none"
    :to="festival.href || `/festival/${festival.slug || festival.id}`"
    :aria-label="`Festival: ${festival.title}`"
  >
    <div class="poster" :style="{ backgroundImage: `url(${festival.img})` }"></div>

    <div class="info mt-2 text-dark">
      <h5 class="mb-1 fw-bold text-truncate">{{ festival.title }}</h5>
      <p class="small mb-1">
        <i class="bi bi-geo-alt me-1"></i>{{ festival.city }}
      </p>
      <p v-if="festival.dateLabel" class="small mb-2">
        <i class="bi bi-calendar-event me-1"></i>{{ festival.dateLabel }}
      </p>

      <div class="d-flex justify-content-between align-items-center">
        <span class="fw-bold">&nbsp;</span>
        <div class="d-flex gap-1 flex-wrap">
          <span
            v-for="tag in (festival.tags || [])"
            :key="tag"
            class="badge bg-light text-dark border"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  festival: { type: Object, required: true }
})
</script>

<style scoped>
.festival-card { display:block; width:260px; flex-shrink:0; }
.poster{
  width:100%; aspect-ratio:2/3;
  background-size:cover; background-position:center;
  border-radius:.75rem; box-shadow:0 4px 10px rgba(0,0,0,.1);
  transition: transform .2s ease, box-shadow .2s ease;
}
.festival-card:hover .poster{ box-shadow:0 8px 20px rgba(0,0,0,.25); }
@media (max-width: 992px){ .festival-card{ width:200px } }
@media (max-width: 576px){ .festival-card{ width:150px } }
</style>
