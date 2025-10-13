<!-- pages/beta/index.vue-->
<template>
  <div>
    <!-- Progress -->
    <div class="progressbar" aria-hidden="true"></div>

    <!-- TOP TICKER (neu) -->
    <div class="top-ticker" role="region" aria-label="Hinweisleiste: Registrierung & Ticketsystem">
      <div class="ticker-viewport" aria-hidden="false">
        <div class="ticker-track">
          <!-- Gruppe A -->
          <ul class="ticker-group">
            <li class="ticker-item"><i class="bi bi-megaphone"></i> Jetzt registrieren – Events vermarkten</li>
            <li class="ticker-item"><i class="bi bi-ticket-perforated"></i> Ticketsystem nutzen – in Minuten live</li>
            <li class="ticker-item"><i class="bi bi-graph-up-arrow"></i> Reichweite & Conversion messen</li>
            <li class="ticker-item"><i class="bi bi-lightning-charge"></i> Beta-Partner werden – Early Pricing sichern</li>
          </ul>
          <!-- Gruppe B (Duplikat für Endlosschleife) -->
          <ul class="ticker-group" aria-hidden="true">
            <li class="ticker-item"><i class="bi bi-megaphone"></i> Jetzt registrieren – Events vermarkten</li>
            <li class="ticker-item"><i class="bi bi-ticket-perforated"></i> Ticketsystem nutzen – in Minuten live</li>
            <li class="ticker-item"><i class="bi bi-graph-up-arrow"></i> Reichweite & Conversion messen</li>
            <li class="ticker-item"><i class="bi bi-lightning-charge"></i> Beta-Partner werden – Early Pricing sichern</li>
          </ul>
          <!-- Gruppe B (Duplikat für Endlosschleife) -->
          <ul class="ticker-group" aria-hidden="true">
            <li class="ticker-item"><i class="bi bi-megaphone"></i> Jetzt registrieren – Events vermarkten</li>
            <li class="ticker-item"><i class="bi bi-ticket-perforated"></i> Ticketsystem nutzen – in Minuten live</li>
            <li class="ticker-item"><i class="bi bi-graph-up-arrow"></i> Reichweite & Conversion messen</li>
            <li class="ticker-item"><i class="bi bi-lightning-charge"></i> Beta-Partner werden – Early Pricing sichern</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top" aria-label="Hauptnavigation">
      <div class="container-fluid container-xxl">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#top" aria-label="Zur Startsektion springen">
          <i class="bi bi-stars text-brand fs-4" aria-hidden="true"></i><strong>Evently24</strong>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Menü öffnen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="nav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li class="nav-item"><a class="nav-link" href="#problem">Problem</a></li>
            <li class="nav-item"><a class="nav-link" href="#solution">Lösung</a></li>
            <li class="nav-item"><a class="nav-link" href="#audiences">Zielgruppen</a></li>
            <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
            <li class="nav-item"><a class="nav-link" href="#roadmap">Roadmap</a></li>
            <li class="nav-item"><a class="nav-link" href="#pricing">Gebühren</a></li>
            <li class="nav-item"><a class="nav-link" href="#beta">Beta</a></li>
            <li class="nav-item ms-lg-2">
              <a class="btn btn-sm btn-brand focus-ring" href="#cta"><span class="sparkle"></span>Jetzt Beta anfragen</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="brand-stripe" aria-hidden="true"></div>
    </nav>

    <!-- HERO -->
    <header id="top" class="hero py-6">
      <div class="bg-tags" aria-hidden="true"></div>
      <div class="container-fluid container-xxl py-lg-4 position-relative" style="z-index:1">
        <div class="row align-items-center g-4">
          <div class="col-lg-7 reveal fade-in">
            <span class="chip-animated badge rounded-pill mb-3 text-white" aria-label="Beta live Hinweis"><i class="bi bi-lightning-charge me-1" aria-hidden="true"></i> Beta live in deiner Region</span>
            <h1 class="display-5 fw-bold mb-2 grad-title">Alle Events. Ein Ort.</h1>
            <p class="lead mb-3">
              Die Plattform, die lokale Kultur sichtbar macht – <strong>Events anlegen</strong> → <strong>Tickets verkaufen</strong> → <strong>Reichweite messen</strong>.
            </p>
            <div class="alert alert-gradient text-white small d-inline-flex align-items-center gap-2 mb-4" role="note" aria-live="polite">
              <i class="bi bi-tag" aria-hidden="true"></i>
              <strong>Early-Adopter: 12 Monate nur 4,4 % + 0,50 €</strong> – danach Standard 5,4 % + 0,50 €.
            </div>
            <div class="d-flex gap-2">
              <a href="#cta" class="btn btn-brand btn-lg px-4 focus-ring"><span class="sparkle"></span><i class="bi bi-rocket-takeoff me-2" aria-hidden="true"></i> Beta-Partner werden</a>
              <a href="#solution" class="btn btn-outline-light btn-lg px-4 text-white border-2 focus-ring"><i class="bi bi-play-circle me-2" aria-hidden="true"></i> Wie es funktioniert</a>
            </div>
            <p class="mt-3 small text-white-50">Keine Kreditkarte nötig • DSGVO-konform • Stripe integriert</p>
          </div>
          <div class="col-lg-5">
            <!-- Live-Dashboard (sichtbare KPIs) -->
            <div class="card border-0 glass reveal" aria-label="Demo Live-Dashboard">
              <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="kicker">Live-Dashboard</div>
                    <p class="fs-5 text-white mt-1">Alles auf einen Blick</p>
                  </div>
                  <span class="icon-round" aria-hidden="true"><i class="bi bi-graph-up"></i></span>
                </div>
                <div class="divider-x my-3" aria-hidden="true"></div>
                <div class="row text-center" aria-label="Beispiel-KPIs">
                  <div class="col-4">
                    <div class="fw-bold fs-4 kpi-value" data-countup="1200">0</div>
                    <div class="text-white-50 small">Aufrufe</div>
                  </div>
                  <div class="col-4">
                    <div class="fw-bold fs-4 kpi-value" data-countup="384">0</div>
                    <div class="text-white-50 small">Tickets</div>
                  </div>
                  <div class="col-4">
                    <div class="fw-bold fs-4 kpi-value" data-countup="8.4" data-suffix="%">0%</div>
                    <div class="text-white-50 small">Conversion</div>
                  </div>
                </div>
                <div class="mt-4 d-flex align-items-center gap-2"><i class="bi bi-badge-ad text-brand" aria-hidden="true"></i><span class="small text-white-50">Automatische Social Ads aktiv</span></div>
              </div>
            </div>
            <p class="text-white-50 small mt-3 mb-0">Beispieldaten zu Demo-Zwecken</p>
          </div>
        </div>
      </div>
    </header>

    <!-- PROBLEM -->
    <section id="problem" class="py-6 section-soft">
      <div class="container-fluid container-xxl">
        <div class="row justify-content-center text-center mb-5">
          <div class="col-lg-9 reveal">
            <div class="kicker">Das Problem</div>
            <h2 class="section-title grad-title">Lokale Events sind überall – nur niemand findet sie.</h2>
            <p class="lead-muted">Veranstalter, Locations und Künstler posten überall – doch ohne zentrales System ist es mühsam, ineffizient und kaum messbar.</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-postcard"></i></span><h3 class="h6 mt-3">Zerstreute Sichtbarkeit</h3><p class="text-muted small mb-0">Kein zentraler Ort für lokale Kultur- & Freizeitangebote.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-hourglass-split"></i></span><h3 class="h6 mt-3">Zeitfresser</h3><p class="text-muted small mb-0">10 Posts, 5 Tools, 0 Automatisierung.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-cash-coin"></i></span><h3 class="h6 mt-3">Werbung kompliziert</h3><p class="text-muted small mb-0">Business Manager, Pixel, Zielgruppen – für viele zu komplex.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-search"></i></span><h3 class="h6 mt-3">Kaum Daten</h3><p class="text-muted small mb-0">Ohne Tracking bleibt’s Bauchgefühl statt Messbarkeit.</p></div></div></div>
        </div>
      </div>
    </section>

    <!-- LÖSUNG -->
    <section id="solution" class="py-6">
      <div class="container-fluid container-xxl">
        <div class="row align-items-center g-5">
          <div class="col-lg-6 reveal">
            <div class="kicker">Die Lösung</div>
            <h2 class="section-title grad-title">Ein Ort für Events, Tickets, Werbung & Profile.</h2>
            <p class="mb-3">Einmal eintragen <span class="mx-1"><i class="bi bi-arrow-right"></i></span> überall sichtbar. Ticketverkauf via Stripe. Automatische Social Ads (Meta, TikTok). Profile für Locations & Künstler. Live-Dashboard mit echten Zahlen.</p>
            <ul class="list-unstyled">
              <li class="mb-2"><i class="bi bi-check-circle-fill check-icon me-2"></i>Event in Minuten anlegen – ohne Technik</li>
              <li class="mb-2"><i class="bi bi-check-circle-fill check-icon me-2"></i>Location-Profil mit Räumen, Kapazitäten & Media</li>
              <li class="mb-2"><i class="bi bi-check-circle-fill check-icon me-2"></i>Künstler-/Coach-Profil mit Referenzen & Terminen</li>
              <li class="mb-2"><i class="bi bi-check-circle-fill check-icon me-2"></i>Automatisierte Ads – Budget festlegen, fertig</li>
            </ul>
            <a href="#audiences" class="btn btn-outline-brand mt-2 focus-ring"><i class="bi bi-people me-2"></i>Passende Ansicht wählen</a>
          </div>

          <!-- MOSAIC -->
          <div class="col-lg-6 reveal">
            <div class="media-mosaic" aria-label="Visuelle Beispielkarten">
              <!-- Großes Poster -->
              <div class="tile" style="grid-column:1; grid-row:1 / span 2;">
                <img src="https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop" alt="Open-Air Konzert in Berlin">
                <div class="corner-badge"><i class="bi bi-geo-alt"></i> Berlin</div>
                <div class="label">
                  <span class="pill">Sa · 21:00</span>
                  <span class="mini"><i class="bi bi-people"></i> 2.3k interessiert</span>
                </div>
              </div>

              <!-- Logo & Claim -->
              <div class="tile logo-tile" style="grid-column:2; grid-row:1;">
                <div class="brand-card">
                  <div class="wordmark"><i class="bi bi-stars"></i><strong>Evently24</strong></div>
                  <div class="sub">Alle Events. Ein Ort. – Finde, buche & promote in Minuten.</div>
                </div>
              </div>

              <!-- Kleines Poster -->
              <div class="tile" style="grid-column:2; grid-row:2;">
                <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop" alt="Comedy Night Plakat">
                <div class="corner-badge"><i class="bi bi-ticket-perforated"></i> ab 12 €</div>
                <div class="label">
                  <span class="pill">Comedy Night</span>
                  <span class="mini"><i class="bi bi-clock"></i> Fr · 19:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VOLLE ROUTEN-LEISTE -->
        <div class="row">
          <div class="col-12">
            <div class="route-bar" aria-label="Hashtag-Routen">
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>konzerte</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>partys</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>theater</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>familie</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>workshops</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>startups</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>sport</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>messe</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>kunst</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>food</a>
              <a class="chip-route" href="#routes"><i class="bi bi-hash"></i>tech</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AUDIENCES -->
    <section id="audiences" class="py-6 section-soft">
      <div class="container-fluid container-xxl">
        <div class="row text-center mb-4">
          <div class="col-lg-10 mx-auto reveal">
            <div class="kicker">Zielgruppen</div>
            <h2 class="section-title">Wähle, was du machen willst</h2>
            <p class="lead-muted mb-0">Eine Plattform – drei Perspektiven. Veranstalter, Locations und Künstler/Coaches finden hier genau das, was sie brauchen.</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="d-flex justify-content-center mb-4 reveal">
          <div class="audience-nav" role="tablist" id="audienceTab">
            <div class="audience-indicator" aria-hidden="true"></div>
            <button class="nav-link active" id="org-tab" data-bs-toggle="tab" data-bs-target="#org" type="button" role="tab" aria-controls="org" aria-selected="true"><i class="bi bi-calendar2-check"></i> Veranstalter</button>
            <button class="nav-link" id="loc-tab" data-bs-toggle="tab" data-bs-target="#loc" type="button" role="tab" aria-controls="loc" aria-selected="false"><i class="bi bi-geo-alt"></i> Locations</button>
            <button class="nav-link" id="art-tab" data-bs-toggle="tab" data-bs-target="#art" type="button" role="tab" aria-controls="art" aria-selected="false"><i class="bi bi-music-note-beamed"></i> Künstler & Coaches</button>
          </div>
        </div>

        <div class="tab-content" id="audienceTabContent">
          <!-- Veranstalter -->
          <div class="tab-pane fade show active" id="org" role="tabpanel" aria-labelledby="org-tab">
            <div class="row g-4">
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-plus-square-dotted"></i></span><h3 class="h6 mt-3">Events in Minuten anlegen</h3><p class="text-muted small mb-0">Einmal eintragen, überall sichtbar: Plattform, Website-Widget & Socials.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-ticket-perforated"></i></span><h3 class="h6 mt-3">Ticketing & Stripe</h3><p class="text-muted small mb-0">Sichere Zahlungen, Auszahlungen direkt an dich.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-badge-ad"></i></span><h3 class="h6 mt-3">Automatische Social Ads</h3><p class="text-muted small mb-0">Meta & TikTok mit A/B-Optimierung – Budget festlegen, fertig.</p></div></div></div>
            </div>
            <div class="text-center mt-4"><a href="#cta" class="btn btn-brand focus-ring"><span class="sparkle"></span><i class="bi bi-rocket me-2"></i> Jetzt als Veranstalter starten</a></div>
          </div>

          <!-- Locations -->
          <div class="tab-pane fade" id="loc" role="tabpanel" aria-labelledby="loc-tab">
            <div class="row g-4">
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-building"></i></span><h3 class="h6 mt-3">Location-Profil</h3><p class="text-muted small mb-0">Räume, Kapazitäten, Technik, Fotos & Ansprechpartner – alles an einem Ort.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-window-stack"></i></span><h3 class="h6 mt-3">Einbettung & Sichtbarkeit</h3><p class="text-muted small mb-0">Widget/iFrame für die eigene Website, automatische Aktualisierung.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-person-lines-fill"></i></span><h3 class="h6 mt-3">Anfragen & Leads</h3><p class="text-muted small mb-0">Buchungsanfragen von Veranstaltern direkt im Postfach – DSGVO-konform.</p></div></div></div>
            </div>
            <div class="text-center mt-4"><a href="#cta" class="btn btn-brand focus-ring"><span class="sparkle"></span><i class="bi bi-geo-alt me-2"></i> Location jetzt präsentieren</a></div>
          </div>

          <!-- Künstler & Coaches -->
          <div class="tab-pane fade" id="art" role="tabpanel" aria-labelledby="art-tab">
            <div class="row g-4">
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-person-badge"></i></span><h3 class="h6 mt-3">Öffentliches Profil</h3><p class="text-muted small mb-0">Bio, Referenzen, Media-Kit & Kontakt – buchbar auf einen Blick.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-broadcast-pin"></i></span><h3 class="h6 mt-3">Auftritte & Seminare</h3><p class="text-muted small mb-0">Termine anlegen, bewerben & Tickets/Anmeldungen direkt verkaufen.</p></div></div></div>
              <div class="col-lg-4 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="icon-round"><i class="bi bi-megaphone"></i></span><h3 class="h6 mt-3">Reichweite auf Autopilot</h3><p class="text-muted small mb-0">Automatisierte Social Ads & Tracking – du performst, wir promoten.</p></div></div></div>
            </div>
            <div class="text-center mt-4"><a href="#cta" class="btn btn-brand focus-ring"><span class="sparkle"></span><i class="bi bi-music-note-beamed me-2"></i> Künstler/Coach Profil erstellen</a></div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="py-6">
      <div class="container-fluid container-xxl">
        <div class="row text-center mb-5">
          <div class="col-lg-9 mx-auto reveal">
            <div class="kicker">Features</div>
            <h2 class="section-title">Was heute schon funktioniert – und was als Nächstes kommt</h2>
            <p class="lead-muted">Wir starten mit einem stabilen Kern und erweitern phasenweise – bewusst, datengetrieben, gemeinsam mit unseren Beta-Partnern.</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="badge badge-soft rounded-pill mb-2">Live</span><h3 class="h6">Eventanlage & Veröffentlichung</h3><p class="text-muted small mb-0">Einfach, schnell, mobil. Einmal anlegen, überall sichtbar.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="badge badge-soft rounded-pill mb-2">Live</span><h3 class="h6">Ticketverkauf mit Stripe</h3><p class="text-muted small mb-0">Sichere Zahlungen, Auszahlungen direkt an dich.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="badge bg-warning-subtle text-warning-emphasis rounded-pill mb-2">In Entwicklung</span><h3 class="h6">Automatische Social Ads</h3><p class="text-muted small mb-0">Meta & TikTok, inkl. A/B-Tests & Budget-Optimierung.</p></div></div></div>
          <div class="col-md-6 col-lg-3 reveal"><div class="card card-feature h-100"><div class="card-body"><span class="badge bg-warning-subtle text-warning-emphasis rounded-pill mb-2">Geplant</span><h3 class="h6">Community & Empfehlungen</h3><p class="text-muted small mb-0">Freunde, Künstler/Location-Matching, lokale Feeds.</p></div></div></div>
        </div>
      </div>
    </section>

    <!-- ROADMAP -->
    <section id="roadmap" class="py-6 section-soft">
      <div class="container-fluid container-xxl">
        <div class="row align-items-start g-4">
          <div class="col-lg-5 my-auto reveal">
            <div class="kicker">Roadmap</div>
            <h2 class="section-title grad-title">Stabil, phasenweise, gemeinsam mit euch.</h2>
            <p class="lead-muted">
              Wir liefern in klaren Ausbaustufen. Beta-Partner priorisieren mit.
              <span class="d-block mt-2 text-muted small">Initial werden die ersten {{ initialVisible }} Schritte gezeigt – mehr auf Klick.</span>
            </p>
          </div>

          <!-- Inline: nur die ersten N Schritte -->
          <div class="col-lg-7">
            <ol class="roadmap-list" :aria-label="`Roadmap – aktuell ${initialVisible} von ${phases.length} Schritten sichtbar`">
              <li v-for="(p, i) in phases.slice(0, initialVisible)" :key="p.id" class="roadmap-step p-3 mb-3 reveal">
                <div class="d-flex align-items-start gap-3">
                  <span class="step-index" :aria-label="`Schritt ${i+1}`">{{ i + 1 }}</span>
                  <div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                      <strong>{{ p.title }}</strong>
                      <span v-if="p.badge" :class="['badge', p.badgeClass, 'rounded-pill']">{{ p.badge }}</span>
                    </div>
                    <p class="mb-1 small text-muted">{{ p.desc }}</p>
                    <ul v-if="p.bullets?.length" class="small text-muted mb-0 ps-3">
                      <li v-for="(b, k) in p.bullets" :key="k">{{ b }}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ol>

            <!-- Button: öffnet Custom Modal -->
            <div class="d-flex">
              <button
                type="button"
                ref="openRoadmapBtn"
                class="btn btn-outline-brand mx-auto focus-ring"
                @click="openModal"
                :aria-controls="'roadmapCustomModal'"
                aria-expanded="false"
              >
                <i class="bi bi-plus-circle me-1" aria-hidden="true"></i> Mehr anzeigen
              </button>
            </div>

            <div class="d-flex">
              <p class="disclaimer mx-auto mt-3 mb-0">
                Zeitangaben sind Richtwerte; Inhalte werden nach Beta-Feedback priorisiert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOM ROADMAP MODAL -->
    <div
      v-if="showRoadmap"
      class="custom-modal-backdrop"
      @click="closeModal"
      :aria-hidden="false"
    >
      <div
        id="roadmapCustomModal"
        class="custom-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roadmapModalLabel"
        aria-describedby="roadmapModalDesc"
        tabindex="-1"
        ref="modalRef"
        @click.stop
      >
        <div class="custom-modal-header">
          <h5 id="roadmapModalLabel" class="mb-0">Roadmap – alle {{ phases.length }} Schritte</h5>
          <button type="button" class="btn-close focus-ring" aria-label="Schließen" @click="closeModal"></button>
        </div>
        <div id="roadmapModalDesc" class="custom-modal-body">
          <ol class="roadmap-list modal-roadmap-list" :aria-label="`Roadmap Vollansicht – ${phases.length} Schritte`">
            <li v-for="(p, i) in phases" :key="p.id" class="roadmap-step p-3 mb-3">
              <div class="d-flex align-items-start gap-3">
                <span class="step-index" :aria-label="`Schritt ${i+1}`">{{ i + 1 }}</span>
                <div>
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <strong>{{ p.title }}</strong>
                    <span v-if="p.badge" :class="['badge', p.badgeClass, 'rounded-pill']">{{ p.badge }}</span>
                  </div>
                  <p class="mb-1 small text-muted">{{ p.desc }}</p>
                  <ul v-if="p.bullets?.length" class="small text-muted mb-0 ps-3">
                    <li v-for="(b, k) in p.bullets" :key="k">{{ b }}</li>
                  </ul>
                </div>
              </div>
            </li>
          </ol>
        </div>
        <div class="custom-modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="closeModal">Schließen</button>
        </div>
      </div>
    </div>

    <!-- PRICING -->
    <section id="pricing" class="py-6">
      <div class="container-fluid container-xxl">
        <div class="row text-center mb-5">
          <div class="col-lg-9 mx-auto reveal">
            <div class="kicker">Gebühren</div>
            <h2 class="section-title">Transparente All-in-Fee – fair & nachvollziehbar</h2>
            <p class="lead-muted">Wir verdienen nur, wenn ihr erfolgreich seid. Keine versteckten Kosten, keine Abo-Pflicht.</p>
          </div>
        </div>

        <div class="row g-4 align-items-stretch">
          <!-- Einführungspreis -->
          <div class="col-lg-5 reveal">
            <div class="card h-100 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between">
                  <h3 class="h5 mb-0"><i class="bi bi-cash-coin me-2 text-brand" aria-hidden="true"></i>Einführungspreis</h3>
                  <span class="badge badge-soft rounded-pill">12 Monate</span>
                </div>
                <p class="fs-4 fw-bold mb-1 mt-2">4,4 % <span class="text-muted">+ 0,50 €</span> <span class="fs-6 text-muted">pro verkauftem Ticket</span></p>
                <p class="small text-muted mb-2">Gültig für die ersten 12 Monate ab deinem Onboarding. Danach Standardgebühr.</p>
                <ul class="mt-3 text-muted small list-unstyled">
                  <li class="mb-2"><i class="bi bi-check2 me-2 text-success"></i>Zahlungsabwicklung (Stripe) inklusive</li>
                  <li class="mb-2"><i class="bi bi-check2 me-2 text-success"></i>Hosting, Dashboard & Support inklusive</li>
                  <li class="mb-2"><i class="bi bi-check2 me-2 text-success"></i>Keine Setup-, Grund- oder Mindestgebühren</li>
                </ul>
                <div class="alert alert-secondary small mb-0"><i class="bi bi-exclamation-circle me-2" aria-hidden="true"></i>Bei Premium-Zahlarten (z. B. PayPal, bestimmte Kreditkarten) kann für Käufer ein kleiner Aufpreis entstehen.</div>
              </div>
            </div>
          </div>

          <!-- Standardpreis -->
          <div class="col-lg-7 reveal">
            <div class="card h-100 shadow-sm">
              <div class="card-body p-4">
                <h3 class="h5 mb-3"><i class="bi bi-stars me-2 text-brand" aria-hidden="true"></i>Standard ab Monat 13</h3>
                <p class="fs-4 fw-bold mb-1">5,4 % <span class="text-muted">+ 0,50 €</span> <span class="fs-6 text-muted">pro verkauftem Ticket</span></p>
                <div class="row g-3 mt-1">
                  <div class="col-md-6"><div class="d-flex align-items-start gap-2"><span class="icon-round"><i class="bi bi-bounding-box-circles"></i></span><div><strong>Alles-in-einem</strong><p class="small text-muted mb-0">Events, Tickets, Werbung, Profile & Analyse – ein Workflow.</p></div></div></div>
                  <div class="col-md-6"><div class="d-flex align-items-start gap-2"><span class="icon-round"><i class="bi bi-robot"></i></span><div><strong>Automatisierte Ads</strong><p class="small text-muted mb-0">Meta/TikTok mit A/B-Optimierung – Budget festlegen, fertig.</p></div></div></div>
                  <div class="col-md-6"><div class="d-flex align-items-start gap-2"><span class="icon-round"><i class="bi bi-speedometer2"></i></span><div><strong>Live-Dashboard</strong><p class="small text-muted mb-0">Verkäufe, Reichweite, Conversion – Zahlen statt Bauchgefühl.</p></div></div></div>
                  <div class="col-md-6"><div class="d-flex align-items-start gap-2"><span class="icon-round"><i class="bi bi-puzzle"></i></span><div><strong>Website-Einbindung</strong><p class="small text-muted mb-0">Widget/iFrame – einmal einbinden, alles synchronisiert sich.</p></div></div></div>
                </div>
                <p class="disclaimer mt-3 mb-0">Transparente Konditionen. Du zahlst nur bei echtem Verkauf.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vergleichs-Hinweis -->
        <div class="text-center mt-4 small text-muted">
          Early-Adopter sparen effektiv 1 Prozentpunkt im ersten Jahr – ideal für den Einstieg und schnelles Wachstum.
        </div>
      </div>
    </section>

    <!-- ROUTES -->
    <section id="routes" class="py-6 section-soft">
      <div class="container-fluid container-xxl">
        <div class="row align-items-center g-4">
          <div class="col-lg-5">
            <div class="kicker">Routen</div>
            <h2 class="section-title">Entdecke deine Stadt per Hashtag</h2>
            <p class="lead-muted">Klicke auf eine Route und kuratiere dir deinen Abend – vom <em>#konzerte</em>-Feed bis zum <em>#workshops</em>-Plan.</p>
          </div>
          <div class="col-lg-7">
            <div class="routes-grid">
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>konzerte</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>partys</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>theater</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>familie</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>workshops</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>kunst</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>sport</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>messe</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>food</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>tech</a>
              <a class="route-chip" href="#"><i class="bi bi-hash"></i>startups</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BETA CTA -->
    <section id="beta" class="py-6 hero">
      <div class="container-fluid container-xxl">
        <div class="row align-items-center g-4">
          <div class="col-lg-7 reveal">
            <div class="kicker text-brand">Beta-Programm</div>
            <h2 class="section-title text-white">Wir starten mit 10 Partnern – seid dabei.</h2>
            <ul class="text-white-50 small mb-4">
              <li class="mb-1">Voller Funktionsumfang während der Beta</li>
              <li class="mb-1">Persönlicher Onboarding-Support</li>
              <li class="mb-1">Mitbestimmung der nächsten Features</li>
              <li class="mb-1">Einführungspreis: 12 Monate nur 4,4 % + 0,50 €</li>
            </ul>
            <a id="cta" href="#contact" class="btn btn-brand btn-lg focus-ring"><span class="sparkle"></span><i class="bi bi-send-check me-2" aria-hidden="true"></i> Beta anfragen</a>
            <a href="#faq" class="btn btn-outline-light btn-lg ms-2 focus-ring">Fragen & Antworten</a>
          </div>
          <div class="col-lg-5 reveal">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-4">
                <form aria-label="Beta-Anfrage Formular" id="betaForm">
                  <div class="mb-3"><label class="form-label">Name</label><input type="text" class="form-control" placeholder="Max Mustermann" required></div>
                  <div class="mb-3"><label class="form-label">E-Mail</label><input type="email" class="form-control" placeholder="max@veranstalter.de" required></div>
                  <div class="mb-3">
                    <label class="form-label">Du bist …</label>
                    <select class="form-select" aria-label="Rolle auswählen">
                      <option>Veranstalter</option>
                      <option>Location</option>
                      <option>Künstler / Coach</option>
                    </select>
                  </div>
                  <div class="mb-3"><label class="form-label">Nachricht</label><textarea class="form-control" rows="3" placeholder="Kurz: Welche Events/Angebote? Ab wann?"></textarea></div>
                  <button type="submit" class="btn btn-brand w-100 focus-ring"><span class="sparkle"></span><i class="bi bi-rocket-takeoff me-2" aria-hidden="true"></i>Anfrage senden</button>
                  <p class="disclaimer small mt-2 mb-0">Mit Absenden bestätigst du die Verarbeitung deiner Angaben gemäß unserer Datenschutzerklärung.</p>
                </form>
              </div>
            </div>
            <p class="text-white-50 small mt-3 mb-0">Wir melden uns in der Regel innerhalb von 24 Stunden.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index:1080">
      <div id="sendToast" class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body"><i class="bi bi-check2-circle me-1" aria-hidden="true"></i> Anfrage gesendet! Wir melden uns zeitnah.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Schließen"></button>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <section id="faq" class="py-6">
      <div class="container-fluid container-xxl">
        <div class="row text-center mb-5">
          <div class="col-lg-9 mx-auto reveal">
            <div class="kicker">FAQ</div>
            <h2 class="section-title">Häufige Fragen – kurz & ehrlich</h2>
            <p class="lead-muted">Keine Floskeln. Nur die Infos, die du wirklich brauchst.</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-6 reveal"><div class="p-4 border rounded-3 h-100"><h3 class="h6"><i class="bi bi-patch-check me-2 text-brand" aria-hidden="true"></i>Was ist schon live?</h3><p class="text-muted small mb-0">Eventanlage, Ticketing (Stripe), Dashboard & Website-Widget. Profile (Basis). Weitere Funktionen werden phasenweise freigeschaltet.</p></div></div>
          <div class="col-lg-6 reveal"><div class="p-4 border rounded-3 h-100"><h3 class="h6"><i class="bi bi-credit-card-2-front me-2 text-brand" aria-hidden="true"></i>Wie sind die Gebühren?</h3><p class="text-muted small mb-0">Einführungspreis: 4,4 % + 0,50 € (12 Monate). Danach: 5,4 % + 0,50 € All-in pro verkauftem Ticket. Bei Premium-Zahlarten kann für Käufer ein kleiner Aufpreis entstehen.</p></div></div>
          <div class="col-lg-6 reveal"><div class="p-4 border rounded-3 h-100"><h3 class="h6"><i class="bi bi-shield-lock me-2 text-brand" aria-hidden="true"></i>Wie sicher ist das?</h3><p class="text-muted small mb-0">Zahlungen via Stripe, DSGVO-konform, EU-Hosting, verschlüsselte Datenflüsse.</p></div></div>
          <div class="col-lg-6 reveal"><div class="p-4 border rounded-3 h-100"><h3 class="h6"><i class="bi bi-diagram-3 me-2 text-brand" aria-hidden="true"></i>Kann ich meine Social Accounts verknüpfen?</h3><p class="text-muted small mb-0">Ja. Werbung kann auf Wunsch im Namen deines Accounts laufen (mit Freigabe).</p></div></div>
        </div>
      </div>
    </section>

    <!-- CONTACT / FOOTER -->
    <footer id="contact" class="py-6 section-soft border-top">
      <div class="container-fluid container-xxl">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="footer-logo"><i class="bi bi-stars" aria-hidden="true"></i><span>Evently24</span></div>
            <p class="text-muted small mt-2">Alle Events. Ein Ort. Die Plattform für Veranstalter, Locations & Künstler – sichtbar, messbar, verkaufbar.</p>
            <ul class="footer-list small text-muted">
              <li><i class="bi bi-geo-alt me-1" aria-hidden="true"></i> Torstraße 123, 10119 Berlin</li>
              <li><i class="bi bi-envelope me-1" aria-hidden="true"></i> <a class="text-decoration-none text-dark" href="mailto:hello@evently24.example">hello@evently24.example</a></li>
              <li><i class="bi bi-telephone me-1" aria-hidden="true"></i> +49 (0)30 123456</li>
            </ul>
          </div>
          <div class="col-md-4">
            <h2 class="fs-6 mb-2">Produkt</h2>
            <ul class="footer-list small">
              <li><a class="text-muted text-decoration-none" href="#solution">Wie es funktioniert</a></li>
              <li><a class="text-muted text-decoration-none" href="#features">Features</a></li>
              <li><a class="text-muted text-decoration-none" href="#pricing">Gebühren</a></li>
              <li><a class="text-muted text-decoration-none" href="#routes">Hashtag-Routen</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h2 class="fs-6 mb-2">Rechtliches</h2>
            <ul class="footer-list small">
              <li><a class="text-muted text-decoration-none" href="#" data-bs-toggle="modal" data-bs-target="#impressumModal">Impressum</a></li>
              <li><a class="text-muted text-decoration-none" href="#" data-bs-toggle="modal" data-bs-target="#datenschutzModal">Datenschutz</a></li>
              <li><a class="text-muted text-decoration-none" href="#" data-bs-toggle="modal" data-bs-target="#agbModal">AGB</a></li>
            </ul>
          </div>
        </div>
        <div class="divider-x my-4" aria-hidden="true"></div>
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
          <div class="small text-muted">© {{ year }} Evently24 – Alle Rechte vorbehalten.</div>
          <div class="small d-flex gap-3">
            <a href="#" class="text-muted text-decoration-none" data-bs-toggle="modal" data-bs-target="#impressumModal">Impressum</a>
            <a href="#" class="text-muted text-decoration-none" data-bs-toggle="modal" data-bs-target="#datenschutzModal">Datenschutz</a>
            <a href="#" class="text-muted text-decoration-none" data-bs-toggle="modal" data-bs-target="#agbModal">AGB</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- (Diese drei bleiben Bootstrap-Modals – nur die Roadmap ist Custom) -->
    <div class="modal fade" id="impressumModal" tabindex="-1" aria-hidden="true" data-bs-scroll="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Impressum – Evently24</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button></div>
        <div class="modal-body small">
          <p><strong>Evently24 GmbH</strong><br>Torstraße 123, 10119 Berlin<br>Geschäftsführung: Max Mustermann<br>Handelsregister: HRB 123456 (AG Berlin)</p>
          <p>USt-IdNr.: DE123456789 • Kontakt: <a href="mailto:hello@evently24.example">hello@evently24.example</a> • Tel.: +49 (0)30 123456</p>
          <p><strong>Haftung für Inhalte</strong><br>Wir sind für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Für fremde Inhalte übernehmen wir keine Gewähr.</p>
          <p><strong>Haftung für Links</strong><br>Externe Links wurden zum Zeitpunkt der Verlinkung geprüft; eine permanente Kontrolle ist nicht zumutbar.</p>
          <p><strong>Urheberrecht</strong><br>Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Schließen</button></div>
      </div></div>
    </div>

    <div class="modal fade" id="datenschutzModal" tabindex="-1" aria-hidden="true" data-bs-scroll="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Datenschutz – Evently24</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button></div>
        <div class="modal-body small">
          <p><strong>Verantwortlicher:</strong> Evently24 GmbH, Torstraße 123, 10119 Berlin, <a href="mailto:hello@evently24.example">hello@evently24.example</a></p>
          <p><strong>Verarbeitungszwecke:</strong> Bereitstellung der Plattform, Ticketkauf (Stripe), Support, Marketing mit Einwilligung.</p>
          <p><strong>Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertrag), lit. a (Einwilligung), lit. f (berechtigtes Interesse).</p>
          <p><strong>Empfänger:</strong> Zahlungsdienstleister (Stripe), Hosting in der EU, Support-Tools.</p>
          <p><strong>Speicherdauer:</strong> Entsprechend gesetzlicher Aufbewahrungspflichten; Supportdaten bis Zweckerfüllung.</p>
          <p><strong>Cookies & Tracking:</strong> Technisch notwendige Cookies; Marketing-Cookies nur mit Einwilligung (CMP).</p>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Schließen</button></div>
      </div></div>
    </div>

    <div class="modal fade" id="agbModal" tabindex="-1" aria-hidden="true" data-bs-scroll="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Allgemeine Geschäftsbedingungen (AGB) – Evently24</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button></div>
      <div class="modal-body small">
        <p><strong>Geltungsbereich:</strong> Diese AGB regeln die Nutzung der Plattform Evently24 für Veranstalter, Locations und Künstler.</p>
        <p><strong>Leistungen:</strong> Eventverwaltung, Ticketverkauf (Stripe), Promotion-Tools, Profile, Widgets.</p>
        <p><strong>Gebühren:</strong> Einführungspreis 12 Monate: 4,4 % + 0,50 € je verkauftem Ticket; danach 5,4 % + 0,50 €; optionale Zusatzleistungen separat.</p>
        <p><strong>Zahlung & Auszahlungen:</strong> Abwicklung via Stripe; Auszahlungen direkt an Veranstalter.</p>
        <p><strong>Widerruf & Erstattungen:</strong> Regelungen je nach Event; Abwicklung nach Veranstalter-Policy.</p>
        <p><strong>Haftung:</strong> Für leichte Fahrlässigkeit nur bei Verletzung wesentlicher Pflichten; im Übrigen nach Gesetz.</p>
        <p><strong>Schlussbestimmungen:</strong> Deutsches Recht; Gerichtsstand Berlin, sofern zulässig.</p>
      </div>
      <div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Schließen</button></div>
      </div></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useHead, definePageMeta } from '#imports'

