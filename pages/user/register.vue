<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-dark bg-gradient">
    <div class="bg-white rounded-4 shadow p-4" style="width: 100%; max-width: 480px;">
      <!-- Logo -->
      <div class="text-center mb-2">
        <img src="/icons/logo-knowpass.svg" alt="Knowpass" style="height: 50px;" />
      </div>

      <!-- Titel -->
      <h3 class="fw-semibold text-center">Ein Knowpass-Konto erstellen</h3>
      <p class="text-center text-muted mb-4">
        Noch ein letzter Schritt, bevor du deinen digitalen Produktpass verwalten kannst.
      </p>

      <form @submit.prevent="submit">
        <!-- E-Mail -->
        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input v-model="email" type="email" id="email" class="form-control" />
        </div>

        <!-- Vorname & Nachname -->
        <div class="row g-2 mb-2">
          <div class="col">
            <label class="form-label">Vorname</label>
            <input v-model="firstName" type="text" class="form-control" />
          </div>
          <div class="col">
            <label class="form-label">Nachname</label>
            <input v-model="lastName" type="text" class="form-control" />
          </div>
        </div>
        <p class="text-muted small mb-3">
          Gib deinen Vor- und Nachnamen ein, wie er auf deinem Ausweis steht.
        </p>

        <!-- Passwort -->
        <div class="mb-3">
          <label class="form-label">Passwort</label>
          <input v-model="password" type="password" class="form-control" />
        </div>

        <!-- Passwort bestätigen -->
        <div class="mb-3">
          <label class="form-label">Neues Passwort bestätigen</label>
          <input v-model="passwordConfirm" type="password" class="form-control" />
        </div>

        <!-- Fehler -->
        <div v-if="passwordsDontMatch" class="text-danger small mb-2">
          Die Passwörter stimmen nicht überein.
        </div>
        <div v-if="error" class="alert alert-danger py-2 small mb-2 text-center">
          {{ error }}
        </div>

        <!-- Button -->
        <div class="d-grid mb-3">
          <button class="btn btn-secondary" :disabled="!canSubmit || loading">
            {{ loading ? 'Erstelle Konto…' : 'Knowpass-Konto erstellen' }}
          </button>
        </div>
      </form>

      <!-- Login-Link -->
      <div class="text-center small mb-3">
        Hast du bereits ein Knowpass-Konto?
        <NuxtLink to="/user/login" class="text-decoration-none text-primary">Anmelden →</NuxtLink>
      </div>

      <!-- Rechtliches -->
      <p class="text-muted small text-center">
        Indem du fortfährst, stimmst du den
        <a href="#" class="text-decoration-none text-primary">Geschäftsbedingungen</a> und der
        <a href="#" class="text-decoration-none text-primary">Datenschutzerklärung</a> zu.
      </p>

      <div class="text-center mt-3 small text-muted">
        <a href="#" class="me-2 text-decoration-none">Hilfe</a>
        <a href="#" class="me-2 text-decoration-none">Datenschutz</a>
        <a href="#" class="text-decoration-none">AGB</a>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useAuth } from '@/composables/useAuth'
import { ref, computed } from 'vue'

definePageMeta({ layout: 'userauthlayout' })

const route = useRoute()
const email = ref(route.query.email || '')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

const { register } = useAuth()

// Prüfen ob Passwörter übereinstimmen
const passwordsDontMatch = computed(() => password.value !== passwordConfirm.value && passwordConfirm.value.length > 0)

// Button nur aktivieren wenn alles passt
const canSubmit = computed(() =>
  email.value &&
  firstName.value &&
  lastName.value &&
  password.value &&
  passwordConfirm.value &&
  !passwordsDontMatch.value
)

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    await register({ email: email.value, password: password.value })
    await navigateTo('/dashboard')
  } catch (err) {
    error.value = err?.message || 'Registrierung fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}

</script>
