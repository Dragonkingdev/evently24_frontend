<template>
  <NuxtLink
    class="event-card mt-2 text-decoration-none"
    :to="ev.href || `/event/${ev.slug || ev.id}`"
    :aria-label="`Event: ${ev.title}`"
  >
    <div class="poster" :style="{ backgroundImage: `url(${ev.img})` }"></div>

    <div class="info mt-2 text-dark">
      <h5 class="mb-1 fw-bold text-truncate">{{ ev.title }}</h5>
      <p class="small mb-1">
        <i class="bi bi-geo-alt me-1"></i>{{ ev.city }}
      </p>
      <p class="small mb-2">
        <i class="bi bi-calendar-event me-1"></i>{{ formatDate(ev.date) }}
      </p>

      <div class="d-flex justify-content-between align-items-center">
        <span class="fw-bold" v-if="priceLabel">{{ priceLabel }}</span>
        <span class="fw-bold" v-else>&nbsp;</span>
        <div class="d-flex gap-1 flex-wrap">
          <span
            v-for="tag in (ev.tags || [])"
            :key="tag"
            class="badge bg-light text-dark border"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({ ev: { type: Object, required: true } })

const priceLabel = computed(() => {
  if (props.ev.price == null) return ''
  const p = Number(props.ev.price).toFixed(0)
  return `ab ${p} €`
})
function formatDate(date) {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit", month: "short", year: "numeric"
  })
}
</script>

<style scoped>
.event-card { display:block; width:260px; flex-shrink:0; }
.poster{
  width:100%; aspect-ratio:2/3;
  background-size:cover; background-position:center;
  border-radius:.75rem; box-shadow:0 4px 10px rgba(0,0,0,.1);
  transition: transform .2s ease, box-shadow .2s ease;
}
.event-card:hover .poster{ box-shadow:0 8px 20px rgba(0,0,0,.25); }
.info{ background:transparent; }

/* Tablet */
@media (max-width: 992px){ .event-card{ width:200px } }
/* Mobile */
@media (max-width: 576px){ .event-card{ width:150px } }
</style>