definePageMeta({
  layout: 'onboarding-layout'
})

useHead({
  title: 'Evently24 – Alle Events. Ein Ort. | Beta',
  htmlAttrs: { lang: 'de' },
  meta: [
    { name: 'description', content: 'Evently24 – Events anlegen, Tickets verkaufen, Reichweite messen. Early-Adopter zahlen 12 Monate nur 4,4% + 0,50 €. Jetzt Beta-Partner werden.' },
    { property: 'og:title', content: 'Evently24 – Alle Events. Ein Ort. | Beta' },
    { property: 'og:description', content: 'Events anlegen → Tickets verkaufen → Reichweite messen. Early-Adopter: 12 Monate 4,4% + 0,50 €. Werde jetzt Beta-Partner.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://evently.de/beta' },
    { property: 'og:image', content: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'index,follow' }
  ],
  link: [{ rel: 'canonical', href: 'https://evently.de/beta' }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Evently24 Beta',
        url: 'https://evently.de/beta',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Evently24',
          url: 'https://evently.de'
        },
        description:
          'Evently24 – Events anlegen, Tickets verkaufen, Reichweite messen. Early-Adopter zahlen 12 Monate nur 4,4 % + 0,50 €.'
      })
    }
  ]
})

const year = ref(new Date().getFullYear())

