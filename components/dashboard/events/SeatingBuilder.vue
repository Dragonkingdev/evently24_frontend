<!-- components/dashboard/events/SeatingBuilder.vue -->
<template>
  <div class="row g-3">
    <!-- Sidebar -->
    <div class="col-12 col-lg-4">
      <div class="border rounded p-3 h-100">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="fw-semibold">Werkzeuge</div>
          <span class="badge bg-secondary">{{ mode === 'layout' ? 'Layout' : 'Zuweisung' }}</span>
        </div>

        <!-- Layout-Tools -->
        <template v-if="mode==='layout'">
          <div class="fw-semibold mb-2">Hinzufügen</div>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button class="btn btn-sm btn-outline-primary" @click="addGrid"><i class="bi bi-grid-3x3-gap"></i> Block (Raster)</button>
            <button class="btn btn-sm btn-outline-primary" @click="addBench"><i class="bi bi-window"></i> Block (Bänke)</button>
            <button class="btn btn-sm btn-outline-primary" @click="addRoundTable"><i class="bi bi-circle"></i> Runder Tisch</button>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleStage"><i class="bi bi-easel"></i> Bühne {{ value.stage?.visible ? 'aus' : 'an' }}</button>
            <button class="btn btn-sm btn-outline-secondary" @click="addExit"><i class="bi bi-door-open"></i> Fluchtweg</button>
            <button class="btn btn-sm btn-outline-secondary" @click="addLine"><i class="bi bi-slash-lg"></i> Linie</button>
            <button class="btn btn-sm btn-outline-secondary" @click="addBar"><i class="bi bi-square"></i> Balken</button>
          </div>

          <!-- Block-Properties -->
          <div class="mb-3" v-if="selected.type==='block' && currentBlock">
            <div class="fw-semibold mb-2">Block-Eigenschaften ({{ currentBlock.type }})</div>
            <div class="row g-2">
              <div class="col-7">
                <label class="form-label">Name</label>
                <input v-model.trim="currentBlock.name" class="form-control">
              </div>
              <div class="col-5">
                <label class="form-label">Rotation (°)</label>
                <input v-model.number="currentBlock.rotation" type="number" min="0" max="359" class="form-control">
              </div>

              <!-- Anordnung (nur Grid) -->
              <template v-if="currentBlock.type==='grid'">
                <div class="col-6">
                  <label class="form-label">Anordnung</label>
                  <select v-model="currentBlock.curveMode" class="form-select">
                    <option value="linear">Linear</option>
                    <option value="arc">Bogen</option>
                  </select>
                </div>

                <!-- Linear -->
                <div class="col-6" v-if="currentBlock.curveMode==='linear'">
                  <label class="form-label">Krümmung</label>
                  <input v-model.number="currentBlock.curveAmp" type="number" min="0" class="form-control">
                </div>

                <!-- Bogen -->
                <template v-if="currentBlock.curveMode==='arc'">
                  <div class="col-6">
                    <label class="form-label">Bogenradius (px)</label>
                    <input v-model.number="currentBlock.arcRadius" type="number" min="10" class="form-control" @change="clipAssignments(currentBlock)">
                  </div>
                  <div class="col-6">
                    <label class="form-label">Bogenspan (°)</label>
                    <input v-model.number="currentBlock.arcSpan" type="number" min="10" max="360" class="form-control">
                  </div>

                  <!-- Pro-Reihe Sitzanzahl -->
                  <div class="col-12">
                    <label class="form-label">Sitze pro Reihe</label>
                    <div class="row g-1">
                      <div class="col-6" v-for="(rowCfg, r) in rowsConfigForUI" :key="r">
                        <div class="input-group input-group-sm">
                          <span class="input-group-text">Reihe {{ r+1 }}</span>
                          <input class="form-control" type="number" min="1"
                                 v-model.number="currentBlock.rowsConfig[r].seats"
                                 @change="clipAssignments(currentBlock)">
                        </div>
                      </div>
                    </div>
                    <div class="form-text">Passe die Sitzanzahl jeder Reihe individuell an.</div>
                  </div>
                </template>
              </template>

              <!-- GRID Basis -->
              <template v-if="currentBlock.type==='grid'">
                <div class="col-6">
                  <label class="form-label">Reihen</label>
                  <input v-model.number="currentBlock.rows" type="number" min="1" class="form-control"
                         @change="syncRowsConfig(currentBlock); clipAssignments(currentBlock)">
                </div>
                <div class="col-6">
                  <label class="form-label">Spalten (Linear / Default)</label>
                  <input v-model.number="currentBlock.cols" type="number" min="1" class="form-control" @change="clipAssignments(currentBlock)">
                </div>
                <div class="col-6">
                  <label class="form-label">Sitzgröße</label>
                  <input v-model.number="currentBlock.seatSize" type="number" min="8" class="form-control">
                </div>
                <div class="col-6">
                  <label class="form-label">Abstand</label>
                  <input v-model.number="currentBlock.gap" type="number" min="0" class="form-control">
                </div>
              </template>

              <!-- BENCH -->
              <template v-else-if="currentBlock.type==='bench'">
                <div class="col-6">
                  <label class="form-label">Bänke</label>
                  <input v-model.number="currentBlock.benchRows" type="number" min="1" class="form-control" @change="clipAssignments(currentBlock)">
                </div>
                <div class="col-6">
                  <label class="form-label">Sitze je Bank</label>
                  <input v-model.number="currentBlock.seatsPerBench" type="number" min="1" class="form-control" @change="clipAssignments(currentBlock)">
                </div>
                <div class="col-6">
                  <label class="form-label">Sitzgröße</label>
                  <input v-model.number="currentBlock.seatSize" type="number" min="8" class="form-control">
                </div>
                <div class="col-6">
                  <label class="form-label">Sitz-Abstand</label>
                  <input v-model.number="currentBlock.seatGap" type="number" min="0" class="form-control">
                </div>
                <div class="col-6">
                  <label class="form-label">Bank-Abstand</label>
                  <input v-model.number="currentBlock.benchGap" type="number" min="0" class="form-control">
                </div>
              </template>

              <div class="col-12 d-flex justify-content-between">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="nudge(currentBlock,-5,0)">←</button>
                  <button class="btn btn-outline-secondary" @click="nudge(currentBlock,5,0)">→</button>
                  <button class="btn btn-outline-secondary" @click="nudge(currentBlock,0,-5)">↑</button>
                  <button class="btn btn-outline-secondary" @click="nudge(currentBlock,0,5)">↓</button>
                </div>
                <button class="btn btn-sm btn-outline-danger" @click="removeBlock(currentBlock.id)"><i class="bi bi-trash"></i> Löschen</button>
              </div>
            </div>
          </div>

          <!-- Tisch-Properties -->
          <div class="mb-3" v-if="selected.type==='table' && currentTable">
            <div class="fw-semibold mb-2">Runder Tisch</div>
            <div class="row g-2">
              <div class="col-7"><label class="form-label">Name</label><input v-model.trim="currentTable.name" class="form-control"></div>
              <div class="col-5"><label class="form-label">Sitze</label><input v-model.number="currentTable.seats" type="number" min="1" class="form-control" @change="clipAssignmentsTable(currentTable)"></div>
              <div class="col-6"><label class="form-label">Radius</label><input v-model.number="currentTable.radius" type="number" min="10" class="form-control"></div>
              <div class="col-6"><label class="form-label">Sitzgröße</label><input v-model.number="currentTable.seatSize" type="number" min="8" class="form-control"></div>
              <div class="col-12 d-flex justify-content-between">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="currentTable.x -= 5">←</button>
                  <button class="btn btn-outline-secondary" @click="currentTable.x += 5">→</button>
                  <button class="btn btn-outline-secondary" @click="currentTable.y -= 5">↑</button>
                  <button class="btn btn-outline-secondary" @click="currentTable.y += 5">↓</button>
                </div>
                <button class="btn btn-sm btn-outline-danger" @click="removeTable(currentTable.id)"><i class="bi bi-trash"></i> Löschen</button>
              </div>
            </div>
          </div>

          <!-- Wege -->
          <div class="mb-3" v-if="selected.type && selected.type.startsWith('path') && currentPath">
            <div class="fw-semibold mb-2">Weg / Markierung</div>
            <div class="row g-2" v-if="currentPath.kind==='line'">
              <div class="col-6"><label class="form-label">x1</label><input v-model.number="currentPath.x1" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">y1</label><input v-model.number="currentPath.y1" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">x2</label><input v-model.number="currentPath.x2" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">y2</label><input v-model.number="currentPath.y2" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">Strichstärke</label><input v-model.number="currentPath.strokeWidth" type="number" min="1" class="form-control"></div>
            </div>
            <div class="row g-2" v-else>
              <div class="col-6"><label class="form-label">x</label><input v-model.number="currentPath.x" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">y</label><input v-model.number="currentPath.y" type="number" class="form-control"></div>
              <div class="col-6"><label class="form-label">Breite</label><input v-model.number="currentPath.w" type="number" min="1" class="form-control"></div>
              <div class="col-6"><label class="form-label">Höhe</label><input v-model.number="currentPath.h" type="number" min="1" class="form-control"></div>
            </div>
            <div class="d-flex justify-content-between mt-2">
              <div class="btn-group btn-group-sm" v-if="currentPath.kind==='line'">
                <button class="btn btn-outline-secondary" @click="nudgePath(currentPath, -5, 0)">←</button>
                <button class="btn btn-outline-secondary" @click="nudgePath(currentPath, 5, 0)">→</button>
                <button class="btn btn-outline-secondary" @click="nudgePath(currentPath, 0, -5)">↑</button>
                <button class="btn btn-outline-secondary" @click="nudgePath(currentPath, 0, 5)">↓</button>
              </div>
              <button class="btn btn-sm btn-outline-danger" @click="removePath(currentPath.id)"><i class="bi bi-trash"></i> Löschen</button>
            </div>
          </div>
        </template>

        <!-- Assign-Tools -->
        <template v-else>
          <div class="mb-3">
            <label class="form-label">Aktive Kategorie</label>
            <select v-model="activeCatId" class="form-select">
              <option :value="null">—</option>
              <option v-for="c in categories" :key="c.id ?? c.name" :value="c.id ?? c.name">{{ c.name }}</option>
            </select>
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-sm btn-primary" :disabled="!selectedSeatIds.size || activeCatId===null" @click="assignCategory">Zuweisen</button>
              <button class="btn btn-sm btn-outline-danger" :disabled="!selectedSeatIds.size" @click="removeAssignment">Entfernen</button>
              <button class="btn btn-sm btn-outline-secondary" :disabled="!selectedSeatIds.size" @click="clearSelection">Auswahl leeren</button>
            </div>
          </div>
        </template>

        <!-- JSON Dev Panel -->
        <div class="mt-3">
          <div class="fw-semibold mb-2">Plan JSON (Dev)</div>
          <textarea v-model="jsonText" rows="8" class="form-control font-monospace" spellcheck="false"></textarea>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-sm btn-outline-secondary" @click="prettyJson">Formatieren</button>
            <button class="btn btn-sm btn-outline-secondary" @click="applyJson">Übernehmen</button>
            <button class="btn btn-sm btn-outline-secondary" @click="copyJson">Kopieren</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Canvas -->
    <div class="col-12 col-lg-8">
      <div class="border rounded position-relative" style="height:560px; overflow:hidden;"
           tabindex="0"
           @wheel.prevent="onWheel"
           @keydown.space.prevent="spaceDown=true" @keyup.space="spaceDown=false" @contextmenu.prevent>
        <svg ref="svgRef" :width="canvas.w" :height="canvas.h"
             @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
          <rect :width="canvas.w" :height="canvas.h" fill="#f8fafc"></rect>

          <!-- Welt-Transform -->
          <g :transform="worldTransform">
            <!-- Wege -->
            <g>
              <g v-for="p in value.paths" :key="p.id" @mousedown.stop="mode==='layout' && startDragPath(p, $event)">
                <line v-if="p.kind==='line'" :x1="p.x1" :y1="p.y1" :x2="p.x2" :y2="p.y2"
                      :stroke="p.stroke || '#9ca3af'" :stroke-width="p.strokeWidth || 4" stroke-linecap="round"/>
                <rect v-else :x="p.x" :y="p.y" :width="p.w" :height="p.h" :fill="p.fill || '#e5e7eb'"/>
              </g>
            </g>

            <!-- Bühne -->
            <g v-if="value.stage?.visible"
               :transform="`translate(${value.stage.x},${value.stage.y})`"
               @mousedown.stop="mode==='layout' && startDragStage($event)">
              <rect :width="value.stage.w" :height="value.stage.h" fill="#222" rx="6" ry="6"></rect>
              <text x="10" y="24" fill="#fff" font-size="14" font-weight="bold">{{ value.stage.label }}</text>
            </g>

            <!-- Exits -->
            <g v-for="ex in value.exits" :key="ex.id"
               :transform="`translate(${ex.x},${ex.y})`"
               @mousedown.stop="mode==='layout' && startDragExit(ex, $event)">
              <rect width="40" height="18" fill="#198754" rx="4" ry="4"></rect>
              <text x="6" y="13" fill="#fff" font-size="10">{{ ex.label || 'Exit' }}</text>
            </g>

            <!-- Blöcke -->
            <g v-for="block in value.blocks" :key="block.id"
               :transform="`translate(${block.x},${block.y}) rotate(${block.rotation||0})`">

              <!-- KEIN Hintergrund/Bounding-Rect mehr -->
              <text x="6" y="16" fill="#0f172a" font-size="12" font-weight="bold">{{ block.name }}</text>

              <!-- Rotation-Handle -->
              <g v-if="mode==='layout'">
                <circle :cx="0" :cy="-16" r="6" fill="#0d6efd" class="cursor-rotate"
                        @mousedown.stop="startRotateBlock(block, $event)"/>
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#0d6efd" stroke-dasharray="3 2"/>
              </g>

              <!-- GRID seats -->
              <template v-if="block.type==='grid'">
                <g v-for="seat in seatsOfGrid(block)" :key="seat.id"
                   :transform="`translate(${seat.x},${seat.y})`"
                   @mousedown.stop="mode==='layout' ? startDragBlock(block, $event) : toggleSeat(seat, block)"
                   @click.stop="selectBlock(block.id)">
                  <rect :width="block.seatSize" :height="block.seatSize"
                        :fill="seatFill(seat)" :stroke="mode==='assign' && isSelected(seat.id)? '#0d6efd' : '#475569'"
                        :stroke-width="mode==='assign' && isSelected(seat.id)? 2 : 1" rx="3" ry="3"></rect>
                </g>
              </template>

              <!-- BENCH seats -->
              <template v-else-if="block.type==='bench'">
                <g v-for="r in block.benchRows" :key="r">
                  <rect :x="benchRect(block).x" :y="benchRect(block, r-1).y"
                        :width="benchRect(block).w" :height="benchRect(block).h" fill="#f1f5f9" stroke="#cbd5e1"/>
                </g>
                <g v-for="seat in seatsOfBench(block)" :key="seat.id"
                   :transform="`translate(${seat.x},${seat.y})`"
                   @mousedown.stop="mode==='layout' ? startDragBlock(block, $event) : toggleSeat(seat, block)"
                   @click.stop="selectBlock(block.id)">
                  <rect :width="block.seatSize" :height="block.seatSize"
                        :fill="seatFill(seat)" :stroke="mode==='assign' && isSelected(seat.id)? '#0d6efd' : '#475569'"
                        :stroke-width="mode==='assign' && isSelected(seat.id)? 2 : 1" rx="3" ry="3"></rect>
                </g>
              </template>
            </g>

            <!-- Tische -->
            <g v-for="t in value.tables" :key="t.id"
               :transform="`translate(${t.x},${t.y})`"
               @mousedown.stop="mode==='layout' && startDragTable(t, $event)"
               @click.stop="selectTable(t.id)">
              <circle :r="t.radius" fill="#fff" stroke="#cbd5e1"></circle>
              <text x="0" :y="-(t.radius + 8)" text-anchor="middle" font-size="12" fill="#0f172a">{{ t.name }}</text>
              <g v-for="seat in seatsOfTable(t)" :key="seat.id"
                 :transform="`translate(${seat.x},${seat.y})`"
                 @mousedown.stop="mode==='layout' ? startDragTable(t, $event) : toggleSeat(seat, null, t)">
                <rect :width="t.seatSize" :height="t.seatSize" :x="-t.seatSize/2" :y="-t.seatSize/2"
                      :fill="seatFill(seat)" :stroke="mode==='assign' && isSelected(seat.id)? '#0d6efd' : '#475569'"
                      :stroke-width="mode==='assign' && isSelected(seat.id)? 2 : 1" rx="3" ry="3"></rect>
              </g>
            </g>

            <!-- Auswahlrechteck NUR im Assign-Modus -->
            <rect v-if="mode==='assign' && selection.active"
                  :x="selection.x" :y="selection.y"
                  :width="selection.w" :height="selection.h"
                  fill="rgba(13,110,253,.08)" stroke="#0d6efd" stroke-dasharray="4 2"></rect>
          </g>
        </svg>
      </div>
      <p class="small text-muted mt-2">
        Zoom: Mausrad · Pan: Rechtsklick oder Space+Drag · Auswahl (nur Zuweisung): links ziehen
      </p>
      <p class="small text-muted mt-2">
        Tipp: Linke Maustaste auf leerem Bereich = Auswahlrechteck. Rechtsklick oder Leertaste halten + ziehen = Canvas verschieben.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, isProxy, toRaw, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  mode: { type: String, default: 'layout' }, // 'layout' | 'assign'
  categories: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

