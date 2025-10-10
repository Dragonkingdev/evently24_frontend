<!-- components/business/workspaces/locations/modals/_BaseModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="open" class="modal fade show" style="display:block" aria-modal="true" role="dialog">
      <div class="modal-dialog" :class="sizeClass">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><slot name="title">{{ title }}</slot></h5>
            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">Schließen</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="open" class="modal-backdrop fade show" @click="$emit('close')"></div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'lg' } // sm | md | lg | xl
})
const sizeClass = computed(() => {
  switch(props.size){
    case 'sm': return 'modal-sm'
    case 'md': return ''
    case 'xl': return 'modal-xl'
    case 'lg':
    default: return 'modal-lg'
  }
})
defineEmits(['close'])
</script>
