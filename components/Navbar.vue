<template>
  <header class="nav-shell">
    <div class="container-fluid d-flex justify-content-between align-items-center py-2">
      <!-- Left: Logo -->
      <NuxtLink to="/" class="nav-logo d-flex align-items-center mr-2">
        <i class="bi bi-ticket-perforated-fill me-2 text-primary"></i> MyEventVerse
      </NuxtLink>

      <!-- Center: Desktop search -->
      <div class="nav-center search-desktop">
        <div class="search-wrap-desktop position-relative w-100">
          <i class="bi bi-search search-icon"></i>
          <input v-model="q" @keyup.enter="search" class="form-control search-input" placeholder="Suche nach Events, Künstlern, Orten…">
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="nav-actions">
        <button class="btn btn-link text-decoration-none" @click="toggle" :title="theme==='dark'?'Helles Theme':'Dunkles Theme'">
          <i class="bi" :class="theme==='dark' ? 'bi-sun' : 'bi-moon'"></i>
        </button>
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-none d-lg-inline-flex">
          <i class="bi bi-compass"></i><span class="ms-1">Entdecken</span>
        </NuxtLink>
        <NuxtLink to="/auth/lookup" class="btn btn-link text-decoration-none d-none d-lg-inline-flex">
          <i class="bi bi-person-circle"></i><span class="ms-1">Login</span>
        </NuxtLink>
        <NuxtLink to="/cart" class="btn btn-link text-decoration-none">
          <i class="bi bi-bag"></i><span class="d-none d-lg-inline ms-1">Warenkorb</span>
        </NuxtLink>

        <!-- Mobile quick icons -->
        <button class="btn btn-link text-decoration-none d-lg-none" @click="mobileSearch?.focus()">
          <i class="bi bi-search"></i>
        </button>
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-lg-none">
          <i class="bi bi-compass"></i>
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile full-width search under navbar -->
    <div class="search-mobile border-top">
      <div class="container-fluid py-2">
        <div class="position-relative">
          <i class="bi bi-search search-icon"></i>
          <input ref="mobileSearch" v-model="q" @keyup.enter="search" class="form-control search-input w-100" placeholder="Suche nach Events, Künstlern, Orten…">
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const q = ref('')
const { theme, toggle } = useTheme()   // auto-import aus /composables

function search() {
  if (!q.value) return
  navigateTo(`/explore?q=${encodeURIComponent(q.value)}`)
}
</script>


<style scoped>
.search-desktop{
  margin-left: 10px;
}
</style>