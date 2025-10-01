<!-- layouts/businesslayout.vue -->
<template>
  <div class="business-layout d-flex">
    <BusinessSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex-grow-1 main-wrap">
      <BusinessNavbar @toggle-sidebar="toggleSidebar" />
      <!-- 👇 eigener Scroll-Container -->
      <main class="page-main container-fluid py-4">
        <slot />
      </main>
    </div>

    <!-- Mobile-Backdrop -->
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
.business-layout{
  /* fix auf Viewport-Höhe, damit nur .page-main scrollt */
  height: 100vh;
  min-height: 100vh;
}
.main-wrap{
  background: var(--main-bg);
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;           /* wichtig für internen Scroll der page-main */
}

/* 👇 Der Main-Bereich ist der Scroll-Container */
.page-main{
  flex: 1 1 auto;
  overflow: auto;
  min-height: 0;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Sidebar: fix links, volle Höhe, NICHT scrollbar */
.d-flex > .sidebar{
  position: fixed;
  left: 0; top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--brand-bg);
  color: var(--brand-fg);
  box-shadow: inset -1px 0 0 rgba(0,0,0,.06);
  overflow: hidden;        /* keine eigene Scrollbar */
  z-index: 1050;           /* unter Header-Dropdowns okay */
}

/* Main nach rechts schieben (nur ≥ md) */
@media (min-width: 768px){
  .main-wrap{ margin-left: var(--sidebar-width); }
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

/* Active-Stil */
.sidebar .nav-link.is-active,
.sidebar .nav-link.router-link-active{
  background: #fff;
  color: var(--brand-bg);
  box-shadow: 0 1px 0 rgba(0,0,0,.05);
}

/* Header (hell, „sticky“) – bleibt sichtbar, da nur page-main scrollt */
header.sticky-top{
  background: #fff !important;
  border-bottom: 1px solid var(--border-soft);
  backdrop-filter: saturate(180%) blur(6px);
}

/* Main Innenabstand wie altes dash-content */
main.container-fluid{ padding-left: 1rem; padding-right: 1rem; }

/* Mobile: Sidebar als Offcanvas (ein-/ausfahren) */
@media (max-width: 768px){
  .main-wrap{ margin-left: 0; } /* nicht nach rechts schieben */
  .d-flex > .sidebar{
    transform: translateX(-100%);
    transition: transform .2s ease;
  }
  .d-flex > .sidebar.is-open{
    transform: translateX(0);
  }
  .business-layout{ gap: 0; }
}
</style>