/** ===== Roadmap Daten ===== */
const initialVisible = 2

const phases = ref([
  { id: 'p1', title: 'Phase 1 – Beta (Live)', badge: 'Live', badgeClass: 'badge-soft', desc: 'Eventanlage, Ticketing (Stripe), Dashboard, Website-Widget, Profile (Basis).', bullets: ['Schnelles Publizieren', 'Check-in/QR (Basis)', 'Grundlegende Analytics'] },
  { id: 'p2', title: 'Phase 2 – Automatisierte Ads', badge: 'In Entwicklung', badgeClass: 'bg-warning-subtle text-warning-emphasis', desc: 'Meta/TikTok-Integration, Pixel, A/B-Tests, Budget-Automation.', bullets: ['Kampagnen aus Event-Templates', 'Auto-Optimierung nach Conversion', 'Retargeting-Optionen'] },
  { id: 'p3', title: 'Phase 3 – Community & Empfehlungen', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Freunde, Künstler/Location-Matching, personalisierte Feeds.', bullets: ['Folgen & Favouriten', 'Empfehlungen per Interessen', 'Social Sharing'] },
  { id: 'p4', title: 'Phase 4 – Education (Academy)', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Best Practices für Veranstalter, Locations & Künstler – kurz & praxisnah.', bullets: ['Mini-Kurse, Checklisten, Playbooks', 'Vorlagen für Eventtexte & Motive', 'Office-Hours/Q&A mit dem Team'] },
  { id: 'p5', title: 'Phase 5 – Künstler & Coaches: Pro-Profile', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Erweiterte Profile mit Booking-Optionen und Referenzen.', bullets: ['Buchungsanfragen & Verfügbarkeiten', 'Media-Kit, Presets & Bewertungen', 'Terminkalender & Serien-Events'] },
  { id: 'p6', title: 'Phase 6 – Locations: Räume & Belegung', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Raumverwaltung, Kapazitäten, Ausstattung, Belegungsübersicht.', bullets: ['Mehrere Räume/Areas', 'Blocker & Optionen', 'Website-Widget mit Filter'] },
  { id: 'p7', title: 'Phase 7 – Integrationen & API', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Zapier/Make, Kalender-Sync, öffentliche API.', bullets: ['Google/Apple Calendar Sync', 'Webhook-Events', 'Export CSV/JSON'] },
  { id: 'p8', title: 'Phase 8 – Mobile App (Attendee & Orga)', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Check-in, Wallet-Tickets, Push-Benachrichtigungen & Vor-Ort-Verkauf (PoS).', bullets: ['Scanner-Modus', 'Offline-Fallback', 'Live-KPIs auf dem Handy'] },
  { id: 'p9', title: 'Phase 9 – Sponsoring & Partner-Marketplace', badge: 'Geplant', badgeClass: 'bg-secondary-subtle text-secondary-emphasis', desc: 'Monetarisierung für Veranstalter/Locations über lokale Sponsoren.', bullets: ['Sponsor-Slots in Routen', 'Co-Branding-Tickets', 'Revenue-Share-Modelle'] }
])

/** ===== Custom Modal State & Logic ===== */
const showRoadmap = ref(false)
const modalRef = ref(null)
const openRoadmapBtn = ref(null)
let scrollYCache = 0
let lastFocused = null
let keydownHandler = null

function lockScroll() {
  scrollYCache = window.scrollY || document.documentElement.scrollTop || 0
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollYCache}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

function unlockScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollYCache)
}

function focusTrap(e) {
  if (e.key !== 'Tab') return
  const root = modalRef.value
  if (!root) return
  const focusables = root.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeModal()
  } else {
    focusTrap(e)
  }
}

function openModal() {
  lastFocused = document.activeElement
  showRoadmap.value = true
  setTimeout(() => {
    lockScroll()
    keydownHandler = (ev) => onKeydown(ev)
    document.addEventListener('keydown', keydownHandler)
    const firstFocusable =
      modalRef.value?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ;(firstFocusable || modalRef.value)?.focus()
  }, 0)
}

function closeModal() {
  document.removeEventListener('keydown', keydownHandler || (()=>{}))
  unlockScroll()
  showRoadmap.value = false
  setTimeout(() => {
    openRoadmapBtn.value?.focus()
  }, 0)
}

onMounted(() => {
  // Progressbar
  const progressbar = document.querySelector('.progressbar')
  const onScroll = () => {
    const h = document.documentElement
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight)
    if (progressbar) progressbar.style.width = (scrolled * 100).toFixed(2) + '%'
  }
  document.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Reveal
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const reveals = document.querySelectorAll('.reveal')
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 })
    reveals.forEach((el) => io.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('in'))
  }

  // KPI CountUp
  function countUp(el, to, { duration = 1100, suffix = '' } = {}) {
    const start = performance.now()
    const from = 0
    const decimals = (to + '').includes('.') ? (to + '').split('.')[1].length : 0
    function tick(now) {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const val = from + (to - from) * eased
      el.textContent = val.toFixed(decimals) + suffix
      if (p < 1) requestAnimationFrame(tick); else el.classList.add('kpi-hit')
    }
    requestAnimationFrame(tick)
  }
  const kpiBox = document.querySelectorAll('[data-countup]')
  if (kpiBox.length) {
    const kpiIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          kpiBox.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-countup') || '0')
            const suffix = el.getAttribute('data-suffix') || ''
            countUp(el, target, { duration: 1100, suffix })
          })
          kpiIO.disconnect()
        }
      })
    }, { threshold: 0.4 })
    kpiIO.observe(kpiBox[0])
  }

  // Audience indicator
  const nav = document.querySelector('.audience-nav')
  const indicator = document.querySelector('.audience-indicator')
  const tabs = nav ? Array.from(nav.querySelectorAll('.nav-link')) : []
  function moveIndicator(active) {
    if (!indicator || !active) return
    const x = active.offsetLeft
    const w = active.offsetWidth
    indicator.style.width = w + 'px'
    indicator.style.transform = `translateX(${x}px)`
  }
  tabs.forEach((btn) => btn.addEventListener('shown.bs.tab', (e) => moveIndicator(e.target)))
  window.addEventListener('load', () => {
    const active = nav?.querySelector('.nav-link.active')
    if (active) moveIndicator(active)
  })
  window.addEventListener('resize', () => {
    const active = nav?.querySelector('.nav-link.active')
    if (active) moveIndicator(active)
  })

  // Feature card ripple cursor
  document.querySelectorAll('.card-feature').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      const mx = (((e.clientX - r.left) / r.width) * 100).toFixed(2) + '%'
      const my = (((e.clientY - r.top) / r.height) * 100).toFixed(2) + '%'
      card.style.setProperty('--mx', mx)
      card.style.setProperty('--my', my)
    }, { passive: true })
  })

  // Toast submit
  const form = document.getElementById('betaForm')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const toast = new window.bootstrap.Toast(document.getElementById('sendToast'), { delay: 2500 })
    toast.show()
    form.reset()
  })

  // Keyword-Cloud
  ;(() => {
    const container = document.querySelector('.bg-tags')
    if (!container) return
    const words = ['Tickets','Stripe','A/B-Tests','Reach','Engagement','KPIs','Conversion','Meta Ads','TikTok Ads','Tracking','Widget','Dashboard','Insights','Promo','Check-in','QR','DSGVO','EU-Hosting','Realtime','Budget','Fans','Community','Matching','Feed','Location','Artist','Coach']
    const count = 22
    const rand = (min, max) => Math.random() * (max - min) + min
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span')
      s.textContent = words[Math.floor(Math.random() * words.length)]
      s.style.top = rand(5, 90) + '%'
      s.style.left = rand(2, 95) + '%'
      s.style.setProperty('--sc', rand(0.85, 1.1).toFixed(2))
      s.style.setProperty('--dur', rand(8, 14).toFixed(2) + 's')
      s.style.setProperty('--dx', `${rand(-18, 18).toFixed(0)}px`)
      s.style.setProperty('--dy', `${rand(-16, 16).toFixed(0)}px`)
      container.appendChild(s)
    }
  })()
})

