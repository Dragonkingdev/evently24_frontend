<!-- pages/business/w/[wid]/events/create.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Neues Event</h4>
      <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>
    </div>

    <EventCreateWizard :wid="wid" :api="api" @submit="submit" />
  </div>
</template>

<script setup>
import EventCreateWizard from '~/components/business/workspaces/events/EventCreateWizard.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const api = useWorkspaceApi() // wir reichen die Methoden in den Wizard weiter

async function submit(body){
  // POST /workspace/{wid}/events – inkl. location_name und evtl. seatmap_id
  const { createEvent } = api
  const { data, error } = await createEvent(body)
  if (error || !data?.id) {
    console.error(error)
    return alert(error?.data?.detail || 'Konnte Event nicht anlegen.')
  }
  // Bei GA (Kontingente) kannst du später Kategorien hinzufügen
  // Bei Reserved ist seatmap_id bereits gesetzt (im Wizard)
  navigateTo(`/business/w/${wid}/events/${data.id}`)
}
</script>
