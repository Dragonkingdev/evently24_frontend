<!-- components/business/dashboard/KpiCards.vue -->
<template>
  <div class="row g-3">
    <div class="col-6 col-xl-3" v-for="c in cards" :key="c.title">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="text-muted small">{{ c.title }}</div>
              <div class="fs-4 fw-semibold">{{ c.value }}</div>
            </div>
            <i :class="`bi ${c.icon} fs-2 text-secondary`"></i>
          </div>
          <div v-if="c.hint" class="small text-muted mt-2">{{ c.hint }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ stats: { type: Object, default: () => ({}) } })
const cards = computed(() => [
  { title: 'Tickets verkauft', value: props.stats?.tickets_sold ?? 0, icon: 'bi-ticket-perforated' },
  { title: 'Umsatz (EUR)', value: (props.stats?.revenue_eur ?? 0).toLocaleString('de-DE'), icon: 'bi-cash-coin' },
  { title: 'Anstehende Events', value: props.stats?.upcoming_events ?? 0, icon: 'bi-calendar2-event' },
  { title: 'Team / Invites', value: `${props.stats?.members ?? 0} / ${props.stats?.invites_pending ?? 0}`, icon: 'bi-people' }
])
</script>
