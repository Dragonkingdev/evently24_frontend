<!-- pages/business/w/[wid]/events/create.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Neues Event</h4>
      <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>
    </div>

    <EventForm @submit="submit" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })
import EventForm from '~/components/business/workspaces/events/EventForm.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const { createEvent } = useWorkspaceApi()

async function submit(body){
  const { data, error } = await createEvent(body) // POST /workspace/{wid}/events
  if (error) {
    console.error(error)
    return alert('Konnte Event nicht anlegen.')
  }
  navigateTo(`/business/w/${wid}/events/${data.id}`)
}
</script>
