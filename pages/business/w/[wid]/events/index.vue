<!-- pages/business/w/[wid]/events/index.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Events</h4>
      <NuxtLink :to="`/business/w/${wid}/events/create`" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i> Neues Event
      </NuxtLink>
    </div>

    <div class="input-group mb-2">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input class="form-control" placeholder="Suche in Titel/Venue/City" v-model="q" @keyup.enter="load"/>
      <button class="btn btn-outline-secondary" @click="load">Suchen</button>
    </div>

    <div class="small text-muted mb-3">Treffer: {{ rows.length }}</div>

    <!-- vermeidet SSR/Intl-Probleme: nur im Client rendern -->
    <ClientOnly>
      <EventTable :rows="rows" :wid="wid" base="/business" />
      <template #fallback>
        <div class="card p-3 text-muted">Lade Events…</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import EventTable from '~/components/business/workspaces/events/EventTable.vue'

const { wid, listEvents } = useWorkspaceApi()

const q = ref('')
const rows = ref([])

function extractRows(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.items))   return payload.items
    if (Array.isArray(payload.results)) return payload.results
    if (Array.isArray(payload.data))    return payload.data
    if (Array.isArray(payload.events))  return payload.events
  }
  return []
}

async function load () {
  if (!wid.value) return
  const { data, error } = await listEvents(q.value, false)
  //console.log('[Events] Fetch → wid:', wid.value, 'q:', q.value)
  //console.log('[Events] raw payload:', data)
  if (error) console.error('[Events] error:', error)
  rows.value = extractRows(data)
  //console.log('[Events] mapped length:', rows.value.length)
}

watch(wid, (v) => { if (v) load() }, { immediate: true })
</script>
