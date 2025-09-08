<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-dark bg-gradient">
    <div class="bg-white rounded-4 shadow p-4" style="width: 100%; max-width: 480px;">
      <!-- Logo -->
      <div class="text-center mb-2">
        <img src="/icons/logo-knowpass.svg" alt="Knowpass" style="height: 50px;" />
      </div>

      <!-- Titel -->
      <h1 class="text-center fw-semibold mb-1">Passwort eingeben</h1>
      <p class="text-center text-muted mb-4">Weiter zu KnowPass <strong>{{ email }}</strong></p>

      <!-- Formular -->
      <form @submit.prevent="submit">
        <div class="mb-3 text-start">
          <div class="mb-3 text-start position-relative">
            <label class="form-label">E-Mail-Adresse</label>

            <input
              type="email"
              class="form-control pe-5"
              :value="email"
              disabled
              style="height: 40px;"
            />

            <NuxtLink
              to="/user/lookup"
              class="position-absolute text-primary text-decoration-none small"
              style="
                right: 12px;
                bottom: 12px;
                pointer-events: auto;
                background: transparent;
              "
            >
              E-Mail-Adresse ändern
            </NuxtLink>
          </div>


          <label for="password" class="form-label">Passwort</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
            placeholder="password"
          />
        </div>

        <!-- Fehleranzeige -->
        <div v-if="error" class="alert alert-danger py-2 small mb-3 text-center">
          {{ error }}
        </div>

        <!-- Button -->
        <div class="d-grid mb-3">
          <button class="btn btn-dark fw-semibold" :disabled="loading">
            {{ loading ? 'Einloggen…' : 'Einloggen' }}
          </button>
        </div>
      </form>

      <div class="text-center small">
        <NuxtLink to="/user/lookup" class="text-decoration-none text-muted">
          Mit anderer E-Mail anmelden
        </NuxtLink>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

definePageMeta({ layout: 'userauthlayout' })

const route = useRoute()
const router = useRouter()
const email = route.query.email || ''

if (!email) {
  //router.replace('/user/lookup')
}

const password = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useAuth()

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    await login({ email: email, password: password.value })
    console.log('Login erfolgreich')
    await router.push('/dashboard')
  } catch (err) {
    error.value = err?.message || 'Login fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}
</script>
