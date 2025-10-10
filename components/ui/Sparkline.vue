<!--components/ui/Sparkline.vue-->
<template>
  <svg
    v-if="pts.length"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
    class="spark"
  >
    <polyline
      :points="pointsAttr"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linejoin="round"
      stroke-linecap="round"
      opacity="0.9"
    />
  </svg>
  <div v-else class="spark-empty">—</div>
</template>

<script setup>
const props = defineProps({
  points: { type: Array, default: () => [] }, // numbers
  width: { type: Number, default: 160 },
  height: { type: Number, default: 40 },
  strokeWidth: { type: Number, default: 2 },
})

const pts = computed(() => (props.points || []).map(v => Number(v) || 0))
const pointsAttr = computed(() => {
  const n = pts.value.length
  if (!n) return ''
  const w = props.width
  const h = props.height
  const max = Math.max(...pts.value, 1)
  const stepX = n > 1 ? (w / (n - 1)) : 0
  const pad = 2
  return pts.value.map((v,i) => {
    const x = Math.round(i * stepX)
    const y = Math.round(h - (v / max) * (h - 2*pad) - pad)
    return `${x},${y}`
  }).join(' ')
})
</script>

<style scoped>
.spark { display:block; }
.spark-empty { color: #9aa4b2; font-size: .9rem; }
</style>
