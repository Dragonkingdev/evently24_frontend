<!-- components/business/workspaces/events/SeatmapBuilder.vue -->
<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <strong>Sitzplan erstellen & bearbeiten</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="loadEverything">
          <i class="bi bi-arrow-repeat"></i> Laden
        </button>
        <button class="btn btn-sm btn-outline-primary" @click="saveLayout" :disabled="!seatmapId">
          <i class="bi bi-save"></i> Speichern
        </button>
        <div class="vr mx-1 d-none d-lg-block"></div>
        <button class="btn btn-sm btn-outline-secondary" @click="zoomOut" :title="'Zoom out (' + Math.round(zoom*100) + '%)'">
          <i class="bi bi-zoom-out"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="zoomIn" :title="'Zoom in (' + Math.round(zoom*100) + '%)'">
          <i class="bi bi-zoom-in"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="zoomFit" title="Ansicht zentrieren">
          <i class="bi bi-aspect-ratio"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="!seatmapId" class="alert alert-warning">
        <i class="bi bi-exclamation-triangle"></i>
        Dieses Event hat noch keine <strong>Seatmap ID</strong>. Lege zuerst eine Seatmap im Workspace an
        und trage die ID im Event ein.
      </div>

      <div class="row g-3">
        <!-- Tools / Palette -->
        <div class="col-12 col-lg-3">
          <div class="card mb-3">
            <div class="card-header"><strong>Werkzeuge</strong></div>
            <div class="list-group list-group-flush small">
              <button class="list-group-item list-group-item-action" :class="{active: tool==='hand'}" @click="tool='hand'">
                <i class="bi bi-hand me-2"></i> Hand (Pan) <span class="text-muted ms-1">(Space/Mausrad-Mitte)</span>
              </button>
              <button class="list-group-item list-group-item-action" :class="{active: tool==='select'}" @click="tool='select'">
                <i class="bi bi-cursor me-2"></i> Auswahl / Verschieben
              </button>
              <button class="list-group-item list-group-item-action" :class="{active: tool==='seat'}" @click="tool='seat'">
                <i class="bi bi-circle me-2"></i> Sitze zeichnen (ziehen)
              </button>
              <button class="list-group-item list-group-item-action" :class="{active: tool==='shape'}" @click="tool='shape'">
                <i class="bi bi-shapes me-2"></i> Form (Rechteck/Kreis)
              </button>
            </div>

            <div class="card-body small">
              <div class="mb-2">
                <label class="form-label">Aktive Kategorie</label>
                <select class="form-select form-select-sm" v-model.number="activeCategoryId">
                  <option :value="null">— keine —</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    #{{ c.id }} – {{ c.name }} ({{ c.price.toFixed(2) }} €)
                  </option>
                </select>
                <div class="form-text">Neue Sitze übernehmen diese Kategorie.</div>
              </div>

              <div class="mb-2">
                <label class="form-label">Label-Prefix</label>
                <input class="form-control form-control-sm" v-model="labelPrefix" placeholder="z. B. A" />
              </div>

              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label">Sitzgröße</label>
                  <input type="number" class="form-control form-control-sm" v-model.number="meta.seatSize" min="8" />
                </div>
                <div class="col-6">
                  <label class="form-label">Raster-Abstand</label>
                  <input type="number" class="form-control form-control-sm" v-model.number="meta.grid" min="2" />
                </div>
              </div>

              <div class="form-check mt-2">
                <input id="snap" class="form-check-input" type="checkbox" v-model="snapToGrid">
                <label for="snap" class="form-check-label">Am Raster einrasten</label>
              </div>

              <div class="d-flex gap-2 mt-3">
                <button class="btn btn-sm btn-outline-danger flex-fill" @click="deleteSelection" :disabled="!selection.size">
                  <i class="bi bi-trash"></i> Auswahl löschen
                </button>
                <button class="btn btn-sm btn-outline-secondary flex-fill" @click="cloneSelection" :disabled="!selection.size">
                  <i class="bi bi-files"></i> Duplizieren
                </button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><strong>Kategorien & Farben</strong></div>
            <div class="list-group list-group-flush small">
              <div v-for="c in categories" :key="c.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span class="badge me-2" :style="{ background: colorOf(c.id) }">&nbsp;</span>
                  #{{ c.id }} – {{ c.name }}
                </div>
                <strong>{{ c.price.toFixed(2) }} €</strong>
              </div>
              <div v-if="!categories.length" class="list-group-item text-muted">Keine Kategorien – bitte zuerst anlegen.</div>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div class="col-12 col-lg-6">
          <div class="border rounded position-relative seat-canvas" ref="canvasWrap">
            <svg ref="svgRef"
                 :viewBox="viewBox"
                 xmlns="http://www.w3.org/2000/svg"
                 class="bg-white w-100 h-100"
                 @wheel.prevent="onWheel"
                 @mousedown.prevent="onMouseDown"
                 @mousemove="onMouseMove"
                 @mouseup="onMouseUp"
                 @mouseleave="onMouseUp"
                 @dblclick="onDoubleClick">
              <!-- Infinite Grid -->
              <g v-if="showGrid" opacity="0.15">
                <template v-for="x in gridLinesX" :key="'gx'+x">
                  <line :x1="x" :y1="view.y" :x2="x" :y2="view.y+view.h" stroke="#888" stroke-width="0.5" />
                </template>
                <template v-for="y in gridLinesY" :key="'gy'+y">
                  <line :x1="view.x" :y1="y" :x2="view.x+view.w" :y2="y" stroke="#888" stroke-width="0.5" />
                </template>
              </g>

              <!-- Shapes -->
              <g>
                <!-- Rechtecke -->
                <g v-for="sh in shapes.filter(s => s.type==='rect')" :key="sh.id">
                  <rect :x="sh.x" :y="sh.y" :width="sh.w" :height="sh.h"
                        :fill="sh.fill" :stroke="selection.has(sh.id)?'#0d6efd':'#333'" :stroke-width="selection.has(sh.id)?2:1"
                        @mousedown.stop="startDragShape(sh, $event)" />
                  <text :x="sh.x + sh.w/2" :y="sh.y + sh.h/2"
                        text-anchor="middle" dominant-baseline="central"
                        :font-size="sh.fontSize" :fill="sh.textColor">{{ sh.text }}</text>
                  <!-- Resize-Handles -->
                  <g v-if="selection.has(sh.id)">
                    <rect v-for="h in rectHandles(sh)" :key="h.k"
                          :x="h.x-4" :y="h.y-4" width="8" height="8" fill="#0d6efd"
                          style="cursor:nwse-resize" @mousedown.stop="startResizeRect(sh,h.k,$event)" />
                  </g>
                </g>

                <!-- Kreise -->
                <g v-for="sh in shapes.filter(s => s.type==='circle')" :key="sh.id">
                  <circle :cx="sh.cx" :cy="sh.cy" :r="sh.r"
                          :fill="sh.fill" :stroke="selection.has(sh.id)?'#0d6efd':'#333'" :stroke-width="selection.has(sh.id)?2:1"
                          @mousedown.stop="startDragShape(sh, $event)" />
                  <text :x="sh.cx" :y="sh.cy"
                        text-anchor="middle" dominant-baseline="central"
                        :font-size="sh.fontSize" :fill="sh.textColor">{{ sh.text }}</text>
                  <!-- Resize-Handle (Ost) -->
                  <rect v-if="selection.has(sh.id)" :x="sh.cx+sh.r-4" :y="sh.cy-4" width="8" height="8" fill="#0d6efd"
                        style="cursor:ew-resize" @mousedown.stop="startResizeCircle(sh,$event)" />
                </g>
              </g>

              <!-- Seats -->
              <g>
                <g v-for="s in seats" :key="s.id" @mousedown.stop="startDragSeat(s, $event)">
                  <circle :cx="s.x" :cy="s.y" :r="meta.seatSize/2"
                          :fill="fillForSeat(s)" stroke="#333"
                          :stroke-width="selection.has(s.id) ? 2 : 1"/>
                  <text :x="s.x" :y="s.y + (meta.seatSize/2) + 9" font-size="9"
                        text-anchor="middle" class="text-muted">{{ s.label }}</text>
                </g>

                <!-- Ghost Preview für Sitz-Box -->
                <g v-if="ghostSeats.length">
                  <circle v-for="(g,i) in ghostSeats" :key="'g'+i" :cx="g.x" :cy="g.y" :r="meta.seatSize/2"
                          fill="rgba(13,110,253,0.25)" stroke="#0d6efd" stroke-dasharray="2 2" />
                </g>
              </g>

              <!-- Auswahl-Marquee -->
              <rect v-if="marquee"
                    :x="Math.min(marquee.x1, marquee.x2)"
                    :y="Math.min(marquee.y1, marquee.y2)"
                    :width="Math.abs(marquee.x2 - marquee.x1)"
                    :height="Math.abs(marquee.y2 - marquee.y1)"
                    fill="rgba(0,123,255,0.1)" stroke="#0d6efd" stroke-dasharray="4 2" />
              <!-- Sitz-Box-Rahmen -->
              <rect v-if="seatBox"
                    :x="Math.min(seatBox.x1, seatBox.x2)"
                    :y="Math.min(seatBox.y1, seatBox.y2)"
                    :width="Math.abs(seatBox.x2 - seatBox.x1)"
                    :height="Math.abs(seatBox.y2 - seatBox.y1)"
                    fill="rgba(13,110,253,0.06)" stroke="#0d6efd" stroke-dasharray="4 2" />
              <!-- Shape-Box-Rahmen -->
              <rect v-if="shapeBox && shapeTool.type==='rect'"
                    :x="Math.min(shapeBox.x1, shapeBox.x2)"
                    :y="Math.min(shapeBox.y1, shapeBox.y2)"
                    :width="Math.abs(shapeBox.x2 - shapeBox.x1)"
                    :height="Math.abs(shapeBox.y2 - shapeBox.y1)"
                    fill="rgba(2,2,2,0.03)" stroke="#333" stroke-dasharray="4 2" />
              <circle v-if="shapeBox && shapeTool.type==='circle'"
                      :cx="(shapeBox.x1+shapeBox.x2)/2" :cy="(shapeBox.y1+shapeBox.y2)/2"
                      :r="Math.max(2,Math.hypot(shapeBox.x2-shapeBox.x1, shapeBox.y2-shapeBox.y1)/2)"
                      fill="rgba(2,2,2,0.03)" stroke="#333" stroke-dasharray="4 2" />
            </svg>
          </div>

          <div class="d-flex align-items-center justify-content-between mt-2">
            <div class="form-check">
              <input id="grid" class="form-check-input" type="checkbox" v-model="showGrid">
              <label for="grid" class="form-check-label">Raster anzeigen</label>
            </div>
            <div class="small text-muted">
              Sitze: {{ seats.length }} · Formen: {{ shapes.length }} · Auswahl: {{ selection.size }} · Zoom: {{ Math.round(zoom*100) }}%
            </div>
          </div>
        </div>

        <!-- Eigenschaften -->
        <div class="col-12 col-lg-3">
          <div class="card">
            <div class="card-header"><strong>Eigenschaften</strong></div>
            <div class="card-body small">
              <!-- Einzelner Sitz -->
              <template v-if="selection.size === 1 && selectedSeat">
                <div class="mb-2">
                  <label class="form-label">Label</label>
                  <input class="form-control form-control-sm" v-model="singleSeat.label" />
                </div>
                <div class="mb-2">
                  <label class="form-label">Kategorie</label>
                  <select class="form-select form-select-sm" v-model.number="singleSeat.category_id">
                    <option :value="null">— keine —</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      #{{ c.id }} – {{ c.name }} ({{ c.price.toFixed(2) }} €)
                    </option>
                  </select>
                </div>
                <div class="row g-2">
                  <div class="col-6">
                    <label class="form-label">X</label>
                    <input type="number" class="form-control form-control-sm" v-model.number="singleSeat.x" />
                  </div>
                  <div class="col-6">
                    <label class="form-label">Y</label>
                    <input type="number" class="form-control form-control-sm" v-model.number="singleSeat.y" />
                  </div>
                </div>
                <button class="btn btn-sm btn-outline-danger mt-3" @click="deleteSelection">
                  <i class="bi bi-trash"></i> Sitz löschen
                </button>
              </template>

              <!-- Mehrere Sitze -->
              <template v-else-if="selection.size > 1 && selectionIsSeats">
                <div class="alert alert-light border">
                  <strong>{{ selection.size }}</strong> Sitze ausgewählt.
                </div>
                <div class="mb-2">
                  <label class="form-label">Kategorie auf Auswahl anwenden</label>
                  <select class="form-select form-select-sm" v-model.number="bulkCategoryId">
                    <option :value="null">— keine —</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      #{{ c.id }} – {{ c.name }} ({{ c.price.toFixed(2) }} €)
                    </option>
                  </select>
                </div>
                <button class="btn btn-sm btn-outline-primary" @click="applyCategoryToSelection" :disabled="bulkCategoryId===undefined">
                  Übernehmen
                </button>
              </template>

              <!-- Einzelne Form -->
              <template v-else-if="selection.size===1 && selectedShape">
                <div class="mb-2">
                  <label class="form-label">Form</label>
                  <div class="input-group input-group-sm">
                    <select class="form-select" v-model="selectedShape.type">
                      <option value="rect">Rechteck</option>
                      <option value="circle">Kreis</option>
                    </select>
                    <input type="color" class="form-control form-control-color" v-model="selectedShape.fill" title="Füllfarbe" />
                  </div>
                </div>
                <template v-if="selectedShape.type==='rect'">
                  <div class="row g-2">
                    <div class="col-6">
                      <label class="form-label">X</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.x">
                    </div>
                    <div class="col-6">
                      <label class="form-label">Y</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.y">
                    </div>
                    <div class="col-6">
                      <label class="form-label">Breite</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.w">
                    </div>
                    <div class="col-6">
                      <label class="form-label">Höhe</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.h">
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="row g-2">
                    <div class="col-4">
                      <label class="form-label">CX</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.cx">
                    </div>
                    <div class="col-4">
                      <label class="form-label">CY</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.cy">
                    </div>
                    <div class="col-4">
                      <label class="form-label">Radius</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.r">
                    </div>
                  </div>
                </template>
                <div class="row g-2 mt-2">
                  <div class="col-8">
                    <label class="form-label">Text</label>
                    <input class="form-control form-control-sm" v-model="selectedShape.text"/>
                  </div>
                  <div class="col-4">
                    <label class="form-label">Textgröße</label>
                    <input type="number" class="form-control form-control-sm" v-model.number="selectedShape.fontSize"/>
                  </div>
                </div>
                <div class="mt-2">
                  <label class="form-label">Textfarbe</label>
                  <input type="color" class="form-control form-control-color" v-model="selectedShape.textColor" />
                </div>
                <button class="btn btn-sm btn-outline-danger mt-3" @click="deleteSelection">
                  <i class="bi bi-trash"></i> Form löschen
                </button>
              </template>

              <template v-else>
                <div class="text-muted">Nichts ausgewählt.</div>
              </template>

              <hr />

              <!-- Sitz-Box Quick (optional) -->
              <div class="mb-2">
                <label class="form-label">Sitz-Box (schnell)</label>
                <div class="row g-2">
                  <div class="col-4"><input type="number" class="form-control form-control-sm" v-model.number="gridParams.rows" placeholder="Reihen" /></div>
                  <div class="col-4"><input type="number" class="form-control form-control-sm" v-model.number="gridParams.cols" placeholder="Spalten" /></div>
                  <div class="col-4"><input type="number" class="form-control form-control-sm" v-model.number="gridParams.gap" placeholder="Abstand" /></div>
                </div>
                <button class="btn btn-sm btn-outline-secondary mt-2" @click="makeGridQuick">Erzeugen</button>
              </div>

              <div class="mb-2">
                <label class="form-label">Neue Form</label>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-dark" @click="addRect()">Rechteck</button>
                  <button class="btn btn-sm btn-outline-dark" @click="addCircle()">Kreis</button>
                </div>
              </div>
            </div>
          </div>

          <pre v-if="debug" class="small bg-light mt-3 p-2 border rounded">{{ debug }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  eventId: { type: [Number, String], required: true },
  seatmapId: { type: [Number, String, null], default: null }
})
const {
  listTicketCategories, getSeatmap,
  // ⚠️ wichtig: Canvas-Setter benutzen
  setSeatmapLayoutCanvas,
  // optional: summary nach dem Speichern
  seatmapLayoutSummary
} = useWorkspaceApi()

