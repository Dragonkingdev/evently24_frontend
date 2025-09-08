<template>
  <NuxtLayout name="dashboard">
    <template #title>Neue Tour</template>

    <form class="card border-0 shadow-sm" @submit.prevent="create">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Titel</label>
            <input class="form-control" v-model="form.title" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Slug</label>
            <input class="form-control" v-model="form.slug" placeholder="auto aus Titel, optional">
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
        <NuxtLink class="btn btn-light" to="/dashboard">Abbrechen</NuxtLink>
        <button class="btn btn-primary" type="submit" :disabled="creating">Anlegen</button>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: "dashboardlayout", auth: true })

import { reactive, ref, watch } from 'vue'
import { useRouter } from '#imports'
import { useApi } from '~/composables/useApi'

const api = useApi()
const router = useRouter()

const statuses = [
  { value: 'draft',       label: 'Entwurf' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'published',   label: 'Veröffentlicht' },
  { value: 'finished',    label: 'Beendet' },
  { value: 'archived',    label: 'Archiviert' },
]

const form = reactive({
  title:'', subtitle:'', slug:'', teaser:'', description:'',
  poster:'', image:'', status:'draft', ageRestriction:'',
  organizer:'', supportActs:[], internalNotes:'', metaTitle:'', metaDescription:'',
  shopListingName:'', shopInfoUrl:''
})
const supportActsInput = ref('')

// simple slugify fallback, wenn leer
watch(() => form.title, (t) => {
  if (!form.slug) form.slug = (t || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
})

const creating = ref(false)
const create = async () => {
  creating.value = true
  try {
    form.supportActs = supportActsInput.value.split(',').map(s=>s.trim()).filter(Boolean)
    const res = await api.post('/dashboard/tours', { ...form }).then(r => r.data)
    const targetSlug = res?.slug || form.slug
    await router.push(`/dashboard/tours/${encodeURIComponent(targetSlug)}`)
  } catch (e) {
    console.error(e)
    alert('Fehler beim Anlegen.')
  } finally {
    creating.value = false
  }
}
</script>
