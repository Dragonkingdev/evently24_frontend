<!-- components/business/workspaces/locations/LocationHero.vue -->
<template>
  <section class="loc-hero card mb-4 overflow-hidden">
    <div class="loc-hero-bg"></div>
    <div class="card-body position-relative">
      <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <!-- Left -->
        <div class="d-flex align-items-start gap-3">
          <div class="loc-hero-badge">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span v-if="loc?.status" class="badge bg-status">
                {{ loc.status }}
              </span>
              <span v-if="loc?.verification_status" class="badge bg-verify">
                {{ loc.verification_status }}
              </span>
              <span v-if="loc?.id" class="badge bg-light text-dark">ID #{{ loc.id }}</span>
            </div>

            <h1 class="loc-title mt-1 mb-1">{{ loc?.name || 'Location' }}</h1>

            <div class="loc-subtle text-muted">
              <i class="bi bi-building me-1"></i>
              <strong>{{ cityLine }}</strong>

              <template v-if="loc?.address">
                <span class="ms-3">
                  <i class="bi bi-signpost-2 me-1"></i>
                  <span>{{ loc.address }}</span>
                </span>
              </template>

              <template v-if="loc?.website">
                <span class="ms-3">
                  <i class="bi bi-link-45deg me-1"></i>
                  <a :href="loc.website" target="_blank" rel="noopener" class="truncate-link">{{ loc.website }}</a>
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="d-flex align-items-center gap-2">
          <NuxtLink :to="`/business/w/${wid}/locations`" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Zurück
          </NuxtLink>
          <button class="btn btn-outline-secondary" @click="$emit('edit')">
            <i class="bi bi-pencil-square"></i> Bearbeiten
          </button>
        </div>
      </div>

      <div v-if="flash" class="alert mt-3 mb-0" :class="flash.variant">{{ flash.msg }}</div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  wid: { type: [Number, String], required: true },
  locationId: { type: [Number, String], required: true },
  loc: { type: Object, default: null }
})
defineEmits(['edit'])

const flash = ref(null)
function notify (msg, variant='alert-success') {
  flash.value = { msg, variant }; setTimeout(() => (flash.value = null), 5000)
}

const cityLine = computed(() => {
  const zip = props.loc?.postal_code || ''
  const city = props.loc?.city || ''
  const cc = props.loc?.country || ''
  return [zip, city, cc].filter(Boolean).join(' · ') || '—'
})
</script>

<style scoped>
:root, .loc-hero {
  --brand-primary:    #0d6efd;
  --brand-primary-10: rgba(13,110,253,.1);
  --brand-gradient-a: #5a8bff;
  --brand-gradient-b: #7cc2ff;
  --ink-900: #1f2630;
  --ink-700: #556070;
}
.loc-hero { border: 0; border-radius: 1rem; }
.loc-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(1200px 400px at -10% -50%, var(--brand-gradient-a), transparent 70%),
              radial-gradient(800px 300px at 120% 10%, var(--brand-gradient-b), transparent 60%),
              linear-gradient(135deg, #fff 0%, #f8fbff 100%);
  opacity: .65;
}
.loc-hero .card-body { padding: 1.25rem 1.25rem; }
@media (min-width: 992px){ .loc-hero .card-body { padding: 1.5rem 1.75rem; } }

.loc-hero-badge{
  width: 52px; height: 52px; border-radius: 12px;
  display: grid; place-items: center;
  background: var(--brand-primary-10);
  color: var(--brand-primary); font-size: 1.25rem;
  box-shadow: 0 8px 22px rgba(13,110,253,.15);
}
.loc-title { font-size: clamp(1.2rem, 1.2rem + 1vw, 1.65rem); color: var(--ink-900); }
.loc-subtle{ color: var(--ink-700); }

.bg-status{ background: #eef2ff; color:#364fc7; border:1px solid rgba(54,79,199,.18); }
.bg-verify{ background: #f1eefc; color:#6f42c1; border:1px solid rgba(111,66,193,.25); }
.truncate-link{ display:inline-block; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:bottom; }
</style>
