// composables/usePublic.js
// Dünne Wrapper für die Public-API, nutzt dein bestehendes useApi()

import { useApi } from '~/composables/useApi'

export function usePublic () {
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

  // -------- Locations --------
  async function listLocations (params = {}) {
    // q, city
    return await get('/v1/public/locations', params)
  }
  async function getLocationById (locationId) {
    return await get(`/v1/public/locations/${encodeURIComponent(locationId)}`)
  }
  async function listUpcomingAtLocation (locationId) {
    return await get(`/v1/public/locations/${encodeURIComponent(locationId)}/upcoming-events`)
  }

  // -------- Festivals --------
  async function listFestivals (params = {}) {
    // q, only_verified
    return await get('/v1/public/festivals', params)
  }
  async function getFestivalById (festivalId) {
    return await get(`/v1/public/festivals/${encodeURIComponent(festivalId)}`)
  }
  async function getFestivalBySlug (slug) {
    return await get(`/v1/public/festivals/by-slug/${encodeURIComponent(slug)}`)
  }
  async function listFestivalEditions (festivalId) {
    return await get(`/v1/public/festivals/${encodeURIComponent(festivalId)}/editions`)
  }
  async function listFestivalEditionEvents (festivalId, editionId) {
    return await get(`/v1/public/festivals/${encodeURIComponent(festivalId)}/editions/${encodeURIComponent(editionId)}/events`)
  }

  // -------- Artists --------
  async function listArtists (params = {}) {
    // q
    return await get('/v1/public/artists', params)
  }
  async function getArtistById (artistId) {
    return await get(`/v1/public/artists/${encodeURIComponent(artistId)}`)
  }
  async function listUpcomingForArtist (artistId) {
    return await get(`/v1/public/artists/${encodeURIComponent(artistId)}/upcoming-events`)
  }

  // -------- Search (global) --------
  async function globalSearch (q, limit = 10) {
    return await get('/v1/public/search', { q, limit })
  }

  return {
    // events
    listEvents, getEventById, getEventBySlug, listOccurrences, getSeatingOverview,
    // series
    listSeries, getSeriesById, getSeriesBySlug, listUpcomingEventsOfSeries,
    // locations
    listLocations, getLocationById, listUpcomingAtLocation,
    // festivals
    listFestivals, getFestivalById, getFestivalBySlug, listFestivalEditions, listFestivalEditionEvents,
    // artists
    listArtists, getArtistById, listUpcomingForArtist,
    // search
    globalSearch
  }
}
