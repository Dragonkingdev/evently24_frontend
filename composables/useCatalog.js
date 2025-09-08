// composables/useCatalog.js
// Read + Admin-CRUD + Persistenz (SSR-safe via useState + localStorage)

import { useState } from '#imports'

const STORAGE_KEY = 'catalog_store_v1'

function uid(prefix = '') {
  return prefix + Math.floor(Date.now() + Math.random() * 1e6).toString(36)
}
function slugify(s) {
  return (s || '')
    .toString()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
function loadFromStorage() {
  if (!process.client) return null
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null }
}
function saveToStorage(data) {
  if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ===== Seed: Deine bisherigen Daten 1:1 =====
const SEED = [
  {
    id: 1,
    slug: 'nina-chuba-2026',
    title: 'Nina Chuba – Sommershows 2026',
    subtitle: 'Nina Chuba steht mit ihrem neuen Album und den bisher größten Open-Air-Shows für 2026 in den Startlöchern!',
    range: '25.06.2026 – 12.09.2026',
    rating: { value: 4.6, count: 420 },
    teaser: 'Tickets ab € 61,40 | VIP Packages ab € 235,00',
    poster: 'https://images.unsplash.com/photo-1518976024611-28bf4b37a07d?q=80&w=1200&auto=format&fit=crop',
    description: 'Neue Songs, große Open-Air-Bühnen und ein kompromissloser Livesound. Die Sommershows 2026 führen durch ausgewählte Open-Air-Locations. Limited VIP-Kontingente und Paket-Upgrades verfügbar.',
    videos: ['https://www.youtube.com/watch?v=ysz5S6PUM-U','dQw4w9WgXcQ'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1800&auto=format&fit=crop',
    events: [
      {
        id: 1,
        date: '2026-06-25T19:00:00',
        city: 'KÖLN (FÜHLINGEN)',
        title: 'Nina Chuba – Sommershows 2026',
        venue: 'Fühlinger See',
        img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
        addons: ['Ticket + Hotel'],
        tiers: [
          { id: '1-101', code: 'STD', name: 'Stehplatz',  price_eur: 79.90, stock: 300 },
          { id: '1-102', code: 'FR',  name: 'Front Row',  price_eur: 99.90, stock: 60  },
          { id: '1-103', code: 'VIP', name: 'VIP',        price_eur: 139.90, stock: 40  }
        ],
        seatmap: {
          enabled: true,
          categories: [
            { id:'A', name:'PK1', price_eur:119.90, color:'#C62828' },
            { id:'B', name:'PK2', price_eur:89.90,  color:'#F9A825' },
            { id:'C', name:'PK3', price_eur:69.90,  color:'#2E7D32' }
          ],
          plan: {
            zones: [
              {
                id:'BLOCK-101', name:'Block 101', catId:'A', x: 0, y: 0,
                rows: Array.from({length:4}).map((_,ri)=>({
                  index: ri+1,
                  seats: Array.from({length:8}).map((_,si)=>({ id:`101-${ri+1}-${si+1}`, n: si+1 }))
                }))
              },
              {
                id:'BLOCK-102', name:'Block 102', catId:'B', x: 300, y: 0,
                rows: Array.from({length:5}).map((_,ri)=>({
                  index: ri+1,
                  seats: Array.from({length:10}).map((_,si)=>({
                    id:`102-${ri+1}-${si+1}`, n: si+1, status: (ri===0 && si<2) ? 'sold' : 'free'
                  }))
                }))
              },
              {
                id:'BLOCK-103', name:'Block 103', catId:'C', x: 0, y: 220,
                rows: Array.from({length:3}).map((_,ri)=>({
                  index: ri+1,
                  seats: Array.from({length:12}).map((_,si)=>({ id:`103-${ri+1}-${si+1}`, n: si+1 }))
                }))
              }
            ]
          }
        },
      },
      {
        id: 2,
        date: '2026-06-26T14:00:00',
        city: 'STUTTGART',
        title: 'Nina Chuba – Sommershows 2026 | Kessel Festival 2026',
        venue: 'Cannstatter Wasen & Reitstadion',
        img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
        addons: ['Ticket + Hotel'],
        tiers: [
          { id: '2-201', code: 'SEAT', name: 'Sitzplatz', price_eur: 69.90, stock: 500 },
          { id: '2-202', code: 'FR',   name: 'Front Row', price_eur: 89.90, stock: 80  }
        ]
      },
      {
        id: 3,
        date: '2026-07-03T19:00:00',
        city: 'DRESDEN',
        title: 'Nina Chuba – Sommershows 2026',
        venue: 'Rudolf-Harbig-Stadion',
        img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
        addons: ['Ticket + Hotel'],
        tiers: [
          { id: '3-301', code: 'STD', name: 'Stehplatz', price_eur: 67.90, stock: 400 }
        ]
      }
    ]
  }
]

export function useCatalog () {
  // Reaktiver Katalog (geteilt über App, SSR-safe)
  const store = useState('catalogStore', () => loadFromStorage() || SEED)
  const tours = store // Alias

  // persistieren
  function save(){ saveToStorage(tours.value) }

  // ===== Read-API (wie bei dir) =====
  const withMinPrice = (ev) => {
    const min = ev.tiers?.length ? Math.min(...ev.tiers.map(t => t.price_eur)) : null
    return { ...ev, minPrice: min }
  }
  function getTourBySlug (slug) {
    const t = tours.value.find(t => t.slug === slug)
    if (!t) return null
    const events = (t.events || []).slice().sort((a,b)=> new Date(a.date)-new Date(b.date)).map(withMinPrice)
    return { ...t, events, eventsCount: events.length }
  }
  function getEventsByTour (slug) {
    const t = getTourBySlug(slug)
    return t ? t.events : []
  }
  function getEventById (id) {
    for (const t of tours.value) {
      const ev = (t.events || []).find(e => String(e.id) === String(id))
      if (ev) return { ...withMinPrice(ev), tourSlug: t.slug, tourTitle: t.title }
    }
    return null
  }
  function getTicketsByEvent (id) {
    const ev = getEventById(id)
    return ev ? (ev.tiers || []) : []
  }
  function getToursIndex () {
    return tours.value.map(t => {
      const next = (t.events || []).slice().sort((a,b)=> new Date(a.date)-new Date(b.date))[0]
      return { slug: t.slug, title: t.title, image: t.image, poster: t.poster || t.image, eventsCount: (t.events || []).length, nextDate: next?.date || null }
    })
  }

  // ===== Admin-CRUD =====
  function createTour(input) {
    const id = uid('tour_')
    const slug = slugify(input.slug || input.title || id)
    const tour = {
      id, slug,
      title: input.title || 'Neue Tour',
      subtitle: input.subtitle || '',
      range: input.range || '',
      rating: input.rating || { value: 0, count: 0 },
      teaser: input.teaser || '',
      image: input.image || '',
      poster: input.poster || '',
      description: input.description || '',
      videos: input.videos || [],
      events: []
    }
    tours.value.push(tour); save(); return tour
  }
  function updateTour(slug, patch) {
    const i = tours.value.findIndex(t => t.slug === slug)
    if (i === -1) return null
    const next = { ...tours.value[i], ...patch }
    if (patch.slug) next.slug = slugify(patch.slug)
    tours.value.splice(i, 1, next); save(); return next
  }
  function deleteTour(slug) {
    const i = tours.value.findIndex(t => t.slug === slug)
    if (i === -1) return false
    tours.value.splice(i, 1); save(); return true
  }

  function createEvent(tourSlug, input) {
    const t = tours.value.find(t => t.slug === tourSlug)
    if (!t) return null
    const id = uid('ev_')
    const ev = {
      id,
      date: input.date || new Date().toISOString(),
      city: input.city || '',
      title: input.title || t.title,
      venue: input.venue || '',
      img: input.img || t.image,
      addons: input.addons || [],
      tiers: input.tiers || [],
      seatmap: input.seatmap || null
    }
    t.events = t.events || []
    t.events.push(ev); save(); return ev
  }
  function updateEvent(evId, patch) {
    for (const t of tours.value) {
      const i = (t.events || []).findIndex(e => String(e.id) === String(evId))
      if (i !== -1) {
        const next = { ...t.events[i], ...patch }
        t.events.splice(i, 1, next); save(); return next
      }
    }
    return null
  }
  function deleteEvent(evId) {
    for (const t of tours.value) {
      const before = t.events?.length || 0
      t.events = (t.events || []).filter(e => String(e.id) !== String(evId))
      if (t.events.length !== before) { save(); return true }
    }
    return false
  }

  // Ticket-Tiers
  function upsertTier(evId, tier) {
    for (const t of tours.value) {
      const ev = (t.events || []).find(e => String(e.id) === String(evId))
      if (!ev) continue
      ev.tiers = ev.tiers || []
      const idx = ev.tiers.findIndex(x => x.id === tier.id)
      if (idx === -1) {
        ev.tiers.push({
          id: tier.id || uid('tr_'),
          code: tier.code || '',
          name: tier.name || 'Tier',
          price_eur: +tier.price_eur || 0,
          stock: tier.stock ?? null
        })
      } else {
        ev.tiers.splice(idx, 1, { ...ev.tiers[idx], ...tier })
      }
      save(); return ev.tiers
    }
    return null
  }
  function removeTier(evId, tierId) {
    for (const t of tours.value) {
      const ev = (t.events || []).find(e => String(e.id) === String(evId))
      if (!ev) continue
      ev.tiers = (ev.tiers || []).filter(x => x.id !== tierId)
      save(); return ev.tiers
    }
    return null
  }

  // Seatmap
  function setSeatmap(evId, seatmap) {
    return updateEvent(evId, { seatmap })
  }

  return {
    // reactive data
    tours,
    // read API (wie gehabt)
    getTourBySlug, getEventsByTour, getEventById, getTicketsByEvent, getToursIndex,
    // admin
    save, createTour, updateTour, deleteTour, createEvent, updateEvent, deleteEvent, upsertTier, removeTier, setSeatmap
  }
}
