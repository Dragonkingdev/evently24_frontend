// middleware/layout.global.js
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/business/onboarding')) {
    setPageLayout('businessonboardinglayout')
    to.meta.auth = true
    return
  }

  if (to.path.startsWith('/business')) {
    setPageLayout('businesslayout')
    to.meta.auth = true
  }
})