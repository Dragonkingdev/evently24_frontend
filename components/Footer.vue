<template>
  <footer>
    <div class="container-fluid d-flex flex-wrap justify-content-between align-items-start rounded-4 p-4 footer-main">

      <!-- Logo & Social -->
      <div class="mb-4" style="flex: 1 1 200px;">
        <img src="/icons/logo-knowpass.svg" alt="COUPERET Logo" style="height: 80px; margin-bottom: 1.5rem;">
        <button class="btn btn-link text-decoration-none" @click="toggle" :title="theme==='dark'?'Helles Theme':'Dunkles Theme'">
          <i class="bi" :class="theme==='dark' ? 'bi-sun' : 'bi-moon'"></i>
        </button>
        <div class="d-flex gap-3 mb-4">
          <a href="#"><i class="bi bi-linkedin fs-5 social-icon"></i></a>
          <a href="#"><i class="bi bi-facebook fs-5 social-icon"></i></a>
          <a href="#"><i class="bi bi-instagram fs-5 social-icon"></i></a>
          <a href="#"><i class="bi bi-xing fs-5 social-icon"></i></a>
        </div>
      </div>

      <!-- Links -->
      <div class="mb-4" style="flex: 1 1 150px;">
        <h6 class="fw-bold text-black fs-5 mb-3">Links</h6>
        <ul class="list-unstyled small footer-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#funktion">Funktionen</a></li>
          <li><a href="#preise">Preise</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>

      <!-- Kontakt -->
      <div class="mb-4" style="flex: 1 1 200px;">
        <h6 class="fw-bold text-black fs-5 mb-3">Kontakt</h6>
        <p class="mb-2 small">Musterweg 10<br>99999 Musterstadt</p>
        <p class="mb-2 small"><i class="bi bi-telephone me-2"></i>+49 123456789</p>
        <p class="mb-0 small"><i class="bi bi-envelope me-2"></i>contact@couperet.de</p>
      </div>

      <!-- Rechtliches -->
      <div class="mb-4" style="flex: 1 1 150px;">
        <h6 class="fw-bold text-black fs-5 mb-3">Rechtliches</h6>
        <ul class="list-unstyled small footer-links">
          <li><a href="#">Impressum</a></li>
          <li><a href="#">Datenschutzerklärung</a></li>
          <li><a href="#">AGB</a></li>
        </ul>
      </div>
    </div>

    <!-- Sprache und Cookies -->
    <div class="d-flex justify-content-between align-items-center mt-4 px-4 small-muted">
      <div>
        <img src="https://flagcdn.com/de.svg" width="24" alt="DE" class="me-2"> DE
      </div>
      <div>
        <button class="btn btn-outline-light btn-sm rounded-pill">Cookie-Einstellungen</button>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { theme, toggle } = useTheme()
</script>

<style scoped>
footer {
  padding: 30px 0 10px 0;
  color: #f5f5f7;
  border-top: 2px solid #e10600;
}

.footer-main {
  background: rgba(255, 255, 255, 0.03);
}

.footer-links a {
  color: #949495;
  text-decoration: none;
}
.footer-links a:hover {
  color: #e10600;
}

.social-icon {
  color: #f5f5f7;
  opacity: 0.8;
  transition: color 0.2s, transform 0.2s;
}
.social-icon:hover {
  color: #e10600;
  transform: scale(1.1);
}

.btn-accent {
  background: #e10600;
  color: #fff;
  border: none;
}
.btn-accent:hover {
  filter: brightness(1.1);
}

.small-muted {
  color: #aaa;
}
</style>
