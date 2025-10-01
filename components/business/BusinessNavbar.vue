<!-- components/business/BusinessNavbar.vue -->
<template>
  <header class="border-bottom bg-white sticky-top">
    <div class="container-fluid d-flex align-items-center justify-content-between py-2">
      <div class="d-flex align-items-center gap-3">
        <!-- mobile burger: toggelt Sidebar -->
        <button class="btn btn-outline-secondary d-md-none" @click="$emit('toggle-sidebar')" aria-label="Menü öffnen">
          <i class="bi bi-list"></i>
        </button>
        <h5 class="mb-0 d-none d-md-block">{{ wsName }}</h5>
      </div>

      <div class="d-flex align-items-center gap-2">
        <div class="input-group d-none d-md-flex" style="max-width: 360px;">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="search"
            class="form-control"
            placeholder="Suchen…"
            v-model="q"
            @keyup.enter="$emit('search', q)"
          >
        </div>

        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-2"></i> Account
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><NuxtLink class="dropdown-item" to="/dashboard">Meine Übersicht</NuxtLink></li>
            <li><button class="dropdown-item" @click="logoutNow">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['toggle-sidebar','search'])
const { current, hasWid } = useWorkspaceApi()
const { logout } = useAuth()
const wsName = computed(() => hasWid.value ? (current.value?.name || 'Workspace') : 'Business')
const q = ref('')
async function logoutNow(){ await logout(); navigateTo('/auth/lookup') }
</script>
