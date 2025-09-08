<template>
  <div class="dash-layout">
    <aside class="dash-aside">
      <div class="brand">🎫 Evently24 Business</div>

      <!-- Dashboard -->
      <NuxtLink to="/business" class="group-toggle solo">
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
            :class="{ 'is-active': isActive('/business/organizer/tours') }"><i class="bi bi-music-note-beamed"></i> Tours</NuxtLink>
          <NuxtLink to="/business/organizer/events" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/events') }"><i class="bi bi-calendar3"></i> Events</NuxtLink>
          <NuxtLink to="/business/organizer/entry" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/entry') }"><i class="bi bi-qr-code-scan"></i> Entry</NuxtLink>
          <NuxtLink to="/business/organizer/payouts" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/payouts') }"><i class="bi bi-cash-coin"></i> Auszahlungen</NuxtLink>
          <NuxtLink to="/business/organizer/statistics" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/statistics') }"><i class="bi bi-graph-up"></i> Statistiken</NuxtLink>
          <NuxtLink to="/business/organizer/promo-slots" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/promo-slots') }"><i class="bi bi-bullseye"></i> Marketing</NuxtLink>
          <NuxtLink to="/business/organizer/newsletter" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/newsletter') }"><i class="bi bi-envelope"></i> Newsletter</NuxtLink>
          <NuxtLink to="/business/organizer/marketing/social-ads" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/marketing/social-ads') }"><i class="bi bi-megaphone"></i> Social Ads</NuxtLink>
          <NuxtLink to="/business/organizer/settings/branding" class="nav-link"
            :class="{ 'is-active': isActive('/business/organizer/settings/branding') }"><i class="bi bi-gear"></i> Settings</NuxtLink>
        </nav>
      </div>

      <!-- Artist (wie Organizer) -->
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
            :class="{ 'is-active': isActive('/business/artist/profile') }"><i class="bi bi-person"></i> Profil</NuxtLink>
          <NuxtLink to="/business/artist/tours" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/tours') }"><i class="bi bi-music-note-beamed"></i> Tours</NuxtLink>
          <NuxtLink to="/business/artist/gigs" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/gigs') }"><i class="bi bi-lightning"></i> Gigs</NuxtLink>
          <NuxtLink to="/business/artist/requests" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/requests') }"><i class="bi bi-inbox"></i> Anfragen</NuxtLink>
          <NuxtLink to="/business/artist/calendar" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/calendar') }"><i class="bi bi-calendar-event"></i> Kalender</NuxtLink>
          <NuxtLink to="/business/artist/statistics" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/statistics') }"><i class="bi bi-graph-up"></i> Statistiken</NuxtLink>
          <NuxtLink to="/business/artist/settings" class="nav-link"
            :class="{ 'is-active': isActive('/business/artist/settings') }"><i class="bi bi-gear"></i> Einstellungen</NuxtLink>
        </nav>
      </div>

      <!-- Venue (wie Organizer) -->
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
            :class="{ 'is-active': isActive('/business/venue/profile') }"><i class="bi bi-person-badge"></i> Profil</NuxtLink>
          <NuxtLink to="/business/venue/profile/media" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/profile/media') }"><i class="bi bi-image"></i> Media</NuxtLink>
          <NuxtLink to="/business/venue/profile/pricing" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/profile/pricing') }"><i class="bi bi-currency-euro"></i> Pricing</NuxtLink>

          <NuxtLink to="/business/venue/requests" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/requests') }"><i class="bi bi-inbox"></i> Requests</NuxtLink>
          <NuxtLink to="/business/venue/requests/new" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/requests/new') }"><i class="bi bi-plus-circle"></i> Request Neu</NuxtLink>

          <NuxtLink to="/business/venue/calendar" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/calendar') }"><i class="bi bi-calendar3"></i> Kalender</NuxtLink>

          <NuxtLink to="/business/venue/offers" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/offers') }"><i class="bi bi-handbag"></i> Angebote</NuxtLink>
          <NuxtLink to="/business/venue/contracts" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/contracts') }"><i class="bi bi-file-earmark-text"></i> Verträge</NuxtLink>

          <NuxtLink to="/business/venue/addons" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/addons') }"><i class="bi bi-plus-square"></i> Add-ons</NuxtLink>
          <NuxtLink to="/business/venue/addons/catering" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/addons/catering') }"><i class="bi bi-basket"></i> Catering</NuxtLink>
          <NuxtLink to="/business/venue/addons/tech" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/addons/tech') }"><i class="bi bi-cpu"></i> Technik</NuxtLink>
          <NuxtLink to="/business/venue/addons/dj" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/addons/dj') }"><i class="bi bi-vinyl"></i> DJ</NuxtLink>

          <NuxtLink to="/business/venue/invoices" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/invoices') }"><i class="bi bi-receipt"></i> Rechnungen</NuxtLink>

          <NuxtLink to="/business/venue/events" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/events') }"><i class="bi bi-calendar-event"></i> Events</NuxtLink>
          <NuxtLink to="/business/venue/events/new" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/events/new') }"><i class="bi bi-plus-circle"></i> Event Neu</NuxtLink>

          <NuxtLink to="/business/venue/settings/team" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/settings/team') }"><i class="bi bi-people"></i> Team</NuxtLink>
          <NuxtLink to="/business/venue/settings/api" class="nav-link"
            :class="{ 'is-active': isActive('/business/venue/settings/api') }"><i class="bi bi-braces"></i> API</NuxtLink>
        </nav>
      </div>

      <!-- Feedback & Abos (wie Organizer) -->
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
            :class="{ 'is-active': isActive('/business/feedback') }"><i class="bi bi-chat-dots"></i> Feedback</NuxtLink>
          <NuxtLink to="/business/subscriptions" class="nav-link"
            :class="{ 'is-active': isActive('/business/subscriptions') }"><i class="bi bi-credit-card"></i> Abos</NuxtLink>
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
import { reactive, watch, onMounted } from 'vue'
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

