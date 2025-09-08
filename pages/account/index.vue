<template>
  <div>
    <h1>Mein Konto</h1>
    <p>Willkommen zurück, {{ currentUser }}!</p>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
const { isLoggedIn, user } = useAuth()

const currentUser = user?.value.email || 'Gast'

</script>
