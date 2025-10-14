<!-- components/ui/Drawer.vue -->
<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  side: { type: String, default: 'right' } // 'left' | 'right'
})
const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, v => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})
function close(){ emit('update:modelValue', false) }
</script>

<template>
  <transition name="xdrawer">
    <div v-if="modelValue" class="xdrawer-wrap" @click.self="close">
      <aside class="xdrawer" :class="`is-${side}`">
        <header class="xdrawer-head">
          <slot name="title"><h5>Filter</h5></slot>
          <button class="xdrawer-close" @click="close">×</button>
        </header>
        <div class="xdrawer-body">
          <slot />
        </div>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.xdrawer-wrap{ position:fixed; inset:0; background:rgba(16,24,40,.45); z-index:1059; }
.xdrawer{ position: absolute; top:0; bottom:0; width:min(420px, 92vw); background:#fff; box-shadow: -20px 0 60px rgba(3,7,18,.15); }
.xdrawer.is-right{ right:0; }
.xdrawer.is-left{ left:0; }
.xdrawer-head{ display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid #eef2f7;}
.xdrawer-close{ border:0; background:transparent; font-size:1.6rem; cursor:pointer; color:#475467;}
.xdrawer-body{ padding:1rem; overflow:auto; height: calc(100% - 58px);}
.xdrawer-enter-active, .xdrawer-leave-active{ transition: opacity .18s ease; }
.xdrawer-enter-from, .xdrawer-leave-to{ opacity:0; }
.xdrawer > * { will-change: transform; }
</style>
