<!-- components/ui/BizModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="open" class="biz-modal" @keydown.esc.prevent.stop="onClose" tabindex="-1" ref="root">
      <div class="biz-backdrop" @click="onClose"></div>
      <div class="biz-dialog" role="dialog" aria-modal="true" :aria-label="ariaLabel || title">
        <div class="biz-header">
          <strong class="biz-title">{{ title }}</strong>
          <button type="button" class="btn-close" aria-label="Close" @click="onClose"></button>
        </div>
        <div class="biz-body">
          <slot />
        </div>
        <div class="biz-footer">
          <slot name="footer">
            <button type="button" class="btn btn-outline-secondary" @click="onClose">Abbrechen</button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  ariaLabel: { type: String, default: '' }
})
const emit = defineEmits(['close'])
function onClose(){ emit('close') }
const root = ref(null)

watch(() => props.open, v => {
  if (process.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (process.client) document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.biz-modal { position: fixed; inset: 0; z-index: 1080; display: grid; }
.biz-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.35); }
.biz-dialog{
  position: relative; margin: auto; width: min(720px, 92vw);
  background: var(--biz-surface, #fff); border-radius: var(--biz-radius-lg, 1rem);
  border: 1px solid var(--biz-border, #e6e9ef); box-shadow: var(--biz-shadow-md, 0 10px 26px rgba(0,0,0,.08));
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
}
.biz-header{ display:flex; align-items:center; justify-content:space-between; padding: .9rem 1rem; border-bottom:1px solid var(--biz-border, #e6e9ef); }
.biz-title{ color: var(--biz-ink-900, #1f2630); }
.biz-body{ padding: 1rem; overflow:auto; }
.biz-footer{ padding: .9rem 1rem; border-top:1px solid var(--biz-border, #e6e9ef); display:flex; gap:.5rem; justify-content:flex-end; }
</style>
