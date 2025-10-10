<!-- components/business/workspaces/locations/modals/EditLocationBookingModal.vue -->
<template>
  <BaseModal :open="open" title="Buchung bearbeiten" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-md-4">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="booking_enabled" v-model="form.booking_enabled">
            <label class="form-check-label" for="booking_enabled">Buchbar</label>
          </div>
        </div>
        <div class="col-12 col-md-8">
          <label class="form-label">Buchungs-Hinweise</label>
          <input v-model.trim="form.booking_notes" type="text" class="form-control" placeholder="z. B. nur Wochenenden, Mindestmiete 4 Std.…" />
        </div>
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

const form = reactive({ booking_enabled:false, booking_notes:'' })
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    booking_enabled: !!props.loc?.booking_enabled,
    booking_notes: props.loc?.booking_notes || ''
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
</script>
