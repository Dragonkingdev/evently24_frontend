<template>
  <header class="nav-shell">
    <div class="container-fluid d-flex justify-content-between align-items-center py-2">
      <!-- Left: Logo -->
      <NuxtLink to="/" class="nav-logo d-flex align-items-center mr-2">
        <i class="bi bi-ticket-perforated-fill me-2 text-primary"></i> MyEventVerse
      </NuxtLink>

      <!-- Center: Desktop Search -->
      <SearchBarWithFilter variant="desktop" />

      <!-- Right: Actions -->
      <div class="nav-actions">
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-none d-lg-inline-flex">
          <i class="bi bi-compass"></i><span class="ms-1">Entdecken</span>
        </NuxtLink>

        <NuxtLink
          v-if="!isLoggedIn"
          to="/auth/lookup"
          class="btn btn-link text-decoration-none d-none d-lg-inline-flex"
        >
          <i class="bi bi-person-circle"></i><span class="ms-1">Login</span>
        </NuxtLink>

        <NuxtLink
          v-else
          to="/account"
          class="btn btn-link text-decoration-none d-none d-lg-inline-flex"
          title="Profil"
        >
          <span class="position-relative">
            <i class="bi bi-person-circle"></i>
            <span class="status-dot" aria-label="eingeloggt"></span>
          </span>
          <span class="ms-1 d-none d-xl-inline">{{ currentUser }}</span>
        </NuxtLink>

        <!-- Mobile quick icons -->
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-lg-none">
          <i class="bi bi-compass"></i>
        </NuxtLink>

        <NuxtLink
          v-if="isLoggedIn"
          to="/account"
          class="btn btn-link text-decoration-none d-lg-none"
          title="Profil"
        >
          <span class="position-relative">
            <i class="bi bi-person-circle"></i>
            <span class="status-dot"></span>
          </span>
        </NuxtLink>
        <NuxtLink
          v-else
          to="/auth/lookup"
          class="btn btn-link text-decoration-none d-lg-none"
          title="Login"
        >
          <i class="bi bi-person-circle"></i>
        </NuxtLink>

        <NuxtLink to="/cart" class="btn btn-link text-decoration-none">
          <i class="bi bi-bag"></i><span class="d-none d-lg-inline ms-1">Warenkorb</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile full-width search unter navbar -->
    <SearchBarWithFilter variant="mobile" />
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import SearchBarWithFilter from '@/components/SearchBarWithFilter.vue'

const { isLoggedIn, user } = useAuth()

const currentUser = user?.value.email || 'Gast'
</script>

<style scoped>
.search-desktop{ margin-left: 10px; }

/* grüner Punkt unten rechts am Profil-Icon */
.status-dot{
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #28a745; /* Bootstrap success */
  border: 2px solid currentColor;
}
</style>
