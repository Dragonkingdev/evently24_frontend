<!-- pages/dashboard/seating/[id].vue -->
<template>
  <div class="page-header d-flex justify-content-between align-items-center mb-3">
    <h5 class="m-0">Saalplan bearbeiten</h5>
    <div class="d-flex gap-2">
      <NuxtLink to="/dashboard" class="btn btn-outline-secondary btn-sm">Zurück</NuxtLink>
      <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveAll">
        <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : 'bi-check2'"></i>
        Speichern
      </button>
    </div>
  </div>

  <div v-if="pending" class="text-muted">Lade…</div>
  <div v-else-if="error" class="alert alert-danger">Konnte Saalplan nicht laden.</div>

  <div v-else class="d-flex flex-column gap-3">

    <!-- Info -->
    <div class="alert alert-light border">
      <ol class="m-0 ps-3">
        <li><strong>Layout</strong> bauen (Blöcke, Bänke, Tische, Wege).</li>
        <li>Sitze per Auswahl einer <strong>Sitz-Kategorie</strong> zuweisen.</li>
        <li>Optional: <strong>Preis-Kategorien</strong> anlegen und Sitz-Kategorien darauf mappen.</li>
      </ol>
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
                Auswahl mit der Maus aufziehen (nur im Zuweisungsmodus). Links Panel: aktive Kategorie wählen → <em>Zuweisen</em>.
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
                          <option v-for="pc in priceCategories" :key="pc.id" :value="pc.id">{{ pc.name }} ({{ pc.price?.toFixed?.(2) ?? 0 }} {{ pc.currency||'EUR' }})</option>
                        </select>
                      </td>
                    </tr>
                    <tr v-if="!seatCategories.length"><td colspan="2" class="text-muted small">Noch keine Sitz-Kategorien.</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="small text-muted m-0">Dieses Mapping greift später beim Event-Ticketing (z. B. Auto-Preis je Sitz anhand seiner Sitz-Kategorie).</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'businesslayout', auth: true })

import { ref, computed, watchEffect } from 'vue'
import { useRoute, useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'
import SeatingBuilder from '~/components/dashboard/events/SeatingBuilder.vue'
import SeatCategoriesEditor from '~/components/dashboard/seating/SeatCategoriesEditor.vue'
import TicketCategoriesEditor from '~/components/dashboard/events/TicketCategoriesEditor.vue'

const route = useRoute()
const api = useApi()
const id = Number(route.params.id) // dein Saalplan-/Location-ID

const saving = ref(false)
const step = ref(1)
const btnStep = (n) => `btn btn-sm ${step.value===n?'btn-primary':'btn-outline-secondary'}`

const { data: planData, pending, error, refresh } = await useAsyncData(
  () => `seating-${id}`,
  // ⤵️ API-Pfad ggf. anpassen: z. B. /dashboard/locations/:id/seating
  () => api.get(`/dashboard/seating/${id}`).then(r => r.data)
)

// ------- State -------
const seating = ref({
  stage: { x: 50, y: 10, w: 220, h: 40, label: 'Bühne', visible: true },
  exits: [],
  blocks: [],
  tables: [],
  paths: [],
  assignments: {}        // seatId -> { seatCatId?: string }
})
const seatCategories = ref([])      // [{id,name,color,desc}]
const priceCategories = ref([])     // [{id,name,price,currency,desc}]
const priceMapping = ref({})        // { seatCatId: priceCatId|null }

// Init (nur einmal stabil initialisieren)
const initialized = ref(false)
watchEffect(() => {
  const p = planData.value
  if (!p || initialized.value) return

  seating.value = p.seating ? JSON.parse(JSON.stringify(p.seating)) : seating.value
  // Safety defaults:
  seating.value.tables = Array.isArray(seating.value.tables) ? seating.value.tables : []
  seating.value.paths  = Array.isArray(seating.value.paths)  ? seating.value.paths  : []
  seating.value.assignments = seating.value.assignments && typeof seating.value.assignments==='object' ? seating.value.assignments : {}

  seatCategories.value  = Array.isArray(p.seatCategories)  ? JSON.parse(JSON.stringify(p.seatCategories))  : []
  priceCategories.value = Array.isArray(p.priceCategories) ? JSON.parse(JSON.stringify(p.priceCategories)) : []
  priceMapping.value    = p.priceMapping && typeof p.priceMapping==='object' ? JSON.parse(JSON.stringify(p.priceMapping)) : {}

  initialized.value = true
})

function uid(prefix='id'){ return `${prefix}-${Math.random().toString(36).slice(2,9)}` }

async function saveAll(){
  try{
    saving.value = true
    // ⤵️ API-Pfad ggf. anpassen: z. B. /dashboard/locations/:id/seating
    await api.put(`/dashboard/seating/${id}`, {
      seating: seating.value,
      seatCategories: seatCategories.value,
      priceCategories: priceCategories.value,
      priceMapping: priceMapping.value
    })
    await refresh()
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
