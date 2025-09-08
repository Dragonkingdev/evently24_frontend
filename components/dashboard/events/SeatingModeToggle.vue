<!-- components/dashboard/events/SeatingModeToggle.vue -->
<template>
  <div class="btn-group" role="group">
    <input type="radio" class="btn-check" name="mode" id="mode-ga" autocomplete="off"
           :checked="modelValue==='GA'" @change="$emit('update:modelValue','GA')">
    <label class="btn btn-outline-secondary" for="mode-ga">Nur Tickets (GA)</label>

    <input type="radio" class="btn-check" name="mode" id="mode-res" autocomplete="off"
           :checked="modelValue==='RESERVED'" @change="$emit('update:modelValue','RESERVED')">
    <label class="btn btn-outline-secondary" for="mode-res">Feste Sitzplätze</label>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: 'GA' } })
defineEmits(['update:modelValue'])
</script>
