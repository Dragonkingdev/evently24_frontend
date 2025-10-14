<!-- components/new/RegionModal.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRegion } from '~/composables/useRegion'
import Modal from '~/components/ui/Modal.vue'

const { region, setRegion } = useRegion()
const input = ref(region.value)
const open = useState('regionModalOpen', () => false)

watch(region, (r)=>{ input.value = r })

function applyRegion(){
  const v = (input.value || '').trim()
  if(v) setRegion(v)
  open.value = false
}
function quick(r){ input.value = r }
</script>

<template>
  <Modal v-model="open" title="Region wählen">
    <div class="mb-3">
      <label class="lbl">Stadt / Region</label>
      <input type="text" class="txt" v-model="input" placeholder="z.B. Main-Koblenz, Köln, Berlin…">
    </div>
    <div class="chips">
      <button class="chip" @click="quick('Main-Koblenz')">Main-Koblenz</button>
      <button class="chip" @click="quick('Koblenz')">Koblenz</button>
      <button class="chip" @click="quick('Köln')">Köln</button>
      <button class="chip" @click="quick('Bonn')">Bonn</button>
      <button class="chip" @click="quick('Frankfurt')">Frankfurt</button>
    </div>

    <template #footer>
      <div class="footer">
        <button class="btn ghost" @click="open=false">Abbrechen</button>
        <button class="btn brand" @click="applyRegion"><i class="bi bi-check2-circle"></i> Übernehmen</button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.lbl{ display:block; font-weight:700; margin-bottom:.25rem;}
.txt{ width:100%; border:1px solid #e6e8f0; border-radius:10px; padding:.7rem .9rem; outline:none;}
.txt:focus{ border-color:#c7d2fe; box-shadow:0 0 0 3px rgba(59,130,246,.12);}
.chips{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.75rem;}
.chip{ border:1px solid #e6e8f0; background:#fff; border-radius:999px; padding:.35rem .8rem; font-weight:600; cursor:pointer;}
.chip:hover{ border-color:#c7d2fe; background:#f8faff;}
.footer{ display:flex; justify-content:flex-end; gap:.5rem;}
.btn{ border-radius:10px; padding:.55rem .9rem; border:1px solid transparent; font-weight:700; }
.btn.brand{ background:#5b7cfa; border-color:#5b7cfa; color:#fff;}
.btn.brand:hover{ background:#3b57c9; border-color:#3b57c9;}
.btn.ghost{ background:#fff; border-color:#e6e8f0; }
</style>
