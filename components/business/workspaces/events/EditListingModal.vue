<!-- components/business/workspaces/events/EditListingModal.vue -->
<template>
  <BizModal :open="open" title="Listing bearbeiten" @close="close">
    <form id="__listing_form" @submit.prevent="submit" class="vstack gap-3">
      <!-- Listing-Modus -->
      <div>
        <label class="form-label d-block">Modus</label>
        <div class="btn-group" role="group">
          <input type="radio" class="btn-check" id="mode-int" value="internal" v-model="form.listing_mode">
          <label class="btn btn-outline-secondary" for="mode-int">Intern</label>

          <input type="radio" class="btn-check" id="mode-ext" value="external" v-model="form.listing_mode">
          <label class="btn btn-outline-secondary" for="mode-ext">Extern</label>
        </div>
        <div class="form-text" v-if="form.listing_mode==='internal'">
          Interner Verkauf über dein System.
        </div>
        <div class="form-text" v-else>
          Externer Verkauf – Link wird angezeigt.
        </div>
      </div>

      <!-- Extern: URL -->
      <div v-if="form.listing_mode==='external'">
        <label class="form-label">Ticket-Link (extern)</label>
        <input v-model.trim="form.external_ticket_url" type="url" class="form-control" placeholder="https://…" />
        <div class="form-text">Im Event-Listing wird der Link einzeilig mit Ellipsis angezeigt.</div>
      </div>

      <!-- Intern: Ticket-System (ohne Seatmap-ID Eingabe) -->
      <div v-if="form.listing_mode==='internal'" class="vstack gap-2">
        <label class="form-label d-block">Ticket-System</label>
        <div class="btn-group" role="group">
          <input type="radio" class="btn-check" id="ts-general" value="general" v-model="form.ticket_sale_mode">
          <label class="btn btn-outline-secondary" for="ts-general">Kontingente (GA)</label>

          <input type="radio" class="btn-check" id="ts-reserved" value="reserved" v-model="form.ticket_sale_mode">
          <label class="btn btn-outline-secondary" for="ts-reserved">Sitzplätze (Seatmap)</label>
        </div>
        <div class="form-text">
          Bei „Sitzplätze (Seatmap)“ legt das Backend automatisch eine Seatmap an, falls noch keine existiert.
        </div>
      </div>

      <div v-if="err" class="alert alert-danger mt-2">{{ err }}</div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" @click="close">Abbrechen</button>
      <button type="submit" form="__listing_form" class="btn btn-primary" :disabled="busy">
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

const { updateEventListing } = useWorkspaceApi()

const busy = ref(false)
const err = ref('')

const form = reactive({
  listing_mode: props.ev?.listing_mode || 'internal',
  external_ticket_url: props.ev?.external_ticket_url || '',
  ticket_sale_mode: props.ev?.ticket_sale_mode || 'general'
})

watch(() => props.open, v => {
  if (v){
    form.listing_mode = props.ev?.listing_mode || 'internal'
    form.external_ticket_url = props.ev?.external_ticket_url || ''
    form.ticket_sale_mode = props.ev?.ticket_sale_mode || 'general'
    err.value = ''
  }
})

function close(){ emit('close') }

const normUrl = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)

async function submit(){
  err.value = ''

  // No-op Detection
  const modeSame = (form.listing_mode === (props.ev?.listing_mode || 'internal'))
  const noOp =
    modeSame && (
      (form.listing_mode === 'external' &&
        (normUrl(form.external_ticket_url) === normUrl(props.ev?.external_ticket_url))) ||
      (form.listing_mode === 'internal' &&
        (form.ticket_sale_mode === (props.ev?.ticket_sale_mode || 'general')))
    )
  if (noOp) { close(); return }

  // Bei EXTERNAL muss URL gesetzt sein (Backend verlangt es beim Switch)
  if (form.listing_mode === 'external' && !normUrl(form.external_ticket_url)) {
    err.value = 'Bitte einen gültigen externen Ticket-Link angeben.'
    return
  }

  busy.value = true
  try{
    const payload = {
      _prev: {
        listing_mode: props.ev?.listing_mode,
        external_ticket_url: props.ev?.external_ticket_url ?? null,
        ticket_sale_mode: props.ev?.ticket_sale_mode ?? 'general',
        seatmap_id: props.ev?.seatmap_id ?? null // nur für den Normalizer-Hinweis; wird nicht gesendet
      },
      listing_mode: form.listing_mode,
      external_ticket_url: normUrl(form.external_ticket_url),
      ticket_sale_mode: form.ticket_sale_mode
      // WICHTIG: KEINE seatmap_id mitschicken – Backend erzeugt automatisch, falls nötig.
    }

    const res = await updateEventListing(props.eventId, payload)
    emit('updated', res)
    close()
  }catch(e){
    const p = e?.data?.detail || e?.data || e
    err.value = (p?.message || p) || 'Speichern fehlgeschlagen.'
  }finally{
    busy.value = false
  }
}
</script>
