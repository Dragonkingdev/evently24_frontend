<!-- components/search/SearchBar.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from '#app'

const props = defineProps({
  placeholder: { type: String, default: 'Suche…' }
})

const router = useRouter()

// State
const q = ref('')
const open = ref(false)

// Inline-Filter (im selben Control – kein extra Button)
const city = ref('')
const category = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Debounce (Hook für späteres Autosuggest)
let t = null
function onInput () {
  clearTimeout(t)
  t = setTimeout(() => {}, 220)
}

function submit () {
  const query = { q: q.value || '' }
  if (city.value)     query.city = city.value
  if (category.value) query.category = category.value
  if (dateFrom.value) query.date_from = new Date(dateFrom.value).toISOString()
  if (dateTo.value)   query.date_to   = new Date(dateTo.value).toISOString()

  router.push({ path: '/search', query })
  open.value = false
}

function toggle(){ open.value = !open.value }
function close(){ open.value = false }
function onKey(e){ if (e.key === 'Escape') close() }

// Click-outside
let cleanup = null
onMounted(() => {
  const handler = (ev) => {
    const root = document.getElementById('xsearch-root')
    if (root && !root.contains(ev.target)) close()
  }
  document.addEventListener('click', handler)
  window.addEventListener('keydown', onKey)
  cleanup = () => {
    document.removeEventListener('click', handler)
    window.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => { cleanup?.() })
</script>

<template>
  <div id="xsearch-root" class="xsearch">
    <div class="field">
      <i class="bi bi-search"></i>
      <input
        :placeholder="placeholder"
        v-model="q"
        @input="onInput"
        @keydown.enter.prevent="submit"
        aria-label="Suche"
      />
      <button class="filter-btn" @click.stop="toggle" :aria-expanded="open" aria-label="Filter öffnen/schließen">
        <i class="bi bi-sliders"></i>
      </button>
      <button class="go-btn" @click="submit" aria-label="Suchen">Suchen</button>
    </div>

    <transition name="xfade">
      <div v-if="open" class="panel" role="dialog" aria-modal="false">
        <div class="row">
          <label>Stadt</label>
          <input class="ctl" v-model="city" placeholder="z.B. Köln" />
        </div>

        <div class="row">
          <label>Kategorie</label>
          <select class="ctl" v-model="category">
            <option value="">Alle</option>
            <option value="festival">Festival</option>
            <option value="konzert">Konzert</option>
            <option value="theater">Theater</option>
            <option value="comedy">Comedy</option>
            <option value="nightlife">Nightlife</option>
            <option value="familie">Familie</option>
          </select>
        </div>

        <div class="row two">
          <div>
            <label>Von</label>
            <input class="ctl" type="date" v-model="dateFrom" />
          </div>
          <div>
            <label>Bis</label>
            <input class="ctl" type="date" v-model="dateTo" />
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn ghost" @click="close">Schließen</button>
          <button class="btn brand" @click="submit"><i class="bi bi-search"></i> Anwenden</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Präfix xsearch*, keine Bootstrap-Konflikte */
.xsearch{ position:relative; width:100%; }
.field{
  display:flex; align-items:center; gap:.5rem; width:100%;
  border:1px solid #e6e8f0; border-radius:999px; padding:.35rem .4rem .35rem .6rem;
  background:#fff;
}
.field:focus-within{ border-color:#c7d2fe; box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.field i.bi-search{ font-size:1.05rem; color:#6b7280; }
.field input{
  flex:1 1 auto; min-width:0; border:0; outline:0; padding:.4rem .2rem; font-size:.95rem; color:#111827; background:transparent;
}
.filter-btn{
  border:0; background:#fff; width:38px; height:38px; border-radius:999px; display:grid; place-items:center; cursor:pointer;
  color:#111827; border:1px solid #eef2f7;
}
.filter-btn:hover{ background:#f8fafc; border-color:#dfe6ff; }
.go-btn{
  border:0; background:#5b7cfa; color:#fff; font-weight:800; border-radius:999px; padding:.45rem .9rem; cursor:pointer;
}
.go-btn:hover{ background:#3b57c9; }

/* Panel */
.panel{
  position:absolute; left:0; right:0; top: calc(100% + .4rem);
  background:#fff; border:1px solid #eef2f7; border-radius:14px; box-shadow:0 18px 40px rgba(2,6,23,.12);
  padding:.8rem; z-index:30;
}
.row{ display:flex; flex-direction:column; gap:.35rem; margin:.4rem 0; }
.row.two{ display:grid; grid-template-columns: 1fr 1fr; gap:.6rem; }
label{ font-weight:700; font-size:.85rem; color:#475467; }
.ctl{
  width:100%; border:1px solid #e6e8f0; border-radius:10px; padding:.55rem .7rem; background:#fff; outline:none;
}
.ctl:focus{ border-color:#c7d2fe; box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.panel-actions{ display:flex; justify-content:flex-end; gap:.5rem; margin-top:.4rem; }
.btn{ border-radius:10px; padding:.55rem .9rem; border:1px solid transparent; font-weight:800; }
.btn.brand{ background:#5b7cfa; border-color:#5b7cfa; color:#fff; }
.btn.brand:hover{ background:#3b57c9; border-color:#3b57c9; }
.btn.ghost{ background:#fff; border-color:#e6e8f0; }

.xfade-enter-active, .xfade-leave-active{ transition: opacity .15s ease, transform .15s ease; }
.xfade-enter-from, .xfade-leave-to{ opacity:0; transform: translateY(-4px); }

@media (max-width: 720px){
  .row.two{ grid-template-columns: 1fr; }
  .go-btn{ padding:.45rem .7rem; }
}
</style>
