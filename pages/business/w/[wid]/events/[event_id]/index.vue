<!-- pages/business/w/[wid]/events/[event_id]/index.vue -->
<template>
  <div class="event-view">
    <!-- HERO -->
    <EventHero :wid="wid" :event-id="eventId" :ev="ev" @updated="onUpdated" />

    <!-- NAVIGATION -->
    <EventNav :wid="wid" :event-id="eventId" :ev="ev" active="details" />

    <!-- Loading Skeleton -->
    <div v-if="pending" class="row g-4">
      <div class="col-12">
        <div class="card p-3">
          <div class="skeleton skeleton-title mb-3"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line w-75"></div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div v-else class="row g-4">
      <div class="col-12">
        <!-- Key Facts -->
        <div class="card ev-section">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Über das Event</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="aboutOpen=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-sm-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-type me-2"></i>Titel</div>
                  <div class="ev-kv-value">{{ ev?.title || '—' }}</div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-collection me-2"></i>Kategorie</div>
                  <div class="ev-kv-value">
                    <span v-if="ev?.category" class="badge rounded-pill bg-tag">{{ ev.category }}</span>
                    <span v-else>—</span>
                  </div>
                </div>
              </div>

              <div class="col-sm-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-calendar-event me-2"></i>Start</div>
                  <div class="ev-kv-value">{{ formatDate(ev?.date) }}</div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-calendar2-check me-2"></i>Ende</div>
                  <div class="ev-kv-value">{{ formatDate(ev?.end_date) }}</div>
                </div>
              </div>

              <div class="col-sm-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-globe2 me-2"></i>Zeitzone</div>
                  <div class="ev-kv-value">{{ ev?.time_zone || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Listing -->
        <div class="card ev-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Listing</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="listingOpen=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <!-- Modus -->
              <div class="col-md-6">
                <div class="ev-tile">
                  <div class="ev-tile-icon"><i class="bi bi-basket"></i></div>
                  <div class="ev-tile-body">
                    <div class="ev-tile-label">Modus</div>
                    <div class="ev-tile-value">
                      <span class="mode-chip" :class="ev?.listing_mode==='external' ? 'mode-ext' : 'mode-int'">
                        {{ ev?.listing_mode==='external' ? 'extern' : 'intern' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Extern: Ticket-Link -->
              <template v-if="ev?.listing_mode==='external'">
                <div class="col-md-6">
                  <div class="ev-tile">
                    <div class="ev-tile-icon"><i class="bi bi-link-45deg"></i></div>
                    <div class="ev-tile-body">
                      <div class="ev-tile-label">Ticket-Link</div>
                      <div class="ev-tile-value">
                        <template v-if="ev?.external_ticket_url">
                          <a
                            :href="ev.external_ticket_url"
                            class="truncate-link"
                            target="_blank"
                            rel="noopener"
                            :title="ev.external_ticket_url"
                          >
                            {{ ev.external_ticket_url }}
                          </a>
                        </template>
                        <span v-else>—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Intern: Ticket-System + Seatmap -->
              <template v-else>
                <div class="col-md-6">
                  <div class="ev-tile">
                    <div class="ev-tile-icon"><i class="bi bi-tags-fill"></i></div>
                    <div class="ev-tile-body">
                      <div class="ev-tile-label">Ticket-System</div>
                      <div class="ev-tile-value">
                        {{ ev?.ticket_sale_mode === 'reserved' ? 'Sitzplätze (Seatmap)' : 'Kontingente (GA)' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="ev?.seatmap_id">
                  <div class="ev-tile">
                    <div class="ev-tile-icon"><i class="bi bi-grid-3x3-gap"></i></div>
                    <div class="ev-tile-body">
                      <div class="ev-tile-label">Seatmap</div>
                      <div class="ev-tile-value">ID {{ ev.seatmap_id }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="card ev-section mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <strong>Location</strong>
            <button class="btn btn-sm btn-outline-secondary" @click="locationOpen=true">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="ev-kv">
                  <div class="ev-kv-label"><i class="bi bi-geo-alt me-2"></i>Name</div>
                  <div class="ev-kv-value">
                    {{ ev?.location_name || ev?.location_text_name || '—' }}
                  </div>
                </div>
                <div class="ev-kv mt-2">
                  <div class="ev-kv-label"><i class="bi bi-signpost-2 me-2"></i>Adresse</div>
                  <div class="ev-kv-value">
                    <template v-if="ev?.location_text_address || ev?.address">
                      {{ ev?.location_text_address || ev?.address }}
                    </template>
                    <template v-else>—</template>
                  </div>
                </div>
                <div class="ev-kv mt-2">
                  <div class="ev-kv-label"><i class="bi bi-building me-2"></i>PLZ / Stadt</div>
                  <div class="ev-kv-value">
                    {{ ev?.location_text_zip || ev?.postal_code || '' }}
                    <span v-if="(ev?.location_text_zip || ev?.postal_code) && (ev?.location_text_city || ev?.city)"> · </span>
                    {{ ev?.location_text_city || ev?.city || '' }}
                    <template v-if="ev?.location_text_country || ev?.country">
                      <span> · {{ ev?.location_text_country || ev?.country }}</span>
                    </template>
                  </div>
                </div>
                <div class="ev-kv mt-2" v-if="ev?.location_text_notes">
                  <div class="ev-kv-label"><i class="bi bi-info-circle me-2"></i>Hinweis</div>
                  <div class="ev-kv-value">{{ ev.location_text_notes }}</div>
                </div>
              </div>

              <!-- Map Placeholder -->
              <div class="col-md-6">
                <div class="ev-map card h-100">
                  <div class="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                    <i class="bi bi-map fs-1 mb-2"></i>
                    <div>Map-Preview</div>
                    <div class="small">Hier könnte später eine Karte eingebunden werden</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- EDIT MODALS -->
    <EditAboutModal
      :open="aboutOpen"
      :ev="ev"
      :event-id="eventId"
      @close="aboutOpen=false"
      @updated="applyUpdated"
    />
    <EditListingModal
      :open="listingOpen"
      :ev="ev"
      :event-id="eventId"
      @close="listingOpen=false"
      @updated="applyUpdated"
    />
    <EditLocationModal
      :open="locationOpen"
      :ev="ev"
      :event-id="eventId"
      @close="locationOpen=false"
      @updated="applyUpdated"
    />
  </div>
</template>

<script setup>
import EventHero from '~/components/business/workspaces/events/EventHero.vue'
import EventNav from '~/components/business/workspaces/events/EventNav.vue'
import EditAboutModal from '~/components/business/workspaces/events/modals/EditAboutModal.vue'
import EditListingModal from '~/components/business/workspaces/events/modals/EditListingModal.vue'
import EditLocationModal from '~/components/business/workspaces/events/modals/EditLocationModal.vue'

const route = useRoute()
const wid = Number(route.params.wid)
const eventId = Number(route.params.event_id)

const headers = useRequestHeaders(['cookie'])
const apiBase = useRuntimeConfig().public.apiBaseUrl
const fetcher = () => $fetch(`${apiBase}/v1/workspace/${wid}/events/${eventId}`, {
  headers, credentials: 'include', cache: 'no-store'
})
const { data, pending, refresh } = await useAsyncData(`event-${wid}-${eventId}`, fetcher)
const ev = computed(() => data.value || null)

function onUpdated(val){ if (val) data.value = val }

/* Modal state */
const aboutOpen = ref(false)
const listingOpen = ref(false)
const locationOpen = ref(false)

/* Nach erfolgreichem PATCH: Sofort aktualisieren + Cache neu laden */
async function applyUpdated(updated){
  if (updated) data.value = updated
  try { await refresh() } catch {}
}

/* Local helper for view */
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v); if (isNaN(d)) return '—'
  try { return d.toLocaleString('de-DE', { dateStyle:'medium', timeStyle:'short' }) }
  catch{
    const pad=n=>String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
</script>

<style scoped>
.bg-tag { background: #eef2ff !important; color: #364fc7; }
.ev-kv-label { color: var(--biz-ink-700, #556070); font-weight: 600; }
.ev-kv-value { color: var(--biz-ink-900, #1f2630); }
.ev-section { border-radius: 1rem; overflow: hidden; }
.ev-section .card-header { background:#fff; border-bottom:1px solid #eef2f6; }

/* Tiles & Visuals */
.ev-tile{ display:flex; gap:.85rem; padding:.9rem 1rem; border:1px solid #eef1f6; border-radius:.8rem; background:linear-gradient(180deg,#fff,#fbfcff); transition:box-shadow .15s ease, transform .15s ease; }
.ev-tile:hover{ box-shadow: 0 10px 26px rgba(0,0,0,.06); transform: translateY(-1px); }
.ev-tile-icon{ width:42px; height:42px; border-radius:.75rem; display:grid; place-items:center; background: rgba(13,110,253,.12); color:#0d6efd; }
.ev-tile-body{ min-width: 0; }
.ev-tile-value{ min-width: 0; }

.mode-chip{ display:inline-block; padding:.25rem .5rem; border-radius:.5rem; font-weight:600; line-height:1.1; border:1px solid transparent; }
.mode-int{ color:#0b5ed7; background:rgba(13,110,253,.10); border-color:rgba(13,110,253,.18); }
.mode-ext{ color:#b54708; background:#fff4e6; border-color:#ffe8cc; }

.truncate-link{ display:inline-block; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:bottom; }

.ev-map { border: 1px dashed #e6e9ef; border-radius: .9rem; background: repeating-linear-gradient(45deg,#fafbfe,#fafbfe 10px,#f6f8fd 10px,#f6f8fd 20px); }

.skeleton { display:block; height:12px; border-radius:8px; background:linear-gradient(90deg,#f2f4f8 0%,#e9edf3 50%,#f2f4f8 100%); background-size:200% 100%; animation: sk 1.2s infinite; }
.skeleton-title{ height:22px; width:60%; }
.skeleton-line{ height:12px; width:90%; }
@keyframes sk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
