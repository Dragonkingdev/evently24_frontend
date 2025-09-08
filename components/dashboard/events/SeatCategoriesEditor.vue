<!-- components/dashboard/seating/SeatCategoriesEditor.vue -->
<template>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th style="width:28%">Name</th>
          <th style="width:18%">Farbe</th>
          <th>Beschreibung</th>
          <th style="width:56px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in local" :key="cat.id ?? i">
          <td><input v-model.trim="cat.name" type="text" class="form-control" placeholder="z. B. Rang A"></td>
          <td>
            <input v-model="cat.color" type="color" class="form-control form-control-color" title="Farbe wählen">
          </td>
          <td><input v-model.trim="cat.desc" type="text" class="form-control" placeholder="optional"></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger" @click="remove(i)"><i class="bi bi-x-lg"></i></button>
          </td>
        </tr>
        <tr v-if="!local.length">
          <td colspan="4" class="text-muted small">Noch keine Sitz-Kategorien.</td>
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

function remove(i){ local.value.splice(i,1) }
</script>