/* ================= State ================= */
const categories = ref([])
const activeCategoryId = ref(null)
const labelPrefix = ref('A')
const snapToGrid = ref(true)
const showGrid = ref(true)
const tool = ref('select') // hand | select | seat | shape
const svgRef = ref(null)
const canvasWrap = ref(null)

const meta = reactive({ width: 1600, height: 1000, seatSize: 16, grid: 24 })
const seats = reactive([])   // {id,label,x,y,category_id,zone?}
const shapes = reactive([])  // rect:{id,type:'rect',x,y,w,h,fill,text,fontSize,textColor} | circle:{id,type:'circle',cx,cy,r,fill,text,fontSize,textColor}
let nextId = 1

// viewBox mit Zoom/Pan
const view = reactive({ x: 0, y: 0, w: 1600, h: 1000 })
const zoom = computed(() => 1600 / view.w)
const viewBox = computed(() => `${view.x} ${view.y} ${view.w} ${view.h}`)

// Auswahl
const selection = reactive(new Set())
const marquee = ref(null)
const seatBox = ref(null)   // für Sitz-Box ziehen
const ghostSeats = ref([])  // Live-Vorschau Sitze
const shapeBox = ref(null)  // Vorschau für Shape-Zeichnen
const bulkCategoryId = ref(undefined)

