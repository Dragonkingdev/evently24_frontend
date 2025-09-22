// composables/useWorkspaceApi.js
export const useWorkspaceApi = () => {
  const route = useRoute()
  const router = useRouter()
  const { lastWid, setLast } = useLastWorkspace()
  const { get, post, del, put, patch } = useApi()

  const wid = computed(() => {
    const id = parseInt(route.params.wid, 10)
    return Number.isFinite(id) ? id : null
  })
  const hasWid = computed(() => !!wid.value)

  const current = useState('ws_current', () => null)
  const features = useState('ws_features', () => ({
    ticketing: true, calendar: true, locations: true, artists: true, team: true
  }))

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

  // Optional weitere Workspace-Actions
  const patchWorkspace = (body) => patch(`/v1/workspace/${wid.value}`, body) // PATCH
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

  // --- Events (GA)
  const listEvents  = (q, active_only=true) => get(`/v1/workspace/${wid.value}/events`, { q, active_only })
  const getEvent    = (eventId) => get(`/v1/workspace/${wid.value}/events/${eventId}`)
  const createEvent = (body) => post(`/v1/workspace/${wid.value}/events`, body)
  const patchEvent  = (eventId, body) => patch(`/v1/workspace/${wid.value}/events/${eventId}`, body) // <-- NEU (PATCH)
  const deleteEvent = (eventId) => del(`/v1/workspace/${wid.value}/events/${eventId}`)
  const cloneEvent  = (eventId, body={}) => post(`/v1/workspace/${wid.value}/events/${eventId}:clone`, body)
  const archiveEvent = (eventId, archived=true) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}:archive`, { archived })
  const saleReadiness = (eventId) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/sale-readiness`)
  const publishEvent = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/publish`)
  const unpublishEvent = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/unpublish`) // <-- NEU

  // Ticketing (GA)
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

  // Reserved seating
  const getSeatingAssignments = (eventId) =>
    get(`/v1/workspace/${wid.value}/events/${eventId}/seating/assignments`)
  const setSeatingAssignments = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/seating/assignments`, body)
  const mintFromAssignments = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/seating/mint`)
  const publishReservedEvent = (eventId) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/seating/publish`)
  const seatingAutoAssign = (eventId, body) =>
    post(`/v1/workspace/${wid.value}/events/${eventId}/seating/auto-assign`, body)

  // Seatmaps
  const listSeatmaps = (q) => get(`/v1/workspace/${wid.value}/seatmaps`, { q })
  const createSeatmap = (body) => post(`/v1/workspace/${wid.value}/seatmaps`, body)
  const getSeatmap = (seatmapId) => get(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}`)
  const patchSeatmap = (seatmapId, body) => patch(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}`, body)
  const setSeatmapLayout = (seatmapId, body) => post(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout`, body)
  const generateSeatmapLayout = (seatmapId, body, force=false) =>
    post(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout/generate?force=${force}`, body)
  const seatmapLayoutSummary = (seatmapId) =>
    get(`/v1/workspace/${wid.value}/seatmaps/${seatmapId}/layout/summary`)

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
  const createLocation = (body) => post(`/v1/workspace/${wid.value}/locations`, body)
  const getLocation = (locationId) => get(`/v1/workspace/${wid.value}/locations/${locationId}`)
  const patchLocation = (locationId, body) => patch(`/v1/workspace/${wid.value}/locations/${locationId}`, body)
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

  return {
    // base
    wid, hasWid, current, features,
    list, create, setCurrent, fetchWorkspace, fetchStats,
    patchWorkspace, archiveWorkspace, restoreWorkspace, deleteWorkspace,

    // members/invites
    listMembers, addMember, updateMemberRole, removeMember, leaveWorkspace,
    listInvites, createInvite, resendInvite, revokeInvite, acceptInvite,

    // events GA
    listEvents, getEvent, createEvent, patchEvent, deleteEvent,
    cloneEvent, archiveEvent, saleReadiness, publishEvent, unpublishEvent,

    // ticketing GA
    addTicketCategories, listTicketCategories, patchTicketCategory, deleteTicketCategory,
    bulkUpsertCategories, mintTickets, listTickets, ticketsSummary, createEventWithTickets,

    // reserved seating
    getSeatingAssignments, setSeatingAssignments, mintFromAssignments,
    publishReservedEvent, seatingAutoAssign,

    // seatmaps
    listSeatmaps, createSeatmap, getSeatmap, patchSeatmap,
    setSeatmapLayout, generateSeatmapLayout, seatmapLayoutSummary,

    // series/occurrences
    listSeries, createSeries, getSeries, patchSeries, deleteSeries,
    listEventsOfSeries, attachEventToSeries, detachEventFromSeries,
    listOccurrences, createOccurrence, createOccurrencesBulk, patchOccurrence, deleteOccurrence,

    // locations/artists
    listLocations, createLocation, getLocation, patchLocation, deleteLocation,
    listArtists, createArtist, getArtist, patchArtist, deleteArtist,
    listEventArtists, addArtistToEvent, removeArtistFromEvent,

    // stripe
    stripeInitAccount, stripeOnboardingLink, stripeStatus, stripeDisconnect, stripeLoginLink
  }
}
