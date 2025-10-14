<!-- components/ui/Modal.vue -->
<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
  width: { type: String, default: 'min(560px, 92vw)' },
  title: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(props.modelValue)
watch(() => props.modelValue, v => {
  open.value = v
  toggleScrollLock(v)
})
function close () { emit('update:modelValue', false) }
function onBackdrop (e) {
  if (e.target === e.currentTarget && props.closeOnBackdrop) close()
}
function onKey (e) { if (e.key === 'Escape') close() }

function toggleScrollLock(v){
  document.documentElement.style.overflow = v ? 'hidden' : ''
}

onMounted(() => { if (open.value) toggleScrollLock(true); window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => { toggleScrollLock(false); window.removeEventListener('keydown', onKey) })
</script>

<template>
  <transition name="xmodal-fade">
    <div v-if="open" class="xmodal-backdrop" @click="onBackdrop">
      <div class="xmodal" :style="{ width }" role="dialog" aria-modal="true" @click.stop>
        <div class="xmodal-header">
          <h5 class="xmodal-title">{{ title }}</h5>
          <button class="xmodal-close" @click="close" aria-label="Close">×</button>
        </div>
        <div class="xmodal-body">
          <slot />
        </div>
        <div class="xmodal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Präfix xmodal*, kein Konflikt mit Bootstrap */
.xmodal-backdrop{
  position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
  background: rgba(16,24,40,.5); z-index: 1060; /* über Navbar */
  padding: 1rem;
}
.xmodal{
  background:#fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(3,7,18,.25);
  max-height: 92vh; overflow:auto;
}
.xmodal-header{ display:flex; align-items:center; justify-content:space-between; padding: 1rem 1rem .5rem; border-bottom: 1px solid #eef2f7;}
.xmodal-title{ margin:0; font-weight:800; font-size:1.1rem;}
.xmodal-close{ border:0; background:transparent; font-size:1.5rem; line-height:1; cursor:pointer; color:#475467;}
.xmodal-body{ padding: 1rem; }
.xmodal-footer{ padding: .75rem 1rem; border-top: 1px solid #eef2f7;}
.xmodal-fade-enter-active, .xmodal-fade-leave-active{ transition: opacity .18s ease; }
.xmodal-fade-enter-from, .xmodal-fade-leave-to{ opacity:0; }
</style>
