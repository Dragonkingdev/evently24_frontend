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
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-none d-lg-inline-flex">
          <i class="bi bi-compass"></i><span class="ms-1">Entdecken</span>
        </NuxtLink>

        <!-- Login nur wenn NICHT eingeloggt -->
        <NuxtLink
          v-if="!isLoggedIn"
          to="/auth/lookup"
          class="btn btn-link text-decoration-none d-none d-lg-inline-flex"
        >
          <i class="bi bi-person-circle"></i><span class="ms-1">Login</span>
        </NuxtLink>

        <!-- Wenn eingeloggt: nur Profil-Icon + sichtbarer Statuspunkt -->
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
          <!-- Optional: Email zeigen ab XL -->
          <span class="ms-1 d-none d-xl-inline">{{ user?.email }}</span>
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

        <!-- Mobile: Profil-Icon statt Login -->
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
      </div>
    </div>

    <!-- Mobile full-width search unter navbar -->
    <div class="search-mobile border-top">
      <div class="container-fluid py-2">
        <div class="d-flex">
          <div class="position-relative flex-grow-1 me-2">
            <i class="bi bi-search search-icon"></i>
            <input ref="mobileSearch" v-model="q" @keyup.enter="search" class="form-control search-input w-100" placeholder="Suche nach Events, Künstlern, Orten…">
          </div>
          <select v-model="filter" class="form-select w-auto" @change="search">
            <option value="all">Alles</option>
            <option value="events">Events</option>
            <option value="acts">Künstler</option>
            <option value="locations">Orte</option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const q = ref('')
const filter = ref('all')
const { isLoggedIn, user } = useAuth()

function search() {
  const term = q.value.trim()
  if (!term) return
  navigateTo({
    path: '/search',
    query: { q: term, type: filter.value, page: 1 }
  })
}
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
  border: 2px solid currentColor; /* sauberer Rand auf jedem Theme */
}
</style>