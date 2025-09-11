<template>
  <div class="container py-5">
    <div class="text-center">
      <h1 class="h3 mb-3">Danke für deine Bestellung 🙌</h1>
      <p class="text-muted">Deine Zahlung wurde erfolgreich verarbeitet.</p>

      <div class="card border-0 shadow-sm mx-auto my-4" style="max-width: 560px;">
        <div class="card-body">
          <p class="mb-1"><strong>Session-ID:</strong> <code>{{ sessionId || '—' }}</code></p>
          <p class="mb-0"><strong>Order-ID:</strong> <code>{{ orderId || '—' }}</code></p>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-center">
        <NuxtLink class="btn btn-primary" :to="orderId ? `/orders/${orderId}` : '/'">Bestellung ansehen</NuxtLink>
        <NuxtLink class="btn btn-outline-secondary" to="/">Zur Startseite</NuxtLink>
      </div>

      <div v-if="debug && sessionInfo" class="mt-4 text-start mx-auto" style="max-width: 720px;">
        <h6>Debug: Stripe Session</h6>
        <pre class="small bg-light p-3 rounded">{{ sessionInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const debug = false
const route = useRoute()
const { get } = useApi()

const sessionId = route.query.session_id ? String(route.query.session_id) : ''
const orderId = route.query.order_id ? Number(route.query.order_id) : null

const sessionInfo = ref(null)

onMounted(async () => {
  if (debug && sessionId) {
    const res = await get(`/payments/sessions/${sessionId}`)
    if (!res?.error) sessionInfo.value = JSON.stringify(res.data || res, null, 2)
  }
})
</script>
