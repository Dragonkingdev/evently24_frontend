<!--components/new/cards/EventCard.vue -->
<template>
  <ReelCard
    :media="media"
    :title="title"
    :subtitle="whenWhere"
    :price-badge="priceBadge"
    :tags="tags"
    :corner-badge="category"
    :corner-icon="categoryIcon"
    :to="eventSlug ? `/events/${eventSlug}` : '#'"
    :location-name="locationName"
  />
</template>

<script setup>
import ReelCard from '~/components/reels/ReelCard.vue'

const props = defineProps({
  title: String, whenWhere: String, priceBadge: String, tags: Array,
  media: Object, category: String, categoryIcon: String, eventSlug: String,
  locationName: String, locationSlug: String
})
</script>