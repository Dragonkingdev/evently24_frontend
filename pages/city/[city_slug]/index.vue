<template>
    <h1>das ist die stadt {{ citySlug }}</h1>
</template>

<script setup>
const route = useRoute()
const citySlug = route.params.city_slug
</script>
