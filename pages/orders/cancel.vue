<template>
  <div class="container py-5">
    <div class="text-center">
      <h1 class="h4 mb-3">Zahlung abgebrochen</h1>
      <p class="text-muted">Deine Zahlung wurde nicht abgeschlossen. Du kannst es jederzeit erneut versuchen.</p>
      <div class="d-flex gap-2 justify-content-center">
        <NuxtLink class="btn btn-primary" :to="backLink">Zurück zum Warenkorb</NuxtLink>
        <NuxtLink class="btn btn-outline-secondary" to="/">Zur Startseite</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const orderId = route.query.order_id ? Number(route.query.order_id) : null
const backLink = computed(() => orderId ? `/cart/${orderId}` : '/')
</script>
