<template>
  <div class="dash-layout">
    <aside class="dash-aside">
      <div class="brand">🎫 Evently24 Business</div>

      <!-- Dashboard -->
      <NuxtLink
        to="/business"
        class="group-toggle solo"
        :class="{ 'is-active': isBusinessRoot }"
        :aria-current="isBusinessRoot ? 'page' : null"
      >
        <span class="left">
          <i class="bi bi-speedometer2"></i>
          <span>Startseite</span>
        </span>
      </NuxtLink>

      <!-- Organizer -->
      <div class="group">
        <NuxtLink
          to="/business/organizer/dashboard"
          class="group-toggle"
          @click="openOnly('organizer')"
          :aria-expanded="open.organizer"
        >
          <span class="left"><i class="bi bi-briefcase"></i><span>Organizer</span></span>
        </NuxtLink>
        <nav v-show="open.organizer" class="nav flex-column">
          <NuxtLink to="/business/organizer/tours" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/tours') }"
            :aria-current="isActive('/business/organizer/tours') ? 'page' : null">
            <i class="bi bi-music-note-beamed"></i> Tours
          </NuxtLink>
          <NuxtLink to="/business/organizer/events" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/events') }"
            :aria-current="isActive('/business/organizer/events') ? 'page' : null">
            <i class="bi bi-calendar3"></i> Events
          </NuxtLink>
          <NuxtLink to="/business/organizer/entry" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/entry') }"
            :aria-current="isActive('/business/organizer/entry') ? 'page' : null">
            <i class="bi bi-qr-code-scan"></i> Entry
          </NuxtLink>
          <NuxtLink to="/business/organizer/payouts" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/payouts') }"
            :aria-current="isActive('/business/organizer/payouts') ? 'page' : null">
            <i class="bi bi-cash-coin"></i> Auszahlungen
          </NuxtLink>
          <NuxtLink to="/business/organizer/statistics" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/statistics') }"
            :aria-current="isActive('/business/organizer/statistics') ? 'page' : null">
            <i class="bi bi-graph-up"></i> Statistiken
          </NuxtLink>
          <NuxtLink to="/business/organizer/promo-slots" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/promo-slots') }"
            :aria-current="isActive('/business/organizer/promo-slots') ? 'page' : null">
            <i class="bi bi-bullseye"></i> Marketing
          </NuxtLink>
          <NuxtLink to="/business/organizer/newsletter" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/newsletter') }"
            :aria-current="isActive('/business/organizer/newsletter') ? 'page' : null">
            <i class="bi bi-envelope"></i> Newsletter
          </NuxtLink>
          <NuxtLink to="/business/organizer/marketing/social-ads" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/marketing/social-ads') }"
            :aria-current="isActive('/business/organizer/marketing/social-ads') ? 'page' : null">
            <i class="bi bi-megaphone"></i> Social Ads
          </NuxtLink>
          <NuxtLink to="/business/organizer/settings/branding" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/settings/branding') }"
            :aria-current="isActive('/business/organizer/settings/branding') ? 'page' : null">
            <i class="bi bi-gear"></i> Settings
          </NuxtLink>
        </nav>
      </div>

      <!-- Artist -->
      <div class="group">
        <NuxtLink
          to="/business/artist/dashboard"
          class="group-toggle"
          @click="openOnly('artist')"
          :aria-expanded="open.artist"
        >
          <span class="left"><i class="bi bi-music-note-list"></i><span>Artist</span></span>
        </NuxtLink>
        <nav v-show="open.artist" class="nav flex-column">
          <NuxtLink to="/business/artist/profile" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/profile') }"
            :aria-current="isActive('/business/artist/profile') ? 'page' : null">
            <i class="bi bi-person"></i> Profil
          </NuxtLink>
          <NuxtLink to="/business/artist/tours" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/tours') }"
            :aria-current="isActive('/business/artist/tours') ? 'page' : null">
            <i class="bi bi-music-note-beamed"></i> Tours
          </NuxtLink>
          <NuxtLink to="/business/artist/gigs" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/gigs') }"
            :aria-current="isActive('/business/artist/gigs') ? 'page' : null">
            <i class="bi bi-lightning"></i> Gigs
          </NuxtLink>
          <NuxtLink to="/business/artist/requests" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/requests') }"
            :aria-current="isActive('/business/artist/requests') ? 'page' : null">
            <i class="bi bi-inbox"></i> Anfragen
          </NuxtLink>
          <NuxtLink to="/business/artist/calendar" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/calendar') }"
            :aria-current="isActive('/business/artist/calendar') ? 'page' : null">
            <i class="bi bi-calendar-event"></i> Kalender
          </NuxtLink>
          <NuxtLink to="/business/artist/statistics" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/statistics') }"
            :aria-current="isActive('/business/artist/statistics') ? 'page' : null">
            <i class="bi bi-graph-up"></i> Statistiken
          </NuxtLink>
          <NuxtLink to="/business/artist/settings" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/settings') }"
            :aria-current="isActive('/business/artist/settings') ? 'page' : null">
            <i class="bi bi-gear"></i> Einstellungen
          </NuxtLink>
        </nav>
      </div>

      <!-- Venue -->
      <div class="group">
        <NuxtLink
          to="/business/venue/backoffice"
          class="group-toggle"
          @click="openOnly('venue')"
          :aria-expanded="open.venue"
        >
          <span class="left"><i class="bi bi-building"></i><span>Venue</span></span>
        </NuxtLink>
        <nav v-show="open.venue" class="nav flex-column">
          <NuxtLink to="/business/venue/profile" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/profile') }"
            :aria-current="isActive('/business/venue/profile') ? 'page' : null">
            <i class="bi bi-person-badge"></i> Profil
          </NuxtLink>
          <!-- ... alle weiteren Venue-Links gleich mit isActive + aria-current versehen ... -->
        </nav>
      </div>

      <!-- Feedback & Abos -->
      <div class="group">
        <NuxtLink
          to="/business/feedback"
          class="group-toggle"
          @click="openOnly('meta')"
          :aria-expanded="open.meta"
        >
          <span class="left"><i class="bi bi-chat-left-heart"></i><span>Feedback & Abos</span></span>
        </NuxtLink>
        <nav v-show="open.meta" class="nav flex-column">
          <NuxtLink to="/business/feedback" class="nav-link"
            :class="{ 'is-active': isActive('/business/feedback') }"
            :aria-current="isActive('/business/feedback') ? 'page' : null">
            <i class="bi bi-chat-dots"></i> Feedback
          </NuxtLink>
          <NuxtLink to="/business/subscriptions" class="nav-link"
            :class="{ 'is-active': isActive('/business/subscriptions') }"
            :aria-current="isActive('/business/subscriptions') ? 'page' : null">
            <i class="bi bi-credit-card"></i> Abos
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <main class="dash-main">
      <header class="dash-header">
        <div class="title"><slot name="title">Dashboard</slot></div>
        <div class="actions"><slot name="actions" /></div>
      </header>
      <div class="dash-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute()

