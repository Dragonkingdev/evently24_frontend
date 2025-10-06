<!-- pages/series/[slug].vue -->
<template>
  <div v-if="is404">Serie existiert nicht.</div>
  <div v-else-if="isError">Fehler beim Laden.</div>

  <div v-else-if="hasData" class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h1 class="h4 mb-1">{{ s.title }}</h1>
        <div class="small text-muted">
          <span v-if="s.kind">{{ s.kind }}</span>
          <span v-if="s.status"> • Status: {{ s.status }}</span>
        </div>
      </div>
      <NuxtLink to="/" class="btn btn-link text-decoration-none">
        <i class="bi bi-arrow-left"></i> Zurück zur Übersicht
      </NuxtLink>
    </div>

    <div v-if="s.description" class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="small text-muted" v-html="s.description"></div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">Kommende Events</h5>

        <div v-if="!upcoming.length" class="text-muted">
          Keine kommenden Events.
        </div>

        <div v-else class="list-group list-group-flush">
          <div
            v-for="ev in upcoming"
            :key="ev.id"
            class="list-group-item"
          >
            <div class="d-flex justify-content-between gap-3 flex-wrap">
              <div>
                <div class="fw-semibold">
                  <NuxtLink :to="`/event/${ev.slug}`" class="text-decoration-none">{{ ev.title }}</NuxtLink>
                </div>
                <div class="small text-muted">
                  {{ fmtDate(ev.date) }}
                  <span v-if="ev.city"> • {{ ev.city }}</span>
                  <span v-if="ev.venue"> • {{ ev.venue }}</span>
                </div>
              </div>
              <div class="text-end">
                <div class="small text-muted">ab</div>
                <div class="fw-semibold">{{ ev.min_price != null ? fmt(ev.min_price) : '—' }}</div>
                <NuxtLink :to="`/event/${ev.slug}`" class="btn btn-sm btn-primary mt-2">
                  Tickets
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserPublic } from '~/composables/userPublic'

const route = useRoute()
const slug = String(route.params.slug || '')

const { getSeriesBySlug, listUpcomingEventsOfSeries } = useUserPublic()

function toStatus (e) {
  return Number(
    e?.status ?? e?.statusCode ?? e?.response?.status ?? e?.cause?.statusCode ?? e?.data?.status ?? 0
  )
}

const { data: state } = await useAsyncData(
  `series-detail:${slug}`,
  async () => {
    try {
      // 1) Serie lesen
      const rs = await getSeriesBySlug(slug)
      if (rs?.error) {
        const st = toStatus(rs.error) || Number(rs?.status || 0) || 500
        if (st === 404) return { status: 404 }
        return { status: st }
      }
      const series = rs?.data
      if (!series?.id) return { status: 404 }

      // 2) Kommende Events der Serie
      const re = await listUpcomingEventsOfSeries(series.id)
      const upcoming = Array.isArray(re?.data) ? re.data : []

      return { status: 200, data: { series, upcoming } }
    } catch (e) {
      const st = toStatus(e) || 500
      if (st === 404) return { status: 404 }
      return { status: st }
    }
  },
  { server: true, watch: false }
)

const is404  = computed(() => state.value?.status === 404)
const hasData= computed(() => state.value?.status === 200 && !!state.value?.data?.series)
const isError= computed(() => !!state.value && state.value.status !== 200 && state.value.status !== 404)

const s = computed(() => state.value?.data?.series || {})
const upcoming = computed(() => state.value?.data?.upcoming || [])

function fmt (n) { const num = Number.isFinite(n) ? n : 0; return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }
function fmtDate (iso) {
  const d = iso ? new Date(iso) : null
  if (!d || isNaN(d.getTime())) return '—'
  const date = new Intl.DateTimeFormat('de-DE',{ day:'2-digit', month:'long', year:'numeric' }).format(d)
  const time = new Intl.DateTimeFormat('de-DE',{ hour:'2-digit', minute:'2-digit' }).format(d)
  return `${date} • ${time}`
}
</script>
