<!-- components/business/workspaces/locations/LocationForm.vue -->
<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row g-4">

      <!-- 1) Basis -->
      <div class="col-12">
        <h5 class="mb-2">Basis</h5>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Name<span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              v-model.trim="form.name"
              :class="{ 'is-invalid': v.name }"
              required
              placeholder="z. B. Stadthalle West"
            />
            <div class="form-text">Offizieller Venue-Name (eindeutig innerhalb derselben Stadt im Workspace).</div>
            <div v-if="v.name" class="invalid-feedback">{{ v.name }}</div>
          </div>

          <div class="col-12 col-md-8">
            <label class="form-label">Adresse</label>
            <input type="text" class="form-control" v-model.trim="form.address" placeholder="Straße Hausnr." />
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label">PLZ</label>
            <input type="text" class="form-control" v-model.trim="form.postal_code" placeholder="z. B. 10115" />
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Stadt</label>
            <input type="text" class="form-control" v-model.trim="form.city" placeholder="z. B. Berlin" />
            <div class="form-text">Wichtig für die Duplikatsprüfung (Name + Stadt).</div>
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label">Land (ISO-2)</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="form.country"
              maxlength="2"
              @input="form.country = form.country?.toUpperCase() || ''"
              placeholder="DE, AT, CH …"
            />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">E-Mail</label>
            <input type="email" class="form-control" v-model.trim="form.email" placeholder="name@domain.tld" />
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label">Telefon</label>
            <input type="tel" class="form-control" v-model.trim="form.phone" placeholder="+49…" />
            <div class="form-text">Server normalisiert auf „+” und Ziffern.</div>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label">Website</label>
            <input type="url" class="form-control" v-model.trim="form.website" placeholder="https://…" />
            <div class="form-text">„https://” wird falls nötig ergänzt.</div>
          </div>
        </div>
      </div>

      <!-- 2) Buchung -->
      <div class="col-12">
        <h5 class="mb-2">Buchung</h5>
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-4">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="booking_enabled" v-model="form.booking_enabled">
              <label class="form-check-label" for="booking_enabled">Buchbar</label>
            </div>
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label">Buchungs-Hinweise</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="form.booking_notes"
              placeholder="z. B. nur Wochenenden, Mindestmiete 4 Std., Anfragebestätigung erforderlich…"
            />
          </div>
        </div>
      </div>

      <!-- 3) Kapazität & Fläche -->
      <div class="col-12">
        <h5 class="mb-2">Kapazität & Fläche</h5>
        <div class="row g-3">
          <div class="col-6 col-md-3">
            <label class="form-label">Fläche (m²)</label>
            <input type="number" min="0" class="form-control" v-model.number="form.area_sqm" />
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Sitzplätze (min)</label>
            <input type="number" min="0" class="form-control" v-model.number="form.capacity_seated_min" />
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Sitzplätze (max)</label>
            <input type="number" min="0" class="form-control" v-model.number="form.capacity_seated_max" />
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Stehend (max)</label>
            <input type="number" min="0" class="form-control" v-model.number="form.capacity_standing_max" />
          </div>

          <div class="col-6 col-md-3">
            <label class="form-label">WCs</label>
            <input type="number" min="0" class="form-control" v-model.number="form.toilets_count" />
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Parkplätze</label>
            <input type="number" min="0" class="form-control" v-model.number="form.parking_count" />
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Räume</label>
            <input type="number" min="0" class="form-control" v-model.number="form.rooms_count" />
          </div>
        </div>
      </div>

      <!-- 4) Kategorien -->
      <div class="col-12">
        <h5 class="mb-2">Kategorien</h5>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="c in categories" :key="c.id">
            <input class="btn-check" type="checkbox" :id="`cat-${c.id}`" :value="c.id" v-model="form.categories" />
            <label class="btn btn-sm" :class="toggleBtnClass(form.categories, c.id)" :for="`cat-${c.id}`" :title="c.id">
              <i v-if="isSelected(form.categories, c.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="c.meta?.icon" :class="`bi ${c.meta.icon} me-1`"></i>
              {{ c.label }}
            </label>
          </template>
        </div>
        <div class="form-text">Wähle passende Events (für Suche & Filter).</div>
      </div>

      <!-- 5) Ausstattung -->
      <div class="col-12">
        <h5 class="mb-2">Ausstattung</h5>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="a in amenities" :key="a.id">
            <input class="btn-check" type="checkbox" :id="`amn-${a.id}`" :value="a.id" v-model="form.amenities" />
            <label class="btn btn-sm" :class="toggleBtnClass(form.amenities, a.id)" :for="`amn-${a.id}`" :title="a.id">
              <i v-if="isSelected(form.amenities, a.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="a.meta?.icon" :class="`bi ${a.meta.icon} me-1`"></i>
              {{ a.label }}
            </label>
          </template>
        </div>
      </div>

      <!-- 6) Technik -->
      <div class="col-12">
        <h5 class="mb-2">Technik</h5>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="t in tech" :key="t.id">
            <input class="btn-check" type="checkbox" :id="`tech-${t.id}`" :value="t.id" v-model="form.tech" />
            <label class="btn btn-sm" :class="toggleBtnClass(form.tech, t.id)" :for="`tech-${t.id}`" :title="t.id">
              <i v-if="isSelected(form.tech, t.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="t.meta?.icon" :class="`bi ${t.meta.icon} me-1`"></i>
              {{ t.label }}
            </label>
          </template>
        </div>
      </div>

      <!-- 7) Services -->
      <div class="col-12">
        <h5 class="mb-2">Catering & Services</h5>
        <div class="d-flex flex-wrap gap-2">
          <template v-for="s in services" :key="s.id">
            <input class="btn-check" type="checkbox" :id="`svc-${s.id}`" :value="s.id" v-model="form.services" />
            <label class="btn btn-sm" :class="toggleBtnClass(form.services, s.id)" :for="`svc-${s.id}`" :title="s.id">
              <i v-if="isSelected(form.services, s.id)" class="bi bi-check-lg me-1"></i>
              <i v-else-if="s.meta?.icon" :class="`bi ${s.meta.icon} me-1`"></i>
              {{ s.label }}
            </label>
          </template>
        </div>
        <div class="form-text">Hinweis: Preise gehören unten in „Preise &amp; Tarife“.</div>
      </div>

      <!-- 8) Regeln -->
      <div class="col-12">
        <h5 class="mb-2">Regeln</h5>
        <div class="row g-3">
          <div class="col-6 col-md-4">
            <label class="form-label">Sperrstunde</label>
            <input type="time" class="form-control" v-model="form.curfew_time" />
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label">Mindestalter</label>
            <input type="number" min="0" class="form-control" v-model.number="form.min_age" />
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label">Max. Lautstärke (dB)</label>
            <input type="number" min="0" class="form-control" v-model.number="form.max_noise_level_db" />
          </div>

          <div class="col-12">
            <div class="d-flex flex-wrap gap-2">
              <template v-for="r in rules" :key="r.id">
                <input class="btn-check" type="checkbox" :id="`rule-${r.id}`" :value="r.id" v-model="form.rules" />
                <label class="btn btn-sm" :class="toggleBtnClass(form.rules, r.id)" :for="`rule-${r.id}`" :title="r.id">
                  <i v-if="isSelected(form.rules, r.id)" class="bi bi-check-lg me-1"></i>
                  <i v-else-if="r.meta?.icon" :class="`bi ${r.meta.icon} me-1`"></i>
                  {{ r.label }}
                </label>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 9) Verfügbarkeit -->
      <div class="col-12">
        <h5 class="mb-2">Verfügbarkeit</h5>
        <textarea class="form-control" rows="2" v-model.trim="form.availability_notes"
                  placeholder="z. B. bevorzugt Fr–So, keine Feiertage, Vorlauf min. 14 Tage…"></textarea>
      </div>

      <!-- 10) Medien -->
      <div class="col-12">
        <h5 class="mb-2">Medien</h5>
        <label class="form-label">Bild-URLs (kommagetrennt)</label>
        <input type="text" class="form-control" v-model.trim="imagesInput" placeholder="https://…/1.jpg, https://…/2.jpg" />
        <div class="form-text">Einfacher Start – später durch Upload ersetzen.</div>
        <div class="mt-2 d-flex flex-wrap gap-2">
          <img v-for="(u, i) in form.image_urls" :key="i" :src="u" alt="" style="height:60px" class="rounded border" />
        </div>
      </div>

      <!-- 11) Preise & Tarife (NETTO-Eingabe, Brutto-Vorschau) -->
      <div class="col-12">
        <h5 class="mb-2">Preise & Tarife</h5>

        <div class="alert alert-info small">
          <div class="fw-semibold mb-1"><i class="bi bi-info-circle me-1"></i>So wird gerechnet</div>
          <ul class="mb-0 ps-3">
            <li><strong>Alle Eingaben NETTO</strong> (zzgl. MwSt.).</li>
            <li><strong>Tagespauschale</strong> je Kalendertag (optional inkl. X Std.).</li>
            <li><strong>Staffelrabatte</strong> ab Mindesttagen; es gilt die höchste passende Staffel.</li>
            <li><strong>Reinigung</strong> einmalig; <strong>Kaution</strong> wird nicht in den Angebotspreis addiert.</li>
            <li><strong>Deutschland:</strong> MwSt. <strong>automatisch 19 %</strong> bei Land = DE (manuell überschreibbar).</li>
          </ul>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label class="form-label">Tagespauschale (netto)</label>
            <div class="input-group">
              <span class="input-group-text">€</span>
              <input type="number" min="0" step="1" class="form-control" v-model.number="form.day_rate_base" placeholder="z. B. 1200" />
              <span class="input-group-text">netto</span>
            </div>
            <div class="form-text">Preis pro Kalendertag (netto).</div>
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Std. inkl./Tag</label>
            <input type="number" min="0" step="1" class="form-control" v-model.number="form.day_rate_includes_hours" placeholder="z. B. 8" />
            <div class="form-text">Inklusive Stunden pro Tag (optional).</div>
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Überstunde (netto)</label>
            <div class="input-group">
              <span class="input-group-text">€</span>
              <input type="number" min="0" step="1" class="form-control" v-model.number="form.extra_hour_rate" placeholder="z. B. 150" />
              <span class="input-group-text">netto</span>
            </div>
            <div class="form-text">Preis je zusätzlicher Stunde pro Tag (optional).</div>
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Wochenend-Aufschlag</label>
            <div class="input-group">
              <input type="number" min="0" step="1" class="form-control" v-model.number="form.weekend_markup_percent" placeholder="z. B. 10" />
              <span class="input-group-text">%</span>
            </div>
            <div class="form-text">Aufschlag für Sa/So (nicht in dieser Vorschau berücksichtigt).</div>
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Reinigungspauschale (netto)</label>
            <div class="input-group">
              <span class="input-group-text">€</span>
              <input type="number" min="0" step="1" class="form-control" v-model.number="form.cleaning_fee" placeholder="z. B. 120" />
              <span class="input-group-text">netto</span>
            </div>
            <div class="form-text">Einmalig pro Buchung.</div>
          </div>

          <div class="col-6 col-md-4">
            <label class="form-label">Kaution (netto)</label>
            <div class="input-group">
              <span class="input-group-text">€</span>
              <input type="number" min="0" step="1" class="form-control" v-model.number="form.deposit" placeholder="z. B. 500" />
              <span class="input-group-text">netto</span>
            </div>
            <div class="form-text">Wird hinterlegt, nicht im Angebotspreis addiert.</div>
          </div>

          <!-- MwSt.: automatisch 19 % bei DE, sonst manuell -->
          <div class="col-12 col-md-4">
            <label class="form-label">MwSt.</label>
            <template v-if="isDE && !overrideVat">
              <div class="form-control-plaintext">19 % (automatisch für DE)</div>
              <button type="button" class="btn btn-link p-0 small" @click="overrideVat = true">
                Erweitert: MwSt. manuell setzen
              </button>
            </template>
            <template v-else>
              <div class="input-group">
                <input type="number" min="0" step="1" class="form-control" v-model.number="form.vat_percent" placeholder="z. B. 19" />
                <span class="input-group-text">%</span>
              </div>
              <div class="form-text" v-if="isDE">Du überschreibst den automatischen 19 %-Satz.</div>
            </template>
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label d-flex align-items-center justify-content-between">
            <span>Staffelrabatte (ab X Tagen ⇒ Y %)</span>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addDiscountRow">
              <i class="bi bi-plus-lg me-1"></i> Zeile hinzufügen
            </button>
          </label>

          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead>
                <tr class="text-muted">
                  <th style="width:160px">ab Tagen</th>
                  <th style="width:180px">Rabatt (%)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!Array.isArray(form.multi_day_discounts) || !form.multi_day_discounts.length">
                  <td colspan="3" class="text-muted">Noch keine Staffel definiert. Beispiel: ab 2 Tagen 10 %.</td>
                </tr>
                <tr v-for="(row, idx) in form.multi_day_discounts" :key="idx">
                  <td><input type="number" min="2" step="1" class="form-control form-control-sm" v-model.number="row.min_days" /></td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input type="number" min="0" max="100" step="1" class="form-control" v-model.number="row.percent_off" />
                      <span class="input-group-text">%</span>
                    </div>
                  </td>
                  <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeDiscountRow(idx)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Preisvorschau -->
          <div class="row g-2 g-md-3 mt-2">
            <div class="col-12 col-md-5">
              <label class="form-label mb-1">Preisvorschau: Tage</label>
              <input type="number" min="1" step="1" class="form-control" v-model.number="previewDays" />
              <!-- Rabatt-Hinweis (ohne Durchstreichung hier) -->
              <div v-if="activeDiscount" class="mt-1">
                <span class="badge bg-success">-{{ activeDiscount.percent_off }}% ab {{ activeDiscount.min_days }} Tagen</span>
              </div>
              <div class="form-text">Ohne Wochenend-Verteilung & Überstunden.</div>
            </div>

            <div class="col-12 col-md-7 d-flex align-items-end">
              <div class="alert alert-light border w-100 mb-0">
                <div class="small text-muted">Voraussichtliche Summe</div>

                <!-- Netto: clean -->
                <div class="mb-1">
                  <span class="badge bg-secondary me-2">Netto</span>
                  € {{ previewNet }}
                </div>

                <!-- Brutto: einmal durchgestrichener Vorher-Betrag -->
                <div>
                  <span class="badge bg-dark me-2">Brutto</span>
                  <span v-if="grossSavings > 0" class="text-muted small me-2" style="text-decoration: line-through;">
                    € {{ money(beforeDiscountGrossTotal) }}
                  </span>
                  <strong>€ {{ previewGross }}</strong>
                  <span class="small text-muted ms-2" v-if="effectiveVatPct">inkl. {{ effectiveVatPct }} % MwSt.</span>
                  <span class="small text-muted ms-2" v-else>ohne MwSt.</span>
                  <span v-if="grossSavings > 0" class="text-success small ms-2">– € {{ money(grossSavings) }} gespart</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Freitexte -->
        <div class="mt-3">
          <label class="form-label">Preis-Hinweise</label>
          <textarea class="form-control" rows="2" v-model.trim="form.pricing_notes"
                    placeholder="z. B. Tagesrate gilt bis 22:00, danach Überstunden laut Tarif; Technik/Security auf Anfrage."></textarea>
        </div>

        <div class="mt-3">
          <label class="form-label">Stornobedingungen</label>
          <textarea class="form-control" rows="2" v-model.trim="form.cancellation_policy"
                    placeholder="z. B. bis 14 Tage vorher kostenfrei, danach 50 %, ab 7 Tage 100 %."></textarea>
        </div>
      </div>

      <!-- 12) Status / Verifikation -->
      <div class="col-12">
        <h5 class="mb-2">Status</h5>
        <div class="row g-3">
          <div class="col-6">
            <select class="form-select" v-model="form.status">
              <option :value="null">—</option>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div class="col-6">
            <select class="form-select" v-model="form.verification_status">
              <option :value="null">—</option>
              <option value="none">none</option>
              <option value="pending">pending</option>
              <option value="verified">verified</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="col-12">
        <div class="d-flex align-items-center gap-3 mt-3">
          <span
            class="badge"
            :class="dirty ? 'bg-warning text-dark' : 'bg-light text-muted border'"
            title="Zeigt an, ob es ungespeicherte Änderungen gibt"
          >
            {{ dirty ? 'Änderungen nicht gespeichert' : 'Keine Änderungen' }}
          </span>
          <span class="small text-muted">ID: {{ locationId }}</span>
        </div>

        <div v-if="errorMsg" class="alert alert-danger mt-3">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
          {{ errorMsg }}
          <div v-if="errorFields?.length" class="small mt-1">
            Felder: {{ errorFields.join(', ') }}
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <button class="btn btn-outline-secondary" type="button" @click="$emit('reset')" :disabled="!dirty">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Änderungen verwerfen
          </button>
          <button class="btn btn-primary" :disabled="submitting || !dirty">
            <span v-if="!submitting"><i class="bi bi-check-lg me-1"></i> Speichern</span>
            <span v-else><i class="bi bi-hourglass-split me-1"></i> Speichern…</span>
          </button>
        </div>
      </div>

    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  form: { type: Object, required: true },
  categories: { type: Object, required: true },
  amenities: { type: Object, required: true },
  services: { type: Object, required: true },
  tech: { type: Object, required: true },
  rules: { type: Object, required: true },

  statusBadgeClass: { type: [String, Object], default: '' },
  verificationBadgeClass: { type: [String, Object], default: '' },
  selectedCategoryBadges: { type: Array, default: () => [] },

  v: { type: Object, required: true },
  submitting: { type: Boolean, default: false },
  dirty: { type: Boolean, default: false },
  errorMsg: { type: String, default: '' },
  errorFields: { type: Array, default: () => [] },
  locationId: { type: Number, default: null },
})