const gridParams = reactive({ rows: 5, cols: 10, gap: 28 })

// Shape-Tool Defaults
const shapeTool = reactive({ type:'rect', fill:'#eeeeee', text:'', fontSize:12, textColor:'#222222' })

const debug = ref(null)

/* ============ Kategorien & Layout ============ */
async function loadCategories(){
  const { data, error } = await listTicketCategories(props.eventId)
  if (error) return alert('Kategorien laden fehlgeschlagen.')
  categories.value = data || []
  if (!activeCategoryId.value && categories.value.length) activeCategoryId.value = categories.value[0].id
}
async function loadLayout(){
  if (!props.seatmapId) return
  const { data, error } = await getSeatmap(props.seatmapId)
  if (error) return alert('Seatmap laden fehlgeschlagen.')
  const layout = data?.layout || {}

  // 🔄 NEU: zuerst das neue Canvas-Format lesen (layout.canvas),
  // fallback: altes Format (layout.seats/layout.meta/layout.decor)
  const canvas = layout.canvas
  if (canvas && (Array.isArray(canvas.seats) || Array.isArray(canvas.shapes))) {
    // Seats
    const s = Array.isArray(canvas.seats) ? canvas.seats : []
    seats.splice(0, seats.length, ...s.map(o => ({
      id: ++nextId, label: String(o.label || ''), category_id: o.category_id ?? null,
      x: Number(o.x ?? 0), y: Number(o.y ?? 0), zone: o.zone || null
    })))
    // Meta
    const m = canvas.meta || {}
    meta.width = Number(m.width ?? meta.width)
    meta.height = Number(m.height ?? meta.height)
    meta.seatSize = Number(m.seatSize ?? meta.seatSize)
    meta.grid = Number(m.grid ?? meta.grid)
    // Shapes
    const sh = Array.isArray(canvas.shapes) ? canvas.shapes : []
    shapes.splice(0, shapes.length, ...sh.map(o => ({ ...o, id: ++nextId })))
    return
  }

  // Legacy-Fallback (dein alter Code)
  const s = Array.isArray(layout.seats) ? layout.seats : []
  seats.splice(0, seats.length, ...s.map(o => ({
    id: ++nextId, label: String(o.label || ''), category_id: o.category_id ?? null,
    x: Number(o.x ?? 0), y: Number(o.y ?? 0), zone: o.zone || null
  })))
  const m = layout.meta || {}
  meta.width = Number(m.width ?? meta.width)
  meta.height = Number(m.height ?? meta.height)
  meta.seatSize = Number(m.seatSize ?? meta.seatSize)
  meta.grid = Number(m.grid ?? meta.grid)
  // Shapes (alt: decor → Rechtecke)
  const d = Array.isArray(layout.decor) ? layout.decor : []
  shapes.splice(0, shapes.length, ...d.map(o => ({
    id: ++nextId,
    type: 'rect',
    x: Number(o.x||0), y: Number(o.y||0), w: Number(o.w||180), h: Number(o.h||48),
    fill: o.type==='stage' ? '#eeeeee' : o.type==='bar' ? '#f3e5ab' : '#f8d7da',
    text: o.type==='stage' ? 'Bühne' : o.type==='bar' ? 'Bar' : 'Sperrfläche',
    fontSize: 12, textColor:'#222222'
  })))
}
async function saveLayout(){
  if (!props.seatmapId) return
  const layout = {
    version: 2,
    meta: { width: meta.width, height: meta.height, seatSize: meta.seatSize, grid: meta.grid },
    seats: seats.map(s => ({ label: s.label, category_id: s.category_id ?? null, x: Math.round(s.x), y: Math.round(s.y), zone: s.zone || null })),
    shapes: shapes.map(sh => ({ ...sh }))
  }
  const { error } = await setSeatmapLayoutCanvas(props.seatmapId, layout /*, false|true (force) */)
  if (error) return alert('Speichern fehlgeschlagen.')
  await seatmapLayoutSummary(props.seatmapId).catch(()=>{})
  alert('Sitzplan gespeichert.')
}
async function loadEverything(){
  await Promise.allSettled([loadCategories(), loadLayout()])
  zoomFit()
}

