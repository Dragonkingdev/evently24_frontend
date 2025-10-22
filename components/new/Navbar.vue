<!-- components/new/Navbar.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SearchBar from '~/components/search/SearchBar.vue'
import { useRegion } from '~/composables/useRegion'
import { useAuth } from '~/composables/useAuth'

const { region } = useRegion()
const openRegion = useState('regionModalOpen')

// Auth
const { user, authReady, isLoggedIn, fetchUser, logout } = useAuth()

// beim ersten Mount sicherstellen, dass wir den User haben
onMounted(() => {
  if (!authReady.value) fetchUser().catch(()=>{})
})

// Account-Dropdown
const accountOpen = ref(false)
function closeAccountMenu(){ accountOpen.value = false }

function onProfileClick () {
  if (!isLoggedIn.value) {
    // nicht eingeloggt -> direkt zu /lookup
    return navigateTo('/auth/lookup')
  }
  accountOpen.value = !accountOpen.value
}

// Click-Outside & ESC
let removeListeners = null
onMounted(() => {
  const onDocClick = (ev) => {
    const root = document.getElementById('nav-root')
    if (root && !root.contains(ev.target)) closeAccountMenu()
  }
  const onKey = (e) => { if (e.key === 'Escape') closeAccountMenu() }

  document.addEventListener('click', onDocClick)
  window.addEventListener('keydown', onKey)

  removeListeners = () => {
    document.removeEventListener('click', onDocClick)
    window.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => { removeListeners?.() })

// Ableitung Anzeigename
const displayName = computed(() => {
  const u = user.value || {}
  const first = u.firstName || u.first_name || ''
  const last  = u.lastName  || u.last_name  || ''
  const name  = [first, last].filter(Boolean).join(' ').trim()
  return name || u.displayName || u.username || u.email || 'Profil'
})

async function onLogout(){
  try {
    await logout()
  } finally {
    accountOpen.value = false
    navigateTo('/')
  }
}
</script>

<template>
  <header class="nav" id="nav-root">
    <div class="wrap">
      <!-- Brand -->
      <NuxtLink to="/" class="brand" aria-label="Startseite">
        <i class="bi bi-stars"></i>
        <strong>Evently24</strong>
      </NuxtLink>

      <!-- Search: Desktop in Reihe, Mobile darunter -->
      <div class="search-wrap">
        <SearchBar placeholder="Suche nach Events, Locations, Artists…" />
      </div>

      <!-- Actions -->
      <nav class="actions">
        <button class="btn tiny" @click="openRegion=true" aria-label="Region wechseln">
          <i class="bi bi-geo"></i>
          <span class="hide-sm">{{ region }}</span>
        </button>

        <!-- Profil -->
        <div class="acc">
          <button
            class="icon-btn"
            @click.stop="onProfileClick"
            :aria-expanded="accountOpen"
            aria-haspopup="menu"
            aria-label="Profil / Konto"
          >
            <i class="bi bi-person-circle"></i>
          </button>

          <!-- Dropdown nur wenn eingeloggt -->
          <transition name="xpop">
            <div
              v-if="isLoggedIn && accountOpen"
              class="acc-menu"
              role="menu"
              aria-label="Kontomenü"
            >
              <div class="acc-hd" role="presentation">
                <div class="avatar"><i class="bi bi-person"></i></div>
                <div class="who">
                  <div class="name">{{ displayName }}</div>
                  <div class="mail" v-if="user?.email">{{ user.email }}</div>
                </div>
              </div>

              <NuxtLink class="acc-item" role="menuitem" to="/account" @click="closeAccountMenu">
                <i class="bi bi-person"></i> Mein Profil
              </NuxtLink>

              <NuxtLink class="acc-item" role="menuitem" to="/business" @click="closeAccountMenu">
                <i class="bi bi-briefcase"></i> Business-Account
              </NuxtLink>

              <button class="acc-item danger" role="menuitem" @click="onLogout">
                <i class="bi bi-box-arrow-right"></i> Abmelden
              </button>
            </div>
          </transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav{
  position:sticky; top:0; z-index:1040; background:#fff; border-bottom:1px solid #eef2f7;
}

/* Grid-Layout mit Areas -> mobil Search unter die Leiste */
.wrap{
  max-width:1320px; margin:0 auto; padding:.55rem 1rem;
  display:grid; align-items:center; gap:.6rem .8rem;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "brand search actions";
}

.brand{
  grid-area: brand; display:flex; align-items:center; gap:.45rem;
  color:#111827; text-decoration:none; white-space:nowrap;
}
.search-wrap{ grid-area: search; min-width:0; }
.actions{ grid-area: actions; display:flex; align-items:center; gap:.6rem; }

.btn.tiny{
  border:1px solid #e6e8f0; background:#fff; border-radius:10px; padding:.35rem .6rem;
  font-weight:700; color:#111827; display:flex; align-items:center; gap:.4rem;
}
.btn.tiny:hover{ background:#f8fafc; border-color:#dfe6ff; }

.icon-btn{
  width:38px; height:38px; border-radius:50%; border:1px solid #e6e8f0; background:#fff;
  display:grid; place-items:center; font-size:1.15rem; cursor:pointer; color:#111827; position:relative;
}
.icon-btn:hover{ background:#f8fafc; border-color:#dfe6ff; }

/* Account-Dropdown */
.acc{ position:relative; }
.acc-menu{
  position:absolute; right:0; top: calc(100% + .5rem);
  width: min(280px, 92vw);
  background:#fff; border:1px solid #eef2f7; border-radius:14px;
  box-shadow: 0 20px 44px rgba(2,6,23,.14);
  padding:.5rem; z-index:50;
}
.acc-hd{
  display:flex; gap:.6rem; align-items:center; padding:.4rem .4rem .6rem;
  border-bottom:1px solid #f1f4fa; margin-bottom:.3rem;
}
.avatar{
  width:38px; height:38px; border-radius:50%; display:grid; place-items:center;
  background:#f3f4f6; color:#4b5563;
}
.who .name{ font-weight:800; line-height:1.2; }
.who .mail{ font-size:.85rem; color:#6b7280; }

.acc-item{
  width:100%; text-align:left; display:flex; align-items:center; gap:.6rem;
  background:#fff; border:0; padding:.55rem .6rem; border-radius:10px; cursor:pointer;
  color:#111827; text-decoration:none;
}
.acc-item:hover{ background:#f8fafc; }
.acc-item.danger{ color:#b91c1c; }
.acc-item.danger:hover{ background:#fef2f2; }

.xpop-enter-active, .xpop-leave-active{ transition: opacity .14s ease, transform .14s ease; }
.xpop-enter-from, .xpop-leave-to{ opacity:0; transform: translateY(-4px); }

@media (max-width: 720px){
  .wrap{
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "brand actions"
      "search search";
    row-gap:.5rem;
    width: 100%;
  }
  .search-wrap{ width:100%; }
  .hide-sm{ display:none; }
}
</style>