// ------- utils / clone / normalize / deep equal -------
function cloneJSON(v, fb) {
  const raw = isProxy(v) ? toRaw(v) : v
  try { return JSON.parse(JSON.stringify(raw ?? fb)) } catch { return JSON.parse(JSON.stringify(fb)) }
}
const DEFAULT_PLAN = {
  stage: { x: 50, y: 10, w: 220, h: 40, label: 'Bühne', visible: true },
  exits: [],
  blocks: [],
  tables: [],
  paths: [],
  assignments: {}
}
function normalizePlan(p){
  p = p && typeof p==='object' ? p : {}
  p.stage = p.stage || { ...DEFAULT_PLAN.stage }
  p.exits = Array.isArray(p.exits) ? p.exits : []
  p.blocks = Array.isArray(p.blocks) ? p.blocks : []
  p.tables = Array.isArray(p.tables) ? p.tables : []
  p.paths  = Array.isArray(p.paths)  ? p.paths  : []
  p.assignments = p.assignments && typeof p.assignments==='object' ? p.assignments : {}
  return p
}
function deepEqual(a,b){
  try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
}

// Lokaler State
const value = reactive(normalizePlan(cloneJSON(props.modelValue, DEFAULT_PLAN)))

// ----- v-model Guard gegen Rekursion -----
let syncingFromParent = false
watch(() => props.modelValue, async (v) => {
  syncingFromParent = true
  const next = normalizePlan(cloneJSON(v, DEFAULT_PLAN))
  for (const k of Object.keys(value)) delete value[k]
  Object.assign(value, next)
  await nextTick()
  syncingFromParent = false
}, { deep: true })

