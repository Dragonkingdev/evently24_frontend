// middleware/workspace.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const isBusinessRoot = to.path === '/business' || to.path === '/business/'
  const isBusinessArea = isBusinessRoot || to.path.startsWith('/business/')
  const isOnboarding  = to.path.startsWith('/business/onboarding')

  if (!isBusinessArea || isOnboarding) return

  const { lastWid, setLast } = useLastWorkspace()
  const { list: listMyWorkspaces } = useWorkspaceApi()

  // Hilfsfunktion: Workspaces des Users laden (ID-Liste + erste ID)
  async function fetchMyWorkspaceIds() {
    try {
      const { data } = await listMyWorkspaces('', true /* mine_only=true */)
      const rows = Array.isArray(data?.items) ? data.items
                 : Array.isArray(data?.results) ? data.results
                 : Array.isArray(data) ? data
                 : []
      const ids = rows.map(r => Number(r.id)).filter(n => Number.isFinite(n))
      const first = ids.length ? ids[0] : null
      return { ids: new Set(ids), firstId: first }
    } catch {
      return { ids: new Set(), firstId: null }
    }
  }

  // Wenn KEIN :wid in der URL -> wie bisher: gehe zu lastWid > firstOwned > onboarding
  const widParam = to.params && to.params.wid
  if (!widParam) {
    const { ids, firstId } = await fetchMyWorkspaceIds()

    // Falls der gespeicherte lastWid dem User gehört -> dorthin
    if (lastWid.value && ids.has(Number(lastWid.value))) {
      return navigateTo(`/business/w/${Number(lastWid.value)}/dashboard`)
    }

    // Sonst erster eigener Workspace
    if (firstId != null) {
      setLast(firstId)
      return navigateTo(`/business/w/${firstId}/dashboard`)
    }

    // Gar keinen -> Onboarding
    return navigateTo('/business/onboarding')
  }

  // Es gibt ein :wid in der URL -> valide Ownership prüfen
  const incomingWid = Number(widParam)
  const validIncoming = Number.isFinite(incomingWid) ? incomingWid : null

  const { ids, firstId } = await fetchMyWorkspaceIds()

  // Wenn der angefragte Workspace dem Nutzer gehört -> durchlassen & merken
  if (validIncoming != null && ids.has(validIncoming)) {
    setLast(validIncoming)
    return
  }

  // Sonst: auf "eigenen" Workspace umleiten (bevorzugt lastWid, wenn owned)
  let targetWid = null
  if (lastWid.value && ids.has(Number(lastWid.value))) {
    targetWid = Number(lastWid.value)
  } else if (firstId != null) {
    targetWid = firstId
  }

  // Wenn der User Workspaces hat: gleiche Unter-URL mit korrekter ID behalten
  // Beispiel: /business/w/9999/dashboard -> /business/w/1234/dashboard
  if (targetWid != null) {
    setLast(targetWid)
    // Ersetze nur den /business/w/:wid Prefix; Query & Hash bleiben erhalten
    const replacedPath = to.path.replace(/^\/business\/w\/[^/]+/, `/business/w/${targetWid}`)
    const finalPath = replacedPath === to.path ? `/business/w/${targetWid}/dashboard` : replacedPath
    return navigateTo({ path: finalPath, query: to.query, hash: to.hash })
  }

  // Keine eigenen Workspaces -> Onboarding
  return navigateTo('/business/onboarding')
})
