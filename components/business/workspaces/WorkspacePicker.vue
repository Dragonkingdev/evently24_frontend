<!-- components/business/workspaces/WorkspacePicker.vue -->
<template>
  <div class="dropdown" v-if="workspaces.length">
    <button class="btn btn-outline-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
      <i class="bi bi-building me-1"></i>
      {{ label }}
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="w in workspaces" :key="w.id">
        <button class="dropdown-item" @click="choose(w.id)">{{ w.name }}</button>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li><NuxtLink class="dropdown-item" to="/business/workspaces">Workspaces verwalten</NuxtLink></li>
    </ul>
  </div>
  <NuxtLink v-else class="btn btn-primary btn-sm" to="/business/workspaces">
    <i class="bi bi-plus"></i> Workspace anlegen
  </NuxtLink>
</template>

<script setup>
const { list, currentId, setCurrent } = useWorkspaceApi()
const workspaces = ref([])
const label = computed(() => {
  const found = workspaces.value.find(w => w.id === currentId.value)
  return found ? found.name : 'Workspace wählen'
})
onMounted(async () => {
  const { data } = await list()
  workspaces.value = data || []
  if (!currentId.value && workspaces.value[0]) setCurrent(workspaces.value[0].id)
})
function choose (id) { setCurrent(id) }
</script>
