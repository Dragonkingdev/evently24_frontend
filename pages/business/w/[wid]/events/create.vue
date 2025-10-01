<!-- pages/business/w/[wid]/events/create.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Neues Event</h4>
      <NuxtLink :to="`/business/w/${wid}/events`" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>
    </div>

    <EventCreateWizard
      ref="wizardRef"
      :wid="wid"
      :api="api"
      :busy="busy"
      :serverError="serverError"
      @submit="submit"
    />
  </div>
</template>

<script setup>
import EventCreateWizard from '~/components/business/workspaces/events/EventCreateWizard.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const api = useWorkspaceApi()
const busy = ref(false)
const serverError = ref(null)
const wizardRef = ref(null)

// Hilfsfunktion: bestimme „Abschnitt“ aus betroffenen Feldern (für Scroll)
function findStepForError (err) {
  const fields = new Set([err?.field, ...(err?.fields || [])].filter(Boolean))

  // Freie Adresse -> Basis
  if (['location_text_name','location_text_address','location_text_city'].some(f => fields.has(f))) {
    return 1
  }
  // Extern: Ticket-URL -> Listing
  if (fields.has('external_ticket_url')) return 2

  // ListingMode-Konflikt
  if (fields.has('listing_mode')) return 2

  // Ticket-bezogenes (zur Sicherheit) -> Tickets
  if (['ticket_sale_mode','seatmap_id'].some(f => fields.has(f))) return 3

  // Fallback: Basis
  return 1
}

async function submit(body){
  const { createEvent, parseApiError } = api
  try {
    serverError.value = null
    busy.value = true
    const { data, error } = await createEvent(body)
    if (error || !data?.id) throw error || new Error('Unbekannter Fehler')
    await navigateTo(`/business/w/${wid}/events/${data.id}`)
  } catch (err) {
    const e = parseApiError(err)
    serverError.value = e

    // bei feldbezogenen Fehlern zum passenden Abschnitt scrollen
    if (e.field || (e.fields && e.fields.length)) {
      const step = findStepForError(e)
      wizardRef.value?.goToStep(step)
    }

    if (!e.field && !(e.fields && e.fields.length)) {
      console.error('API Error:', e)
    }
  } finally {
    busy.value = false
  }
}
</script>
