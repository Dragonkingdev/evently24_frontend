<script setup>
import Navbar from '~/components/new/Navbar.vue'
import Footer from '~/components/new/Footer.vue'
import RegionModal from '~/components/new/RegionModal.vue'
import FiltersOffcanvas from '~/components/new/FiltersOffcanvas.vue'
</script>

<template>
  <div>
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
    <!-- Global Modals/Offcanvas -->
    <RegionModal />
    <FiltersOffcanvas />
  </div>
</template>

<style scoped>
main{ 
  background:#fff;
  padding-top: 54px; 
}

@media (max-width: 768px){
  main{ 
    padding-top: 100px; 
  }
}

</style>