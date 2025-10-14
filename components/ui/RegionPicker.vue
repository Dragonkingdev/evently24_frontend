<!-- components/ui/RegionPicker.vue -->
<script setup>
import { ref } from 'vue'
import { useRegion } from '~/composables/useRegion'

const { region, setRegion } = useRegion()
const input = ref(region.value || '')

const emit = defineEmits(['applied'])
function apply(){
  const v = (input.value || '').trim()
  if(v) setRegion(v)
  emit('applied')
}
function quick(v){ input.value = v }
</script>

<template>
  <div class="picker">
    <input v-model="input" type="text" placeholder="z.B. Koblenz, Köln, Berlin…" />
    <div class="chips">
      <button @click="quick('Koblenz')">Koblenz</button>
      <button @click="quick('Köln')">Köln</button>
      <button @click="quick('Bonn')">Bonn</button>
      <button @click="quick('Frankfurt')">Frankfurt</button>
    </div>
    <div class="actions">
      <button class="ghost" @click="$emit('applied')">Abbrechen</button>
      <button class="primary" @click="apply"><i class="bi bi-check2-circle"></i> Übernehmen</button>
    </div>
  </div>
</template>

<style scoped>
.picker{ display:flex; flex-direction:column; gap:.6rem; }
input{ border:1px solid #e5e7eb; border-radius:10px; padding:.55rem .7rem; }
.chips{ display:flex; flex-wrap:wrap; gap:.4rem; }
.chips button{ border:1px solid #e5e7eb; background:#fff; padding:.35rem .6rem; border-radius:999px; font-weight:700; }
.actions{ margin-top:.25rem; display:flex; justify-content:flex-end; gap:.5rem; }
.primary{ border:0; background:#5b7cfa; color:#fff; padding:.55rem .7rem; border-radius:10px; font-weight:800; }
.ghost{ border:1px solid #e5e7eb; background:#fff; padding:.55rem .7rem; border-radius:10px; font-weight:700; }
</style>
