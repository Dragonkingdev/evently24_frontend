<!-- components/new/FiltersDrawer.vue -->
<script setup>
import { ref } from 'vue'
import Drawer from '~/components/ui/Drawer.vue'

const open = useState('filtersOpen', () => false)

const date = ref('any')
const categories = ref(new Set())
const priceMax = ref(150)

const catList = ['Konzert','Festival','Theater','Familie','Nightlife']

function toggleCat(c){
  const set = new Set(categories.value)
  set.has(c) ? set.delete(c) : set.add(c)
  categories.value = set
}
function apply(){
  // Emit oder State setzen – hier minimal:
  open.value = false
  // Du kannst hier z.B. ein globales Filter-State nutzen.
}
</script>

<template>
  <Drawer v-model="open">
    <template #title><h5>Filter</h5></template>

    <div class="mb">
      <label class="lbl">Datum</label>
      <select class="sel" v-model="date">
        <option value="any">Beliebig</option>
        <option value="today">Heute</option>
        <option value="tomorrow">Morgen</option>
        <option value="weekend">Dieses Wochenende</option>
        <option value="month">Diesen Monat</option>
      </select>
    </div>

    <div class="mb">
      <label class="lbl">Kategorie</label>
      <div class="chips">
        <button
          v-for="c in catList" :key="c"
          class="chip" :class="{ active: categories.has(c) }"
          @click="toggleCat(c)"
        >{{ c }}</button>
      </div>
    </div>

    <div class="mb">
      <label class="lbl">Max. Preis: {{ priceMax }}€</label>
      <input class="rng" type="range" min="0" max="150" v-model="priceMax">
    </div>

    <div class="footer">
      <button class="btn ghost" @click="open=false">Schließen</button>
      <button class="btn brand" @click="apply"><i class="bi bi-check2-circle"></i> Anwenden</button>
    </div>
  </Drawer>
</template>

<style scoped>
.mb{ margin-bottom:1rem;}
.lbl{ display:block; font-weight:700; margin-bottom:.25rem;}
.sel, .rng{ width:100%;}
.sel{ border:1px solid #e6e8f0; border-radius:10px; padding:.55rem .7rem; }
.chips{ display:flex; flex-wrap:wrap; gap:.5rem; }
.chip{ border:1px solid #e6e8f0; background:#fff; border-radius:999px; padding:.35rem .8rem; font-weight:600; cursor:pointer;}
.chip.active, .chip:hover{ border-color:#c7d2fe; background:#f8faff;}
.footer{ display:flex; justify-content:flex-end; gap:.5rem; margin-top:1rem;}
.btn{ border-radius:10px; padding:.55rem .9rem; border:1px solid transparent; font-weight:700; }
.btn.brand{ background:#5b7cfa; border-color:#5b7cfa; color:#fff;}
.btn.brand:hover{ background:#3b57c9; border-color:#3b57c9;}
.btn.ghost{ background:#fff; border-color:#e6e8f0; }
</style>
