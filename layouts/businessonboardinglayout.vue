<!-- layouts/businessonboardinglayout.vue -->
<template>
  <div class="onb-layout theme-business">
    <!-- Fancy Background -->
    <div class="onb-bg">
      <div class="onb-gradient"></div>
      <div class="onb-blob onb-blob-a"></div>
      <div class="onb-blob onb-blob-b"></div>
    </div>

    <!-- Content -->
    <main class="onb-main">
      <header class="onb-head">
        <div class="brand">
          <i class="bi bi-stars"></i>
          <span>Willkommen bei Evently</span>
        </div>
        <p class="lead">Erstelle deinen Workspace in wenigen Schritten.</p>
      </header>

      <section>
        <slot />
      </section>

      <footer class="onb-foot text-center text-muted small">
        Fragen? <a href="mailto:support@example.com">support@example.com</a>
      </footer>
    </main>
  </div>
</template>

<script setup>
defineOptions({ name: 'BusinessOnboardingLayout' })
</script>

<style>
/* ==========================================================================
   THEME-TOKENS (aus businesslayout übernommen – konsistent!)
   ========================================================================== */
.onb-layout.theme-business {
  --biz-brand-primary:   #0d6efd;
  --biz-brand-primary-10: rgba(13,110,253,.10);
  --biz-brand-secondary: #6c757d;
  --biz-brand-success:   #2fb67c;
  --biz-brand-warning:   #ffcf5c;
  --biz-brand-danger:    #dc3545;
  --biz-brand-info:      #0dcaf0;

  --biz-ink-900: #1f2630;
  --biz-ink-700: #525f74;
  --biz-ink-500: #8792a2;

  --biz-surface: #ffffff;
  --biz-page-bg: #fbfcff;

  --biz-radius-sm: .5rem;
  --biz-radius: .75rem;
  --biz-radius-lg: 1rem;
  --biz-shadow-sm: 0 6px 16px rgba(0,0,0,.06);
  --biz-shadow-md: 0 10px 26px rgba(0,0,0,.08);
  --biz-border: #e6e9ef;

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
   LAYOUT
   ========================================================================== */
.onb-layout {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  isolation: isolate;
}

.onb-main {
  position: relative;
  z-index: 1;
  width: min(1080px, 100%);
  padding: clamp(16px, 4vw, 32px);
  display: grid;
  gap: 16px;
  grid-template-rows: auto 1fr auto;
}

/* ==========================================================================
   FANCY BACKGROUND (Gradient + soft blobs)
   ========================================================================== */
.onb-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.onb-gradient {
  position: absolute; inset: 0;
  background:
    radial-gradient(1200px 800px at 85% -10%, rgba(13,110,253,.15), transparent 60%),
    radial-gradient(1100px 680px at -5% 110%, rgba(47,182,124,.16), transparent 55%),
    linear-gradient(180deg, #f8fbff 0%, #f6f8fc 40%, #f5f7fb 100%);
  filter: saturate(108%);
}

/* sanft animierte farbige „Blobs“ */
.onb-blob {
  position: absolute;
  width: 44vmax; height: 44vmax;
  border-radius: 50%;
  opacity: .27;
  mix-blend-mode: multiply;
  filter: blur(40px) saturate(120%);
  animation: float 16s ease-in-out infinite;
}
.onb-blob-a {
  background: radial-gradient(circle at 30% 30%, rgba(13,110,253,.5), rgba(13,110,253,.1) 60%, transparent 70%);
  top: -10vmax; right: -6vmax;
  animation-delay: 0s;
}
.onb-blob-b {
  background: radial-gradient(circle at 70% 70%, rgba(32,201,151,.5), rgba(32,201,151,.1) 60%, transparent 70%);
  bottom: -12vmax; left: -10vmax;
  animation-delay: 4s;
}
@keyframes float {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50%      { transform: translate3d(2%, -2%, 0) scale(1.05); }
}

/* ==========================================================================
   HEADER
   ========================================================================== */
.onb-head {
  text-align: center;
  margin-bottom: .25rem;
}
.onb-head .brand {
  display: inline-flex; gap: .6rem; align-items: center;
  padding: .45rem .8rem;
  border-radius: 999px;
  background: rgba(255,255,255,.65);
  border: 1px solid color-mix(in oklab, var(--biz-border), white 35%);
  backdrop-filter: blur(3px);
  color: var(--biz-ink-700);
  font-weight: 700;
}
.onb-head .brand i { font-size: 1.1rem; color: var(--biz-brand-primary); }
.onb-head .lead {
  margin: .75rem auto 0;
  max-width: 720px;
  color: var(--biz-ink-700);
}

/* ==========================================================================
   CARD
   ========================================================================== */
.onb-card {
  border-radius: 1rem;
  border: 1px solid color-mix(in oklab, var(--biz-border), white 10%);
  background:
    linear-gradient(180deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.9) 100%);
  backdrop-filter: saturate(160%) blur(6px);
}

/* ==========================================================================
   FOOTER
   ========================================================================== */
.onb-foot a { text-decoration: none; }
.onb-foot a:hover { text-decoration: underline; }

/* ==========================================================================
   GLOBAL COMPONENT STYLING (wie Business-Layout)
   ========================================================================== */
.theme-business .card{
  border: 1px solid var(--biz-border);
  border-radius: var(--biz-radius);
  background: var(--biz-surface);
}
.theme-business .card-header{
  background: #fff; border-bottom: 1px solid var(--biz-border);
  font-weight: 600; color: var(--biz-ink-700);
}
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
  --bs-btn-color: var(--biz-ink-700);
  --bs-btn-border-color: var(--biz-border);
  --bs-btn-hover-bg: color-mix(in oklab, #ffffff 85%, var(--biz-border) 15%);
  --bs-btn-hover-color: var(--biz-ink-900);
  --bs-btn-hover-border-color: color-mix(in oklab, var(--biz-border), black 12%);
  --bs-btn-active-bg: color-mix(in oklab, #ffffff 80%, var(--biz-border) 20%);
  --bs-btn-active-color: var(--biz-ink-900);
  --bs-btn-active-border-color: color-mix(in oklab, var(--biz-border), black 16%);
  --bs-btn-focus-shadow-rgb: 13,110,253;
  border-radius: .65rem;
}
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
.theme-business .badge.bg-light{
  color: var(--biz-ink-700) !important;
  border: 1px solid var(--biz-border);
}
</style>
