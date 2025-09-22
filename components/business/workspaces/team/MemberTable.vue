<!-- components/business/workspaces/team/MemberTable.vue -->
<template>
  <div class="card">
    <table class="table align-middle mb-0">
      <thead class="table-light">
        <tr><th>Name</th><th>E-Mail</th><th>Rolle</th></tr>
      </thead>
      <tbody>
        <tr v-for="m in rows" :key="m.id">
          <td>{{ m.user_name || '-' }}</td>
          <td>{{ m.user_email }}</td>
          <td>{{ m.role }}</td>
        </tr>
        <tr v-if="!rows.length"><td colspan="3" class="text-muted">Keine Mitglieder</td></tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
</script>
