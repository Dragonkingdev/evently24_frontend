<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  seatmap: { type: Object, required: true },
  selected: { type: Array, default: () => [] } // v-model:selected
})
const emit = defineEmits(['update:selected'])

/** Layout-Konstanten */
const SEAT = { w: 22, h: 22, gapX: 8, gapY: 10, radius: 4 }
const ZONE_GAP = { x: 80, y: 80 }
const PADDING = 40

/** Kategorien-Mapping */
const catMap = computed(() => {
  const m = new Map()
  ;(props.seatmap?.categories || []).forEach(c => m.set(c.id, c))
  return m
})

/** Plan layouten */
function layoutPlan(plan) {
  const zones = plan?.zones || []
  let cursorX = 0, cursorY = 0, rowHeightMax = 0
  const out = []

  zones.forEach((z, zi) => {
    const zx = Number.isFinite(z.x) ? z.x : cursorX
    const zy = Number.isFinite(z.y) ? z.y : cursorY

    const rows = z.rows || []
    let maxSeats = 0
    rows.forEach(r => { maxSeats = Math.max(maxSeats, (r.seats || []).length) })

    const zoneWidth  = maxSeats * SEAT.w + Math.max(0, maxSeats - 1) * SEAT.gapX
    const zoneHeight = rows.length * SEAT.h + Math.max(0, rows.length - 1) * SEAT.gapY

    out.push({
      id: z.id, name: z.name, catId: z.catId,
      x: zx, y: zy, width: zoneWidth, height: zoneHeight,
      rows: rows.map((r, ri) => ({
        index: r.index ?? (ri + 1),
        seats: (r.seats || []).map((s, si) => ({
          id: s.id,
          n: s.n ?? (si + 1),
          x: zx + si * (SEAT.w + SEAT.gapX),
          y: zy + ri * (SEAT.h + SEAT.gapY),
          status: s.status || 'free',
          catId: s.catId || z.catId
        }))
      }))
    })

    if (!Number.isFinite(z.x) || !Number.isFinite(z.y)) {
      rowHeightMax = Math.max(rowHeightMax, zoneHeight)
      cursorX += zoneWidth + ZONE_GAP.x
      if ((zi + 1) % 3 === 0) { // 3 Zonen pro Reihe
        cursorX = 0
        cursorY += rowHeightMax + ZONE_GAP.y
        rowHeightMax = 0
      }
    }
  })

  const maxX = Math.max(...out.map(z => z.x + z.width), 0)
  const maxY = Math.max(...out.map(z => z.y + z.height), 0)
  return { zones: out, width: maxX + PADDING, height: maxY + PADDING }
}
const layout = computed(() => layoutPlan(props.seatmap?.plan || {}))

/** Auswahl-State */
const selectedIds = ref(new Set(props.selected.map(s => s.id)))
watch(() => props.selected, arr => {
  selectedIds.value = new Set(arr.map(s => s.id))
})

function seatLabel(zone, seat) {
  const rowIdx = zone.rows.findIndex(r => r.seats.some(s => s.id === seat.id))
  const rowNumber = zone.rows[rowIdx]?.index ?? (rowIdx + 1)
  return `${zone.name || zone.id} • Reihe ${rowNumber}, Sitz ${seat.n}`
}
function toggleSeat(zone, seat) {
  if (seat.status !== 'free') return
  const id = seat.id

  // in-place Mutation -> NEUE Set-Instanz erzeugen, damit Vue reagiert
  const next = new Set(selectedIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selectedIds.value = next

  emitSelected()
}

function emitSelected() {
  const out = []
  layout.value.zones.forEach(z => {
    z.rows.forEach(r => {
      r.seats.forEach(s => {
        if (selectedIds.value.has(s.id)) {
          const cat = catMap.value.get(s.catId) || {}
          out.push({
            id: s.id,
            label: seatLabel(z, s),
            catId: s.catId,
            catName: cat.name || s.catId || 'Sitzplatz',
            price: cat.price_eur ?? 0
          })
        }
      })
    })
  })
  emit('update:selected', out)
}

/** Zoom & Pan */
const scale = ref(1)
const translate = ref({ x: 0, y: 0 })
const isPanning = ref(false)
let panStart = { x: 0, y: 0 }
function onWheel(e) {
  e.preventDefault()
  const delta = -Math.sign(e.deltaY) * 0.1
  scale.value = Math.min(3, Math.max(0.4, scale.value + delta))
}
function onPointerDown(e) {
  isPanning.value = true
  panStart = { x: e.clientX - translate.value.x, y: e.clientY - translate.value.y }
  e.currentTarget.setPointerCapture?.(e.pointerId)
}
function onPointerMove(e) {
  if (!isPanning.value) return
  translate.value = { x: e.clientX - panStart.x, y: e.clientY - panStart.y }
}
function onPointerUp(e) {
  isPanning.value = false
  e.currentTarget.releasePointerCapture?.(e.pointerId)
}

/** A11y */
function onSeatKey(zone, seat, ev) {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault()
    toggleSeat(zone, seat)
  }
}
</script>