/* ============ Grid & Farben ============ */
function colorOf(cid){
  if (!cid) return '#d0d0d0'
  const idx = (cid * 2654435761) % 360
  return `hsl(${idx},70%,70%)`
}
function fillForSeat(s){ return colorOf(s.category_id) }

/* Infinite grid auf Basis von view */
const gridLinesX = computed(() => {
  const g = meta.grid
  const start = Math.floor(view.x / g) * g
  const end = Math.ceil((view.x + view.w) / g) * g
  const out = []
  for (let x = start; x <= end; x += g) out.push(x)
  return out
})
const gridLinesY = computed(() => {
  const g = meta.grid
  const start = Math.floor(view.y / g) * g
  const end = Math.ceil((view.y + view.h) / g) * g
  const out = []
  for (let y = start; y <= end; y += g) out.push(y)
  return out
})
function snap(v){ return snapToGrid.value ? Math.round(v/meta.grid)*meta.grid : v }

/* ============ Zoom & Pan ============ */
function zoomAt(cx, cy, factor){
  const newW = Math.max(200, Math.min(4000, view.w / factor))
  const newH = newW * (view.h / view.w)
  const kx = (cx - view.x) / view.w
  const ky = (cy - view.y) / view.h
  view.x = cx - kx * newW
  view.y = cy - ky * newH
  view.w = newW
  view.h = newH
}
function onWheel(e){
  const { x, y } = svgPoint(e)
  const factor = e.deltaY < 0 ? 1.1 : 1/1.1
  zoomAt(x, y, factor)
}
function zoomIn(){ const cx=view.x+view.w/2, cy=view.y+view.h/2; zoomAt(cx,cy,1.2) }
function zoomOut(){ const cx=view.x+view.w/2, cy=view.y+view.h/2; zoomAt(cx,cy,1/1.2) }
function zoomFit(){ view.x = 0; view.y = 0; view.w = meta.width; view.h = meta.height }

