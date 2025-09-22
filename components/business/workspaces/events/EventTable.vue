<!-- components/business/workspaces/events/EventTable.vue -->
<template>
  <div class="table-responsive card">
    <table class="table align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Titel</th><th>Datum</th><th>Ort</th><th>Status</th><th style="width:80px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ev in rows" :key="ev.id">
          <td class="fw-semibold">{{ ev.title }}</td>
          <td>{{ formatDate(ev.date) }}</td>
          <td>{{ ev.city || ev.venue || 'tba' }}</td>
          <td>
            <span class="badge" :class="statusClass(ev.status)">{{ ev.status }}</span>
          </td>
          <td class="text-end">
            <NuxtLink :to="`${base}/w/${wid}/events/${ev.id}`" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </td>
        </tr>
        <tr v-if="!rows?.length">
          <td colspan="5" class="text-muted">Keine Einträge</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { toRefs, watch } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  wid:  { type: [Number, String], required: true },
  base: { type: String, default: '/business' }
})
const { rows, wid, base } = toRefs(props)

function formatDate(v){
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d)) return '—'
  try {
    return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })
  } catch (e) {
    const pad = n => String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
function statusClass(s){
  switch ((s||'').toLowerCase()){
    case 'published': return 'bg-success'
    case 'archived':  return 'bg-light text-dark'
    case 'draft':
    default:          return 'bg-secondary'
  }
}

if (import.meta.client) {
  watch(rows, (val) => {
    console.log('[EventTable] rows length:', Array.isArray(val) ? val.length : 0)
  }, { immediate: true })
}
</script>
