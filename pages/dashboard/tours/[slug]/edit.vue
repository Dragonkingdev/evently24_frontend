<template>
  <NuxtLayout name="dashboard">
    <template #title>Tour bearbeiten</template>

    <div v-if="pending" class="text-muted">Lade…</div>
    <div v-else-if="error" class="alert alert-danger">Konnte Tour laden.</div>

    <form v-else class="card border-0 shadow-sm" @submit.prevent="save">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Titel</label>
            <input class="form-control" v-model="form.title" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Slug</label>
            <input class="form-control" v-model="form.slug">
            <div class="form-text">Änderung = neue URL.</div>
          </div>

          <div class="col-md-12">
            <label class="form-label">Untertitel</label>
            <input class="form-control" v-model="form.subtitle">
          </div>
          <div class="col-md-12">
            <label class="form-label">Teaser</label>
            <input class="form-control" v-model="form.teaser">
          </div>
          <div class="col-md-12">
            <label class="form-label">Beschreibung</label>
            <textarea class="form-control" rows="4" v-model="form.description"></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Poster URL</label>
            <input class="form-control" v-model="form.poster">
          </div>
          <div class="col-md-6">
            <label class="form-label">Hero/Bild URL</label>
            <input class="form-control" v-model="form.image">
          </div>

          <div class="col-md-6">
            <label class="form-label">FSK / Alter</label>
            <input class="form-control" v-model="form.ageRestriction" placeholder="16+, 18+, …">
          </div>
          <div class="col-md-6">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="form.status">
              <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>

          <!-- Shop-Anzeige -->
          <div class="col-md-6">
            <label class="form-label">Shop Listing Name</label>
            <input class="form-control" v-model="form.shopListingName" placeholder="z. B. Künstler – Tourname">
          </div>
          <div class="col-md-6">
            <label class="form-label">Info-URL (Anzeige)</label>
            <input class="form-control" v-model="form.shopInfoUrl" placeholder="https://…">
          </div>

          <div class="col-md-12">
            <label class="form-label">Veranstalter (intern)</label>
            <input class="form-control" v-model="form.organizer">
          </div>
          <div class="col-md-12">
            <label class="form-label">Support Acts (Komma-getrennt)</label>
            <input class="form-control" v-model="supportActsInput">
          </div>
          <div class="col-md-12">
            <label class="form-label">Interne Notizen</label>
            <textarea class="form-control" rows="3" v-model="form.internalNotes"></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Meta Title</label>
            <input class="form-control" v-model="form.metaTitle">
          </div>
          <div class="col-md-6">
            <label class="form-label">Meta Description</label>
            <input class="form-control" v-model="form.metaDescription">
          </div>
        </div>
      </div>
      <div class="card-footer d-flex gap-2">
        <NuxtLink class="btn btn-light" :to="`/dashboard/tours/${initialSlug}`">Abbrechen</NuxtLink>
        <button class="btn btn-primary" type="submit" :disabled="saving">Speichern</button>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: "businesslayout", auth: true })

import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter, useAsyncData } from '#imports'
import { useApi } from '~/composables/useApi'

const api = useApi()
const route = useRoute()
const router = useRouter()
const initialSlug = route.params.slug

const statuses = [
  { value: 'draft',       label: 'Entwurf' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'published',   label: 'Veröffentlicht' },
  { value: 'finished',    label: 'Beendet' },
  { value: 'archived',    label: 'Archiviert' },
]

const { data, pending, error } = await useAsyncData(
  () => `tour:${initialSlug}:edit`,
  () => api.get(`/dashboard/tours/${encodeURIComponent(initialSlug)}`).then(r => r.data),
  { server: true }
)

const supportActsInput = ref('')
const form = reactive({
  id: null, title:'', subtitle:'', slug:'', teaser:'', description:'',
  poster:'', image:'', status:'draft', ageRestriction:'',
  organizer:'', supportActs:[], internalNotes:'', metaTitle:'', metaDescription:'',
  shopListingName:'', shopInfoUrl:''
})

if (data.value) {
  const t = data.value
  Object.assign(form, {
    id: t.id ?? null,
    title: t.title ?? '',
    subtitle: t.subtitle ?? '',
    slug: t.slug ?? '',
    teaser: t.teaser ?? '',
    description: t.description ?? '',
    poster: t.poster ?? t.image ?? '',
    image: t.image ?? '',
    status: t.status ?? 'draft',
    ageRestriction: t.ageRestriction ?? '',
    organizer: t.organizer ?? '',
    supportActs: t.supportActs ?? [],
    internalNotes: t.internalNotes ?? '',
    metaTitle: t.metaTitle ?? '',
    metaDescription: t.metaDescription ?? '',
    shopListingName: t.shopListingName ?? '',
    shopInfoUrl: t.shopInfoUrl ?? ''
  })
  supportActsInput.value = (form.supportActs || []).join(', ')
}

const saving = ref(false)
const save = async () => {
  saving.value = true
  try {
    form.supportActs = supportActsInput.value.split(',').map(s=>s.trim()).filter(Boolean)
    await api.put(`/dashboard/tours/${encodeURIComponent(initialSlug)}`, { ...form })
    const targetSlug = form.slug || initialSlug
    await router.push(`/dashboard/tours/${encodeURIComponent(targetSlug)}`)
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern.')
  } finally {
    saving.value = false
  }
}
</script>
