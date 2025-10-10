<!-- pages/business/index.vue -->
<template>
  <div class="container py-4">
    <div class="d-flex align-items-center gap-2 text-muted">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span>lade Workspace…</span>
    </div>
  </div>
</template>

<script setup>
const { list: listMyWorkspaces } = useWorkspaceApi()
const { lastWid } = useLastWorkspace()

onMounted(async () => {
  if (lastWid.value) {
    return navigateTo(`/business/w/${lastWid.value}/dashboard`)
  }
  try {
    const { data } = await listMyWorkspaces('', true /* mine_only=true */)
    const rows = Array.isArray(data?.items) ? data.items
               : Array.isArray(data?.results) ? data.results
               : Array.isArray(data) ? data
               : []
    if (rows.length > 0) {
      return navigateTo(`/business/w/${rows[0].id}/dashboard`)
    }
  } catch {}
  navigateTo('/business/onboarding')
})
</script>
