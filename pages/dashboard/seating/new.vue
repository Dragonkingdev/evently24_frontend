<!-- pages/dashboard/seating/new.vue -->
<template>
  <div class="page-header d-flex justify-content-between align-items-center mb-3">
    <h5 class="m-0">Neuen Saalplan erstellen</h5>
    <div class="d-flex gap-2">
      <NuxtLink to="/dashboard/seating" class="btn btn-outline-secondary btn-sm">Zurück</NuxtLink>
      <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveAll">
        <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : 'bi-check2'"></i>
        Speichern
      </button>
    </div>
  </div>

  <div class="d-flex flex-column gap-3">

    <!-- Stammdaten -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="card-title mb-3">Stammdaten</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Plan-Name</label>
            <input v-model.trim="form.title" type="text" class="form-control" placeholder="z. B. Columbiahalle – Standardbestuhlung">
          </div>
          <div class="col-md-3">
            <label class="form-label">Location-ID (optional)</label>
            <input v-model.number="form.location_id" type="number" class="form-control" placeholder="z. B. 42">
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <button :class="btnStep(1)" @click="step=1"><span class="badge bg-secondary me-2">1</span> Layout</button>
          <button :class="btnStep(2)" @click="step=2" :disabled="!seating.blocks.length"><span class="badge bg-secondary me-2">2</span> Sitz-Kategorien</button>
          <button :class="btnStep(3)" @click="step=3" :disabled="!seatCategories.length"><span class="badge bg-secondary me-2">3</span> Preis-Kategorien</button>
        </div>

        <!-- STEP 1: Layout -->
        <div v-if="step===1">
          <SeatingBuilder v-model="seating" mode="layout" />
          <p class="small text-muted mt-2">Erstelle die Blöcke, Bänke, Tische, Wege. (Im Layout sind Sitze nicht selektierbar.)</p>
        </div>

        <!-- STEP 2: Sitz-Kategorien + Zuweisung -->
        <div v-else-if="step===2" class="d-flex flex-column gap-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="m-0">Sitz-Kategorien</h6>
                <button class="btn btn-sm btn-outline-primary" @click="seatCategories.push({ id: uid('sc'), name:'Kategorie', color:'#D9EAF7', desc:'' })">
                  <i class="bi bi-plus"></i> Kategorie
                </button>
              </div>
              <!-- Auto-importierte Komponente -->
              <SeatCategoriesEditor v-model="seatCategories" />
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="mb-2">Sitze zuweisen</h6>
              <SeatingBuilder
                v-model="seating"
                mode="assign"
                :categories="seatCategories"
                assignment-key="seatCatId"
              />
              <p class="small text-muted mt-2">
                Links die aktive Kategorie wählen, dann per Gummiband Sitze markieren und <em>Zuweisen</em>.
              </p>
            </div>
          </div>
        </div>

        <!-- STEP 3: Preis-Kategorien & Mapping -->
        <div v-else-if="step===3" class="d-flex flex-column gap-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="m-0">Preis-Kategorien</h6>
                <button class="btn btn-sm btn-outline-primary" @click="priceCategories.push({ id: uid('pc'), name:'PK', price:0, currency:'EUR', desc:'' })">
                  <i class="bi bi-plus"></i> Preis-Kategorie
                </button>
              </div>
              <TicketCategoriesEditor v-model="priceCategories" />
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="mb-2">Mapping: Sitz-Kategorie → Preis-Kategorie</h6>
              <div class="table-responsive">
                <table class="table align-middle">
                  <thead><tr><th>Sitz-Kategorie</th><th>Preis-Kategorie</th></tr></thead>
                  <tbody>
                    <tr v-for="sc in seatCategories" :key="sc.id">
                      <td>
                        <span class="badge" :style="{backgroundColor: sc.color||'#eee', color:'#111'}">{{ sc.name }}</span>
                      </td>
                      <td>
                        <select class="form-select" v-model="priceMapping[sc.id]">
                          <option :value="null">— keine —</option>
                          <option v-for="pc in priceCategories" :key="pc.id" :value="pc.id">
                            {{ pc.name }} ({{ (Number(pc.price)||0).toFixed(2) }} {{ pc.currency||'EUR' }})
                          </option>
                        </select>
                      </td>
                    </tr>
                    <tr v-if="!seatCategories.length"><td colspan="2" class="text-muted small">Noch keine Sitz-Kategorien.</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="small text-muted m-0">Dieses Mapping nutzt du später beim Ticketing (Auto-Preis je Sitz anhand seiner Sitz-Kategorie).</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboardlayout', auth: true })

import { ref } from 'vue'
import { useRouter } from '#imports'
import { useApi } from '~/composables/useApi'
import SeatingBuilder from '~/components/dashboard/events/SeatingBuilder.vue'
import TicketCategoriesEditor from '~/components/dashboard/events/TicketCategoriesEditor.vue'
/* KEIN Import von SeatCategoriesEditor nötig (auto-import) */

const api = useApi()
const router = useRouter()

const saving = ref(false)
const step = ref(1)
const btnStep = (n) => `btn btn-sm ${step.value===n?'btn-primary':'btn-outline-secondary'}`

const form = ref({
  title: '',
  location_id: null
})

// Saalplan + Kategorien
const seating = ref({
  stage: { x: 50, y: 10, w: 220, h: 40, label: 'Bühne', visible: true },
  exits: [],
  blocks: [],
  tables: [],
  paths: [],
  // seatId -> { seatCatId?: string }
  assignments: {}
})
const seatCategories = ref([])   // [{id,name,color,desc}]
const priceCategories = ref([])  // [{id,name,price,currency,desc}]
const priceMapping = ref({})     // { seatCatId: priceCatId|null }

function uid(prefix='id'){ return `${prefix}-${Math.random().toString(36).slice(2,9)}` }

async function saveAll(){
  if (!form.value.title?.trim()){
    alert('Bitte einen Plan-Namen angeben.')
    return
  }
  try{
    saving.value = true
    // Passe den Endpoint an dein Backend an
    const res = await api.post('/dashboard/seating', {
      title: form.value.title.trim(),
      location_id: form.value.location_id ?? null,
      seating: seating.value,
      seatCategories: seatCategories.value,
      priceCategories: priceCategories.value,
      priceMapping: priceMapping.value
    })
    const newId = res?.data?.id
    if (newId){
      await router.push(`/dashboard/seating/${newId}`)
    } else {
      alert('Saalplan gespeichert.')
    }
  }catch(e){
    console.error(e)
    alert('Speichern fehlgeschlagen.')
  }finally{
    saving.value = false
  }
}
</script>

<style scoped>
.page-header { background:#fff; border:1px solid #e5e7eb; border-radius:.5rem; padding:.75rem 1rem; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
</style>
