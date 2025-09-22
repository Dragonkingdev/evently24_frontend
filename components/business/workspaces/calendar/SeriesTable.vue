<!-- components/business/workspaces/calendar/SeriesTable.vue -->
<template>
    <div class="card card-fill">
      <div class="card-header d-flex align-items-center justify-content-between">
      <h6 class="mb-0">Serien</h6>
      <div class="text-muted small" v-if="rows?.length">{{ rows.length }} Einträge</div>
    </div>

    <div class="table-responsive table-scroll">
      <table class="table align-middle mb-0 table-fixed-min">
        <thead class="table-light">
          <tr>
            <th @click="setSort('title')" role="button" class="text-nowrap">
              Titel <i :class="sortIcon('title')" class="ms-1"></i>
            </th>
            <th @click="setSort('kind')" role="button" class="text-nowrap">
              Typ <i :class="sortIcon('kind')" class="ms-1"></i>
            </th>
            <th class="text-center text-nowrap" @click="setSort('events_count')" role="button">
              Events <i :class="sortIcon('events_count')" class="ms-1"></i>
            </th>
            <th class="text-center text-nowrap" @click="setSort('occurrences_count')" role="button">
              Occurrences <i :class="sortIcon('occurrences_count')" class="ms-1"></i>
            </th>
            <th @click="setSort('next_occurrence_at')" role="button" class="text-nowrap">
              Nächster Termin <i :class="sortIcon('next_occurrence_at')" class="ms-1"></i>
            </th>
            <th @click="setSort('status')" role="button" class="text-nowrap">
              Status <i :class="sortIcon('status')" class="ms-1"></i>
            </th>
            <th style="width:130px;"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="py-4 text-center text-muted">
              <div class="spinner-border spinner-border-sm me-2"></div>
              Lädt…
            </td>
          </tr>

          <tr v-for="s in paged" :key="s.id">
            <td class="fw-semibold">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-collection-play"></i>
                <span class="text-truncate" style="max-width: 420px;">
                  {{ s.title || '(ohne Titel)' }}
                </span>
              </div>
              <div class="small text-muted" v-if="s.slug">@{{ s.slug }}</div>
            </td>

            <td class="text-nowrap">
              <span class="badge" :class="kindClass(s.kind)">{{ kindLabel(s.kind) }}</span>
            </td>

            <td class="text-center"><span class="badge bg-light text-dark">{{ s.events_count ?? 0 }}</span></td>
            <td class="text-center"><span class="badge bg-light text-dark">{{ s.occurrences_count ?? 0 }}</span></td>

            <td class="text-nowrap">
              <i class="bi bi-calendar-event me-1 text-muted"></i>
              {{ formatDate(s.next_occurrence_at || s.start_at) || '—' }}
            </td>

            <td>
              <span class="badge" :class="statusClass(s.status)">{{ statusLabel(s.status) }}</span>
            </td>

            <td class="text-end">
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-sm btn-outline-primary"
                  :to="`${base}/w/${wid}/calendar/series/${s.id}`"
                  title="Details"
                >
                  <i class="bi bi-box-arrow-up-right"></i>
                </NuxtLink>
                <button class="btn btn-sm btn-outline-secondary" @click="$emit('manage-occurrences', s)" title="Occurrences verwalten">
                  <i class="bi bi-calendar2-plus"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', s)" title="Löschen">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && !rows?.length">
            <td colspan="7" class="py-4 text-center text-muted">Keine Serien vorhanden.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer d-flex align-items-center justify-content-between" v-if="pages > 1">
      <div class="small text-muted">Seite {{ page }} / {{ pages }}</div>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" :disabled="page<=1" @click="page--">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" :disabled="page>=pages" @click="page++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pageSize: { type: Number, default: 20 },
  wid: { type: [Number, String], required: true },   // ⬅️ neu
  base: { type: String, default: '/business' }       // ⬅️ neu
})
const { rows, loading, pageSize, wid, base } = toRefs(props)

// Sorting
const sort = reactive({ key: 'next_occurrence_at', dir: 'asc' })
function setSort(key){ sort.key === key ? (sort.dir = sort.dir === 'asc' ? 'desc' : 'asc') : (sort.key = key, sort.dir = 'asc') }
function sortIcon(key){ return sort.key !== key ? 'bi bi-arrow-down-up text-muted' : (sort.dir === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') }

const sorted = computed(() => {
  const arr = [...(rows.value || [])]
  const k = sort.key
  const dir = sort.dir === 'asc' ? 1 : -1
  return arr.sort((a, b) => {
    const va = (a?.[k] ?? '').toString().toLowerCase()
    const vb = (b?.[k] ?? '').toString().toLowerCase()
    return va < vb ? -1*dir : va > vb ? 1*dir : 0
  })
})

// Pagination
const page = ref(1)
watch(rows, () => { page.value = 1 })
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / (pageSize.value || 20))))
const paged = computed(() => sorted.value.slice((page.value-1)*(pageSize.value||20), (page.value)*(pageSize.value||20)))

// Helpers
function formatDate(v){
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d)) return ''
  try { return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }
  catch { const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}` }
}
function kindLabel(kind){ switch((kind||'').toLowerCase()){ case 'tour': return 'Tour'; case 'festival': return 'Festival'; case 'series': return 'Serie'; default: return kind || '—' } }
function kindClass(kind){ switch((kind||'').toLowerCase()){ case 'tour': return 'bg-info'; case 'festival': return 'bg-warning text-dark'; case 'series': return 'bg-primary'; default: return 'bg-secondary' } }
function statusLabel(s){ switch((s||'').toLowerCase()){ case 'draft': return 'Entwurf'; case 'scheduled': return 'Geplant'; case 'active': return 'Aktiv'; case 'archived': return 'Archiviert'; default: return s || '—' } }
function statusClass(s){ switch((s||'').toLowerCase()){ case 'draft': return 'bg-secondary'; case 'scheduled': return 'bg-info'; case 'active': return 'bg-success'; case 'archived': return 'bg-light text-dark'; default: return 'bg-secondary' } }
</script>

<style scoped>
/* Karte füllt den verfügbaren Platz des Panels aus */
.card-fill{
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0; /* erlaubt der table-scroll zu schrumpfen */
}

/* Scrollbereich in der Mitte der Karte */
.table-scroll{
  flex: 1 1 auto;
  overflow: auto;     /* vertikal + horizontal */
  min-height: 0;
}

/* Sorgt dafür, dass bei wenig Platz eine horizontale Scrollbar erscheint */
.table-fixed-min{
  min-width: 960px;   /* anpassen nach Bedarf (z.B. 1100px) */
}
</style>