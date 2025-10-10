<!-- components/business/workspaces/events/TicketsManager.vue -->
<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <strong>Tickets verwalten</strong>
        <span class="badge" :class="feeBadgeClass">{{ feeBadgeText }}</span>
        <div class="d-flex align-items-center gap-2">
          <label class="small text-muted mb-0">Gebühren:</label>
          <select class="form-select form-select-sm w-auto"
                  v-model="feeModeLocal"
                  :disabled="savingFee">
            <option value="included">inkl. Gebühren</option>
            <option value="added">zzgl. Gebühren</option>
          </select>
        </div>
      </div>
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
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item"><button :class="['nav-link', tab==='categories' && 'active']" @click="tab='categories'"><i class="bi bi-collection"></i> Kategorien</button></li>
        <li class="nav-item"><button :class="['nav-link', tab==='mint_hold' && 'active']" @click="tab='mint_hold'"><i class="bi bi-lightning"></i> Erstellen & Reservieren</button></li>
        <li class="nav-item"><button :class="['nav-link', tab==='tickets' && 'active']" @click="tab='tickets'"><i class="bi bi-tags"></i> Tickets</button></li>
        <li class="nav-item"><button :class="['nav-link', tab==='summary' && 'active']" @click="tab='summary'"><i class="bi bi-card-checklist"></i> Summary</button></li>
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
                <th style="width:180px">Verkaufspreis <span class="text-muted small">(inkl. Gebühren)</span></th>
                <th style="width:190px">Veranstalter (reiner Gewinn)</th>
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

                <!-- Verkaufspreis (inkl. Gebühren) -->
                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control"
                           type="number" min="0" step="0.01"
                           v-model.number="c._edit.gross"
                           :disabled="feeModeLocal==='added'"
                           :title="grossTooltipFromValues(c._edit.net, c._edit.gross)"
                           :class="{ 'is-invalid': feeModeLocal==='included' && !Number.isFinite(Number(c._edit.gross)) }" />
                    <div class="form-text" v-if="feeModeLocal==='added'">wird automatisch aus „Veranstalter“ + Gebühren berechnet</div>
                  </template>
                  <template v-else>
                    <span :title="grossTooltipForCat(c)">{{ formatPrice(c._view.gross) }}</span>
                  </template>
                </td>

                <!-- Veranstalter (reiner Gewinn) -->
                <td>
                  <template v-if="c._mode==='edit'">
                    <input class="form-control"
                           type="number" min="0" step="0.01"
                           v-model.number="c._edit.net"
                           :disabled="feeModeLocal==='included'"
                           :title="netTooltipFromValues(c._edit.net, c._edit.gross)"
                           :class="{ 'is-invalid': feeModeLocal==='added' && !Number.isFinite(Number(c._edit.net)) }" />
                    <div class="form-text" v-if="feeModeLocal==='included'">wird automatisch aus Verkaufspreis − Gebühren berechnet</div>
                  </template>
                  <template v-else>
                    <span :title="netTooltipForCat(c)">{{ formatPrice(c._view.net) }}</span>
                  </template>
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
                  <span class="badge bg-light text-dark">{{ availableOf(c) }}</span>
                </td>

                <td class="text-end">
                  <div class="btn-group">
                    <template v-if="c._mode==='edit'">
                      <button class="btn btn-sm btn-outline-primary" :disabled="!isDirty(c)" @click="saveExisting(c)"><i class="bi bi-save"></i></button>
                      <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit(c)"><i class="bi bi-x-circle"></i></button>
                      <button class="btn btn-sm btn-outline-danger" @click="delExisting(c)"><i class="bi bi-trash"></i></button>
                    </template>
                    <template v-else>
                      <button class="btn btn-sm btn-outline-primary" @click="startEdit(c)"><i class="bi bi-pencil"></i> Bearbeiten</button>
                    </template>
                  </div>
                </td>
              </tr>

              <!-- CREATE ROWS -->
              <tr v-for="(r,i) in newRows" :key="`new-${i}`" class="table-row-new">
                <td class="text-muted">neu</td>
                <td><input class="form-control" v-model="r.name" placeholder="z. B. Stehplatz" required/></td>

                <!-- Verkaufspreis -->
                <td>
                  <input class="form-control" type="number" min="0" step="0.01"
                         v-model.number="r.gross"
                         :disabled="feeModeLocal==='added'"
                         :title="grossTooltipForRow(r)"
                         :required="feeModeLocal==='included'"/>
                  <div class="form-text" v-if="feeModeLocal==='added'">berechnet</div>
                </td>

                <!-- Veranstalter -->
                <td>
                  <input class="form-control" type="number" min="0" step="0.01"
                         v-model.number="r.net"
                         :disabled="feeModeLocal==='included'"
                         :title="netTooltipForRow(r)"
                         :required="feeModeLocal==='added'"/>
                  <div class="form-text" v-if="feeModeLocal==='included'">berechnet</div>
                </td>

                <td><input class="form-control" type="number" min="0" step="1" v-model.number="r.stock" required/></td>
                <td><input class="form-control" v-model="r.code" placeholder="(optional)"/></td>
                <td><span class="badge bg-secondary-subtle text-secondary">—</span></td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-danger" @click="newRows.splice(i,1)"><i class="bi bi-trash"></i></button>
                  </div>
                </td>
              </tr>

              <!-- FOOTER ADD -->
              <tr>
                <td colspan="8" class="text-center">
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
          <button class="btn btn-primary" :disabled="!canSaveAny" @click="saveAll">
            <i class="bi bi-save me-1"></i> Speichern
          </button>
        </div>

        <!-- JSON-IMPORT -->
        <div class="card border-0 border-top mt-4">
          <div class="card-header d-flex align-items-center justify-content-between">
            <div class="fw-semibold"><i class="bi bi-braces"></i> JSON-Import (manuell)</div>
            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#manualJsonImport">
              <i class="bi bi-chevron-expand"></i> Anzeigen
            </button>
          </div>
          <div id="manualJsonImport" class="collapse">
            <div class="card-body">
              <p class="small text-muted mb-2">
                Struktur: <code>[{ "id":123?, "code":"VIP"?, "name":"VIP", "price": 99.9, "stock": 50 }]</code><br>
                Hinweis: Preis bezieht sich auf <em>{{ priceColSuffix }}</em>.
              </p>
              <div class="d-flex gap-2 mb-2">
                <button class="btn btn-sm btn-outline-secondary" @click="exampleBulk"><i class="bi bi-braces"></i> Beispiel einfügen</button>
                <button class="btn btn-sm btn-outline-primary" @click="doBulkUpsert"><i class="bi bi-upload"></i> Übernehmen</button>
              </div>
              <textarea class="form-control" rows="6" v-model="bulkText" placeholder='[{"code":"GA","name":"Stehplatz","price":25,"stock":200}]'></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: ERSTELLEN + HOLD -->
      <section v-show="tab==='mint_hold'">
        <div class="alert" :class="isGA ? 'alert-light border' : 'alert-info'">
          <div class="fw-semibold mb-1">{{ isGA ? 'Tickets erstellen' : 'Tickets erstellen & Seats reservieren' }}</div>
          <div class="small text-muted" v-if="isGA">
            Kein Sitzplan aktiv – <strong>Seat-Labels nicht nötig</strong>. Du kannst zusätzlich <strong>GA-Reservierungen</strong> mit E-Mail anlegen.
          </div>
          <div class="small text-muted" v-else>
            Mit Seatmap kannst du Seats gezielt reservieren (Hold) und einer <strong>E-Mail</strong> zuweisen.
          </div>
          <div class="small text-muted mt-1">Preisangaben verstehen sich: <em>{{ priceColSuffix }}</em>.</div>
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
                  <option v-for="c in categories" :key="c.id" :value="c.id">#{{ c.id }} – {{ c.name }} (frei: {{ availableOf(c) }})</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Stückzahl</label>
                <input class="form-control" type="number" min="1" v-model.number="mint.quantity" placeholder="z. B. 10"/>
              </div>
              <div class="col-md-3" v-if="!isGA">
                <label class="form-label">Seat-Prefix (optional)</label>
                <input class="form-control" v-model="mint.seat_label_prefix" placeholder="z. B. A"/>
              </div>

              <!-- NEU: E-Mail (optional) – wenn gesetzt, werden Tickets direkt als COMP ausgestellt -->
              <div class="col-md-3">
                <label class="form-label">E-Mail (optional)</label>
                <input class="form-control" type="email" v-model.trim="mint.email" placeholder="kunde@example.com" />
              </div>

              <div class="col-md-auto">
                <button class="btn btn-outline-primary w-100" @click="mintNow">
                  <i class="bi bi-plus-circle"></i> Erstellen
                </button>
              </div>
            </div>
            <div class="small text-muted mt-2">
              <template v-if="mint.email?.trim()">
                Erstellt Tickets und stellt sie <strong>als COMP</strong> direkt auf <em>{{ mint.email }}</em> aus (0&nbsp;€-Order).
              </template>
              <template v-else>
                Erstellt <strong>physische Tickets</strong> (frei, ohne Kauf). Für Zuweisung nutze das E-Mail-Feld oder unten <em>Reservieren</em>.
              </template>
            </div>
          </div>
        </div>

        <!-- GA HOLD -->
        <div class="card border mb-3" v-if="isGA">
          <div class="card-body">
            <h6 class="mb-3"><i class="bi bi-shield me-1"></i> Reservieren (GA)</h6>
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label">Kategorie</label>
                <select class="form-select" v-model.number="gaHold.category_id">
                  <option disabled :value="null">– Kategorie wählen –</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">#{{ c.id }} – {{ c.name }}</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Menge</label>
                <input class="form-control" type="number" min="1" v-model.number="gaHold.qty" />
              </div>
              <div class="col-md-2">
                <label class="form-label">TTL (Tage)</label>
                <input class="form-control" type="number" min="1" v-model.number="gaHold.ttl_days" />
              </div>
              <div class="col-md-4">
                <label class="form-label">E-Mail (optional)</label>
                <input class="form-control" type="email" v-model.trim="gaHold.email" placeholder="kunde@example.com" />
              </div>
            </div>
            <div class="row g-2 mt-3">
              <div class="col-md-6 d-grid">
                <button class="btn btn-outline-primary" :disabled="!canCreateGAHold" @click="createGAHoldNow"><i class="bi bi-shield"></i> Hold anlegen</button>
              </div>
              <div class="col-md-6 small text-muted">Reserviert Kontingent; läuft nach TTL ab, wenn kein Kauf erfolgt.</div>
            </div>

            <div v-if="lastGAHold.cart_id" class="alert alert-light border mt-3">
              <div class="d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <strong>GA-Hold:</strong> Cart #{{ lastGAHold.cart_id }}
                  <span class="text-muted">• bis {{ formatDate(lastGAHold.reserved_until) }}</span>
                  <span v-if="lastGAHold.assignee_email" class="badge bg-secondary ms-1">E-Mail: {{ lastGAHold.assignee_email }}</span>
                </div>
                <div class="btn-group mt-2 mt-sm-0">
                  <button class="btn btn-sm btn-outline-secondary" @click="releaseGAHoldNow(lastGAHold.cart_id)"><i class="bi bi-x-circle"></i> Freigeben</button>
                  <button class="btn btn-sm btn-outline-success" @click="issueGAHoldNow(lastGAHold.cart_id)"><i class="bi bi-check2-circle"></i> Ausstellen (gratis)</button>
                </div>
              </div>
              <div class="small mt-2">
                {{ (lastGAHold.items||[]).map(i => `#${i.category_id} × ${i.qty} (${catName(i.category_id)})`).join(', ') }}
              </div>

              <div class="row g-2 align-items-center mt-2">
                <div class="col-md-6 d-grid">
                  <button class="btn btn-sm btn-outline-primary" @click="fetchGaCheckoutLink(lastGAHold.cart_id)"><i class="bi bi-link-45deg"></i> Checkout-Link</button>
                </div>
                <div class="col-md-6" v-if="lastGAHold.checkout_url">
                  <div class="input-group input-group-sm">
                    <input class="form-control" :value="lastGAHold.checkout_url" readonly />
                    <button class="btn btn-outline-secondary" @click="copyToClipboard(lastGAHold.checkout_url)"><i class="bi bi-clipboard"></i></button>
                    <a class="btn btn-outline-success" :href="lastGAHold.checkout_url" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i></a>
                  </div>
                </div>
              </div>

              <div class="row g-2 mt-2">
                <div class="col-md-6"><input class="form-control" v-model.trim="gaIssueEmail" type="email" placeholder="E-Mail fürs Ausstellen (optional)" /></div>
                <div class="col-md-6 small text-muted">Wenn leer, wird die Hold-E-Mail (falls vorhanden) genutzt.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- HOLD (Seatmap) -->
        <div class="card border" v-if="!isGA">
          <div class="card-body">
            <h6 class="mb-3"><i class="bi bi-shield me-1"></i> Seats reservieren (Hold)</h6>

            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label">Kategorie</label>
                <select class="form-select" v-model.number="seatHold.category_id">
                  <option disabled :value="null">– Kategorie wählen –</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">#{{ c.id }} – {{ c.name }}</option>
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
                <button class="btn btn-outline-secondary" @click="checkSeatsStatus"><i class="bi bi-search"></i> Status</button>
                <button class="btn btn-outline-primary" :disabled="!canCreateHold" @click="createSeatHoldNow"><i class="bi bi-shield"></i> Hold</button>
              </div>
            </div>

            <div class="row g-3 align-items-end mt-2">
              <div class="col-md-4">
                <label class="form-label">E-Mail (optional)</label>
                <input class="form-control" type="email" v-model.trim="seatHold.email" placeholder="kunde@example.com" />
              </div>
              <div class="col-md-8 small text-muted">Wird beim Ausstellen als Käuferadresse genutzt (oder überschrieben, wenn unten explizit angegeben).</div>
            </div>

            <div v-if="seatsStatusMap && Object.keys(seatsStatusMap).length" class="mt-3">
              <div class="small fw-semibold mb-1">Seat-Status:</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="(st, lbl) in seatsStatusMap" :key="lbl"
                      class="badge"
                      :class="{ 'bg-success': st==='free', 'bg-warning text-dark': st==='reserved', 'bg-danger': st==='sold' }">
                  {{ lbl }} • {{ st }}
                </span>
              </div>
            </div>

            <div v-if="lastHold.cart_id" class="alert alert-light border mt-3">
              <div class="d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <strong>Hold erstellt:</strong> Cart #{{ lastHold.cart_id }}
                  <span class="text-muted">• bis {{ formatDate(lastHold.reserved_until) }}</span>
                  <span v-if="lastHold.assignee_email" class="badge bg-secondary ms-1">E-Mail: {{ lastHold.assignee_email }}</span>
                </div>
                <div class="btn-group mt-2 mt-sm-0">
                  <button class="btn btn-sm btn-outline-secondary" @click="releaseSeatHoldSome(lastHold.cart_id)"><i class="bi bi-x-circle"></i> Alle freigeben</button>
                  <button class="btn btn-sm btn-outline-success" @click="issueHoldSeats(lastHold.cart_id)"><i class="bi bi-check2-circle"></i> Hold ausstellen (gratis)</button>
                </div>
              </div>
              <div class="small mt-2">{{ (lastHold.items||[]).map(i => `${i.seat_label}`).join(', ') }}</div>

              <div class="row g-2 align-items-center mt-2">
                <div class="col-md-6 d-grid">
                  <button class="btn btn-sm btn-outline-primary" @click="fetchSeatCheckoutLink(lastHold.cart_id)"><i class="bi bi-link-45deg"></i> Checkout-Link</button>
                </div>
                <div class="col-md-6" v-if="lastHold.checkout_url">
                  <div class="input-group input-group-sm">
                    <input class="form-control" :value="lastHold.checkout_url" readonly />
                    <button class="btn btn-outline-secondary" @click="copyToClipboard(lastHold.checkout_url)"><i class="bi bi-clipboard"></i></button>
                    <a class="btn btn-outline-success" :href="lastHold.checkout_url" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i></a>
                  </div>
                </div>
              </div>

              <div class="row g-2 mt-2">
                <div class="col-md-6"><input class="form-control" v-model.trim="seatIssueEmail" type="email" placeholder="E-Mail fürs Ausstellen (optional)" /></div>
                <div class="col-md-6 small text-muted">Wenn leer, wird die Hold-E-Mail (falls vorhanden) genutzt.</div>
              </div>
            </div>

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
                <button class="btn btn-outline-secondary" @click="releaseSeatHoldSome()"><i class="bi bi-x-circle"></i> Seats freigeben</button>
                <button class="btn btn-outline-success" @click="issueHoldSeats()"><i class="bi bi-check2-circle"></i> Hold ausstellen (gratis)</button>
                <button class="btn btn-outline-primary" @click="fetchManualCheckoutLink()"><i class="bi bi-link-45deg"></i> Checkout-Link holen</button>
              </div>
              <div class="col-12" v-if="manualCheckout.url">
                <div class="input-group input-group-sm">
                  <input class="form-control" :value="manualCheckout.url" readonly />
                  <button class="btn btn-outline-secondary" @click="copyToClipboard(manualCheckout.url)"><i class="bi bi-clipboard"></i></button>
                  <a class="btn btn-outline-success" :href="manualCheckout.url" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i></a>
                </div>
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
            <button class="btn btn-outline-secondary flex-fill" @click="applyTicketQuery"><i class="bi bi-filter-circle"></i></button>
            <button class="btn btn-outline-success flex-fill" @click="exportCsv"><i class="bi bi-download"></i></button>
          </div>
        </div>

        <div class="row g-2 align-items-center mb-2">
          <div class="col-auto">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="onlyMinted" v-model="onlyMinted">
              <label class="form-check-label" for="onlyMinted">nur erzeugte (frei)</label>
            </div>
          </div>
          <div class="col-auto small text-muted" v-if="onlyMinted">
            zeigt nur Tickets mit <code>reserved = false</code> und <code>sold = false</code>.
          </div>
        </div>

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
            <button class="btn btn-outline-secondary w-100" @click="loadTickets"><i class="bi bi-arrow-repeat"></i> Laden</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th style="width:90px">ID</th>
                <th style="width:220px">Kategorie</th>
                <th style="width:160px">E-Mail</th>
                <th style="width:140px">Seat</th>
                <th style="width:120px">Reserved</th>
                <th style="width:120px">Sold</th>
                <th style="width:200px">Erstellt</th>
                <th style="width:220px" class="text-end">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tickets" :key="t.id">
                <td class="text-muted">#{{ t.id }}</td>
                <td>{{ t.category_name || catName(t.category_id) }}</td>
                <td>{{ t.buyer_email || '—' }}</td>
                <td>{{ t.seat_label || '—' }}</td>
                <td><span class="badge" :class="t.reserved ? 'bg-warning' : 'bg-light text-dark'">{{ t.reserved ? 'reserved' : '—' }}</span></td>
                <td><span class="badge" :class="t.sold ? 'bg-success' : 'bg-light text-dark'">{{ t.sold ? 'sold' : '—' }}</span></td>
                <td>{{ formatDate(t.created_at) }}</td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" @click="openViewer(t)"><i class="bi bi-eye"></i> Anzeigen</button>
                    <button v-if="!isGA" class="btn btn-sm btn-outline-primary" @click="openEditor(t)"><i class="bi bi-pencil"></i> Edit</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!tickets.length">
                <td colspan="8" class="text-muted">Keine Tickets im aktuellen Filter.</td>
              </tr>
            </tbody>
          </table>
        </div>

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

      <pre v-if="debug" class="small mt-4 bg-light p-2 border rounded">{{ debugText }}</pre>
    </div>
  </div>

  <!-- Ticket-Editor (Modal) – Placeholder -->
  <div class="modal fade show" tabindex="-1" style="display:block" v-if="editor && editor.open" @click.self="closeEditor"></div>

  <!-- Ticket-Viewer (Modal) – FIXED -->
  <div class="modal fade show" tabindex="-1" style="display:block" v-if="viewer && viewer.open" @click.self="closeViewer">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Ticket #{{ viewer.ticket?.id || '—' }}
            <span class="ms-2 badge" :class="viewer.ticket?.sold ? 'bg-success' : 'bg-light text-dark'">
              {{ viewer.ticket?.sold ? 'sold' : '—' }}
            </span>
            <span class="ms-1 badge" :class="viewer.ticket?.reserved ? 'bg-warning text-dark' : 'bg-light text-dark'">
              {{ viewer.ticket?.reserved ? 'reserved' : '—' }}
            </span>
          </h5>
          <button type="button" class="btn-close" @click="closeViewer" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="small text-muted">Kategorie</div>
              <div class="fw-semibold">
                {{ viewer.ticket?.category_name || catName(viewer.ticket?.category_id) }}
                <span class="text-muted">(#{{ viewer.ticket?.category_id }})</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="small text-muted">E-Mail</div>
              <div class="fw-semibold">{{ viewer.ticket?.buyer_email || '—' }}</div>
            </div>

            <div class="col-md-6">
              <div class="small text-muted">Seat</div>
              <div class="fw-semibold">{{ viewer.ticket?.seat_label || '—' }}</div>
            </div>
            <div class="col-md-6">
              <div class="small text-muted">Erstellt</div>
              <div class="fw-semibold">{{ formatDate(viewer.ticket?.created_at) }}</div>
            </div>

            <div class="col-md-6" v-if="viewer.ticket?.order_id">
              <div class="small text-muted">Order-ID</div>
              <div class="fw-semibold">#{{ viewer.ticket.order_id }}</div>
            </div>
            <div class="col-md-6" v-if="viewer.ticket?.updated_at">
              <div class="small text-muted">Zuletzt aktualisiert</div>
              <div class="fw-semibold">{{ formatDate(viewer.ticket.updated_at) }}</div>
            </div>

            <div class="col-12" v-if="viewerExtra && viewerExtra.length">
              <hr class="my-2"/>
              <div class="small text-muted mb-1">Weitere Felder</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="row in viewerExtra" :key="row.k" class="badge bg-secondary-subtle text-secondary">
                  {{ row.k }}: {{ row.v }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="!isGA" class="btn btn-outline-primary" @click="openEditor(viewer.ticket)">
            <i class="bi bi-pencil-square"></i> Ticket bearbeiten
          </button>
          <button class="btn btn-secondary" @click="closeViewer">
            Schließen
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap Toasts -->
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:1200">
    <div v-for="t in toasts" :key="t.id"
         :class="['toast','show','align-items-center','border-0', toastVariantClass(t.variant)]"
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
/* ============ Imports & Options ============ */
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
defineOptions({ name: 'TicketsMager' })

/* ============ Props & Basic Mode ============ */
const props = defineProps({
  eventId: { type: [Number, String], required: true },
  mode: { type: String, default: null },       // 'ga' | 'reserved'
  feeMode: { type: String, default: 'included' } // 'included' | 'added'
})
const isReserved = computed(() => (props.mode || '').toLowerCase() === 'reserved')
const isGA = computed(() => !isReserved.value)

/* ============ API ============ */
const {
  listTicketCategories, patchTicketCategory, deleteTicketCategory,
  addTicketCategories, bulkUpsertCategories,
  mintTickets, listTickets, ticketsSummary,
  saleReadiness, publishEvent,
  createGAHold, releaseGAHoldAll, issueFromGAHold,
  seatsStatus, createSeatHold, releaseSeatHold, issueFromSeatHold,
  listHolds, patchHold, holdCheckoutLink,
  swapSeat, patchEvent
} = useWorkspaceApi()

/* ============ Fee Mode UI/State (kein Auto-Save) ============ */
const normalizeFee = v => (v === 'added' ? 'added' : 'included')

const lastSavedFeeMode = ref(normalizeFee(props.feeMode))
const feeModeLocal     = ref(lastSavedFeeMode.value)
const feeModeDirty     = ref(false)

watch(feeModeLocal, (v) => {
  feeModeDirty.value = normalizeFee(v) !== lastSavedFeeMode.value
})
watch(() => props.feeMode, (v) => {
  const next = normalizeFee(v)
  if (!feeModeDirty.value) {
    lastSavedFeeMode.value = next
    feeModeLocal.value     = next
  }
})

const feeBadgeText   = computed(() => feeModeLocal.value === 'added' ? 'zzgl. Gebühren' : 'inkl. Gebühren')
const feeBadgeClass  = computed(() => feeModeLocal.value === 'added' ? 'bg-warning text-dark' : 'bg-secondary')
const priceColSuffix = computed(() => feeModeLocal.value === 'added' ? 'zzgl. Gebühren' : 'inkl. Gebühren')

const emit = defineEmits(['fee-mode-changed','update:feeMode'])

/* ============ Toasts ============ */
const toasts = ref([])
function showToast(variant='primary', message='', title=null, delay=4000){
  const id = Math.random().toString(36).slice(2)
  toasts.value.push({ id, variant, message, title })
  setTimeout(() => dismissToast(id), delay)
}
function dismissToast(id){ const i = toasts.value.findIndex(t => t.id === id); if (i>=0) toasts.value.splice(i,1) }
function toastVariantClass(v){
  return ({ success:'text-bg-success', danger:'text-bg-danger', warning:'text-bg-warning',
    info:'text-bg-info', primary:'text-bg-primary', secondary:'text-bg-secondary' }[v]||'text-bg-secondary')
}
const toastOk  = (m,t='OK')    => showToast('success', m, t)
const toastErr = (m,t='Fehler')=> showToast('danger',  m, t)
const toastInfo= (m,t='Hinweis')=>showToast('info',    m, t)

/* ============ Utils ============ */
function buildCheckoutUrl(path){ try { return new URL(path || '/', window.location.origin).toString() } catch { return String(path || '/') } }
async function copyToClipboard(text){ try { await navigator.clipboard.writeText(text); showToast('secondary','In Zwischenablage kopiert.') } catch { toastInfo('Konnte nicht kopieren – bitte manuell.') } }

/* ============ Fees: Berechnung & Tooltip-Helfer ============ */
const FEE_PCT = 0.075
const FEE_FIXED = 0.50

function calcFee(totalOrNet){ return +(totalOrNet * FEE_PCT + FEE_FIXED).toFixed(2) }
function deriveFromStoredPrice(storedPrice){
  const p = Number(storedPrice || 0)
  if (feeModeLocal.value === 'added'){
    const net   = p
    const gross = +(net + calcFee(net)).toFixed(2)
    return { net, gross }
  } else {
    const gross = p
    const net   = +(gross - calcFee(gross)).toFixed(2)
    return { net: Math.max(0, net), gross }
  }
}
function toStoredPriceForMode(mode, { net, gross }){ return (mode === 'added') ? Number(net || 0) : Number(gross || 0) }
function toStoredPrice(obj){ return toStoredPriceForMode(feeModeLocal.value, obj) }

/* Tooltip-Formeln */
const pctStr = () => (FEE_PCT * 100).toFixed(1) + '%'
const clampNum = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0)
function tooltipFromGross(g){ const gross=clampNum(g); const pctAmt=+(gross*FEE_PCT).toFixed(2); const fee=+(pctAmt+FEE_FIXED).toFixed(2); const net=+(gross-fee).toFixed(2);
  return ['Modus: inkl. Gebühren',`Verkaufspreis: ${formatPrice(gross)}`,`Gebühren: ${formatPrice(fee)} = ${formatPrice(pctAmt)} (${pctStr()}) + ${formatPrice(FEE_FIXED)}`,`Veranstalter: ${formatPrice(net)}`,`Formel: net = gross - (gross * ${pctStr()} + ${formatPrice(FEE_FIXED)})`].join('\n') }
function tooltipFromNet(n){ const net=clampNum(n); const pctAmt=+(net*FEE_PCT).toFixed(2); const fee=+(pctAmt+FEE_FIXED).toFixed(2); const gross=+(net+fee).toFixed(2);
  return ['Modus: zzgl. Gebühren',`Veranstalter: ${formatPrice(net)}`,`Gebühren: ${formatPrice(fee)} = ${formatPrice(pctAmt)} (${pctStr()}) + ${formatPrice(FEE_FIXED)}`,`Verkaufspreis: ${formatPrice(gross)}`,`Formel: gross = net + (net * ${pctStr()}) + ${formatPrice(FEE_FIXED)}`].join('\n') }
const grossTooltipForCat = (c) => feeModeLocal.value === 'added' ? tooltipFromNet(c._view.net) : tooltipFromGross(c._view.gross)
const netTooltipForCat   = (c) => feeModeLocal.value === 'added' ? tooltipFromNet(c._view.net) : tooltipFromGross(c._view.gross)
const grossTooltipFromValues = (net,gross) => (feeModeLocal.value === 'added' ? tooltipFromNet(net) : tooltipFromGross(gross))
const netTooltipFromValues   = (net,gross) => (feeModeLocal.value === 'added' ? tooltipFromNet(net) : tooltipFromGross(gross))

/* 🔧 Für New-Row-Tooltips im Template */
const grossTooltipForRow = (r) => (feeModeLocal.value === 'added' ? tooltipFromNet(r.net)   : tooltipFromGross(r.gross))
const netTooltipForRow   = (r) => (feeModeLocal.value === 'added' ? tooltipFromNet(r.net)   : tooltipFromGross(r.gross))

/* ============ Categories ============ */
const categories = ref([])
const catMap = computed(() => Object.fromEntries((categories.value||[]).map(c => [Number(c.id), c.name])))
const catName = (id) => catMap.value[Number(id)] || `#${id}`

function primeEditable(c){
  const { net, gross } = deriveFromStoredPrice(c.price)
  return { ...c, _mode:'view', _view:{ net, gross }, _edit:{ name:c.name, stock:c.stock, code:c.code, net, gross } }
}
async function loadCategories(){
  const { data, error } = await listTicketCategories(props.eventId)
  if (error) { toastErr('Fehler beim Laden der Kategorien.'); return }
  categories.value = (data || []).map(primeEditable)
}
function startEdit(c){ c._mode='edit' }
function cancelEdit(c){ c._edit = { name:c.name, stock:c.stock, code:c.code, net:c._view.net, gross:c._view.gross }; c._mode='view' }

function isDirty(c){
  const storedOrig   = Number(c.price || 0)
  const storedEdited = toStoredPriceForMode(lastSavedFeeMode.value, { net:c._edit.net, gross:c._edit.gross })
  if (storedOrig !== storedEdited) return true
  return ['name','stock','code'].some(k => c._edit[k] !== c[k])
}
function availableOf(c){
  const stock = c._mode==='edit' ? (c._edit.stock ?? 0) : (c.stock ?? 0)
  return Math.max(0, Number(stock) - (c.reserved_count||0) - (c.sold_count||0))
}

async function saveExisting(c){
  if (!isDirty(c)) return
  const payload = {}
  for (const k of ['name','stock','code']) if (c._edit[k] !== c[k]) payload[k] = c._edit[k]
  const newStored = toStoredPriceForMode(lastSavedFeeMode.value, { net:c._edit.net, gross:c._edit.gross })
  if (Number(c.price||0) !== newStored) payload.price = newStored
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
  await loadCategories(); toastOk('Kategorie gelöscht.')
}

/* New rows */
const newRows = ref([])
function addNewRow(){
  newRows.value.push({
    name:'', stock:null, code:null,
    net:null, gross:null // Watcher berechnen je nach Modus
  })
}

/* Live-Berechnung: Edit/Neu – nur schreiben, wenn nötig (verhindert Rekursion) */
watch(
  categories,
  (arr) => {
    (arr||[]).forEach(c => {
      if (c._mode!=='edit') return
      if (feeModeLocal.value === 'added'){
        const net = Number(c._edit.net || 0)
        const nextGross = +(net + calcFee(net)).toFixed(2)
        if (Number(c._edit.gross || 0) !== nextGross) c._edit.gross = nextGross
      } else {
        const gross = Number(c._edit.gross || 0)
        let nextNet = +(gross - calcFee(gross)).toFixed(2)
        if (nextNet < 0) nextNet = 0
        if (Number(c._edit.net || 0) !== nextNet) c._edit.net = nextNet
      }
    })
  },
  { deep:true, flush:'post' }
)

watch(
  newRows,
  (arr) => {
    (arr||[]).forEach(r => {
      if (feeModeLocal.value === 'added'){
        const net = Number(r.net || 0)
        const nextGross = +(net + calcFee(net)).toFixed(2)
        if (Number(r.gross || 0) !== nextGross) r.gross = nextGross
      } else {
        const gross = Number(r.gross || 0)
        let nextNet = +(gross - calcFee(gross)).toFixed(2)
        if (nextNet < 0) nextNet = 0
        if (Number(r.net || 0) !== nextNet) r.net = nextNet
      }
    })
  },
  { deep:true, flush:'post' }
)

/* Save-Bar aktiv, wenn Fee-Mode geändert ODER Edits/Neuanlagen vorhanden */
const canSaveAny = computed(() => {
  const createOk = newRows.value.some(r =>
    r.name?.trim() &&
    Number.isFinite(Number(r.stock)) &&
    (feeModeLocal.value==='added' ? Number.isFinite(Number(r.net)) : Number.isFinite(Number(r.gross)))
  )
  const editsOk = categories.value.some(c => c._mode==='edit' && isDirty(c))
  return feeModeDirty.value || createOk || editsOk
})

/* ============ Speichern ============ */
const savingFee = ref(false)

async function saveAll(){
  // 1) Fee-Mode zuerst patchen
  if (feeModeDirty.value){
    try{
      savingFee.value = true
      const next = normalizeFee(feeModeLocal.value)
      const { error } = await patchEvent(props.eventId, { fee_mode: next })
      if (error) throw error

      lastSavedFeeMode.value = next
      feeModeLocal.value     = next
      feeModeDirty.value     = false

      emit('fee-mode-changed', next)
      emit('update:feeMode',   next)

      toastOk('Gebühren-Modus gespeichert.')
      categories.value = (categories.value||[]).map(primeEditable)
    } catch(e){
      feeModeLocal.value = lastSavedFeeMode.value
      feeModeDirty.value = false
      savingFee.value = false
      toastErr('Konnte Gebühren-Modus nicht speichern.')
      return
    } finally {
      savingFee.value = false
    }
  }

  // 2) Edits speichern
  for (const c of categories.value.filter(c => c._mode==='edit' && isDirty(c))) {
    // eslint-disable-next-line no-await-in-loop
    await saveExisting(c)
  }

  // 3) Neue Kategorien anlegen
  const creates = newRows.value
    .filter(r => r.name?.trim() && Number.isFinite(Number(r.stock)) &&
      (feeModeLocal.value==='added' ? Number.isFinite(Number(r.net)) : Number.isFinite(Number(r.gross))))
    .map(r => ({
      name: r.name.trim(),
      stock: Number(r.stock),
      code: r.code || null,
      price: toStoredPriceForMode(lastSavedFeeMode.value, { net:Number(r.net||0), gross:Number(r.gross||0) })
    }))
  if (creates.length){
    const { error } = await addTicketCategories(props.eventId, creates)
    if (error) { toastErr('Fehler beim Hinzufügen.'); return }
    newRows.value = []
    toastOk('Neue Kategorie(n) hinzugefügt.')
  }

  await loadCategories()
  toastOk('Änderungen gespeichert.')
}

/* ============ Bulk JSON ============ */
const bulkText = ref('')
function exampleBulk(){
  bulkText.value = JSON.stringify([
    { code: "GA",  name: "Stehplatz", price: 25, stock: 200 },
    { code: "VIP", name: "VIP",       price: 79, stock: 40  }
  ], null, 2)
}
async function doBulkUpsert(){
  let payload=null; try{ payload=JSON.parse(bulkText.value||'[]') }catch{ toastErr('Ungültiges JSON.'); return }
  if (!Array.isArray(payload) || !payload.length){ toastErr('Leeres Array.'); return }
  const { error } = await bulkUpsertCategories(props.eventId, { categories: payload })
  if (error){ toastErr('Bulk Upsert fehlgeschlagen.'); return }
  await loadCategories(); toastOk('Bulk-Änderungen übernommen.')
}

/* ============ Mint / Holds ============ */
const mint = reactive({ category_id: null, quantity: 1, seat_label_prefix: '', email: '', note: '' })

async function mintNow(){
  if (!mint.category_id || !mint.quantity) return

  const body = {
    category_id: Number(mint.category_id),
    quantity: Number(mint.quantity),
    seat_label_prefix: isGA.value ? null : (mint.seat_label_prefix || null)
  }

  const email = mint.email?.trim()
  if (email) {
    body.assignee_email = email
    if (mint.note?.trim()) body.note = mint.note.trim()
  }

  const { data, error } = await mintTickets(props.eventId, body)
  if (error) { toastErr('Erstellen fehlgeschlagen.'); return }

  tab.value = 'tickets'
  paging.offset = 0
  await Promise.allSettled([loadTickets(), loadSummary(), loadCategories()])

  debug.value = { created: data }
  if (email) {
    toastOk(`Tickets ausgestellt (COMP) an ${email}.`)
  } else {
    toastOk('Tickets erstellt.')
  }

  // Felder zurücksetzen (komfortabel)
  mint.quantity = 1
  mint.seat_label_prefix = ''
  // E-Mail bewusst NICHT löschen, falls nacheinander mehrfach ausgestellt werden soll:
  // mint.email = ''
}


/* GA Hold */
const gaHold = reactive({ category_id: null, qty: 1, ttl_days: 30, email: '' })
const canCreateGAHold = computed(() => !!gaHold.category_id && gaHold.qty>0)
const lastGAHold = reactive({ cart_id: null, reserved_until: null, items: [], assignee_email: null, checkout_url: null })
const gaIssueEmail = ref('')
async function createGAHoldNow(){
  if (!canCreateGAHold.value) return
  const body = { items:[{ category_id:Number(gaHold.category_id), qty:Number(gaHold.qty) }],
                 ttl_days:Number(gaHold.ttl_days || 30), assignee_email: gaHold.email?.trim() || null }
  const { data, error } = await createGAHold(props.eventId, body)
  if (error){ toastErr('GA Hold fehlgeschlagen.'); return }
  Object.assign(lastGAHold, { cart_id:data?.cart_id ?? null, reserved_until:data?.reserved_until ?? null,
                              items:data?.items ?? [], assignee_email:data?.assignee_email ?? null, checkout_url:null })
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk(`GA Hold erstellt (Cart #${lastGAHold.cart_id}).`)
}
async function releaseGAHoldNow(cartId){
  if (!cartId) return
  const { error } = await releaseGAHoldAll(props.eventId, Number(cartId))
  if (error){ toastErr('GA Hold freigeben fehlgeschlagen.'); return }
  Object.assign(lastGAHold, { cart_id:null, reserved_until:null, items:[], assignee_email:null, checkout_url:null })
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk('GA Hold freigegeben.')
}
async function issueGAHoldNow(cartId){
  if (!cartId) return
  const body = {}; const email = gaIssueEmail.value?.trim(); if (email) body.assignee_email = email
  const { data, error } = await issueFromGAHold(props.eventId, Number(cartId), body)
  if (error){ toastErr('GA Hold ausstellen fehlgeschlagen.'); return }
  Object.assign(lastGAHold, { cart_id:null, reserved_until:null, items:[], assignee_email:null, checkout_url:null })
  await Promise.allSettled([loadCategories(), loadSummary(), loadTickets()])
  toastOk('GA Hold ausgestellt (COMP).')
}
async function fetchGaCheckoutLink(cartId){
  if (!cartId) return
  const { data, error } = await holdCheckoutLink(props.eventId, Number(cartId))
  if (error){ toastErr('Checkout-Link laden fehlgeschlagen.'); return }
  lastGAHold.checkout_url = buildCheckoutUrl(data?.path || `/checkout/c/${data?.access_token}`)
  toastOk('Checkout-Link bereit.')
}

/* Seat Holds */
const seatHold = reactive({ category_id: null, labelsRaw: '', ttl_days: 30, email:'' })
const seatsStatusMap = ref({})
const lastHold = reactive({ cart_id: null, reserved_until: null, items: [], assignee_email: null, checkout_url: null })
const canCreateHold = computed(() => {
  const labels = parseLabels(seatHold.labelsRaw)
  if (!seatHold.category_id || !labels.length) return false
  if (!Object.keys(seatsStatusMap.value||{}).length) return false
  return labels.every(lbl => seatsStatusMap.value[lbl] === 'free')
})
function parseLabels(raw){ return (raw||'').split(/[\s,;\n\r]+/).map(s=>s.trim()).filter(Boolean) }
async function checkSeatsStatus(){
  const labels = parseLabels(seatHold.labelsRaw)
  if (!labels.length) { toastInfo('Bitte Seat-Labels angeben.'); return }
  const { data, error } = await seatsStatus(props.eventId, labels)
  if (error){ toastErr('Seat-Status prüfen fehlgeschlagen.'); return }
  seatsStatusMap.value = data?.status || {}
  showToast('secondary','Seat-Status geladen.')
}
async function createSeatHoldNow(){
  const labels = parseLabels(seatHold.labelsRaw)
  if (!seatHold.category_id || !labels.length) return
  const body = { items:[{ category_id:Number(seatHold.category_id), seat_labels: labels }],
                 ttl_days:Number(seatHold.ttl_days || 30), assignee_email: seatHold.email?.trim() || null }
  const { data, error } = await createSeatHold(props.eventId, body)
  if (error){ toastErr('Seat Hold fehlgeschlagen.'); return }
  Object.assign(lastHold, { cart_id:data?.cart_id ?? null, reserved_until:data?.reserved_until ?? null,
                            items:data?.items ?? [], assignee_email:data?.assignee_email ?? null, checkout_url:null })
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk(`Seat Hold erstellt (Cart #${lastHold.cart_id}).`)
}
const holdOps = reactive({ cart_id: null, labels: '' })
async function releaseSeatHoldSome(cartIdOverride=null){
  const cid = Number(cartIdOverride ?? holdOps.cart_id); if (!cid) return
  const labels = parseLabels(holdOps.labels)
  const body = labels.length ? { seat_labels: labels } : {}
  const { data, error } = await releaseSeatHold(props.eventId, cid, body)
  if (error){ toastErr('Seats freigeben fehlgeschlagen.'); return }
  if (cid === lastHold.cart_id) { Object.assign(lastHold, { cart_id:null, items:[], assignee_email:null, checkout_url:null }) }
  debug.value = { release_seats: data }
  await Promise.allSettled([loadCategories(), loadSummary()])
  toastOk('Seat(s) aus Hold freigegeben.')
}
const seatIssueEmail = ref('')
async function issueHoldSeats(cartIdOverride=null){
  const cid = Number(cartIdOverride ?? holdOps.cart_id); if (!cid) return
  const body = {}; const email = seatIssueEmail.value?.trim() || lastHold.assignee_email || null; if (email) body.assignee_email = email
  const { data, error } = await issueFromSeatHold(props.eventId, cid, body)
  if (error){ toastErr('Hold ausstellen fehlgeschlagen.'); return }
  if (cid === lastHold.cart_id) { Object.assign(lastHold, { cart_id:null, items:[], assignee_email:null, checkout_url:null }) }
  debug.value = { issue_seats: data }
  await Promise.allSettled([loadCategories(), loadSummary(), loadTickets()])
  toastOk('Hold ausgestellt (COMP).')
}
async function fetchSeatCheckoutLink(cartId){
  if (!cartId) return
  const { data, error } = await holdCheckoutLink(props.eventId, Number(cartId))
  if (error){ toastErr('Checkout-Link laden fehlgeschlagen.'); return }
  lastHold.checkout_url = buildCheckoutUrl(data?.path || `/checkout/c/${data?.access_token}`)
  toastOk('Checkout-Link bereit.')
}

/* Manuell: Checkout-Link */
const manualCheckout = reactive({ url: null })
async function fetchManualCheckoutLink(){
  const cid = Number(holdOps.cart_id); if (!cid) return
  const { data, error } = await holdCheckoutLink(props.eventId, cid)
  if (error){ toastErr('Checkout-Link laden fehlgeschlagen.'); return }
  manualCheckout.url = buildCheckoutUrl(data?.path || `/checkout/c/${data?.access_token}`)
  toastOk('Checkout-Link bereit.')
}

/* ============ Tickets list ============ */
const tickets = ref([])
const paging = reactive({ limit: 100, offset: 0 })
const filter = reactive({ reserved: null, sold: null })
const onlyMinted = ref(false)
const prevFilter = reactive({ reserved: null, sold: null })
watch(onlyMinted, (v) => {
  if (v) { prevFilter.reserved=filter.reserved; prevFilter.sold=filter.sold; filter.reserved=false; filter.sold=false }
  else  { filter.reserved=prevFilter.reserved; filter.sold=prevFilter.sold }
})
const ticketFilters = reactive({ email: '' })
const ticketSort = reactive({ by: 'created_at', dir: 'desc' })
function applyTicketQuery(){ paging.offset=0; loadTickets() }
async function loadTickets(){
  const q = { limit: Math.min(Number(paging.limit||100), 1000), offset: Math.max(Number(paging.offset||0), 0),
              sort_by: ticketSort.by, sort_dir: ticketSort.dir }
  if (onlyMinted.value) { q.reserved=false; q.sold=false }
  else {
    if (filter.reserved !== null) q.reserved = filter.reserved
    if (filter.sold !== null) q.sold = filter.sold
  }
  if (ticketFilters.email?.trim()) q.buyer_email = ticketFilters.email.trim()
  const { data, error } = await listTickets(props.eventId, q)
  if (error){ toastErr('Fehler beim Laden der Tickets.'); return }
  tickets.value = data || []
}

/* ============ Summary / misc ============ */
const summary = ref(null)
async function loadSummary(){
  const { data, error } = await ticketsSummary(props.eventId)
  if (error){ toastErr('Summary fehlgeschlagen.'); return }
  summary.value = data || null
}
async function publish(){
  const { error } = await publishEvent(props.eventId)
  if (error){ toastErr('Publish fehlgeschlagen.'); return }
  toastOk('Event veröffentlicht.')
}
const tab = ref('categories')
const debug = ref(null)
const debugText = computed(() => {
  const v = debug.value; if (v == null) return ''
  try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2) } catch { return String(v) }
})
async function checkReady(){
  const { data, error } = await saleReadiness(props.eventId)
  if (error){ toastErr('Prüfung fehlgeschlagen.'); return }
  debug.value = { sale_readiness: data ?? 'OK' }
  showToast('secondary','Readiness geprüft.')
}

