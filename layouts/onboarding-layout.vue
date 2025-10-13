<!-- layouts/onboarding-layout.vue -->
<template>
  <!-- Minimalistisches Onboarding-Layout: kümmert sich um Head-Assets & Slot -->
  <div id="onboarding-layout">
    <NuxtLoadingIndicator />
    <slot />
    <ClientOnly>
      <Chatbot />
    </ClientOnly>
  </div>
</template>

<script setup>
import Chatbot from '~/components/Chatbot.vue'
</script>

<style>
/* Ein paar sinnvolle Defaults für das Onboarding-Look & Feel */
html { 
    scroll-behavior: smooth;
    overflow-x: hidden; 
}
body { background: #fff; }
</style>
