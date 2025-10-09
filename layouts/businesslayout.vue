<!-- layouts/businesslayout.vue -->
<template>
  <div class="business-layout theme-business d-flex">
    <!-- Deine bestehende Sidebar / Navbar bleiben unverändert nutzbar -->
    <BusinessSidebar class="sidebar" :class="{ 'is-open': sidebarOpen }" @close="sidebarOpen = false" />
    <div class="flex-grow-1 main-wrap">
      <BusinessNavbar @toggle-sidebar="toggleSidebar" />
      <!-- 👇 EINZIGER Scroll-Container -->
      <main class="page-main container-fluid py-4">
        <slot />
      </main>
    </div>

    <!-- Mobile Backdrop -->
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
/* ==========================================================================
   THEME-TOKENS (nur dieses Layout)
   Passe NUR diese Vars an deine CI an — Bootstrap 5 liest viele davon direkt.
   ========================================================================== */
.business-layout.theme-business {
  /* Brand */
  --biz-brand-primary:   #0d6efd;
  --biz-brand-primary-10: rgba(13,110,253,.10);
  --biz-brand-secondary: #6c757d;
  --biz-brand-success:   #2fb67c;
  --biz-brand-warning:   #ffcf5c;
  --biz-brand-danger:    #dc3545;
  --biz-brand-info:      #0dcaf0;

  /* Ink & Surface */
  --biz-ink-900: #1f2630;
  --biz-ink-700: #525f74;
  --biz-ink-500: #8792a2;
  --biz-surface: #ffffff;
  --biz-page-bg: #fff;

  /* Radii / Shadow / Border */
  --biz-radius-sm: .5rem;
  --biz-radius: .75rem;
  --biz-radius-lg: 1rem;
  --biz-shadow-sm: 0 6px 16px rgba(0,0,0,.06);
  --biz-shadow-md: 0 10px 26px rgba(0,0,0,.08);
  --biz-border: #e6e9ef;

  /* Sidebar */
  --biz-sidebar-w: 270px;
  --biz-sidebar-bg: #0d1b2a;
  --biz-sidebar-fg: #ffffff;
  --biz-sidebar-fg-2: #c9d3de;

  /* Bootstrap CSS Vars Mapping (sanft) */
  --bs-body-bg: var(--biz-page-bg);
  --bs-body-color: var(--biz-ink-900);
  --bs-primary: var(--biz-brand-primary);
  --bs-secondary: var(--biz-brand-secondary);
  --bs-success: var(--biz-brand-success);
  --bs-warning: var(--biz-brand-warning);
  --bs-danger: var(--biz-brand-danger);
  --bs-info: var(--biz-brand-info);
  --bs-border-color: var(--biz-border);
  --bs-link-color: var(--biz-brand-primary);
  --bs-border-radius: var(--biz-radius);
  --bs-border-radius-sm: var(--biz-radius-sm);
  --bs-border-radius-lg: var(--biz-radius-lg);
}

/* ==========================================================================
   LAYOUT-STRUKTUR (Scroll nur im Main, Sidebar fix)
   ========================================================================== */
html, body, #__nuxt { height: 100%; }
.business-layout { height: 100vh; min-height: 100vh; }

.main-wrap{
  background: var(--biz-page-bg);
  display: flex; flex-direction: column; min-width: 0; height: 100vh;
}
.page-main{ flex: 1 1 auto; overflow: auto; min-height: 0; padding-left: 1rem; padding-right: 1rem; }

/* Sidebar fix links, volle Höhe */
.business-layout .sidebar{
  position: fixed; left: 0; top: 0; width: var(--biz-sidebar-w); height: 100vh;
  background: var(--biz-sidebar-bg); color: var(--biz-sidebar-fg);
  box-shadow: inset -1px 0 0 rgba(0,0,0,.06); overflow: hidden; z-index: 1050;
}
@media (min-width: 768px){
  .main-wrap{ margin-left: var(--biz-sidebar-w); }
}
@media (max-width: 767.98px){
  .business-layout .sidebar{
    transform: translateX(-100%); transition: transform .2s ease;
  }
  .business-layout .sidebar.is-open{ transform: translateX(0); }
}

