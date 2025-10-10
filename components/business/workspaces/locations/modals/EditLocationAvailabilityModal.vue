<!-- components/business/workspaces/locations/modals/EditLocationAvailabilityModal.vue -->
<template>
  <BaseModal :open="open" title="Verfügbarkeit bearbeiten" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div>
        <label class="form-label">Verfügbarkeit / Hinweise</label>
        <textarea v-model.trim="form.availability_notes" rows="3" class="form-control" placeholder="z. B. bevorzugt Fr–So, keine Feiertage, Vorlauf min. 14 Tage…"></textarea>
      </div>

      <div v-if="err" class="alert alert-danger">{{ err }}</div>

      <div class="d-flex justify-content-end">
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
const { patchLocation, normalizeLocationPayload, parseApiError } = useWorkspaceApi()

const form = reactive({ availability_notes:'' })
watch(() => props.open, (v)=>{ if(v) form.availability_notes = props.loc?.availability_notes || '' })

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
</script>
