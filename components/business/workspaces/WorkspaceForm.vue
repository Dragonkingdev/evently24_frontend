<!-- components/business/workspaces/WorkspaceForm.vue -->
<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input v-model="form.name" class="form-control" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Beschreibung (optional)</label>
      <textarea v-model="form.description" class="form-control" rows="3"></textarea>
    </div>
    <button class="btn btn-primary">
      <i class="bi bi-plus-circle"></i> Erstellen
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['created'])
const { create } = useWorkspaceApi()
const form = reactive({ name: '', description: '' })

async function submit () {
  const { data, error } = await create(form) // POST /api/v1/workspace :contentReference[oaicite:2]{index=2}
  if (error) return useToast().error('Erstellen fehlgeschlagen.')
  useToast().success('Workspace angelegt.')
  emit('created', data)
  Object.assign(form, { name: '', description: '' })
}
</script>