watch(value, (v) => {
  if (syncingFromParent) return
  const payload = normalizePlan(cloneJSON(v, DEFAULT_PLAN))
  const current = normalizePlan(cloneJSON(props.modelValue, DEFAULT_PLAN))
  if (!deepEqual(payload, current)) emit('update:modelValue', payload)
}, { deep: true })

// ------- canvas / pan / zoom -------
const canvas = reactive({ w: 1100, h: 560 })
const pan = reactive({ x: 0, y: 0 })
const scale = ref(1)
const svgRef = ref(null)
let isPanning = false
const spaceDown = ref(false)
const worldTransform = computed(() => `translate(${pan.x},${pan.y}) scale(${scale.value})`)

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)) }
function onWheel(e){
  const rect = svgRef.value.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top
  const prev = scale.value
  const factor = Math.pow(1.001, e.deltaY)
  const next = clamp(prev / factor, 0.3, 3)
  const wx = (cx - pan.x) / prev
  const wy = (cy - pan.y) / prev
  scale.value = next
  pan.x = cx - wx * next
  pan.y = cy - wy * next
}

// ------- selection & assignment -------
const selectedSeatIds = reactive(new Set())
const selection = reactive({ active:false, x:0, y:0, w:0, h:0, x0:0, y0:0 })
const selected = reactive({ type:null, id:null })
const currentBlock = computed(() => value.blocks.find(b => b.id === selected.id) || null)
const currentTable = computed(() => (Array.isArray(value.tables) ? value.tables : []).find(t => t.id === selected.id) || null)
const currentPath  = computed(() => (Array.isArray(value.paths)  ? value.paths  : []).find(p => p.id === selected.id)  || null)
const activeCatId = ref(null)

