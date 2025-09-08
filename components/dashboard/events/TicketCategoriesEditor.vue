<!-- components/dashboard/events/TicketCategoriesEditor.vue -->
<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <div class="small text-muted">Kategorien definieren.</div>
    <button class="btn btn-sm btn-outline-primary" @click="add"><i class="bi bi-plus"></i> Kategorie</button>
  </div>

  <div class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th style="width:28%">Name</th>
          <th style="width:18%">Preis</th>
          <th style="width:14%">Währung</th>
          <th style="width:14%">Kontingent</th>
          <th>Beschreibung</th>
          <th style="width:56px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in local" :key="cat.id ?? i">
          <td><input v-model.trim="cat.name" type="text" class="form-control" placeholder="z. B. PK1"></td>
          <td><input v-model.number="cat.price" type="number" step="0.01" min="0" class="form-control"></td>
          <td>
            <select v-model="cat.currency" class="form-select">
              <option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option>
            </select>
          </td>
          <td><input v-model.number="cat.quota" type="number" min="0" class="form-control" placeholder="∞"></td>
          <td><input v-model.trim="cat.desc" type="text" class="form-control" placeholder="optional"></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger" @click="remove(i)"><i class="bi bi-x-lg"></i></button>
          </td>
        </tr>
        <tr v-if="!local.length">
          <td colspan="6" class="text-muted small">Noch keine Kategorien.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch, isProxy, toRaw } from 'vue'
const props = defineProps({ modelValue: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])
function clone(v){ const raw = isProxy(v)? toRaw(v): v; try{ return JSON.parse(JSON.stringify(raw??[])) }catch{ return [] } }
const local = ref(clone(props.modelValue))
watch(() => props.modelValue, v => { local.value = clone(v) })
watch(local, v => emit('update:modelValue', clone(v)), { deep: true })

function add(){ local.value.push({ name:'Kategorie', price:0, currency:'EUR', quota:null, desc:'' }) }
function remove(i){ local.value.splice(i,1) }
</script>