/* ============ Koordinaten / Maus ============ */
function svgPoint(evt){
  const svg = svgRef.value
  const pt = svg.createSVGPoint()
  pt.x = evt.clientX
  pt.y = evt.clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: p.x, y: p.y }
}

/* ============ Kollisionsschutz ============ */
function isOccupied(x, y, ignoreId = null){
  const minDist = meta.seatSize
  for (const s of seats){
    if (ignoreId && s.id === ignoreId) continue
    const dx = s.x - x, dy = s.y - y
    if (Math.hypot(dx, dy) < minDist) return true
  }
  return false
}
function findNearestFree(x0, y0, ignoreId = null){
  const step = Math.max(meta.grid, meta.seatSize)
  const maxRings = 50
  for (let r=0; r<maxRings; r++){
    for (let dx=-r; dx<=r; dx++){
      for (let dy=-r; dy<=r; dy++){
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue
        const x = snap(x0 + dx*step)
        const y = snap(y0 + dy*step)
        if (!isOccupied(x, y, ignoreId)) return { x, y }
      }
    }
  }
  return { x: snap(x0), y: snap(y0) }
}

/* ============ Eingabe / Interaktion ============ */
let dragCtx = null
let spacePressed = false

if (import.meta.client){
  window.addEventListener('keydown', (e)=>{ if (e.code==='Space') spacePressed = true })
  window.addEventListener('keyup', (e)=>{ if (e.code==='Space') spacePressed = false })
}

