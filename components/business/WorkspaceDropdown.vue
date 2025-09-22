<!-- components/business/workspaces/WorkspaceDropdown.vue -->
<template>
  <div>
    <label class="form-label small text-muted">Workspace</label>
    <div class="d-flex gap-2">
      <select class="form-select" v-model="sel" @change="jump(sel)">
        <option v-for="w in items" :key="w.id" :value="w.id">{{ w.name }}</option>
      </select>
      <button class="btn btn-outline-primary" @click="showCreate = !showCreate" title="Neuer Workspace">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <form v-if="showCreate" class="mt-2" @submit.prevent="createNow">
      <div class="input-group">
        <span class="input-group-text"><i class="bi bi-diagram-3"></i></span>
        <input class="form-control" v-model.trim="name" placeholder="Name" required />
        <button class="btn btn-primary" :disabled="busy">
          <span v-if="busy" class="spinner-border spinner-border-sm me-1"></span>
          Anlegen
        </button>
      </div>
      <div v-if="error" class="text-danger small mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { useWorkspaceApi } from '~/composables/useWorkspaceApi'
import { useLastWorkspace } from '~/composables/useLastWorkspace'

const props = defineProps({
  autoRedirectOnBusiness: { type: Boolean, default: true } // /business → auto weiter
})
const route = useRoute()
const router = useRouter()

const { list, create, setCurrent } = useWorkspaceApi()
const { lastWid } = useLastWorkspace()

const items = ref([])
const sel = ref(null)
const showCreate = ref(false)
const name = ref('')
const busy = ref(false)
const error = ref('')

onMounted(async () => {
  const { data } = await list('', true)
  items.value = data || []

  // Vorauswahl: Route-WID > lastWid > Single
  const routeWid = parseInt(route.params.wid, 10)
  const fallbackWid = Number.isFinite(routeWid) ? routeWid
                     : (lastWid.value ?? (items.value.length === 1 ? items.value[0].id : null))
  sel.value = fallbackWid ?? null

  // /business → optional auto-redirect, außer ?choose=1
  const onBusiness = route.path === '/business'
  if (onBusiness && props.autoRedirectOnBusiness && route.query.choose !== '1' && sel.value) {
    router.replace(`/business/w/${sel.value}/dashboard`)
  }
})

function jump(id){
  if (!id) return
  setCurrent(id) // merkt lastWid & navigiert zu /business/w/<id>/dashboard
}

async function createNow(){
  error.value = ''
  if (!name.value) return
  busy.value = true
  try {
    const { data, error: err } = await create({ name: name.value })
    if (err) throw err
    const newId = data?.id
    if (newId) {
      items.value.unshift(data)
      sel.value = newId
      showCreate.value = false
      name.value = ''
      setCurrent(newId)
    }
  } catch {
    error.value = 'Anlegen fehlgeschlagen.'
  } finally {
    busy.value = false
  }
}
</script>
