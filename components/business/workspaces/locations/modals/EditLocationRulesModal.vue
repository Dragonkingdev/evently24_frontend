<!-- components/business/workspaces/locations/modals/EditLocationRulesModal.vue -->
<template>
  <BaseModal :open="open" title="Regeln bearbeiten" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="row g-3">
        <div class="col-6 col-md-4">
          <label class="form-label">Sperrstunde</label>
          <input v-model="form.curfew_time" type="time" class="form-control" />
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">Mindestalter</label>
          <input v-model.number="form.min_age" type="number" min="0" class="form-control" />
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">Max. Lautstärke (dB)</label>
          <input v-model.number="form.max_noise_level_db" type="number" min="0" class="form-control" />
        </div>

        <div class="col-12">
          <label class="form-label">Regeln</label>
          <div class="d-flex flex-wrap gap-2">
            <template v-for="r in rules" :key="r.id">
              <input class="btn-check" type="checkbox" :id="`rule-${r.id}`" :value="r.id" v-model="form.rules" />
              <label class="btn btn-sm" :class="chipClass(form.rules, r.id)" :for="`rule-${r.id}`" :title="r.id">
                <i v-if="isSel(form.rules,r.id)" class="bi bi-check-lg me-1"></i>
                <i v-else-if="r.meta?.icon" :class="`bi ${r.meta.icon} me-1`"></i>{{ r.label }}
              </label>
            </template>
          </div>
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
const { patchLocation, normalizeLocationPayload, parseApiError, fetchLocationOptions, rules } = useWorkspaceApi()
await fetchLocationOptions().catch(()=>{})

const form = reactive({ curfew_time:'', min_age:undefined, max_noise_level_db:undefined, rules:[] })
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    curfew_time: props.loc?.curfew_time || '',
    min_age: props.loc?.min_age ?? undefined,
    max_noise_level_db: props.loc?.max_noise_level_db ?? undefined,
    rules: [...(props.loc?.rules||[])]
  })
})
function isSel(arr,id){ return Array.isArray(arr) && arr.includes(id) }
function chipClass(arr,id){ return isSel(arr,id)?'btn-success':'btn-outline-secondary' }

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

<style scoped>
.btn.btn-sm{ border-radius:.5rem; }
.btn-check + .btn{ margin-right:.25rem; margin-bottom:.25rem; }
</style>
