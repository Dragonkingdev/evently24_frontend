<script setup>
const props = defineProps({
  name: { type: String, required: true },
  followers: { type: String, default: '' },
  media: { type: Object, required: true } // { type:'video'|'image', src:'', poster?:'' }
})
</script>

<template>
  <div>
    <div class="location-thumb position-relative" style="border-radius:1rem; overflow:hidden;">
      <video v-if="media.type==='video'" class="w-100" playsinline muted loop preload="metadata" :poster="media.poster">
        <source :src="media.src" type="video/mp4">
      </video>
      <img v-else class="w-100" :src="media.src" :alt="name" />
      <span class="badge text-bg-light pill position-absolute" style="top:.5rem; left:.5rem;">
        <i class="bi bi-geo"></i> {{ name }}
      </span>
    </div>
    <div class="mt-2 d-flex justify-content-between align-items-center">
      <strong>{{ name }}</strong>
      <span v-if="followers" class="text-secondary small"><i class="bi bi-people"></i> {{ followers }}</span>
    </div>
  </div>
</template>
