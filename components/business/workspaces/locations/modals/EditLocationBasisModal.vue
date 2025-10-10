<!-- components/business/workspaces/locations/modals/EditLocationBasisModal.vue -->
<template>
  <BaseModal :open="open" title="Basis bearbeiten" size="lg" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Name<span class="text-danger">*</span></label>
          <input v-model.trim="form.name" type="text" class="form-control" required placeholder="z. B. Stadthalle West" />
        </div>

        <div class="col-12 col-md-8">
          <label class="form-label">Adresse</label>
          <input v-model.trim="form.address" type="text" class="form-control" placeholder="Straße Hausnr." />
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">PLZ</label>
          <input v-model.trim="form.postal_code" type="text" class="form-control" placeholder="z. B. 10115" />
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label">Stadt</label>
          <input v-model.trim="form.city" type="text" class="form-control" placeholder="z. B. Berlin" />
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">Land (ISO-2)</label>
          <input v-model.trim="form.country" @input="form.country=form.country?.toUpperCase()||''" maxlength="2" type="text" class="form-control" placeholder="DE, AT, CH …" />
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">E-Mail</label>
          <input v-model.trim="form.email" type="email" class="form-control" placeholder="name@domain.tld" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Telefon</label>
          <input v-model.trim="form.phone" type="tel" class="form-control" placeholder="+49…" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Website</label>
          <input v-model.trim="form.website" type="url" class="form-control" placeholder="https://…" />
        </div>
      </div>

      <div v-if="err" class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i>{{ err }}</div>

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
  name:'', address:'', postal_code:'', city:'', country:'',
  email:'', phone:'', website:''
})
watch(() => props.open, (v) => {
  if (v) Object.assign(form, {
    name: props.loc?.name || '', address: props.loc?.address || '',
    postal_code: props.loc?.postal_code || '', city: props.loc?.city || '',
    country: props.loc?.country || '', email: props.loc?.email || '',
    phone: props.loc?.phone || '', website: props.loc?.website || ''
  })
})

const busy = ref(false); const err = ref('')
async function onSave(){
  err.value=''; busy.value=true
  try{
    const body = normalizeLocationPayload(form)
    const { data, error } = await patchLocation(props.locationId, body)
    if (error) throw error
    emit('updated', data)
    emit('close')
  }catch(e){ err.value = parseApiError(e)?.message || 'Speichern fehlgeschlagen.' }
  finally{ busy.value=false }
}
</script>