onBeforeUnmount(() => {
  if (showRoadmap.value) {
    closeModal()
  }
})
</script>

<style>
:root{
  --brandA:#4f46e5; --brandB:#06b6d4; --brandC:#22c55e;
  --ink:#111827; --muted:#6B7280; --bg:#0e0f14; --soft:#F5F7FB;
  --space-4:3.5rem; --space-5:6rem;
}

body{ color:var(--ink); background:#fff }
.py-6{ padding-block:var(--space-4) }
@media (min-width:992px){ .py-6{ padding-block:var(--space-5) } }
.section-title{ margin-bottom:.5rem }
.section-soft{ background:var(--soft) }
.lead-muted{ color:var(--muted) }
.divider-x{ height:1px; background:linear-gradient(90deg,transparent, rgba(0,0,0,.08), transparent) }

/* Progressbar */
.progressbar{ position:fixed; top:0; left:0; height:3px; width:0%; background:linear-gradient(90deg,var(--brandA),var(--brandB));
  z-index:1088; box-shadow:0 0 12px rgba(79,70,229,.45); transform-origin:left center }

/* ===== TOP TICKER ===== */
.top-ticker{
  position:sticky; top:0; z-index:999; /* über Navbar, unter Progressbar */
  background:linear-gradient(90deg, rgba(79,70,229,.08), rgba(6,182,212,.08));
  border-bottom:1px solid rgba(79,70,229,.25);
  color:#1f2937;
  font-weight:600;
  font-size:.9rem;
}
.ticker-viewport{ overflow:hidden }
.ticker-track{
  display:flex; align-items:center; gap:3rem; white-space:nowrap;
  /* Start links (negativ), nach rechts zu 0 -> LTR Endlosschleife */
  transform: translateX(-50%);
  animation: ticker-ltr 28s linear infinite;
  will-change: transform;
}
.ticker-group{
  display:flex; align-items:center; gap:2rem; padding:.5rem 1rem; margin: 0;
}
.ticker-item{
  display:inline-flex; align-items:center; gap:.5rem;
}
.ticker-item i{ color:var(--brandA) }

/* LTR Endlos-Motion: von -50% nach 0%, mit doppelter Gruppe für nahtlosen Loop */
@keyframes ticker-ltr{
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}
@media (prefers-reduced-motion: reduce){
  .ticker-track{ animation:none; transform:none }
}

/* Buttons */
.btn-brand,.chip-animated{ color:#fff!important; border:none; background-image:linear-gradient(120deg,var(--brandA),var(--brandB),var(--brandA));
  background-size:200% 200%; animation: moveGradient 6s ease-in-out infinite; box-shadow:0 10px 30px rgba(79,70,229,.35); position:relative; overflow:hidden }
.btn-brand:hover{ filter:brightness(.98) }
@keyframes moveGradient{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@media (prefers-reduced-motion:reduce){ .btn-brand,.chip-animated{ animation:none } }
.btn-outline-brand{ border-color:var(--brandA); color:var(--brandA) }
.btn-outline-brand:hover{ background:linear-gradient(120deg,var(--brandA),var(--brandB)); color:#fff }
.btn-brand .sparkle{ position:absolute; inset:0; pointer-events:none; background:
  radial-gradient(6px 6px at 20% 40%, rgba(255,255,255,.7), transparent 60%),
  radial-gradient(4px 4px at 70% 30%, rgba(255,255,255,.7), transparent 60%),
  radial-gradient(5px 5px at 40% 70%, rgba(255,255,255,.7), transparent 60%); mix-blend-mode:screen; opacity:0; transition:opacity .3s }
.btn-brand:hover .sparkle{ opacity:.9 }

.text-brand{ color:var(--brandA) }
.badge-soft{ background:rgba(79,70,229,.12); color:var(--brandA) }
.icon-round{ width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%; background:rgba(79,70,229,.12); color:var(--brandA) }
.card-feature{ border:1px solid #eef1f7; transition:transform .35s, box-shadow .35s; position:relative; overflow:hidden; will-change:transform }
.card-feature::after{ content:""; position:absolute; inset:auto -20% -20% -20%; height:120%;
  background: radial-gradient(40% 40% at var(--mx,50%) var(--my,50%), rgba(79,70,229,.08), transparent 60%); opacity:0; transition:opacity .25s }
.card-feature:hover{ transform:translateY(-4px); box-shadow:0 16px 40px rgba(17,24,39,.08) }
.card-feature:hover::after{ opacity:1 }
.check-icon{ color:var(--brandC) }
.kicker{ font-size:.9rem; letter-spacing:.15em; text-transform:uppercase; color:var(--brandA); font-weight:700 }
.focus-ring:focus{ outline:3px solid rgba(6,182,212,.45)!important; outline-offset:2px }

/* Gradient Headlines */
.grad-title{ background:linear-gradient(120deg,var(--brandA),var(--brandB)); -webkit-background-clip:text; background-clip:text; color:transparent }

/* Gradient alert (hero hint) – Text weiß */
.alert-gradient{
  background:linear-gradient(120deg, rgba(79,70,229,.15), rgba(6,182,212,.15));
  border:1px solid rgba(79,70,229,.35);
  color:#fff;
  padding:.4rem .65rem;
  border-radius:.5rem
}

/* Hero */
.hero{ position:relative; overflow:hidden; color:#fff; background:var(--bg) }
.hero::before,.hero::after{ content:""; position:absolute; border-radius:50%; filter:blur(60px); opacity:.45; pointer-events:none }
.hero::before{ width:60rem;height:60rem; right:-25rem; top:-25rem; background: radial-gradient(closest-side, rgba(6,182,212,.35), transparent 70%) }
.hero::after{ width:50rem;height:50rem; left:-25rem; bottom:-25rem; background: radial-gradient(closest-side, rgba(79,70,229,.35), transparent 70%) }
.glass{ background:rgba(255,255,255,.08); box-shadow:0 20px 50px rgba(0,0,0,.25); border:1px solid rgba(255,255,255,.18); backdrop-filter:blur(10px) }
.kpi-value{ color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); line-height:1 }

/* Keyword-Cloud (Hero) */
.bg-tags{ position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0 }
.bg-tags span{ position:absolute; font-size:.78rem; letter-spacing:.02em; padding:.25rem .6rem; border-radius:999px;
  color:rgba(255,255,255,.55); background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); opacity:.15; filter:blur(.2px);
  white-space:nowrap; user-select:none; transform:translate3d(0,0,0) scale(var(--sc,1)); mix-blend-mode:lighten; animation: drift var(--dur,10s) ease-in-out infinite alternate }
@keyframes drift{ 0%{transform:translateY(0) translateX(0) scale(var(--sc,1))} 100%{transform:translateY(var(--dy,-14px)) translateX(var(--dx,16px)) scale(var(--sc,1))} }
@media (max-width:575.98px){ .bg-tags{ display:none } }
@media (prefers-reduced-motion:reduce){ .bg-tags span{ animation:none } }

/* Audience Tabs */
.audience-nav{ position:relative; display:inline-flex; padding:.25rem; background:#fff; border-radius:1rem; border:1px solid #e6e8ef }
.audience-nav .nav-link{ border:0; border-radius:.75rem; padding:.65rem 1rem; color:#374151; display:flex; align-items:center; gap:.5rem; background:transparent; z-index:1 }
.audience-nav .nav-link.active{ color:#111827 }
.audience-indicator{
  position:absolute; top:.25rem; bottom:.25rem; left:0;
  width:33%;
  background:linear-gradient(120deg, rgba(79,70,229,.08), rgba(6,182,212,.08)); border:1px solid rgba(79,70,229,.35); border-radius:.75rem;
  transition:transform .35s, width .35s; will-change:transform,width;
}

/* Reveal */
.reveal{ opacity:0; transform:translateY(16px); transition:opacity .6s, transform .6s }
.reveal.in{ opacity:1; transform:none }
.reveal.fade-in{ transform:none }
@media (prefers-reduced-motion:reduce){ .reveal{ opacity:1; transform:none } }

/* KPI pulse */
.kpi-hit{ animation:kpiPulse .75s ease }
@keyframes kpiPulse{ 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }

/* Brand stripe */
.brand-stripe{ height:4px; background:linear-gradient(90deg,var(--brandA),var(--brandB)); box-shadow:0 4px 16px rgba(79,70,229,.25) }

/* ===== MEDIA MOSAIC ===== */
.media-mosaic{ position:relative; display:grid; gap:.75rem; grid-template-columns:1.2fr 1fr; grid-template-rows: 180px 180px; }
@media (min-width:1200px){ .media-mosaic{ grid-template-rows: 200px 200px } }
.tile{ position:relative; overflow:hidden; border-radius:1rem; box-shadow:0 12px 32px rgba(17,24,39,.18) }
.tile img{ width:100%; height:100%; object-fit:cover; transform:scale(1.02); transition:transform .6s ease }
.tile:hover img{ transform:scale(1.06) }
.tile::after{ content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,.05) 60%) }
.tile .label{
  position:absolute; left:.75rem; bottom:.6rem; color:#fff; font-weight:700; font-size:.95rem;
  display:flex; gap:.5rem; align-items:center; padding:.35rem .55rem; border-radius:.6rem;
  background:rgba(0,0,0,.55); backdrop-filter:blur(3px); text-shadow:0 1px 2px rgba(0,0,0,.6)
}
.tile .pill{ font-size:.75rem; padding:.2rem .55rem; border-radius:999px; background:rgba(0,0,0,.7); color:#fff; border:0 }
.tile .mini{ display:flex; gap:.4rem; align-items:center; font-weight:600; opacity:.95 }
.corner-badge{
  position:absolute; top:.6rem; right:.6rem; background:rgba(0,0,0,.65); color:#fff; border:0;
  border-radius:999px; padding:.28rem .6rem; font-size:.78rem; backdrop-filter:blur(4px)
}
.logo-tile{ display:flex; align-items:center; justify-content:center; background: radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,.7), rgba(0,0,0,.55)); border:1px solid rgba(255,255,255,.15) }
.logo-tile::after{ display:none }
.brand-card{ background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.25); border-radius:12px; padding:14px 16px; backdrop-filter:blur(8px); color:#fff; text-align:left; max-width:90% }
.wordmark{ display:flex; align-items:center; gap:.6rem; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.5) }
.wordmark i{ font-size:1.6rem; color:#fff }
.wordmark strong{ font-size:1.35rem; letter-spacing:.3px }
.sub{ color:#fff; opacity:.9; font-size:.92rem; margin-top:.35rem }

/* Volle Routen-Leiste */
.route-bar{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:1rem }
.chip-route{
  display:inline-flex; align-items:center; gap:.35rem; padding:.42rem .8rem; border-radius:999px; font-size:.9rem; font-weight:500;
  background:#fff; border:1px solid #e6e8ef; box-shadow:0 6px 18px rgba(17,24,39,.06)
}
.chip-route i{ color:var(--brandA) }
.chip-route:hover{ border-color:rgba(79,70,229,.45) }

/* ROUTES Chips unten */
.routes-grid{ display:flex; flex-wrap:wrap; gap:.5rem }
.route-chip{ background:linear-gradient(120deg, rgba(79,70,229,.08), rgba(6,182,212,.08)); border:1px solid rgba(79,70,229,.25);
  padding:.45rem .8rem; border-radius:999px; font-weight:500; display:inline-flex; gap:.4rem; align-items:center }
.route-chip i{ color:var(--brandA) }

/* Roadmap (inline) */
.roadmap-list{
  list-style:none; padding-left:0;
  margin:0 auto 1rem;
  counter-reset: step;
  max-width: 760px;
}
.roadmap-step{ background:#fff; border:1px solid #eef1f7; border-radius:.75rem; text-align: left; margin-inline: auto; }
.step-index{
  width:36px; height:36px; border-radius:50%; flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center;
  background:linear-gradient(120deg, rgba(79,70,229,.12), rgba(6,182,212,.12)); border:1px solid rgba(79,70,229,.35);
  font-weight:700; color:#364152
}

/* Roadmap in Modal: volle Breite */
.modal-roadmap-list{ max-width:100%; }

/* ===== CUSTOM MODAL ===== */
.custom-modal-backdrop{
  position:fixed; inset:0; z-index:1085;
  display:flex; align-items:center; justify-content:center;
  background: rgba(10, 12, 16, .45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 24px;
}
.custom-modal{
  background:#fff; color:var(--ink);
  width:min(100%, 600px);
  max-height: calc(100vh - 48px);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(17,24,39,.25);
  display:flex; flex-direction:column;
  outline: none;
}
.custom-modal-header, .custom-modal-footer{
  padding: 14px 16px;
  border-bottom: 1px solid #eef1f7;
}
.custom-modal-footer{ border-top:1px solid #eef1f7; border-bottom:0; }
.custom-modal-header{ display:flex; align-items:center; justify-content:space-between; gap:12px }
.custom-modal-body{
  padding: 16px;
  overflow: auto;
}

/* Footer */
.footer-list{ list-style:none; padding:0; margin:0 }
.footer-list li{ margin-bottom:.35rem }
.footer-logo{ display:flex; align-items:center; gap:.5rem; font-weight:700 }
.footer-logo i{ color:var(--brandA) }
</style>
