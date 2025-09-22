<!-- pages/business/w/[wid]/team/invites.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h4 class="mb-0">Einladungen</h4>
      <form class="d-flex gap-2" @submit.prevent="sendInvite">
        <input v-model="email" type="email" class="form-control" placeholder="E-Mail" required />
        <select v-model="role" class="form-select" style="max-width: 200px;">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button class="btn btn-primary"><i class="bi bi-send"></i></button>
      </form>
    </div>
    <InviteTable :rows="rows" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'workspace', auth: true })
import InviteTable from '~/components/business/workspaces/team/InviteTable.vue'
const { listInvites, createInvite } = useWorkspaceApi()
const rows = ref([])
const email = ref('')
const role = ref('viewer')

async function load(){
  const { data } = await listInvites(true)
  rows.value = data || []
}
async function sendInvite(){
  await createInvite({ email: email.value, role: role.value })
  email.value = ''
  await load()
}
onMounted(load)
</script>
