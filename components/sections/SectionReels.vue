<!-- components/sections/SectionReels.vue -->
<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  cta: { type: Object, default: () => null }, // { label, to }
  items: { type: Array, default: () => [] },
  light: { type: Boolean, default: false }
})
</script>

<template>
  <section :class="['sec', { light }]">
    <div class="wrap">
      <div class="hdr">
        <div>
          <h2 class="title">{{ title }}</h2>
          <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        </div>
        <NuxtLink v-if="cta" :to="cta.to" class="btn ghost">{{ cta.label }}</NuxtLink>
      </div>
      <ReelGrid :items="items" />
    </div>
  </section>
</template>

<style scoped>
.sec{ padding: 2rem 0; }
.sec.light{ background: #f7f9ff; }
.wrap{ width:100%; max-width:1320px; margin:0 auto; padding: 0 1rem; }
.hdr{ display:flex; align-items:end; justify-content:space-between; margin-bottom: .75rem; }
.title{ margin:0; font-weight:900; letter-spacing:-.01em; }
.subtitle{ color:#64748b; margin:.25rem 0 0; }
.btn.ghost{
  border:1px solid #e6e8f0; background:#fff; border-radius:10px; padding:.45rem .75rem; font-weight:700; color:#111827;
}
.btn.ghost:hover{ border-color:#c7d2fe; background:#f8faff; }
</style>
