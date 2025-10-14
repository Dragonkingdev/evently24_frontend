<!--layout/default.vue-->
<script setup>
import Navbar from '~/components/new/Navbar.vue'
import Footer from '~/components/new/Footer.vue'
import RegionModal from '~/components/new/RegionModal.vue'
import FiltersDrawer from '~/components/new/FiltersDrawer.vue'
</script>

<template>
  <div>
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />

    <RegionModal />
    <FiltersDrawer />
  </div>
</template>

<style scoped>
main{ background:#fff; padding-top: 54px; }
@media (max-width: 768px){ main{ padding-top: 100px; } }
</style>
