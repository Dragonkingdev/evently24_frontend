<!-- pages/business/dashboard.vue -->
<template>
  <div>
    <h1 class="h3 mb-4">Dashboard</h1>

    <div v-if="!wsId" class="alert alert-warning">
      Bitte zuerst einen Workspace auswählen.
    </div>

    <div v-else class="row g-4">
      <div class="col-md-3" v-for="card in kpiCards" :key="card.title">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="fw-semibold">{{ card.title }}</div>
              <i :class="`bi ${card.icon}`"></i>
            </div>
            <div class="display-6">{{ card.value }}</div>
            <Sparkline :points="card.series" class="mt-2"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { currentId, stats } = useWorkspaceApi()
const wsId = computed(() => currentId.value)
const kpiCards = ref([])

watch(wsId, async (id) => {
  if (!id) return
  const { data } = await stats(id) // GET /api/v1/workspace/{id}/stats :contentReference[oaicite:4]{index=4}
  // Mappe deine Response in simple Cards
  kpiCards.value = [
    { title: 'Umsatz', icon: 'bi-cash-coin', value: data?.revenue_total || '–', series: data?.revenue_spark || [] },
    { title: 'Tickets', icon: 'bi-ticket-perforated', value: data?.tickets_sold || '–', series: data?.tickets_spark || [] },
    { title: 'Events', icon: 'bi-calendar-event', value: data?.events_active || '–', series: data?.events_spark || [] },
    { title: 'Conversion', icon: 'bi-graph-up', value: data?.conversion || '–', series: data?.conv_spark || [] }
  ]
}, { immediate: true })
</script>
