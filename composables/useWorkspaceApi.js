// composables/useWorkspaceApi.js
export const useWorkspaceApi = () => {
  const route = useRoute()
  const router = useRouter()
  const { lastWid, setLast } = useLastWorkspace()
  const { get, post, del, put, patch } = useApi()

  // --- zentraler Error-Parser ---
  const parseApiError = (err) => {
    const raw = err?.data ?? err?.response?.data ?? err
    const arr = Array.isArray(raw?.errors) ? raw.errors
      : Array.isArray(raw?.detail) ? raw.detail
      : null
    if (arr && arr.length) {
      const first = arr[0] || {}
      return {
        code: first.code || 'error',
        message: first.message || 'Es ist ein Fehler aufgetreten.',
        field: first.field ?? null,
        fields: Array.isArray(first.fields) ? first.fields
          : (Array.isArray(first.meta?.fields) ? first.meta.fields : [])
      }
    }
    const d = raw?.detail ?? raw
    if (typeof d === 'string') return { code: 'error', message: d, field: null, fields: [] }
    if (d && typeof d === 'object') {
      return {
        code: d.code || 'error',
        message: d.message || 'Es ist ein Fehler aufgetreten.',
        field: d.field ?? null,
        fields: Array.isArray(d.fields) ? d.fields
          : (Array.isArray(d.meta?.fields) ? d.meta.fields : [])
      }
    }
    return { code: 'error', message: 'Es ist ein Fehler aufgetreten.', field: null, fields: [] }
  }

  const wid = computed(() => {
    const id = parseInt(route.params.wid, 10)
    return Number.isFinite(id) ? id : null
  })
  const hasWid = computed(() => !!wid.value)

  const current = useState('ws_current', () => null)
  const features = useState('ws_features', () => ({
    ticketing: true, calendar: true, locations: true, artists: true, team: true
  }))

  // ---------- Helpers für Location-Payload ----------
  // number | null (explizit leeren) | undefined (nicht senden)
  const _nullableNum = (v) => {
    if (v === null) return null
    if (v === undefined || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  const _txtOrNull = (v) => {
    if (v === null) return null
    if (typeof v === 'string') {
      const t = v.trim()
      return t ? t : null
    }
    return undefined
  }
  const _stripUndefined = (obj) => {
    const o = {}
    for (const [k, v] of Object.entries(obj || {})) {
      if (v !== undefined) o[k] = v
    }
    return o
  }

  /**
   * Normalisiert Location-Payload (NETTO-Pricing + Discounts).
   * - Leere Zahlen -> null (Clear), fehlende -> undefined (nicht senden)
   * - Leere Strings -> null (Clear), fehlende -> undefined
   * - DE: vat_percent = 19, wenn nicht gesetzt (undefined). null bleibt null.
   */
  const normalizeLocationPayload = (payload = {}) => {
    const p = { ...(payload || {}) }

    if (typeof p.country === 'string') p.country = p.country.trim().toUpperCase() || undefined

    // Pricing (netto)
    const pricing = {
      day_rate_base:           _nullableNum(p.day_rate_base),
      day_rate_includes_hours: _nullableNum(p.day_rate_includes_hours),
      extra_hour_rate:         _nullableNum(p.extra_hour_rate),
      weekend_markup_percent:  _nullableNum(p.weekend_markup_percent),
      cleaning_fee:            _nullableNum(p.cleaning_fee),
      deposit:                 _nullableNum(p.deposit),
      vat_percent:             _nullableNum(p.vat_percent),
    }

    // Auto-VAT: nur DE + undefined -> 19 (null = Clear bleibt)
    if (p.country === 'DE' && pricing.vat_percent === undefined) {
      pricing.vat_percent = 19
    }

    // Staffelrabatte
    let tiers = Array.isArray(p.multi_day_discounts) ? p.multi_day_discounts : undefined
    if (tiers) {
      tiers = tiers
        .map(t => ({
          min_days:    _nullableNum(t?.min_days),
          percent_off: _nullableNum(t?.percent_off),
        }))
        .filter(t => (t.min_days !== undefined && t.min_days !== null && t.min_days >= 1)
                  && (t.percent_off !== undefined && t.percent_off !== null && t.percent_off >= 0))
        .sort((a, b) => (a.min_days - b.min_days))
      if (!tiers.length) tiers = []
    }

    const out = {
      // Basis
      name: _txtOrNull(p.name),
      address: _txtOrNull(p.address),
      postal_code: _txtOrNull(p.postal_code),
      city: _txtOrNull(p.city),
      country: p.country,
      email: _txtOrNull(p.email),
      phone: _txtOrNull(p.phone),
      website: _txtOrNull(p.website),

      // Status
      status: _txtOrNull(p.status),
      verification_status: _txtOrNull(p.verification_status),

      // Buchung
      booking_enabled: typeof p.booking_enabled === 'boolean' ? p.booking_enabled : undefined,
      booking_notes: _txtOrNull(p.booking_notes),

      // Kapazitäten
      area_sqm:                _nullableNum(p.area_sqm),
      capacity_seated_min:     _nullableNum(p.capacity_seated_min),
      capacity_seated_max:     _nullableNum(p.capacity_seated_max),
      capacity_standing_max:   _nullableNum(p.capacity_standing_max),
      toilets_count:           _nullableNum(p.toilets_count),
      parking_count:           _nullableNum(p.parking_count),
      rooms_count:             _nullableNum(p.rooms_count),

      // Kataloge/Medien
      categories: Array.isArray(p.categories) ? p.categories : undefined,
      amenities:  Array.isArray(p.amenities)  ? p.amenities  : undefined,
      tech:       Array.isArray(p.tech)       ? p.tech       : undefined,
      services:   Array.isArray(p.services)   ? p.services   : undefined,
      rules:      Array.isArray(p.rules)      ? p.rules      : undefined,
      image_urls: Array.isArray(p.image_urls) ? p.image_urls : undefined,

      // Regeln & Texte
      curfew_time: _txtOrNull(p.curfew_time),
      min_age: _nullableNum(p.min_age),
      max_noise_level_db: _nullableNum(p.max_noise_level_db),

      // Netto-Pricing
      ...pricing,
      multi_day_discounts: tiers,          // [] erlaubt, um zu leeren
      pricing_notes: _txtOrNull(p.pricing_notes),
      cancellation_policy: _txtOrNull(p.cancellation_policy),
    }

    return _stripUndefined(out)
  }

  // Convenience: location_name aus payload.location ableiten (legacy Unterstützung)
  const withLocationName = (payload) => {
    const p = { ...(payload || {}) }
    if (typeof p.location === 'string' && p.location.trim()) {
      p.location_name = p.location.trim()
      delete p.location
    }
    return p
  }

  /**
   * Einheitlicher Payload-Normalizer für Events.
   * (Sende KEINE time_zone beim Create)
   */
  const normalizeEventPayload = (ui = {}) => {
    const out = {
      title: ui.title?.trim() || '',
      category: ui.category || null,
      date: ui.date || null,
      end_date: ui.end_date || null,
      listing_mode: ui.listing_mode || 'internal',
      external_ticket_url: ui.listing_mode === 'external' ? (ui.external_ticket_url || null) : null,
    }

    // Location
    if (ui.locationMode === 'existing' && ui.selectedLocationId) {
      out.location_id = Number(ui.selectedLocationId)
    } else if (ui.locationMode === 'free' && ui.locationFree) {
      const f = ui.locationFree
      out.location_text_name    = f.name?.trim() || null
      out.location_text_address = f.address?.trim() || null
      out.location_text_zip     = f.zip?.trim() || null
      out.location_text_city    = f.city?.trim() || null
      out.location_text_country = f.country?.trim() || null
      out.location_text_notes   = f.notes?.trim() || null
    }

    // Ticket-System nur für INTERNAL
    if (out.listing_mode === 'internal') {
      out.ticket_sale_mode = ui.ticketMode === 'reserved' ? 'reserved' : 'general'
      if (ui.seatmap_id) out.seatmap_id = ui.seatmap_id
    } else {
      delete out.ticket_sale_mode
      delete out.seatmap_id
    }

    return out
  }

  // --- Workspace base ---
  const list = (q, mine_only = true) => get('/v1/workspace', { q, mine_only })
  const create = (body) => post('/v1/workspace', body)
  async function fetchWorkspace() {
    if (!wid.value) return
    const { data } = await get(`/v1/workspace/${wid.value}`)
    if (data) current.value = data
    setLast(wid.value)
  }
  async function fetchStats() {
    if (!wid.value) return {}
    const { data } = await get(`/v1/workspace/${wid.value}/stats`)
    return data || {}
  }
  function setCurrent (id) {
    current.value = { ...(current.value || {}), id }
    setLast(id)
    router.push(`/business/w/${id}/dashboard`)
  }

  // Optional Workspace-Actions
  const patchWorkspace = (body) => patch(`/v1/workspace/${wid.value}`, body)
  const archiveWorkspace = () => post(`/v1/workspace/${wid.value}/archive`)
  const restoreWorkspace = () => post(`/v1/workspace/${wid.value}/restore`)
  const deleteWorkspace = () => del(`/v1/workspace/${wid.value}`)

  // --- Members / Invites ---
  const listMembers = (q) => get(`/v1/workspace/${wid.value}/members`, { q })
  const addMember = (body) => post(`/v1/workspace/${wid.value}/members`, body)
  const updateMemberRole = (memberId, body) =>
    patch(`/v1/workspace/${wid.value}/members/${memberId}`, body)
  const removeMember = (memberId) =>
    del(`/v1/workspace/${wid.value}/members/${memberId}`)
  const leaveWorkspace = () => post(`/v1/workspace/${wid.value}/members/me/leave`)

  const listInvites = (only_pending=true) =>
    get(`/v1/workspace/${wid.value}/invites`, { only_pending })
  const createInvite = (body) => post(`/v1/workspace/${wid.value}/invites`, body)
  const resendInvite = (inviteId, ttl_days) =>
    post(`/v1/workspace/${wid.value}/invites/${inviteId}/resend`, null, { ttl_days })
  const revokeInvite = (inviteId) =>
    del(`/v1/workspace/${wid.value}/invites/${inviteId}`)
  const acceptInvite = (body) =>
    post(`/v1/workspace/${wid.value}/invites/accept`, body)

  // --- Events ---
  const listEvents  = (q, active_only=true) => get(`/v1/workspace/${wid.value}/events`, { q, active_only })
  const getEvent    = (eventId) => get(`/v1/workspace/${wid.value}/events/${eventId}`)
  const createEvent = (body) => post(`/v1/workspace/${wid.value}/events`, body)
  const patchEvent  = (eventId, body) => patch(`/v1/workspace/${wid.value}/events/${eventId}`, body)
  const manageEvent = (eventId) => post(`/v1/workspace/${wid.value}/events/${eventId}/manage`)

  const deleteEvent = (eventId) => del(`/v1/workspace/${wid.value}/events/${eventId}`)
  const cloneEvent  = (eventId, body={}) => post(`/v1/workspace/${wid.value}/events/${eventId}:clone`, body)
  const archiveEvent = (eventId, body={ archived: true }) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}:archive`, body)
  const saleReadiness = (eventId) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/sale-readiness`)
  const publishEvent = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/publish`)
  const unpublishEvent = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/unpublish`)

  // --- Ticketing ---
  const addTicketCategories = (eventId, categories) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/ticket-categories`, categories)
  const listTicketCategories = (eventId) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/ticket-categories`)
  const patchTicketCategory = (eventId, categoryId, body) =>
    patch(`/v1/workspace/${wid.value}/events/${eventId}/ticket-categories/${categoryId}`, body)
  const deleteTicketCategory = (eventId, categoryId) =>
    del(`/v1/workspace/${wid.value}/events/${eventId}/ticket-categories/${categoryId}`)
  const bulkUpsertCategories = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/ticket-categories:bulk-upsert`, body)

  const mintTickets = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets:mint`, body)
  const listTickets = (eventId, q={}) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/tickets`, q)
  const ticketsSummary = (eventId) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/tickets/summary`)
  const createEventWithTickets = (body) =>
    post(`/v1/workspace/${wid.value}/events:sell`, body)

  // --- Holds ---
  const createGAHold = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/ga`, body)
  const releaseGAHoldAll = (eventId, cartId) =>
    del(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}`)
  const issueFromGAHold = (eventId, cartId, body={}) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}:issue`, body)

  const listHolds = (eventId, q) => get(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds`, q)
  const patchHold = (eventId, cartId, body) => patch(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}`, body)
  const holdCheckoutLink = (eventId, cartId) => get(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}/checkout-link`)

  const seatsStatus = (eventId, labels) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/tickets/seats`, { label: labels })
  const createSeatHold = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/seats`, body)
  const releaseSeatHold = (eventId, cartId, body={}) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}:release-seats`, body)
  const issueFromSeatHold = (eventId, cartId, body={}) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets/holds/${cartId}:issue-seats`, body)

  // --- Ticket-Admin ---
  const swapSeat = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/tickets:swap-seat`, body)

  // --- Seatmaps ---
  const listSeatmaps = (q) => get(`/v1/workspace/${wid.value}/seatmaps`, { q })
  const createSeatmap = (body) => post(`/v1/workspace/${wid.value}/seatmaps`, body)
  const getSeatmap = (seatmapId) => get(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}`)
  const patchSeatmap = (seatmapId, body) => patch(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}`, body)
  const setSeatmapLayout = (seatmapId, body) => post(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout`, body)
  const generateSeatmapLayout = (seatmapId, body, force=false) =>
    post(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout/generate?force=${force}`, body)
  const seatmapLayoutSummary = (seatmapId) =>
    get(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout/summary`)

  const setSeatmapLayoutCanvas = (seatmapId, body, force=false) =>
    post(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout/canvas?force=${force}`, body)
  const getSeatmapLayoutCanvas = (seatmapId) =>
    get(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}`).then(({ data }) => ({
      id: data?.id,
      canvas: data?.layout?.canvas || null
    }))

  // --- Calendar / Series & Occurrences ---
  const listSeries = (q, kind) => get(`/v1/workspace/${wid.value}/calendar/series`, { q, kind })
  const createSeries = (body) => post(`/v1/workspace/${wid.value}/calendar/series`, body)
  const getSeries = (seriesId) => get(`/v1/workspace/${wid.value}/calendar/series/${seriesId}`)
  const patchSeries = (seriesId, body) => patch(`/v1/workspace/${wid.value}/calendar/series/${seriesId}`, body)
  const deleteSeries = (seriesId) => del(`/v1/workspace/${wid.value}/calendar/series/${seriesId}`)
  const listEventsOfSeries = (seriesId) => get(`/v1/workspace/${wid.value}/calendar/series/${seriesId}/events`)
  const attachEventToSeries = (seriesId, body) => post(`/v1/workspace/${wid.value}/calendar/series/${seriesId}/events:attach`, body)
  const detachEventFromSeries = (seriesId, body) => post(`/v1/workspace/${wid.value}/calendar/series/${seriesId}/events:detach`, body)
  const listOccurrences = (eventId) => get(`/v1/workspace/${wid.value}/calendar/events/${eventId}/occurrences`)
  const createOccurrence = (eventId, body) => post(`/v1/workspace/${wid.value}/calendar/events/${eventId}/occurrences`, body)
  const createOccurrencesBulk = (eventId, body) => post(`/v1/workspace/${wid.value}/calendar/events/${eventId}/occurrences:bulk`, body)
  const patchOccurrence = (eventId, occurrenceId, body) =>
    patch(`/v1/workspace/${wid.value}/calendar/events/${eventId}/occurrences/${occurrenceId}`, body)
  const deleteOccurrence = (eventId, occurrenceId) =>
    del(`/v1/workspace/${wid.value}/calendar/events/${eventId}/occurrences/${occurrenceId}`)

  // --- Locations / Artists ---
  const listLocations = (q) => get(`/v1/workspace/${wid.value}/locations`, { q })
  const createLocation = (body) =>
    post(`/v1/workspace/${wid.value}/locations`, normalizeLocationPayload(body))
  const getLocation = (locationId) => get(`/v1/workspace/${wid.value}/locations/${locationId}`)
  const patchLocation = (locationId, body) =>
    patch(`/v1/workspace/${wid.value}/locations/${locationId}`, normalizeLocationPayload(body))
  const deleteLocation = (locationId) => del(`/v1/workspace/${wid.value}/locations/${locationId}`)

  const listArtists   = (q, kind) => get(`/v1/workspace/${wid.value}/artists`, { q, kind })
  const createArtist  = (body) => post(`/v1/workspace/${wid.value}/artists`, body)
  const getArtist     = (artistId) => get(`/v1/workspace/${wid.value}/artists/${artistId}`)
  const patchArtist   = (artistId, body) => patch(`/v1/workspace/${wid.value}/artists/${artistId}`, body)
  const deleteArtist  = (artistId) => del(`/v1/workspace/${wid.value}/artists/${artistId}`)
  const listEventArtists = (eventId) => get(`/v1/workspace/${wid.value}/events/${eventId}/artists`)
  const addArtistToEvent = (eventId, body) => post(`/v1/workspace/${wid.value}/events/${eventId}/artists`, body)
  const removeArtistFromEvent = (eventId, artistId) => del(`/v1/workspace/${wid.value}/events/${eventId}/artists/${artistId}`)

  // --- PSP (Stripe) ---
  const stripeInitAccount     = () => post(`/v1/workspace/${wid.value}/psp/stripe/accounts:init`)
  const stripeOnboardingLink  = () => post(`/v1/workspace/${wid.value}/psp/stripe/onboarding-link`)
  const stripeStatus          = () => get(`/v1/workspace/${wid.value}/psp/stripe/status`)
  const stripeDisconnect      = (remote=false, keep_settings=true) =>
    del(`/v1/workspace/${wid.value}/psp/stripe/connection`, { remote, keep_settings })
  const stripeLoginLink       = () => post(`/v1/workspace/${wid.value}/psp/stripe/login-link`)

  // ======================================================
  // Location-Options (Meta)
  // ======================================================
  const locoptsState = useState('locopts_state', () => null)
  const locoptsEtag  = useState('locopts_etag', () => null)
  const locale       = useState('locale', () => 'de')

  const LOCOPTS_DATA_KEY = 'locopts:data'
  const LOCOPTS_ETAG_KEY = 'locopts:etag'

  const _calcPseudoEtag = (payload) => {
    try {
      const sum = Object.values(payload?.version_map || {}).reduce((a, b) => a + (b || 0), 0)
      return `"${sum}"`
    } catch { return null }
  }

  async function fetchLocationOptions (force = false) {
    if (!force && locoptsState.value) return locoptsState.value
    if (process.client && !locoptsState.value) {
      try {
        const cached = localStorage.getItem(LOCOPTS_DATA_KEY)
        const et = localStorage.getItem(LOCOPTS_ETAG_KEY)
        if (cached) { locoptsState.value = JSON.parse(cached) }
        if (et) { locoptsEtag.value = et }
      } catch {}
    }
    try {
      const res = await $fetch('/api/v1/workspace/location/meta', {
        method: 'GET',
        headers: locoptsEtag.value ? { 'If-None-Match': locoptsEtag.value } : undefined,
      })
      if (res) {
        locoptsState.value = res
        const tag = _calcPseudoEtag(res)
        if (tag) locoptsEtag.value = tag
        if (process.client) {
          localStorage.setItem(LOCOPTS_DATA_KEY, JSON.stringify(res))
          if (tag) localStorage.setItem(LOCOPTS_ETAG_KEY, tag)
        }
      }
    } catch (e) {
      if (!locoptsState.value) throw e
    }
    return locoptsState.value
  }

  const upsertLocationOptionGroup = (key, body) =>
    put(`/v1/workspace/location/meta/${key}`, body)
  const toggleLocationOptionItem  = (key, id_slug, active) =>
    patch(`/v1/workspace/location/meta/${key}/items/${id_slug}`, { active })

  const _list = (k) => computed(() => (locoptsState.value?.groups?.[k] || []).map(it => ({
    id: it.id_slug,
    label: it.labels?.[locale.value] || it.labels?.[ 'de' ] || it.labels?.[ 'en' ] || it.id_slug,
    meta: it.meta || {}
  })))
  const categories = _list('categories')
  const amenities  = _list('amenities')
  const services   = _list('services')
  const tech       = _list('tech')
  const rules      = _list('rules')

  const labelOf = (groupKey, id) => {
    const arr = (locoptsState.value?.groups?.[groupKey] || [])
    const hit = arr.find(x => x.id_slug === id)
    return hit ? (hit.labels?.[locale.value] || hit.labels?.de || hit.labels?.en || id) : id
  }
  const _asMap = (list) => list.reduce((acc, it) => (acc[it.id] = it.label, acc), {})
  const optionMaps = computed(() => ({
    categories: _asMap(categories.value),
    amenities:  _asMap(amenities.value),
    services:   _asMap(services.value),
    tech:       _asMap(tech.value),
    rules:      _asMap(rules.value),
  }))

  return {
    // base
    wid, hasWid, current, features,
    list, create, setCurrent, fetchWorkspace, fetchStats,
    patchWorkspace, archiveWorkspace, restoreWorkspace, deleteWorkspace,

    // members/invites
    listMembers, addMember, updateMemberRole, removeMember, leaveWorkspace,
    listInvites, createInvite, resendInvite, revokeInvite, acceptInvite,

    // events
    listEvents, getEvent, createEvent, manageEvent, patchEvent, deleteEvent,
    cloneEvent, archiveEvent, saleReadiness, publishEvent, unpublishEvent,

    // ticketing
    addTicketCategories, listTicketCategories, patchTicketCategory, deleteTicketCategory,
    bulkUpsertCategories, mintTickets, listTickets, ticketsSummary, createEventWithTickets,

    // holds
    createGAHold, releaseGAHoldAll, issueFromGAHold,
    seatsStatus, createSeatHold, releaseSeatHold, issueFromSeatHold,
    listHolds, patchHold, holdCheckoutLink,

    // ticket admin
    swapSeat,

    // seatmaps
    listSeatmaps, createSeatmap, getSeatmap, patchSeatmap,
    setSeatmapLayout, generateSeatmapLayout, seatmapLayoutSummary,
    setSeatmapLayoutCanvas, getSeatmapLayoutCanvas,

    // series/occurrences
    listSeries, createSeries, getSeries, patchSeries, deleteSeries,
    listEventsOfSeries, attachEventToSeries, detachEventFromSeries,
    listOccurrences, createOccurrence, createOccurrencesBulk, patchOccurrence, deleteOccurrence,

    // locations/artists
    listLocations, createLocation, getLocation, patchLocation, deleteLocation,
    listArtists, createArtist, getArtist, patchArtist, deleteArtist,
    listEventArtists, addArtistToEvent, removeArtistFromEvent,

    // stripe
    stripeInitAccount, stripeOnboardingLink, stripeStatus, stripeDisconnect, stripeLoginLink,

    // helpers
    withLocationName,
    normalizeEventPayload,
    normalizeLocationPayload,

    // error util
    parseApiError,

    // meta
    fetchLocationOptions,
    upsertLocationOptionGroup,
    toggleLocationOptionItem,

    // options state
    locoptsState,
    locoptsEtag,
    locale,
    categories,
    amenities,
    services,
    tech,
    rules,
    optionMaps,
    labelOf,
  }
}
