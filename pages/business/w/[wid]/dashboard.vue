<!-- pages/business/w/[wid]/dashboard.vue -->
<template>
  <div>
    <KpiCards :stats="stats" class="mb-4" />
    <div class="row g-3">
      <div class="col-lg-7">
        <SalesSparkline :series="salesSeries"/>
      </div>
      <div class="col-lg-5">
        <UpcomingList :items="upcoming"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import KpiCards from '~/components/business/dashboard/KpiCards.vue'
import SalesSparkline from '~/components/business/dashboard/SalesSparkline.vue'
import UpcomingList from '~/components/business/dashboard/UpcomingList.vue'

const { fetchStats, listEvents } = useWorkspaceApi()
const stats = ref({})
const salesSeries = ref([])
const upcoming = ref([])

onMounted(async () => {
  stats.value = await fetchStats() || {}
  const { data } = await listEvents('', true)
  // Beispielprojekt: simplistic mapping
  upcoming.value = (data || []).slice(0, 6)
  salesSeries.value = mockSalesFromStats(stats.value)
})

function mockSalesFromStats(s){
  const n = 14
  const arr = Array.from({length:n}, (_,i)=>({ day: i+1, value: Math.max(0, (s?.tickets_sold || 0)/n + (Math.random()*10-5)) }))
  return arr
}
</script>
