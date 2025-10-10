<!-- components/business/workspaces/locations/modals/EditLocationStatusModal.vue -->
<template>
  <BaseModal :open="open" title="Status bearbeiten" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="row g-3">
        <div class="col-6">
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-select">
            <option :value="null">—</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label">Verifikation</label>
          <select v-model="form.verification_status" class="form-select">
            <option :value="null">—</option>
            <option value="none">none</option>
            <option value="pending">pending</option>
            <option value="verified">verified</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
      </div>

      <div v-if="err" class="alert alert-danger">{{ err }}</div>

      <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-outline-danger" @click="onDelete">
          <i class="bi bi-trash me-1"></i> Löschen
        </button>
        <button class="btn btn-primary" :disabled="busy">
          <span v-if="busy" class="spinner-border spinner-border-sm me-2"></span>Speichern
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import BaseModal from './_BaseModal.vue'
const props = defineProps({ open:Boolean, locationId:[Number,String], loc:Object })
const emit = defineEmits(['close','updated'])
const { patchLocation, deleteLocation, normalizeLocationPayload, parseApiError } = useWorkspaceApi()

const form = reactive({ status:null, verification_status:null })
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    status: props.loc?.status ?? null,
    verification_status: props.loc?.verification_status ?? null
  })
})

const busy = ref(false); const err = ref('')

async function onSave(){
  err.value=''; busy.value=true
  try{
    const body = normalizeLocationPayload(form)
    const { data, error } = await patchLocation(props.locationId, body)
    if (error) throw error
    emit('updated', data); emit('close')
  }catch(e){ err.value = parseApiError(e)?.message || 'Speichern fehlgeschlagen.' }
  finally{ busy.value=false }
}

async function onDelete(){
  if (!confirm(`Location „${props.loc?.name || ''}“ wirklich löschen?`)) return
  try{
    const { error } = await deleteLocation(props.locationId)
    if (error) throw error
    // Seite selbst navigiert zurück; hier nur schließen
    window.location.href = window.location.href.replace(/\/locations\/\d+$/, '/locations')
  }catch(e){
    err.value = parseApiError(e)?.message || 'Löschen fehlgeschlagen.'
  }
}
</script>