function selectBlock(id){ selected.type='block'; selected.id=id }
function selectTable(id){ selected.type='table'; selected.id=id }
function clearSelection(){ selectedSeatIds.clear() }
function assignCategory(){
  for (const sid of selectedSeatIds){
    value.assignments[sid] = { ...(value.assignments[sid]||{}), catId: activeCatId.value }
  }
}
function removeAssignment(){
  for (const sid of selectedSeatIds){
    if (value.assignments[sid]) delete value.assignments[sid].catId
  }
}

// ------- colors / fills -------
function hashCode(str){
  let h = 0
  for (let i=0; i<str.length; i++){ h = ((h<<5)-h) + str.charCodeAt(i); h |= 0 }
  return h
}
function catColor(catId){
  if (catId == null) return '#ffffff'
  const h = Math.abs(hashCode(String(catId))) % 360
  return `hsl(${h}, 70%, 85%)`
}
function seatFill(seat){
  if (props.mode !== 'assign') return '#ffffff' // im Layout nie Markierungen
  const a = value.assignments[seat.id]
  const isSel = selectedSeatIds.has(seat.id)
  if (isSel) return 'rgba(13,110,253,.15)'
  if (a && a.catId != null) return catColor(a.catId)
  return '#ffffff'
}

// ------- adders -------
function uid(prefix='id'){ return `${prefix}-${Math.random().toString(36).slice(2,9)}` }
function addGrid(){
  const b = {
    id: uid('grid'),
    type:'grid',
    name:`Block ${value.blocks.length+1}`,
    x:120, y:160,
    rows:6, cols:10,
    seatSize:18, gap:6,
    rotation:0,
    curveMode:'linear',      // 'linear' | 'arc'
    curveAmp:0,              // linear
    arcRadius:200,           // arc
    arcSpan:120,             // arc (Grad)
    rowsConfig: []           // arc: pro Reihe Sitzanzahl
  }
  b.rowsConfig = Array.from({length:b.rows},()=>({seats:b.cols}))
  value.blocks.push(b); selectBlock(b.id)
}
function addBench(){
  const b = { id: uid('bench'), type:'bench', name:`Bank ${value.blocks.length+1}`, x:140, y:200,
              benchRows:2, seatsPerBench:8, seatSize:18, seatGap:6, benchGap:12, rotation:0, curveAmp:0 }
  value.blocks.push(b); selectBlock(b.id)
}
function addRoundTable(){
  value.tables.push({ id: uid('table'), name:`Tisch ${value.tables.length+1}`, x:500, y:260, radius:40, seats:8, seatSize:14 })
  selectTable(value.tables.at(-1).id)
}
function addExit(){ value.exits.push({ id: uid('exit'), x: 20, y: 20, label: 'Exit' }) }
function addLine(){
  const p={ id: uid('line'), kind:'line', x1:50, y1:50, x2:200, y2:50, strokeWidth:4 }
  value.paths.push(p); selected.type='path-line'; selected.id=p.id
}
function addBar(){
  const p={ id: uid('rect'), kind:'rect', x:60, y:80, w:160, h:20, fill:'#e5e7eb' }
  value.paths.push(p); selected.type='path-rect'; selected.id=p.id
}
function toggleStage(){ value.stage.visible = !value.stage.visible }

