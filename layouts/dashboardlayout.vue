<template>
  <div class="dash-layout">
    <aside class="dash-aside">
      <div class="brand">🎫 Evently24 Business</div>
      <nav class="nav flex-column">
        <NuxtLink to="/dashboard" class="nav-link"><i class="bi bi-speedometer2"></i> Übersicht</NuxtLink>
        <NuxtLink to="/dashboard/tours" class="nav-link"><i class="bi bi-music-note-beamed"></i> Touren</NuxtLink>
        <NuxtLink to="/dashboard/events" class="nav-link"><i class="bi bi-calendar3"></i> Events</NuxtLink>
        <NuxtLink to="/dashboard/seating" class="nav-link"><i class="bi bi-calendar3"></i> Sitzplan</NuxtLink>
        <NuxtLink to="/dashboard/orders" class="nav-link disabled"><i class="bi bi-bag"></i> Bestellungen</NuxtLink>
        <NuxtLink to="/dashboard/settings" class="nav-link disabled"><i class="bi bi-gear"></i> Einstellungen</NuxtLink>
      </nav>
    </aside>
    <main class="dash-main">
      <header class="dash-header">
        <div class="title"><slot name="title">Dashboard</slot></div>
        <div class="actions"><slot name="actions"></slot></div>
      </header>
      <div class="dash-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dash-layout{ display:grid; grid-template-columns: 260px 1fr; min-height:100vh; }
.dash-aside{ background:#0d1b2a; color:#fff; padding:1rem; }
.brand{ font-weight:800; letter-spacing:.5px; margin-bottom:1rem; }
.nav-link{ color:#cbd5e1; padding:.5rem .75rem; border-radius:.35rem; display:flex; gap:.5rem; align-items:center; }
.nav-link:hover, .router-link-active{ background:rgba(255,255,255,.08); color:#fff; }
.nav-link.disabled{ opacity:.5; pointer-events:none; }
.dash-main{ background:#f8fafc; }
.dash-header{ position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:1rem; background:#fff; border-bottom:1px solid #e5e7eb; }
.dash-content{ padding:1rem; }
@media (max-width: 991.98px){ .dash-layout{ grid-template-columns: 1fr; } .dash-aside{ display:none; } }
</style>