/* ============ Ticket-Editor / Viewer ============ */
const editor = ref({ open:false, ticketId:null, ticket:null, newSeat:'', seatStatus:null, newSeatOk:false })
function openEditor(row=null){ editor.value.open=true; editor.value.ticketId = row ? row.id : null; editor.value.ticket = row || null; editor.value.newSeat=''; editor.value.seatStatus=null; editor.value.newSeatOk=false }
function closeEditor(){ editor.value.open=false }
function findTicketInLocal(id){ id=Number(id); return (tickets.value||[]).find(t => Number(t.id)===id) || null }
async function loadTicketIntoEditor(){
  if (!editor.value.ticketId) return
  const t=findTicketInLocal(editor.value.ticketId); if (t){ editor.value.ticket=t; return }
  await loadTickets(); editor.value.ticket=findTicketInLocal(editor.value.ticketId)
  if (!editor.value.ticket) toastInfo('Ticket nicht gefunden. Filter ggf. anpassen.', 'Info')
}
async function checkEditorSeatStatus(){
  editor.value.seatStatus=null; editor.value.newSeatOk=false
  if (!editor.value.ticket || !editor.value.newSeat?.trim()) return
  const labels=[editor.value.newSeat.trim()]
  const { data, error } = await seatsStatus(props.eventId, labels)
  if (error){ toastErr('Seat-Status prüfen fehlgeschlagen.'); return }
  editor.value.seatStatus = data?.status?.[labels[0]] || null
  editor.value.newSeatOk = (editor.value.seatStatus==='free')
  showToast(editor.value.newSeatOk ? 'success':'warning', `Neuer Sitz: ${editor.value.seatStatus || 'unbekannt'}`)
}
async function doSwapSeatFromEditor(){
  if (!editor.value.ticket || !editor.value.newSeatOk) return
  const body = { ticket_id:Number(editor.value.ticket.id), new_seat_label: editor.value.newSeat.trim() }
  const { data, error } = await swapSeat(props.eventId, body)
  if (error){ toastErr('Seat-Swap fehlgeschlagen.'); return }
  debug.value = { swap: data }
  await loadTickets()
  const updated=findTicketInLocal(editor.value.ticket.id); if (updated) editor.value.ticket=updated
  toastOk('Sitzplatz getauscht.')
}
const viewer = ref({ open:false, ticket:null })
function openViewer(row){ viewer.value={ open:true, ticket:row } }
function closeViewer(){ viewer.value.open=false }

