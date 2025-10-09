export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/business')) {
    // Layout setzen
    setPageLayout('businesslayout')
    //console.log('Business Layout aktiv')

    // Flag für Auth setzen – landet in route.meta
    to.meta.auth = true
  }
})
