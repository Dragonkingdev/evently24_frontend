<!-- components/business/workspaces/locations/modals/EditLocationCapacityModal.vue -->
<template>
  <BaseModal :open="open" title="Kapazität & Fläche bearbeiten" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="row g-3">
        <div class="col-6 col-md-3"><label class="form-label">Fläche (m²)</label><input v-model.number="form.area_sqm" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">Sitzplätze (min)</label><input v-model.number="form.capacity_seated_min" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">Sitzplätze (max)</label><input v-model.number="form.capacity_seated_max" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">Stehend (max)</label><input v-model.number="form.capacity_standing_max" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">WCs</label><input v-model.number="form.toilets_count" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">Parkplätze</label><input v-model.number="form.parking_count" type="number" min="0" class="form-control" /></div>
        <div class="col-6 col-md-3"><label class="form-label">Räume</label><input v-model.number="form.rooms_count" type="number" min="0" class="form-control" /></div>
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

const form = reactive({
  area_sqm:undefined, capacity_seated_min:undefined, capacity_seated_max:undefined, capacity_standing_max:undefined,
  toilets_count:undefined, parking_count:undefined, rooms_count:undefined,
})
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    area_sqm: props.loc?.area_sqm ?? undefined,
    capacity_seated_min: props.loc?.capacity_seated_min ?? undefined,
    capacity_seated_max: props.loc?.capacity_seated_max ?? undefined,
    capacity_standing_max: props.loc?.capacity_standing_max ?? undefined,
    toilets_count: props.loc?.toilets_count ?? undefined,
    parking_count: props.loc?.parking_count ?? undefined,
    rooms_count: props.loc?.rooms_count ?? undefined,
  })
})

const busy = ref(false); const err = ref('')
async function onSave(){
  if (form.capacity_seated_min != null && form.capacity_seated_max != null &&
      Number(form.capacity_seated_min) > Number(form.capacity_seated_max)) {
    err.value = 'Sitzplatz-Minimum darf nicht größer als Maximum sein.'; return
  }
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
