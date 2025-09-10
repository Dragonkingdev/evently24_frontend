// composables/useToursApi.js
export function useToursApi () {
  const { get } = useApi()

  // Liste der Touren (optional filterbar)
  const listTours = (params = {}) =>
    get('/tours', params)

  // Detail: Tour + Events (with_events=true -> Events sortiert)
  const getTourBySlug = (slug, { withEvents = true } = {}) =>
    get(`/tours/${encodeURIComponent(slug)}`, { with_events: withEvents })

  // Nur Events der Tour (Filter: date_from, date_to, city)
  const listTourEvents = (slug, params = {}) =>
    get(`/tours/${encodeURIComponent(slug)}/events`, params)

  return { listTours, getTourBySlug, listTourEvents }
}
