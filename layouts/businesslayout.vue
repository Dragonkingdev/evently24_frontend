<!-- layouts/businesslayout.vue -->
<template>
  <div class="business-layout d-flex">
    <BusinessSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex-grow-1 main-wrap">
      <BusinessNavbar @toggle-sidebar="toggleSidebar" />
      <!-- 👇 wichtiger: eigene Klasse page-main -->
      <main class="page-main container-fluid py-4">
        <slot />
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="offcanvas-backdrop d-md-none"
      style="position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:1049;"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup>
import BusinessSidebar from '~/components/business/BusinessSidebar.vue'
import BusinessNavbar from '~/components/business/BusinessNavbar.vue'

/** SSR-safe global state (auch bei Seitenwechseln stabil) */
const sidebarOpen = useState('bizSidebarOpen', () => false)
function toggleSidebar(){ sidebarOpen.value = !sidebarOpen.value }
</script>

<style>
html, body, #__nuxt { height: 100%; }

:root{
  --sidebar-width: 270px;
  --brand-bg: #0d1b2a;
  --brand-fg: #ffffff;
  --brand-fg-muted: #e2e8f0;
  --brand-fg-muted-2: #9fa7af;
  --main-bg: #f8fafc;
  --border-soft: #e5e7eb;
}

/* Gesamtlayout */
.business-layout{ min-height: 100vh; }
.main-wrap{
  background: var(--main-bg);
  display: flex;
  flex-direction: column;
  min-width: 0;            /* wichtig für korrektes Overflow in Flex-Childs */
}

/* 👇 Der Main-Bereich ist jetzt der Scroll-Container */
.page-main{
  flex: 1 1 auto;
  overflow: auto;
  min-height: 0;           /* verhindert, dass Flex-Childs größer als der Container werden */
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Sidebar (dunkel, sticky, volle Höhe) */
.d-flex > .sidebar{
  flex: 0 0 var(--sidebar-width);   /* Sidebar-Breite fixieren */
  width: var(--sidebar-width);
  min-height: 100vh;
  position: sticky; top: 0;
  background: var(--brand-bg);
  color: var(--brand-fg);
  box-shadow: inset -1px 0 0 rgba(0,0,0,.06);
}

/* Sidebar Brand/Topblock */
.sidebar .p-3.border-bottom{
  border-color: rgba(255,255,255,.08) !important;
}

/* Nav-Grundlook */
.sidebar .nav{ padding: .25rem .5rem .75rem .5rem; }
.sidebar .nav-link{
  color: var(--brand-fg-muted-2);
  border-radius: .6rem;
  display: flex; align-items: center; gap: .55rem;
  padding: .45rem .6rem;
  font-weight: 600;
  line-height: 1.1;
}
.sidebar .nav-link i{ opacity: .9; }
.sidebar .nav-link:hover{
  color: var(--brand-fg);
  background: rgb(182, 2, 2);
  text-decoration: none;
}

/* Active-Stil wie früher: weißer Chip auf dunklem BG */
.sidebar .nav-link.is-active,
.sidebar .nav-link.router-link-active{
  background: #fff;
  color: var(--brand-bg);
  box-shadow: 0 1px 0 rgba(0,0,0,.05);
}

/* Header (hell, sticky) – bleibt wie neu, nur etwas „dash“-Feeling */
header.sticky-top{
  background: #fff !important;
  border-bottom: 1px solid var(--border-soft);
  backdrop-filter: saturate(180%) blur(6px);
}

/* Main Innenabstand wie altes dash-content */
main.container-fluid{ padding-left: 1rem; padding-right: 1rem; }

/* Mobile: Sidebar einklappbar – Hook bleibt fürs spätere JS */
@media (max-width: 768px){
  .d-flex > .sidebar{ position: fixed; left: 0; top: 0; transform: translateX(-100%); transition: transform .2s ease; z-index: 1050; }
  .d-flex > .sidebar.is-open{ transform: translateX(0); }
  .business-layout{ gap: 0; }
}
</style>
