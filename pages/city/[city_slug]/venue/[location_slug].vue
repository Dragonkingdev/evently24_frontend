<template>
    <h1>das ist die stadt {{ citySlug }}</h1>
    <h1>das ist die location {{ locationSlug }}</h1>
</template>

<script setup>
const route = useRoute()
const citySlug = route.params.city_slug
const locationSlug = route.params.location_slug
</script>
