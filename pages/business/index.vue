<!-- pages/business/index.vue -->
<template>
  <div>
    <div class="mb-3">
      <h4 class="mb-1">Deine Workspaces</h4>
      <div class="text-muted">Wähle einen Workspace oder lege einen neuen an.</div>
    </div>
    <div class="card p-3">
      <WorkspaceDropdown :autoRedirectOnBusiness="true" />
    </div>
  </div>
</template>

<script setup>
import WorkspaceDropdown from '~/components/business/WorkspaceDropdown.vue'
</script>
