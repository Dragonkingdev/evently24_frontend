<!-- pages/dashboard/tours/index.vue -->
<template>
  <!-- Header-Bar in der Page -->
  <div class="page-header d-flex justify-content-between align-items-center mb-3">
    <h5 class="m-0">Deine Touren</h5>
    <NuxtLink to="/dashboard/tours/new" class="btn btn-primary btn-sm">
      <i class="bi bi-plus"></i> Tour hinzufügen
    </NuxtLink>
  </div>

  <div v-if="pending" class="text-muted">Lade…</div>
  <div v-else-if="error" class="alert alert-danger">Konnte Touren nicht laden.</div>

  <div v-else>
    <div class="card border-0 shadow-sm">
      <div class="list-group list-group-flush">
        <div v-for="t in tours" :key="t.id" class="list-group-item d-flex align-items-center gap-3">
          <img :src="t.poster || t.image" class="rounded" style="width:60px;height:60px;object-fit:cover">
          <div class="flex-grow-1">
            <div class="fw-semibold">{{ t.title }}</div>
            <div class="small text-muted">{{ t.events?.length || 0 }} Events</div>
          </div>
          <NuxtLink :to="`/dashboard/tours/${t.slug || t.id}`" class="btn btn-outline-secondary btn-sm">
            Bearbeiten
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="!tours.length" class="text-muted small mt-3">
      Noch keine Touren.
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboardlayout', auth: true }) // nutzt dein Layout

import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'

const api = useApi()
const { data, pending, error } = await useAsyncData('tours', () =>
  api.get('/dashboard/tours').then(r => r.data)
)

const tours = computed(() => data.value || [])
</script>

<style scoped>
/* einfache, saubere Header-Bar im Content-Bereich */
.page-header {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: .75rem 1rem;
}
</style>
