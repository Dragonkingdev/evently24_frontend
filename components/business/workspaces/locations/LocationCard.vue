<!-- components/business/workspaces/locations/LocationCard.vue -->
<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-1 text-truncate" :title="loc.name">{{ loc.name }}</h5>

        <div class="ms-2 d-flex gap-1">
          <!-- STATUS -->
          <span
            v-if="loc.status"
            class="badge d-inline-flex align-items-center"
            :class="statusBadgeClass"
            :title="statusLabel"
          >
            <i v-if="statusIcon" :class="statusIcon + ' me-1'"></i>
            {{ statusLabel }}
          </span>

          <!-- VERIFICATION -->
          <span
            v-if="loc.verification_status"
            class="badge d-inline-flex align-items-center"
            :class="verificationBadgeClass"
            :title="verificationLabel"
          >
            <i v-if="verificationIcon" :class="verificationIcon + ' me-1'"></i>
            {{ verificationLabel }}
          </span>
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
import { computed } from 'vue'

const props = defineProps({
  loc: { type: Object, required: true },
  wid: { type: [String, Number], required: true },
})
const emit = defineEmits(['deleted'])

const { deleteLocation } = useWorkspaceApi()

/** Helpers */
const toKey = (v) => String(v || '').trim().toLowerCase()
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

/** STATUS badge (z.B. pending / published / disabled …) */
const statusKey = computed(() => toKey(props.loc?.status))
const statusBadgeClass = computed(() => {
  switch (statusKey.value) {
    case 'pending': return 'bg-warning text-dark'
    case 'published': return 'bg-success'
    case 'active': return 'bg-success'
    case 'disabled':
    case 'inactive': return 'bg-secondary'
    case 'rejected':
    case 'failed': return 'bg-danger'
    default: return 'bg-light text-dark border'
  }
})
const statusIcon = computed(() => {
  switch (statusKey.value) {
    case 'pending': return 'bi bi-hourglass-split'
    case 'published':
    case 'active': return 'bi bi-check-circle'
    case 'disabled':
    case 'inactive': return 'bi bi-slash-circle'
    case 'rejected':
    case 'failed': return 'bi bi-x-circle'
    default: return ''
  }
})
const statusLabel = computed(() => {
  const map = { pending: 'Pending', published: 'Published', active: 'Active', disabled: 'Disabled', inactive: 'Inactive', rejected: 'Rejected', failed: 'Failed' }
  return map[statusKey.value] || capitalize(props.loc?.status)
})

/** VERIFICATION badge (z.B. verified / pending / unverified …) */
const verificationKey = computed(() => toKey(props.loc?.verification_status))
const verificationBadgeClass = computed(() => {
  switch (verificationKey.value) {
    case 'verified': return 'bg-success'
    case 'pending':
    case 'in_review': return 'bg-info'
    case 'unverified':
    case 'needs_action': return 'bg-warning text-dark'
    case 'rejected': return 'bg-danger'
    default: return 'bg-secondary'
  }
})
const verificationIcon = computed(() => {
  switch (verificationKey.value) {
    case 'verified': return 'bi bi-patch-check'
    case 'pending':
    case 'in_review': return 'bi bi-hourglass-split'
    case 'unverified':
    case 'needs_action': return 'bi bi-exclamation-triangle'
    case 'rejected': return 'bi bi-x-circle'
    default: return ''
  }
})
const verificationLabel = computed(() => {
  const map = { verified: 'Verified', pending: 'Pending', in_review: 'In review', unverified: 'Unverified', needs_action: 'Needs action', rejected: 'Rejected' }
  return map[verificationKey.value] || capitalize(props.loc?.verification_status)
})

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