function onMouseDown(evt){
  const p = svgPoint(evt)

  // Mittlere Taste: Pan
  if (evt.button === 1){
    dragCtx = { mode:'pan', x0:p.x, y0:p.y, vx:view.x, vy:view.y }
    return
  }

  const panMode = spacePressed || tool.value==='hand'
  if (panMode){
    dragCtx = { mode:'pan', x0:p.x, y0:p.y, vx:view.x, vy:view.y }
    return
  }

  if (evt.button !== 0) return

  if (tool.value === 'select') {
    marquee.value = { x1: p.x, y1: p.y, x2: p.x, y2: p.y }
  } else if (tool.value === 'seat') {
    seatBox.value = { x1: p.x, y1: p.y, x2: p.x, y2: p.y }
    ghostSeats.value = []
  } else if (tool.value === 'shape') {
    // Start Zeichnen einer Form gemäß shapeTool.type
    shapeBox.value = { x1: p.x, y1: p.y, x2: p.x, y2: p.y }
  }
}
function onMouseMove(evt){
  const p = svgPoint(evt)

  if (!dragCtx && marquee.value){ marquee.value.x2=p.x; marquee.value.y2=p.y; return }
  if (!dragCtx && seatBox.value){
    seatBox.value.x2 = p.x; seatBox.value.y2 = p.y
    ghostSeats.value = previewSeatsFromBox(seatBox.value)
    return
  }
  if (!dragCtx && shapeBox.value){
    shapeBox.value.x2 = p.x; shapeBox.value.y2 = p.y
    return
  }
  if (!dragCtx) return

  if (dragCtx.mode === 'pan'){
    const dx = p.x - dragCtx.x0
    const dy = p.y - dragCtx.y0
    view.x = dragCtx.vx - dx
    view.y = dragCtx.vy - dy
    return
  }

  if (dragCtx.mode === 'drag-seats'){
    const dx = p.x - dragCtx.x0
    const dy = p.y - dragCtx.y0
    for (const item of dragCtx.items){
      const s = seats.find(se => se.id === item.id)
      if (!s) continue
      s.x = snap(item.ox + dx)
      s.y = snap(item.oy + dy)
    }
    return
  }

  if (dragCtx.mode === 'drag-shape'){
    const dx = p.x - dragCtx.x0
    const dy = p.y - dragCtx.y0
    const sh = shapes.find(x => x.id === dragCtx.id)
    if (!sh) return
    if (sh.type === 'rect'){
      sh.x = snap(dragCtx.ox + dx); sh.y = snap(dragCtx.oy + dy)
    } else {
      sh.cx = snap(dragCtx.ocx + dx); sh.cy = snap(dragCtx.ocy + dy)
    }
    return
  }

  if (dragCtx.mode === 'resize-rect'){
    const sh = shapes.find(x => x.id === dragCtx.id)
    if (!sh) return
    let w = dragCtx.ow + (dragCtx.k.includes('e') ? (p.x - dragCtx.x0) : (dragCtx.k.includes('w') ? -(p.x - dragCtx.x0) : 0))
    let h = dragCtx.oh + (dragCtx.k.includes('s') ? (p.y - dragCtx.y0) : (dragCtx.k.includes('n') ? -(p.y - dragCtx.y0) : 0))
    let x = dragCtx.ox + (dragCtx.k.includes('w') ? (p.x - dragCtx.x0) : 0)
    let y = dragCtx.oy + (dragCtx.k.includes('n') ? (p.y - dragCtx.y0) : 0)
    if (dragCtx.keepRatio){
      const r = dragCtx.ow/dragCtx.oh || 1
      if (Math.abs(w/h) > r) w = h*r; else h = w/r
    }
    sh.x = snap(x); sh.y = snap(y)
    sh.w = Math.max(2, snap(w)); sh.h = Math.max(2, snap(h))
    return
  }

  if (dragCtx.mode === 'resize-circle'){
    const sh = shapes.find(x => x.id === dragCtx.id)
    if (!sh) return
    const dx = p.x - sh.cx
    const dy = p.y - sh.cy
    let r = Math.max(2, Math.hypot(dx, dy))
    sh.r = snap(r)
    return
  }
}
function onMouseUp(){
  if (marquee.value){
    const x1 = Math.min(marquee.value.x1, marquee.value.x2)
    const y1 = Math.min(marquee.value.y1, marquee.value.y2)
    const x2 = Math.max(marquee.value.x1, marquee.value.x2)
    const y2 = Math.max(marquee.value.y1, marquee.value.y2)
    selection.clear()
    // Seats + Shapes in Box wählen
    seats.forEach(s => { if (s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2) selection.add(s.id) })
    shapes.forEach(sh => {
      if (sh.type==='rect'){
        if (sh.x >= x1 && sh.x+sh.w <= x2 && sh.y >= y1 && sh.y+sh.h <= y2) selection.add(sh.id)
      } else {
        if (sh.cx - sh.r >= x1 && sh.cx + sh.r <= x2 && sh.cy - sh.r >= y1 && sh.cy + sh.r <= y2) selection.add(sh.id)
      }
    })
    marquee.value = null
  }

  // Sitz-Box committen
  if (seatBox.value){
    commitSeatsFromGhost()
    seatBox.value = null
    ghostSeats.value = []
  }

  // Shape-Box committen
  if (shapeBox.value){
    const b = shapeBox.value
    const x1 = Math.min(b.x1, b.x2), y1 = Math.min(b.y1, b.y2)
    const x2 = Math.max(b.x1, b.x2), y2 = Math.max(b.y1, b.y2)
    const w = Math.max(2, x2 - x1), h = Math.max(2, y2 - y1)
    if (shapeTool.type === 'rect'){
      shapes.push({ id: ++nextId, type:'rect', x: snap(x1), y: snap(y1), w: snap(w), h: snap(h),
        fill: shapeTool.fill, text: shapeTool.text, fontSize: shapeTool.fontSize, textColor: shapeTool.textColor })
      selection.clear(); selection.add(nextId)
    } else {
      const cx = (x1+x2)/2, cy = (y1+y2)/2
      const r = Math.max(2, Math.hypot(x2-x1, y2-y1)/2)
      shapes.push({ id: ++nextId, type:'circle', cx: snap(cx), cy: snap(cy), r: snap(r),
        fill: shapeTool.fill, text: shapeTool.text, fontSize: shapeTool.fontSize, textColor: shapeTool.textColor })
      selection.clear(); selection.add(nextId)
    }
    shapeBox.value = null
  }

  dragCtx = null
}
function onDoubleClick(){ selection.clear() }

