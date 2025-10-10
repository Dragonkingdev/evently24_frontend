<!-- components/business/workspaces/locations/modals/EditLocationPricingModal.vue -->
<template>
  <BaseModal :open="open" title="Preise & Tarife bearbeiten" size="lg" @close="$emit('close')">
    <form @submit.prevent="onSave" class="vstack gap-3">
      <div class="alert alert-info small">
        <div class="fw-semibold mb-1"><i class="bi bi-info-circle me-1"></i>So wird gerechnet</div>
        <ul class="mb-0 ps-3">
          <li><strong>Alle Eingaben NETTO</strong> (zzgl. MwSt.).</li>
          <li><strong>Tagespauschale</strong> je Kalendertag (optional inkl. X Std.).</li>
          <li><strong>Staffelrabatte</strong> ab Mindesttagen; höchste passende Staffel gilt.</li>
          <li><strong>Reinigung</strong> einmalig; <strong>Kaution</strong> wird nicht addiert.</li>
          <li><strong>Deutschland:</strong> MwSt. 19 % auto. bei Land = DE (überschreibbar).</li>
        </ul>
      </div>

      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Tagespauschale (netto)</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input v-model.number="form.day_rate_base" type="number" min="0" step="1" class="form-control" />
            <span class="input-group-text">netto</span>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">Std. inkl./Tag</label>
          <input v-model.number="form.day_rate_includes_hours" type="number" min="0" step="1" class="form-control" />
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label">Überstunde (netto)</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input v-model.number="form.extra_hour_rate" type="number" min="0" step="1" class="form-control" />
            <span class="input-group-text">netto</span>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label">Wochenend-Aufschlag</label>
          <div class="input-group">
            <input v-model.number="form.weekend_markup_percent" type="number" min="0" step="1" class="form-control" />
            <span class="input-group-text">%</span>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label">Reinigungspauschale (netto)</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input v-model.number="form.cleaning_fee" type="number" min="0" step="1" class="form-control" />
            <span class="input-group-text">netto</span>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label">Kaution (netto)</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input v-model.number="form.deposit" type="number" min="0" step="1" class="form-control" />
            <span class="input-group-text">netto</span>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">MwSt.</label>
          <template v-if="isDE && !overrideVat">
            <div class="form-control-plaintext">19 % (automatisch für DE)</div>
            <button type="button" class="btn btn-link p-0 small" @click="overrideVat = true">Erweitert: MwSt. manuell setzen</button>
          </template>
          <template v-else>
            <div class="input-group">
              <input v-model.number="form.vat_percent" type="number" min="0" step="1" class="form-control" />
              <span class="input-group-text">%</span>
            </div>
          </template>
        </div>
      </div>

      <div>
        <label class="form-label d-flex align-items-center justify-content-between">
          <span>Staffelrabatte (ab X Tagen ⇒ Y %)</span>
          <button type="button" class="btn btn-sm btn-outline-primary" @click="addDiscountRow">
            <i class="bi bi-plus-lg me-1"></i> Zeile hinzufügen
          </button>
        </label>
        <div class="table-responsive">
          <table class="table table-sm align-middle mb-0">
            <thead><tr class="text-muted"><th style="width:160px">ab Tagen</th><th style="width:180px">Rabatt (%)</th><th></th></tr></thead>
            <tbody>
              <tr v-if="!form.multi_day_discounts.length"><td colspan="3" class="text-muted">Noch keine Staffel definiert.</td></tr>
              <tr v-for="(row, idx) in form.multi_day_discounts" :key="idx">
                <td><input v-model.number="row.min_days" type="number" min="2" step="1" class="form-control form-control-sm" /></td>
                <td><div class="input-group input-group-sm"><input v-model.number="row.percent_off" type="number" min="0" max="100" step="1" class="form-control" /><span class="input-group-text">%</span></div></td>
                <td class="text-end"><button type="button" class="btn btn-sm btn-outline-danger" @click="removeDiscountRow(idx)"><i class="bi bi-trash"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <label class="form-label">Preis-Hinweise</label>
          <textarea v-model.trim="form.pricing_notes" rows="2" class="form-control"></textarea>
        </div>
        <div class="col-12 col-lg-6">
          <label class="form-label">Stornobedingungen</label>
          <textarea v-model.trim="form.cancellation_policy" rows="2" class="form-control"></textarea>
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

const form = reactive({
  day_rate_base:undefined, day_rate_includes_hours:undefined, extra_hour_rate:undefined,
  weekend_markup_percent:undefined, cleaning_fee:undefined, deposit:undefined, vat_percent:undefined,
  multi_day_discounts:[], pricing_notes:'', cancellation_policy:'', country:''
})
watch(() => props.open, (v)=>{
  if(v) Object.assign(form, {
    day_rate_base: props.loc?.day_rate_base ?? undefined,
    day_rate_includes_hours: props.loc?.day_rate_includes_hours ?? undefined,
    extra_hour_rate: props.loc?.extra_hour_rate ?? undefined,
    weekend_markup_percent: props.loc?.weekend_markup_percent ?? undefined,
    cleaning_fee: props.loc?.cleaning_fee ?? undefined,
    deposit: props.loc?.deposit ?? undefined,
    vat_percent: props.loc?.vat_percent ?? undefined,
    multi_day_discounts: Array.isArray(props.loc?.multi_day_discounts) ? JSON.parse(JSON.stringify(props.loc.multi_day_discounts)) : [],
    pricing_notes: props.loc?.pricing_notes || '',
    cancellation_policy: props.loc?.cancellation_policy || '',
    country: props.loc?.country || ''
  })
})

const isDE = computed(()=> (form.country||'').toUpperCase()==='DE')
const overrideVat = ref(false)
watch([isDE,overrideVat],()=>{ if(isDE.value && !overrideVat.value) form.vat_percent = 19 })

function addDiscountRow(){ form.multi_day_discounts.push({ min_days:2, percent_off:10 }) }
function removeDiscountRow(i){ form.multi_day_discounts.splice(i,1) }

const busy = ref(false); const err = ref('')
async function onSave(){
  err.value=''; busy.value=true
  try{
    const { country, ...rest } = form
    const body = normalizeLocationPayload(rest)
    const { data, error } = await patchLocation(props.locationId, body)
    if (error) throw error
    emit('updated', data); emit('close')
  }catch(e){ err.value = parseApiError(e)?.message || 'Speichern fehlgeschlagen.' }
  finally{ busy.value=false }
}
</script>
