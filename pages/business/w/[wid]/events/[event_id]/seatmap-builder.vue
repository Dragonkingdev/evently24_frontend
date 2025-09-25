<!-- pages/business/w/[wid]/events/[event_id]/seatmap-builder.vue -->
 <template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Seatplan Builder</h4>
      <div class="btn-group">
        <NuxtLink :to="`/business/w/${wid}/events/${eventId}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Zurück
        </NuxtLink>
      </div>
    </div>

    <SeatmapBuilder :event-id="eventId" :seatmap-id="seatmapId" />
  </div>
</template>

<script setup>
import SeatmapBuilder from '~/components/business/workspaces/events/SeatmapBuilder.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)

const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

// Event laden um seatmap_id zu kennen
const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const seatmapId = computed(() => (data.value?.seatmap_id ?? null))
</script>
