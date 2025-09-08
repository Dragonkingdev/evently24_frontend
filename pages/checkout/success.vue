<script setup lang="ts">
const route = useRoute()
const orderId = route.query.order_id
const { get } = useApi()
const etickets:any = await get(`/api/orders/${orderId}/etickets`)

function download(i:number) {
  const token = etickets[i].jws
  const blob = new Blob([token], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `eticket_${i+1}.jwt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="text-center">
    <h1 class="h4">Danke für deinen Kauf!</h1>
    <p class="text-muted">Lade deine Tickets (signierte Tokens) herunter oder speichere sie in deinem Wallet.</p>
    <div class="d-flex flex-column align-items-center gap-2">
      <button v-for="(t,i) in etickets" :key="i" class="btn btn-outline-primary" @click="download(i)">
        <i class="bi bi-ticket-perforated"></i> E‑Ticket {{ i+1 }} herunterladen
      </button>
    </div>
    <NuxtLink to="/" class="btn btn-link mt-3">Zurück zur Startseite</NuxtLink>
  </div>
</template>
