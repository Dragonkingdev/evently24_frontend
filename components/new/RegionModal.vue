<script setup>
import { ref, watch } from 'vue'
import { useRegion } from '~/composables/useRegion'

const { region, setRegion } = useRegion()
const input = ref(region.value)
watch(region, (r)=>{ input.value = r })

function applyRegion(){
  const v = (input.value || '').trim()
  if(v) setRegion(v)
}
function quick(r){ input.value = r }
</script>

<template>
  <div class="modal fade" id="regionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-geo"></i> Region wählen</h5>
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Stadt / Region</label>
            <input type="text" class="form-control" v-model="input" placeholder="z.B. Main-Koblenz, Köln, Berlin…">
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge rounded-pill text-bg-light" role="button" @click="quick('Main-Koblenz')">Main-Koblenz</span>
            <span class="badge rounded-pill text-bg-light" role="button" @click="quick('Koblenz')">Koblenz</span>
            <span class="badge rounded-pill text-bg-light" role="button" @click="quick('Köln')">Köln</span>
            <span class="badge rounded-pill text-bg-light" role="button" @click="quick('Bonn')">Bonn</span>
            <span class="badge rounded-pill text-bg-light" role="button" @click="quick('Frankfurt')">Frankfurt</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
          <button class="btn btn-primary" data-bs-dismiss="modal" @click="applyRegion"><i class="bi bi-check2-circle"></i> Übernehmen</button>
        </div>
      </div>
    </div>
  </div>
</template>
