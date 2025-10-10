<!-- components/business/workspaces/locations/modals/EditLocationMediaModal.vue -->
<template>
  <BaseModal :open="open" title="Medien bearbeiten" size="lg" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div>
        <label class="form-label">Bild-URLs (kommagetrennt)</label>
        <input v-model="imagesInput" type="text" class="form-control" placeholder="https://…/1.jpg, https://…/2.jpg" />
        <div class="form-text">Einfacher Start — später durch Upload ersetzen.</div>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <img v-for="(u,i) in form.image_urls" :key="i" :src="u" alt="" style="height:60px" class="rounded border" />
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

const form = reactive({ image_urls:[] })
watch(() => props.open, (v)=>{ if(v) form.image_urls = [...(props.loc?.image_urls||[])] })

const imagesInput = computed({
  get: () => (form.image_urls || []).join(', '),
  set: (val) => { form.image_urls = (val || '').split(',').map(s=>s.trim()).filter(Boolean) }
})

const busy = ref(false); const err = ref('')
async function onSave(){
  err.value=''; busy.value=true
  try{
    const body = normalizeLocationPayload({ image_urls: form.image_urls })
    const { data, error } = await patchLocation(props.locationId, body)
    if (error) throw error
    emit('updated', data); emit('close')
  }catch(e){ err.value = parseApiError(e)?.message || 'Speichern fehlgeschlagen.' }
  finally{ busy.value=false }
}
</script>