// ------- remove & nudge / rotate -------
function removeBlock(id){
  value.blocks = value.blocks.filter(b => b.id !== id)
  for (const sid of Object.keys(value.assignments)) if (sid.startsWith(id+':')) delete value.assignments[sid]
  if (selected.id===id){ selected.type=null; selected.id=null }
}
function removeTable(id){
  value.tables = value.tables.filter(t => t.id !== id)
  for (const sid of Object.keys(value.assignments)) if (sid.startsWith(id+':')) delete value.assignments[sid]
  if (selected.id===id){ selected.type=null; selected.id=null }
}
function removePath(id){
  value.paths = value.paths.filter(p => p.id !== id)
  if (selected.id===id){ selected.type=null; selected.id=null }
}
function nudge(block, dx, dy){ block.x += dx; block.y += dy }

// Rotation via Handle
const drag = reactive({ type:null, id:null, wx:0, wy:0 })
function startRotateBlock(block, e){
  drag.type = 'rotate'
  drag.id = block.id
  const w = toWorld(e); drag.wx = w.x; drag.wy = w.y
}
function applyRotate(e){
  const b = value.blocks.find(x => x.id===drag.id); if (!b) return
  const w = toWorld(e)
  const ang = Math.atan2(w.y - b.y, w.x - b.x) * 180 / Math.PI
  b.rotation = ((ang % 360) + 360) % 360
}
function nudgePath(p, dx, dy){
  if (p.kind==='line'){ p.x1+=dx; p.y1+=dy; p.x2+=dx; p.y2+=dy } else { p.x+=dx; p.y+=dy }
}

