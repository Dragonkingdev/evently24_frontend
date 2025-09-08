<script setup lang="ts">
defineProps<{ ev: any }>()
</script>

<template>
  <NuxtLink :to="`/event/${ev.id}`" class="card text-decoration-none text-dark card-hover minw-18">
    <div class="position-relative">
      <img :src="ev.img" class="card-img-top rounded-top-3" :alt="ev.title">
      <span class="badge text-bg-white border position-absolute" style="top:.5rem; left:.5rem">{{ ev.city }}</span>
      <button class="btn btn-light btn-sm rounded-circle position-absolute" style="top:.5rem; right:.5rem">
        <i class="bi bi-heart"></i>
      </button>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h3 class="h6 mb-0">{{ ev.title }}</h3>
        <span class="fw-semibold">{{ ev.price.toFixed(2) }} €</span>
      </div>
      <div class="small text-muted">{{ new Date(ev.date).toLocaleDateString('de-DE') }}</div>
    </div>
  </NuxtLink>
</template>