// (A) Viewer: Escape schließt Modal
function onEsc(e){
  if (e.key === 'Escape' && viewer.value?.open) closeViewer()
}
onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

// (B) Viewer: weitere, optionale Felder hübsch rendern (alles was wir kennen, filtern wir aus)
const viewerExtra = computed(() => {
  const t = viewer.value?.ticket || null
  if (!t || typeof t !== 'object') return []
  const hide = new Set(['id','category_id','category_name','buyer_email','seat_label','reserved','sold','created_at','updated_at','order_id'])
  return Object.entries(t)
    .filter(([k,v]) => !hide.has(k) && v != null && v !== '')
    .map(([k,v]) => ({ k, v: String(v) }))
})


/* ============ Utils (formatting) ============ */
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v); if (isNaN(d)) return '—'
  try { return d.toLocaleString('de-DE', { dateStyle:'medium', timeStyle:'short' }) }
  catch {
    const pad=n=>String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}
function formatPrice(p){ const n = Number(p); if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR' }).format(n) }

/* ============ Initial Load & Reactions ============ */
async function loadAll(){ await Promise.allSettled([loadCategories(), loadTickets(), loadSummary()]) }
onMounted(() => { loadAll() })
watch(() => props.eventId, () => { loadAll() })

/* (Optional) CSV-Export Placeholder) */
function exportCsv(){ toastInfo('CSV-Export ist hier nur ein Platzhalter. Implementiere bei Bedarf.') }
</script>

<style scoped>
.table-row-new td { background: var(--bs-light); }
</style>
