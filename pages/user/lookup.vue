<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-dark bg-gradient">
    <div class="bg-white rounded-4 shadow p-4" style="width: 100%; max-width: 480px;">
      <!-- Logo -->
      <div class="text-center mb-2">
        <img src="/icons/logo-knowpass.svg" alt="Knowpass" style="height: 50px;" />
      </div>

      <!-- Titel -->
      <h1 class="text-center fw-semibold mb-1">Einloggen</h1>
      <p class="text-center text-muted mb-4">Weiter zu Knowpass</p>

      <!-- Formular -->
      <form>
        <div class="mb-3 text-start">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" id="email" class="form-control" placeholder="deine@email.de"/>
        </div>

        <div class="d-grid mb-2">
          <button type="button" class="btn btn-dark fw-semibold" @click="submit">Mit E-Mail fortfahren</button>
        </div>

        <div class="text-center mb-3">
          <a href="#" class="text-decoration-none small">
            <i class="fas fa-key me-1"></i> Mit einem Passkey anmelden
          </a>
        </div>

        <!-- Trennlinie -->
        <div class="d-flex align-items-center my-3">
          <hr class="flex-grow-1" />
          <span class="mx-2 text-muted small">oder</span>
          <hr class="flex-grow-1" />
        </div>

        <!-- Social -->
        <div class="d-flex justify-content-between gap-2 mb-4">
          <button type="button" class="btn btn-outline-secondary w-100">
            <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" style="height: 25px;" />
          </button>
          <button type="button" class="btn btn-outline-secondary w-100">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" style="height: 25px;" />
          </button>
        </div>
      </form>

      <!-- Registrierung -->
      <div class="text-center small">
        Neu bei Knowpass? <NuxtLink to="/user/register" class="text-decoration-none text-primary">Jetzt starten →</NuxtLink>
      </div>

      <!-- Footer -->
      <div class="text-center mt-4 small text-muted">
        <a href="#" class="me-2 text-decoration-none">Hilfe</a>
        <a href="#" class="me-2 text-decoration-none">Datenschutz</a>
        <a href="#" class="text-decoration-none">AGB</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

definePageMeta({ layout: 'userauthlayout' })

const email = ref('')
const error = ref('')
const loading = ref(false)

const { lookup } = useAuth()

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    const exists = await lookup(email.value)

    if (exists) {
      await navigateTo(`/user/login?email=${encodeURIComponent(email.value)}`)
    } else {
      await navigateTo(`/user/register?email=${encodeURIComponent(email.value)}`)
    }
  } catch (err) {
    error.value = err?.message || 'Ein Fehler ist aufgetreten.'
  } finally {
    loading.value = false
  }
}
</script>