<template>
  <div class="seatmap-wrap">
    <div class="seatmap-toolbar">
      <div class="legend">
        <span v-for="c in seatmap.categories" :key="c.id" class="legend-item">
          <span class="legend-swatch" :style="{ backgroundColor: c.color }"></span>
          <span class="legend-label">
            {{ c.name }} • {{ (c.price_eur||0).toLocaleString('de-DE',{style:'currency',currency:'EUR'}) }}
          </span>
        </span>
      </div>
      <div class="zoom-controls">
        <button class="btn btn-sm btn-outline-secondary" @click="scale=Math.max(0.4, scale-0.1)">-</button>
        <span class="zoom-indicator">{{ Math.round(scale*100) }}%</span>
        <button class="btn btn-sm btn-outline-secondary" @click="scale=Math.min(3, scale+0.1)">+</button>
        <button class="btn btn-sm btn-outline-secondary" @click="scale=1; translate={x:0,y:0}">Reset</button>
      </div>
    </div>

    <div class="seatmap-stage"
         @wheel="onWheel"
         @pointerdown="onPointerDown"
         @pointermove="onPointerMove"
         @pointerup="onPointerUp"
         @pointercancel="onPointerUp">
      <svg
        class="seatmap-svg"
        :width="layout.width"
        :height="layout.height"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        :style="{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }"
        role="img"
        aria-label="Sitzplan"
      >
        <g v-for="z in layout.zones" :key="z.id">
          <rect :x="z.x - 10" :y="z.y - 34" :width="z.width + 20" :height="z.height + 50" rx="8" ry="8" class="zone-frame" />
          <text :x="z.x" :y="z.y - 14" class="zone-title">{{ z.name || z.id }}</text>

          <g v-for="r in z.rows" :key="r.index">
            <g v-for="s in r.seats" :key="s.id">
              <rect
                :x="s.x" :y="s.y" :width="SEAT.w" :height="SEAT.h" :rx="SEAT.radius" :ry="SEAT.radius"
                :class="['seat', s.status !== 'free' ? 'seat--blocked' : '', selectedIds.has(s.id) ? 'seat--selected' : '']"
                :style="{ '--seat-color': (catMap.get(s.catId)?.color || '#666') }"
                role="button"
                tabindex="0"
                :aria-pressed="selectedIds.has(s.id) ? 'true' : 'false'"
                :aria-label="seatLabel(z, s)"
                @click.stop="toggleSeat(z, s)"
                @keydown="onSeatKey(z, s, $event)"
              />
              <text v-if="scale > 1.2" :x="s.x + SEAT.w/2" :y="s.y + SEAT.h/2 + 3" class="seat-number">{{ s.n }}</text>
            </g>
          </g>
        </g>
      </svg>
    </div>

    <div v-if="!layout.zones.length" class="seatmap-empty">Kein Sitzplan vorhanden.</div>
  </div>
</template>

<style scoped>
.seatmap-wrap{ border:1px solid var(--bs-border-color,#dee2e6); border-radius:.5rem; background:var(--bs-body-bg,#fff); }
.seatmap-toolbar{ display:flex; justify-content:space-between; align-items:center; gap:.75rem; padding:.5rem .75rem; border-bottom:1px solid var(--bs-border-color,#dee2e6); flex-wrap:wrap; }
.legend{ display:flex; gap:.75rem; align-items:center; flex-wrap:wrap; }
.legend-item{ display:flex; gap:.4rem; align-items:center; }
.legend-swatch{ width:14px; height:14px; border-radius:3px; border:1px solid rgba(0,0,0,.15); }
.legend-label{ font-size:.875rem; color:var(--bs-secondary-color,#6c757d); }
.zoom-controls{ display:flex; gap:.4rem; align-items:center; }
.zoom-indicator{ font-variant-numeric: tabular-nums; width:3.5ch; text-align:center; }

.seatmap-stage{ position:relative; overflow:hidden; height:480px; background:radial-gradient(400px 80px at 50% -40px, rgba(0,0,0,.06), transparent), linear-gradient(180deg, rgba(0,0,0,.02), transparent); cursor:grab; }
.seatmap-stage:active{ cursor:grabbing; }
.seatmap-svg{ touch-action:none; transition:transform .05s linear; }

.zone-frame{ fill:rgba(0,0,0,.02); stroke:rgba(0,0,0,.1); }
.zone-title{ font-size:12px; fill:var(--bs-secondary-color,#6c757d); }

.seat{ fill:var(--seat-color); opacity:.85; cursor:pointer; }
.seat:hover{ opacity:1; filter:brightness(1.05); }
.seat--selected{ stroke:#000; stroke-width:2; opacity:1; filter:saturate(1.1); }
.seat--blocked{ fill:#adb5bd; cursor:not-allowed; opacity:.6; }
.seat-number{ font-size:10px; fill:#fff; text-anchor:middle; pointer-events:none; user-select:none; }

.seatmap-empty{ padding:1rem; color:var(--bs-secondary-color,#6c757d); }
</style>