/* ============ Seats erstellen / Vorschau ============ */
function nextSeatNumber(prefix){
  let maxN = 0
  for (const s of seats){
    const m = String(s.label||'').match(/^(.+?)-(\d+)$/)
    if (m && m[1] === prefix){
      const n = parseInt(m[2], 10); if (n > maxN) maxN = n
    }
  }
  return maxN + 1
}
function createSeatAt(x, y, cid, label){
  seats.push({
    id: ++nextId,
    label: label || `${labelPrefix.value}-${nextSeatNumber(labelPrefix.value)}`,
    x: snap(x), y: snap(y), category_id: cid ?? null, zone: null
  })
}
function previewSeatsFromBox(box){
  const x1 = Math.min(box.x1, box.x2)
  const y1 = Math.min(box.y1, box.y2)
  const x2 = Math.max(box.x1, box.x2)
  const y2 = Math.max(box.y1, box.y2)
  const gap = Math.max(8, meta.grid)
  const out = []
  for (let y = snap(y1); y <= snap(y2); y += gap){
    for (let x = snap(x1); x <= snap(x2); x += gap){
      out.push({ x, y })
    }
  }
  return out
}
function commitSeatsFromGhost(){
  const prefix = labelPrefix.value
  for (const g of ghostSeats.value){
    const pos = isOccupied(g.x, g.y) ? findNearestFree(g.x, g.y) : g
    createSeatAt(pos.x, pos.y, activeCategoryId.value, `${prefix}-${nextSeatNumber(prefix)}`)
  }
}
function makeGridQuick(){
  const rows = Math.max(1, gridParams.rows|0)
  const cols = Math.max(1, gridParams.cols|0)
  const gap = Math.max(8, gridParams.gap|0)
  const startX = snap(view.x + view.w/2 - (cols-1)*gap/2)
  const startY = snap(view.y + view.h/2 - (rows-1)*gap/2)
  for (let r=0; r<rows; r++){
    for (let c=0; c<cols; c++){
      const x = startX + c*gap, y = startY + r*gap
      const pos = isOccupied(x,y) ? findNearestFree(x,y) : {x,y}
      createSeatAt(pos.x, pos.y, activeCategoryId.value, `${labelPrefix.value}-${nextSeatNumber(labelPrefix.value)}`)
    }
  }
}