/* ==========================================================================
   GLOBAL COMPONENT STYLING (Cards, Inputs, Buttons, Badges, Tabs, Tables, Alerts, Modals)
   Schlank, bootstrap-konform, CI-able.
   ========================================================================== */

/* Cards */
.theme-business .card{
  border: 1px solid var(--biz-border);
  border-radius: var(--biz-radius);
  background: var(--biz-surface);
  box-shadow: 0 0 0 rgba(0,0,0,0);
  transition: box-shadow .12s ease, transform .12s ease, border-color .12s ease;
}
.theme-business .card:hover{ 
  /*box-shadow: var(--biz-shadow-sm); */
}
.theme-business .card-header{
  background: #fff; border-bottom: 1px solid var(--biz-border);
  font-weight: 600; color: var(--biz-ink-700);
}
.theme-business .card-footer{
  background: #fff; border-top: 1px solid var(--biz-border);
}

/* Buttons */
.theme-business .btn-primary{
  --bs-btn-bg: var(--biz-brand-primary);
  --bs-btn-border-color: var(--biz-brand-primary);
  --bs-btn-hover-bg: color-mix(in oklab, var(--biz-brand-primary), black 7%);
  --bs-btn-hover-border-color: color-mix(in oklab, var(--biz-brand-primary), black 7%);
  --bs-btn-active-bg: color-mix(in oklab, var(--biz-brand-primary), black 12%);
  --bs-btn-active-border-color: color-mix(in oklab, var(--biz-brand-primary), black 12%);
  border-radius: .65rem;
}
.theme-business .btn-outline-secondary{
  /* Base */
  --bs-btn-color: var(--biz-ink-700);
  --bs-btn-border-color: var(--biz-border);

  /* Hover */
  --bs-btn-hover-bg: color-mix(in oklab, #ffffff 85%, var(--biz-border) 15%); /* zartes Tint */
  --bs-btn-hover-color: var(--biz-ink-900);                                   /* gut lesbar */
  --bs-btn-hover-border-color: color-mix(in oklab, var(--biz-border), black 12%);

  /* Active (pressed) */
  --bs-btn-active-bg: color-mix(in oklab, #ffffff 80%, var(--biz-border) 20%);
  --bs-btn-active-color: var(--biz-ink-900);
  --bs-btn-active-border-color: color-mix(in oklab, var(--biz-border), black 16%);

  /* Focus-Ring leicht in CI-Farbe (optional) */
  --bs-btn-focus-shadow-rgb: 13,110,253; /* = #0d6efd */

  border-radius: .65rem;
}
.theme-business .btn{
  box-shadow: 0 0 0 rgba(0,0,0,0);
  transition: transform .08s ease, box-shadow .12s ease;
}
.theme-business .btn:active{ transform: translateY(1px); }

/* Form Controls */
.theme-business .form-control,
.theme-business .form-select,
.theme-business .input-group-text{
  border-radius: .65rem;
  border-color: var(--biz-border);
}
.theme-business .form-control:focus,
.theme-business .form-select:focus{
  border-color: color-mix(in oklab, var(--biz-brand-primary), white 70%);
  box-shadow: 0 0 0 .2rem color-mix(in oklab, var(--biz-brand-primary), white 85%);
}
.theme-business .form-text{ color: var(--biz-ink-500); }

/* Badges */
.theme-business .badge.bg-light{
  color: var(--biz-ink-700) !important;
  border: 1px solid var(--biz-border);
}

/* Nav Tabs */
.theme-business .nav-tabs .nav-link{
  border: 1px solid transparent;
  color: var(--biz-ink-700);
  border-top-left-radius: .6rem; border-top-right-radius: .6rem;
}
.theme-business .nav-tabs .nav-link:hover{ color: var(--biz-ink-900); }
.theme-business .nav-tabs .nav-link.active{
  color: var(--biz-ink-900);
  border-color: var(--biz-border) var(--biz-border) #fff;
  background: #fff;
}

/* Tables */
.theme-business .table{
  --bs-table-bg: transparent;
  --bs-table-striped-bg: #fafbfd;
  --bs-table-hover-bg: #f4f6fb;
  color: var(--biz-ink-900);
}
.theme-business .table thead th{ font-weight: 600; color: var(--biz-ink-700); }
.theme-business .table thead{ border-bottom: 1px solid var(--biz-border); }
.theme-business .table tbody tr + tr{ border-top: 1px solid #f0f2f6; }

/* Alerts */
.theme-business .alert{
  border-radius: .75rem;
  border-color: color-mix(in oklab, var(--biz-border), black 4%);
}

/* Modals */
.theme-business .modal-content{
  border-radius: var(--biz-radius-lg);
  box-shadow: var(--biz-shadow-md);
  border: 1px solid var(--biz-border);
}

/* Header sticky (falls Navbar sticky-top nutzt) */
.theme-business header.sticky-top{
  background: #fff !important;
  border-bottom: 1px solid var(--biz-border);
  backdrop-filter: saturate(180%) blur(6px);
}

/* ==========================================================================
   UX UTILITIES – klein & wiederverwendbar
   ========================================================================== */

/* Soft Tile (z.B. für Listing/Seatmap Mini-Karten) */
.theme-business .ev-tile{
  display:flex; gap:.85rem; padding:.9rem 1rem;
  border:1px solid var(--biz-border); border-radius:.8rem;
  background: linear-gradient(180deg, #fff, #fbfcff);
  transition: box-shadow .15s ease, transform .15s ease;
}
.theme-business .ev-tile:hover{ box-shadow: var(--biz-shadow-sm); transform: translateY(-1px); }
.theme-business .ev-tile-icon{
  width:42px; height:42px; border-radius:.75rem; display:grid; place-items:center;
  background: var(--biz-brand-primary-10); color: var(--biz-brand-primary);
}
.theme-business .ev-tile-label{ font-size:.85rem; color: var(--biz-ink-700); font-weight:600; }
.theme-business .ev-tile-value{ font-weight:600; color: var(--biz-ink-900); }

/* Key/Value Zeilen */
.theme-business .kv{
  display:grid; grid-template-columns: 160px 1fr; gap:.5rem .75rem; align-items:start;
}
.theme-business .kv-label{ color: var(--biz-ink-700); font-weight:600; }
.theme-business .kv-value{ color: var(--biz-ink-900); }
@media (max-width: 575.98px){
  .theme-business .kv{ grid-template-columns: 1fr; }
}

/* Skeletons (leicht) */
.theme-business .skeleton{
  display:block; height:12px; border-radius: 8px;
  background: linear-gradient(90deg,#f2f4f8 0%,#e9edf3 50%,#f2f4f8 100%);
  background-size: 200% 100%; animation: biz-sk 1.2s infinite;
}
.theme-business .sk-title{ height:22px; width:60%; }
.theme-business .sk-line{ height:12px; width:90%; }
.theme-business .sk-chip{ height:28px; width:70%; border-radius:999px; }
@keyframes biz-sk { from{background-position:200% 0} to{background-position:-200% 0} }

/* ==========================================================================
   SIDEBAR NAV (kleine Kosmetik, lässt Bootstrap Utilities intakt)
   ========================================================================== */
.business-layout .sidebar .nav-link{
  color: var(--biz-sidebar-fg-2);
  border-radius: .6rem;
  display:flex; align-items:center; gap:.55rem;
  padding:.45rem .6rem; font-weight:600; line-height:1.1;
}
.business-layout .sidebar .nav-link:hover{
  color: var(--biz-sidebar-bg);
  background: rgba(255,255,255,.08);
  text-decoration: none;
}
.business-layout .sidebar .nav-link.is-active,
.business-layout .sidebar .nav-link.router-link-active{
  background: #fff; color: var(--biz-sidebar-bg);
  box-shadow: 0 1px 0 rgba(0,0,0,.05);
}
</style>
