<!-- pages/business/w/[wid]/calendar/series/index.vue -->
<template>
  <div class="page-stack">
    <div class="d-flex justify-content-between mb-3">
      <h4 class="mb-0">Serien</h4>
    </div>

    <form class="input-group mb-3" @submit.prevent="load">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input class="form-control" v-model="q" placeholder="Titel/Slug">
      <button class="btn btn-outline-secondary" type="submit">Suchen</button>
    </form>

    <div class="small text-muted mb-3">
      {{ pending ? 'Lade…' : `Treffer: ${rows.length}` }}
    </div>

    <div class="grow-1 min-h-0">
      <SeriesTable class="h-100" :rows="rows" :loading="pending" :wid="wid" base="/business" />
    </div>
  </div>
</template>

<script setup>
import SeriesTable from '~/components/business/workspaces/calendar/SeriesTable.vue'

const route = useRoute()
const wid = Number(route.params.wid)

// SSR: Cookies an Backend weitergeben
const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl

const q = ref('')

// fetcher liest q.value beim Aufruf; so funktioniert refresh() mit neuem Query
const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/calendar/series`, {
  query: { q: q.value || undefined },
  headers,
  credentials: 'include',
  cache: 'no-store'
})

const { data, pending, error, refresh } = await useAsyncData(
  `series-${wid}`,
  fetcher,
  { default: () => [] }
)

const rows = computed(() => Array.isArray(data.value) ? data.value : [])

async function load () {
  await refresh()
}

// Optional: beim Wechsel der Route (anderes wid) automatisch neu laden
watch(() => route.params.wid, async () => { await refreshNuxtData(`series-${Number(route.params.wid)}`) })
</script>

<style scoped>
.page-stack{
  display: flex;
  flex-direction: column;
  height: 100%;    /* füllt den .page-main Container aus */
}
.grow-1{ flex: 1 1 0; }
.min-h-0{ min-height: 0; } /* wichtig, damit das Kind (Card/Table) schrumpfen darf */
</style>
