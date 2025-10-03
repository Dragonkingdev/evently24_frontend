<template>
  <div class="card shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>Tickets verwalten</strong>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-info" @click="checkReady">
          <i class="bi bi-clipboard-check"></i> Readiness
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="loadAll">
          <i class="bi bi-arrow-repeat"></i> Aktualisieren
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- NAV TABS -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button :class="['nav-link', tab==='categories' && 'active']" @click="tab='categories'">
            <i class="bi bi-collection"></i> Kategorien
          </button>
        </li>
        <li class="nav-item">
          <button :class="['nav-link', tab==='mint_hold' && 'active']" @click="tab='mint_hold'">
            <i class="bi bi-lightning"></i> Erstellen & Reservieren
          </button>
        </li>
        <li class="nav-item">
          <button :class="['nav-link', tab==='tickets' && 'active']" @click="tab='tickets'">
            <i class="bi bi-tags"></i> Tickets
          </button>
        </li>
        <li class="nav-item">
          <button :class="['nav-link', tab==='summary' && 'active']" @click="tab='summary'">
            <i class="bi bi-card-checklist"></i> Summary
          </button>
        </li>
      </ul>

      <!-- TAB: CATEGORIES -->
      <section v-show="tab==='categories'">
        <div class="d-flex align-items-center justify-content-between">
          <h6 class="mb-2">Ticketkategorien</h6>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" @click="loadCategories">
              <i class="bi bi-arrow-repeat"></i> Laden
            </button>
          </div>
        </div>

        <div class="table-responsive mb-3">
          <table class="table align-middle table-hover">
            <thead class="table-light">
              <tr>
                <th style="width:88px">ID</th>
                <th>Name</th>
                <th style="width:140px">Preis</th>
                <th style="width:120px">Stock</th>
                <th style="width:140px">Code</th>
                <th style="width:140px">Verfügbar</th>
                <th style="width:190px" class="text-end">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <!-- EXISTING ROWS -->
              <tr v-for="c in categories" :key="`cat-${c.id}`">
                <td class="text-muted">#{{ c.id }}</td>

                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control" v-model="c._edit.name" />
                  </template>
                  <template v-else>{{ c.name }}</template>
                </td>

                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control" type="number" min="0" step="0.01" v-model.number="c._edit.price" />
                  </template>
                  <template v-else>{{ formatPrice(c.price) }}</template>
                </td>

                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control" type="number" min="0" step="1" v-model.number="c._edit.stock" />
                  </template>
                  <template v-else>{{ c.stock }}</template>
                </td>

                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control" v-model="c._edit.code" />
                  </template>
                  <template v-else>{{ c.code || '—' }}</template>
                </td>

                <td>
                  <span class="badge bg-light text-dark">
                    {{ availableOf(c) }}
                  </span>
                </td>

                <td class="text-end">
                  <div class="btn-group">
                    <template v-if="c._mode==='edit'">
                      <button class="btn btn-sm btn-outline-primary" :disabled="!isDirty(c)" @click="saveExisting(c)">
                        <i class="bi bi-save"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit(c)">
                        <i class="bi bi-x-circle"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="delExisting(c)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </template>
                    <template v-else>
                      <button class="btn btn-sm btn-outline-primary" @click="startEdit(c)">
                        <i class="bi bi-pencil"></i> Bearbeiten
                      </button>
                    </template>
                  </div>
                </td>
              </tr>

              <!-- CREATE ROWS (am Tabellenende) -->
              <tr v-for="(r,i) in newRows" :key="`new-${i}`" class="table-row-new">
                <td class="text-muted">neu</td>
                <td><input class="form-control" v-model="r.name" placeholder="z. B. Stehplatz" required/></td>
                <td><input class="form-control" type="number" min="0" step="0.01" v-model.number="r.price" required/></td>
                <td><input class="form-control" type="number" min="0" step="1" v-model.number="r.stock" required/></td>
                <td><input class="form-control" v-model="r.code" placeholder="(optional)"/></td>
                <td><span class="badge bg-secondary-subtle text-secondary">—</span></td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-danger" @click="newRows.splice(i,1)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- FOOTER ADD -->
              <tr>
                <td colspan="7" class="text-center">
                  <button class="btn btn-outline-primary" @click="addNewRow">
                    <i class="bi bi-plus-lg"></i> Kategorie hinzufügen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SAVE BAR -->
        <div class="d-flex flex-wrap gap-2 justify-content-end">
          <button class="btn btn-primary"
                  :disabled="!canSaveAny"
                  @click="saveAll">
            <i class="bi bi-save me-1"></i> Speichern
          </button>
        </div>

        <!-- JSON-IMPORT (eingeklappt) -->
        <div class="card border-0 border-top mt-4">
          <div class="card-header d-flex align-items-center justify-content-between">
            <div class="fw-semibold">
              <i class="bi bi-braces"></i> JSON-Import (manuell)
            </div>
            <button class="btn btn-sm btn-outline-secondary"
                    data-bs-toggle="collapse"
                    data-bs-target="#manualJsonImport"
                    aria-expanded="false"
                    aria-controls="manualJsonImport">
              <i class="bi bi-chevron-expand"></i> Anzeigen
            </button>
          </div>
          <div id="manualJsonImport" class="collapse">
            <div class="card-body">
              <p class="small text-muted mb-2">
                Struktur: <code>[{ "id": 123?, "code": "VIP"?, "name": "VIP", "price": 99.9, "stock": 50 }]</code>
              </p>
              <div class="d-flex gap-2 mb-2">
                <button class="btn btn-sm btn-outline-secondary" @click="exampleBulk">
                  <i class="bi bi-braces"></i> Beispiel einfügen
                </button>
                <button class="btn btn-sm btn-outline-primary" @click="doBulkUpsert">
                  <i class="bi bi-upload"></i> Übernehmen
                </button>
              </div>
              <textarea class="form-control" rows="6" v-model="bulkText" placeholder='[{"code":"GA","name":"Stehplatz","price":25,"stock":200}]'></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: ERSTELLEN + HOLD -->
      <section v-show="tab==='mint_hold'">
        <!-- EXPLAINER -->
        <div class="alert" :class="isGA ? 'alert-light border' : 'alert-info'">
          <div class="fw-semibold mb-1">
            {{ isGA ? 'Tickets erstellen' : 'Tickets erstellen & Seats reservieren' }}
          </div>
          <div class="small text-muted" v-if="isGA">
            Kein Sitzplan aktiv – <strong>Seat-Labels nicht nötig</strong>. Tickets z. B. für Gästeliste/Komps.
          </div>
          <div class="small text-muted" v-else>
            Mit Seatmap kannst du Tickets optional per Seat-Label erstellen und Seats reservieren (Hold).
          </div>
        </div>

        <!-- CREATE -->
        <div class="card border mb-3">
          <div class="card-body">
            <h6 class="mb-3"><i class="bi bi-coin me-1"></i> Tickets erstellen</h6>

            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label">Kategorie</label>
                <select class="form-select" v-model.number="mint.category_id">
                  <option disabled :value="null">– Kategorie wählen –</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    #{{ c.id }} – {{ c.name }} (frei: {{ availableOf(c) }})
                  </option>
                </select>
              </div>

              <div class="col-md-3">
                <label class="form-label">Stückzahl</label>
                <input class="form-control" type="number" min="1" v-model.number="mint.quantity" placeholder="z. B. 10"/>
              </div>

              <div class="col-md-3" v-if="!isGA">
                <label class="form-label">Seat-Prefix (optional)</label>
                <input class="form-control" v-model="mint.seat_label_prefix" placeholder="z. B. A"/>
              </div>

              <div class="col-md-2">
                <button class="btn btn-outline-primary w-100" @click="mintNow">
                  <i class="bi bi-plus-circle"></i> Erstellen
                </button>
              </div>
            </div>

            <div class="small text-muted mt-2">
              Erstellt <strong>physische Tickets</strong> (ohne Kauf). Stock-Grenzen werden eingehalten.
            </div>
          </div>
        </div>

        <!-- HOLD (nur Seatmap) -->
        <div class="card border" v-if="!isGA">
          <div class="card-body">
            <h6 class="mb-3"><i class="bi bi-shield me-1"></i> Seats reservieren (Hold)</h6>

            <!-- Eingaben -->
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label">Kategorie</label>
                <select class="form-select" v-model.number="seatHold.category_id">
                  <option disabled :value="null">– Kategorie wählen –</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    #{{ c.id }} – {{ c.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-5">
                <label class="form-label">Seat-Labels</label>
                <textarea class="form-control" rows="2" v-model="seatHold.labelsRaw" placeholder="A-1, A-2, A-3"></textarea>
              </div>

              <div class="col-md-1">
                <label class="form-label">TTL</label>
                <input class="form-control" type="number" min="1" v-model.number="seatHold.ttl_days" />
              </div>

              <div class="col-md-2 d-grid gap-2">
                <button class="btn btn-outline-secondary" @click="checkSeatsStatus">
                  <i class="bi bi-search"></i> Status
                </button>
                <button class="btn btn-outline-primary" :disabled="!canCreateHold" @click="createSeatHoldNow">
                  <i class="bi bi-shield"></i> Hold
                </button>
              </div>
            </div>

            <!-- Status Chips -->
            <div v-if="seatsStatusMap && Object.keys(seatsStatusMap).length" class="mt-3">
              <div class="small fw-semibold mb-1">Seat-Status:</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="(st, lbl) in seatsStatusMap" :key="lbl"
                      class="badge"
                      :class="{
                        'bg-success': st==='free',
                        'bg-warning text-dark': st==='reserved',
                        'bg-danger': st==='sold'
                      }">
                  {{ lbl }} • {{ st }}
                </span>
              </div>
            </div>

            <!-- Ergebnis / Aktionen -->
            <div v-if="lastHold.cart_id" class="alert alert-light border mt-3">
              <div class="d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <strong>Hold erstellt:</strong> Cart #{{ lastHold.cart_id }}  
                  <span class="text-muted">• bis {{ formatDate(lastHold.reserved_until) }}</span>
                </div>
                <div class="btn-group mt-2 mt-sm-0">
                  <button class="btn btn-sm btn-outline-secondary" @click="releaseSeatHoldSome(lastHold.cart_id)">
                    <i class="bi bi-x-circle"></i> Alle freigeben
                  </button>
                  <button class="btn btn-sm btn-outline-success" @click="issueHoldSeats(lastHold.cart_id)">
                    <i class="bi bi-check2-circle"></i> Hold ausstellen (gratis)
                  </button>
                </div>
              </div>
              <div class="small mt-2">
                {{ (lastHold.items||[]).map(i => `${i.seat_label}`).join(', ') }}
              </div>
            </div>

            <!-- Manuelle Hold-Operationen -->
            <div class="row g-3 align-items-end mt-3">
              <div class="col-md-4">
                <label class="form-label">Hold-ID (Cart)</label>
                <input class="form-control" v-model.number="holdOps.cart_id" placeholder="z. B. 9876">
              </div>
              <div class="col-md-4">
                <label class="form-label">Seat-Labels (optional: nur Release)</label>
                <input class="form-control" v-model="holdOps.labels" placeholder="A-1,A-2 (leer=alle)">
              </div>
              <div class="col-md-4 d-grid gap-2">
                <button class="btn btn-outline-secondary" @click="releaseSeatHoldSome()">
                  <i class="bi bi-x-circle"></i> Seats freigeben
                </button>
                <button class="btn btn-outline-success" @click="issueHoldSeats()">
                  <i class="bi bi-check2-circle"></i> Hold ausstellen (gratis)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: TICKETS -->
      <section v-show="tab==='tickets'">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="small text-muted">Tickets des Events</div>
          <button v-if="!isGA" class="btn btn-sm btn-outline-primary" @click="openEditor()">
            <i class="bi bi-pencil-square"></i> Ticket-Editor
          </button>
        </div>

        <!-- Filter & Sort -->
        <div class="row g-2 align-items-end mb-3">
          <div class="col-md-4">
            <label class="form-label">E-Mail enthält</label>
            <input class="form-control" v-model.trim="ticketFilters.email" placeholder="z. B. @gmail.com" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Sortieren nach</label>
            <select class="form-select" v-model="ticketSort.by">
              <option value="created_at">Erstellt am</option>
              <option value="id">ID</option>
              <option value="buyer_email">E-Mail</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Reihenfolge</label>
            <select class="form-select" v-model="ticketSort.dir">
              <option value="desc">Absteigend</option>
              <option value="asc">Aufsteigend</option>
            </select>
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-outline-secondary flex-fill" @click="applyTicketQuery">
              <i class="bi bi-filter-circle"></i>
            </button>
            <button class="btn btn-outline-success flex-fill" @click="exportCsv">
              <i class="bi bi-download"></i>
            </button>
          </div>
        </div>

        <!-- Nur erzeugte (frei) -->
        <div class="row g-2 align-items-center mb-2">
          <div class="col-auto">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="onlyMinted" v-model="onlyMinted">
              <label class="form-check-label" for="onlyMinted">
                nur erzeugte (frei)
              </label>
            </div>
          </div>
          <div class="col-auto small text-muted" v-if="onlyMinted">
            zeigt nur Tickets mit <code>reserved = false</code> und <code>sold = false</code>.
          </div>
        </div>

        <!-- Paging -->
        <div class="row g-2 align-items-end mb-2">
          <div class="col-md-2">
            <label class="form-label">Limit</label>
            <input class="form-control" type="number" min="1" max="1000" v-model.number="paging.limit" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Offset</label>
            <input class="form-control" type="number" min="0" v-model.number="paging.offset" />
          </div>
          <div class="col-md-2">
            <label class="form-label d-block">&nbsp;</label>
            <button class="btn btn-outline-secondary w-100" @click="loadTickets">
              <i class="bi bi-arrow-repeat"></i> Laden
            </button>
          </div>
        </div>

        <!-- Tabelle -->
        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th style="width:90px">ID</th>
                <th style="width:120px">Kategorie</th>
                <th style="width:160px">E-Mail</th>
                <th style="width:140px">Seat</th>
                <th style="width:120px">Reserved</th>
                <th style="width:120px">Sold</th>
                <th style="width:200px">Erstellt</th>
                <th style="width:180px" class="text-end"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tickets" :key="t.id">
                <td class="text-muted">#{{ t.id }}</td>
                <td>{{ t.category_id }}</td>
                <td>{{ t.buyer_email || '—' }}</td>
                <td>{{ t.seat_label || '—' }}</td>
                <td><span class="badge" :class="t.reserved ? 'bg-warning' : 'bg-light text-dark'">{{ t.reserved ? 'reserved' : '—' }}</span></td>
                <td><span class="badge" :class="t.sold ? 'bg-success' : 'bg-light text-dark'">{{ t.sold ? 'sold' : '—' }}</span></td>
                <td>{{ formatDate(t.created_at) }}</td>
                <td class="text-end">
                  <div class="btn-group">
                    <button v-if="!isGA" class="btn btn-sm btn-outline-primary" @click="openEditor(t)">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!tickets.length">
                <td colspan="8" class="text-muted">Keine Tickets im aktuellen Filter.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paging Controls -->
        <div class="d-flex justify-content-between align-items-center mt-2">
          <button class="btn btn-sm btn-outline-secondary" :disabled="paging.offset<=0"
                  @click="paging.offset = Math.max(0, paging.offset - paging.limit); loadTickets();">
            <i class="bi bi-chevron-left"></i> Zurück
          </button>
          <button class="btn btn-sm btn-outline-secondary"
                  @click="paging.offset = paging.offset + paging.limit; loadTickets();">
            Weiter <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>

      <section v-show="tab==='summary'">
        <div class="d-flex align-items-center justify-content-between">
          <h6 class="mb-2">Übersicht</h6>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" @click="loadSummary">
              <i class="bi bi-arrow-repeat"></i> Aktualisieren
            </button>
            <button class="btn btn-sm btn-success" @click="publish">
              <i class="bi bi-megaphone"></i> Event veröffentlichen
            </button>
          </div>
        </div>

        <div v-if="summary" class="row g-3">
          <div class="col-12">
            <div class="alert alert-light border">
              <div class="d-flex gap-4 flex-wrap mb-1">
                <div><strong>Erzeugt:</strong> {{ summary.totals.minted }}</div>
                <div><strong>Sold:</strong> {{ summary.totals.sold }}</div>
                <div><strong>Reserved:</strong> {{ summary.totals.reserved }}</div>
                <div><strong>Available:</strong> {{ summary.totals.available }}</div>
              </div>
              <div class="small text-muted">Event ID: {{ summary.event_id }}</div>
            </div>
          </div>

          <div class="col-12">
            <div class="table-responsive">
              <table class="table align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="width:140px">Kategorie-ID</th>
                    <th>Erzeugt</th>
                    <th>Sold</th>
                    <th>Reserved</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, cid) in summary.per_category" :key="cid">
                    <td class="text-muted">#{{ cid }}</td>
                    <td>{{ row.minted }}</td>
                    <td>{{ row.sold }}</td>
                    <td>{{ row.reserved }}</td>
                    <td>{{ row.available }}</td>
                  </tr>
                  <tr v-if="!Object.keys(summary.per_category||{}).length">
                    <td colspan="5" class="text-muted">Keine Kategorien verfügbar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-else class="text-muted">Noch keine Daten – <a href="#" @click.prevent="loadSummary">laden</a>.</div>
      </section>

      <pre v-if="debug" class="small mt-4 bg-light p-2 border rounded">{{ debug }}</pre>
    </div>
  </div>

  <!-- Ticket-Editor (Modal) -->
  <div class="modal fade show" tabindex="-1" style="display:block" v-if="editor && editor.open" @click.self="closeEditor">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title"><i class="bi bi-pencil-square me-1"></i> Ticket-Editor</h6>
          <button type="button" class="btn-close" @click="closeEditor"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label">Ticket-ID</label>
              <input class="form-control" v-model.number="editor.ticketId" placeholder="z. B. 1234">
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-secondary w-100" @click="loadTicketIntoEditor">
                <i class="bi bi-search"></i> Laden
              </button>
            </div>
          </div>

          <div v-if="editor.ticket" class="mt-3">
            <div class="alert alert-light border">
              <div><strong>Ticket #{{ editor.ticket.id }}</strong></div>
              <div class="small text-muted">
                Kategorie: {{ editor.ticket.category_id }} • Seat: {{ editor.ticket.seat_label || '—' }} •
                Status:
                <span :class="['badge', editor.ticket.sold?'bg-success':'bg-light text-dark']">{{ editor.ticket.sold?'sold':'—' }}</span>
                <span :class="['badge ms-1', editor.ticket.reserved?'bg-warning':'bg-light text-dark']">{{ editor.ticket.reserved?'reserved':'—' }}</span>
              </div>
            </div>

            <div class="row g-3 align-items-end">
              <div class="col-md-5">
                <label class="form-label">Neues Seat-Label (gleiche Kategorie)</label>
                <input class="form-control" v-model="editor.newSeat" placeholder="z. B. A-12">
              </div>
              <div class="col-md-3 d-grid">
                <button class="btn btn-outline-secondary" @click="checkEditorSeatStatus">
                  <i class="bi bi-search"></i> Seat-Status
                </button>
              </div>
              <div class="col-md-4 d-grid">
                <button class="btn btn-outline-primary" :disabled="!editor.newSeatOk" @click="doSwapSeatFromEditor">
                  <i class="bi bi-arrow-left-right"></i> Seat tauschen
                </button>
              </div>
            </div>

            <div v-if="editor.seatStatus" class="small mt-2">
              Neuer Sitz ist:
              <span class="badge" :class="{
                'bg-success': editor.seatStatus==='free',
                'bg-warning text-dark': editor.seatStatus==='reserved',
                'bg-danger': editor.seatStatus==='sold'
              }">{{ editor.seatStatus }}</span>
            </div>
          </div>

          <div v-else class="text-muted small mt-3">
            Tipp: Wähle in der Ticketliste ein Ticket und klicke <em>Edit</em>, oder gib die Ticket-ID ein.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="closeEditor">Schließen</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== Bootstrap Toast-Container (Alerts) ===== -->
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:1200">
    <div v-for="t in toasts" :key="t.id"
         :class="['toast', 'show', 'align-items-center', 'border-0', toastVariantClass(t.variant)]"
         role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <strong v-if="t.title" class="me-1">{{ t.title }}</strong>{{ t.message }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="dismissToast(t.id)"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

const props = defineProps({
  eventId: { type: [Number, String], required: true },
  mode: { type: String, default: null } // 'ga' | 'reserved'
})

const isReserved = computed(() => (props.mode || '').toLowerCase() === 'reserved')
const isGA = computed(() => !isReserved.value)

const {
  listTicketCategories, patchTicketCategory, deleteTicketCategory,
  addTicketCategories, bulkUpsertCategories,
  mintTickets, listTickets, ticketsSummary,
  saleReadiness, publishEvent,
  seatsStatus, createSeatHold, releaseSeatHold, issueFromSeatHold,
  swapSeat
} = useWorkspaceApi()

// Tabs & debug
const tab = ref('categories')
const debug = ref(null)

/* =========================
 * BOOTSTRAP TOASTS (Alerts)
 * =======================*/
const toasts = ref([])
/** variant: success | danger | warning | info | primary | secondary */
function showToast(variant = 'primary', message = '', title = null, delay = 4000){
  const id = Math.random().toString(36).slice(2)
  toasts.value.push({ id, variant, message, title })
  setTimeout(() => dismissToast(id), delay)
}
function dismissToast(id){
  const i = toasts.value.findIndex(t => t.id === id)
  if (i >= 0) toasts.value.splice(i, 1)
}
function toastVariantClass(v){
  return ({
    success: 'text-bg-success',
    danger: 'text-bg-danger',
    warning: 'text-bg-warning',
    info: 'text-bg-info',
    primary: 'text-bg-primary',
    secondary: 'text-bg-secondary'
  }[v] || 'text-bg-secondary')
}
const toastOk   = (msg, title='Gespeichert') => showToast('success', msg, title)
const toastErr  = (msg, title='Fehler')      => showToast('danger',  msg, title)
const toastInfo = (msg, title='Hinweis')     => showToast('info',    msg, title)

/* =========================
 * CATEGORIES
 * =======================*/
const categories = ref([])
function primeEditable(c){
  return { ...c, _mode: 'view', _edit: { name: c.name, price: c.price, stock: c.stock, code: c.code } }
}
async function loadCategories(){
  const { data, error } = await listTicketCategories(props.eventId)
  if (error) { toastErr('Fehler beim Laden der Kategorien.'); return }
  categories.value = (data || []).map(primeEditable)
}
function startEdit(c){ c._mode = 'edit' }
function cancelEdit(c){ c._edit = { name: c.name, price: c.price, stock: c.stock, code: c.code }; c._mode = 'view' }
function isDirty(c){ return ['name','price','stock','code'].some(k => c._edit[k] !== c[k]) }
function availableOf(c){
  const stock = c._mode==='edit' ? (c._edit.stock ?? 0) : (c.stock ?? 0)
  return Math.max(0, Number(stock) - (c.reserved_count||0) - (c.sold_count||0))
}
async function saveExisting(c){
  if (!isDirty(c)) return
  const payload = {}
  for (const k of ['name','price','stock','code']) if (c._edit[k] !== c[k]) payload[k] = c._edit[k]
  const { data, error } = await patchTicketCategory(props.eventId, c.id, payload)
  if (error) { toastErr('Speichern fehlgeschlagen.'); return }
  Object.assign(c, primeEditable(data))
  toastOk('Kategorie gespeichert.')
}
async function delExisting(c){
  if (c._mode !== 'edit') return
  if (!confirm(`Kategorie ${c.name} löschen?`)) return
  const { error } = await deleteTicketCategory(props.eventId, c.id)
  if (error) { toastErr('Löschen fehlgeschlagen.'); return }
  await loadCategories()
  toastOk('Kategorie gelöscht.')
}
const newRows = ref([])
function addNewRow(){ newRows.value.push({ name:'', price:null, stock:null, code:null }) }
const canSaveAny = computed(() =>
  newRows.value.some(r => r.name?.trim() && Number.isFinite(Number(r.price)) && Number.isFinite(Number(r.stock))) ||
  categories.value.some(c => c._mode==='edit' && isDirty(c))
)
async function saveAll(){
  // Edits
  for (const c of categories.value.filter(c => c._mode==='edit' && isDirty(c))) await saveExisting(c)
  // Creates
  const creates = newRows.value
    .filter(r => r.name?.trim() && Number.isFinite(Number(r.price)) && Number.isFinite(Number(r.stock)))
    .map(r => ({ name: r.name.trim(), price: Number(r.price), stock: Number(r.stock), code: r.code || null }))
  if (creates.length){
    const { error } = await addTicketCategories(props.eventId, creates)
    if (error) { toastErr('Fehler beim Hinzufügen.'); return }
    newRows.value = []
    toastOk('Neue Kategorie(n) hinzugefügt.')
  }
  await loadCategories()
  toastOk('Änderungen gespeichert.')
}
// JSON Import (eingeklappt)
const bulkText = ref('')
function exampleBulk(){
  bulkText.value = JSON.stringify([
    { code: "GA", name: "Stehplatz", price: 25, stock: 200 },
    { code: "VIP", name: "VIP", price: 79, stock: 40 }
  ], null, 2)
}
async function doBulkUpsert(){
  let payload = null
  try { payload = JSON.parse(bulkText.value || '[]') } catch { toastErr('Ungültiges JSON.'); return }
  if (!Array.isArray(payload) || !payload.length) { toastErr('Leeres Array.'); return }
  const { error } = await bulkUpsertCategories(props.eventId, { categories: payload })
  if (error) { toastErr('Bulk Upsert fehlgeschlagen.'); return }
  await loadCategories()
  toastOk('Bulk-Änderungen übernommen.')
}

/* =========================
 * CREATE / HOLDS
 * =======================*/
const mint = reactive({ category_id: null, quantity: 1, seat_label_prefix: '' })
async function mintNow(){
  if (!mint.category_id || !mint.quantity) return
  const body = { category_id: Number(mint.category_id), quantity: Number(mint.quantity), seat_label_prefix: isGA.value ? null : (mint.seat_label_prefix || null) }
  const { data, error } = await mintTickets(props.eventId, body)
  if (error) { toastErr('Erstellen fehlgeschlagen.'); return }
  tab.value = 'tickets'
  paging.offset = 0
  await Promise.allSettled([loadTickets(), loadSummary()])
  debug.value = { created: data }
  toastOk('Tickets erstellt.')
}

// Holds
const seatHold = reactive({ category_id: null, labelsRaw: '', ttl_days: 30 })
const seatsStatusMap = ref({})
const lastHold = reactive({ cart_id: null, reserved_until: null, items: [] })
const canCreateHold = computed(() => {
  const labels = parseLabels(seatHold.labelsRaw)
  if (!seatHold.category_id || !labels.length) return false
  if (!Object.keys(seatsStatusMap.value||{}).length) return false
  return labels.every(lbl => seatsStatusMap.value[lbl] === 'free')
})
function parseLabels(raw){
  return (raw || '').split(/[\s,;\n\r]+/).map(s => s.trim()).filter(Boolean)
}
async function checkSeatsStatus(){
  const labels = parseLabels(seatHold.labelsRaw)
  if (!labels.length) { toastInfo('Bitte Seat-Labels angeben.'); return }
  const { data, error } = await seatsStatus(props.eventId, labels)
  if (error) { toastErr('Seat-Status prüfen fehlgeschlagen.'); return }
  seatsStatusMap.value = data?.status || {}
  showToast('secondary', 'Seat-Status geladen.')
}
async function createSeatHoldNow(){
  const labels = parseLabels(seatHold.labelsRaw)
  if (!seatHold.category_id || !labels.length) return
  const body = { event_id: Number(props.eventId), items: [{ category_id: Number(seatHold.category_id), seat_labels: labels }], ttl_days: Number(seatHold.ttl_days || 30) }
  const { data, error } = await createSeatHold(props.eventId, body)
  if (error) { toastErr('Seat Hold fehlgeschlagen.'); return }
  lastHold.cart_id = data?.cart_id || null
  lastHold.reserved_until = data?.reserved_until || null
  lastHold.items = data?.items || []
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk(`Seat Hold erstellt (Cart #${data?.cart_id ?? '–'}).`)
}
const holdOps = reactive({ cart_id: null, labels: '' })
async function releaseSeatHoldSome(cartIdOverride=null){
  const cid = Number(cartIdOverride ?? holdOps.cart_id)
  if (!cid) return
  const labels = parseLabels(holdOps.labels)
  const body = labels.length ? { seat_labels: labels } : {}
  const { data, error } = await releaseSeatHold(props.eventId, cid, body)
  if (error) { toastErr('Seats freigeben fehlgeschlagen.'); return }
  if (cid === lastHold.cart_id) { lastHold.cart_id = null; lastHold.items = [] }
  debug.value = { release_seats: data }
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk('Seat(s) aus Hold freigegeben.')
}
async function issueHoldSeats(cartIdOverride=null){
  const cid = Number(cartIdOverride ?? holdOps.cart_id)
  if (!cid) return
  const { data, error } = await issueFromSeatHold(props.eventId, cid, {})
  if (error) { toastErr('Hold ausstellen fehlgeschlagen.'); return }
  if (cid === lastHold.cart_id) { lastHold.cart_id = null; lastHold.items = [] }
  debug.value = { issue_seats: data }
  await Promise.allSettled([loadCategories(), loadSummary(), loadTickets()])
  toastOk('Hold ausgestellt (COMP).')
}

/* =========================
 * TICKETS LIST
 * =======================*/
const tickets = ref([])
const paging = reactive({ limit: 100, offset: 0 })
const filter = reactive({ reserved: null, sold: null })
const onlyMinted = ref(false)
const prevFilter = reactive({ reserved: null, sold: null })
watch(onlyMinted, (v) => {
  if (v) { prevFilter.reserved = filter.reserved; prevFilter.sold = filter.sold; filter.reserved = false; filter.sold = false }
  else { filter.reserved = prevFilter.reserved; filter.sold = prevFilter.sold }
})

const ticketFilters = reactive({ email: '' })
const ticketSort = reactive({ by: 'created_at', dir: 'desc' })

function applyTicketQuery(){ paging.offset = 0; loadTickets() }

async function loadTickets(){
  const q = {
    limit: Math.min(Number(paging.limit || 100), 1000),
    offset: Math.max(Number(paging.offset || 0), 0),
    sort_by: ticketSort.by,
    sort_dir: ticketSort.dir
  }
  if (onlyMinted.value) { q.reserved = false; q.sold = false }
  else {
    if (filter.reserved !== null) q.reserved = filter.reserved
    if (filter.sold !== null) q.sold = filter.sold
  }
  if (ticketFilters.email?.trim()) q.buyer_email = ticketFilters.email.trim()
  const { data, error } = await listTickets(props.eventId, q)
  if (error) { toastErr('Fehler beim Laden der Tickets.'); return }
  tickets.value = data || []
}

/* =========================
 * SUMMARY / MISC
 * =======================*/
const summary = ref(null)
async function loadSummary(){
  const { data, error } = await ticketsSummary(props.eventId)
  if (error) { toastErr('Summary fehlgeschlagen.'); return }
  summary.value = data || null
}
async function publish(){
  const { error } = await publishEvent(props.eventId)
  if (error) { toastErr('Publish fehlgeschlagen.'); return }
  toastOk('Event veröffentlicht.')
}
async function checkReady(){
  const { data, error } = await saleReadiness(props.eventId)
  if (error) { toastErr('Prüfung fehlgeschlagen.'); return }
  debug.value = { sale_readiness: data ?? 'OK' }
  showToast('secondary', 'Readiness geprüft.')
}

/* =========================
 * TICKET-EDITOR (Seat Switch)
 * =======================*/
const editor = ref({
  open: false,
  ticketId: null,
  ticket: null,
  newSeat: '',
  seatStatus: null,
  newSeatOk: false
})

function openEditor(row=null){
  editor.value.open = true
  if (row) {
    editor.value.ticketId = row.id
    editor.value.ticket = row
  } else {
    editor.value.ticketId = null
    editor.value.ticket = null
  }
  editor.value.newSeat = ''
  editor.value.seatStatus = null
  editor.value.newSeatOk = false
}
function closeEditor(){ editor.value.open = false }

function findTicketInLocal(id){
  id = Number(id)
  return (tickets.value || []).find(t => Number(t.id) === id) || null
}
async function loadTicketIntoEditor(){
  if (!editor.value.ticketId) return
  const t = findTicketInLocal(editor.value.ticketId)
  if (t) { editor.value.ticket = t; return }
  await loadTickets()
  editor.value.ticket = findTicketInLocal(editor.value.ticketId)
  if (!editor.value.ticket) toastInfo('Ticket nicht gefunden. Filter ggf. anpassen.', 'Info')
}
async function checkEditorSeatStatus(){
  editor.value.seatStatus = null
  editor.value.newSeatOk = false
  if (!editor.value.ticket || !editor.value.newSeat?.trim()) return
  const labels = [editor.value.newSeat.trim()]
  const { data, error } = await seatsStatus(props.eventId, labels)
  if (error) { toastErr('Seat-Status prüfen fehlgeschlagen.'); return }
  editor.value.seatStatus = data?.status?.[labels[0]] || null
  editor.value.newSeatOk = (editor.value.seatStatus === 'free')
  showToast(editor.value.newSeatOk ? 'success' : 'warning', `Neuer Sitz: ${editor.value.seatStatus || 'unbekannt'}`)
}
async function doSwapSeatFromEditor(){
  if (!editor.value.ticket || !editor.value.newSeatOk) return
  const body = { ticket_id: Number(editor.value.ticket.id), new_seat_label: editor.value.newSeat.trim() }
  const { data, error } = await swapSeat(props.eventId, body)
  if (error) { toastErr('Seat-Swap fehlgeschlagen.'); return }
  debug.value = { swap: data }
  await loadTickets()
  const updated = findTicketInLocal(editor.value.ticket.id)
  if (updated) editor.value.ticket = updated
  toastOk('Sitzplatz getauscht.')
}

// Utils
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v); if (isNaN(d)) return '—'
  try { return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) }
  catch {
    const pad = n => String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
function formatPrice(p){
  const n = Number(p); if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR' }).format(n)
}
function exportCsv(){
  const rows = tickets.value || []
  if (!rows.length) { toastInfo('Keine Daten zum Export.'); return }
  const headers = ['id','category_id','buyer_email','seat_label','reserved','sold','created_at']
  const csv = [
    headers.join(','),
    ...rows.map(t => [t.id, t.category_id, (t.buyer_email||''), (t.seat_label||''), t.reserved?1:0, t.sold?1:0, t.created_at].map(v => `"${String(v).replaceAll('"','""')}"`).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `tickets-${props.eventId}.csv`
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  showToast('secondary', 'CSV exportiert.')
}

// Initial load
async function loadAll(){ await Promise.allSettled([loadCategories(), loadTickets(), loadSummary()]) }
onMounted(() => { loadAll() })
</script>

<style scoped>
.table-row-new td { background: var(--bs-light); }
</style>
