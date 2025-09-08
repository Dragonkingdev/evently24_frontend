<template>
  <NuxtLayout name="dashboard">
    <template #title>Event anlegen</template>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Tour</label>
            <select v-model="tourSlug" class="form-select">
              <option v-for="t in tours" :key="t.slug" :value="t.slug">{{ t.title }}</option>
            </select>

            <label class="form-label mt-3">Titel</label>
            <input v-model="form.title" class="form-control">

            <label class="form-label mt-3">Datum & Zeit</label>
            <input v-model="form.date" type="datetime-local" class="form-control">

            <label class="form-label mt-3">Stadt</label>
            <input v-model="form.city" class="form-control">

            <label class="form-label mt-3">Venue</label>
            <input v-model="form.venue" class="form-control">
          </div>
          <div class="col-md-6">
            <label class="form-label">Bild URL</label>
            <input v-model="form.img" class="form-control">
            <div class="mt-3">
              <img :src="form.img" class="w-100 rounded border" style="max-height:240px;object-fit:cover">
            </div>
            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-primary" @click="save">Speichern</button>
              <NuxtLink to="/dashboard/events" class="btn btn-outline-secondary">Abbrechen</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: "dashboardlayout", auth: true  })
import { ref } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useCatalog } from '~/composables/useCatalog'

const { tours, createEvent } = useCatalog()
const route = useRoute(); const router = useRouter()
const tourSlug = ref(route.query.tour || (tours.value[0]?.slug || ''))

const form = ref({
  title:'', date: new Date(Date.now()+86400000).toISOString().slice(0,16), city:'', venue:'', img:''
})

function save(){
  const ev = createEvent(tourSlug.value, { ...form.value })
  router.push(`/dashboard/events/${ev.id}`)
}
</script>
