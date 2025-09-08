<template>
  <h1>Willkommen, {{ user?.name || 'Benutzer' }}</h1>
  <div class="row g-3">
    <div class="col-md-3" v-for="c in cards" :key="c.label">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="small text-muted">{{ c.label }}</div>
          <div class="h4 m-0 fw-bold">{{ c.value }}</div>
          <div v-if="c.sub" class="small text-muted">{{ c.sub }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "businesslayout", auth: true })

const { user, fetchUser } = useAuth()
await fetchUser()

import { computed } from 'vue'
import { useCatalog } from '~/composables/useCatalog'

const { tours } = useCatalog()

const stats = computed(() => {
  const tourCount = tours.value.length
  const evCount = tours.value.reduce((a,t)=>a+(t.events?.length||0),0)
  const tierCount = tours.value.reduce((a,t)=>a+(t.events||[]).reduce((b,e)=>b+(e.tiers?.length||0),0),0)

  // Dummy: Tickets verkauft / Umsatz
  const soldTickets = tours.value.reduce((a,t)=>
    a+(t.events||[]).reduce((b,e)=>b+Math.floor((e.tiers?.length||0)*50*Math.random()),0),0)
  const revenue = soldTickets * 75 + Math.floor(Math.random()*5000)

  // Dummy: Auslastung %
  const capacity = tours.value.reduce((a,t)=>
    a+(t.events||[]).reduce((b,e)=>b+(e.tiers||[]).reduce((c,tr)=>c+(tr.stock||0),0),0),0)
  const occupancy = capacity ? Math.round((soldTickets/capacity)*100) : 0

  return { tourCount, evCount, tierCount, soldTickets, revenue, occupancy }
})

const cards = computed(()=>[
  { label:'Touren', value: stats.value.tourCount },
  { label:'Events', value: stats.value.evCount },
  { label:'Ticketarten', value: stats.value.tierCount },
  { label:'Verkaufte Tickets', value: stats.value.soldTickets.toLocaleString('de-DE') },
  { label:'Gesamtumsatz', value: stats.value.revenue.toLocaleString('de-DE',{style:'currency',currency:'EUR'}) },
  { label:'Auslastung', value: stats.value.occupancy + '%' , sub: 'Ø pro Event' },
  { label:'Ø Ticketpreis', value: (stats.value.revenue / Math.max(1, stats.value.soldTickets)).toLocaleString('de-DE',{style:'currency',currency:'EUR'}) },
])
</script>
