<!-- pages/search.vue -->
<template>
  <div class="container py-4">
    <h1 class="h4 mb-3">Search</h1>

    <!-- Filter/Form -->
    <form class="row g-2 mb-3" @submit.prevent="apply">
      <div class="col-sm-3">
        <input v-model="date" type="date" class="form-control" />
      </div>
      <div class="col-12 col-sm-2 d-grid">
        <button class="btn btn-primary">Apply</button>
      </div>
    </form>

    <!-- Status / Counter -->
    <div class="small text-muted mb-2" v-if="pending">Loading…</div>
    <div class="small text-muted mb-2" v-else>{{ meta.total ?? items.length }} results</div>
    <div v-if="error" class="text-danger mb-3">Error: {{ errorMessage }}</div>
    <div v-else-if="!pending && !items.length" class="text-muted mb-3">No results.</div>

    <!-- Results -->
    <div v-if="items.length">
      <ul class="list-group mb-3">
        <li
          v-for="it in items"
          :key="it.id || (it.type + '-' + (it.slug || it.name || it.title))"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <NuxtLink :to="it.href || '#'" class="fw-semibold">
              {{ it.title || it.name }}
            </NuxtLink>
            <div class="small text-muted">
              <template v-if="it.type === 'event'">
                {{ it.date }} • {{ it.city }}<span v-if="it.venue"> • {{ it.venue }}</span>
              </template>
              <template v-else-if="it.type === 'act'">
                {{ it.genre }}
              </template>
              <template v-else-if="it.type === 'location'">
                {{ it.city }}<span v-if="it.country">, {{ it.country }}</span>
              </template>
            </div>
          </div>
          <span class="badge bg-light text-dark text-uppercase">{{ it.type }}</span>
        </li>
      </ul>

      <Pagination :page="page" :has-more="hasMore" @change="setPage" />
    </div>
  </div>
</template>

<script setup>
// Nuxt
const route = useRoute()
const router = useRouter()
useHead(() => ({
  title: route.query.q ? `Search: ${route.query.q}` : 'Search'
}))

// API
const { get } = useApi()

// --- Lokaler Formular-State (wird aus der URL befüllt) ---
const q     = ref('')
const type  = ref('all')     // all | events | acts | locations
const city  = ref('')
const date  = ref('')
const page  = ref(1)
const perPage = 20

// Route -> lokale Felder
function syncFromRoute () {
  q.value    = String(route.query.q ?? '')
  type.value = String(route.query.type ?? 'all')
  city.value = String(route.query.city ?? '')
  date.value = String(route.query.date ?? '')
  page.value = Number.parseInt(String(route.query.page ?? '1')) || 1
}
watch(() => route.query, syncFromRoute, { immediate: true })

// useAsyncData-Key basiert nur auf URL-Query (nicht auf lokalen Refs)
const queryKey = computed(() => JSON.stringify({
  q: route.query.q ?? '',
  type: route.query.type ?? 'all',
  city: route.query.city ?? '',
  date: route.query.date ?? '',
  page: route.query.page ?? 1
}))

// Daten laden
const { data, pending, error } = useAsyncData(
  () => `search:${queryKey.value}`,
  async () => {
    const rq = route.query
    const params = {
      q:     String(rq.q ?? '').trim() || undefined,
      type:  String(rq.type ?? 'all'),
      city:  String(rq.city ?? '').trim() || undefined,
      date:  String(rq.date ?? '') || undefined,
      page:  Number.parseInt(String(rq.page ?? '1')) || 1,
      perPage
    }

    // wenn komplett leer, kein Request
    if (!params.q && !params.city && !params.date) {
      return { items: [], meta: { total: 0, page: params.page, perPage, hasMore: false } }
    }

    const { data, error } = await get('/search', params)
    if (error) throw error
    return data
  },
  { watch: [queryKey] }
)

// Ableitungen
const items = computed(() => data.value?.items ?? [])
const meta  = computed(() => data.value?.meta ?? { total: 0, page: 1, perPage, hasMore: false })
const hasMore = computed(() => Boolean(meta.value?.hasMore) || (items.value.length === perPage))
const errorMessage = computed(() => (error.value && (error.value.message || String(error.value))) || 'Unknown error')

// Aktionen
function apply () {
  // bei neuen Filtern: immer auf Seite 1
  const next = {
    q:     q.value?.trim() || undefined,
    type:  type.value || 'all',
    city:  city.value?.trim() || undefined,
    date:  date.value || undefined,
    page:  1
  }
  router.push({ path: '/search', query: next })
}

function setPage (nextPage) {
  router.push({ path: '/search', query: { ...route.query, page: nextPage } })
}
</script>

<style scoped>
.list-group-item { cursor: pointer; }
</style>
