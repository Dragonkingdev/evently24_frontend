<template>
  <footer class="footer py-5">
    <div class="container-fluid container-xxl">
      <div class="row g-4">
        <div class="col-md-4">
          <h5 class="text-white">Fountain</h5>
          <p class="small">Die Plattform für regionale Events, Festivals & Tickets. Für Städte, Locations, Artists & Fans.</p>
        </div>
        <div class="col-md-2">
          <div class="small text-uppercase text-secondary mb-2">Plattform</div>
          <ul class="list-unstyled small">
            <li><NuxtLink to="#">Über uns</NuxtLink></li>
            <li><NuxtLink to="#">Preise</NuxtLink></li>
            <li><NuxtLink to="#">Für Veranstalter</NuxtLink></li>
          </ul>
        </div>
        <div class="col-md-2">
          <div class="small text-uppercase text-secondary mb-2">Rechtliches</div>
          <ul class="list-unstyled small">
            <li><NuxtLink to="#">Impressum</NuxtLink></li>
            <li><NuxtLink to="#">Datenschutz</NuxtLink></li>
            <li><NuxtLink to="#">AGB</NuxtLink></li>
          </ul>
        </div>
        <div class="col-md-4">
          <div class="small text-uppercase text-secondary mb-2">App</div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm"><i class="bi bi-apple"></i> App Store</button>
            <button class="btn btn-outline-light btn-sm"><i class="bi bi-google-play"></i> Google Play</button>
          </div>
        </div>
      </div>
      <div class="border-top border-secondary mt-4 pt-3 small d-flex justify-content-between">
        <span>© 2025 Fountain</span>
        <span>Made with ♥ for lokale Kultur</span>
      </div>
    </div>
  </footer>
</template>

<style>
.footer{background:#0b1220; color:#cdd5e0;}
.footer a{color:#cdd5e0; text-decoration:none;}
.footer a:hover{color:#fff;}
</style>