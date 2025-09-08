<template>
  <!-- Desktop Variante -->
  <div
    v-if="variant === 'desktop'"
    class="nav-center search-desktop flex-grow-1 mx-2 d-none d-lg-block"
  >
    <div class="d-flex align-items-stretch w-100">
      <!-- EINZIGER Input -->
      <div class="position-relative flex-grow-1">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="q"
          @keyup.enter="search"
          class="form-control search-input"
          placeholder="Suche nach Events, Künstlern, Orten…"
        >
      </div>

      <!-- Filter-Button + Dropdown -->
      <div class="dropdown ms-2">
        <button
          ref="ddBtn"
          class="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          aria-expanded="false"
        >
          Filter
        </button>

        <div
          class="dropdown-menu dropdown-menu-end p-3 filter-menu"
          @click.stop
          @keyup.enter.prevent="onApply"
        >
          <!-- Quick-Type -->
          <div class="mb-3">
            <div class="d-flex gap-2 flex-wrap">
              <button
                v-for="opt in quickTypes"
                :key="opt.value"
                type="button"
                class="btn btn-sm"
                :class="filter === opt.value ? 'btn-primary' : 'btn-outline-secondary'"
                @click.stop="filter = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="row g-3">
            <!-- Zeitraum -->
            <div class="col-12 col-md-6">
              <label class="form-label mb-1">Zeitraum</label>
              <select v-model="datePreset" class="form-select form-select-sm" @change="applyDatePreset">
                <option value="any">Beliebig</option>
                <option value="today">Heute</option>
                <option value="tomorrow">Morgen</option>
                <option value="weekend">Dieses Wochenende</option>
                <option value="next7">Nächste 7 Tage</option>
                <option value="custom">Benutzerdefiniert…</option>
              </select>
              <div v-if="datePreset === 'custom'" class="d-flex gap-2 mt-2">
                <input v-model="dateFrom" type="date" class="form-control form-control-sm" />
                <input v-model="dateTo" type="date" class="form-control form-control-sm" />
              </div>
            </div>

            <!-- Ort & Radius -->
            <div class="col-12 col-md-6">
              <label class="form-label mb-1">Ort & Umkreis</label>
              <div class="d-flex gap-2">
                <input v-model="location" type="text" class="form-control form-control-sm" placeholder="Stadt / PLZ" />
                <input v-model.number="radiusKm" type="number" min="1" class="form-control form-control-sm" style="max-width: 90px" placeholder="km" />
              </div>
            </div>

            <!-- Preis -->
            <div class="col-12 col-md-6">
              <label class="form-label mb-1">Preis (€)</label>
              <div class="d-flex gap-2">
                <input v-model.number="priceMin" type="number" min="0" class="form-control form-control-sm" placeholder="min" />
                <input v-model.number="priceMax" type="number" min="0" class="form-control form-control-sm" placeholder="max" />
              </div>
            </div>

            <!-- Sortierung -->
            <div class="col-12 col-md-6">
              <label class="form-label mb-1">Sortierung</label>
              <select v-model="sort" class="form-select form-select-sm">
                <option value="relevance">Relevanz</option>
                <option value="date">Datum</option>
                <option value="popular">Beliebtheit</option>
                <option value="price_asc">Preis ↑</option>
                <option value="price_desc">Preis ↓</option>
              </select>
            </div>

            <!-- Toggles -->
            <div class="col-12">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="onlyFreeDesktop" v-model="onlyFree">
                <label class="form-check-label" for="onlyFreeDesktop">Nur kostenlos</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="onlyAvailableDesktop" v-model="onlyAvailable">
                <label class="form-check-label" for="onlyAvailableDesktop">Nur verfügbare Tickets</label>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-link p-0" type="button" @click="resetFilters">Zurücksetzen</button>
            <button class="btn btn-primary" type="button" @click.prevent="onApply">Anwenden</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Variante -->
  <div v-else class="search-mobile">
    <div class="container-fluid py-2 pt-0">
      <div class="d-flex align-items-stretch">
        <div class="position-relative flex-grow-1 me-2">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="q"
            @keyup.enter="search"
            class="form-control search-input w-100"
            placeholder="Suche nach Events, Künstlern, Orten…"
          >
        </div>

        <div class="dropdown">
          <button
            ref="ddBtn"
            class="btn btn-outline-secondary"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            Filter
          </button>

          <div
            class="dropdown-menu dropdown-menu-end p-3 filter-menu-mobile"
            @click.stop
            @keyup.enter.prevent="onApply"
          >
            <!-- Quick-Type -->
            <div class="mb-3">
              <div class="d-flex gap-2 flex-wrap">
                <button
                  v-for="opt in quickTypes"
                  :key="opt.value"
                  type="button"
                  class="btn btn-sm"
                  :class="filter === opt.value ? 'btn-primary' : 'btn-outline-secondary'"
                  @click.stop="filter = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-12">
                <label class="form-label mb-1">Zeitraum</label>
                <select v-model="datePreset" class="form-select form-select-sm" @change="applyDatePreset">
                  <option value="any">Beliebig</option>
                  <option value="today">Heute</option>
                  <option value="tomorrow">Morgen</option>
                  <option value="weekend">Dieses Wochenende</option>
                  <option value="next7">Nächste 7 Tage</option>
                  <option value="custom">Benutzerdefiniert…</option>
                </select>
                <div v-if="datePreset === 'custom'" class="d-flex gap-2 mt-2">
                  <input v-model="dateFrom" type="date" class="form-control form-control-sm" />
                  <input v-model="dateTo" type="date" class="form-control form-control-sm" />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label mb-1">Ort & Umkreis</label>
                <div class="d-flex gap-2">
                  <input v-model="location" type="text" class="form-control form-control-sm" placeholder="Stadt / PLZ" />
                  <input v-model.number="radiusKm" type="number" min="1" class="form-control form-control-sm" style="max-width: 90px" placeholder="km" />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label mb-1">Preis (€)</label>
                <div class="d-flex gap-2">
                  <input v-model.number="priceMin" type="number" min="0" class="form-control form-control-sm" placeholder="min" />
                  <input v-model.number="priceMax" type="number" min="0" class="form-control form-control-sm" placeholder="max" />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label mb-1">Sortierung</label>
                <select v-model="sort" class="form-select form-select-sm">
                  <option value="relevance">Relevanz</option>
                  <option value="date">Datum</option>
                  <option value="popular">Beliebtheit</option>
                  <option value="price_asc">Preis ↑</option>
                  <option value="price_desc">Preis ↓</option>
                </select>
              </div>

              <div class="col-12">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="onlyFreeMobile" v-model="onlyFree">
                  <label class="form-check-label" for="onlyFreeMobile">Nur kostenlos</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="onlyAvailableMobile" v-model="onlyAvailable">
                  <label class="form-check-label" for="onlyAvailableMobile">Nur verfügbare Tickets</label>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-link p-0" type="button" @click="resetFilters">Zurücksetzen</button>
              <button class="btn btn-primary" type="button" @click.prevent="onApply">Anwenden</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'desktop', // 'desktop' | 'mobile'
    validator: v => ['desktop', 'mobile'].includes(v)
  }
})

