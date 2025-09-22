<!-- components/business/dashboard/UpcomingList.vue -->
<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h6 class="mb-3">Demnächst</h6>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="ev in items" :key="ev.id">
          <div class="d-flex justify-content-between">
            <div>
              <div class="fw-semibold">{{ ev.title }}</div>
              <div class="small text-muted">{{ ev.city || ev.venue || 'tba' }}</div>
            </div>
            <div class="text-nowrap small">{{ new Date(ev.date).toLocaleString('de-DE') }}</div>
          </div>
        </li>
        <li v-if="!items.length" class="list-group-item text-muted">Keine Items</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
</script>
