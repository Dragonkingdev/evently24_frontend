<!-- components/sections/NewsletterLite.vue -->
<template>
  <section class="newsletter">
    <div class="container">
      <div class="left">
        <h3>Nie wieder Highlights verpassen</h3>
        <p>Wähle Stadt & Genres – wir schicken dir personalisierte Empfehlungen.</p>
      </div>
      <form class="right" @submit.prevent>
        <input type="email" placeholder="Deine E-Mail" />
        <button type="submit"><i class="bi bi-send"></i> Anmelden</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.newsletter{ background:#f8faff; padding:1.25rem 0; }
.container{ width:min(1200px, 94vw); margin:0 auto; display:grid; grid-template-columns: 1fr 1fr; gap:1rem; align-items:center; }
@media (max-width: 992px){ .container{ grid-template-columns: 1fr; } }
.left p{ color:#64748b; margin:.25rem 0 0; }
.right{ display:flex; gap:.5rem; }
.right input{ flex:1; border:1px solid #e5e7eb; border-radius:10px; padding:.6rem .8rem; }
.right button{ border:0; border-radius:10px; padding:.6rem .9rem; background:#5b7cfa; color:#fff; font-weight:800; }
</style>
