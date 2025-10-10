<!-- components/business/workspaces/events/EditListingModal.vue -->
<template>
  <BizModal :open="open" title="Listing bearbeiten" @close="close">
    <form id="__listing_form" @submit.prevent="submit" class="vstack gap-3">

      <!-- Listing-Modus: 3 hübsche Karten -->
      <div>
        <label class="form-label d-block mb-2">Modus</label>

        <div class="row g-3">
          <!-- Intern -->
          <div class="col-md-4">
            <div
              role="button"
              tabindex="0"
              @click="form.listing_mode = 'internal'"
              @keyup.enter="form.listing_mode = 'internal'"
              :class="['mode-card h-100', form.listing_mode === 'internal' ? 'active' : '']"
            >
              <div class="d-flex align-items-start">
                <i class="bi bi-basket2-fill fs-4 me-2"></i>
                <div class="flex-grow-1">
                  <div class="fw-semibold">Intern (Ticketsystem)</div>
                  <div class="small text-muted">
                    Verkauf über dein System. Kategorien/Sitzplätze, Gebührenmodus, Stripe-Anbindung.
                  </div>
                </div>
                <i v-if="form.listing_mode === 'internal'" class="bi bi-check2-circle fs-5 ms-2"></i>
              </div>
            </div>
          </div>

          <!-- Extern -->
          <div class="col-md-4">
            <div
              role="button"
              tabindex="0"
              @click="form.listing_mode = 'external'"
              @keyup.enter="form.listing_mode = 'external'"
              :class="['mode-card h-100', form.listing_mode === 'external' ? 'active' : '']"
            >
              <div class="d-flex align-items-start">
                <i class="bi bi-box-arrow-up-right fs-4 me-2"></i>
                <div class="flex-grow-1">
                  <div class="fw-semibold">Extern (Weiterleitung)</div>
                  <div class="small text-muted">
                    Kein internes Ticketing. Zeigt einen externen Ticket-Link an.
                  </div>
                </div>
                <i v-if="form.listing_mode === 'external'" class="bi bi-check2-circle fs-5 ms-2"></i>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="col-md-4">
            <div
              role="button"
              tabindex="0"
              @click="form.listing_mode = 'info'"
              @keyup.enter="form.listing_mode = 'info'"
              :class="['mode-card h-100', form.listing_mode === 'info' ? 'active' : '']"
            >
              <div class="d-flex align-items-start">
                <i class="bi bi-megaphone-fill fs-4 me-2"></i>
                <div class="flex-grow-1">
                  <div class="fw-semibold">Info (ohne Ticketverkauf)</div>
                  <div class="small text-muted">
                    Öffentliche Veranstaltung ohne Ticketshop, ohne Kategorien/Sitzplätze.
                  </div>
                </div>
                <i v-if="form.listing_mode === 'info'" class="bi bi-check2-circle fs-5 ms-2"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Hilfetext je Modus -->
        <div class="form-text mt-2" v-if="form.listing_mode==='internal'">
          Interner Verkauf über dein System.
        </div>
        <div class="form-text mt-2" v-else-if="form.listing_mode==='external'">
          Externer Verkauf – Link wird im Listing angezeigt.
        </div>
        <div class="form-text mt-2" v-else>
          Reines Info-Listing – keine Tickets/Gebühren nötig.
        </div>
      </div>

      <!-- Extern: URL -->
      <div v-if="form.listing_mode==='external'">
        <label class="form-label">Ticket-Link (extern)</label>
        <input
          v-model.trim="form.external_ticket_url"
          type="url"
          class="form-control"
          placeholder="https://…"
          :class="{ 'is-invalid': showErrors && !validExternalUrl }"
        />
        <div class="invalid-feedback" v-if="showErrors && !validExternalUrl">
          Bitte einen gültigen externen Ticket-Link angeben.
        </div>
        <div class="form-text">Im Event-Listing wird der Link einzeilig mit Ellipsis angezeigt.</div>
      </div>

      <!-- Intern: Ticket-System (ohne Seatmap-ID Eingabe) -->
      <div v-if="form.listing_mode==='internal'" class="vstack gap-2">
        <label class="form-label d-block">Ticket-System</label>
        <div class="btn-group" role="group" aria-label="Ticket-System">
          <input type="radio" class="btn-check" id="ts-general" value="general" v-model="form.ticket_sale_mode">
          <label class="btn btn-outline-secondary" for="ts-general">Kontingente (GA)</label>

          <input type="radio" class="btn-check" id="ts-reserved" value="reserved" v-model="form.ticket_sale_mode">
          <label class="btn btn-outline-secondary" for="ts-reserved">Sitzplätze (Seatmap)</label>
        </div>
        <div class="form-text">
          Bei „Sitzplätze (Seatmap)“ legt das Backend automatisch eine Seatmap an, falls noch keine existiert.
        </div>
      </div>

      <!-- Info: kein weiterer Input nötig -->
      <div v-if="form.listing_mode==='info'" class="alert alert-secondary mb-0">
        <i class="bi bi-info-circle me-1"></i>
        Dieses Event wird ohne Ticketing veröffentlicht. Keine weiteren Angaben nötig.
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
const showErrors = ref(false)

