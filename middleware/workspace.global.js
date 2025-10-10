// middleware/workspace.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const isBusinessRoot = to.path === '/business' || to.path === '/business/'
  const isBusinessArea = isBusinessRoot || to.path.startsWith('/business/')
  const isOnboarding  = to.path.startsWith('/business/onboarding')

  if (!isBusinessArea || isOnboarding) return

  const widParam = to.params && to.params.wid
  if (widParam) return

  const { lastWid } = useLastWorkspace()
  const { list: listMyWorkspaces } = useWorkspaceApi()

  if (lastWid.value) {
    return navigateTo(`/business/w/${lastWid.value}/dashboard`)
  }

  try {
    const { data } = await listMyWorkspaces('', true /* mine_only=true */)
    const rows = Array.isArray(data?.items) ? data.items
               : Array.isArray(data?.results) ? data.results
               : Array.isArray(data) ? data
               : []
    if (rows.length > 0) {
      return navigateTo(`/business/w/${rows[0].id}/dashboard`)
    }
  } catch {}

  return navigateTo('/business/onboarding')
})
