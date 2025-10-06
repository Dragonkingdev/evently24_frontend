// composables/userPublic.js
// Dünne Wrapper für die Public-API, nutzt dein bestehendes useApi()

import { useApi } from '~/composables/useApi'

export function useUserPublic () {
  const { get } = useApi()

  // -------- Events --------

  async function listEvents (params = {}) {
    // q, city, category, date_from, date_to, only_published
    return await get('/v1/public/events', params)
  }

  async function getEventById (eventId) {
    return await get(`/v1/public/events/${encodeURIComponent(eventId)}`)
  }

  async function getEventBySlug (slug) {
    return await get(`/v1/public/events/by-slug/${encodeURIComponent(slug)}`)
  }

  async function listOccurrences (eventId) {
    return await get(`/v1/public/events/${encodeURIComponent(eventId)}/occurrences`)
  }

  async function getSeatingOverview (eventId) {
    return await get(`/v1/public/events/${encodeURIComponent(eventId)}/seating`)
  }

  // -------- Series --------

  async function listSeries (params = {}) {
    // q, kind, only_published
    return await get('/v1/public/series', params)
  }

  async function getSeriesById (seriesId) {
    return await get(`/v1/public/series/${encodeURIComponent(seriesId)}`)
  }

  async function getSeriesBySlug (slug) {
    return await get(`/v1/public/series/by-slug/${encodeURIComponent(slug)}`)
  }

  async function listUpcomingEventsOfSeries (seriesId) {
    return await get(`/v1/public/series/${encodeURIComponent(seriesId)}/upcoming-events`)
  }

  return {
    // events
    listEvents,
    getEventById,
    getEventBySlug,
    listOccurrences,
    getSeatingOverview,
    // series
    listSeries,
    getSeriesById,
    getSeriesBySlug,
    listUpcomingEventsOfSeries,
  }
}