const q = ref('')
const filter = ref('all') // all | events | acts | locations

// Zusatz-Filter (Dropdown)
const datePreset = ref('any')  // any | today | tomorrow | weekend | next7 | custom
const dateFrom = ref('')
const dateTo = ref('')
const location = ref('')
const radiusKm = ref(null)
const priceMin = ref(null)
const priceMax = ref(null)
const onlyFree = ref(false)
const onlyAvailable = ref(false)
const sort = ref('relevance')

const ddBtn = ref(null)

const quickTypes = [
  { value: 'all', label: 'Alles' },
  { value: 'events', label: 'Events' },
  { value: 'acts', label: 'Künstler' },
  { value: 'locations', label: 'Orte' }
]

function applyDatePreset () {
  const today = new Date()
  const fmt = (d) => d.toISOString().slice(0, 10)
  const nextWeekend = () => {
    const d = new Date()
    const day = d.getDay()
    const diffToSat = (6 - day + 7) % 7
    const sat = new Date(d); sat.setDate(d.getDate() + diffToSat)
    const sun = new Date(sat); sun.setDate(sat.getDate() + 1)
    return [sat, sun]
  }
  if (datePreset.value === 'any') { dateFrom.value = ''; dateTo.value = ''; return }
  if (datePreset.value === 'today') { dateFrom.value = fmt(today); dateTo.value = fmt(today); return }
  if (datePreset.value === 'tomorrow') { const t = new Date(today); t.setDate(t.getDate() + 1); dateFrom.value = fmt(t); dateTo.value = fmt(t); return }
  if (datePreset.value === 'weekend') { const [sat, sun] = nextWeekend(); dateFrom.value = fmt(sat); dateTo.value = fmt(sun); return }
  if (datePreset.value === 'next7') { const end = new Date(today); end.setDate(end.getDate() + 7); dateFrom.value = fmt(today); dateTo.value = fmt(end); return }
}

function resetFilters () {
  filter.value = 'all'
  datePreset.value = 'any'
  dateFrom.value = ''
  dateTo.value = ''
  location.value = ''
  radiusKm.value = null
  priceMin.value = null
  priceMax.value = null
  onlyFree.value = false
  onlyAvailable.value = false
  sort.value = 'relevance'
}

function buildQuery () {
  const query = {
    q: q.value?.trim() || undefined,
    type: filter.value !== 'all' ? filter.value : undefined,
    sort: sort.value !== 'relevance' ? sort.value : undefined,
    page: 1
  }
  if (dateFrom.value) query.date_from = dateFrom.value
  if (dateTo.value) query.date_to = dateTo.value
  if (!query.date_from && !query.date_to && datePreset.value !== 'any' && datePreset.value !== 'custom') {
    query.date_preset = datePreset.value
  }
  if (location.value?.trim()) query.location = location.value.trim()
  if (radiusKm.value) query.radius_km = radiusKm.value
  if (priceMin.value != null && priceMin.value !== '') query.price_min = Number(priceMin.value)
  if (priceMax.value != null && priceMax.value !== '') query.price_max = Number(priceMax.value)
  if (onlyFree.value) query.only_free = 1
  if (onlyAvailable.value) query.only_available = 1
  return query
}

function closeDropdown () {
  if (!process.client) return
  const bs = globalThis.bootstrap
  if (bs?.Dropdown && ddBtn.value) {
    const inst = bs.Dropdown.getOrCreateInstance(ddBtn.value)
    inst.hide()
    return
  }
  // Fallback
  const menu = ddBtn.value?.parentElement?.querySelector('.dropdown-menu.show')
  if (menu) {
    menu.classList.remove('show')
    ddBtn.value.setAttribute('aria-expanded', 'false')
  }
}

async function onApply () {
  closeDropdown()
  await nextTick()
  search()
}

function search () {
  const query = buildQuery()
  if (!query.q && !query.type && !query.date_from && !query.date_to && !query.date_preset &&
      !query.location && !query.radius_km && !query.price_min && !query.price_max &&
      !query.only_free && !query.only_available && !query.sort) {
    return
  }
  navigateTo({ path: '/search', query })
}
</script>

<style scoped>
.filter-menu { width: 420px; max-width: 90vw; }
.filter-menu-mobile { width: calc(100vw - 1rem); max-width: 100vw; }
</style>
