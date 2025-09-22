<!-- components/business/BusinessSidebar.vue -->
<template>
  <aside class="sidebar bg-white" :class="{ 'is-open': isOpen }">
    <div class="p-3 border-bottom">
      <div class="brand fw-bold">🎫 Evently24 Business</div>
      <WorkspaceDropdown />
    </div>

    <nav v-if="hasWid" class="nav flex-column p-2" @click="$emit('close')"><!-- optional: Klick schließt auf Mobile -->
      <NuxtLink :to="`/business/w/${wid}/dashboard`" class="nav-link" :class="active(`/business/w/${wid}/dashboard`)">
        <i class="bi bi-speedometer2 me-2"></i> Dashboard
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/events`" class="nav-link" :class="active(`/business/w/${wid}/events`)">
        <i class="bi bi-ticket-perforated me-2"></i> Events
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/calendar/series`" class="nav-link" :class="active(`/business/w/${wid}/calendar`)">
        <i class="bi bi-calendar3 me-2"></i> Kalender
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/locations`" class="nav-link" :class="active(`/business/w/${wid}/locations`)">
        <i class="bi bi-geo-alt me-2"></i> Locations
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/artists`" class="nav-link" :class="active(`/business/w/${wid}/artists`)">
        <i class="bi bi-music-note-beamed me-2"></i> Artists
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/team/members`" class="nav-link" :class="active(`/business/w/${wid}/team`)">
        <i class="bi bi-people me-2"></i> Team
      </NuxtLink>
      <NuxtLink :to="`/business/w/${wid}/settings/general`" class="nav-link" :class="active(`/business/w/${wid}/settings`)">
        <i class="bi bi-gear me-2"></i> Einstellungen
      </NuxtLink>
    </nav>

    <div v-else class="p-3 text-muted small">
      Wähle einen Workspace oder erstelle einen neuen.
      <br/>Tipp: Nutze <code>?choose=1</code>, um diese Auswahl zu erzwingen.
    </div>
  </aside>
</template>

<script setup>
import WorkspaceDropdown from '~/components/business/WorkspaceDropdown.vue'
const props = defineProps({ isOpen: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const { wid, hasWid } = useWorkspaceApi()
const route = useRoute()

function active(base){
  const p = route.path
  const hit = p === base || p.startsWith(base + '/')
  return { 'is-active': hit }
}
</script>

<style scoped>
.brand{ letter-spacing:.3px; }
</style>
