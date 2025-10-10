<!-- components/business/workspaces/locations/modals/EditLocationCatalogsModal.vue -->
<template>
  <BaseModal :open="open" title="Kataloge bearbeiten" size="lg" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-4">
      <div>
        <h6 class="mb-2">Kategorien</h6>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="c in categories" :key="c.id">
            <input class="btn-check" type="checkbox" :id="`cat-${c.id}`" :value="c.id" v-model="form.categories" />
            <label class="btn btn-sm" :class="chipClass(form.categories, c.id)" :for="`cat-${c.id}`">
              <i v-if="isSel(form.categories,c.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="c.meta?.icon" :class="`bi ${c.meta.icon} me-1`"></i>{{ c.label }}
            </label>
          </template>
        </div>
      </div>

      <div>
        <h6 class="mb-2">Ausstattung</h6>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="a in amenities" :key="a.id">
            <input class="btn-check" type="checkbox" :id="`am-${a.id}`" :value="a.id" v-model="form.amenities" />
            <label class="btn btn-sm" :class="chipClass(form.amenities, a.id)" :for="`am-${a.id}`">
              <i v-if="isSel(form.amenities,a.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="a.meta?.icon" :class="`bi ${a.meta.icon} me-1`"></i>{{ a.label }}
            </label>
          </template>
        </div>
      </div>

      <div>
        <h6 class="mb-2">Technik</h6>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="t in tech" :key="t.id">
            <input class="btn-check" type="checkbox" :id="`tech-${t.id}`" :value="t.id" v-model="form.tech" />
            <label class="btn btn-sm" :class="chipClass(form.tech, t.id)" :for="`tech-${t.id}`">
              <i v-if="isSel(form.tech,t.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="t.meta?.icon" :class="`bi ${t.meta.icon} me-1`"></i>{{ t.label }}
            </label>
          </template>
        </div>
      </div>

      <div>
        <h6 class="mb-2">Catering & Services</h6>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="s in services" :key="s.id">
            <input class="btn-check" type="checkbox" :id="`svc-${s.id}`" :value="s.id" v-model="form.services" />
            <label class="btn btn-sm" :class="chipClass(form.services, s.id)" :for="`svc-${s.id}`">
              <i v-if="isSel(form.services,s.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="s.meta?.icon" :class="`bi ${s.meta.icon} me-1`"></i>{{ s.label }}
            </label>
          </template>
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
const { patchLocation, normalizeLocationPayload, parseApiError, fetchLocationOptions, categories, amenities, services, tech } = useWorkspaceApi()
await fetchLocationOptions().catch(()=>{})

const form = reactive({ categories:[], amenities:[], tech:[], services:[] })
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    categories: [...(props.loc?.categories||[])],
    amenities:  [...(props.loc?.amenities||[])],
    tech:       [...(props.loc?.tech||[])],
    services:   [...(props.loc?.services||[])],
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