function isActive(base){ return route.path === base || route.path.startsWith(base + '/') }
</script>

<style scoped>
/* ===== Layout ===== */
.dash-layout{ display:grid; grid-template-columns:260px 1fr; min-height:100vh; }
.dash-main{ background:#f8fafc; }
.dash-header{ position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:.75rem 1rem; background:#fff; border-bottom:1px solid #e5e7eb; }
.dash-content{ padding:1rem; }

/* ===== Sidebar (dein Dark-Theme bleibt) ===== */
.dash-aside{ background:#0d1b2a; color:#fff; padding:1rem; overflow:auto; }
.brand{ font-weight:800; letter-spacing:.5px; margin-bottom:1rem; }

/* Groups */
.group{ position:relative; margin-bottom:.4rem; }
.group-toggle{
  width:100%; background:transparent; color:#e2e8f0; border:0; border-radius:.45rem;
  display:flex; align-items:center; justify-content:flex-start; gap:.55rem;
  padding:.5rem .6rem; font-weight:700; text-decoration:none; line-height:1.1;
}
.group-toggle:hover{ background:rgba(255,255,255,.08); color:#fff; }
.group-toggle .left{ display:flex; align-items:center; gap:.55rem; }

/* Dashboard-Button im gleichen Raster */
.group-toggle.solo{ margin-bottom:.25rem; }

/* Links (nur der aktive Link wird markiert) */
.nav{ text-align:left; padding-left:1rem;  }
.nav-link{
  position:relative; color:#cbd5e1; border-radius:.6rem;
  display:flex; gap:.5rem; align-items:center; font-size:.95rem; justify-content:flex-start;
  padding:.4rem .55rem; line-height:1.1;
}
.nav-link:hover{ background:rgba(255,255,255,.08); color:#fff; }

/* ACTIVE: nur wenn explizit .is-active gesetzt wurde */
.nav-link.is-active{
  background:#fff; color:#0d1b2a;
  box-shadow:0 1px 0 rgba(0,0,0,.05);
}

/* Entfernt globale Router-Aktiv-Styles, damit nichts anderes „mit-markiert“ wird */
:global(.router-link-active){}

/* Icons leicht dezenter */
.group-toggle i, .nav-link i{ opacity:.9; }
</style>