// ------- geometry / seats -------
function benchRect(b, rIndex=0){
  const w = b.seatsPerBench * b.seatSize + (b.seatsPerBench + 1) * b.seatGap
  const h = b.seatSize + b.seatGap*2
  const x = 0
  const y = 16 + rIndex * (h + (rIndex>0 ? b.benchGap : 0))
  return { x, y, w, h }
}
function seatsOfGrid(b){
  return b.curveMode === 'arc' ? seatsOfGridArc(b) : seatsOfGridLinear(b)
}
function seatsOfGridLinear(b){
  const out = []
  const startY = 16 + b.gap
  const mid = (b.cols - 1) / 2
  for (let r=0; r<b.rows; r++){
    for (let c=0; c<b.cols; c++){
      const id = `${b.id}:${r}-${c}`
      const x = b.gap + c*(b.seatSize + b.gap)
      const curve = (b.curveAmp||0) * Math.sin((c - mid) * Math.PI / (b.cols - 1 || 1))
      const y = startY + r*(b.seatSize + b.gap) + curve
      out.push({ id, x, y, w:b.seatSize, h:b.seatSize, b })
    }
  }
  return out
}

// --- rowsConfig: nie im Render mutieren ---
function ensureRowsConfig(b){
  if (!Array.isArray(b.rowsConfig)) b.rowsConfig = []
  const def = Math.max(1, Number(b.cols)||1)
  if (b.rowsConfig.length !== b.rows){
    while (b.rowsConfig.length < b.rows) b.rowsConfig.push({ seats: def })
    while (b.rowsConfig.length > b.rows) b.rowsConfig.pop()
  }
  // sanitize
  b.rowsConfig = b.rowsConfig.map(rc => ({ seats: Math.max(1, Number(rc?.seats)||1) }))
  return b
}
function syncRowsConfig(b){
  if (b?.type==='grid' && b.curveMode==='arc') ensureRowsConfig(b)
}
const rowsConfigForUI = computed(() => {
  const b = currentBlock.value
  if (!b || b.type!=='grid' || b.curveMode!=='arc') return []
  // nicht mutierend: falls noch leer, gib virtuell die Länge zurück
  return Array.isArray(b.rowsConfig) && b.rowsConfig.length===b.rows
    ? b.rowsConfig
    : Array.from({length: b.rows||0}, (_,i)=> ({ seats: Math.max(1, Number(b.cols)||1) }))
})

// Korrigierend sicherstellen, dass rowsConfig außerhalb des Renderzyklus synchronisiert wird
watch(
  () => [currentBlock.value?.id, currentBlock.value?.type, currentBlock.value?.curveMode, currentBlock.value?.rows, currentBlock.value?.cols],
  () => { const b = currentBlock.value; if (b) syncRowsConfig(b) },
  { immediate: true }
)

