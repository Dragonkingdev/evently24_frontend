<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue'])

const state = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

function addCategory(){
  state.value.categories ??= []
  state.value.categories.push({ id: `C${(state.value.categories.length+1)}`, name:'PK', price_eur:0, color:'#666' })
}
function removeCategory(idx){
  state.value.categories.splice(idx,1)
}
function addZone(){
  state.value.plan ??= { zones: [] }
  state.value.plan.zones.push({
    id: `BLOCK-${state.value.plan.zones.length+1}`,
    name: `Block ${state.value.plan.zones.length+1}`,
    catId: state.value.categories?.[0]?.id || '',
    x: 0, y: (state.value.plan.zones.length)*220,
    rows: [
      { index:1, seats: Array.from({length:8}).map((_,i)=>({ id:`z${state.value.plan.zones.length+1}-1-${i+1}`, n:i+1 })) },
      { index:2, seats: Array.from({length:8}).map((_,i)=>({ id:`z${state.value.plan.zones.length+1}-2-${i+1}`, n:i+1 })) }
    ]
  })
}
function removeZone(idx){
  state.value.plan.zones.splice(idx,1)
}
</script>

<template>
  <div class="seatmap-editor">
    <div class="row g-3">
      <div class="col-md-6">
        <h6>Kategorien</h6>
        <div class="list-group">
          <div v-for="(c,idx) in state.categories" :key="idx" class="list-group-item">
            <div class="row g-2 align-items-center">
              <div class="col-3"><input v-model="c.id" class="form-control form-control-sm" placeholder="ID"></div>
              <div class="col-4"><input v-model="c.name" class="form-control form-control-sm" placeholder="Name"></div>
              <div class="col-3"><input v-model.number="c.price_eur" type="number" step="0.01" class="form-control form-control-sm" placeholder="Preis"></div>
              <div class="col-2"><input v-model="c.color" type="color" class="form-control form-control-sm"></div>
            </div>
            <div class="text-end mt-1">
              <button class="btn btn-outline-danger btn-sm" @click="removeCategory(idx)">Entfernen</button>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-primary btn-sm mt-2" @click="addCategory"><i class="bi bi-plus"></i> Kategorie</button>
      </div>

      <div class="col-md-6">
        <h6>Zonen / Blöcke</h6>
        <div v-if="state.plan?.zones?.length" class="list-group">
          <div v-for="(z,idx) in state.plan.zones" :key="z.id" class="list-group-item">
            <div class="row g-2 align-items-center">
              <div class="col-4"><input v-model="z.name" class="form-control form-control-sm" placeholder="Name"></div>
              <div class="col-3"><input v-model="z.id" class="form-control form-control-sm" placeholder="ID"></div>
              <div class="col-2"><input v-model.number="z.x" type="number" class="form-control form-control-sm" placeholder="x"></div>
              <div class="col-2"><input v-model.number="z.y" type="number" class="form-control form-control-sm" placeholder="y"></div>
              <div class="col-1">
                <select v-model="z.catId" class="form-select form-select-sm">
                  <option v-for="c in state.categories" :key="c.id" :value="c.id">{{ c.id }}</option>
                </select>
              </div>
            </div>
            <div class="small text-muted mt-1">Reihen: {{ z.rows?.length || 0 }} • Sitze/erste Reihe: {{ z.rows?.[0]?.seats?.length || 0 }}</div>
            <div class="text-end mt-1">
              <button class="btn btn-outline-danger btn-sm" @click="removeZone(idx)">Block entfernen</button>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-primary btn-sm mt-2" @click="addZone"><i class="bi bi-plus"></i> Block</button>
      </div>
    </div>

    <div class="mt-3">
      <h6>Rohdaten (JSON)</h6>
      <textarea class="form-control" rows="8" v-model="(state.planJson)" hidden></textarea>
      <pre class="bg-light p-2 rounded small" style="max-height:260px;overflow:auto">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.seatmap-editor :is(h6){ margin-bottom:.5rem }
</style>
