<template>
<div class="row py-3 border-bottom align-items-center">
<div class="col-12 col-md-5">
<NuxtLink :to="`/events/${ev.city?.toLowerCase()}/${ev.slug || (ev.title || '').toLowerCase().replace(/\s+/g,'-')}-${ev.id}`" class="text-decoration-none">
<strong>{{ ev.title }}</strong>
</NuxtLink>
<div class="text-muted small">{{ ev.venue }} • {{ ev.city }}</div>
</div>
<div class="col-6 col-md-3 small">{{ formatDate(ev.date) }}</div>
<div class="col-6 col-md-2 small">{{ ev.location?.name || '—' }}</div>
<div class="col-12 col-md-2 text-md-end mt-2 mt-md-0">
<NuxtLink class="btn btn-primary btn-sm" :to="`/events/${ev.city?.toLowerCase()}/${ev.slug || (ev.title || '').toLowerCase().replace(/\s+/g,'-')}-${ev.id}`">Tickets</NuxtLink>
</div>
</div>
</template>
<script setup>
const props = defineProps({ ev: { type: Object, required: true } })
function formatDate (d) {
try { return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) } catch { return d }
}
</script>