function seatsOfGridArc(b){
  // Annahme: rowsConfig ist via Watch synchronisiert
  const out = []
  const rows = Math.max(1, b.rows|0)
  const radius0 = Math.max(10, Number(b.arcRadius) || 200)
  const span = Math.max(10, Math.min(360, Number(b.arcSpan) || 120)) * Math.PI/180
  const angleStart = -span/2
  const ringStep = b.seatSize + b.gap
  const padY = 16
  for (let r=0; r<rows; r++){
    const seatsThisRow = Math.max(1, Number(b.rowsConfig?.[r]?.seats) || Number(b.cols) || 1)
    const angleStep = seatsThisRow > 1 ? span / (seatsThisRow - 1) : 0
    const R = radius0 + r*ringStep
    for (let c=0; c<seatsThisRow; c++){
      const ang = angleStart + c*angleStep
      const cx = Math.cos(ang) * R
      const cy = Math.sin(ang) * R
      const id = `${b.id}:${r}-${c}`
      out.push({ id, x: cx - b.seatSize/2, y: padY + cy - b.seatSize/2, w:b.seatSize, h:b.seatSize, b })
    }
  }
  return out
}
function seatsOfBench(b){
  const out = []
  const mid = (b.seatsPerBench - 1) / 2
  for (let r=0; r<b.benchRows; r++){
    const rect = benchRect(b, r)
    for (let c=0; c<b.seatsPerBench; c++){
      const id = `${b.id}:${r}-${c}`
      const x = b.seatGap + c*(b.seatSize + b.seatGap)
      const curve = (b.curveAmp||0) * Math.sin((c - mid) * Math.PI / (b.seatsPerBench - 1 || 1))
      const y = rect.y + b.seatGap + curve
      out.push({ id, x, y, w:b.seatSize, h:b.seatSize, b })
    }
  }
  return out
}
function seatsOfTable(t){
  const out = []
  const ring = t.radius + (t.seatSize || 14) + 6
  for (let i=0; i<t.seats; i++){
    const angle = (2*Math.PI * i) / t.seats
    const cx = Math.cos(angle) * ring
    const cy = Math.sin(angle) * ring
    const id = `${t.id}:${i}`
    out.push({ id, x: cx, y: cy, w:t.seatSize, h:t.seatSize, t })
  }
  return out
}

// ------- rotation math & selection -------
function deg2rad(a){ return a * Math.PI / 180 }
function rotateLocal(x, y, deg){
  const rad = deg2rad(deg||0), c = Math.cos(rad), s = Math.sin(rad)
  return { x: x*c - y*s, y: x*s + y*c }
}
function seatRectWorld(seat){
  if (seat.b){ // block seat
    const b = seat.b
    const w = seat.w, h = seat.h
    const corners = [
      rotateLocal(seat.x, seat.y, b.rotation||0),
      rotateLocal(seat.x+w, seat.y, b.rotation||0),
      rotateLocal(seat.x, seat.y+h, b.rotation||0),
      rotateLocal(seat.x+w, seat.y+h, b.rotation||0)
    ]
    const xs = corners.map(c => b.x + c.x), ys = corners.map(c => b.y + c.y)
    const minx = Math.min(...xs), maxx = Math.max(...xs)
    const miny = Math.min(...ys), maxy = Math.max(...ys)
    return { x: minx, y: miny, w: maxx-minx, h: maxy-miny }
  }
  if (seat.t){ // table seat
    const t = seat.t
    return { x: t.x + seat.x - seat.w/2, y: t.y + seat.y - seat.h/2, w: seat.w, h: seat.h }
  }
  return { x: 0, y:0, w:0, h:0 }
}
function intersects(a,b){ return !(b.x > a.x + a.w || b.x + b.w < a.x || b.y > a.y + a.h || b.y + b.h < a.y) }

