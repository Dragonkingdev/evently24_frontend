export default defineNuxtRouteMiddleware((to) => {
  // Alles unter /w/<id> ist workspace-scoped.
  const needsWs = to.path.startsWith('/business/w/')
  if (!needsWs) return

  const wid = to.params?.wid
  // Fallback: falls kein wid → redirect zu globalem dashboard (oder Auswahl)
  if (!wid) return navigateTo('/business/dashboard')
})