const normalizedEvMode = computed(() => props.ev?.listing_mode || 'internal')
const normalizedTicketMode = computed(() => props.ev?.ticket_sale_mode || 'general')
const normalizedExtUrl = computed(() => props.ev?.external_ticket_url || '')

const form = reactive({
  listing_mode: normalizedEvMode.value,
  external_ticket_url: normalizedExtUrl.value,
  ticket_sale_mode: normalizedTicketMode.value
})

watch(() => props.open, v => {
  if (v){
    form.listing_mode = normalizedEvMode.value
    form.external_ticket_url = normalizedExtUrl.value
    form.ticket_sale_mode = normalizedTicketMode.value
    err.value = ''
    showErrors.value = false
  }
})

function close(){ emit('close') }

const normUrl = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)
const validExternalUrl = computed(() => {
  if (form.listing_mode !== 'external') return true
  const v = normUrl(form.external_ticket_url)
  if (!v) return false
  try { const u = new URL(v); return !!u.protocol && !!u.host } catch { return false }
})

async function submit(){
  err.value = ''
  showErrors.value = true

  if (form.listing_mode === 'external' && !validExternalUrl.value) {
    err.value = 'Bitte einen gültigen externen Ticket-Link angeben.'
    return
  }
  if (form.listing_mode === 'internal' && !form.ticket_sale_mode) {
    err.value = 'Bitte ein Ticket-System wählen (GA oder Seatmap).'
    return
  }

  const modeSame = (form.listing_mode === normalizedEvMode.value)
  const noOp =
    modeSame && (
      (form.listing_mode === 'external' && normUrl(form.external_ticket_url) === normUrl(props.ev?.external_ticket_url)) ||
      (form.listing_mode === 'internal' && form.ticket_sale_mode === normalizedTicketMode.value) ||
      (form.listing_mode === 'info')
    )
  if (noOp) { close(); return }

  busy.value = true
  try{
    // Nur minimal nötige Felder an normalizeEventListingPatch übergeben:
    const payload = {
      _prev: {
        listing_mode: props.ev?.listing_mode ?? null,
        external_ticket_url: props.ev?.external_ticket_url ?? null,
        ticket_sale_mode: props.ev?.ticket_sale_mode ?? null,
        // seatmap_id ABSICHTLICH nicht übergeben / nie patchen
      },
      listing_mode: form.listing_mode
    }

    if (form.listing_mode === 'external') {
      const url = normUrl(form.external_ticket_url)
      if (url) payload.external_ticket_url = url
      // kein null schicken
    } else if (form.listing_mode === 'internal') {
      payload.ticket_sale_mode = form.ticket_sale_mode // 'general' | 'reserved'
      // keine ext-URL & keine seatmap_id schicken
    } else if (form.listing_mode === 'info') {
      // nichts weiter schicken: Backend setzt intern ticketing auf "ignorieren"
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

<style scoped>
.mode-card{
  border:1px solid #e9ecef;
  border-radius:.9rem;
  padding:1rem;
  background:#fff;
  cursor:pointer;
  transition:.15s all ease-in-out;
}
.mode-card:hover{ box-shadow:0 10px 24px rgba(0,0,0,.06); transform: translateY(-1px); }
.mode-card.active{
  border-color:#0d6efd;
  box-shadow:0 10px 28px rgba(13,110,253,.12);
}
.mode-card i.bi-check2-circle{ color:#0d6efd; }

.form-text{ color:#6b7280; }

.is-invalid{ border-color:#dc3545; }
.invalid-feedback{ display:block; }
</style>
