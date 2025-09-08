<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <div class="d-flex flex-column min-vh-100">
    <Navbar/>
    <main class="flex-fill">
      <slot />
    </main>
    <Footer/>
  </div>
</template>


<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
</script>

<style>
/* Global theme tokens */
html[data-theme="light"]{
  color-scheme: light;
  --brand:#2563eb;
  --brand-2:#60a5fa;
  --bg:#f8fafc;         /* page background */
  --surface:#ffffff;    /* cards/nav */
  --text:#0f172a;       /* primary text */
  --muted:#64748b;      /* secondary text */
  --ring:#cbd5e1;
  --shadow:0 .5rem 1rem rgba(0,0,0,.08);
}
html[data-theme="dark"]{
  color-scheme: dark;
  --brand:#3b82f6;
  --brand-2:#60a5fa;
  --bg:#0b1220;
  --surface:#0f172a;
  --text:#e5e7eb;
  --muted:#94a3b8;
  --ring:#1f2937;
  --shadow:0 .5rem 1rem rgba(0,0,0,.3);
}

/* default to light if not set */
:root{ color-scheme: light; }
html,body{ background:var(--bg); color:var(--text); }
a{ color: var(--brand); }
p{ color: var(--text); }

.card{ border:0; border-radius:1.25rem; box-shadow: var(--shadow); background: var(--surface); }
.btn-primary{ background:var(--brand); border-color:var(--brand); }
.btn-outline-primary{ color:var(--brand); border-color:var(--brand); }
.badge-soft{ background: color-mix(in oklab, var(--brand) 10%, transparent); color: var(--brand); }
.form-control, .form-select, .input-group-text{ background:var(--surface); color:var(--text); border-color:var(--ring); }
.form-control::placeholder{ color: var(--muted); }

/* Gradient-Text */
.gradient-text{
  background: linear-gradient(90deg, var(--brand), var(--brand-2));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}

/* Rows like Netflix */
.row-scroll{ overflow-x:auto; overflow-y:hidden; white-space:nowrap; }
.row-scroll .row-inner{ display:flex; gap:1rem; padding-bottom:.5rem; }
.card-hover{ transition: transform .15s ease, box-shadow .15s ease; }
.card-hover:hover{ transform: translateY(-3px); box-shadow:0 .75rem 1.5rem rgba(0,0,0,.15); }

/* Navbar layout */
.nav-shell{ background:var(--surface); border-bottom:1px solid var(--ring); position:sticky; top:0; z-index:1030; }
.nav-shell .container{ display:flex; align-items:center; height:64px; gap:1rem; }
.nav-logo{ font-weight:800; letter-spacing:.3px; color:var(--text); text-decoration:none; }
.nav-center{ flex:1 1 auto; display:flex; justify-content:center; }
.nav-actions{ display:flex; align-items:center; gap:.25rem; }

/* Search */
.search-wrap-desktop{ width:min(720px, 90%); }
.search-input{ border-radius:999px; padding-left:2.5rem; height:44px; }
.search-icon{ position:absolute; left:.75rem; top:50%; transform:translateY(-50%); color:var(--muted); }

/* Mobile behavior */
@media (max-width: 991.98px){
  .nav-center{ justify-content:center; }
  .search-desktop{ display:none; }
  .search-mobile{ display:block; }
  .nav-shell .container{ height:56px; }
}
@media (min-width: 992px){
  .search-mobile{ display:none; }
}

/* Hero & sections */
.hero{ background:var(--surface); border-bottom:1px solid var(--ring); }
.hero .poster{ border-radius:1.25rem; background-size:cover; background-position:center; min-height:220px; }

.minw-18{ min-width: 18rem; }
.small-muted{ color:var(--muted); font-size:.9rem; }

/* Footer */
footer{ background: var(--surface); }

/* Bootstrap Erweiterung */
.container-fluid {

}
</style>