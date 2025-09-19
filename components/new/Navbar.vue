<template>
  <header class="nav-shell fixed-top" v-if="authReady">
    <div class="container-fluid d-flex justify-content-between align-items-center py-2">
      <!-- Left: Logo -->
      <NuxtLink to="/" class="nav-logo d-flex align-items-center mr-2">
        <i class="bi bi-ticket-perforated-fill me-2 text-primary"></i> MyEventVerse
      </NuxtLink>

      <!-- Center: Desktop Search (wie neue Navbar) -->
      <form class="search-desktop d-none d-md-flex flex-grow-1 mx-3" role="search" @submit.prevent>
        <div class="input-group">
          <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
          <input v-model="query" class="form-control" type="search" placeholder="Suche nach Events, Festivals, Locations, Artists…" />
          <button class="btn btn-outline-secondary d-none d-md-inline" type="button" data-bs-toggle="offcanvas" data-bs-target="#filters">
            <i class="bi bi-sliders"></i> Filter
          </button>
        </div>
      </form>

      <!-- Right: Actions -->
      <div class="nav-actions d-flex align-items-center">
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-none d-lg-inline-flex">
          <i class="bi bi-compass"></i><span class="ms-1">Entdecken</span>
        </NuxtLink>

        <!-- Desktop: Login / Profile -->
        <NuxtLink
          v-if="!isLoggedIn"
          to="/auth/lookup"
          class="btn btn-link text-decoration-none d-none d-lg-inline-flex"
        >
          <i class="bi bi-person-circle"></i><span class="ms-1">Login</span>
        </NuxtLink>

        <div
          v-else
          class="position-relative d-none d-lg-inline-flex"
          ref="menuWrap"
        >
          <!-- Toggle Button -->
          <button
            class="btn btn-link text-decoration-none d-inline-flex align-items-center"
            @click="toggleMenu"
            @keydown.down.prevent="openMenuAndFocusFirst"
            @keydown.enter.prevent="toggleMenu"
            @keydown.space.prevent="toggleMenu"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            aria-haspopup="menu"
            ref="menuButton"
            title="Profil"
          >
            <span class="position-relative">
              <i class="bi bi-person-circle"></i>
              <span class="status-dot" aria-label="eingeloggt"></span>
            </span>
            <span class="ms-1 d-none d-xl-inline">{{ currentUser }}</span>
          </button>

          <!-- Dropdown -->
          <ul
            v-show="menuOpen"
            class="menu-dropdown"
            role="menu"
            ref="menuEl"
            @keydown.esc.stop.prevent="closeMenuAndFocusButton"
            @keydown.up.prevent="focusPrev"
            @keydown.down.prevent="focusNext"
          >
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/account" class="menu-item" @click="closeMenu">
                <i class="bi bi-person-badge me-2"></i> Account
              </NuxtLink>
            </li>
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/tickets" class="menu-item" @click="closeMenu">
                <i class="bi bi-qr-code-scan me-2"></i> Meine Tickets
              </NuxtLink>
            </li>
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/orders" class="menu-item" @click="closeMenu">
                <i class="bi bi-receipt me-2"></i> Bestellungen
              </NuxtLink>
            </li>
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/business" class="menu-item" @click="closeMenu">
                <i class="bi bi-briefcase me-2"></i> Business
              </NuxtLink>
            </li>
            <li role="none">
              <button role="menuitem" tabindex="-1" class="menu-item btn-reset" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>

        <!-- Mobile quick icons -->
        <NuxtLink to="/explore" class="btn btn-link text-decoration-none d-lg-none">
          <i class="bi bi-compass"></i>
        </NuxtLink>

        <!-- Mobile: Login / Profile -->
        <NuxtLink
          v-if="!isLoggedIn"
          to="/auth/lookup"
          class="btn btn-link text-decoration-none d-lg-none"
          title="Login"
        >
          <i class="bi bi-person-circle"></i>
        </NuxtLink>

        <div v-else class="position-relative d-lg-none" ref="menuWrapMobile">
          <button
            class="btn btn-link text-decoration-none"
            @click="toggleMenuMobile"
            :aria-expanded="menuOpenMobile ? 'true' : 'false'"
            aria-haspopup="menu"
            ref="menuButtonMobile"
            title="Profil"
          >
            <span class="position-relative">
              <i class="bi bi-person-circle"></i>
              <span class="status-dot"></span>
            </span>
          </button>

          <ul
            v-show="menuOpenMobile"
            class="menu-dropdown menu-dropdown-mobile"
            role="menu"
            ref="menuElMobile"
            @keydown.esc.stop.prevent="closeMenuMobileAndFocusButton"
          >
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/account" class="menu-item" @click="closeMenuMobile">
                <i class="bi bi-person-badge me-2"></i> Account
              </NuxtLink>
            </li>
           <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/tickets" class="menu-item" @click="closeMenuMobile">
                <i class="bi bi-qr-code-scan me-2"></i> Meine Tickets
              </NuxtLink>
            </li>
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/orders" class="menu-item" @click="closeMenuMobile">
                <i class="bi bi-receipt me-2"></i> Bestellungen
              </NuxtLink>
            </li>
            <li role="none">
              <NuxtLink role="menuitem" tabindex="-1" to="/business" class="menu-item" @click="closeMenuMobile">
                <i class="bi bi-briefcase me-2"></i> Business
              </NuxtLink>
            </li>
            <li role="none">
              <button role="menuitem" tabindex="-1" class="menu-item btn-reset" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>

        <!-- NEU: Region-Button an Stelle des Warenkorbs -->
        <button
          class="btn btn-sm btn-primary ms-1"
          data-bs-toggle="modal"
          data-bs-target="#regionModal"
        >
          <i class="bi bi-geo-alt me-1"></i>
          <span class="d-none d-sm-inline">{{ region }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile full-width search unter navbar (wie neue Navbar) -->
    <form class="d-md-none px-2 pb-2" role="search" @submit.prevent>
      <div class="input-group">
        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
        <input v-model="query" class="form-control" type="search" placeholder="Suche nach Events, Festivals, Locations, Artists…" />
        <button class="btn btn-outline-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#filters">
          <i class="bi bi-sliders"></i>
        </button>
      </div>
    </form>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '@/composables/useAuth'
import { useRegion } from '~/composables/useRegion'

const { region } = useRegion()
const query = ref('')

const router = useRouter()
const { isLoggedIn, user, authReady, fetchUser, logout: authLogout } = useAuth()

if (process.server) {
  await fetchUser().catch(() => {})
}

const currentUser = computed(() => {
  const u = user?.value
  return u && u.email ? u.email : 'Gast'
})

/** Desktop dropdown state + refs */
const menuOpen = ref(false)
const menuWrap = ref(null)
const menuButton = ref(null)
const menuEl = ref(null)
const focusIndex = ref(0)

/** Mobile dropdown state + refs */
const menuOpenMobile = ref(false)
const menuWrapMobile = ref(null)
const menuButtonMobile = ref(null)
const menuElMobile = ref(null)

/** Outside click handling */
function onDocClick(e) {
  if (menuOpen.value && menuWrap.value && !menuWrap.value.contains(e.target)) {
    menuOpen.value = false
  }
  if (menuOpenMobile.value && menuWrapMobile.value && !menuWrapMobile.value.contains(e.target)) {
    menuOpenMobile.value = false
  }
}

function onDocKeydown(e) {
  if (e.key === 'Escape') {
    if (menuOpen.value) {
      closeMenuAndFocusButton()
    }
    if (menuOpenMobile.value) {
      closeMenuMobileAndFocusButton()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKeydown)
})

/** Desktop menu controls */
function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    nextTick(() => focusFirst())
  }
}
function closeMenu() { menuOpen.value = false }
function closeMenuAndFocusButton() {
  menuOpen.value = false
  menuButton.value?.focus()
}
function openMenuAndFocusFirst() {
  menuOpen.value = true
  nextTick(() => focusFirst())
}
function focusableItems() {
  return Array.from(menuEl.value?.querySelectorAll('[role="menuitem"]') || [])
}
function focusFirst() {
  const items = focusableItems()
  focusIndex.value = 0
  items[0]?.focus()
}
function focusNext() {
  const items = focusableItems()
  if (!items.length) return
  focusIndex.value = (focusIndex.value + 1) % items.length
  items[focusIndex.value].focus()
}
function focusPrev() {
  const items = focusableItems()
  if (!items.length) return
  focusIndex.value = (focusIndex.value - 1 + items.length) % items.length
  items[focusIndex.value].focus()
}

