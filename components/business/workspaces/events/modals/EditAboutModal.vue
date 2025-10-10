<!-- components/business/workspaces/events/EditAboutModal.vue -->
<template>
  <BizModal :open="open" title="Über das Event bearbeiten" @close="close">
    <!-- Default-Slot -->
    <form id="__about_form" @submit.prevent="submit" class="vstack gap-3">
      <div>
        <label class="form-label">Titel</label>
        <input v-model.trim="form.title" type="text" class="form-control" placeholder="Eventtitel" />
      </div>

      <div>
        <label class="form-label">Kategorie</label>
        <input v-model.trim="form.category" type="text" class="form-control" placeholder="z. B. Konzert" />
      </div>

      <div class="row g-3">
        <div class="col-sm-6">
          <label class="form-label">Start</label>
          <input v-model="form.date" type="datetime-local" class="form-control" />
        </div>
        <div class="col-sm-6">
          <label class="form-label">Ende</label>
          <input v-model="form.end_date" type="datetime-local" class="form-control" />
        </div>
      </div>

      <div>
        <label class="form-label">Zeitzone</label>
        <input v-model.trim="form.time_zone" type="text" class="form-control" placeholder="z. B. Europe/Berlin" />
        <div class="form-text">IANA Timezone (optional)</div>
      </div>

      <div v-if="err" class="alert alert-danger mt-2">{{ err }}</div>
    </form>

    <!-- Footer-Slot MUSS direkt Kind von BizModal sein -->
    <template #footer>
      <button type="button" class="btn btn-outline-secondary" @click="close">Abbrechen</button>
      <button type="submit" form="__about_form" class="btn btn-primary" :disabled="busy">
        <span v-if="busy" class="spinner-border spinner-border-sm me-2"></span>Speichern
      </button>
    </template>
  </BizModal>
</template>

<script setup>
import BizModal from '~/components/business/workspaces/ui/BizModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  ev: { type: Object, required: true },
  eventId: { type: [Number, String], required: true }
})
const emit = defineEmits(['close','updated'])

const { updateEventAbout } = useWorkspaceApi()

const busy = ref(false)
const err = ref('')

const form = reactive({
  title: props.ev?.title ?? '',
  category: props.ev?.category ?? '',
  date: props.ev?.date ? toLocalInput(props.ev.date) : '',
  end_date: props.ev?.end_date ? toLocalInput(props.ev.end_date) : '',
  time_zone: props.ev?.time_zone ?? ''
})

watch(() => props.open, v => {
  if (v){
    Object.assign(form, {
      title: props.ev?.title ?? '',
      category: props.ev?.category ?? '',
      date: props.ev?.date ? toLocalInput(props.ev.date) : '',
      end_date: props.ev?.end_date ? toLocalInput(props.ev.end_date) : '',
      time_zone: props.ev?.time_zone ?? ''
    })
  }
})

function toLocalInput(iso){
  const d = new Date(iso); if (isNaN(d)) return ''
  const pad = n => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function fromLocalInput(s){ return s || null }

function close(){ emit('close') }

async function submit(){
  busy.value = true; err.value = ''
  try{
    const res = await updateEventAbout(props.eventId, {
      title: form.title || null,
      category: form.category || null,
      date: fromLocalInput(form.date),
      end_date: fromLocalInput(form.end_date),
      time_zone: form.time_zone || null
    })
    emit('updated', res)
    close()
  }catch(e){
    err.value = e?.data?.detail || e?.message || 'Speichern fehlgeschlagen.'
  }finally{
    busy.value = false
  }
}
</script>
