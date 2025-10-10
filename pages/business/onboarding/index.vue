<!--pages/business/onboarding/index.vue-->
<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Workspace anlegen</h3>
      <NuxtLink to="/business/dashboard" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-x-lg me-1"></i> Abbrechen
      </NuxtLink>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-8">
        <WorkspaceOnboardingForm
          :submitting="submitting"
          :error-msg="errorMsg"
          :error-fields="errorFields"
          @submit="onSubmit"
        />
      </div>

      <div class="col-12 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-2">Was passiert hier?</h5>
            <ul class="small mb-0 ps-3">
              <li>Du legst nur den <strong>Workspace (Unternehmen)</strong> an.</li>
              <li>Locations, Events, Artists &amp; Team folgen später.</li>
              <li>Zeitzone, Währung &amp; Sprache als Grundeinstellung.</li>
            </ul>
            <hr>
            <div class="small text-muted">
              Weitere Workspaces kannst du jederzeit anlegen und Mitglieder einladen.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="successId" class="alert alert-success mt-4">
      <i class="bi bi-check2-circle me-1"></i>
      Workspace erstellt. Weiterleitung…
    </div>
  </div>
</template>

<script setup>
import WorkspaceOnboardingForm from '~/components/business/onboarding/WorkspaceOnboardingForm.vue'

const { create, setCurrent, parseApiError } = useWorkspaceApi()

const submitting   = ref(false)
const errorMsg     = ref('')
const errorFields  = ref([])
const successId    = ref(null)

async function onSubmit (payload) {
  errorMsg.value = ''
  errorFields.value = []
  submitting.value = true
  try {
    const { data, error } = await create(payload)
    submitting.value = false
    if (error) {
      const p = parseApiError(error)
      errorMsg.value = p.message || 'Erstellung fehlgeschlagen.'
      errorFields.value = p.fields || (p.field ? [p.field] : [])
      return
    }
    const id = data?.id
    successId.value = id
    setCurrent(id) // navigiert zu /business/w/:id/dashboard und merkt last_wid
  } catch (e) {
    submitting.value = false
    errorMsg.value = 'Erstellung fehlgeschlagen.'
  }
}
</script>
