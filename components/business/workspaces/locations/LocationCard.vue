<!-- components/business/workspaces/locations/LocationCard.vue -->
<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-1 text-truncate" :title="loc.name">{{ loc.name }}</h5>
        <div class="ms-2 d-flex gap-1">
          <span v-if="loc.status" class="badge bg-light text-dark border">{{ loc.status }}</span>
          <span v-if="loc.verification_status" class="badge bg-secondary">{{ loc.verification_status }}</span>
        </div>
      </div>

      <div class="small text-muted mb-2">
        <i class="bi bi-geo-alt me-1"></i>
        <span v-if="loc.address">{{ loc.address }}, </span>
        <span v-if="loc.postal_code">{{ loc.postal_code }} </span>
        <span v-if="loc.city">{{ loc.city }}</span>
        <span v-if="loc.country"> ({{ loc.country }})</span>
      </div>

      <ul class="list-unstyled small mb-3">
        <li v-if="loc.email"><i class="bi bi-envelope me-1"></i><a :href="`mailto:${loc.email}`">{{ loc.email }}</a></li>
        <li v-if="loc.phone"><i class="bi bi-telephone me-1"></i><a :href="`tel:${loc.phone}`">{{ loc.phone }}</a></li>
        <li v-if="loc.website"><i class="bi bi-globe me-1"></i><a :href="loc.website" target="_blank" rel="noopener">Website öffnen</a></li>
      </ul>

      <div class="mt-auto d-flex justify-content-between align-items-center">
        <div class="small text-muted">
          <i class="bi bi-clock me-1"></i>
          {{ formattedDate }}
        </div>
        <div class="btn-group">
          <NuxtLink
            :to="`/business/w/${wid}/locations/${loc.id}`"
            class="btn btn-sm btn-outline-secondary"
            title="Details"
          >
            <i class="bi bi-box-arrow-up-right"></i>
          </NuxtLink>
          <button class="btn btn-sm btn-outline-danger" @click="confirmDelete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loc: { type: Object, required: true },
  wid: { type: [String, Number], required: true },
})
const emit = defineEmits(['deleted'])

const { deleteLocation } = useWorkspaceApi()

const formattedDate = computed(() => {
  if (!props.loc?.created_at) return '—'
  try {
    const d = new Date(props.loc.created_at)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch { return '—' }
})

async function confirmDelete () {
  if (!confirm(`Location „${props.loc.name}“ wirklich löschen?`)) return
  const { error } = await deleteLocation(props.loc.id)
  if (error) {
    console.error('[Location delete] error:', error)
    alert('Löschen fehlgeschlagen.')
    return
  }
  emit('deleted', props.loc.id)
}
</script>