/* ============ Shapes: hinzufügen, bewegen, resize ============ */
function addRect(){
  const x = snap(view.x + 40), y = snap(view.y + 40)
  shapes.push({ id: ++nextId, type:'rect', x, y, w: 180, h: 60, fill:'#eeeeee', text:'', fontSize:12, textColor:'#222222' })
}
function addCircle(){
  const cx = snap(view.x + 140), cy = snap(view.y + 140)
  shapes.push({ id: ++nextId, type:'circle', cx, cy, r: 70, fill:'#eeeeee', text:'', fontSize:12, textColor:'#222222' })
}
function startDragShape(sh, evt){
  if (evt.button !== 0) return
  if (!selection.has(sh.id)) { selection.clear(); selection.add(sh.id) }
  const p = svgPoint(evt)
  if (sh.type === 'rect'){
    dragCtx = { mode:'drag-shape', id: sh.id, x0:p.x, y0:p.y, ox: sh.x, oy: sh.y }
  } else {
    dragCtx = { mode:'drag-shape', id: sh.id, x0:p.x, y0:p.y, ocx: sh.cx, ocy: sh.cy }
  }
}
function rectHandles(sh){
  return [
    { k:'nw', x: sh.x,       y: sh.y },
    { k:'ne', x: sh.x+sh.w,  y: sh.y },
    { k:'sw', x: sh.x,       y: sh.y+sh.h },
    { k:'se', x: sh.x+sh.w,  y: sh.y+sh.h }
  ]
}
function startResizeRect(sh, k, evt){
  const p = svgPoint(evt)
  dragCtx = { mode:'resize-rect', id: sh.id, k, x0:p.x, y0:p.y, ox: sh.x, oy: sh.y, ow: sh.w, oh: sh.h, keepRatio: evt.shiftKey }
}
function startResizeCircle(sh, evt){
  dragCtx = { mode:'resize-circle', id: sh.id }
}

/* ============ Seats drag/select helpers ============ */
function startDragSeat(s, evt){
  if (evt.button !== 0) return
  if (!selection.has(s.id)) { selection.clear(); selection.add(s.id) }
  const p = svgPoint(evt)
  dragCtx = {
    mode: 'drag-seats',
    x0: p.x, y0: p.y,
    items: [...selection].filter(id => seats.find(x => x.id===id)).map(id => {
      const seat = seats.find(x => x.id === id)
      return { id, ox: seat.x, oy: seat.y }
    })
  }
}
function cloneSelection(){
  if (!selection.size) return
  const ids = [...selection]
  selection.clear()
  ids.forEach(id => {
    const s = seats.find(x => x.id === id)
    if (s){
      const pos = findNearestFree(s.x + meta.grid, s.y + meta.grid)
      const n = { id: ++nextId, label: s.label, category_id: s.category_id, x: pos.x, y: pos.y, zone: s.zone || null }
      seats.push(n); selection.add(n.id); return
    }
    const sh = shapes.find(x => x.id === id)
    if (sh){
      if (sh.type==='rect'){
        const n = { ...sh, id: ++nextId, x: sh.x + meta.grid, y: sh.y + meta.grid }
        shapes.push(n); selection.add(n.id)
      } else {
        const n = { ...sh, id: ++nextId, cx: sh.cx + meta.grid, cy: sh.cy + meta.grid }
        shapes.push(n); selection.add(n.id)
      }
    }
  })
}
function deleteSelection(){
  if (!selection.size) return
  const keepSeats = seats.filter(s => !selection.has(s.id))
  const keepShapes = shapes.filter(s => !selection.has(s.id))
  seats.splice(0, seats.length, ...keepSeats)
  shapes.splice(0, shapes.length, ...keepShapes)
  selection.clear()
}

/* ============ Bulk Kategorie ============ */
function applyCategoryToSelection(){
  seats.forEach(s => { if (selection.has(s.id)) s.category_id = (bulkCategoryId.value ?? null) })
}

/* ============ Single Seat Editor ============ */
const singleSeat = reactive({ id:null, label:'', x:0, y:0, category_id:null })
const selectedSeat = computed(() => {
  if (selection.size !== 1) return null
  const id = [...selection][0]
  return seats.find(x => x.id===id) || null
})
const selectedShape = computed(() => {
  if (selection.size !== 1) return null
  const id = [...selection][0]
  return shapes.find(x => x.id===id) || null
})
const selectionIsSeats = computed(() => {
  for (const id of selection){
    if (!seats.find(s => s.id===id)) return false
  }
  return selection.size>0
})
watch(() => [...selection], () => {
  if (selection.size === 1){
    const id = [...selection][0]
    const s = seats.find(x => x.id === id)
    if (s){
      singleSeat.id = s.id
      singleSeat.label = s.label
      singleSeat.x = s.x
      singleSeat.y = s.y
      singleSeat.category_id = s.category_id ?? null
    }
  }
}, { deep:true })
watch(singleSeat, () => {
  if (!singleSeat.id) return
  const s = seats.find(x => x.id === singleSeat.id)
  if (!s) return
  s.label = singleSeat.label
  s.x = snap(singleSeat.x)
  s.y = snap(singleSeat.y)
  s.category_id = singleSeat.category_id ?? null
  if (isOccupied(s.x, s.y, s.id)){
    const best = findNearestFree(s.x, s.y, s.id)
    s.x = best.x; s.y = best.y
  }
}, { deep:true })

/* ============ Lifecycle ============ */
onMounted(loadEverything)
</script>

<style scoped>
.seat-canvas { height: 70vh; overflow: hidden; }
svg { user-select: none; cursor: default; }
.list-group-item.active { background: #0d6efd; color: #fff; }
/* Optional: Cursor-Hinweise */
:deep(svg .seat-cursor) { cursor: crosshair; }
</style>
