<!-- pages/business/w/[wid]/settings/general.vue -->
<template>
  <div class="card">
    <div class="card-header"><h5 class="mb-0">Allgemein</h5></div>
    <div class="card-body">
      <form class="row g-3" @submit.prevent="save">
        <div class="col-md-6">
          <label class="form-label">Name</label>
          <input class="form-control" v-model="model.name" required minlength="2" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Land (ISO-2)</label>
          <input class="form-control" v-model="model.country" maxlength="2" />
        </div>
        <div class="col-md-6">
          <label class="form-label">E-Mail</label>
          <input type="email" class="form-control" v-model="model.email" />
        </div>
        <div class="col-12">
          <button class="btn btn-primary"><i class="bi bi-save me-2"></i>Speichern</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'workspace', auth: true })
const { get, patch } = useApi()
const { wid } = useWorkspaceApi()
const model = reactive({ name:'', country:'', email:'' })

onMounted(async () => {
  const { data } = await get(`/v1/workspace/${wid.value}`)
  Object.assign(model, data)
})
async function save(){
  await patch(`/v1/workspace/${wid.value}`, model)
}
</script>
