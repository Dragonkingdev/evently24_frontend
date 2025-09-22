<!-- components/charts/Sparkline.vue -->
<template>
  <svg :width="w" :height="h" preserveAspectRatio="none">
    <polyline :points="poly" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>
</template>

<script setup>
const props = defineProps({ points: { type: Array, default: () => [] }, w: { type: Number, default: 220 }, h: { type: Number, default: 60 } })
const poly = computed(() => {
  if (!props.points.length) return ''
  const xs = props.points.map((_, i) => i)
  const ys = props.points
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const nx = (x) => (x / (xs.length - 1)) * (props.w - 4) + 2
  const ny = (y) => props.h - (((y - minY) / Math.max(1, (maxY - minY))) * (props.h - 4) + 2)
  return ys.map((y, i) => `${nx(i)},${ny(y)}`).join(' ')
})
</script>

<style scoped>
svg { opacity: .85 }
</style>
