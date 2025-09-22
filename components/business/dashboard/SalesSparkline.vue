<!-- components/business/dashboard/SalesSparkline.vue -->
<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Verkäufe (14 Tage)</h6>
        <i class="bi bi-graph-up-arrow"></i>
      </div>
      <div class="small text-muted">Demo Sparkline (Dummy-Daten)</div>
      <div class="mt-3">
        <div class="progress mb-1" style="height:6px;" v-for="(p,idx) in bars" :key="idx">
          <div class="progress-bar" role="progressbar" :style="{ width: p + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ series: { type: Array, default: () => [] } })
const bars = computed(() => props.series.map(p => Math.min(100, Math.round(p.value*4))))
</script>
