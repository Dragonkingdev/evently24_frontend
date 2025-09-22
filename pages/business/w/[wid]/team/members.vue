<!-- pages/business/w/[wid]/team/members.vue -->
<template>
  <div>
    <h4 class="mb-3">Team</h4>
    <MemberTable :rows="rows" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'workspace', auth: true })
import MemberTable from '~/components/business/workspaces/team/MemberTable.vue'
const { listMembers } = useWorkspaceApi()
const rows = ref([])

onMounted(async () => {
  const { data } = await listMembers()
  rows.value = data || []
})
</script>