// ------- drag / pan / select -------
function toWorld(e){
  const rect = svgRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  return { x: (x - pan.x)/scale.value, y: (y - pan.y)/scale.value }
}
function onMouseDown(e){
  const right = e.button === 2
  if (right || spaceDown.value){ isPanning = true; const w = toWorld(e); drag.wx = w.x; drag.wy = w.y; return }
  // Auswahlrechteck NUR im Assign-Modus und nur bei Klick auf den leeren Canvas
  if (props.mode==='assign' && e.target === svgRef.value){
    selection.active = true
    const w = toWorld(e)
    selection.x0 = w.x; selection.y0 = w.y
    selection.x = w.x; selection.y = w.y; selection.w = 0; selection.h = 0
    selected.type = null; selected.id = null
  }
}
function onMouseMove(e){
  if (isPanning){
    const w = toWorld(e)
    const dx = (w.x - drag.wx) * scale.value
    const dy = (w.y - drag.wy) * scale.value
    pan.x += dx; pan.y += dy
    drag.wx = w.x; drag.wy = w.y
    return
  }
  if (selection.active){
    const w = toWorld(e)
    selection.x = Math.min(selection.x0, w.x)
    selection.y = Math.min(selection.y0, w.y)
    selection.w = Math.abs(w.x - selection.x0)
    selection.h = Math.abs(w.y - selection.y0)
    updateSelection()
  } else if (drag.type){
    const w = toWorld(e)
    const dx = w.x - drag.wx, dy = w.y - drag.wy
    if (props.mode==='layout'){
      if (drag.type==='block'){ const b = value.blocks.find(x => x.id===drag.id); if (b){ b.x += dx; b.y += dy } }
      if (drag.type==='stage'){ value.stage.x += dx; value.stage.y += dy }
      if (drag.type==='exit'){ const ex = value.exits.find(x => x.id===drag.id); if (ex){ ex.x += dx; ex.y += dy } }
      if (drag.type==='table'){ const t = value.tables.find(x => x.id===drag.id); if (t){ t.x += dx; t.y += dy } }
      if (drag.type==='path'){ const p = value.paths.find(x => x.id===drag.id); if (p){ nudgePath(p, dx, dy) } }
      if (drag.type==='rotate'){ applyRotate(e) }
    }
    drag.wx = w.x; drag.wy = w.y
  }
}
function onMouseUp(){ selection.active=false; isPanning=false; drag.type=null; drag.id=null }
function startDragBlock(block, e){ drag.type='block'; drag.id=block.id; const w=toWorld(e); drag.wx=w.x; drag.wy=w.y; selectBlock(block.id) }
function startDragStage(e){ drag.type='stage'; drag.id='stage'; const w=toWorld(e); drag.wx=w.x; drag.wy=w.y }
function startDragExit(ex, e){ drag.type='exit'; drag.id=ex.id; const w=toWorld(e); drag.wx=w.x; drag.wy=w.y }
function startDragTable(t, e){ drag.type='table'; drag.id=t.id; const w=toWorld(e); drag.wx=w.x; drag.wy=w.y }
function startDragPath(p, e){ drag.type='path'; drag.id=p.id; const w=toWorld(e); drag.wx=w.x; drag.wy=w.y; selected.type=`path-${p.kind}`; selected.id=p.id }

function updateSelection(){
  if (props.mode !== 'assign') return
  selectedSeatIds.clear()
  const sel = { x: selection.x, y: selection.y, w: selection.w, h: selection.h }
  for (const b of value.blocks){
    const seats = (b.type==='grid') ? seatsOfGrid(b) : seatsOfBench(b)
    for (const seat of seats){
      const r = seatRectWorld({ ...seat, b })
      if (intersects(r, sel)) selectedSeatIds.add(seat.id)
    }
  }
  for (const t of value.tables){
    for (const seat of seatsOfTable(t)){
      const r = seatRectWorld({ ...seat, t })
      if (intersects(r, sel)) selectedSeatIds.add(seat.id)
    }
  }
}

// ------- clipping (Assignments bei Strukturänderung säubern) -------
function clipAssignments(block){
  const prefix = `${block.id}:`
  for (const sid of Object.keys(value.assignments)){
    if (!sid.startsWith(prefix)) continue
    const rest = sid.slice(prefix.length)
    const [r,c] = rest.split('-').map(x => parseInt(x,10))
    if (isNaN(r) || isNaN(c) || r < 0 || c < 0){ delete value.assignments[sid]; continue }
    if (block.type === 'grid'){
      if (block.curveMode==='arc'){
        const seatsRow = Math.max(1, Number(block.rowsConfig?.[r]?.seats) || 0)
        if (r >= block.rows || c >= seatsRow) delete value.assignments[sid]
      } else {
        if (r >= block.rows || c >= block.cols) delete value.assignments[sid]
      }
    } else if (block.type === 'bench'){
      if (r >= block.benchRows || c >= block.seatsPerBench) delete value.assignments[sid]
    }
  }
}
function clipAssignmentsTable(table){
  const prefix = `${table.id}:`
  for (const sid of Object.keys(value.assignments)){
    if (!sid.startsWith(prefix)) continue
    const idx = parseInt(sid.slice(prefix.length),10)
    if (isNaN(idx) || idx >= table.seats) delete value.assignments[sid]
  }
}

// ------- JSON Dev Panel -------
const jsonText = ref(JSON.stringify(value, null, 2))
watch(value, v => { jsonText.value = JSON.stringify(v, null, 2) }, { deep: true })
function prettyJson(){ try { jsonText.value = JSON.stringify(JSON.parse(jsonText.value), null, 2) } catch{} }
function applyJson(){
  try {
    const obj = JSON.parse(jsonText.value)
    const next = normalizePlan(cloneJSON(obj, DEFAULT_PLAN))
    for (const k of Object.keys(value)) delete value[k]
    Object.assign(value, next)
  } catch { alert('Ungültiges JSON') }
}
async function copyJson(){ try { await navigator.clipboard.writeText(jsonText.value) } catch {} }
</script>

<style scoped>
.cursor-move { cursor: move; }
.cursor-rotate { cursor: grab; }
.cursor-rotate:active { cursor: grabbing; }
.font-monospace { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; }
</style>
