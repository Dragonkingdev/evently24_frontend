# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


eventlistrak
evenlistracker
eventlistracker

evently24.de/
├─ /
├─ /suche
│  ├─ /?q=
│  ├─ /?stadt=
│  ├─ /?datum=
│  ├─ /?kategorie=
│  └─ /?location=
├─ /events
│  ├─ /{stadt}
│  ├─ /{stadt}/{slug}-{eventId}
│  └─ /{stadt}/{datum}
├─ /tours
│  ├─ /
│  ├─ /?stadt=
│  ├─ /?genre=
│  └─ /{actSlug}/{tourSlug}-{tourId}
├─ /locations
│  ├─ /
│  ├─ /?stadt=
│  ├─ /?art=hochzeit|tagung|party|konzert
│  ├─ /?kapazitaet=
│  └─ /{stadt}/{slug}-{locationId}
├─ /acts
│  ├─ /
│  ├─ /?stadt=
│  ├─ /?genre=
│  └─ /{slug}-{actId}
├─ /sammlungen
│  ├─ /wochenende
│  ├─ /top
│  └─ /neu
├─ /favoriten
├─ /benachrichtigungen
├─ /cart
├─ /checkout
├─ /how-it-works
├─ /help
├─ /feedback
│  ├─ /ideen
│  ├─ /bugs
│  ├─ /verbesserungen
│  ├─ /roadmap
│  ├─ /changelog
│  └─ /{slug}

# Konto
├─ /profil
│  ├─ /uebersicht
│  ├─ /tickets
│  ├─ /bestellungen
│  ├─ /favoriten
│  ├─ /einstellungen
│  │  ├─ /konto
│  │  ├─ /benachrichtigungen
│  │  ├─ /datenschutz
│  │  └─ /sicherheit
│  ├─ /rollen
│  │  ├─ /onboarding          # Rollen aktivieren (Act / Veranstalter / Location)
│  │  └─ /berechtigungen
│  ├─ /organisationen
│  └─ /verifizierung

# Business
├─ /business
│  ├─ /dashboard              # kombiniert alle aktiven Rollen
│
│  # VERANSTALTER
│  ├─ /veranstalter
│  │  ├─ /events
│  │  │  ├─ /neu
│  │  │  ├─ /{eventId}
│  │  │  │  ├─ /uebersicht
│  │  │  │  ├─ /details
│  │  │  │  ├─ /lineup        # Acts hinzufügen
│  │  │  │  ├─ /host          # Location anfragen
│  │  │  │  ├─ /tickets
│  │  │  │  ├─ /marketing
│  │  │  │  ├─ /einlass
│  │  │  │  └─ /reports
│  │  ├─ /tours
│  │  │  ├─ /neu
│  │  │  └─ /{tourId}
│  │  │     ├─ /daten
│  │  │     ├─ /stops         # Events verknüpfen
│  │  │     └─ /reports
│  │  ├─ /einlass
│  │  ├─ /auszahlungen
│  │  ├─ /marketing
│  │  │  ├─ /promo-slots
│  │  │  ├─ /newsletter
│  │  │  └─ /social-ads
│  │  ├─ /statistiken
│  │  ├─ /acts
│  │  │  ├─ /connect          # Acts anfragen/zuordnen
│  │  │  └─ /{actId}
│  │  ├─ /locations
│  │  │  ├─ /verknuepfen
│  │  │  └─ /{locationId}
│  │  ├─ /anfragen
│  │  ├─ /feedback
│  │  └─ /einstellungen
│  │     ├─ /branding
│  │     ├─ /team
│  │     └─ /api
│
│  # LOCATION
│  ├─ /location
│  │  ├─ /backoffice
│  │  ├─ /profil
│  │  │  ├─ /medien
│  │  │  └─ /preise
│  │  ├─ /anfragen
│  │  │  ├─ /neu
│  │  │  └─ /{requestId}
│  │  ├─ /kalender
│  │  ├─ /angebote
│  │  │  └─ /{offerId}
│  │  ├─ /vertraege
│  │  │  └─ /{contractId}
│  │  ├─ /addons
│  │  │  ├─ /catering
│  │  │  ├─ /technik
│  │  │  └─ /dj
│  │  ├─ /rechnungen
│  │  ├─ /hostings
│  │  │  └─ /{eventId}
│  │  ├─ /feedback
│  │  └─ /einstellungen
│  │     ├─ /team
│  │     └─ /api
│
│  # ACT (Talent / Performer / DJ / Artist)
│  └─ /act
│     ├─ /dashboard
│     ├─ /profil
│     │  ├─ /bio
│     │  ├─ /medien
│     │  ├─ /tech-rider
│     │  └─ /kontakt
│     ├─ /touren
│     │  └─ /{tourId}
│     ├─ /gigs
│     │  └─ /{gigId}
│     ├─ /anfragen
│     ├─ /calendar
│     ├─ /statistiken
│     ├─ /feedback
│     └─ /einstellungen
│        ├─ /team
│        └─ /api
