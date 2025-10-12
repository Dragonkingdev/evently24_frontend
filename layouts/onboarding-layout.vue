<template>
  <!-- Minimalistisches Onboarding-Layout: kümmert sich um Head-Assets & Slot -->
  <div id="onboarding-layout">
    <NuxtLoadingIndicator />
    <slot />
  </div>
</template>

<script setup lang="ts">

</script>

<style>
/* Ein paar sinnvolle Defaults für das Onboarding-Look & Feel */
html { 
    scroll-behavior: smooth;
    overflow-x: hidden; 
}
body { background: #fff; }
</style>