/** Mobile menu controls */
function toggleMenuMobile() { menuOpenMobile.value = !menuOpenMobile.value }
function closeMenuMobile() { menuOpenMobile.value = false }
function closeMenuMobileAndFocusButton() {
  menuOpenMobile.value = false
  menuButtonMobile.value?.focus()
}

/** Logout handler */
async function handleLogout() {
  try {
    if (typeof authLogout === 'function') {
      await authLogout()
    } else {
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    }
  } finally {
    await fetchUser().catch(() => {})
    menuOpen.value = false
    menuOpenMobile.value = false
    await router.push('/')
  }
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
  border: 2px solid currentColor;
}

/* Dropdown Styles */
.menu-dropdown{
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 200px;
  padding: 6px;
  margin: 0;
  list-style: none;
  background: #fff;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: .5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  z-index: 1000;
}
.menu-dropdown-mobile{ min-width: 220px; }
.menu-item{
  display: flex;
  align-items: center;
  width: 100%;
  padding: .6rem .75rem;
  border-radius: .375rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.menu-item:hover,
.menu-item:focus{
  background: rgba(0,0,0,.05);
  outline: none;
}
.btn-reset{
  background: none;
  border: none;
  text-align: left;
}

/* Branding aus deiner neuen Navbar */
.nav-shell{
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter:saturate(120%) blur(6px);
  box-shadow:0 6px 24px rgba(0,0,0,.06);
}
.nav-logo{ font-weight:800; letter-spacing:.2px; }
</style>
