// plugins/01.auth.server.js
export default defineNuxtPlugin(async () => {
  const { authReady, fetchUser } = useAuth()
  if (!authReady.value) await fetchUser()
})