const open = reactive({ organizer:false, artist:false, venue:false, meta:false })

function openOnly(key) {
  Object.keys(open).forEach(k => { open[k] = (k === key) })
}
function setInitialOpenByRoute(p){
  open.organizer = p.startsWith('/business/organizer')
  open.artist    = p.startsWith('/business/artist')
  open.venue     = p.startsWith('/business/venue')
  open.meta      = p.startsWith('/business/feedback') || p.startsWith('/business/subscriptions')
}
onMounted(()=> setInitialOpenByRoute(route.path))
watch(()=> route.path, p => setInitialOpenByRoute(p))

const isBusinessRoot = computed(() => route.path === '/business')
function isActive(base){ return route.path === base || route.path.startsWith(base + '/') }
</script>

<style scoped>
.dash-layout{ display:grid; grid-template-columns:260px 1fr; min-height:100vh; }
.dash-main{ background:#f8fafc; }
.dash-header{ position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:.75rem 1rem; background:#fff; border-bottom:1px solid #e5e7eb; }
.dash-content{ padding:1rem; }

.dash-aside{ background:#0d1b2a; color:#fff; padding:1rem; overflow:auto; }
.brand{ font-weight:800; letter-spacing:.5px; margin-bottom:1rem; }

.group{ position:relative; margin-bottom:.4rem; }
.group-toggle{
  width:100%; background:transparent; color:#e2e8f0; border:0; border-radius:.45rem;
  display:flex; align-items:center; justify-content:flex-start; gap:.55rem;
  padding:.5rem .6rem; font-weight:700; text-decoration:none; line-height:1.1;
}
.group-toggle:hover{ background:rgba(255,255,255,.08); color:#fff; }
.group-toggle .left{ display:flex; align-items:center; gap:.55rem; }

.group-toggle.solo{ margin-bottom:.25rem; }
.group-toggle.solo.is-active{
  background:#fff; color:#0d1b2a;
  box-shadow:0 1px 0 rgba(0,0,0,.05);
}

.nav{ text-align:left; padding-left:1rem;  }
.nav-link{
  position:relative; color:#cbd5e1; border-radius:.6rem;
  display:flex; gap:.5rem; align-items:center; font-size:.95rem; justify-content:flex-start;
  padding:.4rem .55rem; line-height:1.1;
}
.nav-link:hover{ background:rgba(255,255,255,.08); color:#fff; }
.nav-link.is-active{
  background:#fff; color:#0d1b2a;
  box-shadow:0 1px 0 rgba(0,0,0,.05);
}

:global(.router-link-active){}
.group-toggle i, .nav-link i{ opacity:.9; }
</style>