defineEmits(['submit', 'reset', 'delete'])

// helpers (local)
function isSelected (arr, id) { return Array.isArray(arr) && arr.includes(id) }
function toggleBtnClass (arr, id) { return isSelected(arr, id) ? 'btn-success' : 'btn-outline-secondary' }

const imagesInput = computed({
  get: () => (props.form.image_urls || []).join(', '),
  set: (val) => {
    props.form.image_urls = (val || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
})

/* ================== Preise & Tarife (NETTO-only) ================== */

const isDE = computed(() => (props.form.country || '').toUpperCase() === 'DE')
const overrideVat = ref(false)

// Effektiver MwSt-Satz: DE = 19 %, sonst Eingabe (oder 0)
const effectiveVatPct = computed(() => {
  if (isDE.value && !overrideVat.value) return 19
  return Number(props.form.vat_percent) || 0
})
const vatFactor = computed(() => 1 + (effectiveVatPct.value / 100))

// NETTO -> BRUTTO
function toGross (netValue) {
  const v = Number(netValue) || 0
  return effectiveVatPct.value ? v * vatFactor.value : v
}

// Geldformat
function money (v) {
  const n = Number(v) || 0
  return n.toFixed(2)
}

// Rabatt-Tabelle pflegen
function addDiscountRow () {
  if (!Array.isArray(props.form.multi_day_discounts)) props.form.multi_day_discounts = []
  props.form.multi_day_discounts.push({ min_days: 2, percent_off: 10 })
}
function removeDiscountRow (idx) {
  props.form.multi_day_discounts.splice(idx, 1)
}

// Aktive Staffel anhand Tage
const previewDays = ref(1)
const activeDiscount = computed(() => {
  const tiers = Array.isArray(props.form.multi_day_discounts)
    ? [...props.form.multi_day_discounts]
        .filter(t => Number(t?.min_days) >= 1 && Number(t?.percent_off) >= 0)
    : []
  const days = Number(previewDays.value) || 0
  if (!days || !tiers.length) return null
  return tiers
    .filter(t => days >= Number(t.min_days))
    .sort((a,b) => Number(b.percent_off) - Number(a.percent_off))[0] || null
})

// Eingaben (alle NETTO)
const dayRateNet     = computed(() => Number(props.form.day_rate_base) || 0)
const cleaningNet    = computed(() => Number(props.form.cleaning_fee) || 0)

// Zwischensummen NETTO
const days           = computed(() => Number(previewDays.value) || 0)
const subtotalDaysNet       = computed(() => dayRateNet.value * days.value)
const discountedDaysNet     = computed(() => {
  const pct = activeDiscount.value ? Number(activeDiscount.value.percent_off) : 0
  return subtotalDaysNet.value * (1 - pct / 100)
})

// Totale NETTO
const beforeDiscountNetTotal = computed(() => subtotalDaysNet.value + cleaningNet.value)
const afterDiscountNetTotal  = computed(() => discountedDaysNet.value + cleaningNet.value)

// Totale BRUTTO
const beforeDiscountGrossTotal = computed(() => toGross(beforeDiscountNetTotal.value))
const afterDiscountGrossTotal  = computed(() => toGross(afterDiscountNetTotal.value))

// Anzeige
const previewNet   = computed(() => money(afterDiscountNetTotal.value))
const previewGross = computed(() => money(afterDiscountGrossTotal.value))

// Ersparnis (nur für Anzeige / Brutto)
const grossSavings = computed(() => Math.max(0, beforeDiscountGrossTotal.value - afterDiscountGrossTotal.value))
</script>

<style scoped>
/* kompakte, klickbare Chips */
.btn.btn-sm { border-radius: .5rem; }
.btn-check + .btn { margin-right: .25rem; margin-bottom: .25rem; }
</style>
